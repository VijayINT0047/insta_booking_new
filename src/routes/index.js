const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const {getUsers}=require("../controllers/userData")

// Import sub-routers
const authRoutes = require('./auth.routes');

// Mount sub-routers
router.use('/auth', authRoutes);

router.get('/getUsers',getUsers)

module.exports = router;
