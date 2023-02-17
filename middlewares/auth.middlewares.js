const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  // next()
  if (!authorization && !authorization.startswith('Bearer'))
    return next(
      new AppError('Ypu are not logged in!  please log in to get acess', 401)
    );
  const token = authorization.split(' ')[1];

  console.log({ token });
  console.log(process.env.SECRET_JWT_SEED);

  const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);

  // console.log({ decoded });
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });
  console.log(user);
  if (!user)
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(decoded.iat);
    console.log(user.changedTimeStamp);
    if (decoded.iat < changedTimeStamp)
      return next(new AppError('User recently change password', 401));
  }
  req.sessionUser = user;
  next();
  // try {
  //   const decoded = await promisify(jwt.verify)(
  //     token,
  //     process.env.SECRET_JWT_SEED
  //   );
  //   console.log('->', decoded);
  //   console.log(process.env.SECRET_JWT_SEED);
  // } catch (err) {
  //   console.log(err);
  // }
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id)
    if (req.params.id !== sessionUser.id)
      return next(new AppError('You do not own this account.', 401));
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(roles);
    const { role } = req.sessionUser;
    if (!role.includes(roles))
      return next(
        new AppError('You do not have permission to perfom ths action.!')
      );
    next()
  };
module.exports = { protect, protectAccountOwner, restrictTo };
