const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  subject: { type: String, enum: ['math', 'physics'], required: true, index: true },
  topic: { type: String, trim: true, index: true },
  gradeLevel: [{ type: Number, min: 7, max: 12 }],
  fileType: { type: String, enum: ['pdf', 'image', 'link'], required: true },
  fileUrl: { type: String },
  publicId: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

materialSchema.index({ title: 'text', description: 'text', topic: 'text' });

module.exports = mongoose.model('Material', materialSchema);
