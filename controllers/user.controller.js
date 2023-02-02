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

module.exports = {  findUser, findUsers, deleteUser, updateUser };
