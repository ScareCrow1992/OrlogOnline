import RollDices from "./Function/RollDices.js"
import SelectGodFavorPower from "./Function/SelectGodFavorPower.js"
// import GodFavorAction from "./Function/GodFavorAction.js";
// import ExtraInputBegin from "./Function/ExtraInputBegin.js"
import Liberty from "./Function/Liberty.js";
import Draft from "./Function/Draft.js";
import InitialGame from "./Function/InitialGame.js";

import { Random } from "random-js";

const random = new Random();

const operations = {
    "CheckReady": (index, ...params) => { return _CheckReady(index, ...params) },
    "InitialGame": InitialGame,
    "PhaseChange": (index, ...params) => { return _PhaseChange(index, ...params) },
    "RollDices": function (index, ...params) { return RollDices.call(this, index, ...params) },
    "GameOver": (index, ...params) => { return _GameOver(index, ...params) },
    "SelectGodFavorPower": SelectGodFavorPower,
    // "GodFavorAction": (index, ...params) => { return GodFavorAction(index, ...params) },
    // "ExtraInputBegin": (index, ...params) => { return ExtraInputBegin(index, ...params) },
    "Liberty": function (index, ...params) { return Liberty.call(this, index, ...params) },
    "Draft": (index, ...params) => { return Draft(index, ...params) }
}



// function _InitialGame(index, ) {
    // return InitialGame()
    
    // let cards = new Array(20)
    // for(let i=0; i<20; i++)
    //     cards[i] = i
    
    // random.shuffle(cards)

    // cards = [8, 1, 5]



    // return ["BellPushed", ["client", { user: index, godfavors: [cards[0], cards[1], cards[2]] }, "cardselect",
        // [{ "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 },
        // { "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 }]]]
// }


function _CheckReady(index) {
    return ["CheckReady", []]
}



function _PhaseChange(index, oldPhase, newPhase) {
    return null
}


// function _SelectGodFavorPower(){
//     return ["BellPushed",["client", null, "godfavor",
//             [{ "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 },
//             { "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 }]]]
// }


// // dices_dir = [<"right" / null>]
// function _RollDices(index, user, dices_dir, dices_cnt, avatars_info){
//     let ret = RollDices(index, user, dices_dir, dices_cnt, avatars_info)

//     return ret;

// }

function _GameOver(index, winner){
    return winner
}


export default function(func, params, index) {
    let op = operations[`${func}`]
    if (op != null && op != undefined)
        return op.call(this, index, ...params)
    else
        return null
}