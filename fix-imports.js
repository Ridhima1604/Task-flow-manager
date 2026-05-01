const fs = require('fs');
const path = require('path');

const srcDir = __dirname; // root directory

function getRelativePrefix(filePath) {
  const relativePath = path.relative(srcDir, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  if (depth === 0) return './';
  return '../'.repeat(depth);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(`@/`)) {
        const prefix = getRelativePrefix(fullPath);
        // We replace all occurrences of '@/...' with prefix + '...'
        // For example: '@/lib/utils' -> '../../lib/utils'
        content = content.replace(/@\//g, prefix);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${path.relative(srcDir, fullPath)}`);
      }
    }
  }
}

processDirectory(srcDir);
