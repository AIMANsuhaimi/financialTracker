const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace class pairs like 'bg-slate-50 dark:bg-slate-800' with 'bg-slate-800'
  content = content.replace(/([a-z0-9\-]+)\s+dark:([a-z0-9\-]+)/g, '$2');
  
  // Replace remaining 'dark:' prefixes
  content = content.replace(/dark:([a-z0-9\-]+)/g, '$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walk('./src');
