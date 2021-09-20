// get hello world
exports.getHello = (req, res) => {
    res.render('hello', {
        title: 'Home Page'
    })
}