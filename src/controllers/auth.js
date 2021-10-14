// controllers/authController.js
const { User_Game } = require('../../models');
const passportLocal = require('../../lib/passpor-local');
const { validationResult } = require("express-validator");

function format(user) {
    const { id, username } = user;
    return {
        id,
        username,
        accessToken : user.generateToken(),
    }
}

module.exports = {
    register : (req, res, next) => {
        // validasi input user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', {
                title: "Register Page",
                errors: errors.array()
            })
        }
        // Kita panggil static method register yang sudah kita buat tadi
        console.log(req.body);
        User_Game.register (req.body)
        .then(() => {
            req.flash('msg', "registration successful, login now");
            res.redirect ('/login');
        })
        .catch(err => next(err))
    },
    registerPostman : (req, res, next) => {
        // validasi input user
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        // Kita panggil static method register yang sudah kita buat tadi
        User_Game.register (req.body)
        .then(() => {
            res.status(201).json({
                message: 'Register berhasil, silahkan login',
            })
        })
        .catch(err => next(err));
    },
    login: (req, res) => {
        User_Game.authenticate (req.body)
        .then(user => {
            return res.json(format(user));
        })
        .then(user => {
            user = restrict;
            res.json(user);
        })
        .catch(error => res.status(401).json({error}))
    },
    loginPage: passportLocal.authenticate('local', {
        successRedirect: `/user-game`,
        failureRedirect: '/login',
        failureFlash: true // Untuk mengaktifkan express flash
    }),

}