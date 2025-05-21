import {ParsingKey} from "./data_process.js"
import Config from "../index/config.js"

// global.config = Config

const weapon2index = {
    "axe" : 0,
    "arrow" : 1,
    "helmet" : 2,
    "shield" : 3,
    "steal" : 4
}

function Bits2Array(index_bit) {
    let index_array = []
    for (let i = 0; i < 6; i++) {
        if ((index_bit & (1 << i)) != 0)
            index_array.push(i)
    }

    return index_array
}



function GetCaseBits(current) {
    let ret = []
    for (let i = 0; i <= 0b111111; i++) {
        if ((i & current) === 0b000000) {
            // let picked_dices = i ^ current
            // console.log(`${i.toString(2)} ▶▶ ${picked_dices.toString(2)}`)
            ret.push(i)
        }
        else {

        }
    }
    return ret;
}



function GetNewKey(avatars_info, dices_dir, user_index, dice_bit, user_order){
    let new_info = JSON.parse(JSON.stringify(avatars_info))

    let picked_dices_index = Bits2Array(dice_bit)

    picked_dices_index.forEach(dice_index => {
        let dir = dices_dir[dice_index]
        let dice = global.config.dice_face_info[dice_index]
        let weapon = dice[`${dir}`].weapon
        let mark = dice[`${dir}`].token

        let weapon_index = weapon2index[`${weapon}`]

        new_info[`Weapon-${user_order}`][weapon_index]++

        if (mark == true)
            new_info[`Mark-${user_order}`]++
    })

    let ret = ParsingKey(new_info)
    return [ret, picked_dices_index];
}



function GetNewKeys(avatars_info, dices_dir, user_index, dice_bits){
    let keys = ""
    let indexes = []
    dice_bits.forEach(dice_bit=>{
        let [key, index] = GetNewKey(avatars_info, dices_dir, user_index, dice_bit)
        keys += key
        keys += "/"
        indexes.push(index)
    })
    // console.log(keys)
    keys = keys.slice(0, keys.length - 1)
    // console.log(keys)
    
    return [keys, indexes]
}



function GetCaseKeys(avatars_info, dices_dir, user_index){
    let current = 0
    dices_dir.forEach((dir, index)=>{
        if(dir == null)
            current |= (1 << index)
    })
    
    let dice_bits = GetCaseBits(current)

    return GetNewKeys(avatars_info, dices_dir, user_index, dice_bits)
}




function NewFeature(feature, dices_dir, user_index, dice_bit){
    // 선공 유저의 index
    let user_order = feature["First"]

    let user_ = user_order == user_index ? 0 : 1

    let new_feature = JSON.parse(JSON.stringify(feature))
    
    let picked_dices_index = Bits2Array(dice_bit)

    picked_dices_index.forEach(dice_index => {
        let dir = dices_dir[dice_index]
        let dice = global.config.dice_face_info[dice_index]
        let weapon = dice[`${dir}`].weapon
        let mark = dice[`${dir}`].token

        let weapon_index = weapon2index[`${weapon}`]

        new_feature[`Weapon-${user_}`][weapon_index]++

        if (mark == true)
            new_feature[`Mark-${user_}`]++
    })

    // console.log(new_feature)
    return [new_feature, picked_dices_index]
}




function NewFeatures(feature, dices_dir, user_index, dice_bits){
    let new_features = []
    let indexes = []

    dice_bits.forEach((dice_bit)=>{
        let [ret, index] = NewFeature(feature, dices_dir, user_index, dice_bit)
        new_features.push(ret)
        indexes.push(index)
    })
    // console.log(indexes)
    return [new_features, indexes]
}



export default function GetCaseFeatures(feature, dices_dir, user_index){
    let current = 0
    dices_dir.forEach((dir, index)=>{
        if(dir == null)
            current |= (1 << index)
    })
    
    let dice_bits = GetCaseBits(current)

    let [new_features, indexes] = NewFeatures(feature, dices_dir, user_index, dice_bits)

    let ret= {
        "HP-0": [],
        "Token-0": [],
        "Weapon-0": [],
        "Mark-0": [],
        "Card-0": [],
        "HP-1": [],
        "Token-1": [],
        "Weapon-1": [],
        "Mark-1": [],
        "Card-1": [],
        "Round": [],
    }

    let keys = Object.keys(ret)

    new_features.forEach(feature=>{
        keys.forEach(key=>{
            ret[`${key}`].push(feature[`${key}`])
        })
    })

    return [ret, indexes]
}



function UnitTest() {
    let feature = {
        "HP-0": 13,
        "Token-0": 6,
        "Weapon-0": [1, 2, 0, 0, 0],
        "Mark-0": 2,
        "Card-0": [0, 3, 14],
        "HP-1": 6,
        "Token-1": 15,
        "Weapon-1": [0, 2, 1, 1, 2],
        "Mark-1": 3,
        "Card-1": [0, 3, 14],
        "Round": 2,
        "First": 0
    }

    let dices_dir = ['bottom', 'left', null, null, "top", null]

    let user_index = 0

    GetCaseFeatures(feature, dices_dir, user_index)

    // let [keys, indexes] = GetCaseKeys(avatars_info, dices_dir, user_index)
    // console.log(keys)
    // console.log(indexes)
}

// UnitTest()