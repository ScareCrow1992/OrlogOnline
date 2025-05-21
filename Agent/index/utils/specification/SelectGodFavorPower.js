//{godFavorIndex: random.integer(0, 0), level: 0}



export default function (avatar, inputInfo, clientPhase, avatarsInfo, situation) {
    if(clientPhase != "godfavor")
        return false

    // console.log("aaa")

    if(inputInfo == null)
        return true

    
    if (Number.isInteger(inputInfo["godFavorIndex"]) == false)
        return false

    if (inputInfo["godFavorIndex"] < 0 || inputInfo["godFavorIndex"] > 19)
        return false

    if (Number.isInteger(inputInfo["level"]) == false)
        return false

    if (inputInfo["level"] < 0 || inputInfo["level"] > 2)
        return false

    if (clientPhase != "godfavor")
        return false

    if (situation.turnEnd[avatar] == true)
        return false

    return true
}