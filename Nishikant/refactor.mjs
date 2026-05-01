import fs from 'fs/promises';
import path from 'path';

const dirs = ['components/sections', 'components/ui', 'app'];

const replacements = [
  // Clean up dark mode specifics
  [/dark:bg-slate-\d+(\/\d+)?/g, ''],
  [/dark:text-slate-\d+/g, ''],
  [/dark:border-slate-\d+(\/\d+)?/g, ''],
  [/dark:hover:bg-slate-\d+/g, ''],
  [/dark:hover:text-sky-\d+/g, ''],
  [/dark:text-white/g, ''],
  
  // Backgrounds
  [/\bbg-slate-50\b/g, 'bg-secondary'],
  [/\bbg-slate-100\b/g, 'bg-secondary'],
  [/\bbg-slate-800\b/g, 'bg-foreground'],
  [/\bbg-slate-900\b/g, 'bg-foreground'],
  [/\bbg-slate-950\b/g, 'bg-foreground'],
  [/\bbg-sky-500\b/g, 'bg-primary'],
  [/\bbg-sky-400\b/g, 'bg-primary-light'],
  [/\bbg-blue-500\b/g, 'bg-primary'],
  [/\bbg-emerald-500\b/g, 'bg-success'],
  [/\bbg-orange-500\b/g, 'bg-accent'],
  
  // Texts
  [/\btext-slate-900\b/g, 'text-foreground'],
  [/\btext-slate-800\b/g, 'text-foreground'],
  [/\btext-slate-700\b/g, 'text-secondary-foreground'],
  [/\btext-slate-600\b/g, 'text-muted-foreground'],
  [/\btext-slate-500\b/g, 'text-muted-foreground'],
  [/\btext-slate-300\b/g, 'text-muted-foreground'],
  [/\btext-slate-200\b/g, 'text-muted-foreground'],
  [/\btext-slate-100\b/g, 'text-muted-foreground'],
  [/\btext-sky-500\b/g, 'text-primary'],
  [/\btext-sky-400\b/g, 'text-primary-light'],
  [/\btext-blue-300\b/g, 'text-primary-light'],
  [/\btext-emerald-400\b/g, 'text-success'],
  [/\btext-emerald-500\b/g, 'text-success'],
  [/\btext-orange-400\b/g, 'text-accent'],
  [/\btext-orange-500\b/g, 'text-accent'],
  
  // Borders
  [/\bborder-slate-200\b/g, 'border-border'],
  [/\bborder-slate-100\b/g, 'border-border'],
  [/\bborder-slate-800\b/g, 'border-border'],
  [/\bborder-sky-500\b/g, 'border-primary'],
  [/\bborder-emerald-500\b/g, 'border-success'],
  [/\bborder-orange-500\b/g, 'border-accent'],
  
  // Hovers
  [/\bhover:bg-slate-50\b/g, 'hover:bg-secondary'],
  [/\bhover:bg-sky-500\/20\b/g, 'hover:bg-primary/20'],
  [/\bhover:text-sky-500\b/g, 'hover:text-primary'],
];

async function processDirectory(dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile() && fullPath.endsWith('.tsx')) {
        let content = await fs.readFile(fullPath, 'utf8');
        
        let originalContent = content;
        for (const [regex, replacement] of replacements) {
          content = content.replace(regex, replacement);
        }
        
        // Let's just fix double spaces in className attributes without killing newlines
        // Only target spaces inside quotes. Not easy to do safely with simple regex without breaking.
        // Actually, just leaving a few double spaces in class names is fine for HTML.
        
        if (content !== originalContent) {
          await fs.writeFile(fullPath, content);
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error processing ${dir}:`, err);
    }
  }
}

async function main() {
  for (const dir of dirs) {
    await processDirectory(dir);
  }
}

main();
