const path = require('path');
const express = require('express');
const renderCasesAPIController = require('../controller/renderCasesAPIController')

//intitalize the router
const router = express.Router();

router.post('/Cases/renderCases/caseResults', renderCasesAPIController.renderAllCases);
router.post('/Cases/renderCases/caseResults/searchQuery', renderCasesAPIController.renderSearchCases);
router.post('/Cases/renderCases/caseResults/statsQuery', renderCasesAPIController.statsQueryController);

module.exports = router;