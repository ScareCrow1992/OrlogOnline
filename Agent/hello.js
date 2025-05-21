
import fs from "fs"
import RollModel from "./GameLearning/models/RollModel.js"
import GodfavorModel from "./GameLearning/models/GodfavorModel.js"
import AvailableGodFavors from "./GameLearning/Util/AvailableGodFavors.js"

let roll_model = new RollModel()
let godfavor_model = new GodfavorModel()

// let godfavor_model = new GodfavorModel("file://godfavor_model_v00/model.json")



// async function Main(){
//     // godfavor_model.Load

//     await godfavor_model.ready
//     await Godfavor_Predict()
// }

// Main()

// async function Godfavor_Predict(){

//     let state = {
//         avatar: {
//             health: 15, token: 18,
//             godFavors: [6, 12, 17],
//             dices: {
//                 axe: 3,
//                 arrow: 0,
//                 helmet: 0,
//                 shield: 0,
//                 steal: 3,
//                 empty: 0,
//                 mark: 3
//             },
//             dices_: {
//                 // weapon: ["arrow", "arrow", "steal", "arrow", "arrow", "arrow"],
//                 // weapon: ["helmet", "helmet", "helmet", "helmet", "helmet", "helmet"],
//                 weapon : ["axe","axe","axe","steal","steal","steal"],
//                 mark: [false, true, true, false, true, false]
//             }
//         },
//         opponent: {
//             health: 15, token: 2,
//             godFavors: [0, 2, 7],
//             // godFavors: [2, 13, 17],
//             dices: {
//                 axe: 6,
//                 arrow: 0,
//                 helmet: 0,
//                 shield: 0,
//                 steal: 0,
//                 empty: 0,
//                 mark: 0
//             },
//             dices_: {
//                 weapon: ["axe", "axe", "axe", "axe", "axe", "axe"],
//                 // weapon: ["shield", "shield", "shield", "shield", "shield", "shield"],
//                 // weapon: ["helmet", "helmet", "helmet", "helmet", "helmet", "helmet"],
//                 mark: [false, false, false, false, false, false]
//             }
//         },
//         situation: {
//             order: [0, 1],
//             round: 4,
//             turn : 0
//         }

//     }



//     const empty_godfavor = {
//         preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
//         extra: null,
//         input: null
//     }


//     let available_godfavors = AvailableGodFavors(0, state)
//     console.log(available_godfavors[0])

//     available_godfavors[0] = [JSON.parse(JSON.stringify(empty_godfavor)), ...available_godfavors[0]]

//     let probs = await godfavor_model.Predict(state, available_godfavors[0])
//     console.log(probs)
// }



let w_read = [
    // fs.readFileSync("./GameLearning/learning_data/roll/state.txt", "utf-8"),
    // fs.readFileSync("./GameLearning/learning_data/roll/rolled_weapon.txt", "utf-8"),
    // fs.readFileSync("./GameLearning/learning_data/roll/rolled_mark.txt", "utf-8"),
    // fs.readFileSync("./GameLearning/learning_data/roll/action.txt", "utf-8"),
    // fs.readFileSync("./GameLearning/learning_data/roll/winrate.txt", "utf-8"),
    
    fs.readFileSync("./GameLearning/learning_data/godfavor/state.txt", "utf-8"),
    fs.readFileSync("./GameLearning/learning_data/godfavor/avaialable_name.txt", "utf-8"),
    fs.readFileSync("./GameLearning/learning_data/godfavor/avaialable_level.txt", "utf-8"),
    fs.readFileSync("./GameLearning/learning_data/godfavor/action.txt", "utf-8"),
    fs.readFileSync("./GameLearning/learning_data/godfavor/winrate.txt", "utf-8")
]


let datas = []
w_read.forEach(w_=>{
    w_ = w_.slice(0, -2)
    w_ = w_.concat("","]")
    datas.push(JSON.parse(w_))
})


godfavor_model.Fit(...datas).then(()=>{ godfavor_model.Save("file://godfavor_model_v00") })


// godfavor_model.Fit(...datas.slice(5, 10))


// roll_model.Fit(...datas.slice(0,5)).then(()=>{ 
//     // roll_model.Save() 
//     godfavor_model.Fit(...datas.slice(5, 10))
// })



// let d = JSON.parse(w_tmp)
// console.log(typeof d[0])

// console.log(JSON.parse(w_tmp))


// let w_tmp = fs.readFileSync("./zzzzzddd.txt", "utf-8")
// w_tmp = w_tmp.slice(0, -2)
// w_tmp = w_tmp.concat("","]")
// console.log(JSON.parse(w_tmp))
// let obj = JSON.parse(w_tmp)
// console.log(obj[0])


// const w_tmp = fs.createWriteStream("./zzzzzddd.txt")


// let arr = [0,1,2,3,4,5]
// let arr2 = [6,7,8,9]



// w_tmp.write("[")
// w_tmp.write(JSON.stringify(arr))
// w_tmp.write(",")

// w_tmp.write(JSON.stringify(arr2))
// w_tmp.write("]")