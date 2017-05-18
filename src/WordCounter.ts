import { WorkspaceConfiguration } from "vscode";

/**
 * The main class to provide counter functionality.
 */
export class WordCounter {

    /** 中文字数 */
    private _nChineseChars: number;
    /** 非 ASCII 字符娄 */
    private _nNonASCIIChars: number;
    /** 英文单词数 */
    private _nEnglishWords: number;
    /** 非空白字符娄 */
    private _nNonWhitespaceChars: number;
    /** 总字符数 */
    private _nTotalChars: number;

    private readonly _regexWordChar: RegExp;
    private readonly _regexASCIIChar: RegExp;
    private readonly _regexWhitespaceChar: RegExp;

    constructor(configuration: WorkspaceConfiguration) {
        this._regexWordChar = new RegExp(configuration.get<string>("regexWordChar"));
        this._regexASCIIChar = new RegExp(configuration.get<string>("regexASCIIChar"));
        this._regexWhitespaceChar = new RegExp(configuration.get<string>("regexWhitespaceChar"));
    }

    public count(text: string) {
        this._resetCounters();

        let inWord = false;
        for (let index = 0; index < text.length; ++index) {
            // Get a char
            const ch = text.charAt(index);

            // Count chinese Chars
            if (this._isChineseCharacter(ch)) {
                this._nChineseChars += 1;
            }

            // Count non-ASCII symbols
            if (!this._isASCIICharacter(ch)) {
                this._nNonASCIIChars += 1;
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

            // Count Chars
            if (!this._isWhiteSpace(ch)) {
                this._nNonWhitespaceChars += 1;
            }
        }

        if (inWord) {
            this._nEnglishWords += 1;
        }

        this._nTotalChars = text.length;
    }

    public format(fmt: string) : string {
        let formatted = fmt.replace('${cjk}', this._nChineseChars.toString(10));
        formatted = formatted.replace('${ascii}', (this._nTotalChars - this._nNonASCIIChars).toString(10));
        formatted = formatted.replace('${non-ascii}', this._nNonASCIIChars.toString(10));
        formatted = formatted.replace('${whitespace}', (this._nTotalChars - this._nNonWhitespaceChars).toString(10));
        formatted = formatted.replace('${non-whitespace}', this._nNonWhitespaceChars.toString(10));
        formatted = formatted.replace('${en-words}', this._nEnglishWords.toString(10));
        formatted = formatted.replace('${total}', this._nTotalChars.toString(10));
        return formatted;
    }

    /**
     * Justify if a char is ASCII character.
     *
     * 0000-007F: C0 Controls and Basic Latin (ASCII)
     * 0080-00FF: C1 Controls and Latin-1 Supplement (Extended ASCII)
     *
     * Reference:
     * http://houfeng0923.iteye.com/blog/1035321 (Chinese)
     * https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)
     * https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)
     *
     * @todo Current ASCII contains ASCII and Extended ASCII.
     * This sould be configurable in the future.
     *
     * @param ch char to be tested.
     */
    private _isASCIICharacter(ch: string) {
        return this._regexASCIIChar.test(ch);;
    }

    /**
     * Justify if a char is Chinese character.
     *
     * 4E00-9FFF: CJK Unified Ideographs
     * F900-FAFF: CJK Compatibility Ideographs
     *
     * Reference:
     * http://houfeng0923.iteye.com/blog/1035321 (Chinese)
     * https://en.wikipedia.org/wiki/CJK_Unified_Ideographs
     * https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
     *
     * @todo Refine to contains only Chinese Chars.
     *
     * @param ch Char to be tested.
     */
    private _isChineseCharacter(ch: string) {
        return (/[\u4E00-\u9FA5\uF900-\uFA2D]/).test(ch);
    }

    /**
     * Test if a char is a word character.
     *
     * The regular expression \w rule is used.
     * In Javascript it matches any alphanumeric character including the underscore.
     * Equivalent to [A-Za-z0-9_].
     *
     * @todo the word means should be configurable.
     *
     * @param ch Char to be tested
     */
    private _isWordChar(ch: string) {
        return this._regexWordChar.test(ch);
    }

    /**
     * Test if a char is a white space.
     *
     * The regular expression \s rule is used.
     * In Javascript it matches a single white space character, including space,
     * tab, form feed, line feed.
     * Equivalent to [ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
     *
     * @param ch Char to be tested.
     */
    private _isWhiteSpace(ch: string) {
        return this._regexWhitespaceChar.test(ch);
    }

    private _resetCounters() {
        this._nChineseChars = 0;
        this._nNonASCIIChars = 0;
        this._nEnglishWords = 0;
        this._nNonWhitespaceChars = 0;
        this._nTotalChars = 0;
    }
}