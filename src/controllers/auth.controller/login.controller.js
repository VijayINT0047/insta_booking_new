const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../../services/auth.service.js');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../../constant/constant.js');
const {asyncHandler, ApiError} = require('../../utils/apiHelper.js')
const bcrypt = require("bcrypt");
const User = require("../../models/User.model.js")




const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

// first check email and password are given or not
  if (!email || !password) {
    throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("email or password"));
  }

  const mail = email.toLowerCase().trim();

// before login check if user login or not ,if no user found then we will throw error 
  const user = await User.findOne({ email: mail });
  if (!user) {
    throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
  }

// checking if user provided password and password in my db is same or not 
  const ok = await user.comparePassword(password);
  if (!ok) {
    throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_WRONG("password"));
  }

// here we will genrate token 
  const payload = {
    email: mail
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

// before sending data to frontend we will remove the password
  const userResponse = user.toObject();
  delete userResponse.password;

  await saveRefreshToken(user._id, refreshToken);

  const user_data = { userResponse, accessToken, refreshToken };


  return res
    .status(200)
    .json(
      new ApiResponse(200, user_data, MESSAGE_TEMPLATES.LOGIN_SUCCESS("User"))
    );
});


module.exports = login