import Lexer, {
  ASSIGN,
  ASTERISK,
  COMMA,
  FUNCTION,
  GTE,
  IDENTIFIER,
  INT,
  IToken,
  LBRACE,
  LET,
  LPAREN,
  NE,
  RBRACE,
  RPAREN,
  SEMICOLON
} from "./../lexing";
import {expect, test} from "@jest/globals";

// tests/lexing_test.ts
test("Lexer should not throw any errors", () => {
  expect(() => {
    const input: string = `
    let multiply = fn (x, y) {
        x * y;
    };
    
    3 >= 2;
    2 != multiply;
  `

    const tests: IToken[] = [
      // multiply function
      {type: LET, literal: "let"},
      {type: IDENTIFIER, literal: "multiply"},
      {type: ASSIGN, literal: "="},
      {type: FUNCTION, literal: "fn"},
      {type: LPAREN, literal: "("},
      {type: IDENTIFIER, literal: "x"},
      {type: COMMA, literal: ","},
      {type: IDENTIFIER, literal: "y"},
      {type: RPAREN, literal: ")"},
      {type: LBRACE, literal: "{"},
      {type: IDENTIFIER, literal: "x"},
      {type: ASTERISK, literal: "*"},
      {type: IDENTIFIER, literal: "y"},
      {type: SEMICOLON, literal: ";"},
      {type: RBRACE, literal: "}"},
      {type: SEMICOLON, literal: ";"},

      // 3 >= 2
      {type: INT, literal: "3"},
      {type: GTE, literal: ">="},
      {type: INT, literal: "2"},
      {type: SEMICOLON, literal: ";"},

      // 2 != multiply
      {type: INT, literal: "2"},
      {type: NE, literal: "!="},
      {type: IDENTIFIER, literal: "multiply"},
      {type: SEMICOLON, literal: ";"},
    ]

    Lexer.enableCheckpoint1()
    Lexer.enableCheckpoint2()
    const lexer = new Lexer(input);


    for (const test of tests) {
      const token = lexer.nextToken();

      if (token.type != test.type) {
        throw new Error(`Expected type ${test.type} but got type ${token.type}`);
      }

      if (token.literal != test.literal) {
        throw new Error(`Expected literal ${test.literal} but got literal ${token.literal}`)
      }
    }
  }).not.toThrowError();
})
