const jwt = require('jsonwebtoken');
const ms = require('ms'); // if you add ms dep to parse TTLs
const config = require('../config');
const RefreshToken = require('../models/RefreshToken');
const { ApiResponse, MESSAGE_TEMPLATES } = require('../constant/constant');
const {refreshTTL} = require('../config/index')
function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTTL });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTTL });
}

function signResetToken(payload) {
  return jwt.sign(payload, config.jwt.resetSecret, {expiresIn: config.jwt.resetTTL})
}

// Save refresh token document
async function saveRefreshToken(userId, token) {
  const ttlMs = ms(config.jwt.refreshTTL);      // "30d" -> 2592000000 ms
  const expiresAt = new Date(Date.now() + ttlMs); 
  const refreshToken = new RefreshToken({ user: userId, token, expiresAt });
  await refreshToken.save();
  return refreshToken
}

module.exports = { signAccessToken, signRefreshToken, signResetToken, saveRefreshToken };
