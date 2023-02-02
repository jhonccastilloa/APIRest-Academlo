const { Router } = require('express');
const { check } = require('express-validator');
const { createUser } = require('../controllers/auth.controller');
const validIfExistEmail = require('../middlewares/user.middleware');
const validateField = require('../middlewares/validateField.middleware');

const router = Router();

router.post(
  '/register',
  [
    check('username', 'the username must be mandatory').notEmpty(),
    check('password', 'the password must be mandatory').notEmpty(),
    check('email', 'the email must be mandatory').notEmpty().isEmail(),
    validateField,
    validIfExistEmail,
  ],
  createUser
);
module.exports = {
  authRouter: router,
};
