/**
 * Stratum Language Parser
 * 
 * Parses Stratum source code into an Abstract Syntax Tree (AST).
 */

import { Tokenizer, Token, TokenType } from './tokenizer.js';
import type {
  Program,
  Module,
  DomainModule,
  ApiModule,
  UiModule,
  PageModule,
  TypeDefinition,
  FieldDeclaration,
  TypeAnnotation,
  Block,
  Statement,
  Expression,
  Parameter,
  ConstantDeclaration,
  VariableDeclaration,
  Assignment,
  IfStatement,
  ForStatement,
  BinaryExpression,
  UnaryExpression,
  FunctionCall,
  MemberAccess,
  Identifier,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
  NullLiteral,
  JsxElement,
  JsxText,
  JsxExpression,
  JsxAttribute,
  ParenthesizedExpression,
  StyleBlock,
  CssRule,
  CssProperty,
  GlobalStylesModule,
} from './types.js';

/**
 * Parser for Stratum language
 */
export class Parser {
  private tokens: Token[] = [];
  private current = 0;

  /**
   * Parse Stratum source code into AST
   */
  parse(source: string): Program {
    const tokenizer = new Tokenizer(source);
    this.tokens = tokenizer.tokenize();
    this.current = 0;

    const modules: Module[] = [];

    while (!this.isAtEnd()) {
      if (this.check(TokenType.EOF)) break;
      modules.push(this.parseModule());
    }

    return { modules };
  }

  /**
   * Parse a module declaration
   */
  private parseModule(): Module {
    if (this.match(TokenType.MODULE, TokenType.DOMAIN)) {
      return this.parseDomainModule();
    } else if (this.match(TokenType.MODULE, TokenType.UI)) {
      return this.parseUiModule();
    } else if (this.check(TokenType.API)) {
      return this.parseApiModule();
    } else if (this.check(TokenType.PAGE)) {
      return this.parsePageModule();
    } else if (this.match(TokenType.STYLES, TokenType.GLOBAL)) {
      return this.parseGlobalStylesModule();
    } else {
      throw this.error('Expected module, api, page, or styles declaration');
    }
  }

  /**
   * Parse domain module
   */
  private parseDomainModule(): DomainModule {
    const name = this.consumeIdentifier('Expected module name');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');

    const types: TypeDefinition[] = [];
    const constants: ConstantDeclaration[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.TYPE)) {
        types.push(this.parseTypeDefinition());
      } else if (this.match(TokenType.CONST)) {
        constants.push(this.parseConstantDeclaration());
      } else {
        throw this.error('Expected type or const declaration');
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    return {
      kind: 'domain',
      name,
      types,
      constants,
    };
  }

  /**
   * Parse type definition
   */
  private parseTypeDefinition(): TypeDefinition {
    const name = this.consumeIdentifier('Expected type name');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');

    const fields: FieldDeclaration[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      fields.push(this.parseFieldDeclaration());
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    return { name, fields };
  }

  /**
   * Parse field declaration
   */
  private parseFieldDeclaration(): FieldDeclaration {
    const name = this.consumeIdentifier('Expected field name');
    this.consume(TokenType.COLON, 'Expected ":"');
    const type = this.parseTypeAnnotation();

    return { name, type };
  }

  /**
   * Parse type annotation
   */
  private parseTypeAnnotation(): TypeAnnotation {
    let baseType: TypeAnnotation;

    // Check for primitive types
    if (this.match(TokenType.STRING_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'String' };
    } else if (this.match(TokenType.NUMBER_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'Number' };
    } else if (this.match(TokenType.BOOLEAN_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'Boolean' };
    } else if (this.match(TokenType.UUID_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'UUID' };
    } else if (this.match(TokenType.EMAIL_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'Email' };
    } else if (this.match(TokenType.DATE_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'Date' };
    } else if (this.match(TokenType.VOID_TYPE)) {
      baseType = { kind: 'primitive', primitive: 'Void' };
    } else {
      // Custom type
      const name = this.consumeIdentifier('Expected type name');

      // Check for generic type
      if (this.match(TokenType.LESS)) {
        const genericArgs: TypeAnnotation[] = [];
        do {
          genericArgs.push(this.parseTypeAnnotation());
        } while (this.match(TokenType.COMMA));
        this.consume(TokenType.GREATER, 'Expected ">"');
        baseType = { kind: 'generic', name, genericArgs };
      } else {
        baseType = { kind: 'custom', name };
      }
    }

    // Check for optional (works for both primitives and custom types)
    if (this.match(TokenType.QUESTION)) {
      return {
        kind: 'optional',
        inner: baseType,
      };
    }

    return baseType;
  }

  /**
   * Parse constant declaration
   */
  private parseConstantDeclaration(): ConstantDeclaration {
    const name = this.consumeIdentifier('Expected constant name');
    this.consume(TokenType.COLON, 'Expected ":"');
    const type = this.parseTypeAnnotation();
    this.consume(TokenType.EQUAL, 'Expected "="');
    const value = this.parseExpression();

    return { name, type, value };
  }

  /**
   * Parse UI module
   */
  private parseUiModule(): UiModule {
    const name = this.consumeIdentifier('Expected module name');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');

    // Skip UI module body for now
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.advance();
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    return {
      kind: 'ui',
      name,
    };
  }

  /**
   * Parse API module
   */
  private parseApiModule(): ApiModule {
    this.consume(TokenType.API, 'Expected "api"');
    const name = this.consumeIdentifier('Expected API name');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');

    let input: FieldDeclaration[] | undefined;
    let output: TypeAnnotation | undefined;
    let handler: Block | undefined;

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.INPUT)) {
        input = this.parseInput();
      } else if (this.match(TokenType.OUTPUT)) {
        output = this.parseOutput();
      } else if (this.match(TokenType.HANDLER)) {
        handler = this.parseBlock();
      } else {
        throw this.error('Expected input, output, or handler');
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    return {
      kind: 'api',
      name,
      input,
      output,
      handler,
    };
  }

  /**
   * Parse input declaration
   */
  private parseInput(): FieldDeclaration[] {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');
    const fields: FieldDeclaration[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      fields.push(this.parseFieldDeclaration());
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
    return fields;
  }

  /**
   * Parse output declaration
   */
  private parseOutput(): TypeAnnotation {
    return this.parseTypeAnnotation();
  }

  /**
   * Parse page module
   */
  private parsePageModule(): PageModule {
    this.consume(TokenType.PAGE, 'Expected "page"');
    const name = this.consumeIdentifier('Expected page name');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');

    let styles: StyleBlock | undefined;
    let load: { parameters: Parameter[]; returnType: TypeAnnotation } | undefined;
    let view: { parameters: Parameter[]; body: Block } | undefined;

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.STYLES)) {
        styles = this.parseStyleBlock();
      } else if (this.match(TokenType.LOAD)) {
        load = this.parseLoad();
      } else if (this.match(TokenType.VIEW)) {
        view = this.parseView();
      } else {
        throw this.error('Expected styles, load, or view');
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    if (!view) {
      throw this.error('Page must have a view');
    }

    return {
      kind: 'page',
      name,
      styles,
      load,
      view,
    };
  }

  /**
   * Parse load function
   */
  private parseLoad(): { parameters: Parameter[]; returnType: TypeAnnotation } {
    this.consume(TokenType.LEFT_PAREN, 'Expected "("');
    const parameters = this.parseParameterList();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
    this.consume(TokenType.ARROW, 'Expected "->"');
    const returnType = this.parseTypeAnnotation();

    return { parameters, returnType };
  }

  /**
   * Parse view function
   */
  private parseView(): { parameters: Parameter[]; body: Block } {
    this.consume(TokenType.LEFT_PAREN, 'Expected "("');
    const parameters = this.parseParameterList();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
    const body = this.parseBlock();

    return { parameters, body };
  }

  /**
   * Parse parameter list
   */
  private parseParameterList(): Parameter[] {
    const parameters: Parameter[] = [];

    if (this.check(TokenType.RIGHT_PAREN)) {
      return parameters;
    }

    do {
      const name = this.consumeIdentifier('Expected parameter name');
      this.consume(TokenType.COLON, 'Expected ":"');
      const type = this.parseTypeAnnotation();
      parameters.push({ name, type });
    } while (this.match(TokenType.COMMA));

    return parameters;
  }

  /**
   * Parse block
   */
  private parseBlock(): Block {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');
    const statements: Statement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.parseStatement());
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');

    return { statements };
  }

  /**
   * Parse statement
   */
  private parseStatement(): Statement {
    if (this.match(TokenType.RETURN)) {
      const value = this.check(TokenType.SEMICOLON) || this.check(TokenType.RIGHT_BRACE) 
        ? undefined 
        : this.parseExpression();
      if (!this.check(TokenType.RIGHT_BRACE)) {
        this.consume(TokenType.SEMICOLON, 'Expected ";"');
      }
      return {
        kind: 'return',
        value,
      };
    }

    if (this.match(TokenType.LET)) {
      return this.parseVariableDeclaration();
    }

    if (this.match(TokenType.IF)) {
      return this.parseIfStatement();
    }

    if (this.match(TokenType.FOR)) {
      return this.parseForStatement();
    }

    // Check for assignment (identifier = expression)
    if (this.check(TokenType.IDENTIFIER) && this.peekNextTokenType() === TokenType.EQUAL) {
      const target = this.consumeIdentifier('Expected identifier');
      this.consume(TokenType.EQUAL, 'Expected "="');
      const value = this.parseExpression();
      this.consume(TokenType.SEMICOLON, 'Expected ";"');
      return {
        kind: 'assignment',
        target,
        value,
      };
    }

    // Try parsing as expression statement
    const expr = this.parseExpression();
    if (!this.check(TokenType.RIGHT_BRACE)) {
      this.consume(TokenType.SEMICOLON, 'Expected ";"');
    }
    return {
      kind: 'expression',
      expression: expr,
    };
  }

  /**
   * Parse variable declaration
   */
  private parseVariableDeclaration(): VariableDeclaration {
    const name = this.consumeIdentifier('Expected variable name');
    let type: TypeAnnotation | undefined;

    if (this.match(TokenType.COLON)) {
      type = this.parseTypeAnnotation();
    }

    this.consume(TokenType.EQUAL, 'Expected "="');
    const value = this.parseExpression();
    this.consume(TokenType.SEMICOLON, 'Expected ";"');

    return {
      kind: 'variable',
      name,
      type,
      value,
    };
  }

  /**
   * Parse if statement
   */
  private parseIfStatement(): IfStatement {
    this.consume(TokenType.LEFT_PAREN, 'Expected "("');
    const condition = this.parseExpression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
    const then = this.parseBlock();
    const elseBlock = this.match(TokenType.ELSE) ? this.parseBlock() : undefined;

    return {
      kind: 'if',
      condition,
      then,
      else: elseBlock,
    };
  }

  /**
   * Parse for statement
   */
  private parseForStatement(): ForStatement {
    this.consume(TokenType.LEFT_PAREN, 'Expected "("');
    const variable = this.consumeIdentifier('Expected variable name');
    this.consume(TokenType.IN, 'Expected "in"');
    const iterable = this.parseExpression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
    const body = this.parseBlock();

    return {
      kind: 'for',
      variable,
      iterable,
      body,
    };
  }

  /**
   * Parse if statement in JSX context (no parentheses, block already started)
   */
  private parseJsxIfStatement(): IfStatement {
    this.consume(TokenType.IF, 'Expected "if"');
    const condition = this.parseExpression();
    // In JSX, the block starts immediately after condition (no { needed, already consumed)
    const then = this.parseBlock();
    const elseBlock = this.match(TokenType.ELSE) ? this.parseBlock() : undefined;

    return {
      kind: 'if',
      condition,
      then,
      else: elseBlock,
    };
  }

  /**
   * Parse for statement in JSX context (no parentheses)
   */
  private parseJsxForStatement(): ForStatement {
    this.consume(TokenType.FOR, 'Expected "for"');
    const variable = this.consumeIdentifier('Expected variable name');
    this.consume(TokenType.IN, 'Expected "in"');
    const iterable = this.parseExpression();
    const body = this.parseBlock();

    return {
      kind: 'for',
      variable,
      iterable,
      body,
    };
  }

  /**
   * Parse expression (with precedence)
   */
  private parseExpression(): Expression {
    return this.parseAssignment();
  }

  /**
   * Parse assignment
   */
  private parseAssignment(): Expression {
    return this.parseOr();
  }

  /**
   * Parse OR expression
   */
  private parseOr(): Expression {
    let expr = this.parseAnd();

    while (this.match(TokenType.OR)) {
      const operator = '||';
      const right = this.parseAnd();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse AND expression
   */
  private parseAnd(): Expression {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = '&&';
      const right = this.parseEquality();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse equality
   */
  private parseEquality(): Expression {
    let expr = this.parseComparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous().type === TokenType.BANG_EQUAL ? '!=' : '==';
      const right = this.parseComparison();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse comparison
   */
  private parseComparison(): Expression {
    let expr = this.parseTerm();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const op = this.previous().type;
      const operator = op === TokenType.GREATER ? '>' :
                      op === TokenType.GREATER_EQUAL ? '>=' :
                      op === TokenType.LESS ? '<' : '<=';
      const right = this.parseTerm();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse term
   */
  private parseTerm(): Expression {
    let expr = this.parseFactor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous().type === TokenType.MINUS ? '-' : '+';
      const right = this.parseFactor();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse factor
   */
  private parseFactor(): Expression {
    let expr = this.parseUnary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous().type === TokenType.SLASH ? '/' : '*';
      const right = this.parseUnary();
      expr = {
        kind: 'binary',
        operator,
        left: expr,
        right,
      } as BinaryExpression;
    }

    return expr;
  }

  /**
   * Parse unary
   */
  private parseUnary(): Expression {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous().type === TokenType.BANG ? '!' : '-';
      const operand = this.parseUnary();
      return {
        kind: 'unary',
        operator,
        operand,
      } as UnaryExpression;
    }

    return this.parseCall();
  }

  /**
   * Parse call
   */
  private parseCall(): Expression {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consumeIdentifier('Expected property name');
        expr = {
          kind: 'member',
          object: expr,
          property: name,
        } as MemberAccess;
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * Finish function call
   */
  private finishCall(callee: Expression): FunctionCall {
    const args: Expression[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');

    return {
      kind: 'call',
      callee: (callee as Identifier).name || '',
      arguments: args,
    };
  }

  /**
   * Parse primary
   */
  private parsePrimary(): Expression {
    if (this.match(TokenType.FALSE)) {
      return { kind: 'boolean', value: false } as BooleanLiteral;
    }
    if (this.match(TokenType.TRUE)) {
      return { kind: 'boolean', value: true } as BooleanLiteral;
    }
    if (this.match(TokenType.NULL)) {
      return { kind: 'null' } as NullLiteral;
    }
    if (this.match(TokenType.UNDEFINED)) {
      return { kind: 'undefined' } as NullLiteral;
    }
    if (this.match(TokenType.NUMBER)) {
      return { kind: 'number', value: parseFloat(this.previous().value) } as NumberLiteral;
    }
    if (this.match(TokenType.STRING)) {
      return { kind: 'string', value: this.previous().value } as StringLiteral;
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
      return { kind: 'paren', expression: expr } as ParenthesizedExpression;
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return { kind: 'identifier', name: this.previous().value } as Identifier;
    }
    if (this.check(TokenType.LESS)) {
      return this.parseJsxElement();
    }

    throw this.error('Expected expression');
  }

  /**
   * Parse JSX element
   */
  private parseJsxElement(): JsxElement {
    this.consume(TokenType.LESS, 'Expected "<"');
    const tag = this.consumeIdentifier('Expected tag name');
    const attributes: JsxAttribute[] = [];

    // Parse attributes
    while (!this.check(TokenType.SLASH_ANGLE) && !this.check(TokenType.GREATER) && !this.isAtEnd()) {
      const attrName = this.consumeIdentifier('Expected attribute name');
      
      if (this.match(TokenType.EQUAL)) {
        if (this.match(TokenType.STRING)) {
          attributes.push({ name: attrName, value: this.previous().value });
        } else if (this.match(TokenType.LEFT_BRACE)) {
          const expr = this.parseExpression();
          this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
          attributes.push({ name: attrName, value: expr });
        } else if (this.match(TokenType.TRUE)) {
          attributes.push({ name: attrName, value: true });
        } else if (this.match(TokenType.FALSE)) {
          attributes.push({ name: attrName, value: false });
        }
      } else {
        attributes.push({ name: attrName, value: true });
      }
    }

    // Self-closing tag
    if (this.match(TokenType.SLASH_ANGLE)) {
      return {
        kind: 'jsx',
        tag,
        attributes,
        children: [],
        selfClosing: true,
      };
    }

    this.consume(TokenType.GREATER, 'Expected ">"');

    // Parse children
    const children: (JsxElement | JsxText | JsxExpression)[] = [];

    while (!this.check(TokenType.SLASH_ANGLE) && !this.isAtEnd()) {
      if (this.check(TokenType.LESS)) {
        if (this.peekNext().type === TokenType.SLASH) {
          break; // Closing tag
        }
        children.push(this.parseJsxElement());
      } else if (this.match(TokenType.LEFT_BRACE)) {
        // Check if it's an if or for statement (control flow in JSX)
        if (this.check(TokenType.IF)) {
          const ifStmt = this.parseJsxIfStatement();
          this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
          children.push({ kind: 'jsx-expression', expression: ifStmt });
        } else if (this.check(TokenType.FOR)) {
          const forStmt = this.parseJsxForStatement();
          this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
          children.push({ kind: 'jsx-expression', expression: forStmt });
        } else {
          const expr = this.parseExpression();
          this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
          children.push({ kind: 'jsx-expression', expression: expr });
        }
      } else {
        // Text content
        const start = this.current;
        while (!this.check(TokenType.LESS) && !this.check(TokenType.LEFT_BRACE) && !this.isAtEnd()) {
          this.advance();
        }
        const text = this.tokens.slice(start, this.current).map(t => t.value).join(' ').trim();
        if (text) {
          children.push({ kind: 'jsx-text', value: text });
        }
      }
    }

    // Closing tag
    this.consume(TokenType.SLASH_ANGLE, 'Expected "</"');
    const closingTag = this.consumeIdentifier('Expected closing tag name');
    this.consume(TokenType.GREATER, 'Expected ">"');

    if (closingTag !== tag) {
      throw this.error(`Mismatched tags: expected </${tag}>, got </${closingTag}>`);
    }

    return {
      kind: 'jsx',
      tag,
      attributes,
      children,
      selfClosing: false,
    };
  }

  /**
   * Check if current token matches any of the given types
   */
  private match(...types: TokenType[]): boolean {
    // Check if all types match in sequence
    for (let i = 0; i < types.length; i++) {
      if (!this.check(types[i])) {
        return false;
      }
      this.advance();
    }
    return true;
  }

  /**
   * Check if current token is of given type
   */
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * Peek at next token
   */
  private peekNext(): Token {
    if (this.current + 1 >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.current + 1];
  }

  /**
   * Peek at next token type
   */
  private peekNextTokenType(): TokenType {
    if (this.current + 1 >= this.tokens.length) {
      return TokenType.EOF;
    }
    return this.tokens[this.current + 1].type;
  }

  /**
   * Advance and return previous token
   */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * Check if at end of tokens
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Peek at current token
   */
  private peek(): Token {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  /**
   * Get previous token
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Consume token of expected type
   */
  private consume(type: TokenType, message: string): string {
    if (this.check(type)) return this.advance().value;
    throw this.error(message);
  }

  /**
   * Consume identifier
   */
  private consumeIdentifier(message: string): string {
    if (this.check(TokenType.IDENTIFIER)) {
      return this.advance().value;
    }
    throw this.error(message);
  }

  /**
   * Parse style block
   */
  private parseStyleBlock(): StyleBlock {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');
    const rules: CssRule[] = [];
    let currentMediaQuery: string | undefined;

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      // Check for @media
      if (this.check(TokenType.IDENTIFIER) && this.peek().value === '@media') {
        this.advance(); // consume '@media'
        currentMediaQuery = this.parseMediaQuery();
        this.consume(TokenType.LEFT_BRACE, 'Expected "{" after media query');
      }

      // Parse CSS rule
      const selector = this.parseCssSelector();
      this.consume(TokenType.LEFT_BRACE, 'Expected "{" after selector');
      
      const properties: CssProperty[] = [];
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        const property = this.parseCssProperty();
        properties.push(property);
      }
      
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after properties');
      
      rules.push({
        selector,
        properties,
        mediaQuery: currentMediaQuery,
      });

      // Reset media query after rule if we're closing the media block
      if (currentMediaQuery && this.check(TokenType.RIGHT_BRACE)) {
        const next = this.peekNext();
        if (next && next.type === TokenType.RIGHT_BRACE) {
          this.advance(); // consume closing brace of media query
          currentMediaQuery = undefined;
        }
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
    return { rules };
  }

  /**
   * Parse CSS selector
   */
  private parseCssSelector(): string {
    let selector = '';
    
    // Handle pseudo-selectors like :root, :hover
    if (this.match(TokenType.COLON)) {
      selector = ':' + this.consumeIdentifier('Expected pseudo-selector name');
      return selector;
    }
    
    // Handle class selector (.className)
    if (this.match(TokenType.DOT)) {
      selector = '.' + this.consumeIdentifier('Expected class name');
    } else if (this.check(TokenType.IDENTIFIER)) {
      selector = this.consumeIdentifier('Expected selector');
    } else {
      throw this.error('Expected CSS selector');
    }

    // Handle compound selectors (.class1.class2)
    while (this.match(TokenType.DOT)) {
      selector += '.' + this.consumeIdentifier('Expected class name');
    }

    // Handle pseudo-classes (.class:hover)
    if (this.match(TokenType.COLON)) {
      selector += ':' + this.consumeIdentifier('Expected pseudo-class name');
    }

    return selector;
  }

  /**
   * Parse CSS property
   */
  private parseCssProperty(): CssProperty {
    const name = this.consumeIdentifier('Expected property name');
    this.consume(TokenType.COLON, 'Expected ":"');
    
    // Parse value (can be string, number, identifier, or expression)
    let value = '';
    while (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.STRING)) {
        value += this.consume(TokenType.STRING, 'Expected string');
      } else if (this.check(TokenType.NUMBER)) {
        value += this.consume(TokenType.NUMBER, 'Expected number');
      } else if (this.check(TokenType.IDENTIFIER)) {
        value += this.consume(TokenType.IDENTIFIER, 'Expected identifier');
      } else {
        value += this.advance().value;
      }
      // Add space between tokens in value if not at end
      if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE)) {
        value += ' ';
      }
    }
    
    this.consume(TokenType.SEMICOLON, 'Expected ";" after property value');
    
    return {
      name: name.trim(),
      value: value.trim(),
    };
  }

  /**
   * Parse media query
   */
  private parseMediaQuery(): string {
    let query = '';
    this.consume(TokenType.LEFT_PAREN, 'Expected "("');
    
    while (!this.check(TokenType.RIGHT_PAREN) && !this.isAtEnd()) {
      query += this.advance().value;
    }
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
    return query.trim();
  }

  /**
   * Parse global styles module
   */
  private parseGlobalStylesModule(): GlobalStylesModule {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{"');
    const rules: CssRule[] = [];
    let currentMediaQuery: string | undefined;

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      // Check for @media
      const peekToken = this.peek();
      if (this.check(TokenType.IDENTIFIER) && peekToken.value === '@media') {
        this.advance();
        currentMediaQuery = this.parseMediaQuery();
        this.consume(TokenType.LEFT_BRACE, 'Expected "{" after media query');
      }

      // Parse selector (can be :root, body, etc.)
      const selector = this.parseCssSelector();
      this.consume(TokenType.LEFT_BRACE, 'Expected "{" after selector');
      
      const properties: CssProperty[] = [];
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        const property = this.parseCssProperty();
        properties.push(property);
      }
      
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after properties');
      
      rules.push({
        selector,
        properties,
        mediaQuery: currentMediaQuery,
      });

      if (currentMediaQuery && this.check(TokenType.RIGHT_BRACE)) {
        const next = this.peekNext();
        if (next && next.type === TokenType.RIGHT_BRACE) {
          this.advance(); // Close media query
          currentMediaQuery = undefined;
        }
      }
    }

    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
    return {
      kind: 'styles',
      scope: 'global',
      rules,
    };
  }

  /**
   * Create parse error
   */
  private error(message: string): Error {
    const token = this.peek();
    return new Error(`[Line ${token.line}, Column ${token.column}] ${message}`);
  }
}
