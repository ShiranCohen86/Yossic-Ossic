const AvailabilitySlot = require('../models/AvailabilitySlot');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/ApiError');

const listSlots = async (req, res, next) => {
  try {
    const slots = await AvailabilitySlot.find({ isActive: true }).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ slots });
  } catch (err) { next(err); }
};

const createSlot = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.create(req.body);
    res.status(201).json({ slot });
  } catch (err) { next(err); }
};

const updateSlot = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slot) throw new ApiError(404, 'Slot לא נמצא');
    res.json({ slot });
  } catch (err) { next(err); }
};

const deleteSlot = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!slot) throw new ApiError(404, 'Slot לא נמצא');
    res.json({ message: 'Slot הוסר בהצלחה' });
  } catch (err) { next(err); }
};

const getOpenSlots = async (req, res, next) => {
  try {
    const slots = await AvailabilitySlot.find({ isActive: true });
    const now = new Date();
    const fourWeeks = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
    const candidates = [];
    for (let d = new Date(now); d <= fourWeeks; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      day.setHours(0, 0, 0, 0);
      for (const slot of slots) {
        if (slot.isRecurring && slot.dayOfWeek === day.getDay()) {
          candidates.push({ date: new Date(day), startTime: slot.startTime, endTime: slot.endTime });
        } else if (!slot.isRecurring && slot.specificDate) {
          const sd = new Date(slot.specificDate);
          sd.setHours(0, 0, 0, 0);
          if (sd.getTime() === day.getTime()) {
            candidates.push({ date: new Date(day), startTime: slot.startTime, endTime: slot.endTime });
          }
        }
      }
    }
    const bookedLessons = await Lesson.find({
      date: { $gte: now, $lte: fourWeeks },
      status: { $in: ['pending', 'confirmed'] },
    }).select('date startTime');
    const bookedSet = new Set(bookedLessons.map((l) => `${l.date.toISOString().split('T')[0]}_${l.startTime}`));
    const openSlots = candidates.filter((c) => !bookedSet.has(`${c.date.toISOString().split('T')[0]}_${c.startTime}`));
    res.json({ slots: openSlots });
  } catch (err) { next(err); }
};

module.exports = { listSlots, createSlot, updateSlot, deleteSlot, getOpenSlots };
