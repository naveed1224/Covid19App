//main page controller


exports.getIndex = (req, res, next) => {
    res.render('mainPage/index', {
        test: 'Testing this app'
    });
}