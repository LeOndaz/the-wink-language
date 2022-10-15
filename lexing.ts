// variable or function names
export const IDENTIFIER = "IDENTIFIER";
export const INT = "INT";

// reserved keywords
export const FUNCTION = "FUNCTION";
export const LET = "LET";

// mathematical symbols
export const PLUS = "PLUS";
export const ASSIGN = "ASSIGN";

// symbols
export const COMMA = "COMMA";
export const SEMICOLON = "SEMICOLON";

// parenthesis, braces
export const LPAREN = "LPAREN";
export const RPAREN = "RPAREN";
export const LBRACE = "LBRACE";
export const RBRACE = "RBRACE";

export const GT = "GREATER_THAN";
export const GTE = "GREATER_THAN_OR_EQUAL";
export const LT = "LESS_THAN";
export const LTE = "LESS_THAN_OR_EQUAL";
export const EQ = "EQUAL";
export const NE = "NOT_EQUAL";

export const MINUS = "MINUS";
export const ASTERISK = "ASTERISK";
export const FSLASH = "FSLASH";
export const EXCLAMATION = "EXCLAMATION";
export const POWER = "POWER";

export const ILLEGAL = "ILLEGAL"
export const EOF = "EOF"


const isLetter = (s: string) => {
    return (
        (s.charCodeAt(0) >= 65 && s.charCodeAt(0) <= 90) ||
        (s.charCodeAt(0) >= 97 && s.charCodeAt(0) <= 122) ||
        s === "_"
    );
}

const isDigit = (s: string) => {
    return !!parseInt(s);
}

interface ILexer {
    keywords: Record<string, string>;
    input: string;
    ch: string | null;
    position: number;
    nextPosition: number;

    nextToken(): void;

    peekChar(): string;

    readChar(): void;

    readIdentifier(): string;

    readDigit(): string;

    skipWhitespace(): void;
}

export type TTokenType = string;

export interface IToken {
    literal: string,
    type: TTokenType
}

class Lexer implements ILexer {
    private static unlock1: boolean = false;
    private static unlock2: boolean = false;

    keywords: Record<string, string> = {
        "let": LET,
        "fn": FUNCTION,
    }

    input: string;
    ch: string | null = null;
    position: number = 0;
    nextPosition: number = 1;

    constructor(input: string) {
        this.input = input
        this.ch = input[this.position];
    }

    static enableCheckpoint1() {
        Lexer.unlock1 = true;
    }

    static enableCheckpoint2() {
        Lexer.unlock2 = true;
    }

    nextToken(): IToken {
        this.skipWhitespace();

        let t: IToken | undefined = undefined;

        if (this.ch) {
            if (isDigit(this.ch)) {
                return {
                    type: INT,
                    literal: this.readDigit()
                }
            } else if (isLetter(this.ch)) {
                const identifier = this.readIdentifier();

                if (this.keywords[identifier]) {
                    return {
                        type: this.keywords[identifier],
                        literal: identifier
                    }
                } else {
                    return {
                        type: IDENTIFIER,
                        literal: identifier,
                    }
                }

            } else if (this.ch === ";") {
                t = {
                    type: SEMICOLON,
                    literal: ";"
                }
            } else if (this.ch === "{") {
                t = {
                    type: LBRACE,
                    literal: "{"
                }
            } else if (this.ch === "}") {
                t = {
                    type: RBRACE,
                    literal: "}"
                }
            } else if (this.ch === "(") {
                t = {
                    type: LPAREN,
                    literal: "("
                }
            } else if (this.ch === ")") {
                t = {
                    type: RPAREN,
                    literal: ")"
                }
            } else if (this.ch === "=") {
                const nextChar = this.peekChar();

                if (Lexer.unlock2 && nextChar === "=") {
                    this.readChar();

                    t = {
                        type: EQ,
                        literal: "=="
                    }
                } else {
                    t = {
                        type: ASSIGN,
                        literal: "="
                    }
                }
            } else if (this.ch === "+") {
                t = {
                    type: "PLUS",
                    literal: "+"
                }
            } else if (this.ch === ",") {
                t = {
                    type: COMMA,
                    literal: ","
                }
            } else if (Lexer.unlock2 && this.ch === "-") {
                t = {
                    type: MINUS,
                    literal: "-"
                }
            } else if (Lexer.unlock2 && this.ch === "*") {
                const nextChar = this.peekChar();

                if (nextChar === "*") {
                    this.readChar();
                    t = {
                        type: POWER,
                        literal: "**"
                    }
                } else {
                    t = {
                        type: ASTERISK,
                        literal: "*"
                    }
                }
            } else if (Lexer.unlock2 && this.ch === "!") {
                const nextChar = this.peekChar();

                if (nextChar === "=") {
                    this.readChar();

                    t = {
                        type: NE,
                        literal: "!="
                    }
                } else {
                    t = {
                        type: EXCLAMATION,
                        literal: "!"
                    }
                }
            } else if (Lexer.unlock2 && this.ch === ">") {
                const nextChar = this.peekChar();

                if (nextChar === "=") {
                    this.readChar();

                    t = {
                        type: GTE,
                        literal: ">="
                    }
                } else {
                    t = {
                        type: GT,
                        literal: ">"
                    }
                }
            } else if (Lexer.unlock2 && this.ch === "<") {
                const nextChar = this.peekChar();

                if (nextChar === "=") {
                    this.readChar();

                    t = {
                        type: LTE,
                        literal: "<="
                    }
                } else {
                    t = {
                        type: LT,
                        literal: "<"
                    }
                }
            } else if (Lexer.unlock1) {
                t = {
                    type: ILLEGAL,
                    literal: this.ch,
                }
            }
        } else if (Lexer.unlock1) {
            t = {
                type: EOF,
                literal: ""
            }
        }

        this.readChar();
        return t as IToken;
    }

    readChar() {
        if (this.position >= this.input.length) {
            this.ch = null;
        } else {
            this.ch = this.input[this.nextPosition];
        }

        this.position = this.nextPosition;
        this.nextPosition++;
    }


    readIdentifier() {
        const currentPosition = this.position;

        while (this.ch && isLetter(this.ch)) {
            this.readChar();
        }

        return this.input.slice(currentPosition, this.position)
    }

    readDigit() {
        const currentPosition = this.position;

        while (this.ch && isDigit(this.ch)) {
            this.readChar();
        }

        return this.input.slice(currentPosition, this.position);
    }

    skipWhitespace() {
        while (this.ch === " " || this.ch === "\t" || this.ch === "\r" || this.ch === "\n") {
            this.readChar();
        }
    }

    peekChar() {
        return this.input[this.nextPosition]
    }
}

export const tokenize = (input: string) => {
    const lexer = new Lexer(input);
    const tokens = [];

    while (lexer.ch) {
        tokens.push(lexer.nextToken())
    }

    return tokens;
}

export default Lexer;
