const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const v = require('../validators/auth.validator');

router.post('/login', validate(v.loginSchema), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.getMe);
router.patch('/me', authenticate, validate(v.updateProfileSchema), ctrl.updateMe);
router.post('/password/change', authenticate, validate(v.changePasswordSchema), ctrl.changePassword);
router.post('/register', authenticate, authorize('teacher'), validate(v.registerStudentSchema), ctrl.registerStudent);
router.get('/students', authenticate, authorize('teacher'), ctrl.listStudents);
router.patch('/students/:id', authenticate, authorize('teacher'), ctrl.updateStudent);

module.exports = router;
