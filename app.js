const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
//fetching routes
const mainPageRoutes = require('./routes/mainpage');
const caseRoutes = require('./routes/casesRoutes')
const notifyRoutes = require('./routes/notifyRoute')

const MONGODB_URI = 'mongodb+srv://Naveed:Bismillah4321@cluster0-7cieb.mongodb.net/covid19App?retryWrites=true&w=majority';

const app = express();

//receiving json in body
app.use(bodyParser.json());

//csrf protection
const csrfProtection = csrf()

//templating with ejs syntax
app.set('view engine', 'ejs');
app.set('views', 'views');

//parsing body of http request
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
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

mongoose.connect(MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        // console.log(result)
        app.listen(3000);
        console.log('listening on 3000')
    })
    .catch(err => {
        console.log(err)
    })