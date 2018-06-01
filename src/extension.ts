'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WordCounter } from './WordCounter';
import { WordCountController } from './WordCountController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const configuration = vscode.workspace.getConfiguration("wordcount_cjk");
    let counter = new WordCounter(configuration);
    let controller = new WordCountController(configuration, counter);
    let command1 = vscode.commands.registerCommand('extension.wordcount', () => {
        // This command is used to activate the extension when
        // edit non-standard type files.
        controller.update(/* force = */true);
    });
    let command2 = vscode.commands.registerCommand('extension.wordcountActivate', () => {
        // This command is used to activate the extension when
        // edit non-standard type files.
        controller.activate();
    });
    let command3 = vscode.commands.registerCommand('extension.wordcountDeactivate', () => {
        // This command is used to deactivate the extension
        controller.deactivate();
    });

    context.subscriptions.push(command1);
    context.subscriptions.push(command2);
    context.subscriptions.push(command3);
    context.subscriptions.push(controller);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
