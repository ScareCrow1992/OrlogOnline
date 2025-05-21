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




export default function (avatar, inputInfo, clientPhase, avatarsInfo, situation) {
    // console.log(inputInfo)
    if (clientPhase != "resolution")
        return false

    if (situation.resolutionWaitInputForUser != avatar)
        return false


    if (inputInfo == null) {
        return true
    }
    else {

        if (Number.isInteger(inputInfo.avatar) == false)
            return false

        inputInfo.avatar = avatar

        if (Number.isInteger(inputInfo.index) == false)
            return false

        if (inputInfo.index < 0 || inputInfo.index > 14)
            return false


        if (typeof inputInfo.type !== "string")
            return false
    }


    if (Array.isArray(avatarsInfo) == false)
        return false



    return true
}