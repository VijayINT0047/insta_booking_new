const { v4: uuidv4 } = require('uuid');

function traceMiddleware(req, res, next) {
  // Accept incoming trace id if present (X-Request-Id) else generate
  const incoming = req.get('X-Request-Id') || req.get('x-request-id');
  const traceId = incoming || uuidv4();
  // attach for downstream usage
  req.traceId = traceId;
  res.setHeader('X-Request-Id', traceId);
  // next
  next();
}

module.exports = traceMiddleware;
