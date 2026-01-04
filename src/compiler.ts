/**
 * Kora Compiler
 * 
 * Compiles Kora AST to TypeScript/JavaScript.
 */

import type {
  Program,
  Module,
  DomainModule,
  ApiModule,
  UiModule,
  PageModule,
  Block,
  Statement,
  Expression,
  JsxElement,
  JsxContent,
  JsxAttribute,
  BinaryExpression,
  UnaryExpression,
  FunctionCall,
  MemberAccess,
  VariableDeclaration,
  ReturnStatement,
  IfStatement,
  ForStatement,
  ExpressionStatement,
  Assignment,
  StyleBlock,
  CssRule,
  CssProperty,
  GlobalStylesModule,
} from './types';

/**
 * Compiler output
 */
export interface CompilerOutput {
  typescript: string;
  css: Map<string, string>; // filename -> CSS content
}

/**
 * Compiler output
 */
export interface CompilerOutput {
  typescript: string;
  css: Map<string, string>; // filename -> CSS content
}

/**
 * Compiler for Kora language
 */
export class Compiler {
  /**
   * Compile Kora program to TypeScript and CSS
   */
  compile(program: Program): CompilerOutput {
    const output: string[] = [];
    const cssFiles = new Map<string, string>();

    for (const module of program.modules) {
      if (module.kind === 'page' && module.styles) {
        // Generate CSS file for page with styles
        const cssModuleName = `${module.name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}.module.css`;
        const css = this.compileCss(module.styles, module.name);
        cssFiles.set(cssModuleName, css);
      } else if (module.kind === 'styles') {
        // Generate global CSS file
        const css = this.compileGlobalStylesModule(module);
        cssFiles.set('global.css', css);
      }
      
      output.push(this.compileModule(module));
      output.push(''); // Empty line between modules
    }

    return {
      typescript: output.join('\n'),
      css: cssFiles,
    };
  }

  /**
   * Compile Kora program to TypeScript (legacy method for backward compatibility)
   */
  compileLegacy(program: Program): string {
    const result = this.compile(program);
    return result.typescript;
  }

  /**
   * Compile a module
   */
  private compileModule(module: Module): string {
    switch (module.kind) {
      case 'domain':
        return this.compileDomainModule(module);
      case 'api':
        return this.compileApiModule(module);
      case 'ui':
        return this.compileUiModule(module);
      case 'page':
        return this.compilePageModule(module);
      case 'styles':
        return this.compileGlobalStylesModule(module);
    }
  }

  /**
   * Compile CSS from style block
   */
  compileCss(styleBlock: StyleBlock, moduleName: string): string {
    const output: string[] = [];
    const hash = this.generateHash(moduleName);
    const prefix = `${moduleName.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}`;

    for (const rule of styleBlock.rules) {
      if (rule.mediaQuery) {
        output.push(`@media ${rule.mediaQuery} {`);
      }

      // Scoped selector
      const scopedSelector = this.scopeSelector(rule.selector, prefix, hash);
      output.push(`  ${scopedSelector} {`);

      for (const property of rule.properties) {
        output.push(`    ${property.name}: ${property.value};`);
      }

      output.push('  }');

      if (rule.mediaQuery) {
        output.push('}');
      }
    }

    return output.join('\n');
  }

  /**
   * Scope CSS selector
   */
  private scopeSelector(selector: string, prefix: string, hash: string): string {
    // Handle :root and other pseudo-selectors
    if (selector.startsWith(':')) {
      return selector;
    }

    // Handle class selectors
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      return `.${prefix}_${className}__${hash}`;
    }

    // Handle element selectors
    return `${selector}.${prefix}__${hash}`;
  }

  /**
   * Generate hash for scoping
   */
  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  }

  /**
   * Compile global styles module
   */
  private compileGlobalStylesModule(module: GlobalStylesModule): string {
    const output: string[] = [];

    for (const rule of module.rules) {
      if (rule.mediaQuery) {
        output.push(`@media ${rule.mediaQuery} {`);
      }

      output.push(`${rule.selector} {`);

      for (const property of rule.properties) {
        output.push(`  ${property.name}: ${property.value};`);
      }

      output.push('}');

      if (rule.mediaQuery) {
        output.push('}');
      }
    }

    return output.join('\n');
  }

  /**
   * Compile domain module to TypeScript
   */
  private compileDomainModule(module: DomainModule): string {
    const output: string[] = [];

    // Compile types
    for (const type of module.types) {
      output.push(`export interface ${type.name} {`);
      for (const field of type.fields) {
        const tsType = this.compileType(field.type);
        output.push(`  ${field.name}: ${tsType};`);
      }
      output.push('}');
      output.push('');
    }

    // Compile constants
    for (const constant of module.constants) {
      const tsType = this.compileType(constant.type);
      const value = this.compileExpression(constant.value);
      output.push(`export const ${constant.name}: ${tsType} = ${value};`);
      output.push('');
    }

    return output.join('\n');
  }

  /**
   * Compile API module to TypeScript
   */
  private compileApiModule(module: ApiModule): string {
    const output: string[] = [];

    // Compile input type
    if (module.input && module.input.length > 0) {
      output.push(`export interface ${module.name}Input {`);
      for (const field of module.input) {
        const tsType = this.compileType(field.type);
        output.push(`  ${field.name}: ${tsType};`);
      }
      output.push('}');
      output.push('');
    }

    // Compile output type
    if (module.output) {
      const outputType = this.compileType(module.output);
      output.push(`export type ${module.name}Output = ${outputType};`);
      output.push('');
    }

    // Compile handler function
    output.push(`export async function ${module.name}Handler(`);
    if (module.input && module.input.length > 0) {
      output.push(`  input: ${module.name}Input`);
    }
    output.push(`): Promise<${module.name}Output | undefined> {`);
    
    if (module.handler) {
      const body = this.compileBlock(module.handler, 2);
      output.push(body);
    } else {
      output.push('  // TODO: Implement handler');
    }
    
    output.push('}');

    return output.join('\n');
  }

  /**
   * Compile UI module to TypeScript
   */
  private compileUiModule(module: UiModule): string {
    return `// UI Module: ${module.name}\n// TODO: Implement UI module compilation`;
  }

  /**
   * Compile page module to TypeScript/React
   */
  private compilePageModule(module: PageModule): string {
    const output: string[] = [];

    // Add React import
    output.push("import React from 'react';");
    
    // Add CSS module import if styles exist
    if (module.styles) {
      const cssModuleName = `${module.name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}.module.css`;
      output.push(`import styles from './${cssModuleName}';`);
    }
    output.push('');

    // Compile load function
    if (module.load) {
      const params = module.load.parameters
        .map((p) => `${p.name}: ${this.compileType(p.type)}`)
        .join(', ');
      const returnType = this.compileType(module.load.returnType);

      output.push(`export async function load${module.name}(${params}): Promise<${returnType}> {`);
      output.push('  // TODO: Implement load function');
      output.push('  throw new Error("Not implemented");');
      output.push('}');
      output.push('');
    }

    // Compile React component
    const viewParams = module.view.parameters
      .map((p) => `${p.name}: ${this.compileType(p.type)}`)
      .join(', ');

    output.push(`export function ${module.name}({ ${viewParams} }: { ${viewParams} }) {`);
    output.push('  return (');
    
    if (module.view.body) {
      // Replace className references with styles object if CSS module exists
      const jsx = this.compileJsxContent(module.view.body.statements, 4, module.styles ? module.name : undefined);
      output.push(jsx);
    }
    
    output.push('  );');
    output.push('}');

    return output.join('\n');
  }

  /**
   * Compile block
   */
  private compileBlock(block: Block, indent: number = 0): string {
    const indentStr = ' '.repeat(indent);
    const output: string[] = [];

    for (const statement of block.statements) {
      output.push(indentStr + this.compileStatement(statement));
    }

    return output.join('\n');
  }

  /**
   * Compile statement
   */
  private compileStatement(statement: Statement): string {
    switch (statement.kind) {
      case 'variable':
        return this.compileVariableDeclaration(statement);
      case 'assignment':
        return this.compileAssignment(statement);
      case 'return':
        return this.compileReturnStatement(statement);
      case 'if':
        return this.compileIfStatement(statement);
      case 'for':
        return this.compileForStatement(statement);
      case 'expression':
        return this.compileExpressionStatement(statement);
      case 'jsx':
        return this.compileJsxElement(statement, 0);
      default:
        return '// Unknown statement';
    }
  }

  /**
   * Compile variable declaration
   */
  private compileVariableDeclaration(stmt: VariableDeclaration): string {
    const type = stmt.type ? `: ${this.compileType(stmt.type)}` : '';
    const value = this.compileExpression(stmt.value);
    return `let ${stmt.name}${type} = ${value};`;
  }

  /**
   * Compile assignment
   */
  private compileAssignment(stmt: Assignment): string {
    const value = this.compileExpression(stmt.value);
    return `${stmt.target} = ${value};`;
  }

  /**
   * Compile return statement
   */
  private compileReturnStatement(stmt: ReturnStatement): string {
    if (stmt.value) {
      return `return ${this.compileExpression(stmt.value)};`;
    }
    return 'return;';
  }

  /**
   * Compile if statement
   */
  private compileIfStatement(stmt: IfStatement): string {
    const condition = this.compileExpression(stmt.condition);
    const then = this.compileBlock(stmt.then, 2);
    let output = `if (${condition}) {\n${then}\n}`;
    
    if (stmt.else) {
      const elseBlock = this.compileBlock(stmt.else, 2);
      output += ` else {\n${elseBlock}\n}`;
    }
    
    return output;
  }

  /**
   * Compile for statement
   */
  private compileForStatement(stmt: ForStatement): string {
    const iterable = this.compileExpression(stmt.iterable);
    const body = this.compileBlock(stmt.body, 2);
    return `for (const ${stmt.variable} of ${iterable}) {\n${body}\n}`;
  }

  /**
   * Compile expression statement
   */
  private compileExpressionStatement(stmt: ExpressionStatement): string {
    return `${this.compileExpression(stmt.expression)};`;
  }

  /**
   * Compile JSX content from statements
   */
  private compileJsxContent(statements: Statement[], indent: number): string {
    const indentStr = ' '.repeat(indent);
    const output: string[] = [];

    for (const stmt of statements) {
      if (stmt.kind === 'jsx') {
        output.push(indentStr + this.compileJsxElement(stmt));
      } else if (stmt.kind === 'expression') {
        // Could be JSX expression
        const expr = this.compileExpression(stmt.expression);
        output.push(indentStr + `{${expr}}`);
      }
    }

    return output.join('\n') || indentStr + '<div></div>';
  }

  /**
   * Compile JSX element
   */
  private compileJsxElement(element: JsxElement, indent: number = 0, moduleName?: string): string {
    const indentStr = ' '.repeat(indent);
    const attrs = element.attributes.map(attr => this.compileJsxAttribute(attr, indent, moduleName)).filter(a => a).join(' ');
    const tag = element.tag;
    
    if (element.selfClosing) {
      return `${indentStr}<${tag}${attrs ? ' ' + attrs : ''} />`;
    }

    const children = element.children.map(child => this.compileJsxChild(child, indent + 2, moduleName)).filter(c => c).join('\n');
    if (children) {
      return `${indentStr}<${tag}${attrs ? ' ' + attrs : ''}>\n${children}\n${indentStr}</${tag}>`;
    }
    return `${indentStr}<${tag}${attrs ? ' ' + attrs : ''}></${tag}>`;
  }

  /**
   * Compile JSX attribute
   */
  private compileJsxAttribute(attr: JsxAttribute): string {
    if (attr.value === undefined || attr.value === true) {
      return attr.name;
    }
    if (typeof attr.value === 'string') {
      return `${attr.name}="${attr.value}"`;
    }
    if (typeof attr.value === 'boolean' && !attr.value) {
      return '';
    }
    // Expression
    return `${attr.name}={${this.compileExpression(attr.value as Expression)}}`;
  }

  /**
   * Compile JSX child
   */
  private compileJsxChild(child: JsxContent, indent: number = 0, moduleName?: string): string {
    if (child.kind === 'jsx') {
      return this.compileJsxElement(child, indent, moduleName);
    }
    if (child.kind === 'jsx-text') {
      const text = child.value.trim();
      return text ? ' '.repeat(indent) + text : '';
    }
    if (child.kind === 'jsx-expression') {
      return ' '.repeat(indent) + `{${this.compileExpression(child.expression)}}`;
    }
    return '';
  }

  /**
   * Compile expression
   */
  private compileExpression(expr: Expression): string {
    switch (expr.kind) {
      case 'binary':
        return this.compileBinaryExpression(expr);
      case 'unary':
        return this.compileUnaryExpression(expr);
      case 'call':
        return this.compileFunctionCall(expr);
      case 'member':
        return this.compileMemberAccess(expr);
      case 'identifier':
        return expr.name;
      case 'string':
        return `"${expr.value}"`;
      case 'number':
        return expr.value.toString();
      case 'boolean':
        return expr.value.toString();
      case 'null':
      case 'undefined':
        return expr.kind;
      case 'paren':
        return `(${this.compileExpression(expr.expression)})`;
      case 'jsx':
        return this.compileJsxElement(expr);
      default:
        return '/* unknown expression */';
    }
  }

  /**
   * Compile binary expression
   */
  private compileBinaryExpression(expr: BinaryExpression): string {
    const left = this.compileExpression(expr.left);
    const right = this.compileExpression(expr.right);
    return `${left} ${expr.operator} ${right}`;
  }

  /**
   * Compile unary expression
   */
  private compileUnaryExpression(expr: UnaryExpression): string {
    const operand = this.compileExpression(expr.operand);
    return `${expr.operator}${operand}`;
  }

  /**
   * Compile function call
   */
  private compileFunctionCall(expr: FunctionCall): string {
    const args = expr.arguments.map(arg => this.compileExpression(arg)).join(', ');
    return `${expr.callee}(${args})`;
  }

  /**
   * Compile member access
   */
  private compileMemberAccess(expr: MemberAccess): string {
    const object = this.compileExpression(expr.object);
    return `${object}.${expr.property}`;
  }

  /**
   * Compile Kora type to TypeScript type
   */
  private compileType(type: any): string {
    if (!type) return 'any';

    switch (type.kind) {
      case 'primitive':
        return this.compilePrimitiveType(type.primitive || '');
      case 'custom':
        return type.name || 'any';
      case 'generic':
        const args = (type.genericArgs || [])
          .map((arg: any) => this.compileType(arg))
          .join(', ');
        return `${type.name}<${args}>`;
      case 'optional':
        return `${this.compileType(type.inner)} | null | undefined`;
      default:
        return 'any';
    }
  }

  /**
   * Compile primitive type
   */
  private compilePrimitiveType(primitive: string): string {
    const mapping: Record<string, string> = {
      String: 'string',
      Number: 'number',
      Boolean: 'boolean',
      UUID: 'string',
      Email: 'string',
      Date: 'Date',
      Void: 'void',
    };

    return mapping[primitive] || 'any';
  }
}
