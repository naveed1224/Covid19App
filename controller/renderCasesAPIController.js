const CasesModel = require('../models/cases');

exports.renderAllCases = (req, res, next) => {
    console.log(req.query.page)
    const currentPage = req.query.page || 1;
    const perPage = 3;
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
                totalCases: totalCases,
                perPage: perPage
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.renderSearchCases = (req, res, next) => {
    console.log(req.query)
    console.log(!req.query.searchQueryText)
    // res.status(200).json({
    //     message: 'Successfully reached search engine API'
    // })
    const currentPage = req.query.page || 1;
    const perPage = 3;
    let totalCases;
    const queryTypeParser = {
        "4": "neighborhood",
        "3": "city",
        "2": "province",
        "1": "country"
    }
    let searchArea = queryTypeParser[req.query.SearchQueryType]
    // const query = {
    //     [searchArea]: req.query.searchQueryText
    // };
    console.log(searchArea);

    CasesModel.find().countDocuments()
        .then(count => {
            totalCases = count;
            if (!req.query.searchQueryText || !req.query.SearchQueryType) {
                return CasesModel
                    .find()
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
            }
            if (req.query.searchQueryText || req.query.SearchQueryType) {
                console.log('search Area Below')
                //console.log(searchArea)
                return CasesModel
                    .find({
                        [searchArea]: req.query.searchQueryText
                    })
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
            }
        })
        .then(results => {
            console.log(results)
            res.status(200).json({
                message: 'Successfully reached render Cases API',
                data: results,
                totalCases: totalCases,
                perPage: perPage
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}