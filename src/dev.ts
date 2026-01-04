/**
 * Development Server for Kora
 * 
 * Watches for file changes and recompiles automatically.
 */

import { watch } from 'chokidar';
import { buildProject, BuildOptions } from './build';
import chalk from 'chalk';

export interface DevOptions extends BuildOptions {
  port?: number;
}

/**
 * Start development server with file watching
 */
export async function startDevServer(options: DevOptions = {}): Promise<void> {
  const srcDir = options.srcDir || 'src';
  const outDir = options.outDir || 'dist';
  
  console.log(chalk.blue('🚀 Starting Kora dev server...'));
  console.log(chalk.gray(`   Watching: ${srcDir}/`));
  console.log(chalk.gray(`   Output: ${outDir}/`));
  console.log('');
  
  // Initial build
  console.log(chalk.yellow('📦 Building project...'));
  const initialResult = await buildProject({ srcDir, outDir });
  
  if (initialResult.success) {
    console.log(chalk.green(`✅ Initial build complete: ${initialResult.files} file(s)`));
  } else {
    console.error(chalk.red('❌ Initial build failed:'));
    initialResult.errors.forEach(e => console.error(chalk.red(`   ${e}`)));
    console.error(chalk.red('\n⚠️  Cannot start dev server with build errors. Please fix errors and try again.'));
    process.exit(1);
  }
  
  console.log('');
  console.log(chalk.blue('👀 Watching for changes...'));
  console.log(chalk.gray('   Press Ctrl+C to stop'));
  console.log('');
  
  // Watch for changes
  const watcher = watch(`${srcDir}/**/*.kora`, {
    ignored: /node_modules/,
    persistent: true,
  });
  
  let isBuilding = false;
  
  watcher.on('change', async (path) => {
    if (isBuilding) return;
    isBuilding = true;
    
    console.log(chalk.yellow(`📝 File changed: ${path}`));
    
    try {
      const result = await buildProject({ srcDir, outDir });
      
      if (result.success) {
        console.log(chalk.green(`✅ Rebuilt: ${result.files} file(s)`));
      } else {
        console.error(chalk.red('❌ Rebuild failed:'));
        result.errors.forEach(e => console.error(chalk.red(`   ${e}`)));
      }
    } catch (error: any) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    } finally {
      isBuilding = false;
      console.log('');
    }
  });
  
  watcher.on('add', async (path) => {
    if (isBuilding) return;
    isBuilding = true;
    
    console.log(chalk.yellow(`➕ New file: ${path}`));
    
    try {
      const result = await buildProject({ srcDir, outDir });
      
      if (result.success) {
        console.log(chalk.green(`✅ Built: ${result.files} file(s)`));
      } else {
        console.error(chalk.red('❌ Build failed:'));
        result.errors.forEach(e => console.error(chalk.red(`   ${e}`)));
      }
    } catch (error: any) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    } finally {
      isBuilding = false;
      console.log('');
    }
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    console.log(chalk.gray('\n👋 Shutting down...'));
    watcher.close();
    process.exit(0);
  });
}

