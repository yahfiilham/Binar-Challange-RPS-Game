const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();
const port = 5000;

// setup method override
app.use(methodOverride('_method'));

// Menngunakan ejs
app.set('view engine', 'ejs');
app.use('/static/public', express.static('public'));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// setup img
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// To support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));


// const helloRoutes = require('./src/routes/hello');
const userGameRoutes = require('./src/routes/user-game');
const userGameBiodataRoutes = require('./src/routes/user-game-biodata');
const userGameHistoryRoutes = require('./src/routes/user-game-history');
const userLogin = require('./src/routes/login');

app.use('/', userGameBiodataRoutes);
app.use('/', userGameHistoryRoutes);
app.use('/', userLogin);

// buat middleware buat login
// app.use((req, res, next) => {
//     if (req.path === '/' || req.path === `/user-game/create` || req.path === '/user-game?isLogin=true' || req.path === '/ user-game/biodata/:id') {
//         next();
//     } else if (req.path === '/user-game') {
//         // console.log(req.query.isLogin); // /user-game?isLogin=true
//         if (req.query.isLogin == 'true') {
//             next();
//         } else {
//             res.redirect('/login');
//         }
//     } 
// });

// app.use('/', helloRoutes);
app.use('/', userGameRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});