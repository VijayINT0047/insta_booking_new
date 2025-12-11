const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production','test').default('development'),
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().uri().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_RESET_SECRET: Joi.string().required(),
  ACCESS_TOKEN_TTL: Joi.string().default('15m'),
  REFRESH_TOKEN_TTL: Joi.string().default('30d'),
  RESET_TOKEN_TTL: Joi.string().default('15m'),
  LOG_LEVEL: Joi.string().default('info'),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

module.exports = {
  env,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    resetSecret: env.JWT_RESET_SECRET,
    accessTTL: env.ACCESS_TOKEN_TTL,
    refreshTTL: env.REFRESH_TOKEN_TTL,
    resetTTL: env.RESET_TOKEN_TTL,

  },
  logLevel: env.LOG_LEVEL,
};
