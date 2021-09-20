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
        // res.status(200).json({
        //     status: "success",
        //     message: 'get all data users game success',
        //     data: users,
        // });

        res.render('dashbord', {
            title: 'Dashbord | User',
            users,
            msg: req.flash('msg'),
        });
    });
}

// menampilkan halaman create user
exports.getPageCreateUser = (req, res) => {
    res.render('create-user-game', {
        title: 'Create User',
    })
}

exports.createUserGame = (req, res) => {
    // menangkap req.body
    const {username, password, email } = req.body;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({
        //     status: 'failed',
        //     message: 'Invalid input value!',
        //     data: null,
        //     errors: errors.array(),
        // });
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
            email,
        })
        .then(user => {
            // res.status(201).json({
            //     status: 'success',
            //     message: `user with username ${username} has been created`,
            //     data: user,
            // });
            req.flash('msg', 'User created successfully!');
            // res.redirect(`/user-game/biodata/create`);
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
            // if (user) {
            //     res.status(200).json({
            //         status: 'success',
            //         message: `data with id ${req.params.id} has been found!`,
            //         data: user,
            //     });
            // } else {
            //     res.status(404).json({
            //         status: 'failed',
            //         message: `Data with the id ${req.params.id} not found!`,
            //         data: null,
            //     });
            // }

            // res.render('dashbord-biodata', {
            //     title: 'Dashbord | Biodata',
            //     user,
            // });
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
    const { username, password, email } = req.body;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid input value!',
            data: null,
            errors: errors.array(),
        });
        // return res.render('update-user-game', {
        //     title: "Form Update User",
        //     errors: errors.array(),
            
        // })
    }

    // proses update
    bcrypt.hash(password, 10, function(err, hash) {
        User_Game.update({
            username,
            password: hash,
            email,
        }, {
            where: { id: req.body.id }
        }
        )
        .then((result) => {
            // const updateresult = User_Game.findOne({
            //     where: { id: req.params.id }
            // })
            // .then(user => {
            //     if (!user) {
            //         res.status(404).json({
            //             status: 'failed',
            //             message: `Data with the id ${req.params.id} not found!`,
            //             data: null,
            //         })
            //     }
    
            //     res.status(201).json({
            //         status: 'success',
            //         message: `Data with the username ${username} has been updated in database!`,
            //         data: user,
            //     });
            // });
            req.flash('msg', 'User update successfully!');
            res.redirect('/user-game');
        });
    });
}

exports.deleteUserGame = (req, res) => {
    User_Game.destroy({
        where: { id: req.body.id }
    })
    .then(result => {
        // const updateUsers = User_Game.findAll()
        // .then(user => {
        //     res.status(200).json({
        //         status: 'success',
        //         message: `Data with the id ${req.params.id} has been deleted!`,
        //         data: user,
        //     });
        // });
        req.flash('msg', 'user has been deleted successfully!');
        res.redirect('/user-game');
    });
}