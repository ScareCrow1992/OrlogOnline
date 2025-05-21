export default {
    sync_timer_bias : 4500,
    socket_limit : 10000,
    animation_time : {
        "InitialGame" : 17000,
        "GameStart" : 5500,
        "Liberty" : 5500,
        "Draft" : 4500,
        "RollDices" : 2500,
        "SpecialRollDices" : 2500,
        "SelectGodFavorPower" : 0,
        "ExtraInputBegin" : 0,
        "DicesToWaiting" : 1000,
        "SetDiceFormation" : 1000,
        "GetToken" : 4000,
        "GodFavorAction" : 3000,
        "GodFavorExtraAction" : 3000,
        "BanDices" : 1500,
        "DiceBattle" : DiceBattle
    },
    limited_time : {
        "Liberty" : 45000,
        "Draft" : 30000,
        "RollDices" : 15000,
        "SelectGodFavorPower" : 15000,
        "ExtraInputBegin" : 20000
    },
    need_sync_cmds : ["InitialGame"],
    need_timer_cmds : ["Liberty","Draft", "RollDices", "SelectGodFavorPower", "ExtraInputBegin"],
    mySQL_user : "evoxx4hdbs9yf4oh2phm",
    mySQL_pw : "pscale_pw_IDjWEhiAUQZBzhmvn8o4Pg7dEB5wsOXeZmX5MruOv7g"
}

function DiceBattle(cmds){
    let acc_time = 0;
    for(let section = 0; section <6; section++){
        for(let index=0; index<2; index++){
            if (cmds[0][section][index] > 0 || cmds[1][section][index] > 0) {
                if (section < 4)
                    acc_time += 1500
                else
                    acc_time += 4500
            }
        }
    }
    return acc_time
}