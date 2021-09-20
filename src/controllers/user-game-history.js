const { User_Game_History, User_Game } = require('../../models');

const { validationResult } = require("express-validator");

exports.getFormUserHistory = (req, res) => {
    User_Game_History.findOne({where: { id: req.params.id }})
        .then(user => {
            // res.json({user})

            id = req.params.id;
            res.render('form-user-game-history', {
                title: 'Create User History',
                user,
                id,
            })
        });
}

exports.createUserGameHistory = (req, res) => {
    // menangkap req.body
    const {totalMatch, matchWon, points, userGameId } = req.body;

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

    User_Game_History.create({
        total_match: totalMatch,
        match_won: matchWon,
        points,
        user_game_id: userGameId
    })
        .then(user => {
            // res.status(201).json({
            //     status: 'success',
            //     message: `data with user game id ${userGameId} has been created`,
            //     data: user,
            // });
            id =  req.params.id;
            req.flash('msg', 'User History created successfully!');
            res.redirect(`/user-game/history/${id}`);
        });
}

exports.getAllUserGameHistory = (req, res) => {
        User_Game_History.findAll()
        .then(user => {
            res.status(200).json({
                status: "success",
                message: 'get all data users game history success',
                data: user,
            });
        });
    }

exports.getUserGameHistory = (req, res) => {
    User_Game_History.findAll({
        where: { user_game_id: req.params.user_game_id },
        include: {
            model: User_Game,
            // as: 'userGame',
        }
    })
        .then(users => {

            // if (users) {
            //     res.status(200).json({
            //         status: 'success',
            //         message: `data with id ${req.params.id} has been found!`,
            //         data: users,
            //     });
            // } else {
            //     res.status(404).json({
            //         status: 'failed',
            //         message: `Data with the id ${req.params.id} not found!`,
            //         data: null,
            //     });
            // }
            userGameId = req.params.user_game_id
            res.render('dashbord-history', {
                title: 'Dashbord | History',
                users,
                userGameId,
                msg: req.flash('msg'),
            });
        });
};

exports.getPageUpdateUserHistory = (req, res) => {
    User_Game_History.findOne({where: { id: req.params.id },})
    .then(user => {
        res.render('update-user-game-history', {
            title: 'Update User History',
            user,
        })
    });
}

exports.updateUserGameHistory = (req, res) => {
    // menangkap req.body
    const {totalMatch, matchWon, points, userGameId } = req.body;

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

    // proses update
        User_Game_History.update({
            total_match: totalMatch,
            match_won: matchWon,
            points,
            user_game_id: userGameId
        }, {
            where: { id: req.body.id }
        })
        .then(result => {
            // const updateUsers = User_Game_History.findOne({
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
            //         message: `Data with the user game id ${userGameId} has been updated in database!`,
            //         data: user,
            //     });
            // });
            id = req.params.id;
            req.flash('msg', 'User History update successfully!');
            res.redirect(`/user-game/history/${id}`);
        });
}

exports.deleteUserGameHistory = (req, res) => {
    User_Game_History.destroy({
        where: { id: req.params.id }
    })
    .then(result => {
        const updateUsers = User_Game_History.findAll()
        .then(user => {
            res.status(200).json({
                status: 'success',
                message: `Data with the id ${req.params.id} has been deleted!`,
                data: user,
            });
        });
    });
}