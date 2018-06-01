// Import the module and reference it with the alias vscode in your code below
import { window, StatusBarItem, StatusBarAlignment, Disposable, WorkspaceConfiguration } from 'vscode';
import { WordCounter } from './WordCounter';

/**
 * The controller of word count
 */
export class WordCountController {
    private _wordCounter: WordCounter;
    private _statusBarItem: StatusBarItem;
    private _disposable: Disposable;
    private _delayUpdateTimer: any;
    private _isActive: boolean;
    private readonly _statusBarTextTemplate: string;
    private readonly _statusBarTooltipTemplate: string;
    private readonly _activateLanguages: Array<string>;

    constructor(configuration: WorkspaceConfiguration, wordCounter: WordCounter) {
        this._isActive = false;
        this._wordCounter = wordCounter;
        this._statusBarTextTemplate = configuration.get<string>("statusBarTextTemplate");
        this._statusBarTooltipTemplate = configuration.get<string>("statusBarTooltipTemplate");
        this._activateLanguages = configuration.get<Array<string>>("activateLanguages");

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

        if (force || this.shouldActivate(doc.languageId) || this._isActive) {
            // Update word count.
            let text = doc.getText();
            this._wordCounter.count(text);

            // Update the status bar
            try {
                this._statusBarItem.text = this._wordCounter.format(this._statusBarTextTemplate);
                this._statusBarItem.tooltip = this._wordCounter.format(this._statusBarTooltipTemplate);
                this._statusBarItem.show();
            } catch (e) {
                window.showErrorMessage('Something is wrong when update status bar');
            }
        } else {
            this._statusBarItem.hide();
        }
    }

    private shouldActivate(languageId: string): boolean {
        for(var l of this._activateLanguages) {
            if (l === languageId) {
                return true;
            }
        }

        return false;
    }

    private _onEvent() {
        this.update();

        if (this._delayUpdateTimer) {
            clearTimeout(this._delayUpdateTimer);
        }

        this._delayUpdateTimer = setTimeout(() => {
            this._delayUpdateTimer = null;
            this.update();
        }, 500);
    }

    /**
     * This makes the class disposable.
     */
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }

    activate() {
        this._isActive = true;
        this.update();
    }

    deactivate() {
        this._isActive = false;
        this._statusBarItem.hide();
    }
}