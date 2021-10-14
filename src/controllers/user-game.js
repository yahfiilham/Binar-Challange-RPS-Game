const { User_Game, User_Game_Biodata, User_Game_History } = require('../../models');

const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

exports.getAllUserGame = (req, res) => {
    User_Game.findAll({
        include: [
            {
                model: User_Game_Biodata,
                // as: 'userGameBiodata',
            },
            {
                model: User_Game_History,
                // as: 'userGameHistory',
            }
        ]})
    .then(users => {
        res.render('dashbord', {
            title: 'Dashbord | User',
            users,
            msg: req.flash('msg'),
            fail: req.flash('fail'),
            id: req.user.dataValues.id,
        });
    });
}

exports.getUserGameById = (req, res) => {
    User_Game.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: User_Game_Biodata,
                // as: 'userGameBiodata',
            },
            {
                model: User_Game_History,
                // as: 'userGameHistory',
            }
        ]
    })
    .then(user => {
        res.render('dashbord-user-game', {
            title: "User Game",
            user,
            msg: req.flash('msg'),
        })
        // res.json(user)
    })
}

// menampilkan halaman create user
exports.getPageCreateUser = (req, res) => {
    res.render('create-user-game', {
        title: 'Create User',
    })
}

exports.createUserGame = (req, res) => {
    // menangkap req.body
    const {username, password,} = req.body;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('create-user-game', {
            title: "Form Create User",
            errors: errors.array()
        })
    }

    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in your password DB.
        User_Game.create({
            username,
            password: hash,
        })
        .then(() => {
            req.flash('msg', 'user has been created into the database!');
            res.redirect('/user-game');
        });
    });
}

exports.getUserGameBiodata = (req, res) => {
    User_Game.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: User_Game_Biodata,
                // as: 'userGameBiodata',
            },
            {
                model: User_Game_History,
                // as: 'userGameHistory',
            }
        ]
    })
    .then(user => {
        res.render('dashbord-biodata', {
            title: 'Dashbord | User Biodata',
            user,
            msg: req.flash('msg'),
        });
    });
};

exports.getPageUpdateUser = (req, res) => {
    User_Game.findOne({where: { id: req.params.id },})
    .then(user => {
        res.render('update-user-game', {
            title: 'Update User',
            user,
        })
    });
}

exports.updateUserGame = (req, res) => {
    // menangkap req.body
    const { username, password,} = req.body;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('update-user-game', {
            title: "Form Update User",
            errors: errors.array(),
            user: req.body,
        })
    }

    // proses update
    bcrypt.hash(password, 10, function(err, hash) {
        User_Game.update({
            username,
            password: hash,
        }, {
            where: { id: req.body.id }
        }
        )
        .then(() => {
            req.flash('msg', 'user has been updated in the database!');
            res.redirect('/user-game');
        });
    });
}

exports.deleteUserGame = (req, res) => {
    User_Game.destroy({
        where: { id: req.body.id }
    })
    .then(result => {
        req.flash('msg', 'user has been deleted in the database!');
        res.redirect('/user-game');
    });
}
