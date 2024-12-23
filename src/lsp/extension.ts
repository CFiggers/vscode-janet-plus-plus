// import * as vscode_lsp from 'vscode-languageclient/node';
import * as vscode from 'vscode';
import * as path from 'path';
import {
    ExtensionContext,
    commands
} from 'vscode';

import * as config from '../config';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from "vscode-languageclient/node";
import * as child_process from "child_process";
import { type } from 'os';

// export enum LspStatus {
//     Stopped = 'Stopped',
//     Starting = 'Starting',
//     Running = 'Running',
//     Failed = 'Failed',
//     Unknown = 'Unknown',
// }

// export type LspClient = {
//     id: string;
//     uri: vscode.Uri;
//     client: vscode_lsp.LanguageClient;
//     status: LspStatus;
//   };

let client: LanguageClient | undefined = undefined;
const languageClients = new Map<string, LanguageClient>();

function getServer(): string {
    const windows = process.platform === "win32";
    const suffix = windows ? ".exe" : "";
    const binaryName = "janet-lsp" + suffix;

    return path.resolve(__dirname, binaryName);
	// const bundledPath = path.resolve(__dirname, binaryName);

    // const bundledValidation = validateServer(bundledPath);
    // if (bundledValidation.valid) {
    //     return bundledPath;
    // }

    // const binaryValidation = validateServer(binaryName);
    // if (binaryValidation.valid) {
    //     return binaryName;
    // }

    // throw new Error(
    //     `Could not find a valid janet-lsp binary.\nBundled: ${bundledValidation.message}\nIn PATH: ${binaryValidation.message}`
    // );
}

function getServerImage(): string {
    // const windows = process.platform === "win32";
    // const suffix = windows ? ".exe" : "";
    // const binaryName = "janet-lsp" + suffix;
    const binaryName = "janet-lsp.jimage";

    return path.resolve(__dirname, binaryName);
	// const bundledPath = path.resolve(__dirname, binaryName);

    // const bundledValidation = validateServer(bundledPath);
    // if (bundledValidation.valid) {
    //     return bundledPath;
    // }

    // const binaryValidation = validateServer(binaryName);
    // if (binaryValidation.valid) {
    //     return binaryName;
    // }

    // throw new Error(
    //     `Could not find a valid janet-lsp binary.\nBundled: ${bundledValidation.message}\nIn PATH: ${binaryValidation.message}`
    // );
}

function getDiscoverJpmTreeOpt(): string[] {
    let discoverJpmTreeOpt: string[];

    if (config.getConfig().dontDiscoverJpmTree){
        discoverJpmTreeOpt = ["--dont-search-jpm-tree"];
    } else {
        discoverJpmTreeOpt = [];
    }

    return discoverJpmTreeOpt;
}

function getDebugLspOpt(): string[] {
    let debugLsp: string[];

    if (config.getConfig().debugLsp) {
        debugLsp = ["--debug"];
    } else {
        debugLsp = [];
    }

    return debugLsp;
}

function getLoggingDetailConsole(): string[]{
    let loggingDetailConsole: string[];

    if (config.getConfig().loggingDetailConsole){
        let level: number;
        switch (config.getConfig().loggingDetailConsole) {
            case "off":
                level = 0;
                break;
            case "messages":
                level = 1;
                break;
            case "verbose":
                level = 2;
                break;
            case "veryverbose":
                level = 3;
                break;
            default:
                break;
        }
        loggingDetailConsole = ["--log-level", level.toString()];
    }

    return loggingDetailConsole;
}

function getLoggingDetailFile(): string[]{
    let loggingDetailConsole: string[];

    if (config.getConfig().loggingDetailFile){
        let level: number;
        switch (config.getConfig().loggingDetailFile) {
            case "off":
                level = 0;
                break;
            case "messages":
                level = 1;
                break;
            case "verbose":
                level = 2;
                break;
            case "veryverbose":
                level = 3;
                break;
            default:
                break;
        }
        loggingDetailConsole = ["--log-to-file-level", level.toString()];
    }

    return loggingDetailConsole;
}

function getServerOptions(): ServerOptions {
    let options: ServerOptions;
    const lspConfig = config.getConfig().customJanetLspCommand;

    if (lspConfig) {
        const parts = lspConfig.split(" ");
        options = {
            command: parts[0],
            args: parts.slice(1),
            transport: TransportKind.stdio
        };
    } else {
        const args = ["-i", getServerImage()].concat(
            getDebugLspOpt(),
            getDiscoverJpmTreeOpt(),
            getLoggingDetailConsole(),
            getLoggingDetailFile()
        );
        console.log("LSP args are: ", args);
        options = {
            command: "janet",
            args: args,
            transport: TransportKind.stdio
        };
    }
    
    return options;
}

// TODO: This is a good idea, figure it out later

// function validateServer(path: string): { valid: boolean; message: string } {
//     try {
//         const result = child_process.spawnSync(path);
//         if (result.status === 0) {
//             return { valid: true , message: "ok"};
//         } else {
//             const statusMessage = result.status !== null ? [`return status: ${result.status}`] : [];
//             const errorMessage =
//                 result.error?.message !== undefined ? [`error: ${result.error.message}`] : [];
//             const messages = [statusMessage, errorMessage];
//             const messageSuffix =
//                 messages.length !== 0 ? `:\n\t${messages.flat().join("\n\t")}` : "";
//             const message = `Failed to launch '${path}'${messageSuffix}`;
//             return { valid: false, message };
//         }
//     } catch (e) {
//         if (e instanceof Error) {
//             return { valid: false, message: `Failed to launch '${path}': ${e.message}` };
//         } else {
//             return { valid: false, message: `Failed to launch '${path}': ${JSON.stringify(e)}` };
//         }
//     }
// }

// TODO: Add a status bar showing current health of janet-lsp 

// function updateStatusBarFn(item: vscode.StatusBarItem, status: LspStatus) {
//   switch (status) {
//     case LspStatus.Stopped: {
//       item.text = "$(circle-outline) Janet LSP";
//       item.tooltip = "Janet LSP is not active, click to get a menu";
//       break;
//     }
//     case LspStatus.Starting: {
//       item.text = "$(sync~spin) Janet LSP";
//       item.tooltip = "Janet LSP is starting";
//       break;
//     }
//     case LspStatus.Running: {
//       item.text = "$(circle-filled) Janet LSP";
//       item.tooltip = "Janet LSP is active";
//       break;
//     }
//     case LspStatus.Failed: {
//       item.text = "$(error) Janet LSP";
//       item.tooltip = "Janet LSP failed to start";
//       break;
//     }
//     case LspStatus.Unknown: {
//       item.text = "Janet LSP";
//       item.tooltip = "Open a .janet file to see the server status";
//       break;
//     }
//   }
// }

export function activate(context: ExtensionContext) {
    
    // TODO: Add a status bar showing current health of janet-lsp 

    // const status_bar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    // // status_bar_item.command = 'calva.clojureLsp.manage';
    // const updateStatusBar = () => {
    //     const any_starting = Array.from(clients.values()).find(
    //       (client) => client.status === defs.LspStatus.Starting
    //     );
    //     if (any_starting) {
    //       return updateStatusBarFn(status_bar_item, defs.LspStatus.Starting);
    //     }
    
    //     const active_editor = vscode.window.activeTextEditor?.document;
    //     if (!active_editor || active_editor.languageId !== 'clojure') {
    //       // If there are multiple clients then we don't know which client to show the status for and we set it to unknown
    //       if (clients.size !== 1) {
    //         updateStatusBarFn(status_bar_item, defs.LspStatus.Unknown);
    //         return;
    //       }
    
    //       const client = Array.from(clients.values())[0];
    //       updateStatusBarFn(status_bar_item, client.status);
    //       return;
    //     }
    
    //     const client = api.getActiveClientForUri(clients, active_editor.uri);
    //     if (!client) {
    //         updateStatusBarFn(status_bar_item, defs.LspStatus.Stopped);
    //       return;
    //     }
    
    //     updateStatusBarFn(status_bar_item, client.status);
    //   };
    
    // const serverOptions: ServerOptions = {
	// 	command: getServer(),
	// 	args: [],
	// 	transport: TransportKind.stdio
	// };

    // const serverOptions: ServerOptions = {
	// 	command: "janet",
	// 	args: ["-i", getServerImage()],
	// 	transport: TransportKind.stdio
	// };
    
    if (config.getConfig().debugLsp && !config.getConfig().customJanetLspCommand) {
        vscode.window.showInformationMessage('Janet LSP debugging enabled.');
    }

    const serverOptions: ServerOptions = getServerOptions();

	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{language: "janet", scheme: "file"},
			{language: "janet", scheme: "untitled"}
		],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc")
		},
		diagnosticCollectionName: "janet"
	};

	client = new LanguageClient(
		"Janet LSP",
		"Janet Language Server",
		serverOptions,
		clientOptions
	);

    languageClients.set("janet-lsp", client);

    context.subscriptions.push(
        vscode.commands.registerCommand('janet.lsp.tellJoke', commandTellJoke )
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('janet.lsp.enableDebug', commandEnableDebug )
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('janet.lsp.disableDebug', commandDisableDebug )
    );

	client.start();
}

async function commandTellJoke() : Promise<void> {
    const client = languageClients.get("janet-lsp");

    if (client) {
        const result = await client?.sendRequest("janet/tellJoke", {});
        void vscode.window.showInformationMessage(
            "Question: " + result["question"] + "\r\n\r\n" +
            "Answer: " + result["answer"]
        );
    } else {
        console.error("Janet LSP not found");
    }
}

async function commandEnableDebug() : Promise<void> {
    const client = languageClients.get("janet-lsp");
    if (client) {
        const result = await client?.sendRequest("enableDebug", {});
        void vscode.window.showInformationMessage(
            result["message"]
        );

    } else {
        console.error("Janet LSP not found");
    }
}

async function commandDisableDebug() : Promise<void> {
    const client = languageClients.get("janet-lsp");
    if (client) {
        const result = await client?.sendRequest("disableDebug", {});
        void vscode.window.showInformationMessage(
            result["message"]
        );
    } else {
        console.error("Janet LSP not found");
    }
}

}

export function deactivate(){
    client.stop();
}