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
        // res.status(201).json({
        //     status: 'success',
        //     message: `user Biodata with name ${firstName} ${lastName} has been created`,
        //     data: user,
        // });
        id = req.params.id;
        req.flash('msg', 'User Biodata created successfully!');
        res.redirect(`/user-game/biodata/${id}`);
    });
}

exports.getAllUserGameBiodata = (req, res) => {
    User_Game_Biodata.findAll()
        .then(user => {
            res.status(200).json({
                status: "success",
                message: 'get all data users game success',
                data: user,
            });
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
            // const updateUsers = User_Game_Biodata.findOne({
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
            //         message: `Data with the name ${firstName} ${lastName} has been updated in database!`,
            //         data: user,
            //     });
            // });
            id = req.params.id;
            console.log(id);
            req.flash('msg', 'User Biodata update successfully!');
            res.redirect(`/user-game/biodata/${id}`);
        });
}

exports.getDetailUserGameBiodata = (req, res) => {
    User_Game_Biodata.findOne({
        where: { user_game_id: req.params.user_game_id },
        include: {
            model: User_Game,
            // as: 'userGame',
        }
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
            //     title: 'Dashbord | User Biodata',
            //     user,
            // });
        });
}

exports.deleteUserGameBiodata = (req, res) => {
    User_Game_Biodata.destroy({
        where: { id: req.params.id }
    })
    .then(result => {
        const updateUsers = User_Game_Biodata.findAll()
        .then(user => {
            res.status(200).json({
                status: 'success',
                message: `Data with the id ${req.params.id} has been deleted!`,
                data: user,
            });
        });
    });
}