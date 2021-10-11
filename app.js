const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('express-flash');

const app = express();
const port = 5000;

// setup method override
app.use(methodOverride('_method'));

// To support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// etting session handler
app.use(session({
    secret: 'Buat ini jadi rahasia',
    resave: false,
    saveUninitialized: false
    }))    
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

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// use passport
const passport = require('./lib/passport');
const passportLocal = require('./lib/passpor-local');
app.use(passport.initialize());
app.use(passportLocal.initialize());
app.use(passportLocal.session());

// Menngunakan ejs
app.set('view engine', 'ejs');
app.use('/static/public', express.static('public'));

const helloRoutes = require('./src/routes');
const userGameRoutes = require('./src/routes/user-game');
const userGameBiodataRoutes = require('./src/routes/user-game-biodata');
const userGameHistoryRoutes = require('./src/routes/user-game-history');
const auth = require('./src/routes/auth');
const room = require('./src/routes/room');

app.use('/', room);
app.use('/', userGameRoutes);
app.use('/', userGameBiodataRoutes);
app.use('/', userGameHistoryRoutes);
app.use('/', auth);
app.use('/', helloRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});