'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WordCounter } from './WordCounter';
import { WordCountController} from './WordCountController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let counter = new WordCounter();
    let controller = new WordCountController(counter);
    let command = vscode.commands.registerCommand('extension.wordcount', () => {
        // This command is used to activate the extension when
        // edit non-standard type files.
        controller.update(/* force = */true);
    });
    context.subscriptions.push(command);
    context.subscriptions.push(controller);
}

// this method is called when your extension is deactivated
export function deactivate() {
}