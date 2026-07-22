import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

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

async function resetAdminPassword() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const { AdminUser } = await import('../models/AdminUser');

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await AdminUser.findOneAndUpdate(
    { email: 'admin@balaenterprise.com' },
    {
      name: 'Bala Admin',
      email: 'admin@balaenterprise.com',
      passwordHash,
      role: 'owner',
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Admin account verified: ${admin.email}`);
  console.log('   Password: admin123');

  await mongoose.disconnect();
}

resetAdminPassword().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
