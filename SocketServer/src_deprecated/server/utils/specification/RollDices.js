/*
let ret = [
        "BellPushed",
        [
            "client", { user: index, godfavors: [0, 1, 2] }, "roll",
            [
                {
                    "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
                    health: 15,
                    token: 5
                }, {
                    "dicesState": ["tray", "tray", "tray", "tray", "tray", "tray"],
                    health: 15,
                    token: 10
                }
            ]
        ]
    ]
*/



export default function(avatar, inputInfo, clientPhase, avatarsInfo, situation){
    let turn_player = situation.order[situation.turnNum % 2]

    if(turn_player != avatar){
        return false
    }

    if(situation.turnNum > 3)
        return false

    if(clientPhase != "roll")
        return false


    for (let avatar_index = 0; avatar_index < 2; avatar_index++) {
        let avatar_info = avatarsInfo[avatar_index]

        let dices_cnt = situation.player[avatar_index].dices.length

        if(dices_cnt != 6)
            return false


        for (let dice_index = 0; dice_index < dices_cnt; dice_index++) {
            let state = avatar_info["dicesState"][dice_index]
            if (state != "chosen" && state != "tray" && state != "waiting")
                return false
        }

        if (Number.isInteger(avatar_info["health"]) == false)
            return false

        if (Number.isInteger(avatar_info["token"]) == false)
            return false

    }

    return true
}