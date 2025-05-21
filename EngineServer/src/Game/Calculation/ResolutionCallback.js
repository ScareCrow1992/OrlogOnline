



function ResolutionPhaseStart(playerOrder, dicesWithTokenIndex){
    let playerOrder = LogicKit.GetPlayerOrder()
    let dicesWithTokenIndex = LogicKit.GetToken()
    this.GetToken(playerOrder, dicesWithTokenIndex)
}



function ResolutionPhaseMiddle(){
    let playerOrder = LogicKit.GetPlayerOrder()
    let sectorsInfo = LogicKit.GetDiceSector()
    let dicesCommand, battleResult, dicesFormation
    [dicesCommand, battleResult, dicesFormation]  = LogicKit.GetBattleInformation(sectorsInfo)
    this.Battle(playerOrder, dicesCommand, dicesFormation)

}