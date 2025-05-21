


const random_functions = {
    "CheckReady": (index, ...params) => { return _CheckReady(index, ...params) },
    // "InitialGame": (index, ...params) => { return _InitialGame(index, ...params) },
    "PhaseChange": (index, ...params) => { return _PhaseChange(index, ...params) },
    "RollDices": (index, ...params) => { return RollDices(index, ...params) },
    "GameOver": (index, ...params) => { return _GameOver(index, ...params) },
    "SelectGodFavorPower": (index, ...params) => { return SelectGodFavorPower(index, ...params) },
    "GodFavorAction": (index, ...params) => { return GodFavorAction(index, ...params) },
    "ExtraInputBegin": (index, ...params) => { return ExtraInputBegin(index, ...params) }
}


function GenerateRandomParam (last_call, index, params) {
    let ret = null


    switch (last_call) {
        case "RollDices":
            ret = RollDices(...params, this.game.situation)
            // console.log(`[ Guardian - RollDices ] : ${ret}`)
            break;

        case "SelectGodFavorPower":
            ret = SelectGodFavorPower(...params, this.game.situation)
            // console.log(`[ Guardian - SelectGodFavorPower ] : ${ret}`)
            break;

        case "ExtraInputBegin":
            ret = ExtraInputBegin(...params, this.game.situation)
            // console.log(`[ Guardian - ExtraInputBegin ] : ${ret}`)
            
            break;


        case "Liberty":
            // ret = Liberty(...params, this.game.situation)
            // console.log(`[ Guardian - Liberty ] : ${ret}`)

            break;

        case "Draft":
            // ret = Draft(...params, this.game.situation)
            // console.log(`[ Guardian - Draft ] : ${ret}`)
            break;

        default:
            ret = false;
            break;
    }

    return ret

}



const need_random_params = ["RollDices", "SelectGodFavorPower", "Liberty", "Draft"]

export {GenerateRandomParam, need_random_params}