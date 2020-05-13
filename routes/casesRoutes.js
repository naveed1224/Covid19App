const path = require('path');
const express = require('express');
const caseController = require('../controller/caseSubmit')

//intitalize the router
const router = express.Router();

router.post('/case-create', caseController.submitCase);
router.get('/delete/:uuid', caseController.DeleteCase);
router.get('/viewCases', caseController.renderCases); //API for cases
router.get('/viewCasesPage', caseController.renderCasesPage); //rendering the page

module.exports = router;