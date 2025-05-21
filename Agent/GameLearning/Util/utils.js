import Simulator from "../Simulator.js"
import { Random } from "random-js"
import AvailableGodFavors from "./AvailableGodFavors.js"
// import * as tf from '@tensorflow/tfjs'

const diceFaceInfo = [{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "arrow", token: true },
    "back": { weapon: "steal", token: true }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "steal", token: true },
    "front": { weapon: "arrow", token: false },
    "back": { weapon: "helmet", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "arrow", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "shield", token: false }
},

{
    "right": { weapon: "arrow", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: true },
    "back": { weapon: "axe", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "arrow", token: true }

},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "arrow", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "helmet", token: true }

}]

const simulator_ = new Simulator("liberty")
const dirs_ = ["right", "left", "top", "bottom", "front", "back"]
const random = new Random()

const ROLL = 0
const GODFAVOR = 1



const weapon_embedded = {
    "axe": [1, 0, 0, 0, 0],
    "arrow": [0, 1, 0, 0, 0],
    "helmet": [0, 0, 1, 0, 0],
    "shield": [0, 0, 0, 1, 0],
    "steal": [0, 0, 0, 0, 1],
    "null" : [0, 0, 0, 0, 0]
}


function Action2Index(action, phase){
    switch(phase){
        case ROLL:
            return _Action2Index_Roll(action)
        
        case GODFAVOR:
            return _Action2Index_Godfavor(action)
    }

}


function State_Serialize(state){

    if(state.situation.phase == ROLL)
        return _State_Serialize_Roll(state)
    else if(state.situation.phase == GODFAVOR)
        return _State_Serialize_Godfavor(state)

}


function _State_Serialize_Roll(state){

    let avatar_godfavors = new Array(20).fill(0)
    avatar_godfavors[state.avatar.godFavors[0]] = 1
    avatar_godfavors[state.avatar.godFavors[1]] = 1
    avatar_godfavors[state.avatar.godFavors[2]] = 1

    let opponent_godfavors = new Array(20).fill(0)
    opponent_godfavors[state.opponent.godFavors[0]] = 1
    opponent_godfavors[state.opponent.godFavors[1]] = 1
    opponent_godfavors[state.opponent.godFavors[2]] = 1

    let ret = [
        state.avatar.health / 15.0,
        state.avatar.token / 50.0,
        ...avatar_godfavors,
        state.avatar.dices.axe / 6.0,
        state.avatar.dices.arrow / 6.0,
        state.avatar.dices.helmet / 6.0,
        state.avatar.dices.shield / 6.0,
        state.avatar.dices.steal / 6.0,
        state.avatar.dices.mark / 6.0,

        state.opponent.health / 15.0,
        state.opponent.token / 50.0,
        ...opponent_godfavors,
        state.opponent.dices.axe / 6.0,
        state.opponent.dices.arrow / 6.0,
        state.opponent.dices.helmet / 6.0,
        state.opponent.dices.shield / 6.0,
        state.opponent.dices.steal / 6.0,
        state.opponent.dices.mark / 6.0,

        state.situation.order[0],
        state.situation.turn / 4.0,

        ...weapon_embedded[`${state.situation.rolled_dices.weapon[0]}`],
        ...weapon_embedded[`${state.situation.rolled_dices.weapon[1]}`],
        ...weapon_embedded[`${state.situation.rolled_dices.weapon[2]}`],
        ...weapon_embedded[`${state.situation.rolled_dices.weapon[3]}`],
        ...weapon_embedded[`${state.situation.rolled_dices.weapon[4]}`],
        ...weapon_embedded[`${state.situation.rolled_dices.weapon[5]}`],

        state.situation.rolled_dices.mark[0] == true ? 1.0 : 0.0,
        state.situation.rolled_dices.mark[1] == true ? 1.0 : 0.0,
        state.situation.rolled_dices.mark[2] == true ? 1.0 : 0.0,
        state.situation.rolled_dices.mark[3] == true ? 1.0 : 0.0,
        state.situation.rolled_dices.mark[4] == true ? 1.0 : 0.0,
        state.situation.rolled_dices.mark[5] == true ? 1.0 : 0.0,
    ]



    return ret
}




function _State_Serialize_Godfavor(state){

    let avatar_godfavors = new Array(20).fill(0)
    avatar_godfavors[state.avatar.godFavors[0]] = 1
    avatar_godfavors[state.avatar.godFavors[1]] = 1
    avatar_godfavors[state.avatar.godFavors[2]] = 1

    let opponent_godfavors = new Array(20).fill(0)
    opponent_godfavors[state.opponent.godFavors[0]] = 1
    opponent_godfavors[state.opponent.godFavors[1]] = 1
    opponent_godfavors[state.opponent.godFavors[2]] = 1

    let ret = [
        state.avatar.health / 15.0,
        state.avatar.token / 50.0,
        ...avatar_godfavors,
        state.avatar.dices.axe / 6.0,
        state.avatar.dices.arrow / 6.0,
        state.avatar.dices.helmet / 6.0,
        state.avatar.dices.shield / 6.0,
        state.avatar.dices.steal / 6.0,
        state.avatar.dices.mark / 6.0,

        state.opponent.health / 15.0,
        state.opponent.token / 50.0,
        ...opponent_godfavors,
        state.opponent.dices.axe / 6.0,
        state.opponent.dices.arrow / 6.0,
        state.opponent.dices.helmet / 6.0,
        state.opponent.dices.shield / 6.0,
        state.opponent.dices.steal / 6.0,
        state.opponent.dices.mark / 6.0,

        state.situation.order[0]
    ]

    return ret
}


function Parse_Action(state, action_index, probability) {

    switch(state.situation.phase){
        case ROLL:
            return _Parse_Action_Roll(state, action_index, probability)
            break;

        case GODFAVOR:
            return _Parse_Action_Godfavor(state, action_index, probability)
            break;
    }

}



function Step(state, action, agent_index, agent) {
    // action.chosen = [true, true, false, false, false, true]
    if (state.situation.phase == GODFAVOR) {
        // 능력 선택
        // console.log(state)
        // console.log(action)


        if(state.inputs == undefined)
            state.inputs = {}

        state.inputs[`${agent}`] = action

        if(state.inputs.avatar && state.inputs.opponent){
            let inputs = state.inputs
            delete state.inputs

            state = Run(state, inputs, agent_index)

        }
        else{
            state.situation.turn = 1 - state.situation.turn
        }


        // if(state.situation.turn == 0)
        //     state.inputs = {}

        // state.inputs[`${agent}`] = action

        // if(state.situation.turn == 1){
        //     let inputs = state.inputs
        //     delete state.inputs

        //     state = Run(state, inputs, agent_index)
        // }
        // else{
        //     state.situation.turn++
        // }
    }
    else if (state.situation.phase == ROLL) {
        // 주사위 선택
        let rolled_dices = state.situation.rolled_dices
        let dices = state[`${agent}`].dices
        let dices_ = state[`${agent}`].dices_

        for (let dice_index = 0; dice_index < 6; dice_index++) {
            if(action["chosen"][dice_index] == true){

                let weapon = rolled_dices.weapon[dice_index]
                let mark = rolled_dices.mark[dice_index]

                dices_.weapon[dice_index] = weapon
                dices_.mark[dice_index] = mark

                dices[`${weapon}`]++
                dices["empty"]--
                if(mark == true)
                    dices.mark++
            }
        }


        while (true) {
            state.situation.turn++

            // console.log(rolled_dices)
            if (state.situation.turn == 4) {
                // 양쪽 플레이어의 주사위를 모두 랜덤으로 채운다.
                // phase를 roll에서 godfavor로 변경

                _Dices_Empty_Fill(state["avatar"].dices, state["avatar"].dices_)
                _Dices_Empty_Fill(state["opponent"].dices, state["opponent"].dices_)
                            
                state.situation.turn = 0
                state.situation.phase = GODFAVOR

                // console.log(state)
                // console.log(state["avatar"].dices_)
                // console.log(state["opponent"].dices_)

                return state
            }

            let user = null
            let turn_index = state.situation.turn % 2

            if (state.situation.order[turn_index] == agent_index)
                user = "avatar"
            else
                user = "opponent"

            rolled_dices = _Dices_Roll(state, user)

            if (state[`${user}`].dices.empty != 0)
                break;
            else {

            }

        }

        if (state.situation.turn == 4) {
        }
        else{
            state.situation.rolled_dices = rolled_dices
        }

    }

    return state
}


function Run(state, action, agent_index) {
    let new_state = simulator_.Run(state, action, agent_index)

    if(new_state.situation.gameover == false){
        let user = null

        if (state.situation.order[0] == agent_index)
            user = "avatar"
        else
            user = "opponent"

        new_state.situation.rolled_dices = _Dices_Roll(new_state, user)
    }

    // console.log(new_state)
    return new_state
}



function Create_Initial_State() {
    let state_ = {
        avatar: {
            health: 15, token: 12,
            godFavors: [6, 12, 17],
            dices: {
                axe: 0,
                arrow: 0,
                helmet: 0,
                shield: 0,
                steal: 0,
                empty: 6,
                mark: 0
            },
            dices_: {
                weapon: [null, null, null, null, null, null],
                mark: [false, false, false, false, false, false]
            }
        },
        opponent: {
            health: 15, token: 15,
            godFavors: [0, 2, 7],
            dices: {
                axe: 0,
                arrow: 0,
                helmet: 0,
                shield: 0,
                steal: 0,
                empty: 6,
                mark: 0
            },
            dices_: {
                weapon: [null, null, null, null, null, null],
                mark: [false, false, false, false, false, false]
            }
        },
        situation: {
            order: [0, 1],
            round: 0,
            turn: 0,
            phase: null // ROLL or GODFAVOR
        }
    }

    return state_
}


// function Create_Random_Action(state) {
//     if (state.situation.phase == ROLL)
//         return _Create_Random_Action_Roll(state)
//     else if (state.situation.phase == GODFAVOR)
//         return _Create_Random_Action_Godfavor(state)
// }



function Dir_2_DicesInfo(dices_dir) {
    let rolled_dices = {
        weapon: new Array(6).fill(null),
        mark: new Array(6).fill(false)
    }
    for (let i = 0; i < 6; i++) {
        if (dices_dir[i] != null) {
            let dir = dices_dir[i]
            rolled_dices.weapon[i] = diceFaceInfo[i][`${dir}`].weapon
            rolled_dices.mark[i] = diceFaceInfo[i][`${dir}`].token
        }
    }

    return rolled_dices
}


// for test without keras model
function Random_Predict(state, action_mask){
    let probs = null
    if(state.situation.phase == ROLL){
        probs = _Random_Predict_Roll(state, action_mask)

    }
    else if (state.situation.phase == GODFAVOR){
        probs = _Random_Predict_Godfavor(state, action_mask)
    }

    // let value = random.real(-0.1, 0.1)
    // console.log(value)
    let value = 0.0

    // return [probs, value]
    return [probs, value]
}


function State_Modify_4_Predict(state, agent_index, agent){
    if(agent == "opponent"){

        // console.log("\n=================================")
        
        // console.log(`[ ${agent_index} ]`, state.avatar.godFavors)
        // console.log(`[ ${1 - agent_index} ]`, state.opponent.godFavors)
        // console.log("....")


        let tmp = state.avatar
        state.avatar = state.opponent
        state.opponent = tmp

        
        // console.log(`[ ${agent_index} ]`, state.avatar.godFavors)
        // console.log(`[ ${1 - agent_index} ]`, state.opponent.godFavors)
        // console.log("....")
        // console.log("=================================\n")

        // agent_index = 1 - agent_index

                

    }

    let turn_ = state.situation.turn
    let turn_agent_index = state.situation.order[turn_ % 2]

    if(turn_agent_index != agent_index){
        // console.log("wow~")
        // let tmp = state.situation.order[0]
        // state.situation.order[0] = state.situation.order[1]
        // state.situation.order[1] = tmp
    }

}


function Create_Action_Mask(state, agent_index){
    let action_mask = undefined
    if(state.situation.phase == ROLL){
        // probs = new Array(64).fill(0.0)
        action_mask = _Create_Action_Mask_Roll(state)

    }
    else if (state.situation.phase == GODFAVOR){
        // probs = new Array(61).fill(0.0)
        action_mask = _Create_Action_Mask_Godfavor(state, agent_index)
    }

    return action_mask
}



export { Parse_Action, Step, Run, Create_Initial_State, Dir_2_DicesInfo, Random_Predict, State_Modify_4_Predict, Create_Action_Mask, State_Serialize }



function _Create_Action_Mask_Roll(state){
    // let rolled_dices = state.situation.rolled_dices

    // let action_mask = new Array(6).fill(true)
    // for(let dice_index = 0; dice_index < 6; dice_index++){
    //     if(rolled_dices.weapon[dice_index] == null)
    //         action_mask[dice_index] = false
    // }

    // return action_mask

    let rolled_dices = state.situation.rolled_dices

    let limit_ = 64

    let action_mask = new Array(64).fill(true)

    for (let mask_index = 0; mask_index < limit_; mask_index++) {
        let bit_mask = mask_index.toString(2)
        bit_mask = bit_mask.padStart(6, "0")

        let splitString = bit_mask.split("")
        let reverseArray = splitString.reverse();
        bit_mask = reverseArray.join("");

        for (let dice_index = 0; dice_index < 6; dice_index++) {
            let bit_ = bit_mask[dice_index]
            if (bit_ == "1" && rolled_dices.weapon[dice_index] == null) {
                action_mask[mask_index] = false
            }
        }
    }
    return action_mask
}



function _Create_Action_Mask_Godfavor(state, agent_index){

    let action_mask = [new Array(61).fill(false), []]

    let order_index = undefined
    let turn_ = state.situation.turn
    if(state.situation.order[turn_] == agent_index)
        order_index = 0
    else
        order_index = 1

    let avaialable_godfavors = AvailableGodFavors(agent_index, state)

    // console.log(avaialable_godfavors)


    avaialable_godfavors[0].forEach(godfavor_ =>{

        let name_index = godfavor_.preparedGodFavor.godfavorNameIndex
        let level_index = godfavor_.preparedGodFavor.level

        if(name_index != -1){
            // console.log(name_index, level_index)
            let masking_index = 3 * name_index + level_index
            action_mask[0][masking_index] = true
            action_mask[1].push(godfavor_.preparedGodFavor)
        }
    })

    action_mask[0][60] = true

    action_mask[1].push({
        godfavorIndex: -1, godfavorNameIndex: -1, level: -1
    })

    // console.log(avaialable_godfavors)
    // console.log(action_mask)

    return action_mask
}




function _Random_Predict_Roll(state, action_mask){
    // return new Array(6).fill(0.5)

    // let min_ = 0.5
    // let max_ = 0.75

    // return [random.real(min_, max_), random.real(min_, max_), random.real(min_, max_), random.real(min_, max_), random.real(min_, max_), random.real(min_, max_)]

    let probs = new Array(64).fill(random.real(0.0, 1.0))
    for (let i = 0; i < 64; i++)
        probs[i] = 1.0 / 64.0
        // probs[i] = random.real(0.0, 1.0)

    let rolled_dices = state.situation.rolled_dices

    let limit_ = 64

    let enable_action = new Array(64).fill(false)

    for (let mask_index = 0; mask_index < limit_; mask_index++) {
        let bit_mask = mask_index.toString(2)
        bit_mask = bit_mask.padStart(6, "0")

        let splitString = bit_mask.split("")
        let reverseArray = splitString.reverse();
        bit_mask = reverseArray.join("");

        for (let dice_index = 0; dice_index < 6; dice_index++) {
            let bit_ = bit_mask[dice_index]
            if (bit_ == "1" && rolled_dices.weapon[dice_index] == null) {
                enable_action[mask_index] = true
                probs[mask_index] = 0.0
            }
        }
    }

    return probs
}



function _Random_Predict_Godfavor(state, action_mask){
    let probs = new Array(61).fill(random.real(0.0, 1.0))
    for (let i = 0; i < 61; i++)
        probs[i] = 1.0 / 61.0
        // probs[i] = random.real(0.0, 1.0)

    let limit_ = 61

    for (let mask_index = 0; mask_index < limit_; mask_index++) {
        if(action_mask[mask_index] == false)
            probs[mask_index] = 0.0
    }

    return probs

}



// function _Create_Random_Action_Roll(state) {
//     let ret = {
//         input: null,
//         prob: null
//     }

//     let rolled_dices = state.situation.rolled_dices
//     // console.log(state)
//     // console.log(rolled_dices)

// }



// function _Create_Random_Action_Godfavor(state) {

// }


function _Dices_Roll(state, user){
    let dices_ = state[`${user}`].dices_
    let dirs = _Random_Dices_Dir(dices_)

    let rolled_dices = Dir_2_DicesInfo(dirs)

    return rolled_dices
}


function _Random_Dices_Dir(dices_) {
    let dirs = new Array(6).fill(null)

    for (let i = 0; i < 6; i++) {
        if (dices_.weapon[i] == null){
            random.shuffle(dirs_)
            dirs[i] = dirs_[0]
        }
    }

    return dirs
}



function _Dices_Empty_Fill(dices, dices_) {
    for (let i = 0; i < 6; i++) {
        if (dices_.weapon[i] == null) {
            let dir_ = dirs_[random.integer(0, 5)]

            let new_weapon = diceFaceInfo[i][`${dir_}`].weapon
            let new_token = diceFaceInfo[i][`${dir_}`].token

            dices_.weapon[i] = new_weapon
            dices_.mark[i] = new_token

            dices[`${new_weapon}`]++

            if (new_token == true)
                dices["mark"]++

            dices["empty"] = 0

        }
    }
}


function Parse_Action_Roll_dep(state, probs){
    let ret = []
    let parsed_action = null

    let select_size = 0

    let current_dice = state.avatar.dices_
    for(let dice_index = 0; dice_index < 6; dice_index++){
        if(current_dice.weapon[dice_index] == null)
            select_size++
    }

    if(select_size == 0){
        console.log(state)
        console.log("avatar : ", state.avatar.dices_)
        console.log("opponent : ", state.opponent.dices_)
        console.log("rolled dices : ", state.situation.rolled_dices)
        console.log("\n=============================\n")
    }

    for(let action_index = 0; action_index < 64; action_index++){
        parsed_action = _Parse_Action_Roll(state, action_index, probs, select_size)
        if(parsed_action != null)
            ret.push(parsed_action)
    }


    let parsed_probs = new Array(ret.length).fill(0)

    for (let i = 0; i < ret.length; i++) {
        parsed_probs[i] = ret[i].probability   
    }

    console.log(probs)
    console.log(parsed_probs)
    console.log("\n=============================\n")


    Softmax_(parsed_probs)
    
    
    for (let i = 0; i < ret.length; i++) {
        ret[i].probability = parsed_probs[i]
    }

    // console.log(ret)

    return ret
}



function Softmax_(arr) {
    let temperature = 0.25
    let numerator, denomirator = 0
    let tmp_prob = undefined

    let arr_size = arr.length

    for (let i = 0; i < arr_size; i++) {
        tmp_prob = Math.exp(arr[i] / temperature)
        denomirator += tmp_prob
    }

    for (let i = 0; i < arr_size; i++) {
        numerator = Math.exp(arr[i] / temperature)
        arr[i] = numerator / denomirator
    }
}




function _Parse_Action_Roll(state, action_index, probability) {

    let rolled_dices = state.situation.rolled_dices
    let bit_mask = action_index.toString(2)
    bit_mask = bit_mask.padStart(6, "0")

    
    let splitString = bit_mask.split("")
    let reverseArray = splitString.reverse();
    bit_mask = reverseArray.join("");
    
    let parsed_action = {
        "chosen" :  new Array(6).fill(false),
        "probability" :  0,
        "action_index" : action_index
    }

    // console.log(action_index, bit_mask)

    for (let dice_index = 0; dice_index < 6; dice_index++) {
        let bit_ = bit_mask[dice_index]
        if (bit_ == "1") {
            if (rolled_dices.weapon[dice_index] == null) {
                return null
            }
            else {
                parsed_action["chosen"][dice_index] = true
                parsed_action.probability = probability
            }
        }
    }

    if(action_index == 0){
        parsed_action.probability = probability
    }

    return parsed_action
}



function _Parse_Action_Roll_dep(state, action_index, probs, select_size) {

    let rolled_dices = state.situation.rolled_dices
    let bit_mask = action_index.toString(2)
    bit_mask = bit_mask.padStart(6, "0")

    
    let splitString = bit_mask.split("")
    let reverseArray = splitString.reverse();
    bit_mask = reverseArray.join("");
    
    let parsed_action = {
        "chosen" :  new Array(6).fill(false),
        "probability" :  0,
        "action_index" : action_index
    }

    // console.log(action_index, bit_mask)

    

    for (let dice_index = 0; dice_index < 6; dice_index++) {
        let bit_ = bit_mask[dice_index]
        if (bit_ == "1") {
            if (rolled_dices.weapon[dice_index] == null) {
                return null
            }
            else {
                parsed_action["chosen"][dice_index] = true
                parsed_action.probability += probs[dice_index] / select_size
            }
        }
        else if (bit_ == "0"){
            if (rolled_dices.weapon[dice_index] != null) {
                parsed_action.probability += ((1.0 - probs[dice_index]) / select_size)
            }
        }
    }

    // console.log("select_size : ", select_size)
    // console.log(rolled_dices.weapon)

    // console.log(parsed_action.probability)


    // console.log(parsed_action)

    if(select_size == 0){
        // console.log(state)
        // console.log(rolled_dices)
        // console.log(probs)
        console.log("ERROR!!!")
    }

    // console.log(parsed_action)

    // if(action_index == 0 || action_index == 63)
    //     console.log(parsed_action)

    // console.log(rolled_dices)
    // console.log(bit_mask)
    // console.log(parsed_action)
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    return parsed_action
}




function _Parse_Action_Godfavor(state, action_index, probability) {
    let parsed_action = {
        "chosen": {
            preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
            extra: null,
            input: null
            // preparedGodFavor: { godfavorIndex: 0, level: 1, godfavorNameIndex: 3 },
            // extra : null,
            // input : null
        },
        "probability" : probability
    }


    return parsed_action
    // let name_index = 3 * 
}

function _Action2Index_Roll(action){
    let action_index = 0

    action.chosen.forEach((chosen_, dice_index) => {
        if(chosen_ == true){
            action_index += Math.pow(2, dice_index)
        }
    })

    return action_index
}

function _Action2Index_Godfavor(action){
    let action_index = undefined

    if(action.preparedGodFavor.godfavorIndex == -1)
        action_index = 60
    else{
        action_index = action.preparedGodFavor.godfavorNameIndex * 3 + action.preparedGodFavor.level
    }

    return action_index
}