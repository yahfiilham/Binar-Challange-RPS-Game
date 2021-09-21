
const express = require('express');
const router = express.Router();

const { getPageLogin, createLogin, getDataUsersLogin } = require('../controllers/login');

router.get('/', getPageLogin);

router.post('/', createLogin);

router.get('/users/forgot-password', getDataUsersLogin);

module.exports = router;