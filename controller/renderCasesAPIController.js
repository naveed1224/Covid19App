const CasesModel = require('../models/cases');
const UserSignUpModel = require('../models/signupModel');


exports.renderAllCases = (req, res, next) => {
    console.log(req.query.page)
    const currentPage = req.query.page || 1;
    const perPage = 10;
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
    const perPage = 10;
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


exports.statsQueryController = (req, res, next) => {
    console.log(req.query)
    const statsQueryType = {

    }
    // documents today
    if (req.query.statsType === "1") {
        CasesModel.countDocuments({
                "createdAt": {
                    "$gte": new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()
                }
            })
            .then(result => {
                res.status(200).json({
                    message: "reached StatsQuery API",
                    data: result,
                    type: "Today"
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    //cases this week
    if (req.query.statsType === "2") {
        let dateObj = {}
        const today = new Date();
        const startDay = 0;
        const weekStart = new Date(today.getDate() - (7 + today.getDay() - startDay) % 7);
        dateObj.weekStartDate = weekStart.toISOString()
        CasesModel.countDocuments({
                "createdAt": {
                    "$gte": dateObj.weekStartDate
                }
            })
            .then(result => {
                res.status(200).json({
                    message: "reached StatsQuery API",
                    data: result,
                    type: "current Week"
                })
            })
            .catch(err => {
                console.log(err)
            })

    }
    if (req.query.statsType === "3") {
        let dateObj = {}
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateObj.monthStartDate = monthStart.toISOString()
        CasesModel.countDocuments({
                "createdAt": {
                    "$gte": dateObj.monthStartDate
                }
            })
            .then(result => {
                res.status(200).json({
                    message: "reached StatsQuery API",
                    data: result,
                    type: "current month"
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    if (req.query.statsType === "4") {
        CasesModel.countDocuments({})
            .then(result => {
                res.status(200).json({
                    message: "reached StatsQuery API",
                    data: result,
                    type: "current year"
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    if (req.query.statsType === "5") {
        let casesStats = {};
        let totalCityStat = {};
        CasesModel.aggregate([{
                    "$match": {
                        "createdAt": {
                            "$gte": new Date(new Date().setUTCHours(0, 0, 0, 0))
                            // "$lt": new Date("2020-05-22")
                        },
                    }
                },
                {
                    "$group": {
                        _id: {
                            "city": {
                                "city": "$city"
                            },
                            "neighborhood": {
                                "neighborhood": "$neighborhood"
                            },
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).then(result => {
                res.status(200).json({
                    message: "reached StatsQuery API",
                    data: result,
                    type: "count by province for today"
                })
                casesStats = result

            })
            .then(() => {
                CasesModel.aggregate([{
                            "$match": {
                                "createdAt": {
                                    "$gte": new Date(new Date().setUTCHours(0, 0, 0, 0))
                                    // "$lt": new Date("2020-05-22")
                                },
                            }
                        },
                        {
                            "$group": {
                                _id: {
                                    "city": "$city"
                                },
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ])
                    .then(result => {
                        for (const key in result) {
                            totalCityStat[result[key]._id.city] = result[key].count
                        }
                    })
                    .then(() => {

                        for (const key in casesStats) {
                            UserSignUpModel.find({
                                    neibhorhood: casesStats[key]._id.neighborhood.neighborhood
                                })
                                .then(user => {
                                    if (user.length > 0) {
                                        for (const userRecord of user) {
                                            console.log(`Your NeighborHood ${casesStats[key]._id.neighborhood.neighborhood} has ${casesStats[key].count} Cases and your city ${casesStats[key]._id.city.city} has ${totalCityStat[String(casesStats[key]._id.city.city)]} cases today`)

                                        }
                                    }
                                })
                        }
                    })
                    .then(() => {
                        console.log(totalCityStat)
                    })
                    .catch(err => console.log(err))

            })
    }

}