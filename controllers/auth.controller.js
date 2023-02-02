const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");


const createUser = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;
  const newUser = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });
  res.json({
    status: 'success',
    message: 'The user was created succesfully',
    newUser,
  });

});

module.exports={createUser}