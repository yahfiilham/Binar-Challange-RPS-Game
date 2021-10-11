const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { createUserGameBiodata, getPageUpdateUserBiodata, updateUserGameBiodata, getFormUserBiodata } = require('../controllers/user-game-biodata');

// GET form user game bioddata
router.get('/user-game/biodata/create/:id', getFormUserBiodata);

// CREATE data user game biodata
router.post('/user-game/biodata/:id', [
    body('firstName').notEmpty().withMessage('firstName cannot be empty'),
    body('lastName').notEmpty().withMessage('lastName cannot be empty'),
    body('dateOfBirth').notEmpty().withMessage('dateOfBirth cannot be empty'),
    body('noHp').notEmpty().withMessage('noHp cannot be empty'),
    body('profession').notEmpty().withMessage('profession cannot be empty'),
    body('country').notEmpty().withMessage('country cannot be empty'),
    body('bio').notEmpty().withMessage('bio cannot be empty'),
    body('userGameId').notEmpty().withMessage('userGameId cannot be empty'),
    
], createUserGameBiodata);


// GET form update user-game
router.get('/user-game/biodata/update/:user_game_id', getPageUpdateUserBiodata);


// UPDATE data user-game-biodata
router.put('/user-game/biodata/:id', [
    body('firstName').notEmpty().withMessage('firstName cannot be empty'),
    body('lastName').notEmpty().withMessage('lastName cannot be empty'),
    body('dateOfBirth').notEmpty().withMessage('dateOfBirth cannot be empty'),
    body('noHp').notEmpty().withMessage('noHp cannot be empty'),
    body('profession').notEmpty().withMessage('profession cannot be empty'),
    body('country').notEmpty().withMessage('country cannot be empty'),
    body('bio').notEmpty().withMessage('bio cannot be empty'),
    body('userGameId').notEmpty().withMessage('userGameId cannot be empty'),
    
], updateUserGameBiodata);



module.exports = router;