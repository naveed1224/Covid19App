const path = require('path');
const express = require('express');
const mainPageController = require('../controller/mainPage')

//intitalize the router
const router = express.Router();

router.get('/', mainPageController.getIndex);

module.exports = router;