const path = require('path');
const express = require('express');
const caseController = require('../controller/caseSubmit')

//intitalize the router
const router = express.Router();

router.post('/case-create', caseController.submitCase);

module.exports = router;