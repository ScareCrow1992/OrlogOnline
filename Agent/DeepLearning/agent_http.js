
import axios from "axios";
import Cases from "./cases.js"


function Request_DicePick(avatars_info, dices_dir, user_index) {
    // console.log(avatars_info)
    let first_user = avatars_info[2].first
    let [keys, indexes] = Cases(avatars_info, dices_dir, user_index)

    const bodyParameters = { 
        keys: keys,
        // timeout: 10000
    };

    let promise = new Promise(res_ => {

        axios.post('http://127.0.0.1:8080/pick_dice', bodyParameters)
            .then(res => {
                // console.log(res.data)
                let [worst, best] = res.data.split('/')
                // 선공이면 indexes[best]를, 후공이면 indexes[worst]를 pick 한다
                if (first_user == user_index)
                    res_(indexes[best])
                else
                    res_(indexes[worst])
            })
    })


    return promise
}




export { Request_DicePick }




function UnitTest() {

    let avatars_info =
        [{ axe: 3, arrow: 1, helmet: 0, shield: 1, steal: 1, mark: 0, hp: 3, token: 15 },
        { axe: 3, arrow: 0, helmet: 1, shield: 0, steal: 0, mark: 1, hp: 4, token: 8 },
        { first: 0, turn: 3 }]

    let dices_dir = ['bottom', 'left', null, null, "top", null]

    let user_index = 0

    Request_DicePick(avatars_info, dices_dir, user_index)
}


// UnitTest()