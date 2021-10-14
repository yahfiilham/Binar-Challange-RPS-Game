const router = require('express' ).Router();
const { body, check } = require('express-validator');

// Tambahkan kode middleware ini setelah bagian controller
const restrict = require('../../middlewares/restrick');

// Controllers
const auth = require('../controllers/auth');

// Register client side
router.get('/register', (req, res) => res.render('register', {title: 'Register Page'}));
router.post('/register', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
    check('role').isIn(['admin', 'player']).withMessage("jika anda ingin memiliki hak akses ke semua data yang berada pada database masukan value 'admin', jika anda hanya ingin bermain game masukan value 'player'"),
], auth.register);

// Register di postman
router.post('/api/auth/register', [
    body('username').notEmpty().withMessage('username cannot be empty'),
    body('password').notEmpty().withMessage('password cannot be empty').isLength({ min: 8 }).withMessage('password has at least 8 characters'),
    check('role').isIn(['admin', 'player']).withMessage("jika anda ingin memiliki hak akses ke semua data yang berada pada database masukan value 'admin', jika anda hanya ingin bermain game masukan value 'player'"),
], auth.registerPostman);

// Login api
router.post('/api/auth/login', auth.login);

// login client side
router.get('/login', (req, res) => res.render('login', {title: 'Login Page', msg: req.flash('msg'),}));
router.post('/login', auth.loginPage);





module.exports = router;