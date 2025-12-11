const createError = require('http-errors');
const User = require('../models/User.model.js');
const { signAccessToken, signRefreshToken, saveRefreshToken, signResetToken } = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { log } = require('winston');
const { MESSAGE_TEMPLATES, ApiResponse } = require('../constant/constant');
const {asyncHandler, ApiError} = require('../utils/apiHelper.js')
const bcrypt = require("bcrypt");


// ----------------------------------------   login   -------------------------------------

// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

// // first check email and password are given or not
//   if (!email || !password) {
//     throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("email or password"));
//   }

//   const mail = email.toLowerCase().trim();

// // before login check if user login or not ,if no user found then we will throw error 
//   const user = await User.findOne({ email: mail });
//   if (!user) {
//     throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
//   }

// // checking if user provided password and password in my db is same or not 
//   const ok = await user.comparePassword(password);
//   if (!ok) {
//     throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_WRONG("password"));
//   }

// // here we will genrate token 
//   const payload = {
//     email: mail
//   };

//   const accessToken = signAccessToken(payload);
//   const refreshToken = signRefreshToken(payload);

// // before sending data to frontend we will remove the password
//   const userResponse = user.toObject();
//   delete userResponse.password;

//   await saveRefreshToken(user._id, refreshToken);

//   const user_data = { userResponse, accessToken, refreshToken };


//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, user_data, MESSAGE_TEMPLATES.LOGIN_SUCCESS("User"))
//     );
// });




  


// ----------------------------------------   signup   -------------------------------------
// const signup = asyncHandler(async (req, res) => {
//   const { name, email, password, confirm_password, number, address } = req.body;

// // i had converted mail to lowercase trim extra space 
//   const Email = email?.toLowerCase().trim();

// // checking if all requried field are there or not
//   if (!name || !Email || !password || !confirm_password) {
//     throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("user"));
//   }

// // checking if user by the email id is present then throw error that user is present 
//   const existingUser = await User.findOne({ email: Email });
//   if (existingUser) {
//     throw new ApiError(409, MESSAGE_TEMPLATES.ALREADY_EXISTS("Email"));
//   }

// // passspowrd and confirm password must match
//   if (password !== confirm_password) {
//     throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_SAME("password"));
//   }

// // if user had given number it should be of 10 degit 
//   if (number && number.length !== 10) {
//     throw new ApiError(
//       404,
//       MESSAGE_TEMPLATES.INVALID_PAYLOAD("number length should be 10 digits")
//     );
//   }

// // creating user and password will auto hash in user model
//   const user = await User.create({
//     name,
//     email: Email,
//     password,
//     number,
//     address,
//   });

// // deleting tje password before sending data to frontend
//   const userResponse = user.toObject();
//   delete userResponse.password;

// // we will gerate here two token 
//   const payload = { sub: user._id, name: user.name };
//   const accessToken = signAccessToken(payload);
//   const refreshToken = signRefreshToken(payload);

//   await saveRefreshToken(user._id, refreshToken);

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       { userResponse, accessToken, refreshToken },
//       MESSAGE_TEMPLATES.CREATE_SUCCESS("User")
//     )
//   );
// });

// ----------------------------------------   update   -------------------------------------

// const update = asyncHandler(async (req, res) => {
//   const { name, email, newEmail, password, newPassword, number, address } = req.body;

//   let Email;
//   let newMail;

// // email must be present
//   if (!email) {
//     throw new ApiError(404, MESSAGE_TEMPLATES.MISSING_FIELDS("email"));
//   }

//   Email = email.toLowerCase().trim();

// // new email normalization
//   if (newEmail) {
//     newMail = newEmail.toLowerCase().trim();
//   }

// // number validation (ONLY if number is provided)
//   if (number) {
//     if (number.length !== 10) {
//       throw new ApiError(
//         404,
//         MESSAGE_TEMPLATES.INVALID_PAYLOAD("number length should be 10 digit")
//       );
//     }
//   }

// // Check existing user
//   const user = await User.findOne({ email: Email });
//   if (!user) {
//     throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
//   }

// // Password update logic
//   if (newPassword) {
//     if (!password) {
//       throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("password"));
//     }

//     const ok = await user.comparePassword(password);
//     if (!ok) {
//       throw new ApiError(401, MESSAGE_TEMPLATES.PASSWORD_WRONG("wrong password"));
//     }

//     if (newPassword === password) {
//       throw new ApiError(400, MESSAGE_TEMPLATES.PASSWORD_SAME);
//     }
//   }

// // Build update object
//   const updates = {};
//   if (name) updates.name = name;
//   if (newEmail) updates.email = newMail;
//   if (number) updates.number = number;
//   if (address) updates.address = address;
//   if (newPassword) {
//     updates.password = await bcrypt.hash(newPassword, 10);
//   }

// // Update user
//   const updatedUser = await User.findOneAndUpdate(
//     { email: Email },
//     { $set: updates },
//     { new: true }
//   );

//   return res.json(
//     new ApiResponse(200, updatedUser, MESSAGE_TEMPLATES.UPDATE_SUCCESS("user"))
//   );
// });




// ---------------------------------------- token  forgot password   -------------------------------------
// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

// // first we will check if mail is there or not 
//   if (!email) {
//     throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("email"));
//   }

//   const mail = email.toLowerCase().trim();

// // we will find if user is there or not if no user throw error 
//   const user = await User.findOne({ email: mail });
//   if (!user) {
//     throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("User"));
//   }

//   const payload = { sub: user._id, email: mail };
//   const resetToken = signResetToken(payload);

//   user.resetToken = resetToken;
//   user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
//   await user.save();

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         { resetToken },
//         MESSAGE_TEMPLATES.CREATE_SUCCESS("Reset Token")
//       )
//     );
// });




// ---------------------------------------- reset  forgot password   -------------------------------------
// const resetPassword = asyncHandler(async (req, res) => {
//   const { newPassword, confirmPassword, resetToken } = req.body;

// // first we will check if there is token provided or not 
//   if (!resetToken) {
//     throw new ApiError(400, MESSAGE_TEMPLATES.MISSING_FIELDS("resetToken"));
//   }

// // then we will find the user by that token 
//   const user = await User.findOne({ resetToken, resetTokenExpire: { $gt: Date.now() }});

//   if (!user) {
//     throw new ApiError(404, MESSAGE_TEMPLATES.NOT_FOUND("Reset token expired or invalid"));
//   }

// // we will check if both password provided are same or not 
//   if (newPassword !== confirmPassword) {
//     throw new ApiError(400, MESSAGE_TEMPLATES.PASSWORD_WRONG("Passwords do not match"));
//   }

// // if both password are same then hash the password  and save it 
//   user.password = await bcrypt.hash(newPassword, 10);
//   user.resetToken = undefined;
//   user.resetTokenExpire = undefined;

//   await user.save();

//   return res
//     .status(200)
//     .json(
//       new ApiResponse( 200, MESSAGE_TEMPLATES.UPDATE_SUCCESS("password")
//       )
//     );
// });






// // ----------------------------------------   refresh   -------------------------------------


const refresh = asyncHandler(async (req, res, next) => {

  const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError (400,MESSAGE_TEMPLATES.NOT_FOUND("Refresh Token"));
    // verify token
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (e) {
      throw new ApiError(401, MESSAGE_TEMPLATES.INVALID_PAYLOAD("Refresh Token"));
    }
    // find token in db and not revoked
    const stored = await require('../models/RefreshToken').findOne({ token: refreshToken, revoked: false });
    if (!stored) throw new ApiError(401, "Refresh token revoked");


    const newPayload = { sub: payload.sub, role: payload.role, orgId: payload.orgId };
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);
    // revoke old token and save new one
    stored.revoked = true;
    stored.replacedBy = newRefreshToken;
    await stored.save();
    // save new
    await saveRefreshToken(payload.sub, newRefreshToken);
    const tokenInfo = { accessToken, refreshToken: newRefreshToken }
    return res.status(200).json(new ApiResponse(200, tokenInfo, MESSAGE_TEMPLATES.CREATE_SUCCESS("RefreshToken")))


})





// // ----------------------------------------   Dashboard   -------------------------------------


const getDashboard = asyncHandler(async (req, res) => {
  // req.user is set by auth.middleware
  const user = req.user; // useful if you want org-based scoping

  // Example widgets: total users in org, recent signup, active users (simple)
  const orgId = user.orgId;

  // counts (scoped to orgId if your app is multi-tenant)
  const totalUsers = await User.countDocuments({ orgId });
  const admins = await User.countDocuments({ orgId, role: 'Admin' });
  const members = await User.countDocuments({ orgId, role: 'Member' });

  // // recent signup (last 5)
  // const recentSignup = await User.find({ orgId })
  //   .sort({ createdAt: -1 })
  //   .limit(5)
  //   .select('name email role createdAt');

  // // simple active users heuristic (last login stamp) — only if you track lastLogin
  // let activeUsers = 0;
  // try {
  //   activeUsers = await User.countDocuments({
  //     orgId,
  //     lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // last 7 days
  //   });
  // } catch (e) {
  //   // if you don't have lastLogin field, ignore
  //   activeUsers = 0;
  // }

  const data = {
    summary: {
      totalUsers,
      admins,
      members
      // activeUsers
    }
    // recentSignup
  };

return res.status(200).json(new ApiResponse(200, data, 'Dashboard data'));
  
})

// // ----------------------------------------   profile   -------------------------------------

const profile = asyncHandler(async (req, res) => {

  const user = req.user;
  const id = user.id
  const profile = await User.findOne({_id:id})
  console.log(profile);
  
  const data = {
    name:profile.name,
    email: profile.email,
    role: profile.role,
    orgId: profile.orgId,
    meta: profile.meta
  }

  return res.status(200).json(new ApiResponse(200, data, "user profile"))
})


module.exports = { refresh, getDashboard, profile };








// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;
//   validateRequiredFields(req.body, ['email']);
//   // if (!email) {
//   //   //return next(new AppError("Please provide email", 400));
//   //   return next(new ApiError(400,"Please provide email"));
//   // }
 
//   const user = await User.findOne({ email });
//   if (!user) {
//     //return next(new AppError("User not found", 404));
//     return next(new ApiError(404,"User not found"));
//   }
 
//   // generate 6 digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpHash = await bcrypt.hash(otp, 10);
//   const expiryMinutes = 10;
 
//   user.resetOtpHash = otpHash;
//   user.resetOtpExpiry = Date.now() + expiryMinutes * 60 * 1000; // ms
//   await user.save();
 
//   // send email using template
 
//     await sendTemplateEmail("LMS-User-Reset-Password", {
//       userName: user.fullName || "",
//       userEmail: user.email,
//       resetCode: otp,
//       resetLink: process.env.FRONTEND_URL
//         ? `${process.env.FRONTEND_URL}/reset-password`
//         : "",
//       expiryMinutes: String(expiryMinutes),
//       companyName: process.env.COMPANY_NAME || "InstaPlex",
//       supportEmail: process.env.SUPPORT_EMAIL || "support@example.com",
//       companyLogo: process.env.COMPANY_LOGO || "",
//       signOff: process.env.SIGN_OFF || "",
//     });
 
 
//   //return res.status(200).json({ success: true, message: "OTP_SENT_TO_EMAIL" });
//   res.json(new ApiResponse(200,[],"OTP_SENT_TO_EMAIL"));
// });
 