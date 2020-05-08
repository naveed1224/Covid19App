const path = require('path');
const express = require('express');
const mainPageController = require('../controller/notifyUser')

//intitalize the router
const router = express.Router();

router.get('/', mainPageController.getIndex);

module.exports = router;