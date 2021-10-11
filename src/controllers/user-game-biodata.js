const { User_Game_Biodata, User_Game } = require('../../models');

const { validationResult } = require("express-validator");

exports.getFormUserBiodata = (req, res) => {
    User_Game.findOne({where: { id: req.params.id }})
        .then(user => {
            // res.json({user})
            res.render('create-user-game-biodata', {
                title: 'Create User Biodata',
                user,
            })
        });
}

// proses create user
exports.createUserGameBiodata = (req, res) => {
    // menangkap req.body
    const {firstName, lastName, dateOfBirth, noHp, profession, country, bio, age, education, userGameId } = req.body;
    const image = req.file.path;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid input value!',
            data: null,
            errors: errors.array(),
        });
    }

    if(!req.file) {
        return res.status(422).json({
            status: 'failed',
            message: 'image must be uploaded!',
            data: null,
            errors: errors.array(),
        });
    }

    User_Game_Biodata.create({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        no_hp: noHp,
        profession,
        country,
        image,
        bio,
        age,
        education,
        user_game_id: userGameId
    })
    .then(user => {
        id = req.params.id;
        req.flash('msg', 'user biodata has been created into the database!');
        res.redirect(`/user-game/biodata/${id}`);
    });
}


exports.getPageUpdateUserBiodata = (req, res) => {
    User_Game_Biodata.findOne({where: { user_game_id: req.params.user_game_id },})
    .then(user => {
        res.render('update-user-game-biodata', {
            title: 'Update User',
            user,
        })
    });
}

exports.updateUserGameBiodata = (req, res) => {
    // menangkap req.body
    const {firstName, lastName, dateOfBirth, noHp, profession, country, bio, age, education, userGameId } = req.body;
    const image = req.file.path;
    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid input value!',
            data: null,
            errors: errors.array(),
        });
    }

    if(!req.file) {
        return res.status(422).json({
            status: 'failed',
            message: 'image must be uploaded!',
            data: null,
            errors: errors.array(),
        });
    }

    // proses update
        User_Game_Biodata.update({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            no_hp: noHp,
            profession,
            country,
            image,
            bio,
            bio,
            age,
            education,
            user_game_id: userGameId
        }, {
            where: { user_game_id: req.body.userGameId }
        })
        .then(result => {
            id = req.params.id;
            console.log(id);
            req.flash('msg', 'user biodata has been updated in the database!');
            res.redirect(`/user-game/biodata/${id}`);
        });
}
