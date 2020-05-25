const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const UserSignupModel = require('../models/signupModel');
const mongoose = require('mongoose');
const accountSid = 'AC50430158c37f3e30943dc2f16350aa21';
const authToken = 'e5e0a136a3e3841488b6a31c3f110a35';
const client = require('twilio')(accountSid, authToken);

const transport = nodeMailer.createTransport(sendGrid({
    auth: {
        api_key: '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'
    }
}));

exports.signUpConfirm = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    console.log(typeof (mongoose.Types.ObjectId(req.params.signupid)));


    UserSignupModel.findOne({
            _id: req.params.signupid,
            confirmCode: parseInt(req.query.confirmCode)
        })
        .then(result => {
            if (result) {
                if (result.status === "true") {
                    res.render('mainPage/confirm', {
                        message: "Already Signed Up - ID#: ",
                        uuid: result._id,
                        status: "Duplicate Confirmation",
                        statusCategory: "warning"
                    });

                } else {
                    result.status = true;
                    return result.save()
                        .then(result => {
                            res.render('mainPage/confirm', {
                                message: "Successfull Signup - ID#: ",
                                uuid: result._id,
                                status: "Sign Confirm Successful",
                                statusCategory: "success"
                            });
                        }).catch(err => {
                            console.log(err);
                        })
                }

            } else {
                res.render('mainPage/confirm', {
                    message: "Failed to confirm Signup, Confirmation ID: ",
                    uuid: "Not Found",
                    status: "Cofirm Failed",
                    statusCategory: "danger"
                });
            }
        })
}

exports.signUpDeleteConfirm = (req, res, next) => {
    UserSignupModel.findByIdAndDelete(req.params.signupid)
        .then(result => {
            if (result) {
                res.render('mainPage/confirm', {
                    message: "Successfully Deleted Text Messages Notifications Signup - You will no longer Receive Text messages releated to cases in your region - ID#: ",
                    uuid: result._id,
                    status: "Signup notifications Deleted",
                    statusCategory: "danger"
                });
            } else {
                res.render('mainPage/confirm', {
                    message: "Could not find Signup Registery - you may have already deleted your signup Confirmation - ID found: ",
                    uuid: "None",
                    status: "Not Found",
                    statusCategory: "warning"
                });
            }
        })
        .catch(err => {
            console.log(err)
        })
}

exports.signupController = (req, res, next) => {
    const signupConfirmCode = Math.floor(1000 + Math.random() * 9000)
    const phone = req.body.userSignuPhone
    const parsedPhone = phone.replace(/[-+()\`\,\.\s]/g, '')
    UserSignupModel.find({
            phone: parsedPhone
        })
        .then(record => {
            if (record.length > 0) {
                res.status(409).json({
                    message: "Phone signup already Exists",
                    duplicate: true
                })
            } else {
                res.status(200).json({
                    message: "reached signup API",
                    data: req.body,
                    duplicate: false
                })
                const userSignup = UserSignupModel({
                    email: req.body.userSignupEmail,
                    phone: parsedPhone,
                    neibhorhood: req.body.SignupNeighborhood,
                    city: req.body.city,
                    timesNotified: 0,
                    status: false,
                    confirmCode: signupConfirmCode

                })
                userSignup.save()
                    .then(result => {
                        client.messages
                            .create({
                                body: `Click below to confirm your signup:\n\n http://${req.headers.host}/notifications/signup/confirm/${result._id}?confirmCode=${signupConfirmCode}\n\nIf you no longer want to receive any notifications, click link below:\n\nhttp://${req.headers.host}/notifications/signup/confirmDelete/${result._id}?confirmCode=${signupConfirmCode}`,
                                from: '+12066874626',
                                to: `${result.phone}`
                            })
                            .then(message => console.log(''));
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
}