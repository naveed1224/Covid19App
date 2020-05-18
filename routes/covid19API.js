const path = require('path');
const express = require('express');
const renderCasesAPIController = require('../controller/renderCasesAPIController')

//intitalize the router
const router = express.Router();

router.post('/Cases/renderCases/caseResults', renderCasesAPIController.renderAllCases);

module.exports = router;