import { describe, it, expect } from 'vitest';
import { Tokenizer, TokenType } from '../src/tokenizer';

describe('Tokenizer', () => {
  it('should tokenize basic keywords', () => {
    const tokenizer = new Tokenizer('module domain User');
    const tokens = tokenizer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.MODULE);
    expect(tokens[1].type).toBe(TokenType.DOMAIN);
    expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].value).toBe('User');
  });

  it('should tokenize type definitions', () => {
    const source = `
      module domain User {
        type User {
          id: UUID
          name: String
        }
      }
    `;
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    const types = tokens.filter(t => t.type === TokenType.TYPE);
    expect(types.length).toBeGreaterThan(0);
  });

  it('should tokenize strings', () => {
    const tokenizer = new Tokenizer('"hello world"');
    const tokens = tokenizer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('hello world');
  });

  it('should tokenize numbers', () => {
    const tokenizer = new Tokenizer('123 45.67');
    const tokens = tokenizer.tokenize();
    
    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].value).toBe('123');
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].value).toBe('45.67');
  });

  it('should handle JSX syntax', () => {
    const source = '<div className="test">{value}</div>';
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    const jsxTokens = tokens.filter(t => 
      t.type === TokenType.LESS_THAN || 
      t.type === TokenType.GREATER_THAN
    );
    expect(jsxTokens.length).toBeGreaterThan(0);
  });

  it('should track line and column numbers', () => {
    const source = `line1
line2
line3`;
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    expect(tokens[0].line).toBe(1);
    // Find token on line 2
    const line2Token = tokens.find(t => t.line === 2);
    expect(line2Token).toBeDefined();
  });
});


