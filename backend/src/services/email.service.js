const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

const sendLessonConfirmation = async (studentEmail, lessonDetails) => {
  try {
    await transporter.sendMail({
      from: `"שיעורים פרטיים" <${env.SMTP_USER}>`,
      to: studentEmail,
      subject: 'השיעור שלך אושר!',
      html: `<div dir="rtl"><h2>השיעור אושר</h2><p><strong>תאריך:</strong> ${new Date(lessonDetails.date).toLocaleDateString('he-IL')}</p><p><strong>שעה:</strong> ${lessonDetails.startTime} - ${lessonDetails.endTime}</p><p><strong>מקצוע:</strong> ${lessonDetails.subject === 'math' ? 'מתמטיקה' : 'פיזיקה'}</p></div>`,
    });
  } catch (err) {
    logger.error('Failed to send confirmation email', { error: err.message });
  }
};

module.exports = { sendLessonConfirmation };
