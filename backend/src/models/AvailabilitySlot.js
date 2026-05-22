const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, min: 0, max: 6 },
  startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  isRecurring: { type: Boolean, default: true },
  specificDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

availabilitySlotSchema.pre('save', function (next) {
  if (this.isRecurring && this.dayOfWeek == null) {
    return next(new Error('dayOfWeek נדרש עבור slot חוזר'));
  }
  if (!this.isRecurring && !this.specificDate) {
    return next(new Error('specificDate נדרש עבור slot חד פעמי'));
  }
  next();
});

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);
