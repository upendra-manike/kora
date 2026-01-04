import { describe, it, expect } from 'vitest';
import { Parser } from '../src/parser';
import { Compiler } from '../src/compiler';

describe('Compiler', () => {
  it('should compile domain module to TypeScript', () => {
    const source = `
      module domain User {
        type User {
          id: UUID
          name: String
        }
      }
    `;
    
    const parser = new Parser();
    const compiler = new Compiler();
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    expect(result.typescript).toContain('interface User');
    expect(result.typescript).toContain('id: string');
    expect(result.typescript).toContain('name: string');
  });

  it('should compile API module', () => {
    const source = `
      api getUser {
        input { id: UUID }
        output User
        handler {}
      }
    `;
    
    const parser = new Parser();
    const compiler = new Compiler();
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    expect(result.typescript).toContain('getUser');
    expect(result.typescript).toContain('input');
  });

  it('should compile page module to React component', () => {
    const source = `
      page UserProfile {
        view(user: User) {
          <div>
            <h1>{user.name}</h1>
          </div>
        }
      }
    `;
    
    const parser = new Parser();
    const compiler = new Compiler();
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    expect(result.typescript).toContain('import React');
    expect(result.typescript).toContain('export function UserProfile');
    expect(result.typescript).toContain('user.name');
  });

  it('should compile page with styles', () => {
    const source = `
      page StyledPage {
        styles {
          .container {
            padding: 1rem;
          }
        }
        view() {
          <div className="container">Hello</div>
        }
      }
    `;
    
    const parser = new Parser();
    const compiler = new Compiler();
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    expect(result.typescript).toContain('import styles');
    expect(result.css.size).toBeGreaterThan(0);
  });

  it('should compile global styles', () => {
    const source = `
      styles global {
        :root {
          --color: #fff;
        }
      }
    `;
    
    const parser = new Parser();
    const compiler = new Compiler();
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    expect(result.css.size).toBeGreaterThan(0);
  });
});

