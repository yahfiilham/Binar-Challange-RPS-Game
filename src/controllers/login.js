const user = require('../../db/user.json');

exports.getPageLogin = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

exports.createLogin = (req, res) => {
    const { username, password } = req.body;
    user.map((item) => {
        // jika username dan password sama kirim token
        if (item.username == username && item.password == password) {
            // res.redirect('/user-game?isLogin=true'); 
            res.redirect('/user-game'); 
        } 
    });

    res.render('login', {
        title: 'Login Page',
        errors: 'username or password you entered is incorrect!',
    });
}


exports.getDataUsersLogin = (req, res) => {
    res.send(user);
}