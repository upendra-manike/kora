#!/usr/bin/env node

/**
 * Kora CLI
 * 
 * Command-line interface for the Kora compiler.
 */

import { Command } from 'commander';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Parser } from './parser.js';
import { Compiler } from './compiler.js';
import { buildProject } from './build.js';
import { startDevServer } from './dev.js';

const program = new Command();

program
  .name('kora')
  .description('Kora - A full-stack programming language')
  .version('0.1.0');

program
  .command('new <name>')
  .description('Create a new Kora project')
  .action((name: string) => {
    console.log(`Creating new Kora project: ${name}`);
    
    const projectPath = join(process.cwd(), name);
    
    if (existsSync(projectPath)) {
      console.error(`Error: Directory ${name} already exists`);
      process.exit(1);
    }

    mkdirSync(projectPath, { recursive: true });
    mkdirSync(join(projectPath, 'src'));
    mkdirSync(join(projectPath, 'dist'));

    // Create example files
    const exampleDomain = `module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
`;

    const exampleApi = `api getUser {
  input { id: UUID }
  output User

  handler {
    // TODO: Implement
  }
}
`;

    const examplePage = `page UserProfile {
  load(id: UUID) -> User

  view(user: User) {
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  }
}
`;

    writeFileSync(join(projectPath, 'src', 'user.kora'), exampleDomain);
    writeFileSync(join(projectPath, 'src', 'get-user.kora'), exampleApi);
    writeFileSync(join(projectPath, 'src', 'user-profile.kora'), examplePage);

    // Create package.json
    const packageJson = {
      name: name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      description: 'A Kora project',
      type: 'module',
      scripts: {
        build: 'kora build',
        dev: 'kora dev',
      },
      private: true,
    };
    writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create README.md
    const readme = `# ${name}

A Kora full-stack application.

## Getting Started

1. **Build the project:**
   \`\`\`bash
   kora build
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   kora dev
   \`\`\`

## Project Structure

- \`src/\` - Kora source files
  - \`user.kora\` - Domain module (data types)
  - \`get-user.kora\` - API module (backend handler)
  - \`user-profile.kora\` - Page module (UI component)
- \`dist/\` - Compiled TypeScript output

## Next Steps

1. Implement the API handler in \`src/get-user.kora\`
2. Implement the load function in \`src/user-profile.kora\`
3. Set up a React app to use the compiled components
4. Set up a Node.js server to use the compiled API handlers

See the [Kora Tutorial](https://github.com/kora-lang/kora/blob/main/TUTORIAL.md) for more details.
`;
    writeFileSync(join(projectPath, 'README.md'), readme);

    // Create .gitignore
    const gitignore = `node_modules/
dist/
*.log
.DS_Store
.env
.env.local
`;
    writeFileSync(join(projectPath, '.gitignore'), gitignore);

    console.log(`✅ Created project: ${name}`);
    console.log(`   cd ${name}`);
    console.log(`   kora build  # Compile Kora files`);
    console.log(`   kora dev    # Start development server`);
  });

program
  .command('build')
  .description('Build Kora project to TypeScript/JavaScript')
  .option('-o, --out <dir>', 'Output directory', 'dist')
  .option('-s, --src <dir>', 'Source directory', 'src')
  .action(async (options: { out?: string; src?: string }) => {
    console.log('Building Kora project...');
    
    try {
      const result = await buildProject({
        srcDir: options.src,
        outDir: options.out,
      });
      
      if (result.success) {
        console.log(`✅ Build complete: ${result.files} file(s) compiled`);
        if (result.warnings.length > 0) {
          result.warnings.forEach(w => console.warn(`⚠️  ${w}`));
        }
      } else {
        console.error('❌ Build failed:');
        result.errors.forEach(e => console.error(`   ${e}`));
        process.exit(1);
      }
    } catch (error: any) {
      console.error('❌ Build error:', error.message);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start development server with hot reload')
  .option('-s, --src <dir>', 'Source directory', 'src')
  .option('-o, --out <dir>', 'Output directory', 'dist')
  .action(async (options: { src?: string; out?: string }) => {
    try {
      await startDevServer({
        srcDir: options.src,
        outDir: options.out,
      });
    } catch (error: any) {
      console.error('❌ Dev server error:', error.message);
      process.exit(1);
    }
  });

program
  .command('check')
  .description('Check Kora code for errors')
  .argument('<file>', 'Kora file to check')
  .action((file: string) => {
    try {
      const source = readFileSync(file, 'utf-8');
      const parser = new Parser();
      const ast = parser.parse(source);
      console.log('✅ No errors found');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('compile')
  .description('Compile a Kora file to TypeScript')
  .argument('<file>', 'Kora file to compile')
  .option('-o, --out <file>', 'Output file')
  .action((file: string, options: { out?: string }) => {
    try {
      const source = readFileSync(file, 'utf-8');
      const parser = new Parser();
      const compiler = new Compiler();
      
      const ast = parser.parse(source);
      const result = compiler.compile(ast);
      
      if (options.out) {
        writeFileSync(options.out, result.typescript);
        console.log(`✅ Compiled TypeScript to ${options.out}`);
        
        // Write CSS files
        for (const [cssFile, cssContent] of result.css.entries()) {
          const cssPath = options.out.replace(/\.tsx?$/, '') + '.module.css';
          writeFileSync(cssPath, cssContent);
          console.log(`✅ Compiled CSS to ${cssPath}`);
        }
      } else {
        console.log(result.typescript);
        if (result.css.size > 0) {
          console.log('\n--- CSS Files ---');
          for (const [cssFile, cssContent] of result.css.entries()) {
            console.log(`\n// ${cssFile}\n${cssContent}`);
          }
        }
      }
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();

