const createError = require('http-errors');
const User = require("../../models/User.model.js")
const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../../services/auth.service.js');
const jwt = require('jsonwebtoken');
// const config = require('../config');
const { log } = require('winston');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../../constant/constant.js');
const {asyncHandler, ApiError} = require('../../utils/apiHelper.js')
const bcrypt = require("bcrypt");



const update = asyncHandler(async (req, res) => {
  const { name, email, newEmail, password, newPassword, number, address } = req.body;

  let Email;
  let newMail;

// email must be present
  if (!email) {
    throw new ApiError(404, MESSAGE_TEMPLATES.MISSING_FIELDS("email"));
  }

  Email = email.toLowerCase().trim();

// new email normalization
  if (newEmail) {
    newMail = newEmail.toLowerCase().trim();
  }

// number validation (ONLY if number is provided)
  if (number) {
    if (number.length !== 10) {
      throw new ApiError(
        404,
        MESSAGE_TEMPLATES.INVALID_PAYLOAD("number length should be 10 digit")
      );
    }
  }

// Check existing user
  const user = await User.findOne({ email: Email });
  if (!user) {
    throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
  }

// Password update logic
  if (newPassword) {
    if (!password) {
      throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("password"));
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_WRONG("wrong password"));
    }

    if (newPassword === password) {
      throw new ApiError(400, MESSAGE_TEMPLATES.PASSWORD_SAME);
    }
  }

// Build update object
  const updates = {};
  if (name) updates.name = name;
  if (newEmail) updates.email = newMail;
  if (number) updates.number = number;
  if (address) updates.address = address;
  if (newPassword) {
    updates.password = await bcrypt.hash(newPassword, 10);
  }

// Update user
  const updatedUser = await User.findOneAndUpdate(
    { email: Email },
    { $set: updates },
    { new: true }
  );

  return res.json(
    new ApiResponse(200, updatedUser, MESSAGE_TEMPLATES.UPDATE_SUCCESS("user"))
  );
});



module.exports = update
