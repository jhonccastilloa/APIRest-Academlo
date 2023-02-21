const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  login,
  updatePassword,
  renweToken,
} = require('../controllers/auth.controller');
const { protectAccountOwner, protect } = require('../middlewares/auth.middlewares');
const {
  validIfExistUser,
  validIfExistEmail,
} = require('../middlewares/user.middleware');
const validateField = require('../middlewares/validateField.middleware');
const { upload } = require('../utils/multer');

const router = Router();

router.post(
  '/register',
  [
    upload.single('profileImageUrl'),
    check('username', 'the username must be mandatory').notEmpty(),
    check('password', 'the password must be mandatory').notEmpty(),
    check('email', 'the email must be mandatory').notEmpty().isEmail(),
    validateField,
    validIfExistEmail,
  ],
  createUser
);

router.patch(
  '/password/:id',
  [
    check(
      'currentPassword',
      'the current password must be mandatory'
    ).notEmpty(),
    check('newPassword', 'The new password must be mandatory').notEmpty(),
    validateField,
    validIfExistUser,
    protectAccountOwner
  ],
  updatePassword
);

router.post(
  '/login',
  [
    check('email', 'the email must be mandatory').notEmpty().isEmail(),
    check('password', 'the password must be mandatory').notEmpty(),
    validateField,
  ],
  login
);

router.use(protect)

router.get('/renew',renweToken)
module.exports = {
  authRouter: router,
};
