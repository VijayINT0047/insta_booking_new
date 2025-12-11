const createError = require('http-errors');
const User = require("../../models/User.model.js")

const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../../services/auth.service.js');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { log } = require('winston');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../../constant/constant.js');
const {asyncHandler, ApiError} = require('../../utils/apiHelper.js')
const bcrypt = require("bcrypt");


const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

// first we will check if mail is there or not 
  if (!email) {
    throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("email"));
  }

  const mail = email.toLowerCase().trim();

// we will find if user is there or not if no user throw error 
  const user = await User.findOne({ email: mail });
  if (!user) {
    throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
  }

  const payload = { sub: user._id, email: mail };
  const resetToken = signResetToken(payload);

  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { resetToken },
        MESSAGE_TEMPLATES.CREATE_SUCCESS("Reset Token")
      )
    );
});


module.exports = forgotPassword