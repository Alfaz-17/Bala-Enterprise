const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    });
    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  
  const sources = [
    { url: 'https://utils.imimg.com/ph/indiamart-logo.png', dest: path.join(publicDir, 'indiamart.png') },
    { url: 'https://tiimg.tistatic.com/new_website/common/header-logo.svg', dest: path.join(publicDir, 'tradeindia.svg') },
    { url: 'https://tiimg.tistatic.com/tradeindia/images/header/logo.png', dest: path.join(publicDir, 'tradeindia.png') }
  ];

  for (const src of sources) {
    try {
      await downloadFile(src.url, src.dest);
      console.log(`Successfully downloaded: ${src.dest}`);
    } catch (err) {
      console.log(`Skipped ${src.url}: ${err.message}`);
    }
  }
}

main();
