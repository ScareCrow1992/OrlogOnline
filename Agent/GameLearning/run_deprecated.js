import Simulator from "./Simulator.js";
import Machine from "./Machine.js";
import TensorModel from "./AI/TensorModel.js"

import RollModel from "./models/RollModel.js"
import GodfavorModel from "./models/GodfavorModel.js"
import fs from "fs"


// let roll_model = new RollModel()

// let state_ = {
//     avatar: {
//         health: 10,
//         token: 10,
//         godFavors: [0, 1, 2],
//         dices: {
//             axe: 0,
//             arrow: 0,
//             helmet: 0,
//             shield: 0,
//             steal: 0,
//             mark: 0,
//             empty : 6
//         },
//         dices_ : {
//             weapon : new Array(6).fill(null),
//             mark : new Array(6).fill(false)
//         }
//     },
//     opponent: {
//         health: 5,
//         token: 25,
//         godFavors: [3, 4, 5],
//         dices: {
//             axe: 0,
//             arrow: 0,
//             helmet: 0,
//             shield: 0,
//             steal: 0,
//             mark: 0,
//             empty : 6
//         },
//         dices_ : {
//             weapon : new Array(6).fill(null),
//             mark : new Array(6).fill(false)
//         }
//     },
//     situation: {
//         order: [0, 1],
//         turn: 0
//     }
// }

// let rolled_dices = {
//     weapon : ["axe", "axe", "arrow", "arrow", "shield", "axe"],
//     mark : [false, false, true, true, false, false]
// }


// let probs = roll_model.Predict(state_, rolled_dices)
// probs.then(res=>{console.log(res)})


const w_streams = [
    fs.createWriteStream("./GameLearning/learning_data/roll/state.txt"),
    fs.createWriteStream("./GameLearning/learning_data/roll/rolled_weapon.txt"),
    fs.createWriteStream("./GameLearning/learning_data/roll/rolled_mark.txt"),
    fs.createWriteStream("./GameLearning/learning_data/roll/action.txt"),
    fs.createWriteStream("./GameLearning/learning_data/roll/winrate.txt"),

    fs.createWriteStream("./GameLearning/learning_data/godfavor/state.txt"),
    fs.createWriteStream("./GameLearning/learning_data/godfavor/avaialable_name.txt"),
    fs.createWriteStream("./GameLearning/learning_data/godfavor/avaialable_level.txt"),
    fs.createWriteStream("./GameLearning/learning_data/godfavor/action.txt"),
    fs.createWriteStream("./GameLearning/learning_data/godfavor/winrate.txt"),

    fs.createWriteStream("./GameLearning/learning_data/result/state.txt"),
    fs.createWriteStream("./GameLearning/learning_data/result/action.txt"),
    fs.createWriteStream("./GameLearning/learning_data/result/winrate.txt"),
]


let tensor_model = new TensorModel()
let model_roll = new RollModel()
let model_godfavor = new GodfavorModel()

let simulator_ = new Simulator("liberty")
// let machine_ = new Machine(simulator_, tensor_model, model_roll, model_godfavor, w_streams)
// machine_.Power()


if (global.gc) {
    console.log("run garbage collector")
    global.gc()
}
else {
    console.log("can't find GC")
}





async function Main() {

    w_streams.forEach(stream_ => {
        stream_.write("[")
    })

    for (let i = 0; i < 10; i++) {
        
        if (global.gc) {
            console.log("run garbage collector")
            global.gc()
        }
        else {
            console.log("can't find GC")
        }

        console.log(`[[[[  ${i}-th game  ]]]]`)
        let machine_ = new Machine(simulator_, tensor_model, model_roll, model_godfavor, w_streams)
        await machine_.Power()


    }


    w_streams.forEach(stream_ => {
        stream_.write("]")
    })

    console.log("END")
}



Main()




// let logs = []
// let ret = machine_.Create_Roll_Process(state_, 0, 2, 0, logs)
// console.log(ret.length)


// console.log(ret[0].avatar.dices)
// console.log(ret[0].avatar.dices_)
// console.log(ret[0].opponent.dices)
// console.log(ret[0].opponent.dices_)

// ret.forEach(state__ => {

    // console.log(state__.avatar.dices)
    // console.log(state__.avatar.dices_)
    // console.log(state__.opponent.dices)
    // console.log(state__.opponent.dices_)
    // // console.log(state__.situation.logs)

    // // state__.situation.logs.forEach(log_ => {
    // //     console.log(log_.avatar.dices)
    // //     console.log(log_.opponent.dices)
    // //     console.log(log_.avatar.dices_)
    // //     console.log(log_.opponent.dices_)
    // //     console.log("\n<< Rolled >>")
    // //     console.log(log_.situation.rolled)
    // //     console.log("\n<< Chosen >>")
    // //     console.log(log_.situation.chosen)
    //     console.log("\n========\n")

    // // })

    // console.log(state__.avatar.dices)
    // console.log(state__.situation.logs[1].avatar.dices)
    // console.log(state__.situation.logs[1].opponent.dices)
    // console.log(state__.situation.logs[1].situation.rolled)
    // console.log(state__.situation.chosen)
    // console.log("\n========\n")
// })


// let rolled_dices = machine_.Create_RolledDices(6)
// console.log(rolled_dices)

// let cache = new Set()
// machine_.Create_Rollphase_States({
//     avatar: {
//         health: 12,
//         token: 9,
//         godFavors: [0, 1, 2],
//         dices: {
//             axe: 2,
//             arrow: 1,
//             helmet: 1,
//             shield: 0,
//             steal: 2,
//             mark: 4
//         }
//     },
//     opponent: {
//         health: 15,
//         token: 2,
//         godFavors: [3, 4, 5],
//         dices: {
//             axe: 1,
//             arrow: 3,
//             helmet: 1,
//             shield: 1,
//             steal: 1,
//             mark: 4
//         }
//     },
//     situation: {
//         order: [0, 1],
//         turn : 3
//     }
// }
// , 4, 3, 0, cache)



// let cnt_ = 0
// simulator_.Run(
//     {
//         avatar: {
//             health: 2, token: 21,
//             godFavors: [3, 11, 14],
//             dices_: {
//                 weapon: ["axe", "axe", "arrow", "helmet", "steal", "axe"],
//                 mark: [true, true, false, false, false, true]
//             }
//         },
//         opponent: {
//             health: 2, token: 15,
//             godFavors: [2, 5, 17],
//             dices_: {
//                 weapon: ["axe", "arrow", "axe", "shield", "shield", "arrow"],
//                 mark: [false, true, true, false, false, true]
//             }
//         },
//         situation: {
//             order: [1, 0],
//             round: 4
//         }
//     },
//     {
//         avatar: {
//             preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//             extra: null,
//             input: null
//             // preparedGodFavor: { godfavorIndex: 0, level: 1, godfavorNameIndex: 3 },
//             // extra : null,
//             // input : null
//         },
//         opponent: {
//             preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//             extra: null,
//             input: null
//             // preparedGodFavor: { godfavorIndex: 1, level: 2, godfavorNameIndex: 5 },
//             // extra: [[true, true, false, false, false, true], [false, false, false, false, false, false]],
//             // input: { index : 4, type : "healthstone"}
//         }
//     }, 0
// )



// let start_ = performance.now()

// while (true) {
//     if (cnt_ > 531441)
//         break;

//     cnt_++

//     simulator_.Run(
//         {
//             avatar: {
//                 health: 2, token: 21,
//                 godFavors: [3, 11, 14],
//                 dices_: {
//                     weapon: ["axe", "axe", "arrow", "helmet", "steal", "axe"],
//                     mark: [true, true, false, false, false, true]
//                 }
//             },
//             opponent: {
//                 health: 2, token: 15,
//                 godFavors: [2, 5, 17],
//                 dices_: {
//                     weapon: ["axe", "arrow", "axe", "shield", "shield", "arrow"],
//                     mark: [false, true, true, false, false, true]
//                 }
//             },
//             situation: {
//                 order: [1, 0],
//                 round: 4
//             }
//         },
//         {
//             avatar: {
//                 preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//                 extra: null,
//                 input: null
//                 // preparedGodFavor: { godfavorIndex: 0, level: 1, godfavorNameIndex: 3 },
//                 // extra : null,
//                 // input : null
//             },
//             opponent: {
//                 preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//                 extra: null,
//                 input: null
//                 // preparedGodFavor: { godfavorIndex: 1, level: 2, godfavorNameIndex: 5 },
//                 // extra: [[true, true, false, false, false, true], [false, false, false, false, false, false]],
//                 // input: { index : 4, type : "healthstone"}
//             }
//         }, 0
//     )


// }


// let end_ = performance.now()

// console.log(end_ - start_)