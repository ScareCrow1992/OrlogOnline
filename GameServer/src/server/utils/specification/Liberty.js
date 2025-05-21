// { user: player, godfavors: [player * 3, player * 3 + 1, player * 3 + 2] }





export default function(avatar, inputInfo, clientPhase, avatarsInfo, situation){
    if(inputInfo == null)
        return false

    inputInfo.user = avatar

    if (Object.prototype.hasOwnProperty.call(inputInfo, "godfavors") == false)
        return false

    if(Array.isArray(inputInfo.godfavors) == false)
        return false

    // if(inputInfo.godfavors.length != 3)
    //     return false

    // for(let godfavor_index = 0 ; godfavor_index < 3; godfavor_index++){
    //     let godfavor = inputInfo.godfavors[godfavor_index]

    //     if(Number.isInteger(godfavor) == false)
    //         return false

    //     if(godfavor < 0 || godfavor > 19)
    //         return false
    // }

    return true
}