import * as superVisor from './Calculation/SuperVisor.js'
import * as RollPhase from './Calculation/RollPhase.js'
import * as GodFavorPhase from './Calculation/GodfavorPhase.js'
import * as ResolutionPhase from './Calculation/ResolutionPhase.js'

export {superVisor, RollPhase, GodFavorPhase, ResolutionPhase}


function InitialGame(controller, firstPlayer){
    superVisor.InitialGame(controller, firstPlayer);
}

function ResetRount(controller){
    return superVisor.ResetRount(this.controller)
}

function GetRollDicesCnt(avatar){
    return superVisor.GetRollDicesCnt(avatar)
}

function RollDices(avatar, dirs, diceTransformLogs, controller){
    return superVisor.RollDices(avatar, dirs, diceTransformLogs, controller)
}

function selectObject(ret, controller){
    
}


