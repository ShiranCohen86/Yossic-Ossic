const Lesson = require('../models/Lesson');
const ApiError = require('../utils/ApiError');

const listLessons = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.student = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    const lessons = await Lesson.find(filter)
      .populate('student', 'name email gradeLevel')
      .sort({ date: 1, startTime: 1 });
    res.json({ lessons });
  } catch (err) { next(err); }
};

const bookLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create({ ...req.body, student: req.user._id, status: 'pending' });
    res.status(201).json({ lesson });
  } catch (err) { next(err); }
};

const getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('student', 'name email');
    if (!lesson) throw new ApiError(404, 'שיעור לא נמצא');
    if (req.user.role === 'student' && lesson.student._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'אין הרשאה לצפות בשיעור זה');
    }
    res.json({ lesson });
  } catch (err) { next(err); }
};

const confirmLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) throw new ApiError(404, 'שיעור לא נמצא');
    if (lesson.status !== 'pending') throw new ApiError(400, 'ניתן לאשר רק שיעורים ממתינים');
    lesson.status = 'confirmed';
    await lesson.save();
    res.json({ lesson });
  } catch (err) { next(err); }
};

const completeLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) throw new ApiError(404, 'שיעור לא נמצא');
    if (lesson.status !== 'confirmed') throw new ApiError(400, 'ניתן להשלים רק שיעורים מאושרים');
    lesson.status = 'completed';
    if (req.body.notes) lesson.notes = req.body.notes;
    await lesson.save();
    res.json({ lesson });
  } catch (err) { next(err); }
};

const cancelLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) throw new ApiError(404, 'שיעור לא נמצא');
    if (!['pending', 'confirmed'].includes(lesson.status)) throw new ApiError(400, 'לא ניתן לבטל שיעור זה');
    if (req.user.role === 'student' && lesson.student.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'אין הרשאה לבטל שיעור זה');
    }
    lesson.status = 'cancelled';
    lesson.cancelReason = req.body.cancelReason || '';
    lesson.cancelledBy = req.user.role;
    await lesson.save();
    res.json({ lesson });
  } catch (err) { next(err); }
};

const rescheduleLesson = async (req, res, next) => {
  try {
    const original = await Lesson.findById(req.params.id);
    if (!original) throw new ApiError(404, 'שיעור לא נמצא');
    if (!['pending', 'confirmed'].includes(original.status)) throw new ApiError(400, 'לא ניתן לשנות שיעור זה');
    if (req.user.role === 'student' && original.student.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'אין הרשאה לשנות שיעור זה');
    }
    original.status = 'cancelled';
    original.cancelReason = 'שינוי מועד';
    original.cancelledBy = req.user.role;
    await original.save();
    const newLesson = await Lesson.create({
      student: original.student,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      subject: original.subject,
      topic: original.topic,
      status: 'pending',
      rescheduledFrom: original._id,
    });
    res.status(201).json({ lesson: newLesson });
  } catch (err) { next(err); }
};

module.exports = { listLessons, bookLesson, getLesson, confirmLesson, completeLesson, cancelLesson, rescheduleLesson };
