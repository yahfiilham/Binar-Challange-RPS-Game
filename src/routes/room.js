const express = require('express');
const router = express.Router();

const {check} = require('express-validator');

const restrickLocal = require('../../middlewares/restrick-local');
const restrick = require('../../middlewares/restrick');
// const validationGame = require('../../middlewares/validation-game');

const { createRoom, createRoomPostman, getPageRPS, fightRPSGame, rPSPostman, getPageInputRoomCode, getPageCreateRoom, inputRoomCode } = require('../controllers/room');

// create room client side
router.get('/user-game/create-room', restrickLocal, getPageCreateRoom);
router.post('/user-game/create-room', createRoom);

// create room api (postman)
router.post('/api/room/create-room', restrick, createRoomPostman);

// get Page RPS Game
router.get('/room/fight/:room_id', restrickLocal, getPageRPS);
router.post('/room/fight/:room_id', restrickLocal, fightRPSGame);

// // render game page validation
router.get('/room/join', restrickLocal, getPageInputRoomCode);
router.post('/room/join', inputRoomCode);

// fight room di postman
router.patch('/api/room/fight/:room_id', [
    restrick,
    check('handChoiceRound1').isIn(['rock', 'paper', 'scissors']).withMessage("anda hanya bisa memilih/input salah satu dari tiga value berikut: 'rock' - 'paper' - 'scissors'!"),
    check('handChoiceRound2').isIn(['rock', 'paper', 'scissors']).withMessage("anda hanya bisa memilih/input salah satu dari tiga value berikut: 'rock' - 'paper' - 'scissors'!"),
    check('handChoiceRound3').isIn(['rock', 'paper', 'scissors']).withMessage("anda hanya bisa memilih/input salah satu dari tiga value berikut: 'rock' - 'paper' - 'scissors'!"),
], rPSPostman);


module.exports = router;