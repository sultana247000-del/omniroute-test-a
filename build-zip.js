import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const cwd = process.cwd();
const sourceDir = path.resolve(cwd, 'php-project');
const outputZip = path.resolve(cwd, 'public/ecommerce-php-project.zip');
const zip = new JSZip();

function addDirectoryToZip(dirPath, zipFolder) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(file);
      addDirectoryToZip(fullPath, subFolder);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(file, content);
    }
  }
}

addDirectoryToZip(sourceDir, zip);

// Ensure public directory exists
const publicDir = path.resolve(cwd, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }).then((buffer) => {
  fs.writeFileSync(outputZip, buffer);
  console.log('SUCCESS: Generated zip file at ' + outputZip + ' (' + buffer.length + ' bytes)');
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
