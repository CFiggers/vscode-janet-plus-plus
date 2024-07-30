# Janet language support for Visual Studio Code

This extension adds language support and some IDE-lite editor features for the [Janet](https://www.janet-lang.org) programming language to [VS Code](https://code.visualstudio.com/).

Just starting with Janet? See the official language introduction [here](https://www.janet-lang.org/docs/index.html).

## Features

- `.janet` file type support and syntax highlighting for Janet files
- Create a Janet REPL session in the integrated terminal (`Janet: Start REPL` in the Command Palette)
  - Evaluate expressions from any open `.janet` file (with ```alt+e```) or load the entire open file into the REPL (with ```alt+l```), creating a new one if none is currently active
- Auto-format Janet code while typing, or format current form on command (with `Tab`)
- Structural editing and navigation using ParEdit-style Sexp commands
  - `Ctrl+Left/Right` to move cursor by S-Exp
  - `Alt+Up/Down` to drag S-Exp forward/backward
  - "Slurp" (extend parentheses), "Barf" (shrink parentheses), and other PareEdit commands (see [this visual guide to ParEdit on the Calva website](https://calva.io/paredit/) for more info, most of which applies without modification to this extension too)
- Language Server Protocol via embedded [Janet LSP](https://www.github.com/CFiggers/janet-lsp)
  - Inline compiler error underlining
  - Function and macro symbol autocomplete
  - On-hover symbol definitions
  - Pop-up signature helps
  - Document formatting

More coming soon!

# Usage

## Janet LSP and `startup.janet`

Janet LSP works by running a copy of the Janet runtime and flychecking (that is, compiling but not fully evaluating) the code in your active editor window using that runtime instance. This allows for on-hover documentation and compiler warnings to be provided by Janet itself.

Sometimes, you may need to pre-load modules or modify the environment table in other ways in order for the LSP's runtime to correctly recognize the code in your editor. In such cases, you can create a `.janet-lsp/` directory in your project's root and add a `startup.janet` file to that folder. If such a startup script is detected, the LSP will fully execute it prior to initiating the startup handshake with your editor.

The code in `startup.janet` is normal Janet source code that is executed by the server's runtime. **Don't put any code you don't completely trust in `startup.janet`.**

# Contributing

Issues and PRs are welcome!

# Prior Art

Huge portions of this extension are remixed from other open source projects, including:

- Janet's official VS Code Extension: [vscode-janet](https://www.github.com/janet-lang/vscode-janet), MIT License, Copyright (c) 2020 Calvin Rose and contributors
- [Calva: A Clojure & ClojureScript IDE in Visual Studio Code](https://www.github.com/BetterThanTomorrow/calva), MIT License, Parts of the software are Copyright (c) 2016-2018 Stian Sivertsen; Other parts are Copyright (c) 2018 -> Better than Tomorrow
