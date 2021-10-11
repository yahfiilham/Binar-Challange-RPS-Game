const router = require('express' ).Router();
const { body, check } = require('express-validator');

// Tambahkan kode middleware ini setelah bagian controller
const restrict = require('../../middlewares/restrick');

// Controllers
const auth = require('../controllers/auth');

// Register 
router.post('/api/auth/register', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
    check('role').isIn(['admin', 'player']).withMessage("jika anda ingin memiliki hak akses ke semua data yang berada pada database masukan value 'admin', jika anda hanya ingin bermain game masukan value 'player'"),
], auth.register);

// Login api
router.post('/api/auth/login', auth.login);

// login client side
router.get('/login', (req, res) => res.render('login', {title: 'Login Page'}));
router.post('/login', auth.loginPage);





module.exports = router;