/**
 * Build System for Kora
 * 
 * Handles multi-file compilation, dependency resolution, and output generation.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, relative } from 'path';
import { Parser } from './parser';
import { Compiler } from './compiler';

export interface BuildOptions {
  srcDir?: string;
  outDir?: string;
  watch?: boolean;
}

export interface BuildResult {
  success: boolean;
  files: number;
  errors: string[];
  warnings: string[];
}

/**
 * Find all .kora files in a directory recursively
 */
function findKoraFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!existsSync(dir)) {
    return files;
  }
  
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findKoraFiles(fullPath));
    } else if (extname(entry) === '.kora') {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Build a single Kora file
 */
function buildFile(filePath: string, outDir: string): { success: boolean; error?: string } {
  try {
    const source = readFileSync(filePath, 'utf-8');
    const parser = new Parser();
    const compiler = new Compiler();
    
    const ast = parser.parse(source);
    const result = compiler.compile(ast);
    
    // Determine output path
    const relativePath = relative(process.cwd(), filePath);
    const baseName = relativePath.replace(/\.kora$/, '');
    const tsOutputPath = join(outDir, baseName + '.ts');
    const tsOutputDir = dirname(tsOutputPath);
    
    // Create output directory
    if (!existsSync(tsOutputDir)) {
      mkdirSync(tsOutputDir, { recursive: true });
    }
    
    // Write TypeScript output
    writeFileSync(tsOutputPath, result.typescript);
    
    // Write CSS files
    for (const [cssFile, cssContent] of result.css.entries()) {
      const cssPath = join(tsOutputDir, cssFile);
      writeFileSync(cssPath, cssContent);
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Build entire Kora project
 */
export async function buildProject(options: BuildOptions = {}): Promise<BuildResult> {
  const srcDir = options.srcDir || 'src';
  const outDir = options.outDir || 'dist';
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Find all .kora files
  const koraFiles = findKoraFiles(srcDir);
  
  if (koraFiles.length === 0) {
    warnings.push(`No .kora files found in ${srcDir}`);
    return {
      success: true,
      files: 0,
      errors,
      warnings,
    };
  }
  
  // Create output directory
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  
  // Build each file
  let successCount = 0;
  for (const file of koraFiles) {
    const result = buildFile(file, outDir);
    if (result.success) {
      successCount++;
    } else {
      errors.push(`${file}: ${result.error}`);
    }
  }
  
  return {
    success: errors.length === 0,
    files: successCount,
    errors,
    warnings,
  };
}

