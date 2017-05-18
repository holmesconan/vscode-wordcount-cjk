# vscode-wordcount-cjk

This is a word count extension for vscode, which support CJK character counting.

## Features

In current version, the following things are counted:

1. Total characters in a document.
2. Non-whitespace characters.
3. English words.
4. Non-ASCII characters.
5. CJK characters.

In current version, the following format is supported:

1. Markdown file.
2. Plain text file.

For other files that are not supported, such as ReStructuredText, a command `Word Count` is offered.

A status bar item is added, and full statistics are added as a tooltip of the status bar item.

## Extension Settings

**NOTE: This is a TODO version**

* `wordcountcjk.statusbar_format`: Customize the status bar item text.
* `wordcountcjk.english_word_contains_number`: Whether the English word should contains number character.

## Known Issues

I don't know it yet. Open an issue if you find one.

## Release Notes

### 0.1.0

Initial release.

## TODO

1. Add configurations
2. Add i18n
3. Seperate Chinese, Janpanese and Korean

If you have any requested feature, open an issue!

**Enjoy!**