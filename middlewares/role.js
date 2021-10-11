// const { User_Game } = require('../models');

// exports.isAdmin = (req, res, next) => {
//     User_Game
//     .findAll()
//     .then(user => {
//         // user.getRoles().then(roles => {
//         //     for (let i = 0; i < roles.length; i++) {
//         //         console.log(roles[i].name);
//         //         if (roles[i].name.toUpperCase() === "ADMIN") {
//         //             next();
//         //             return;
//         //         }
//         //     }
//         //     res.status(403).send({
//         //         auth: false,
//         //         message: "Error",
//         //         message: 'Require Admin Role',
//         //     });
//         //     return;
//         // })
//         user.findOne({where: {role: user.role}})
//             .then(result => {
//                 console.log(result);
//                 if (result.role == 'admin') {
//                     return next();
//                 } else if (result.role == 'player') {
//                     res.redirect('/')
//                 }
//             })
//     });
// }