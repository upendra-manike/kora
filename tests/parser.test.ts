import { describe, it, expect } from 'vitest';
import { Parser } from '../src/parser';

describe('Parser', () => {
  it('should parse domain module', () => {
    const source = `
      module domain User {
        type User {
          id: UUID
          name: String
          email: Email
        }
      }
    `;
    
    const parser = new Parser();
    const ast = parser.parse(source);
    
    expect(ast.modules.length).toBe(1);
    expect(ast.modules[0].kind).toBe('domain');
    if (ast.modules[0].kind === 'domain') {
      expect(ast.modules[0].name).toBe('User');
      expect(ast.modules[0].types.length).toBe(1);
      expect(ast.modules[0].types[0].name).toBe('User');
    }
  });

  it('should parse API module', () => {
    const source = `
      api getUser {
        input {
          id: UUID
        }
        output User
        handler {
          return UserRepo.findById(id)
        }
      }
    `;
    
    const parser = new Parser();
    const ast = parser.parse(source);
    
    expect(ast.modules.length).toBe(1);
    expect(ast.modules[0].kind).toBe('api');
  });

  it('should parse page module', () => {
    const source = `
      page UserProfile {
        load(id: UUID) -> User
        view(user: User) {
          <div>
            <h1>{user.name}</h1>
          </div>
        }
      }
    `;
    
    const parser = new Parser();
    const ast = parser.parse(source);
    
    expect(ast.modules.length).toBe(1);
    expect(ast.modules[0].kind).toBe('page');
    if (ast.modules[0].kind === 'page') {
      expect(ast.modules[0].name).toBe('UserProfile');
      expect(ast.modules[0].view).toBeDefined();
    }
  });

  it('should parse page with styles', () => {
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
    const ast = parser.parse(source);
    
    expect(ast.modules.length).toBe(1);
    if (ast.modules[0].kind === 'page') {
      expect(ast.modules[0].styles).toBeDefined();
    }
  });

  it('should throw error on invalid syntax', () => {
    const source = 'invalid syntax {';
    const parser = new Parser();
    
    expect(() => parser.parse(source)).toThrow();
  });

  it('should parse multiple modules', () => {
    const source = `
      module domain User {
        type User { id: UUID }
      }
      api getUser {
        input { id: UUID }
        output User
        handler {}
      }
    `;
    
    const parser = new Parser();
    const ast = parser.parse(source);
    
    expect(ast.modules.length).toBe(2);
  });
});

