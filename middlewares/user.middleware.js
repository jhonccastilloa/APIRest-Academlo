const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const validIfExistEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (user && !user.status)
    return res.status(400).json({
      status: 'error',
      message: 'the user has an account, but it is disabled ',
    });
  if (user)
    return res.status(400).json({
      status: 'error',
      message:
        'the user has an account with this email, please change your email',
    });
  next();
};

const validIfExistUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});
module.exports = {validIfExistEmail,validIfExistUser};
