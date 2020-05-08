const {
    uuid
} = require('uuidv4');
const CasesModel = require('../models/cases');

let uuidToken;

exports.submitCase = (req, res, next) => {
    console.log(req.body);
    const lat = req.body.lat;
    const lng = req.body.lng;
    const userEmail = req.body.userEmail;
    const caseDescription = req.body.caseDescription;

    uuidToken = uuid();

    const caseSubmit = new CasesModel({
        lat: lat,
        lng: lng,
        email: userEmail,
        description: caseDescription,
        uuid: uuidToken

    })

    caseSubmit.save()
        .then(
            res.status(200).json({
                message: "successfully reached the API",
                case: caseSubmit
            })
        )
        .catch(err => {
            console.log(err)
        })
}

exports.renderCases = (req, res, next) => {
    //load all the cases
}

exports.DeleteCase = (req, res, next) => {
    //delete a case
}