import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'dist/index.html');
const dest = path.join(process.cwd(), 'dist/404.html');

try {
  fs.copyFileSync(src, dest);
  console.log('Copied index.html → 404.html');
} catch (err) {
  console.error('Copy failed:', err);
  process.exit(1);
}