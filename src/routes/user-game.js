const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { createUserGame, getAllUserGame, getUserGameBiodata, updateUserGame, deleteUserGame, getPageCreateUser, getPageUpdateUser } = require('../controllers/user-game');

// READ all data user-game
router.get('/user-game', getAllUserGame);

// GET form create user-game
router.get('/user-game/create', getPageCreateUser);

// CREATE data user-game
router.post('/user-game', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('email').isEmail().withMessage('email format does not match'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
], createUserGame);

// READ detail data user-game biodata
router.get('/user-game/biodata/:id', getUserGameBiodata);

// GET form update user-game
router.get('/user-game/update/:id', getPageUpdateUser);

// UPDATE data user-game
router.put('/user-game', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('email').isEmail().withMessage('email format does not match'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
], updateUserGame);


router.delete('/user-game', deleteUserGame)

module.exports = router;