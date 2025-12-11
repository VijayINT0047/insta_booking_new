const { ApiResponse, ApiError, asyncHandler } = require("../utils/apiHelper");
const User=require("../models/User.model");
const { MESSAGE_TEMPLATES } = require("../constant/constant");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users,MESSAGE_TEMPLATES.FETCH_SUCCESS("User")));
});

module.exports = { getUsers };
