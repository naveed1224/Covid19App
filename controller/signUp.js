const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const userSignupModel = require('../models/signupModel');

const transport = nodeMailer.createTransport(sendGrid({
    auth: {
        api_key: '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'
    }
}));

exports.signupController = (req, res, next) => {
    res.status(200).json({
        message: "reached signup API"
    })
}