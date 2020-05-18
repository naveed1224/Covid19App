const CasesModel = require('../models/cases');

exports.renderAllCases = (req, res, next) => {
    console.log(req.query.page)
    const currentPage = req.query.page || 1;
    const perPage = 13;
    let totalCases;

    CasesModel.find().countDocuments()
        .then(count => {
            totalCases = count;
            return CasesModel
                .find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(results => {
            res.status(200).json({
                message: 'Successfully reached render Cases API',
                data: results,
                totalCases: totalCases
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}