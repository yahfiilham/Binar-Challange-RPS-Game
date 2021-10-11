// lib/passport.js
const passport = require('passport' );
const { Strategy : JwtStrategy, ExtractJwt } = require('passport-jwt' );
const { User_Game } = require('../models' );

/* Passport JWT Options */
const options = {
    // Untuk mengekstrak JWT dari request, dan mengambil token-nya dari header yang bernama Authorization
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    /* Harus sama seperti dengan apa yang kita masukkan sebagai parameter kedua dari jwt.sign di User Model.
    Inilah yang kita pakai untuk memverifikasi apakah tokennya dibuat oleh sistem kita */
    secretOrKey : 'rahasia' ,
}

passport.use(new JwtStrategy (options, async (payload, done) => {
// payload adalah hasil terjemahan JWT, sesuai dengan apa yang kita masukkan di parameter pertama dari jwt.sign
User_Game.findByPk (payload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false))
}));


module.exports = passport


































// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const { User } = require('../models');

// /* Fungsi untuk authentication */
// async function authenticate(username, password, done) {
//     try {
//         // Memanggil method kita yang tadi
//         const user = await User.authenticate({ username, password });
//         /*
//         done adalah callback, parameter pertamanya adalah error,
//         jika tidak ada error, maka kita beri null saja.
//         Parameter keduanya adalah data yang nantinya dapat
//         kita akses di dalam req.user */
//         return done(null, user);
//     }
//     catch(err) {
//         /* Parameter ketiga akan dilempar ke dalam flash */
//         return done(null, false, { message: err.message });
//     }
// }

// passport.use(
//     new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticate));
//     /* Serialize dan Deserialize
//         Cara untuk membuat sesi dan menghapus sesi
//     */
//     passport.serializeUser(
//         (user, done) => done(null, user.id)
//     );

//     passport.deserializeUser(
//         async (id, done) => done(null, await User.findByPk(id))
//     );


// // Kita exports karena akan kita gunakan sebagai middleware
// module.exports = passport
