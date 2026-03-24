import fs from 'fs';
import path from 'path';

const walk = (dir: string, callback: (filePath: string) => void) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, callback);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      callback(filePath);
    }
  }
};

const fixFile = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  content = content.replace(/backgroundColor:/g, 'background:');

  // Fix simple concatenations: primary + '20'
  content = content.replace(/background:\s*([a-zA-Z0-9_?.]+)\s*\+\s*'([0-9a-fA-F]{2,3})'/g, (match, p1, p2) => {
    return `background: String(${p1}).includes('gradient') ? ${p1} : ${p1} + '${p2}'`;
  });

  // Fix parenthesized concatenations: (system.colors?.success?.hex || '#28A745') + '20'
  content = content.replace(/background:\s*\(([^)]+)\)\s*\+\s*'([0-9a-fA-F]{2,3})'/g, (match, p1, p2) => {
    return `background: String(${p1}).includes('gradient') ? (${p1}) : (${p1}) + '${p2}'`;
  });

  // Fix ternary concatenations: active ? primary + '15' : 'transparent'
  content = content.replace(/background:\s*([^?:]+)\s*\?\s*([a-zA-Z0-9_?.]+)\s*\+\s*'([0-9a-fA-F]{2,3})'\s*:\s*([^,}]+)/g, (match, condition, p1, p2, falseCase) => {
    return `background: ${condition} ? (String(${p1}).includes('gradient') ? ${p1} : ${p1} + '${p2}') : ${falseCase}`;
  });

  // Fix ternary concatenations (other way): i === 7 ? primary : primary + '40'
  content = content.replace(/background:\s*([^?:]+)\s*\?\s*([^:]+)\s*:\s*([a-zA-Z0-9_?.]+)\s*\+\s*'([0-9a-fA-F]{2,3})'/g, (match, condition, trueCase, p1, p2) => {
    return `background: ${condition} ? ${trueCase} : (String(${p1}).includes('gradient') ? ${p1} : ${p1} + '${p2}')`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
};

walk('./src/components', fixFile);
