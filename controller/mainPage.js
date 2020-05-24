//main page controller


exports.getIndex = (req, res, next) => {
    res.render('mainPage/index');
}

exports.privacy = (req, res, next) => {
    res.render('mainPage/privacy');
}

exports.about = (req, res, next) => {
    res.render('mainPage/about');
}