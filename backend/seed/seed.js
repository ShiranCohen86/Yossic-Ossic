require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const env = require('../src/config/env');

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log('Connected to MongoDB');
  const existing = await User.findOne({ role: 'teacher' });
  if (existing) {
    console.log(`Teacher already exists: ${existing.email}`);
    await mongoose.disconnect();
    return;
  }
  const passwordHash = await User.hashPassword(process.env.TEACHER_SEED_PASSWORD || 'Teacher123!');
  await User.create({
    name: process.env.TEACHER_SEED_NAME || 'יוסי כהן',
    email: process.env.TEACHER_SEED_EMAIL || 'yossi@example.com',
    passwordHash,
    role: 'teacher',
    isActive: true,
  });
  console.log(`Teacher created: ${process.env.TEACHER_SEED_EMAIL || 'yossi@example.com'}`);
  await mongoose.disconnect();
};

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
