import Common from "./specification/Common.js"
import RollDices from "./specification/RollDices.js"
import SelectGodFavorPower from "./specification/SelectGodFavorPower.js"
import ExtraInputBegin from "./specification/ExtraInputBegin.js"
import Liberty from "./specification/Liberty.js"
import Draft from "./specification/Draft.js"
// import { GenerateRandomParam, need_random_params } from "./random_functions/RandomGenerator.js"


export default class Guardian {
    constructor(game) {
        this.game = game

        this.last_call // CheckReady, InitialGame, PhaseChange, RollDices, GameOver, SelectGodFavorPower, ExtraInput
        // this.random_param = null

        // console.log(Specifications)


    }


    Set(func_name){

        if(func_name !== "DoubleGame")
            this.last_call = func_name

        // if(need_random_params.includes(func_name)){
        //     this.random_param = GenerateRandomParam()
        // }

        // console.log(`[ Guardian ] :: ${func_name}`)
    }


    Filter(func, params) {
        // if (func != "BellPushed" || func != "DoubleGame")
        //     return false


        switch(func){
            case "BellPushed":
                return this.Filter_BellPush(params)
                break

            case "DoubleGame":
                return true
                break

            default:
                return false
                break

        }

    }


    Filter_Rawdata(data){
        let ret = null

        try{
            ret = JSON.parse(data)
        }catch (e){
            return null
        }

        if(Array.isArray(ret) == false)
            return null

        if(ret.length < 2)
            return null


        return ret
    }


    Filter_BellPush(params){


        let common_ret = Common(...params, this.game.situation)
        // console.log(`[ Guardian - Common ] : ${common_ret}`)
        let ret = false

        if (common_ret) {
            switch (this.last_call) {
                case "RollDices":
                    ret = RollDices(...params, this.game.situation)
                    // console.log(`[ Guardian - RollDices ] : ${ret}`)
                    break;

                case "SelectGodFavorPower":
                    ret = SelectGodFavorPower(...params, this.game.situation)
                    // console.log(`[ Guardian - SelectGodFavorPower ] : ${ret}`)
                    break;

                case "ExtraInputBegin":
                    ret = ExtraInputBegin(...params, this.game.situation)
                    // console.log(`[ Guardian - ExtraInputBegin ] : ${ret}`)
                    
                    break;


                case "Liberty":
                    ret = Liberty(...params, this.game.situation)
                    // console.log(`[ Guardian - Liberty ] : ${ret}`)

                    break;

                case "Draft":
                    ret = Draft(...params, this.game.situation)
                    // console.log(`[ Guardian - Draft ] : ${ret}`)
                    break;

                default:
                    ret = false;
                    break;
            }
        }

        // console.log(this.last_call)

        return ret;
    }



    RandomParams(params){
        
    }


}


// let game = {
//     situation: { turnNum: 1, order: [1, 0],
//         player: [{ dices: [1, 2, 3, 4, 5, 6] }, { dices: [1, 2, 3, 4, 5, 6] }]
//     }
// }

// let func = "BellPushed"

// let params = [
//     0, { user: 0, godfavors: [0, 1, 2] }, "roll",
//     [
//         {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 5
//         }, {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 10
//         }
//     ]
// ]

// let guardian = new Guardian(game)

// let ret = guardian.Filter(func, params)

// console.log(ret)








// let game = {
//     situation: { turnNum: 1, order: [1, 0], turnEnd : [false, false],
//         player: [{ dices: [1, 2, 3, 4, 5, 6] }, { dices: [1, 2, 3, 4, 5, 6] }]
//     }
// }

// let func = "BellPushed"

// let params = [
//     0, { godFavorIndex: 1, level: 0 }, "godfavor",
//     [
//         {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 5
//         }, {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 10
//         }
//     ]
// ]

// let guardian = new Guardian(game)

// guardian.Set("SelectGodFavorPower")
// let ret = guardian.Filter(func, params)

// console.log(ret)







// let game = {
//     situation: { turnNum: 1, order: [1, 0], turnEnd : [false, false],
//         player: [{ dices: [1, 2, 3, 4, 5, 6] }, { dices: [1, 2, 3, 4, 5, 6] }],
//         resolutionWaitInputForUser : 0
//     }
// }

// let func = "BellPushed"

// let params = [
//     0, null, "resolution",
//     [
//         {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 5
//         }, {
//             "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
//             health: 15,
//             token: 10
//         }
//     ]
// ]

// let guardian = new Guardian(game)

// guardian.Set("ExtraInputBegin")
// let ret = guardian.Filter(func, params)

// console.log(ret)

