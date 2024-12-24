import * as vscode from 'vscode';
// import { customREPLCommandSnippet } from './evaluate';
// import { ReplConnectSequence } from './nrepl/connectSequence';
// import { PrettyPrintingOptions } from './printer';
// import { parseEdn } from '../out/cljs-lib/cljs-lib';
// import { getProjectConfig } from './state';
import _ = require('lodash');
// import { isDefined } from './utilities';

// const REPL_FILE_EXT = 'calva-repl';
const KEYBINDINGS_ENABLED_CONFIG_KEY = 'janet.keybindingsEnabled';
const KEYBINDINGS_ENABLED_CONTEXT_KEY = 'janet:keybindingsEnabled';

// type ReplSessionType = 'clj' | 'cljs';

// include the 'file' and 'untitled' to the
// document selector. All other schemes are
// not known and therefore not supported.
const documentSelector = [
  { scheme: 'file', language: 'janet' },
  { scheme: 'jar', language: 'janet' },
  { scheme: 'untitled', language: 'janet' },
];

/**
 * Trims EDN alias and profile names from any surrounding whitespace or `:` characters.
 * This in order to free the user from having to figure out how the name should be entered.
 * @param  {string} name
 * @return {string} The trimmed name
 */
function _trimAliasName(name: string): string {
  return name.replace(/^[\s,:]*/, '').replace(/[\s,:]*$/, '');
}

// async function readEdnWorkspaceConfig(uri?: vscode.Uri) {
//   try {
//     let resolvedUri: vscode.Uri;
//     const configPath = state.resolvePath('.calva/config.edn');

//     if (isDefined(uri)) {
//       resolvedUri = uri;
//     } else if (isDefined(configPath)) {
//       resolvedUri = vscode.Uri.file(configPath);
//     } else {
//       throw new Error('Expected a uri to be passed in or a config to exist at .calva/config.edn');
//     }
//     const data = await vscode.workspace.fs.readFile(resolvedUri);
//     return addEdnConfig(new TextDecoder('utf-8').decode(data));
//   } catch (error) {
//     return error;
//   }
// }

// function mergeSnippets(
//   oldSnippets: customREPLCommandSnippet[],
//   newSnippets: customREPLCommandSnippet[]
// ): customREPLCommandSnippet[] {
//   return newSnippets.concat(
//     _.reject(
//       oldSnippets,
//       (item) => _.findIndex(newSnippets, (newItem) => item.name === newItem.name) !== -1
//     )
//   );
// }

/**
 * Saves the EDN config in the state to be merged into the actual vsconfig.
 * Currently only `:customREPLCommandSnippets` is supported and the `:snippet` has to be a string.
 * @param {string} data a string representation of a clojure map
 * @returns an error of one was thrown
 */
// function addEdnConfig(data: string) {
//   try {
//     const parsed = parseEdn(data);
//     const old = getProjectConfig();

//     state.setProjectConfig({
//       customREPLCommandSnippets: mergeSnippets(
//         old?.customREPLCommandSnippets ?? [],
//         parsed?.customREPLCommandSnippets ?? []
//       ),
//       customREPLHoverSnippets: mergeSnippets(
//         old?.customREPLHoverSnippets ?? [],
//         parsed?.customREPLHoverSnippets ?? []
//       ),
//     });
//   } catch (error) {
//     return error;
//   }
// }
// const watcher = vscode.workspace.createFileSystemWatcher(
//   '**/.calva/**/config.edn',
//   false,
//   false,
//   false
// );

// TODO find a way to validate the configs
function getConfig() {
  const configOptions = vscode.workspace.getConfiguration('janet');
  const pareditOptions = vscode.workspace.getConfiguration('janet.paredit');
  const lspOptions = vscode.workspace.getConfiguration('janet.lsp');

  return {
    format: configOptions.get('formatOnSave'),
    strictPreventUnmatchedClosingBracket: pareditOptions.get<boolean>(
      'strictPreventUnmatchedClosingBracket'
    ),
    projectRootsSearchExclude: configOptions.get<string[]>('projectRootsSearchExclude', []),
    useLiveShare: configOptions.get<boolean>('useLiveShare'),
    definitionProviderPriority: configOptions.get<string[]>('definitionProviderPriority'),

    autoStartREPL: configOptions.get<boolean>('autoStartRepl'),

    // Janet LSP
    customJanetLspCommand: lspOptions.get<string>('customJanetLspCommand'),
    dontDiscoverJpmTree: lspOptions.get<boolean>('dontDiscoverJpmTree'),
    enableLsp: lspOptions.get<boolean>('enableLsp'),
    debugLsp: lspOptions.get<boolean>('debugLsp'),
    loggingDetailConsole: lspOptions.get<string>('loggingdetail.console'),
    loggingDetailFile: lspOptions.get<string>('loggingdetail.file'),
    lspConsolePort: lspOptions.get<string>('consolePort')
  };
}

export {
  // readEdnWorkspaceConfig,
  // addEdnConfig,
  // REPL_FILE_EXT,
  KEYBINDINGS_ENABLED_CONFIG_KEY,
  KEYBINDINGS_ENABLED_CONTEXT_KEY,
  documentSelector,
  // ReplSessionType,
  getConfig,
};
