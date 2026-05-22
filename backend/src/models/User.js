const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sessionSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['teacher', 'student'], default: 'student', index: true },
  gradeLevel: { type: Number, min: 7, max: 12 },
  subjects: [{ type: String, enum: ['math', 'physics'] }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  sessions: [sessionSchema],
}, { timestamps: true });

userSchema.methods.comparePassword = async function (plain) {
  const hash = await this.model('User').findById(this._id).select('+passwordHash');
  return bcrypt.compare(plain, hash.passwordHash);
};

userSchema.statics.hashPassword = async (plain) => bcrypt.hash(plain, 12);

module.exports = mongoose.model('User', userSchema);
