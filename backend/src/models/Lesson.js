const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  subject: { type: String, enum: ['math', 'physics'], required: true },
  topic: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  notes: { type: String, trim: true },
  cancelReason: { type: String, trim: true },
  cancelledBy: { type: String, enum: ['teacher', 'student'] },
  rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
