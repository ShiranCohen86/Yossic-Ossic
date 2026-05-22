const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const signTokens = (userId) => ({
  token: jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }),
  refreshToken: jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN }),
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true }).select('+passwordHash');
    if (!user) throw new ApiError(401, 'אימייל או סיסמא שגויים');

    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new ApiError(401, 'אימייל או סיסמא שגויים');

    const { token, refreshToken } = signTokens(user._id);
    user.sessions.push({ refreshToken });
    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.passwordHash;
    delete userData.sessions;

    res.json({ token, refreshToken, user: userData });
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(400, 'refreshToken נדרש');
    let payload;
    try { payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET); }
    catch { throw new ApiError(401, 'Refresh token לא תקף'); }
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) throw new ApiError(401, 'משתמש לא קיים');
    const sessionExists = user.sessions.some((s) => s.refreshToken === refreshToken);
    if (!sessionExists) throw new ApiError(401, 'Session לא תקף');
    const { token, refreshToken: newRefreshToken } = signTokens(user._id);
    user.sessions = user.sessions.filter((s) => s.refreshToken !== refreshToken);
    user.sessions.push({ refreshToken: newRefreshToken });
    await user.save();
    res.json({ token, refreshToken: newRefreshToken });
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      req.user.sessions = req.user.sessions.filter((s) => s.refreshToken !== refreshToken);
      await req.user.save();
    }
    res.json({ message: 'יצאת מהמערכת בהצלחה' });
  } catch (err) { next(err); }
};

const getMe = (req, res) => res.json({ user: req.user });

const updateMe = async (req, res, next) => {
  try {
    const { name, phone, gradeLevel, subjects } = req.body;
    Object.assign(req.user, { name, phone, gradeLevel, subjects });
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userWithPass = await User.findById(req.user._id).select('+passwordHash');
    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(currentPassword, userWithPass.passwordHash);
    if (!valid) throw new ApiError(400, 'הסיסמא הנוכחית שגויה');
    userWithPass.passwordHash = await User.hashPassword(newPassword);
    userWithPass.sessions = [];
    await userWithPass.save();
    res.json({ message: 'הסיסמא עודכנה בהצלחה' });
  } catch (err) { next(err); }
};

const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, gradeLevel, subjects } = req.body;
    const passwordHash = await User.hashPassword(password);
    const student = await User.create({ name, email, passwordHash, phone, gradeLevel, subjects, role: 'student' });
    const userData = student.toObject();
    delete userData.passwordHash;
    res.status(201).json({ user: userData });
  } catch (err) { next(err); }
};

const listStudents = async (req, res, next) => {
  try {
    const filter = { role: 'student' };
    if (req.query.subject) filter.subjects = req.query.subject;
    if (req.query.grade) filter.gradeLevel = parseInt(req.query.grade, 10);
    const students = await User.find(filter).sort({ name: 1 });
    res.json({ students });
  } catch (err) { next(err); }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) throw new ApiError(404, 'תלמיד לא נמצא');
    Object.assign(student, req.body);
    await student.save();
    res.json({ user: student });
  } catch (err) { next(err); }
};

module.exports = { login, refresh, logout, getMe, updateMe, changePassword, registerStudent, listStudents, updateStudent };
