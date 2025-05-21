import * as superVisor from './Calculation/SuperVisor.js'
import * as RollPhase from './Calculation/RollPhase.js'
import * as GodFavorPhase from './Calculation/GodfavorPhase.js'
import * as ResolutionPhase from './Calculation/ResolutionPhase.js'



function GetFirstPlayer(situation, firstPlayer){
    return superVisor.GetFirstPlayer.call(situation, firstPlayer)
}


function InitialGame(situation){
    return superVisor.InitialGame.call(situation)
}


function StartRound(situation){
    return superVisor.StartRound.call(situation)
}

function RollDices(situation, avatar){
    let dirs = RollPhase.SetDicesDir()
    let cnt = superVisor.GetRollDicesCnt.call(situation, avatar)
    let ret = superVisor.RollDices.call(situation, avatar, dirs, this.controller)
    return ret
}


function BellPushed(situation, avatar, inputInfo, avatarsInfo) {
    // return superVisor.BellPushed(avatar, isLastTurn)
    let ret = superVisor.BellPushed.call(situation, avatar, inputInfo, avatarsInfo)

    let diceFormation, playerOrder, sectorPower;
    if(ret.nextAction == "RollPhaseEnd")
        [diceFormation, playerOrder, sectorPower] = GetDiceFormation(situation)

    return [ret, diceFormation, playerOrder, sectorPower]
}


// function SelectObject(situation, objInfo){
//     return superVisor.SelectObject.call(situation, objInfo)
// }

function _GetDicesInfo(situation){
    return superVisor.GetDicesInfo.call(situation)
}


function GetDiceFormation(situation) {
    let dicesInfo = _GetDicesInfo(situation)
    let diceFormation, sectorPower
    [diceFormation, sectorPower] = RollPhase.GetDiceFormation(dicesInfo)
    let playerOrder = superVisor.GetPlayerOrder.call(situation)

    // console.log(diceFormation)

    return [diceFormation, playerOrder, sectorPower]
}


// function _SetDiceFormation(diceFormation) {
//     return superVisor.SetDiceFormation(diceFormation)
// }


function GetPlayerOrder(situation){
    return superVisor.GetPlayerOrder.call(situation)
}


function _GetDicesWithTokenIndex(dices){
    return ResolutionPhase.GetDicesWithTokenIndex(dices)
}


function GetBattleInformation(sectors, situation){
    let dicesCommand, battleResult, dicesFormation
    [dicesCommand, battleResult, dicesFormation] = ResolutionPhase.GetBattleInformation(sectors, superVisor, situation)
    

    // _BattleSimulation(battleResult)

    return [dicesCommand, battleResult, dicesFormation]
}


function GetDiceSector(situation){
    let dicesInfo = _GetDicesInfo(situation)
    return RollPhase.GetDiceSector(dicesInfo)
}


function ResetRound(situation){
    return superVisor.ResetRound.call(situation)
}


// function _BattleSimulation(battleResult){
//     return superVisor.BattleSimulation(battleResult)
// }


function GetToken(situation){
    let dicesInfo = _GetDicesInfo(situation)
    let dicesWithTokenIndex = _GetDicesWithTokenIndex(dicesInfo)
    superVisor.GetToken.call(situation, dicesWithTokenIndex)
    return dicesWithTokenIndex
}


function GetExtraToken(situation, user, dicesWithTokenIndex){
    let tokenIndexes = [[],[]]
    let order = superVisor.GetPlayerOrder()
    tokenIndexes[order[user]] = dicesWithTokenIndex

    superVisor.GetToken.call(situation, tokenIndexes)
}


function GodFavorCardsPick(situation, user, picked_godfavors){
    return superVisor.GodFavorCardsPick.call(situation, user, picked_godfavors)

}


// function ActivateGodFavorPower(godFavorAction){
//     return superVisor.ActivateGodFavorPower(godFavorAction)
// }


function PrepareGodFavor(situation, godFavorIndex, level, user){
    superVisor.PrepareGodFavor.call(situation, godFavorIndex, level, user)
}


// function _GetSituation(){
//     return superVisor.Situation
// }

function GodFavorAction(situation){
    let godFavorsInfo = superVisor.GetPreparedGodFavor.call(situation)

    let order = GetPlayerOrder(situation)

    return GodFavorPhase.GetGodFavorPowerCallback(godFavorsInfo, order, superVisor, situation)
}

function GetCurrentPhase(situation){
    return superVisor.GetCurrentPhase.call(situation)
}


// PushResolutionPhaseCommands, GetNextResolutionPhaseCommand

function PushResolutionPhaseCommands(situation, cmds){
    superVisor.PushResolutionPhaseCommands.call(situation, cmds)
}

function GetNextResolutionPhaseCommand(situation,){
    return superVisor.GetNextResolutionPhaseCommand.call(situation)
}


function WaitForPlayerInputAtResolutionPhase(situation, user){
    return superVisor.WaitForPlayerInputAtResolutionPhase.call(situation, user)
}

function GetResolutionPhaseInputWaitUser(situation, avatarsInfo, inputInfo, avatar){
    return superVisor.GetResolutionPhaseInputWaitUser.call(situation, avatarsInfo, inputInfo, avatar)
}

function GetInputData(situation){
    return superVisor.GetInputData.call(situation)
}

function GetExtraInputData(situation){
    return superVisor.GetExtraInputData.call(situation)
}

function SetDicesState(situation, user, indexes, state){
    superVisor.SetDicesState.call(situation, user, indexes, state)
}


function SetDicesDir(situation, user, indexes, dirs){
    superVisor.SetDicesDir.call(situation, user, indexes, dirs)
}


function TakeDamage(situation, user, damage, weapon){
    superVisor.TakeDamage.call(situation, user, damage, weapon)
}


function AddToken(situation, user, cnt){
    superVisor.AddToken.call(situation, user, cnt)
}

function RemoveToken(situation, user, cnt){
    superVisor.RemoveToken.call(situation, user, cnt)
}


function BanPick(situation, user, pick, ban){
    return superVisor.BanPick.call(situation, user, pick, ban)
}



export { GetFirstPlayer, InitialGame, StartRound, RollDices, BellPushed, ResetRound, PrepareGodFavor, GetDiceFormation, GetDiceSector, GodFavorAction, GetToken, GetExtraToken, GetPlayerOrder, GetBattleInformation, GetCurrentPhase, PushResolutionPhaseCommands, GetNextResolutionPhaseCommand, GetInputData,WaitForPlayerInputAtResolutionPhase, GetResolutionPhaseInputWaitUser, GetExtraInputData, SetDicesState, SetDicesDir, GodFavorCardsPick, TakeDamage, AddToken, RemoveToken, BanPick }