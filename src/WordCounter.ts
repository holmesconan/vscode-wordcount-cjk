/**
 * The main class to provide counter functionality.
 */
export class WordCounter {

    /** 中文字数 */
    private _nChineseCharacters: number;
    /** 中文字符数 */
    private _nChineseSymbols: number;
    /** 英文单词数 */
    private _nEnglishWords: number;
    /** 字符数 （包含空格） */
    private _nCharactersWithWhiteSpaces: number;
    /** 字符数 （不包含空格） */
    private _nCharactersWithoutWhiteSpaces: number;

    /** 中文字数 */
    get nChineseCharaters() : number { return this._nChineseCharacters; }

    /** 中文字符数 */    
    get nChineseSymbols() : number { return this._nChineseSymbols; }

    /** 英文单词数 */    
    get nEnglishWords() : number { return this._nEnglishWords; }

    /** 字符数 （包含空格） */    
    get nCharactersWithWhiteSpaces() : number { return this._nCharactersWithWhiteSpaces; }

    /** 字符数 （不包含空格） */
    get nCharactersWithoutWhiteSpaces() : number { return this._nCharactersWithoutWhiteSpaces; }

    public count(text: string) {
        this._resetCounters();
        let inWord = false;
        for (let index = 0; index < text.length; index ++) {
            // Get a char
            const ch = text.charAt(index);

            // Count chinese characters
            if (this._isChineseCharacter(ch)) {
                this._nChineseCharacters += 1;
            }

            // Count chinese symbols
            if (this._isChineseSymbol(ch)) {
                this._nChineseSymbols += 1;
            }

            // Count english words
            if (this._isWordChar(ch)) {
                inWord = true;
            } else {
                if (inWord) {
                    this._nEnglishWords += 1;
                    inWord = false;
                }
            }

            // Count characters
            if (!this._isWhiteSpace(ch)) {
                this._nCharactersWithoutWhiteSpaces += 1;
            }
            this._nCharactersWithWhiteSpaces += 1;
        }
    }

    private _isChineseSymbol(ch: string) {
        return true;
    }

    private _isChineseCharacter(ch: string) {
        return true;
    }

    private _isWordChar(ch: string) {
        return (/\w/).test(ch);
    }

    private _isWhiteSpace(ch: string) {
        return (/\s/).test(ch);
    }

    private _resetCounters() {
        this._nChineseCharacters = 0;
        this._nChineseSymbols = 0;
        this._nEnglishWords = 0;
        this._nCharactersWithWhiteSpaces = 0;
        this._nCharactersWithoutWhiteSpaces = 0;
    }
}