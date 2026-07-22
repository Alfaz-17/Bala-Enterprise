const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.resolve(__dirname, '../../public'),
  path.resolve(__dirname, '../../public/Images_Factory'),
  path.resolve(__dirname, '../../public/Categories_3d')
];

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }
  const dirName = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  const destPath = path.join(dirName, `${baseName}.webp`);

  try {
    const info = await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(destPath);
    console.log(`Converted: ${path.relative(process.cwd(), filePath)} -> ${baseName}.webp (${info.size} bytes)`);
  } catch (err) {
    console.error(`Failed to convert ${filePath}:`, err.message);
  }
}

async function scanAndConvert(dir) {
  console.log(`Scanning: ${dir}`);
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      await convertFile(fullPath);
    }
  }
}

async function main() {
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      await scanAndConvert(dir);
    }
  }
  console.log('Conversion complete!');
}

main();
