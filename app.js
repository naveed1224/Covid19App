const path = require('path');
const fs = require('fs');
const https = require('https')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
//fetching routes
const mainPageRoutes = require('./routes/mainpage');
const caseRoutes = require('./routes/casesRoutes');
const notifyRoutes = require('./routes/notifyRoute');
const signRoutes = require('./routes/signupRoutes');
const covid19APIRoutes = require('./routes/covid19API');
const CasesModel = require('./models/cases');
const UserSignUpModel = require('./models/signupModel');
//require('dotenv').config()

//securing incoming Requests
const helmet = require('helmet');

//compressing assets
const compression = require("compression");

//cron backgroud job
const cron = require("node-cron");

//logging
const morgan = require("morgan");

//twilio account connection setup
const accountSid = 'AC50430158c37f3e30943dc2f16350aa21';
const authToken = 'e5e0a136a3e3841488b6a31c3f110a35';
const client = require('twilio')(accountSid, authToken);

const privatekey = fs.readFileSync('server.key');
const certificateFile = fs.readFileSync('server.cert');

let MONGODB_URI = `${process.env.MONGO_URL}`;

const fileLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})

const app = express();
app.use(helmet());
app.use(compression());
app.use(morgan("combined", {
    stream: fileLogStream
}))

//receiving json in body
app.use(bodyParser.json());

//templating with ejs syntax
app.set('view engine', 'ejs');
app.set('views', 'views');

//static files: javascript/css
app.use('/static', express.static(path.join(__dirname, 'public')))

//setting headers to accept CORS for APIs
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("HOST_CORS_ALLOWED_ORIGINS", "*")
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

//parsing the routes
app.use(mainPageRoutes);
app.use('/case', caseRoutes);
app.use('/email', notifyRoutes);
app.use('/notifications', signRoutes);
app.use('/API', covid19APIRoutes);

//cron backend job
cron.schedule("* * * * *", function () {
    console.log('hello')
    let casesStats = {};
    let totalCityStat = {};
    const hostname = (req, res, next) => {

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
                                    neibhorhood: casesStats[key]._id.neighborhood.neighborhood,
                                    status: true
                                })
                                .then(user => {
                                    if (user.length > 0) {
                                        for (const userRecord of user) {
                                            let message = `Hello,\n\nCommunity Anonymous Cases today:\n\nYour Neighborhood - ${casesStats[key]._id.neighborhood.neighborhood}: ${casesStats[key].count} Cases\n\nYour city - ${casesStats[key]._id.city.city}: ${totalCityStat[String(casesStats[key]._id.city.city)]} cases\n\nStay Safe,\nAnonymous Covid19 Response Team\n\nFor more information:\n http://${req.headers.host}\n\nTo stop Receiving Messages, click:\n http://${req.headers.host}/notifications/signup/confirmDelete/${userRecord._id}?confirmCode=${userRecord.confirmCode}`;
                                            client.messages
                                                .create({
                                                    body: message,
                                                    from: '+12066874626',
                                                    to: userRecord.phone
                                                })
                                                .then(() => console.log("Messages sent based on schedule."))
                                                .catch(err => console.log(err))
                                        }
                                    }
                                })
                                .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err))

            })
    }
});

mongoose.connect(MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err)
    })

// https encryption manually
// https.createServer({
//     key: privatekey,
//     cert: certificateFile
// }, app).listen(process.env.PORT || 3000);