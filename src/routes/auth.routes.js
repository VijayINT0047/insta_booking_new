const express = require('express');
const router = express.Router();
const login = require ('../controllers/auth.controller/login.controller.js');
const signup = require( '../controllers/auth.controller/signup.controller.js');
const update = require( '../controllers/auth.controller/update.controller.js');
const forgotPassword = require( '../controllers/auth.controller/forgotPassword.controller.js');
const resetPassword = require ('../controllers/auth.controller/resetPassword.controller.js');

const { refresh,getDashboard, profile } = require('../controllers/auth.controller');
const { route } = require('./auth.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const apiLimiter = require('../middlewares/rateLimiter');
const { plan, getPlan } = require('../controllers/event.controller');

// router.post('/login',apiLimiter ,login);
router.post('/login',apiLimiter, login);
router.post('/refresh', refresh);
router.post('/signup',apiLimiter, signup )
router.post('/update',authMiddleware, update)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/dashboard',authMiddleware, getDashboard)
router.get('/profile',authMiddleware, profile)
router.post('/plan', plan)
router.get('/getplan', getPlan )



module.exports = router;
