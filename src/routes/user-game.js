const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { createUserGame, getAllUserGame, getUserGameBiodata, updateUserGame, deleteUserGame, getPageCreateUser, getPageUpdateUser, getUserGameById } = require('../controllers/user-game');

const restrictLocal = require('../../middlewares/restrick-local');
// const { isAdmin } = require('../../middlewares/role');

// READ all data user-game
router.get('/user-game', restrictLocal, getAllUserGame);

// GET data user game by id
router.get('/user-game/:id' , getUserGameById);

// GET form create user-game
router.get('/user-game/create', getPageCreateUser);

// CREATE data user-game
router.post('/user-game', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
], createUserGame);

// READ detail data user-game biodata
router.get('/user-game/biodata/:id', getUserGameBiodata);

// GET form update user-game
router.get('/user-game/update/:id', getPageUpdateUser);

// UPDATE data user-game
router.put('/user-game', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
], updateUserGame);


router.delete('/user-game', deleteUserGame)

module.exports = router;