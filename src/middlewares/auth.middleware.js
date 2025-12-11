const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../config');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next(createError(401, 'Unauthorized'));
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.user = { id: payload.id, role: payload.role, orgId: payload.orgId };
    next();
  } catch (err) {
    next(createError(401, 'Invalid token'));
  }
}

module.exports = authMiddleware;
