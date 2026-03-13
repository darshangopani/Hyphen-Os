import fs from 'fs';
import path from 'path';

const replacements = {
  'neon-blue': 'brand-primary',
  'neon-purple': 'brand-secondary',
  'terminal-green': 'brand-accent',
  'deep-space': 'brand-dark',
  '59,130,246': '249,115,22',
  '139,92,246': '244,63,94',
  '#3b82f6': '#f97316',
  '#8b5cf6': '#f43f5e',
  '#0f172a': '#09090b',
  'slate': 'zinc'
};

function walk(dir: string) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  for (const [key, value] of Object.entries(replacements)) {
    newContent = newContent.split(key).join(value);
  }
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
