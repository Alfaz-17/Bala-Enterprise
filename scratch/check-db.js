const mongoose = require('mongoose');

async function main() {
  const envPath = require('path').resolve(process.cwd(), '.env.local');
  if (require('fs').existsSync(envPath)) {
    const envConfig = require('fs').readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    }
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const rawDocs = await mongoose.connection.db.collection('productimages').find().limit(3).toArray();
  console.log('Raw docs:', JSON.stringify(rawDocs, null, 2));

  await mongoose.disconnect();
}

main().catch(console.error);
