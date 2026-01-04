/**
 * Kora Language Type Definitions
 */

/**
 * Primitive types in Kora
 */
export type PrimitiveType = 
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'UUID'
  | 'Email'
  | 'Date'
  | 'Void';

/**
 * Type annotation
 */
export interface TypeAnnotation {
  kind: 'primitive' | 'custom' | 'generic' | 'optional';
  name?: string;
  primitive?: PrimitiveType;
  genericArgs?: TypeAnnotation[];
  inner?: TypeAnnotation;
}

/**
 * Field declaration
 */
export interface FieldDeclaration {
  name: string;
  type: TypeAnnotation;
}

/**
 * Domain module
 */
export interface DomainModule {
  kind: 'domain';
  name: string;
  types: TypeDefinition[];
  constants: ConstantDeclaration[];
}

/**
 * Type definition
 */
export interface TypeDefinition {
  name: string;
  fields: FieldDeclaration[];
}

/**
 * Constant declaration
 */
export interface ConstantDeclaration {
  name: string;
  type: TypeAnnotation;
  value: Expression;
}

/**
 * API module
 */
export interface ApiModule {
  kind: 'api';
  name: string;
  input?: FieldDeclaration[];
  output?: TypeAnnotation;
  handler?: Block;
}

/**
 * UI module
 */
export interface UiModule {
  kind: 'ui';
  name: string;
  // UI-specific declarations
}

/**
 * CSS Rule
 */
export interface CssRule {
  selector: string;
  properties: CssProperty[];
  mediaQuery?: string;
}

/**
 * CSS Property
 */
export interface CssProperty {
  name: string;
  value: string;
}

/**
 * Style Block
 */
export interface StyleBlock {
  rules: CssRule[];
}

/**
 * Global Styles Module
 */
export interface GlobalStylesModule {
  kind: 'styles';
  scope: 'global';
  rules: CssRule[];
}

/**
 * Page module
 */
export interface PageModule {
  kind: 'page';
  name: string;
  styles?: StyleBlock;
  load?: {
    parameters: Parameter[];
    returnType: TypeAnnotation;
  };
  view: {
    parameters: Parameter[];
    body: Block;
  };
}

/**
 * Parameter
 */
export interface Parameter {
  name: string;
  type: TypeAnnotation;
}

/**
 * Block (statement list)
 */
export interface Block {
  statements: Statement[];
}

/**
 * Statement
 */
export type Statement =
  | VariableDeclaration
  | Assignment
  | ReturnStatement
  | IfStatement
  | ForStatement
  | ExpressionStatement
  | JsxElement;

/**
 * Variable declaration
 */
export interface VariableDeclaration {
  kind: 'variable';
  name: string;
  type?: TypeAnnotation;
  value: Expression;
}

/**
 * Assignment
 */
export interface Assignment {
  kind: 'assignment';
  target: string;
  value: Expression;
}

/**
 * Return statement
 */
export interface ReturnStatement {
  kind: 'return';
  value?: Expression;
}

/**
 * If statement
 */
export interface IfStatement {
  kind: 'if';
  condition: Expression;
  then: Block;
  else?: Block;
}

/**
 * For statement
 */
export interface ForStatement {
  kind: 'for';
  variable: string;
  iterable: Expression;
  body: Block;
}

/**
 * Expression statement
 */
export interface ExpressionStatement {
  kind: 'expression';
  expression: Expression;
}

/**
 * Expression
 */
export type Expression =
  | BinaryExpression
  | UnaryExpression
  | FunctionCall
  | MemberAccess
  | Identifier
  | Literal
  | JsxElement
  | ParenthesizedExpression;

/**
 * Binary expression
 */
export interface BinaryExpression {
  kind: 'binary';
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

/**
 * Binary operator
 */
export type BinaryOperator =
  | '+'
  | '-'
  | '*'
  | '/'
  | '=='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>='
  | '&&'
  | '||';

/**
 * Unary expression
 */
export interface UnaryExpression {
  kind: 'unary';
  operator: UnaryOperator;
  operand: Expression;
}

/**
 * Unary operator
 */
export type UnaryOperator = '!' | '-';

/**
 * Function call
 */
export interface FunctionCall {
  kind: 'call';
  callee: string;
  arguments: Expression[];
}

/**
 * Member access
 */
export interface MemberAccess {
  kind: 'member';
  object: Expression;
  property: string;
}

/**
 * Identifier
 */
export interface Identifier {
  kind: 'identifier';
  name: string;
}

/**
 * Literal
 */
export type Literal =
  | StringLiteral
  | NumberLiteral
  | BooleanLiteral
  | NullLiteral;

/**
 * String literal
 */
export interface StringLiteral {
  kind: 'string';
  value: string;
}

/**
 * Number literal
 */
export interface NumberLiteral {
  kind: 'number';
  value: number;
}

/**
 * Boolean literal
 */
export interface BooleanLiteral {
  kind: 'boolean';
  value: boolean;
}

/**
 * Null literal
 */
export interface NullLiteral {
  kind: 'null' | 'undefined';
}

/**
 * JSX Element
 */
export interface JsxElement {
  kind: 'jsx';
  tag: string;
  attributes: JsxAttribute[];
  children: JsxContent[];
  selfClosing: boolean;
}

/**
 * JSX Attribute
 */
export interface JsxAttribute {
  name: string;
  value?: string | Expression | boolean;
}

/**
 * JSX Content
 */
export type JsxContent = JsxElement | JsxText | JsxExpression;

/**
 * JSX Text
 */
export interface JsxText {
  kind: 'jsx-text';
  value: string;
}

/**
 * JSX Expression
 */
export interface JsxExpression {
  kind: 'jsx-expression';
  expression: Expression | IfStatement | ForStatement;
}

/**
 * Parenthesized expression
 */
export interface ParenthesizedExpression {
  kind: 'paren';
  expression: Expression;
}

/**
 * Module (union type)
 */
export type Module = DomainModule | ApiModule | UiModule | PageModule | GlobalStylesModule;

/**
 * Program (AST root)
 */
export interface Program {
  modules: Module[];
}

