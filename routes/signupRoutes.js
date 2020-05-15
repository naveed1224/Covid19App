const path = require('path');
const express = require('express');
const signupController = require('../controller/signUp')

//intitalize the router
const router = express.Router();

router.post('/signup', signupController.signupController);

module.exports = router;