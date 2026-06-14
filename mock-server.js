const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET = 'mock-demo-secret';
const PORT = 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── Fake DB ──────────────────────────────────────────────────────────────────

const users = [
  { _id: 'u1', name: 'יוסי כהן', email: 'yossi@demo.com', password: '123456', role: 'teacher', isActive: true },
  { _id: 'u2', name: 'דני לוי', email: 'dani@demo.com', password: '123456', role: 'student', gradeLevel: 11, subjects: ['math', 'physics'], isActive: true, phone: '050-1111111' },
  { _id: 'u3', name: 'מיה רוזן', email: 'mia@demo.com', password: '123456', role: 'student', gradeLevel: 10, subjects: ['math'], isActive: true, phone: '050-2222222' },
  { _id: 'u4', name: 'אורי שפירא', email: 'uri@demo.com', password: '123456', role: 'student', gradeLevel: 12, subjects: ['math', 'physics'], isActive: true, phone: '050-3333333' },
];

const today = new Date();
const d = (daysFromNow) => { const x = new Date(today); x.setDate(x.getDate() + daysFromNow); x.setHours(0,0,0,0); return x.toISOString(); };

let lessons = [
  { _id: 'l1', student: { _id: 'u2', name: 'דני לוי', email: 'dani@demo.com' }, date: d(2), startTime: '16:00', endTime: '17:00', subject: 'math', topic: 'אינטגרלים', status: 'pending' },
  { _id: 'l2', student: { _id: 'u3', name: 'מיה רוזן', email: 'mia@demo.com' }, date: d(3), startTime: '17:00', endTime: '18:00', subject: 'math', topic: 'גבולות', status: 'confirmed' },
  { _id: 'l3', student: { _id: 'u4', name: 'אורי שפירא', email: 'uri@demo.com' }, date: d(5), startTime: '15:00', endTime: '16:00', subject: 'physics', topic: 'מכניקה', status: 'confirmed' },
  { _id: 'l4', student: { _id: 'u2', name: 'דני לוי', email: 'dani@demo.com' }, date: d(-7), startTime: '16:00', endTime: '17:00', subject: 'physics', topic: 'חשמל', status: 'completed', notes: 'הבין את החומר מצוין!' },
  { _id: 'l5', student: { _id: 'u3', name: 'מיה רוזן', email: 'mia@demo.com' }, date: d(-3), startTime: '17:00', endTime: '18:00', subject: 'math', topic: 'נגזרות', status: 'completed' },
  { _id: 'l6', student: { _id: 'u4', name: 'אורי שפירא', email: 'uri@demo.com' }, date: d(-1), startTime: '15:00', endTime: '16:00', subject: 'math', status: 'cancelled', cancelReason: 'חולה', cancelledBy: 'student' },
  { _id: 'l7', student: { _id: 'u2', name: 'דני לוי', email: 'dani@demo.com' }, date: d(0), startTime: '10:00', endTime: '11:00', subject: 'math', topic: 'מספרים מרוכבים', status: 'confirmed' },
];

const slots = [
  { _id: 's1', dayOfWeek: 1, startTime: '16:00', endTime: '17:00', isRecurring: true, isActive: true },
  { _id: 's2', dayOfWeek: 1, startTime: '17:00', endTime: '18:00', isRecurring: true, isActive: true },
  { _id: 's3', dayOfWeek: 3, startTime: '15:00', endTime: '16:00', isRecurring: true, isActive: true },
  { _id: 's4', dayOfWeek: 3, startTime: '16:00', endTime: '17:00', isRecurring: true, isActive: true },
  { _id: 's5', dayOfWeek: 4, startTime: '17:00', endTime: '18:00', isRecurring: true, isActive: true },
  { _id: 's6', dayOfWeek: 0, startTime: '10:00', endTime: '11:00', isRecurring: true, isActive: true },
];

const materials = [
  { _id: 'm1', title: 'סיכום נגזרות — כיתה יא\'', description: 'כל כללי הגזירה עם דוגמאות', subject: 'math', topic: 'נגזרות', gradeLevel: [11, 12], fileType: 'link', fileUrl: 'https://www.geogebra.org', isActive: true, createdAt: d(-10) },
  { _id: 'm2', title: 'תרגילי אינטגרלים', description: '50 תרגילים מסודרים לפי רמה', subject: 'math', topic: 'אינטגרלים', gradeLevel: [11, 12], fileType: 'link', fileUrl: 'https://www.khanacademy.org', isActive: true, createdAt: d(-8) },
  { _id: 'm3', title: 'גבולות ורציפות', subject: 'math', topic: 'גבולות', gradeLevel: [10, 11], fileType: 'link', fileUrl: 'https://www.desmos.com', isActive: true, createdAt: d(-5) },
  { _id: 'm4', title: 'מכניקה ניוטונית — תיאוריה', description: 'חוקי ניוטון עם פתרונות לשאלות בגרות', subject: 'physics', topic: 'מכניקה', gradeLevel: [11, 12], fileType: 'link', fileUrl: 'https://www.physicsclassroom.com', isActive: true, createdAt: d(-6) },
  { _id: 'm5', title: 'חשמל — מעגלים', subject: 'physics', topic: 'חשמל', gradeLevel: [11, 12], fileType: 'link', fileUrl: 'https://phet.colorado.edu', isActive: true, createdAt: d(-3) },
  { _id: 'm6', title: 'בגרות 2023 — מתמטיקה 5 יח\'', description: 'פתרון מלא עם הסברים', subject: 'math', topic: 'בגרות', gradeLevel: [12], fileType: 'link', fileUrl: 'https://www.bagrut.co.il', isActive: true, createdAt: d(-2) },
];

// ─── Auth middleware ───────────────────────────────────────────────────────────

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'אין הרשאה' });
  try {
    const payload = jwt.verify(header.split(' ')[1], SECRET);
    req.user = users.find(u => u._id === payload.sub);
    if (!req.user) return res.status(401).json({ message: 'משתמש לא קיים' });
    next();
  } catch { res.status(401).json({ message: 'טוקן לא תקף' }); }
};

const teacherOnly = (req, res, next) => req.user.role === 'teacher' ? next() : res.status(403).json({ message: 'מורה בלבד' });

// ─── Auth routes ──────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
  const token = jwt.sign({ sub: user._id }, SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sub: user._id }, SECRET + 'r', { expiresIn: '7d' });
  const { password: _, ...userData } = user;
  res.json({ token, refreshToken, user: userData });
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const payload = jwt.verify(req.body.refreshToken, SECRET + 'r');
    const token = jwt.sign({ sub: payload.sub }, SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ sub: payload.sub }, SECRET + 'r', { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } catch { res.status(401).json({ message: 'refresh token לא תקף' }); }
});

app.post('/api/auth/logout', auth, (req, res) => res.json({ message: 'יצאת בהצלחה' }));
app.get('/api/auth/me', auth, (req, res) => { const { password: _, ...u } = req.user; res.json({ user: u }); });

app.get('/api/auth/students', auth, teacherOnly, (req, res) => {
  const students = users.filter(u => u.role === 'student').map(({ password: _, ...u }) => u);
  res.json({ students });
});

app.post('/api/auth/register', auth, teacherOnly, (req, res) => {
  const newStudent = { _id: `u${Date.now()}`, ...req.body, role: 'student', isActive: true };
  delete newStudent.password;
  users.push({ ...newStudent, password: req.body.password });
  res.status(201).json({ user: newStudent });
});

app.patch('/api/auth/students/:id', auth, teacherOnly, (req, res) => {
  const u = users.find(u => u._id === req.params.id);
  if (!u) return res.status(404).json({ message: 'לא נמצא' });
  Object.assign(u, req.body);
  const { password: _, ...userData } = u;
  res.json({ user: userData });
});

// ─── Availability routes ──────────────────────────────────────────────────────

app.get('/api/availability', auth, (req, res) => {
  res.json({ slots: slots.filter(s => s.isActive) });
});

app.get('/api/availability/open-slots', auth, (req, res) => {
  const now = new Date();
  const fourWeeks = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
  const candidates = [];

  for (let d = new Date(now); d <= fourWeeks; d.setDate(d.getDate() + 1)) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    for (const slot of slots.filter(s => s.isActive && s.isRecurring)) {
      if (slot.dayOfWeek === day.getDay()) {
        candidates.push({ date: day.toISOString(), startTime: slot.startTime, endTime: slot.endTime });
      }
    }
  }

  const bookedSet = new Set(
    lessons
      .filter(l => ['pending', 'confirmed'].includes(l.status))
      .map(l => `${new Date(l.date).toISOString().split('T')[0]}_${l.startTime}`)
  );

  const open = candidates.filter(c => !bookedSet.has(`${c.date.split('T')[0]}_${c.startTime}`));
  res.json({ slots: open });
});

app.post('/api/availability', auth, teacherOnly, (req, res) => {
  const slot = { _id: `s${Date.now()}`, isActive: true, ...req.body };
  slots.push(slot);
  res.status(201).json({ slot });
});

app.put('/api/availability/:id', auth, teacherOnly, (req, res) => {
  const slot = slots.find(s => s._id === req.params.id);
  if (!slot) return res.status(404).json({ message: 'לא נמצא' });
  Object.assign(slot, req.body);
  res.json({ slot });
});

app.delete('/api/availability/:id', auth, teacherOnly, (req, res) => {
  const slot = slots.find(s => s._id === req.params.id);
  if (!slot) return res.status(404).json({ message: 'לא נמצא' });
  slot.isActive = false;
  res.json({ message: 'הוסר' });
});

// ─── Lessons routes ───────────────────────────────────────────────────────────

app.get('/api/lessons', auth, (req, res) => {
  let list = [...lessons];
  if (req.user.role === 'student') list = list.filter(l => (typeof l.student === 'object' ? l.student._id : l.student) === req.user._id);
  if (req.query.status) list = list.filter(l => l.status === req.query.status);
  if (req.query.subject) list = list.filter(l => l.subject === req.query.subject);
  if (req.query.from) list = list.filter(l => new Date(l.date) >= new Date(req.query.from));
  if (req.query.to) list = list.filter(l => new Date(l.date) <= new Date(req.query.to + 'T23:59:59'));
  list.sort((a, b) => new Date(a.date) - new Date(b.date) || a.startTime.localeCompare(b.startTime));
  res.json({ lessons: list });
});

app.post('/api/lessons', auth, (req, res) => {
  const lesson = { _id: `l${Date.now()}`, student: { _id: req.user._id, name: req.user.name, email: req.user.email }, status: 'pending', ...req.body };
  lessons.push(lesson);
  res.status(201).json({ lesson });
});

app.get('/api/lessons/:id', auth, (req, res) => {
  const lesson = lessons.find(l => l._id === req.params.id);
  if (!lesson) return res.status(404).json({ message: 'לא נמצא' });
  res.json({ lesson });
});

app.patch('/api/lessons/:id/confirm', auth, teacherOnly, (req, res) => {
  const lesson = lessons.find(l => l._id === req.params.id);
  if (!lesson) return res.status(404).json({ message: 'לא נמצא' });
  lesson.status = 'confirmed';
  res.json({ lesson });
});

app.patch('/api/lessons/:id/complete', auth, teacherOnly, (req, res) => {
  const lesson = lessons.find(l => l._id === req.params.id);
  if (!lesson) return res.status(404).json({ message: 'לא נמצא' });
  lesson.status = 'completed';
  if (req.body.notes) lesson.notes = req.body.notes;
  res.json({ lesson });
});

app.patch('/api/lessons/:id/cancel', auth, (req, res) => {
  const lesson = lessons.find(l => l._id === req.params.id);
  if (!lesson) return res.status(404).json({ message: 'לא נמצא' });
  lesson.status = 'cancelled';
  lesson.cancelReason = req.body.cancelReason || '';
  lesson.cancelledBy = req.user.role;
  res.json({ lesson });
});

// ─── Materials routes ─────────────────────────────────────────────────────────

app.get('/api/materials', auth, (req, res) => {
  let list = materials.filter(m => m.isActive);
  if (req.query.subject) list = list.filter(m => m.subject === req.query.subject);
  if (req.query.topic) list = list.filter(m => m.topic?.includes(req.query.topic));
  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    list = list.filter(m => m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q) || m.topic?.toLowerCase().includes(q));
  }
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ materials: list });
});

app.post('/api/materials', auth, teacherOnly, (req, res) => {
  const material = { _id: `m${Date.now()}`, isActive: true, createdAt: new Date().toISOString(), uploadedBy: req.user._id, ...req.body };
  materials.push(material);
  res.status(201).json({ material });
});

app.get('/api/materials/:id', auth, (req, res) => {
  const material = materials.find(m => m._id === req.params.id);
  if (!material) return res.status(404).json({ message: 'לא נמצא' });
  res.json({ material });
});

app.patch('/api/materials/:id', auth, teacherOnly, (req, res) => {
  const material = materials.find(m => m._id === req.params.id);
  if (!material) return res.status(404).json({ message: 'לא נמצא' });
  Object.assign(material, req.body);
  res.json({ material });
});

app.delete('/api/materials/:id', auth, teacherOnly, (req, res) => {
  const material = materials.find(m => m._id === req.params.id);
  if (!material) return res.status(404).json({ message: 'לא נמצא' });
  material.isActive = false;
  res.json({ message: 'נמחק' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'mock' }));

app.listen(PORT, () => {
  console.log(`\n🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`\n📋 Demo credentials:`);
  console.log(`   👨‍🏫 מורה:   yossi@demo.com  / 123456`);
  console.log(`   👨‍🎓 תלמיד:  dani@demo.com   / 123456`);
  console.log(`   👩‍🎓 תלמידה: mia@demo.com    / 123456\n`);
});
