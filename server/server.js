#!/usr/bin/env node

/**
 * Kora Language API Server
 * 
 * REST API server for compiling Kora code
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Load Kora module (ES modules require async import)
let Parser, Compiler;

/**
 * Safely extract error message from unknown error type
 * @param {unknown} error - The error value (could be Error, string, or any type)
 * @returns {string} - The error message as a string
 */
function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Unknown error';
}

/**
 * Safely extract error stack from unknown error type
 * @param {unknown} error - The error value (could be Error, string, or any type)
 * @returns {string|undefined} - The error stack if available
 */
function getErrorStack(error) {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

async function loadKoraModule() {
  try {
    // Try to load from dist first (for local development)
    const kora = await import('../dist/index.js');
    Parser = kora.Parser;
    Compiler = kora.Compiler;
    console.log('✅ Loaded Kora from dist/');
  } catch (e) {
    try {
      // Fallback to npm package if dist doesn't exist
      const kora = await import('@kora-lang/kora');
      Parser = kora.Parser;
      Compiler = kora.Compiler;
      console.log('✅ Loaded Kora from npm package');
    } catch (e2) {
      console.error('❌ Failed to load Kora module:', getErrorMessage(e2));
      throw new Error('Kora module not available. Please build the project or install @kora-lang/kora');
    }
  }
}

// Initialize and start server
async function startServer() {
  // Load Kora module first
  await loadKoraModule();
  
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later.'
  });
  app.use('/api/', limiter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'kora-api', version: '0.1.0' });
  });

  // Compile endpoint
  app.post('/api/compile', (req, res) => {
    try {
      const { code } = req.body;

      // Validate input
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Code is required and must be a string'
        });
      }

      if (code.length > 100000) {
        return res.status(400).json({
          success: false,
          error: 'Code is too long (max 100KB)'
        });
      }

      // Parse and compile
      const parser = new Parser();
      const compiler = new Compiler();
      
      const ast = parser.parse(code);
      const result = compiler.compile(ast);
      
      res.json({
        success: true,
        typescript: result.typescript,
        css: Object.fromEntries(result.css),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: getErrorMessage(error),
        stack: process.env.NODE_ENV === 'development' ? getErrorStack(error) : undefined
      });
    }
  });

  // Check syntax endpoint
  app.post('/api/check', (req, res) => {
    try {
      const { code } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Code is required and must be a string'
        });
      }

      const parser = new Parser();
      const ast = parser.parse(code);
      
      res.json({
        success: true,
        valid: true,
        modules: ast.modules.length
      });
    } catch (error) {
      res.json({
        success: false,
        valid: false,
        error: getErrorMessage(error)
      });
    }
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Kora API Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Compile: POST http://localhost:${PORT}/api/compile`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', getErrorMessage(err));
  process.exit(1);
});

