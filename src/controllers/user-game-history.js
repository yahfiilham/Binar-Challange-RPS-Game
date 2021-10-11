const { User_Game_History, User_Game } = require('../../models');
const { validationResult } = require("express-validator");

// const Game = require('../../public/javascript/game');

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
            id =  req.params.id;
            req.flash('msg', 'user game history has been created into the database!');
            res.redirect(`/user-game/history/${id}`);
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
            userGameId = req.params.user_game_id
            res.render('dashbord-history', {
                title: 'Dashbord | History',
                users,
                userGameId,
                msg: req.flash('msg'),
            });
        });
};

exports.getPlayerHistory = (req, res) => {
    User_Game_History.findAll({
        where: { user_game_id: req.params.id},
    })
    .then(history => {
        res.status(200).json({history});
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
            id = req.params.id;
            req.flash('msg', 'user game history has been updated in the database!');
            res.redirect(`/user-game/history/${id}`);
        });
}