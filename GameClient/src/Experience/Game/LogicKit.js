import * as superVisor from './Calculation/SuperVisor.js'
import * as RollPhase from './Calculation/RollPhase.js'
import * as GodFavorPhase from './Calculation/GodfavorPhase.js'
import * as ResolutionPhase from './Calculation/ResolutionPhase.js'



function GetFirstPlayer(){
    return superVisor.GetFirstPlayer()
}


function InitialGame(){
    return superVisor.InitialGame()
}


function StartRound(){
    return superVisor.StartRound()
}

function RollDices(avatar){
    let dirs = RollPhase.SetDicesDir()
    let cnt = superVisor.GetRollDicesCnt(avatar)
    let ret = superVisor.RollDices(avatar, dirs, this.controller)
    return ret
}


function BellPushed(avatar, playerInfo, avatarsInfo) {
    // return superVisor.BellPushed(avatar, isLastTurn)
    let ret = superVisor.BellPushed(avatar, playerInfo, avatarsInfo)

    let diceFormation, playerOrder, sectorPower;
    if(ret.nextAction == "RollPhaseEnd")
        [diceFormation, playerOrder, sectorPower] = GetDiceFormation()

    return [ret, diceFormation, playerOrder, sectorPower]
}


function SelectObject(objInfo){
    return superVisor.SelectObject(objInfo)
}

function _GetDicesInfo(){
    return superVisor.GetDicesInfo()
}


function GetDiceFormation() {
    let dicesInfo = _GetDicesInfo()
    let diceFormation, sectorPower
    [diceFormation, sectorPower] = RollPhase.GetDiceFormation(dicesInfo)
    let playerOrder = superVisor.GetPlayerOrder()

    // console.log(diceFormation)

    return [diceFormation, playerOrder, sectorPower]
}


function _SetDiceFormation(diceFormation) {
    return superVisor.SetDiceFormation(diceFormation)
}


function GetPlayerOrder(){
    return superVisor.GetPlayerOrder()
}


function _GetDicesWithTokenIndex(dices){
    return ResolutionPhase.GetDicesWithTokenIndex(dices)
}


function GetBattleInformation(sectors){
    let dicesCommand, battleResult, dicesFormation
    [dicesCommand, battleResult, dicesFormation] = ResolutionPhase.GetBattleInformation(sectors, superVisor)
    

    // _BattleSimulation(battleResult)

    return [dicesCommand, battleResult, dicesFormation]
}


function GetDiceSector(){
    let dicesInfo = _GetDicesInfo()
    return RollPhase.GetDiceSector(dicesInfo)
}


function ResetRound(){
    return superVisor.ResetRound()
}


function _BattleSimulation(battleResult){
    return superVisor.BattleSimulation(battleResult)
}


function GetToken(){
    let dicesInfo = _GetDicesInfo()
    let dicesWithTokenIndex = _GetDicesWithTokenIndex(dicesInfo)
    superVisor.GetToken(dicesWithTokenIndex)
    return dicesWithTokenIndex
}


function GetExtraToken(user, dicesWithTokenIndex){
    let tokenIndexes = [[],[]]
    let order = superVisor.GetPlayerOrder()
    tokenIndexes[order[user]] = dicesWithTokenIndex

    superVisor.GetToken(tokenIndexes)
}


function GodFavorCardsPick(user, picked_godfavors){
    return superVisor.GodFavorCardsPick(user, picked_godfavors)

}


// function ActivateGodFavorPower(godFavorAction){
//     return superVisor.ActivateGodFavorPower(godFavorAction)
// }


function PrepareGodFavor(godFavorIndex, level, user){
    superVisor.PrepareGodFavor(godFavorIndex, level, user)
}


function _GetSituation(){
    return superVisor.Situation
}

function GodFavorAction(){
    let godFavorsInfo = superVisor.GetPreparedGodFavor()

    let order = GetPlayerOrder()

    return GodFavorPhase.GetGodFavorPowerCallback(godFavorsInfo, order, superVisor, superVisor.Situation)
}

function GetCurrentPhase(){
    return superVisor.GetCurrentPhase()
}


// PushResolutionPhaseCommands, GetNextResolutionPhaseCommand

function PushResolutionPhaseCommands(cmds){
    superVisor.PushResolutionPhaseCommands(cmds)
}

function GetNextResolutionPhaseCommand(){
    return superVisor.GetNextResolutionPhaseCommand()
}


function WaitForPlayerInputAtResolutionPhase(user){
    return superVisor.WaitForPlayerInputAtResolutionPhase(user)
}

function GetResolutionPhaseInputWaitUser(avatarsInfo, inputInfo, avatar){
    return superVisor.GetResolutionPhaseInputWaitUser(avatarsInfo, inputInfo, avatar)
}

function GetInputData(){
    return superVisor.GetInputData()
}

function GetExtraInputData(){
    return superVisor.GetExtraInputData()
}

function SetDicesState(user, indexes, state){
    superVisor.SetDicesState(user, indexes, state)
}


function SetDicesDir(user, indexes, dirs){
    superVisor.SetDicesDir(user, indexes, dirs)
}


function TakeDamage(user, damage, weapon){
    superVisor.TakeDamage(user, damage, weapon)
}


function AddToken(user, cnt){
    superVisor.AddToken(user, cnt)
}

function RemoveToken(user, cnt){
    superVisor.RemoveToken(user, cnt)
}

export { GetFirstPlayer, InitialGame, StartRound, RollDices, BellPushed, SelectObject, ResetRound, PrepareGodFavor, _GetSituation, GetDiceFormation, GetDiceSector, GodFavorAction, GetToken, GetExtraToken, GetPlayerOrder, GetBattleInformation, GetCurrentPhase, PushResolutionPhaseCommands, GetNextResolutionPhaseCommand, GetInputData, WaitForPlayerInputAtResolutionPhase, GetResolutionPhaseInputWaitUser, GetExtraInputData, SetDicesState, SetDicesDir, GodFavorCardsPick, TakeDamage, AddToken, RemoveToken }