const { room, user_in_room, User_Game, User_Game_History} = require('../../models');

const { validationResult } = require("express-validator");

exports.getPageCreateRoom = (req, res) => {
    room.findAll()
    .then(() => {
        user = req.user.dataValues;
        res.render('create-room', {
            title: 'Create Room',
            user,
        })
    })
}

exports.createRoom = (req, res) => {
    // menangkap req.body
    const capacity = 2;
    const { roomName } = req.body;

    // generate uniq code
    let randomCode = Math.floor(Math.random() * 1000);
    let uniqCode = randomCode + roomName[0] + roomName[1] + roomName[3];

    // proses buat room
    room.create({
        room_name: roomName,
        capacity,
        player1_id: req.user.dataValues.id,
        uniq_code: uniqCode
    })
    .then(room => {
        res.render('success-create-room', {
            title: 'Success Create Room',
            room,
        });
    })
}

exports.createRoomPostman = (req, res) => {
    // menangkap req.body
    const { roomName } = req.body;

    // generate uniq code
    let randomCode = Math.floor(Math.random() * 1000);
    let uniqCode = randomCode + roomName[0] + roomName[1] + roomName[3];

    // proses buat room
    room.create({
        room_name: roomName,
        uniq_code: uniqCode
    })
    .then(user => {
        res.status(201).json({
            message: "room game berhasil dibuat",
            room_id: user.id,
        })
    })
}

// exports.getPageInputRoomCode = (req, res) => {
//     room.findOne({where: { id: req.params.id }})
//     .then(room => {
//         if (!room) {
//             return res.redirect('/user-game/create-room');
//         }
//         res.render('input-uniq-code', {
//             title: "Input Unique Code",
//             room,
//             fail: req.flash('fail'),
//         })
//     })
// }

// exports.inputRoomCode = (req, res) => {
//     room.findOne({where: { playerid: req.params.id }})
    
//     .then(room => {
//         console.log('test', room);
//         // req.flash('error', "");
//         if ((room.player1_id === req.user.dataValues.id || room.player2_id === req.user.dataValues.id) && room.id === req.body.room_id) {
//             res.redirect(`/room/fight/${room.id}`)
//         }

//         // return res.redirect(`/room/join/${req.params.id}`)
//     })
// }

exports.getPageRPS = (req, res) => {
    room.findOne({
        where: { id: req.params.room_id },
    })
    .then( room => {
        if (room.player1_id === null) {
            return room.update({player1_id: req.user.dataValues.id,}, {where: { id: req.params.id }});
        }

        if (room.player2_id === null) return (room.player1_id !== req.user.dataValues.id) ? room.update({player2_id: req.user.dataValues.id,}, {where: { id: req.params.id }}) : room.update({player1_id: req.user.dataValues.id,}, {where: { id: req.params.id }});

        // if (req.user.dataValues.id !== room.player1_id && req.user.dataValues.id !== room.player2_id) return res.status(400).json({message: 'mohon maaf, room sudah penuh. Silahkan cari room yang lain'})

        if (req.user.dataValues.id !== room.player1_id && req.user.dataValues.id !== room.player2_id) {
            req.flash('fail', "mohon maaf, room sudah penuh. Silahkan cari room yang lain");
            return res.redirect(`/user-game`);
        } 
        return room;
    })
    .then( room => {
        res.render('game', {
            title: "RPS Game",
            room,
            msg: req.flash('msg'),
        });
    });
}

exports.fightRPSGame = (req, res) => {
    room.findOne({
        where: { id: req.params.room_id },
    })
    // input pilihan player round 1
    .then( room => {
        // player 1
        if (req.user.dataValues.id ==  room.player1_id) {
            if (room.hand_choice_player1 == null) {
                console.log('tangan: ', req.body.handChoice);
                return room.update({
                    hand_choice_player1: [req.body.handChoice, null, null],
                }, {where: { id: req.params.room_id }})
                // room round 1
            } 
        }

        // player 2
        if (req.user.dataValues.id == room.player2_id) {
            // console.log(room.hand_choice_player1 == null);
            if (room.hand_choice_player2 == null) {
                console.log('player2: ', req.body.handChoice);
                return room.update({
                    hand_choice_player2: [req.body.handChoice, null, null],
                }, {where: { id: req.params.room_id }})
                // room round 1
            } 
        }
        return room;
    })
    // result round 1
    .then(room => {
        // console.log('room: ', room);
        // jika player1 atau player2 belum memasukan pilihannya kasih tahu player lain untuk menunggu
        // console.log(room.hand_choice_player1 == null);
        // console.log(room.hand_choice_player2 == null);
        if (room.hand_choice_player1 == null || room.hand_choice_player2 == null) {
            // return res.status(400).json({
            //     message: 'tunggu bentar ya, player lain belum input pilihan tangannya, coba sesaat lagi'
            // })
            req.flash('msg', 'waiting for opponents choice');
            console.log(room.id);
            return res.render(`game-waiting-opponent-choice`, {
                room,
                msg: req.flash('msg'),
            })
        }
    
        if(room.hand_choice_player1[0] == room.hand_choice_player2[0]) return room.update({
            result_player1: [50, 0, 0],
            result_player2: [50, 0, 0],
        }, {where: { id: req.params.room_id }})
    
        if(room.hand_choice_player1[0] == 'rock') return (room.hand_choice_player2[0] == 'paper') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }})
    
        if (room.hand_choice_player1[0] == 'paper') return (room.hand_choice_player2[0] == 'scissors') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }})
    
        if(room.hand_choice_player1[0] == 'scissors') return (room.hand_choice_player2[0] == 'rock') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }})

        return room;
    })
    // hasil pertandingan ronde 1
    .then( async room => {
        console.log('final: ', room);
        const totalScorePlayer1 = room.result_player1[0];
        const totalScorePlayer2 = room.result_player2[0];

        const player1 = await User_Game.findOne({where: {id: room.player1_id}});
        const player2 = await User_Game.findOne({where: {id: room.player2_id}});
        // console.log(player1);
        // console.log(player2);

        // penentuan pemenang
        let winner = ((totalScorePlayer1, totalScorePlayer2) => {
            // console.log(totalScorePlayer1);
            // console.log(totalScorePlayer2);
            if (totalScorePlayer1 > totalScorePlayer2) {
                return win = `${player1.username} win`
                // return res.render('')
            }
            if (totalScorePlayer1 < totalScorePlayer2) {
                return win = `${player2.username} win`
            }
            if (totalScorePlayer1 = totalScorePlayer2) {
                return win = 'DRAW'
            }
        });

        const totalMatchPlayer1 = await User_Game_History.count({where: {user_game_id: room.player1_id}}) + 1;
        const totalMatchPlayer2 = await User_Game_History.count({where: {user_game_id: room.player2_id}}) + 1;

        // // console.log('hasil: ', winner(totalScorePlayer1, totalScorePlayer2));
        // // kirimkan hasil pertandingan round 1
        req.flash('msg', winner(totalScorePlayer1, totalScorePlayer2));
        // // return res.redirect(`/room/fight/play/${room.id}`)
        // return res.render('result-game', {
        //     title: "RPS Game",
        //     room,
        //     msg: req.flash('msg'),
        //     player1,
        //     player2,
        // });
        // player 1 
        if (req.user.dataValues.id ==  room.player1_id) {
            User_Game_History.findOne({where: {room_id: req.params.room_id, user_game_id: req.user.dataValues.id}})
            .then(check => {
                // console.log(check);
                // cek player sudah atau belum main di room yang dituju, jika belum player akan mendapatkan hasil pertandingan, jika sudah player akan mendapatkan pesan
                if (check !== null) {
                    req.flash('error', "sorry, you've played in the room, if you want to play again, create a new room or join a room via the link you got from your friends");
                    return res.render('validasi-play-game', {
                        title: 'Error Room',
                        error: req.flash('error'),
                        id: req.user.dataValues.id
                    });
                }
    
                return User_Game_History.create({
                    room_id: room.id,
                    user_game_id: req.user.dataValues.id,
                    total_match: totalMatchPlayer1,
                    points: totalScorePlayer1,
                })
                .then(() => {
                    // console.log('test2: ', room);
                    // req.flash('msg', winner(totalScorePlayer1, totalScorePlayer2));
                    return res.render('result-game', {
                        title: "RPS Game",
                        room,
                        msg: req.flash('msg'),
                        player1,
                        player2,
                    });
                })
            })
        }

        // player 2
        if (req.user.dataValues.id ==  room.player2_id) {
            User_Game_History.findOne({where: {room_id: req.params.room_id, user_game_id: req.user.dataValues.id}})
            .then(check => {
                // console.log('history: ', check);
                // cek player sudah atau belum main di room yang dituju, jika belum player akan mendapatkan hasil pertandingan, jika sudah player akan mendapatkan pesan
                if (check !== null ) {
                    req.flash('error', "sorry, you've played in the room, if you want to play again, create a new room or join a room via the link you got from your friends");
                    return res.render('validasi-play-game', {
                        title: 'Error Room',
                        error: req.flash('error'),
                        id: req.user.dataValues.id
                    })
                }
    
                return User_Game_History.create({
                    room_id: room.id,
                    user_game_id: req.user.dataValues.id,
                    total_match: totalMatchPlayer2,
                    points: totalScorePlayer2,
                })
                .then(() => {
                    // console.log('test2: ', room);
                    return res.render('result-game', {
                        title: "RPS Game",
                        room,
                        msg: req.flash('msg'),
                        player1,
                        player2,
                    });
                })
            })
        }

        // return room;
    })
    // input pilihan player round 2
    // .then( () => {
    //     room.findOne({
    //         where: { id: req.params.room_id },
    //     })
    //     .then(room => {
    //         console.log('room2: ', room);
    //         // player 1
    //         if (req.user.dataValues.id ==  room.player1_id) {
    //             if (room.hand_choice_player1[1] == null) {
    //                 console.log('tangan: ', req.body.handChoice);
    //                 return room.update({
    //                     hand_choice_player1: [room.hand_choice_player1[0], req.body.handChoice, null],
    //                 }, {where: { id: req.params.room_id }});
    //             } 
    //         }
    
    //         // player 2
    //         if (req.user.dataValues.id == room.player2_id) {
    //             // console.log(room.hand_choice_player1 == null);
    //             if (room.hand_choice_player2[1] == null) {
    //                 console.log('player2: ', req.body.handChoice);
    //                 return room.update({
    //                     hand_choice_player2: [room.hand_choice_player2[0], req.body.handChoice, null],
    //                 }, {where: { id: req.params.room_id }})
    //             } 
    //         }
    //         return room;
    //     })
    //     // result round 2
    //     .then(room => {
    //         // console.log('room: ', room);
    //         // jika player1 atau player2 belum memasukan pilihannya kasih tahu player lain untuk menunggu
    //         console.log(room.hand_choice_player1[1] == null);
    //         console.log(room.hand_choice_player2[1] == null);
    //         if (room.hand_choice_player1[1] == null || room.hand_choice_player2[1] == null) {
    //             return res.status(400).json({
    //                 message: 'tunggu bentar ya, player lain belum input pilihan tangannya, coba sesaat lagi'
    //             })
    //         }
        
    //         if(room.hand_choice_player1[1] == room.hand_choice_player2[1]) return room.update({
    //             result_player1: [room.result_player1[0], 50, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 50, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }});
        
    //         if(room.hand_choice_player1[1] == 'rock') return (room.hand_choice_player2[1] == 'paper') ? room.update({
    //             result_player1: [room.result_player1[0], 0, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 100, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }}) : room.update({
    //             result_player1: [room.result_player1[0], 100, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 0, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }});
        
    //         if (room.hand_choice_player1[1] == 'paper') return (room.hand_choice_player2[1] == 'scissors') ? room.update({
    //             result_player1: [room.result_player1[0], 0, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 100, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }}) : room.update({
    //             result_player1: [room.result_player1[0], 100, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 0, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }});
        
    //         if(room.hand_choice_player1[1] == 'scissors') return (room.hand_choice_player2[1] == 'rock') ? room.update({
    //             result_player1: [room.result_player1[0], 0, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 100, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }}) : room.update({
    //             result_player1: [room.result_player1[0], 100, room.result_player1[2]],
    //             result_player2: [room.result_player2[0], 0, room.result_player2[2]],
    //         }, {where: { id: req.params.room_id }});
    //         return room;
    //     })
    //     // hasil pertandingan ronde 2
    //     .then( room => {
    //         // console.log('final: ', room);
    //         const totalScorePlayer1 = room.result_player1[1];
    //         const totalScorePlayer2 = room.result_player2[1];
    
    //         // penentuan pemenang
    //         let winner = ((totalScorePlayer1, totalScorePlayer2) => {
    //             // console.log(totalScorePlayer1);
    //             // console.log(totalScorePlayer2);
    //             if (totalScorePlayer1 > totalScorePlayer2) {
    //                 return win = 'player 1 win'
    //                 // return res.render('')
    //             }
    //             if (totalScorePlayer1 < totalScorePlayer2) {
    //                 return win = 'player 2 win'
    //             }
    //             if (totalScorePlayer1 = totalScorePlayer2) {
    //                 return win = 'DRAW'
    //             }
    //         });
    
    //         console.log(winner(totalScorePlayer1, totalScorePlayer2));
    
    //         // kirimkan hasil pertandingan round 1
    //         req.flash('msg', winner(totalScorePlayer1, totalScorePlayer2));
    //         return res.redirect(`/room/fight/play/${room.id}`)
    //     })
    // })
}

exports.rPSPostman = (req, res, next) => {
    // validasi input player
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'failed',
            message: 'Invalid input value!',
            data: null,
            errors: errors.array(),
        });
    }

    room.findOne({
        where: { id: req.params.room_id },
    })
    // cek player sudah ada atau belum di room / cek room udah penuh atau masih kosong
    .then( room => {
        // console.log(req.user.dataValues.id);
        if (room.player1_id === null) {
            return room.update({player1_id: req.user.dataValues.id,}, {where: { id: req.params.id }});
        }
        if (room.player2_id === null) return (room.player1_id !== req.user.dataValues.id) ? room.update({player2_id: req.user.dataValues.id,}, {where: { id: req.params.id }}) : room.update({player1_id: req.user.dataValues.id,}, {where: { id: req.params.id }});
        // console.log('1: ', req.user.dataValues.id !== room.player1_id);
        // console.log('2: ', req.user.dataValues.id !== room.player2_id);
        if (req.user.dataValues.id !== room.player1_id && req.user.dataValues.id !== room.player2_id) return res.status(400).json({message: 'mohon maaf, room sudah penuh. Silahkan cari room yang lain'})
        // console.log("cek room: ", room);
        return room;
    })
    // input pilihan player
    .then( room => {
        // console.log('player1: ', req.user.dataValues.id);
        // console.log('choicce 1: ', player.hand_choice_player1[0]);

        // player 1
        if (req.user.dataValues.id ==  room.player1_id) {
            if (room.hand_choice_player1 == null) {
                console.log('tangan: ', req.body.handChoiceRound1);
                return room.update({
                    hand_choice_player1: [req.body.handChoiceRound1, req.body.handChoiceRound2, req.body.handChoiceRound3],
                }, {where: { id: req.params.room_id }});
            } 
        }

        // player 2
        if (req.user.dataValues.id == room.player2_id) {
            // console.log(room.hand_choice_player1 == null);
            if (room.hand_choice_player2 == null) {
                return room.update({
                    hand_choice_player2: [req.body.handChoiceRound1, req.body.handChoiceRound2, req.body.handChoiceRound3],
                }, {where: { id: req.params.room_id }})
            } 
        }
        return room;
    })
    // scorsing
    // jika seri masing-masing dapat 50 poin
    // jika menang akan mendapat 100 poin
    // jika kalah akan mendapat 0 poin

    // result round 1
    .then(room => {
        // console.log('room: ', room);
        // jika player1 atau player2 belum memasukan pilihannya kasih tahu player lain untuk menunggu
        if (room.hand_choice_player1 == null || room.hand_choice_player2 == null) {
            return res.status(400).json({
                message: 'tunggu bentar ya, player lain belum input pilihan tangannya, coba sesaat lagi'
            })
        }
    
        if(room.hand_choice_player1[0] == room.hand_choice_player2[0]) return room.update({
            result_player1: [50, 0, 0],
            result_player2: [50, 0, 0],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[0] == 'rock') return (room.hand_choice_player2[0] == 'paper') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }});
    
        if (room.hand_choice_player1[0] == 'paper') return (room.hand_choice_player2[0] == 'scissors') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[0] == 'scissors') return (room.hand_choice_player2[0] == 'rock') ? room.update({
            result_player1: [0, 0, 0],
            result_player2: [100, 0, 0],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [100, 0, 0],
            result_player2: [0, 0, 0],
        }, {where: { id: req.params.room_id }});
        return room;
    })
    // result round 2
    .then(room => {
        // console.log('room: ', room);
        // jika player1 atau player2 belum memasukan pilihannya kasih tahu player lain untuk menunggu
        if (room.hand_choice_player1 == null || room.hand_choice_player2 == null) {
            return res.status(400).json({
                message: 'tunggu bentar ya, player lain belum input pilihan tangannya, coba sesaat lagi'
            })
        }
    
        if(room.hand_choice_player1[1] == room.hand_choice_player2[1]) return room.update({
            result_player1: [room.result_player1[0], 50, room.result_player1[2]],
            result_player2: [room.result_player2[0], 50, room.result_player2[2]],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[1] == 'rock') return (room.hand_choice_player2[1] == 'paper') ? room.update({
            result_player1: [room.result_player1[0], 0, room.result_player1[2]],
            result_player2: [room.result_player2[0], 100, room.result_player2[2]],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], 100, room.result_player1[2]],
            result_player2: [room.result_player2[0], 0, room.result_player2[2]],
        }, {where: { id: req.params.room_id }});
    
        if (room.hand_choice_player1[1] == 'paper') return (room.hand_choice_player2[1] == 'scissors') ? room.update({
            result_player1: [room.result_player1[0], 0, room.result_player1[2]],
            result_player2: [room.result_player2[0], 100, room.result_player2[2]],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], 100, room.result_player1[2]],
            result_player2: [room.result_player2[0], 0, room.result_player2[2]],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[1] == 'scissors') return (room.hand_choice_player2[1] == 'rock') ? room.update({
            result_player1: [room.result_player1[0], 0, room.result_player1[2]],
            result_player2: [room.result_player2[0], 100, room.result_player2[2]],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], 100, room.result_player1[2]],
            result_player2: [room.result_player2[0], 0, room.result_player2[2]],
        }, {where: { id: req.params.room_id }});
        return room;
    })
    // result round 3
    .then(room => {
        // jika player1 atau player2 belum memasukan pilihannya kasih tahu player lain untuk menunggu
        if (room.hand_choice_player1 == null || room.hand_choice_player2 == null) {
            return res.status(400).json({
                message: 'tunggu bentar ya, player lain belum input pilihan tangannya, coba sesaat lagi'
            })
        }
    
        if(room.hand_choice_player1[2] == room.hand_choice_player2[2]) return room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 50],
            result_player2: [room.result_player2[0], room.result_player2[1], 50],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[2] == 'rock') return (room.hand_choice_player2[2] == 'paper') ? room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 0],
            result_player2: [room.result_player2[0], room.result_player2[1], 100],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 100],
            result_player2: [room.result_player2[0], room.result_player2[1], 0],
        }, {where: { id: req.params.room_id }});
    
        if (room.hand_choice_player1[2] == 'paper') return (room.hand_choice_player2[2] == 'scissors') ? room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 0],
            result_player2: [room.result_player2[0], room.result_player2[1], 100],
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 100],
            result_player2: [room.result_player2[0], room.result_player2[1], 0],
        }, {where: { id: req.params.room_id }});
    
        if(room.hand_choice_player1[2] == 'scissors') return (room.hand_choice_player2[2] == 'rock') ? room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 0],
            result_player2: [room.result_player2[0], room.result_player2[1], 100]
        }, {where: { id: req.params.room_id }}) : room.update({
            result_player1: [room.result_player1[0], room.result_player1[1], 100],
            result_player2: [room.result_player2[0], room.result_player2[1], 0],
        }, {where: { id: req.params.room_id }});
        return room;
    })
    // hasil pertandingan
    .then( async room => {
        // console.log('final: ', room);
        const totalScorePlayer1 = room.result_player1[0] + room.result_player1[1] + room.result_player1[2];
        const totalScorePlayer2 = room.result_player2[0] + room.result_player2[1] + room.result_player2[2];

        // penentuan pemenang
        let winner = ((totalScorePlayer1, totalScorePlayer2) => {
            // console.log(totalScorePlayer1);
            // console.log(totalScorePlayer2);
            if (totalScorePlayer1 > totalScorePlayer2) {
                return win = 'player 1 win'
            }
            if (totalScorePlayer1 < totalScorePlayer2) {
                return win = 'player 2 win'
            }
            if (totalScorePlayer1 = totalScorePlayer2) {
                return win = 'DRAW'
            }
        });

        const totalMatchPlayer1 = await User_Game_History.count({where: {user_game_id: room.player1_id}}) + 1;
        const totalMatchPlayer2 = await User_Game_History.count({where: {user_game_id: room.player2_id}}) + 1;

        // console.log('totalMatchPlayer1: ', totalMatchPlayer1);
        // console.log('totalMatchPlayer2: ', totalMatchPlayer2);

        // player 1 
        if (req.user.dataValues.id ==  room.player1_id) {
            User_Game_History.findOne({where: {room_id: req.params.room_id, user_game_id: req.user.dataValues.id}})
            .then(check => {
                // console.log(check);
                // cek player sudah atau belum main di room yang dituju, jika belum player akan mendapatkan hasil pertandingan, jika sudah player akan mendapatkan pesan
                if (check !== null) {
                    return res.status(400).json({
                        message: 'ups, maaf anda sudah bermain di room ini, jika ingin bermain lagi silahkan buat room baru atau masuk melaui undangan dari teman anda',
                        create_room: `http://localhost:5000/api/room/create-room -> METHOD: POST`
                    });
                }
    
                return User_Game_History.create({
                    room_id: room.id,
                    user_game_id: req.user.dataValues.id,
                    total_match: totalMatchPlayer1,
                    points: totalScorePlayer1,
                })
                .then(() => {
                    // console.log('test2: ', room);
                    res.status(200).json({
                        pilihan_ronde1: `player1: ${room.hand_choice_player1[0]} - player2: ${room.hand_choice_player2[0]}`,
                        pilihan_ronde2: `player1: ${room.hand_choice_player1[1]} - player2: ${room.hand_choice_player2[1]}`,
                        pilihan_ronde3: `player1: ${room.hand_choice_player1[2]} - player2: ${room.hand_choice_player2[2]}`,
                        points_player1: totalScorePlayer1,
                        points_player2: totalScorePlayer2,
                        hasil:  winner(totalScorePlayer1, totalScorePlayer2),
                        lihat_history: `http://localhost:5000/api/user-game/history/${room.player1_id}`
                    })
                })
            })
        }

        // player 2
        if (req.user.dataValues.id ==  room.player2_id) {
            User_Game_History.findOne({where: {room_id: req.params.room_id, user_game_id: req.user.dataValues.id}})
            .then(check => {
                // console.log('history: ', check);
                // cek player sudah atau belum main di room yang dituju, jika belum player akan mendapatkan hasil pertandingan, jika sudah player akan mendapatkan pesan
                if (check !== null ) {
                    return res.status(400).json({
                        message: 'ups, maaf anda sudah bermain di room ini, jika ingin bermain lagi silahkan buat room baru atau masuk melaui undangan dari teman anda',
                        create_room: `http://localhost:5000/api/room/create-room -> METHOD: POST`
                    });
                }
    
                return User_Game_History.create({
                    room_id: room.id,
                    user_game_id: req.user.dataValues.id,
                    total_match: totalMatchPlayer2,
                    points: totalScorePlayer2,
                })
                .then(() => {
                    // console.log('test2: ', room);
                    res.status(200).json({
                        pilihan_ronde1: `player1: ${room.hand_choice_player1[0]} - player2: ${room.hand_choice_player2[0]}`,
                        pilihan_ronde2: `player1: ${room.hand_choice_player1[1]} - player2: ${room.hand_choice_player2[1]}`,
                        pilihan_ronde3: `player1: ${room.hand_choice_player1[2]} - player2: ${room.hand_choice_player2[2]}`,
                        points_player1: totalScorePlayer1,
                        points_player2: totalScorePlayer2,
                        hasil:  winner(totalScorePlayer1, totalScorePlayer2),
                        lihat_history: `http://localhost:5000/api/user-game/history/${room.player2_id}`
                    })
                })
            })
        }
    })
}

exports.userInRoom  = (req, res) => {
    // menangkap req.body
    const {userGameId, roomId} = req.body;
    // proses buat room
    user_in_room.create({
        user_game_id: userGameId,
        room_id: roomId,
    })
    .then(() => {
        res.status(201).json({
            message: 'anda berhasil masuk room, silahkan bermain'
        });
    })
}
