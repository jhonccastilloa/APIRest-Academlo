const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password,role } = req.body;
  console.table(req.body)
  console.log(req.file)
  // const user = new User({ username, email, password,role });
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(password, salt);
  // await user.save();
  // const token = await generateJWT(user.id);

  // res.status(201).json({
  //   status: 'success',
  //   message: 'User created successfully',
  //   token,
  //   user: {
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //     role: user.role,
  //   },
  // });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!user) {
    return next(new AppError('the user could not be found', 404));
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or passqord'), 401);
  }
  const token = await generateJWT(user.id);

  res.json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});

const renweToken = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const token = await generateJWT(id);
  const user = await User.findOne({
    attributes: ['id', 'username', 'email', 'role'],
    where: {
      status: true,
      id,
    },
  });

  return res.json({
    status: 'success',
    token,
    user,
  });
});

module.exports = { createUser, login, updatePassword, renweToken };
