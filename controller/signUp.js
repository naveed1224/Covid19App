const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const UserSignupModel = require('../models/signupModel');
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

    UserSignupModel.findById(req.params.signupid)
        .then(result => {
            result.status = true;
            return result.save()
                .then(result => {
                    console.log(result)
                    res.render('mainPage/caseDelete', {
                        message: "Successfull Signup - ID#: ",
                        uuid: result._id,
                        status: "Sign Confirm Successful"
                    });
                }).catch(err => {
                    console.log(err);
                })
        })
}

exports.signUpDeleteConfirm = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);

    UserSignupModel.findByIdAndDelete(req.params.signupid)
        .then(result => {
            console.log(result)
            res.render('mainPage/caseDelete', {
                message: "Successfully Deleted Text Messages Notifications Signup - ID#: . You will no longer Receive Text messages releated to cases in your region",
                uuid: result._id,
                status: "Signup notifications Delete Success"
            });
        })
        .catch(err => {
            console.log(err)
        })
}

exports.signupController = (req, res, next) => {
    const signupConfirmCode = Math.floor(1000 + Math.random() * 9000)
    const phone = req.body.userSignuPhone
    const parsedPhone = phone.replace(/[-+()\.\s]/g, '')
    UserSignupModel.find({
            phone: parsedPhone
        })
        .then(record => {
            console.log(record.length)
            if (record.length > 0) {
                res.status(409).json({
                    message: "Phone signup already Exists",
                    duplicate: true
                })
            } else {
                console.log(req.body);
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
                        console.log(result);
                        client.messages
                            .create({
                                body: `Click link to confirm your signup and receive Covid19 case notifications in your area: http://localhost:3000/notifications/signup/confirm/${result._id}?confirmCode=${signupConfirmCode}`,
                                from: '+12066874626',
                                to: `${result.phone}`
                            })
                            .then(message => console.log('text sent'));
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })

}