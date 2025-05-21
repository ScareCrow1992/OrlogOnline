// { pick: pick_, ban: ban_ }




export default function (avatar, inputInfo, clientPhase, avatarsInfo, situation) {
    if(inputInfo == null)
        return false

    if (Object.prototype.hasOwnProperty.call(inputInfo, "pick") == false || Object.prototype.hasOwnProperty.call(inputInfo, "ban") == false)
        return false

    let draft_avatar = situation.order[situation.draft % 2]
    if (avatar != draft_avatar)
        return false


    if (situation.draft > 0 && situation.draft < 6) {

        if (Number.isInteger(inputInfo.pick) == false)
            return false

        if (inputInfo.pick < -1 || inputInfo.pick > 19)
            return false

        if (Number.isInteger(inputInfo.ban) == false)
            return false

        if (inputInfo.ban < -1 || inputInfo.ban > 19)
            return false
    }

    if (situation.draft == 0) {
        if (inputInfo.pick != null)
            return false

        if (Number.isInteger(inputInfo.ban) == false)
            return false

        if (inputInfo.ban < -1 || inputInfo.ban > 19)
            return false
    }


    if (situation.draft == 6) {
        if (inputInfo.ban != null)
            return false

        if (Number.isInteger(inputInfo.pick) == false)
            return false

        if (inputInfo.pick < -1 || inputInfo.pick > 19)
            return false
    }

    return true
}