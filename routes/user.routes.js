const { Router } = require('express');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  deleteUser,
  updateUser,
  getOrders,
  getOrder,
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middlewares');
const { validIfExistUser } = require('../middlewares/user.middleware');

const router = Router();

router.get('/', findUsers);
router.get('/orders',protect,getOrders)
router.get('/orders/:id',protect,getOrder)
router.get('/:id', findUser);
router.use(protect);

router.delete('/:id', validIfExistUser,deleteUser);
router.patch('/:id', updateUser);

module.exports = {
  userRouter: router,
};
