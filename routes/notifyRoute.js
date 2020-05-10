const path = require('path');
const express = require('express');
const notifyUserController = require('../controller/notifyUser')

//intitalize the router
const router = express.Router();

router.post('/anonymousEmail', notifyUserController.notifyUser);

module.exports = router;