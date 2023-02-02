const { Router } = require('express');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  deleteUser,
  updateUser,
} = require('../controllers/user.controller');

const router = Router();

router.get('/', findUsers);
router.get('/:id', findUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

module.exports = {
  userRouter: router,
};
