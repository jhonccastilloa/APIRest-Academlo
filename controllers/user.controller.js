const Cart = require('../models/cart.models');
const Order = require('../models/order.model');
const ProductInCart = require('../models/productInCart.models');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const findUsers = async (req, res) => {
  const users = await User.findAll({
    where: {
      status: true,
    },
  });
  res.json({ status: 'success', message: 'ROUTE - GET CONTROLLER', users });
};
const findUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
        status: true,
      },
    });
    res.json({
      status: 'success',
      message: 'User was found succesfully',
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const user = await User.findOne({
    where: {
      id,
      status: true,
    },
  });
  if (!user)
    return res.status(404).json({ error: true, message: 'User not Found' });

  const updateUser = await user.update({
    username,
    email,
  });
  res.json({
    status: 'success',
    message: 'The user has been updated successfully',
    updateUser,
  });
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
    },
  });
  if (!user)
    return res.status(404).json({ error: true, message: 'User not Found' });
  user.update({ status: false });
  res.json({
    status: 'success',
    message: 'User was deleted successfully',
  });
};

const getOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  console.log(sessionUser);
  const orders = await Order.findAll({
    where: {
      userId: sessionUser.id,
      status: true,
    },
    include: {
      model: Cart,
      where: {
        status: 'purchased',
      },
      include: {
        model: ProductInCart,
        where: {
          status: 'purchased',
        },
      },
    },
  });
  res.json({
    orders,
  });
});

const getOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;
  console.log(sessionUser);
  const orders = await Order.findOne({
    where: {
      userId: sessionUser.id,
      status: true,
      id,
    },
    include: {
      model: Cart,
      where: {
        status: 'purchased',
      },
      include: {
        model: ProductInCart,
        where: {
          status: 'purchased',
        },
      },
    },
  });
  res.json({
    orders,
  });
});
module.exports = { findUser, findUsers, deleteUser, updateUser, getOrders,getOrder };
