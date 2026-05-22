const router = require('express').Router();
const ctrl = require('../controllers/lessons.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const v = require('../validators/lessons.validator');

router.get('/', authenticate, ctrl.listLessons);
router.post('/', authenticate, authorize('student'), validate(v.bookLessonSchema), ctrl.bookLesson);
router.get('/:id', authenticate, ctrl.getLesson);
router.patch('/:id/confirm', authenticate, authorize('teacher'), ctrl.confirmLesson);
router.patch('/:id/complete', authenticate, authorize('teacher'), validate(v.completeSchema), ctrl.completeLesson);
router.patch('/:id/cancel', authenticate, validate(v.cancelSchema), ctrl.cancelLesson);
router.patch('/:id/reschedule', authenticate, validate(v.rescheduleSchema), ctrl.rescheduleLesson);

module.exports = router;
