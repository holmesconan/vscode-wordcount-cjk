// Import the module and reference it with the alias vscode in your code below
import { window, StatusBarItem, StatusBarAlignment, Disposable } from 'vscode';
import { WordCounter } from './WordCounter';

/**
 * The controller of word count
 */
export class WordCountController {
    private _wordCounter: WordCounter;
    private _statusBarItem: StatusBarItem;
    private _disposable: Disposable;
    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    public update(force: boolean = false) {
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        if (force || doc.languageId === "markdown" || doc.languageId === 'plaintext') {
            // Update word count.
            let text = doc.getText();
            this._wordCounter.count(text);

            // Update the status bar
            this._statusBarItem.text = 'Hello StatusBar';
            this._statusBarItem.tooltip = 'Test \n multiline \n tooltip';
            this._statusBarItem.show();
        } else { 
            this._statusBarItem.hide();
        }
    }

    private _onEvent() {
        this.update();
    }

    /**
     * This makes the class disposable.
     */
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();        
    }
}