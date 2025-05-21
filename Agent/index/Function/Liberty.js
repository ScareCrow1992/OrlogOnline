// { user: player, godfavors: [player * 3, player * 3 + 1, player * 3 + 2] }


import { Random } from "random-js";

const random = new Random();

// let arr = new Array(20)
// for (let i = 0; i < arr.length; i++){

//     arr[i] = i
// }

// let arr = [0, 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19]

// let arr_attack = [2, 12, 14]
// let arr_heal = [6,7,8]
// let arr_normal = [0,1,3,4,10,11,13,15,16,17,19]

let arr_attack = [2, 12, 14]
let arr_heal = [6, 7, 8]
let arr_normal = [0, 1, 3, 4, 10, 13, 15, 17, 18, 19]


let godfavors_set = [[7, 18, 19], [8, 12, 14]]

export default function (index) {
    // random.shuffle(arr)

    random.shuffle(arr_attack)
    random.shuffle(arr_heal)
    random.shuffle(arr_normal)
    let godfavors_ = undefined
    if(this.force_sync_situation != null){
        let user = null
        if(index == 0)
            user == "avatar"
        else
            user == "opponent"

        let user_info = this.force_sync_situation[`${user}`]
        godfavors_ = user_info.godFavors
    }
    else{
        godfavors_ = [arr_attack[0], arr_heal[0], arr_normal[0]]
    }

    godfavors_.sort((a, b)=>{return a - b})

    // godfavors_ = [...godfavors_set[index]]


    return ["BellPushed", [index, { user: index, godfavors: [...godfavors_] }, "cardselect",
        [{ "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 },
        { "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"], health: 15, token: 10 }]]]

}

