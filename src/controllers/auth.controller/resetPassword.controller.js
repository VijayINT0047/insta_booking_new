const createError = require('http-errors');
const User = require("../../models/User.model.js")
const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../../services/auth.service.js');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { log } = require('winston');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../../constant/constant.js');
const {asyncHandler, ApiError} = require('../../utils/apiHelper.js')
const bcrypt = require("bcrypt");


const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword, resetToken } = req.body;

// first we will check if there is token provided or not 
  if (!resetToken) {
    throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("resetToken"));
  }

// then we will find the user by that token 
  const user = await User.findOne({ resetToken, resetTokenExpire: { $gt: Date.now() }});

  if (!user) {
    throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("Reset token expired or invalid"));
  }

// we will check if both password provided are same or not 
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, MESSAGE_TEMPLATES.PASSWORD_WRONG("Passwords do not match"));
  }

// if both password are same then hash the password  and save it 
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse( 200, MESSAGE_TEMPLATES.UPDATE_SUCCESS("password")
      )
    );
});


module.exports = resetPassword
