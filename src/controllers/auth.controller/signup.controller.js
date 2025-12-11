const createError = require('http-errors');
const User = require("../../models/User.model.js")
const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../../services/auth.service.js');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { log } = require('winston');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../../constant/constant.js');
const {asyncHandler, ApiError} = require('../../utils/apiHelper.js')
const bcrypt = require("bcrypt");



const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirm_password, number, address } = req.body;

// i had converted mail to lowercase trim extra space 
  const Email = email?.toLowerCase().trim();

// checking if all requried field are there or not
  if (!name || !Email || !password || !confirm_password) {
    throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("user"));
  }

// checking if user by the email id is present then throw error that user is present 
  const existingUser = await User.findOne({ email: Email });
  if (existingUser) {
    throw new ApiError(409, MESSAGE_TEMPLATES.ALREADY_EXISTS("Email"));
  }

// passspowrd and confirm password must match
  if (password !== confirm_password) {
    throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_SAME("password"));
  }

// if user had given number it should be of 10 degit 
  if (number && number.length !== 10) {
    throw new ApiError(
      404,
      MESSAGE_TEMPLATES.INVALID_PAYLOAD("number length should be 10 digits")
    );
  }

// creating user and password will auto hash in user model
  const user = await User.create({
    name,
    email: Email,
    password,
    number,
    address,
  });

// deleting tje password before sending data to frontend
  const userResponse = user.toObject();
  delete userResponse.password;

// we will gerate here two token 
  const payload = { sub: user._id, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await saveRefreshToken(user._id, refreshToken);

  return res.status(201).json(
    new ApiResponse(
      201,
      { userResponse, accessToken, refreshToken },
      MESSAGE_TEMPLATES.CREATE_SUCCESS("User")
    )
  );
});


module.exports = signup