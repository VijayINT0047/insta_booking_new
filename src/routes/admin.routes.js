const express = require('express');
const router = express.Router();

const { createPlan, getPlan } = require('../controllers/plan.controller');

router.post('/plan', createPlan)
router.get('/getplan', getPlan )

module.exports = router;
  