/**
 * Kora Language Tokenizer (Lexer)
 * 
 * Converts Kora source code into tokens.
 */

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export enum TokenType {
  // Literals
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  
  // Keywords
  MODULE = 'MODULE',
  DOMAIN = 'DOMAIN',
  UI = 'UI',
  API = 'API',
  PAGE = 'PAGE',
  TYPE = 'TYPE',
  CONST = 'CONST',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  HANDLER = 'HANDLER',
  LOAD = 'LOAD',
  VIEW = 'VIEW',
  USES = 'USES',
  LET = 'LET',
  RETURN = 'RETURN',
  IF = 'IF',
  ELSE = 'ELSE',
  FOR = 'FOR',
  IN = 'IN',
  
  // Types
  STRING_TYPE = 'STRING_TYPE',
  NUMBER_TYPE = 'NUMBER_TYPE',
  BOOLEAN_TYPE = 'BOOLEAN_TYPE',
  UUID_TYPE = 'UUID_TYPE',
  EMAIL_TYPE = 'EMAIL_TYPE',
  DATE_TYPE = 'DATE_TYPE',
  VOID_TYPE = 'VOID_TYPE',
  
  // Literals
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  UNDEFINED = 'UNDEFINED',
  
  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  STAR = 'STAR',
  SLASH = 'SLASH',
  EQUAL = 'EQUAL',
  EQUAL_EQUAL = 'EQUAL_EQUAL',
  BANG = 'BANG',
  BANG_EQUAL = 'BANG_EQUAL',
  LESS = 'LESS',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER = 'GREATER',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AND = 'AND',
  OR = 'OR',
  
  // Delimiters
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  DOT = 'DOT',
  COLON = 'COLON',
  QUESTION = 'QUESTION',
  ARROW = 'ARROW',
  
  // JSX
  LEFT_ANGLE = 'LEFT_ANGLE',
  RIGHT_ANGLE = 'RIGHT_ANGLE',
  SLASH_ANGLE = 'SLASH_ANGLE',
  
  // Other
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE',
  COMMENT = 'COMMENT',
  EOF = 'EOF',
}

const KEYWORDS: Record<string, TokenType> = {
  'module': TokenType.MODULE,
  'domain': TokenType.DOMAIN,
  'ui': TokenType.UI,
  'api': TokenType.API,
  'page': TokenType.PAGE,
  'type': TokenType.TYPE,
  'const': TokenType.CONST,
  'input': TokenType.INPUT,
  'output': TokenType.OUTPUT,
  'handler': TokenType.HANDLER,
  'load': TokenType.LOAD,
  'view': TokenType.VIEW,
  'uses': TokenType.USES,
  'let': TokenType.LET,
  'return': TokenType.RETURN,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'for': TokenType.FOR,
  'in': TokenType.IN,
  'String': TokenType.STRING_TYPE,
  'Number': TokenType.NUMBER_TYPE,
  'Boolean': TokenType.BOOLEAN_TYPE,
  'UUID': TokenType.UUID_TYPE,
  'Email': TokenType.EMAIL_TYPE,
  'Date': TokenType.DATE_TYPE,
  'Void': TokenType.VOID_TYPE,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  'null': TokenType.NULL,
  'undefined': TokenType.UNDEFINED,
};

export class Tokenizer {
  private source: string;
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private column = 1;

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    });

    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case '[':
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      case ']':
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case ':':
        this.addToken(TokenType.COLON);
        break;
      case '?':
        this.addToken(TokenType.QUESTION);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case '-':
        if (this.match('>')) {
          this.addToken(TokenType.ARROW);
        } else {
          this.addToken(TokenType.MINUS);
        }
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '/':
        if (this.match('/')) {
          // Line comment
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else if (this.match('*')) {
          // Block comment
          while (!this.isAtEnd()) {
            if (this.peek() === '*' && this.peekNext() === '/') {
              this.advance();
              this.advance();
              break;
            }
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        if (this.match('=')) {
          this.addToken(TokenType.LESS_EQUAL);
        } else if (this.match('/')) {
          this.addToken(TokenType.SLASH_ANGLE);
        } else {
          this.addToken(TokenType.LESS);
        }
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND);
        } else {
          throw this.error('Unexpected character: &');
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR);
        } else {
          throw this.error('Unexpected character: |');
        }
        break;
      case '"':
      case "'":
        this.string(c);
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;
      case '\n':
        this.line++;
        this.column = 1;
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw this.error(`Unexpected character: ${c}`);
        }
        break;
    }
  }

  private string(quote: string): void {
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw this.error('Unterminated string');
    }

    // Closing quote
    this.advance();

    // Trim quotes
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number(): void {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for decimal point
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume '.'
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = this.source.substring(this.start, this.current);
    this.addToken(TokenType.NUMBER, value);
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = KEYWORDS[text] || TokenType.IDENTIFIER;
    this.addToken(type);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    this.current++;
    this.column++;
    return this.source[this.current - 1];
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source[this.current + 1];
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;

    this.current++;
    this.column++;
    return true;
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private addToken(type: TokenType, value?: string): void {
    const text = value !== undefined ? value : this.source.substring(this.start, this.current);
    this.tokens.push({
      type,
      value: text,
      line: this.line,
      column: this.column - text.length,
    });
  }

  private error(message: string): Error {
    return new Error(`[Line ${this.line}, Column ${this.column}] ${message}`);
  }
}

