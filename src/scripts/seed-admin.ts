/**
 * Seed script: creates the initial admin user.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seed-admin.ts
 *
 * Or add to package.json scripts:
 *   "seed:admin": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' src/scripts/seed-admin.ts"
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env.local variables for stand-alone execution
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
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

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const { AdminUser } = await import('../models/AdminUser');

  const existingAdmin = await AdminUser.findOne({ role: 'owner' });

  if (existingAdmin) {
    console.log(`⚠️  Owner already exists: ${existingAdmin.email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await AdminUser.create({
    name: 'Admin',
    email: 'admin@balaenterprise.com',
    passwordHash,
    role: 'owner',
  });

  console.log(`✅ Admin user created: ${admin.email}`);
  console.log('   Password: admin123');
  console.log('   ⚠️  Change this password immediately after first login!');

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
