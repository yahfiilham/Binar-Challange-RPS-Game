// get hello world
exports.index = (req, res) => {
    res.render('index', {
        title: 'Home Page'
    })
}