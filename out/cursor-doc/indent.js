"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndent = exports.collectIndents = void 0;
const _ = require("lodash");
const whitespace = new Set(['ws', 'comment', 'eol']);
const indentRules = {
    '#"^\\w"': [['inner', 0]],
};
/**
 * Analyses the text before position in the document, and returns a list of enclosing expression information with
 * various indent information, for use with getIndent()
 *
 * @param document The document to analyse
 * @param position The position (as [row, col] into the document to analyse from)
 * @param maxDepth The maximum depth upwards from the expression to search.
 * @param maxLines The maximum number of lines above the position to search until we bail with an imprecise answer.
 */
function collectIndents(document, offset, config, maxDepth = 3, maxLines = 20) {
    const cursor = document.getTokenCursor(offset);
    cursor.backwardWhitespace();
    let argPos = 0;
    const startLine = cursor.line;
    let exprsOnLine = 0;
    let lastLine = cursor.line;
    let lastIndent = 0;
    const indents = [];
    const rules = config['cljfmt-options']['indents'];
    do {
        // console.log("If not cursor.backwardSexp, go into If block ", !cursor.backwardSexp())
        if (!cursor.backwardSexp()) {
            // this needs some work..
            // console.log("Set prevToken to ", cursor.getPrevToken())
            const prevToken = cursor.getPrevToken();
            if (prevToken.type == 'open' && prevToken.offset <= 1) {
                maxDepth = 0; // treat an sexpr starting on line 0 sensibly.
            }
            // skip past the first item and record the indent of the first item on the same line if there is one.
            const nextCursor = cursor.clone();
            nextCursor.forwardSexp();
            nextCursor.forwardWhitespace();
            // if the first item of this list is a a function, and the second item is on the same line, indent to that second item. otherwise indent to the open paren.
            const isList = prevToken.type === 'open' && prevToken.raw.endsWith('(');
            const firstItemIdent = ['id', 'kw'].includes(cursor.getToken().type) &&
                nextCursor.line == cursor.line &&
                !nextCursor.atEnd() &&
                isList
                ? nextCursor.rowCol[1]
                : cursor.rowCol[1];
            // console.log("firstItemIdent ", firstItemIdent);
            const token = cursor.getToken().raw;
            const startIndent = cursor.rowCol[1];
            if (!cursor.backwardUpList()) {
                break;
            }
            const pattern = isList &&
                _.find(_.keys(rules), (pattern) => pattern === token || testCljRe(pattern, token));
            const indentRule = pattern ? rules[pattern] : [];
            indents.unshift({
                first: token,
                rules: indentRule,
                argPos,
                exprsOnLine,
                startIndent,
                firstItemIdent,
            });
            argPos = 0;
            exprsOnLine = 1;
        }
        if (cursor.line != lastLine) {
            const head = cursor.clone();
            head.forwardSexp();
            head.forwardWhitespace();
            if (!head.atEnd()) {
                lastIndent = head.rowCol[1];
                exprsOnLine = 0;
                lastLine = cursor.line;
            }
        }
        if (whitespace.has(cursor.getPrevToken().type)) {
            argPos++;
            exprsOnLine++;
        }
    } while (!cursor.atStart() &&
        Math.abs(startLine - cursor.line) < maxLines &&
        indents.length < maxDepth);
    if (!indents.length) {
        indents.push({
            argPos: 0,
            first: null,
            rules: [],
            exprsOnLine: 0,
            startIndent: lastIndent >= 0 ? lastIndent : 0,
            firstItemIdent: lastIndent >= 0 ? lastIndent : 0,
        });
    }
    // console.log("src/cursor-doc/indent.ts/collectIndents ", indents);
    return indents;
}
exports.collectIndents = collectIndents;
const testCljRe = (re, str) => {
    const matches = re.match(/^#"(.*)"$/);
    return matches && RegExp(matches[1]).test(str);
};
/** Returns the expected newline indent for the given position, in characters. */
function getIndent(document, offset, config) {
    if (!config) {
        config = {
            'cljfmt-options': {
                indents: indentRules,
            },
        };
    }
    const state = collectIndents(document, offset, config);
    // now find applicable indent rules
    let indent = -1;
    const thisBlock = state[state.length - 1];
    if (!state.length) {
        return 0;
    }
    for (let pos = state.length - 1; pos >= 0; pos--) {
        for (const rule of state[pos].rules) {
            if (rule[0] == 'inner') {
                if (pos + rule[1] == state.length - 1) {
                    if (rule.length == 3) {
                        if (rule[2] > thisBlock.argPos) {
                            indent = thisBlock.startIndent + 1;
                        }
                    }
                    else {
                        indent = thisBlock.startIndent + 1;
                    }
                }
            }
            else if (rule[0] == 'block' && pos == state.length - 1) {
                if (thisBlock.exprsOnLine <= rule[1]) {
                    if (thisBlock.argPos >= rule[1]) {
                        indent = thisBlock.startIndent + 1;
                    }
                }
                else {
                    indent = thisBlock.firstItemIdent;
                }
            }
        }
    }
    if (indent == -1) {
        // no indentation styles applied, so use default style.
        if (thisBlock.exprsOnLine > 0) {
            indent = thisBlock.firstItemIdent;
        }
        else {
            indent = thisBlock.startIndent;
        }
    }
    return indent;
}
exports.getIndent = getIndent;
//# sourceMappingURL=indent.js.map