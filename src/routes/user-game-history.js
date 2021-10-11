const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const restrick = require('../../middlewares/restrick')

const { createUserGameHistory, getFormUserHistory, getUserGameHistory, updateUserGameHistory, getPageUpdateUserHistory, getPlayerHistory} = require('../controllers/user-game-history');

// GET form user game bioddata
router.get('/user-game/history/create/:id', getFormUserHistory);

// CREATE data user-game-history
router.post('/user-game/history/:id', [
    body('totalMatch').notEmpty().withMessage('total match cannot be empty'),
    body('matchWon').notEmpty().withMessage('match won cannot be empty'),
    body('points').notEmpty().withMessage('points cannot be empty'),
    body('userGameId').notEmpty().withMessage('user game id cannot be empty'),
    
], createUserGameHistory);


// READ detail data user-game-history
router.get('/user-game/history/:user_game_id', getUserGameHistory);

// READ detail data user-game-history in postman
router.get('/api/user-game/history/:id', restrick, getPlayerHistory);

// GET form update user-game history
router.get('/user-game/history/update/:id', getPageUpdateUserHistory);

// UPDATE data user-game-history
router.put('/user-game/history/:id', [
    body('totalMatch').notEmpty().withMessage('total match cannot be empty'),
    body('matchWon').notEmpty().withMessage('match won cannot be empty'),
    body('points').notEmpty().withMessage('points cannot be empty'),
    body('userGameId').notEmpty().withMessage('user game id cannot be empty'),
    
], updateUserGameHistory);


module.exports = router;