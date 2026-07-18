const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

const IMAGES_DIR = path.resolve(__dirname, '../../public/Images_Factory');

async function run() {
  console.log(`📂 Scanning directory: ${IMAGES_DIR}`);
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Directory does not exist!');
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  const heicFiles = files.filter(f => f.toUpperCase().endsWith('.HEIC'));
  console.log(`📸 Found ${heicFiles.length} HEIC files out of ${files.length} total files.`);

  for (let i = 0; i < heicFiles.length; i++) {
    const file = heicFiles[i];
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(IMAGES_DIR, `${baseName}.jpg`);

    console.log(`[${i + 1}/${heicFiles.length}] 🔄 Converting ${file} -> ${baseName}.jpg ...`);
    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.85
      });
      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`   ✅ Saved ${baseName}.jpg`);
    } catch (err) {
      console.error(`   ❌ Failed to convert ${file}:`, err.message);
    }
  }

  console.log('🏁 Conversion completed!');
}

run().catch(err => {
  console.error('❌ Script failed:', err);
});
