# Change Log

## v1.1.10 (2025-09-04)

- Project
  - Version bump to v1.1.10; changes introduced in v1.1.9 promoted to full release

## v1.1.9 (2024-12-22, Pre-release)

- Extension
  - New feature: Auto-activate extension when `project.janet` is detected in project tree
  - New feature: Setting to auto-start REPL on extension activation
- Settings
  - New option to enable Debug flag on launch
  - New options to set LSP Log level and Log to File Level (on launch and on change)
  - New option to set Console port on launch
- Janet LSP
  - Update to v0.0.10 
    - Logging 
      - Rotate log files and overwrite eventually to avoid indefinite log file size
      - Adjusted some log levels
    - New methods
      - `enableDebug` and `disableDebug` - Allow clients to set `(dyn :debug)` while running
      - `setLogLevel` and `setLogToFileLevel` - Allow clients to change debug level to console and file
  - Related commands 
    - New commands to Enable and Disable Debug
    - New commands to set Log Level and Log to File Level
    - New command to Restart LSP

## v1.1.8 (2024-12-20)

- Changes in v1.1.7 promoted to full release

## v1.1.7 (2024-12-07, Pre-release)

- Syntax Highlighting
  - Updates for Janet 1.37.1
- Paredit
  - Auto-close parens more often
- Janet LSP
  - Update to v0.0.9
    - Bugfixes
      - Decode percent encoding in URIs before saving to or lookup from state
      - Typo: :documnts rather than :documents, causing redundant keys in state when diagnostics are pull (vs push)
      - Don't exit loop when handle-message returns an :error result, instead report it and reenter loop gracefully
    - Misc
      - New "janet/tellJoke" method (testing for future custom LSP RPC calls)
- Misc
  - Support Janet LSP's new `janet/tellJoke` custom command
  
## v1.1.6 (2024-08-11)

- Evaluate
  - Now evaluate S-expr immediately after cursor if available
- Janet LSP
  - Update to v0.0.7
    - Bugfixes and improvments

## v1.1.5 (2024-07-29, Pre-release)

- Evaluate Form
  - Added new command and keyboard shortcut to eval top-level form (`Alt+Shift+E` by default)
  - No longer select evaluated form(s), losing cursor location; instead, highlight evaluated form with green background (and clear highlight only on edit)
- [Janet LSP](https://github.com/cfiggers/janet-lsp)
  - Update to v0.0.5
    - Better syntax highlighting in on-hover popups 
      - Only syntax highlight function signature, not docstring text
    - Bugfixes
      - Fix Backspace outside of top-level form causing server crash
- Syntax Highlighting
  - Added new stdlib forms (including `bundle/` module new with Janet 1.35)

## v1.1.4 (2024-20-22)

- Changes in v1.1.3 promoted to full release 
- [Janet LSP](https://github.com/cfiggers/janet-lsp) Bugfix
  - Fixed bug introduced with v1.1.3 (LSP v0.0.4) where `startup.janet` was being run, but not merged into `root-env`

## v1.1.3 (2024-01-26, Pre-release)

- [Janet LSP](https://github.com/cfiggers/janet-lsp)
  - Update to v0.0.4
    - Multiple diagnostic warnings simultaneously (!)
    - Pop-up Signature helps
    - Always eval in fresh environment (fixes consistency issues with diagnostics)
    - Format document using spork/fmt (replaces old command)
  - Fix bugs with setting custom LSP launch command in settings
- Indentation
  - More forms handled properly
- Syntax highlighting
  - Additional core lib functions added

## v1.1.2 (2024-01-10)

- Changes v1.1.1 promoted to full release

## v1.1.1 (2024-01-02, Pre-release)

- [Janet LSP](https://github.com/cfiggers/janet-lsp)
  - Autocompletion
    - Better formatting on autocomplete documentation popups
    - Autocomplete items have different icons for different types
  - Diagnostics
    - Evaluation of user code is now sandboxed in a self-contained environment rather than running in the server process's main environment table
    - Non-relative and project-relative imports now fully evaluate rather than flychecking only (this fixes issues with some popular libraries such as `spork/path`)
  - On-hover documentation
    - Thanks to eval sandboxing, the server process environment's symbols no longer appear in autocomplete
  - Misc
    - Some prep work implemented setting up Signature Helps

## v1.1.0 (2023-10-29)

- Initial release on VS Code Extension Marketplace
- Improvements
  - Auto-discover local modules saved to `jpm_tree` (or disable that behavior with a new setting)
  - Customize the startup of Janet LSP with `.janet-lsp/startup.janet` in your project's root
- Bugfixes
  - Incomplete `(case)` statement was causing LSP to crash on Mac OS

## v1.0.0

- Improvements
  - Now distributing Janet LSP as a cross-platform .jimage file rather than as a compiled executable
    - This means that `janet` must be present on the user's PATH to start the LSP
- Bugfixes
  - Corrected auto-indentation for some additional symbols related to jpm

## v0.0.6

- Improvements
  - Syntax highlighting for new functions in Janet 1.32 core library (`array/weak`, `table/weak`, `table/weak-keys`, `table/weak-values`)
  - Better auto-indentation of `catseq` and `tabseq` functions
- Bug Fixes
  - Autoformatting of splice (`;`) and unquote (`,`) now works as expected
- Other
  - Recompiled Janet LSP using Janet 1.32
  - Updated README and extension icon

## v0.0.5

- Improvements
  - Autoformatting now indents `catseq` and `tabseq` properly
  - New version of [Janet LSP](https://github.com/cfiggers/janet-lsp)
- Bugfixes
  - Missing forms added to syntax highlighting
- Project Management
  - Improved build tasks
  - New extension logo
  - Corrections in README

## v0.0.4

- New Features
  - File icons for `.janet` files
- Improvements
  - Updated version of [Janet LSP](https://github.com/cfiggers/janet-lsp)
  - Added syntax highlighting for functions added in recent versions of Janet
- Misc
  - Prep to publish extension on VS Code Extension Marketplace (new icon, rewritten README, more details in project.janet).

## v0.0.3

- New Feature
  - Introduced [Janet LSP](https://github.com/cfiggers/janet-lsp)
  - New letdef command creates REPL bindings from `let` definitions
- Bug Fixes
  - Numerous changes to handle format-on-type and navigation correctly
  - Improvements to internal naming to avoid conflicts with similar extensions
- Improvements
  - Do not trigger ParEdit commands when in multi-cursor mode (by default) 
  - Added Webpack

## v0.0.2-e

- Misc
  - Introduced webpack and added .vscodeignore to shrink .vsix bundle to under 1 MB

## v0.0.2-d

- New Feature
  - Introduce `letdef` for sending pairs of definitions to the REPL straight from a `let` binding

## v0.0.2-c

- Bugfixes
  - Not adding new lines on enter if before a comment
  - Not auto-formatting forms with anonymous functions (i.e. `|(foo)`)
- Tweak
  - Initial creation of a REPL from within a source file highlights the REPL window

## v0.0.2-b

- Bugfixes
  - Navigation around comments improved
  - Fixed space-inserting bug in anonymous functions on auto-format (`|(foo)` was being reformatted `| (foo)`)

## v0.0.2-a

- Adds ParEdit-style structural editing commands (borrowed from Calva, see https://www.calva.io )
- Adds automatic format-on-type (triggered manually by Tab)
- Tweaks to syntax highlighting
