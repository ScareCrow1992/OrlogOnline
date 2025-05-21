import Situation from "../Data/Situation.js"
import EventEmitter from "./EventEmitter.js"


const dirI2S = ["right", "left", "top", "bottom", "front", "back"]
const dicePickLimitTurn = 4


const eventEmitter = new EventEmitter()


function GetFirstPlayer(){
    let firstPlayer = Math.floor(Math.random() * 10) % 2
    // Situation.order[1 - firstPlayer] = "top"
    // Situation.order[firstPlayer] = "bottom"
    Situation.order[0] = firstPlayer
    Situation.order[1] = 1 - firstPlayer

    Situation.phase = "cardselect"


    return firstPlayer
}


function InitialGame() {
    // eventEmitters.on("initial-game", ()=>{console.log("trigger")})
    // eventEmitters.trigger("initial-game")
    // eventEmitters.trigger("game")
    eventEmitter.reset()
    
    
    Situation.round = 0
    Situation.phase = "roll"
    Situation.turnNum = 0
    Situation.winner = "none"

    Situation.turnEnd[0] = false
    Situation.turnEnd[1] = false


    let players = [0, 1]
    players.forEach(player_ => {
        let player = Situation.player[player_]
        player.health = 15
        player.token = 20
        player.dices.forEach(dice => { dice.state = "tray" })
    })

    // controller.InitialGame();
}

function TakeHeal(user, value){
    Situation.player[user].health += value
    Situation.player[user].health = Math.min(15, Situation.player[user].health)
}



function TakeDamage(user, damage, weapon){
    eventEmitter.trigger(`${user}-damage-${weapon}`, [damage])
    Situation.player[user].health -= damage

    if(Situation.player[user].health <= 0 && Situation.winner == "none"){
        Situation.winner = 1 - user;
        Situation.phase = "end";
    }
}


function BlockAttack(user, cnt, weapon){
    eventEmitter.trigger(`${user}-block-${weapon}`, [cnt])
}

function StealToken(defender, cnt){
    let attacker = 1 - defender

    let canStealTokensCnt = Math.min(
        Situation.player[`${defender}`].token,
        cnt)

    Situation.player[`${defender}`].token -= canStealTokensCnt
    Situation.player[`${attacker}`].token += canStealTokensCnt
    

}


function AddToken(user, cnt){
    Situation.player[`${user}`].token += cnt
    Situation.player[`${user}`].token = Math.min(
        Situation.player[`${user}`].token, 50
    )

}

function RemoveToken(user, cnt){
    Situation.player[`${user}`].token -= cnt
    Situation.player[`${user}`].token = Math.max(
        Situation.player[`${user}`].token, 0)
}


// sector 단위로 상세하게 과정 나눠야함 (Hel 능력이 도끼에만 한정되므로)
function BattleSimulation(battleResult) {
    let firstAvatar = Situation.order[0]
    let secondAvatar = Situation.order[1]

    let canStealTokensCnt = Math.min(
        Situation.player[`${secondAvatar}`].token,
        battleResult[1].stealedToken)

    Situation.player[`${secondAvatar}`].health -= battleResult[1].takenDamage
    Situation.player[`${secondAvatar}`].token -= canStealTokensCnt
    Situation.player[`${firstAvatar}`].token += canStealTokensCnt
    // Hel 트리거 = 공격자 체력 증가(도끼데미지)

    if (Situation.player[`${secondAvatar}`].health <= 0)
        return firstAvatar

    canStealTokensCnt = Math.min(
        Situation.player[`${firstAvatar}`].token,
        battleResult[0].stealedToken)

    Situation.player[`${firstAvatar}`].health -= battleResult[0].takenDamage
    Situation.player[`${firstAvatar}`].token -= canStealTokensCnt
    Situation.player[`${secondAvatar}`].token += canStealTokensCnt
    // Hel 트리거 = 공격자 체력 증가 (도끼데미지)

    if (Situation.player[`${firstAvatar}`].health <= 0)
        return secondAvatar


    return null
}



// // param = [[선공], [후공]]
// // dicesCommand = [[ 공방 횟수, 명치 횟수 ],[]]
// // battleResult = [{ takenDamage : <int> , stealedToken : <int> }, {}]
// function DiceBattle(dicesCommand, battleResult, controller) {
//     let whoIsWin = BattleSimulation(battleResult)

//     return controller.MessageEnqueue("DiceBattle", [dicesCommand, Situation.order])

// }


function GetDicesInfo() {
    let first = Situation.order[0]
    let second = Situation.order[1]
    // console.log(...Situation.player[`${first}`].dices)
    // console.log(...Situation.player[`${second}`].dices)
    return [[...Situation.player[`${first}`].dices], [...Situation.player[`${second}`].dices]]

}


function StartRound() {
    // 체력, 토큰, 주사위, situation 등 모든 정보를 리셋
    let avatar = Situation.order[0 % 2]
    Situation.turnEnd[0] = false
    Situation.turnEnd[1] = false
    Situation.preparedGodFavor[0].godfavorIndex = -1
    Situation.preparedGodFavor[0].level = -1
    Situation.preparedGodFavor[0].godfavorNameIndex = -1
    Situation.preparedGodFavor[1].godfavorIndex = -1
    Situation.preparedGodFavor[1].level = -1
    Situation.preparedGodFavor[1].godfavorNameIndex = -1
    
    Situation.round++

    return avatar
}


function ResetRound() {
    Situation.phase = "roll"
    Situation.turnNum = 0
    Situation.orderSwap()

    for (let i = 0; i < 6; i++) {
        Situation.player[0].dices[i].state = "tray"
        Situation.player[0].dices[i].power = 1

        Situation.player[1].dices[i].state = "tray"
        Situation.player[1].dices[i].power = 1
    }

    Situation.player.forEach(user=>{
        while(user.dices.length > 6)
            user.dices.pop()
    })
    
    Situation.resolutionWaitInputForUser = -1
    eventEmitter.reset()

    console.log(Situation)

    return WhoIsWinner()
}


function WhoIsWinner(){
    console.log(Situation.winner)
    return Situation.winner
}



function RegisterEvent(trigger, callback){
    eventEmitter.on(`${trigger}`, (param) => { callback(param) })
}

function TriggerEvent(trigger, value){
    console.log(trigger)
    console.log(value)
    eventEmitter.trigger(`${trigger}`, value)
}


function SetFormation() {

}


/*

[playerInfo]

"godfavor"
godFavorIndex, level
*/
function BellPushed(avatar, playerInfo = null, avatarsInfo=null) {
    // isLastTurn = isLastTurn || false
    switch (Situation.phase) {
        case "roll":
            let prevAvatar
            // if (isLastTurn) {
            //     prevAvatar = Situation.order[(Situation.turnNum + 1) % 2]
            //     avatar = prevAvatar
            // }
            // else

                prevAvatar = Situation.order[Situation.turnNum % 2]

            // console.log(`${avatar}, ${prevAvatar}`)
            if (avatar == prevAvatar) {
                let prevDices = Situation.player[`${prevAvatar}`].dices
                let dicesStateFromClient
                if(avatarsInfo != null)
                    dicesStateFromClient = avatarsInfo[prevAvatar].dicesState
                else{
                    prevDices.forEach((dice, index)=>{
                        if(dice.state === "waiting")
                            dicesStateFromClient = "waiting"
                        else
                            dicesStateFromClient = "chosen"
                    })
                }



                // 이전 플레이어의 chosen 주사위들을 waiting 상태로 바꾼다.
                let chosenDices = []
                prevDices.forEach((dice, index) => {

                    if ((Situation.turnNum < dicePickLimitTurn && dice.state === "tray" && dicesStateFromClient[index] === "chosen") ||
                        (Situation.turnNum >= dicePickLimitTurn && dice.state === "tray")
                    ) {
                        // 1. 주사위 턴이 남아있을경우 선택된 주사위를 waiting으로
                        // 2. 주사위 턴이 더이상 없을 경우 남은 굴린 후 곧바로 waiting으로
                        dice.state = "waiting"
                        chosenDices.push(index)
                    }


                })

                // controller.MessageEnqueue("DicesToWaiting", [avatar, chosenDices])


                // 턴 증가
                Situation.turnNum++;

                let nextAction
                if (Situation.turnNum < 6)
                    nextAction = "RollDice";
                else{
                    Situation.phase = "godfavor"
                    nextAction = "RollPhaseEnd";
                }

                
                return {isCallback : true, func: "DicesToWaiting", params: [avatar, chosenDices], nextAction: nextAction }

            }
            else
                return {isCallback : null, nextAction: null }

            break;

        case "godfavor":
            // PrepareGodFavor(godFavorIndex, level, user)
            if(playerInfo != null)
                PrepareGodFavor(playerInfo.godFavorIndex, playerInfo.level, avatar)
            Situation.turnEnd[`${avatar}`] = true
            if (Situation.turnEnd[0] == true && Situation.turnEnd[1] == true) {
                Situation.phase = "resolution"
                return {isCallback : false, nextAction : "GodFavorEnd"};
            }
            else
                return {isCallback : false};


            break;
    }

    return {isCallback : null, nextAction: null }
}


// 굴려야 할 주사위 갯수 반환
function GetRollDicesCnt(avatar) {
    let cnt = 0;
    Situation.player[`${avatar}`].dices.forEach(dice => {
        cnt += (dice.state === "tray" ? 1 : 0)
    })
    return cnt;
}


// avatar : "top" or "bottom"
// dirs : [0,2,1,2,4,2]      (주사위 방향 정보)
function RollDices(avatar, dirs) {
    Situation.player[`${avatar}`].dices.forEach((dice, index) => {
        if (dice.state == "tray") {
            dice.dir = dirI2S[dirs[index]]
            dirs[index] = dice.dir
        }
        else
            dirs[index] = null;
    })
    // console.log(Situation.turnNum)

    let rollDicesCnt = GetRollDicesCnt(avatar)

    let ret
    if (Situation.turnNum >= dicePickLimitTurn || rollDicesCnt == 0)
        ret = true
    else
        ret = false;



    // controller.MessageEnqueue("RollDices", [avatar, dirs, rollDicesCnt, ret])
    return { func: "RollDices", params: [avatar, dirs, rollDicesCnt], isDicePickLimit: ret }



}


/* objInfo = { type : "dice", index : 0, avatar : "top" } */
function SelectObject(objInfo, ) {

    // Situation.phase = "hello"
    // console.log(Situation.phase)
    // console.log(objInfo)
    switch (Situation.phase) {
        case "roll":
            if (objInfo.type == "dice")
                return pickUpDice(objInfo)


            break;

        case "godfavor":
            if (objInfo.type == "godfavor")
                return choiseGodFavor(objInfo)

            break;

        case "resolution":
            if (objInfo.type == "dice"){
            }
            break;

    }

    return null
}




function pickUpDice(objInfo) {
    let currentTurnAvatar = Situation.order[Situation.turnNum % 2]
    // "bottom" or "top"

    // 평범한 주사위 선택
    if (currentTurnAvatar == objInfo.avatar && Situation.turnNum < dicePickLimitTurn) {

        let diceState = Situation.player[`${currentTurnAvatar}`].dices[objInfo.index].state
        // console.log(diceState)
        switch (diceState) {
            case "tray":
                return ChooseDice(currentTurnAvatar, objInfo.index)
                break;

            case "chosen":
                return CancleDice(currentTurnAvatar, objInfo.index)
                break;

            case "waiting":

                break;
        }
    }
    return null
}


function ChooseDice(avatar, index) {
    Situation.player[`${avatar}`].dices[index].state = "chosen";
    // controller.ChooseDice(avatar, index);

    return {callback : "ChooseDice",avatar : avatar, index : index}

}


function CancleDice(avatar, index) {
    Situation.player[`${avatar}`].dices[index].state = "tray"
    // controller.CancleDice(avatar, index)
    return {callback : "CancleDice",avatar : avatar, index : index}

}


function GetToken(dicesWithTokenIndex) {
    Situation.order.forEach((avatar, index) => {
        Situation.player[`${avatar}`].token += dicesWithTokenIndex[index].length
    })

    // controller.GetToken(Situation.order, dicesWithTokenIndex)
    // let promise = controller.MessageEnqueue("GetToken", [Situation.order, dicesWithTokenIndex])

    // return promise
}


function choiseGodFavor() {



}


function ExceptDicesFromBattle(cnt){

}


function GetPlayerOrder(){
    return Situation.order
}


function PushResolutionPhaseCommands(cmds){
    Situation.resolutionCallIndex = 0
    console.log(cmds)
    Situation.resolutionCallbacks = cmds
    // Situation.resolutionCallbacks = JSON.parse(JSON.stringify(cmds))
    console.log(Situation.resolutionCallbacks)
}


function GetNextResolutionPhaseCommand(){
    // console.log("[supervisor] : callbacks = " + Situation.resolutionCallbacks)
    // console.log("[supervisor] : index = " + Situation.resolutionCallIndex)
    // console.log("[supervisor] : wait user = " + Situation.resolutionWaitInputForUser)
    if(Situation.resolutionWaitInputForUser != -1)
        return null

    Situation.resolutionWaitInputForUser = -1

    if(Situation.resolutionCallIndex >= Situation.resolutionCallbacks.length)  
        return null
    else{
        // console.log("length : " + Situation.resolutionCallbacks.length)
        // console.log("index : " + Situation.resolutionCallIndex)
        // console.log(Situation.resolutionCallbacks)
        let ret =  Situation.resolutionCallbacks[Situation.resolutionCallIndex++]
        // console.log(ret)
        return ret;
    }
}


function WaitForPlayerInputAtResolutionPhase(user){
    Situation.resolutionWaitInputForUser = user
    // console.log("[supvervisor] : setting the wait user = " + Situation.resolutionWaitInputForUser + ", " + user)
}


function GetResolutionPhaseInputWaitUser(avatarsInfo, inputInfo, avatar){
    let waituser =  Situation.resolutionWaitInputForUser
    if (waituser == avatar) {
        Situation.resolutionWaitInputForUser = -1
        Situation.extraInput = JSON.parse(JSON.stringify(avatarsInfo))
        Situation.inputInfo = JSON.parse(JSON.stringify(inputInfo))
        // console.log(Situation.extraInput)
    }
    // console.log("get wait user : " + waituser)
    return waituser
}


function GetExtraInputData(){
    return Situation.extraInput
}


function GetInputData(){
    return Situation.inputInfo
}


function PrepareGodFavor(godFavorIndex, level, user){
    // console.log(Situation.godFavorNames)
    if(Situation.turnEnd[user] == false){
        Situation.preparedGodFavor[user].godfavorIndex = godFavorIndex
        Situation.preparedGodFavor[user].level = level
        Situation.preparedGodFavor[user].godfavorNameIndex = Situation.player[user].godFavors[godFavorIndex]
        // console.log(Situation.preparedGodFavor[user])
    }

}


// function ActivateGodFavorPower(godfavorInfo) {
//     let callback = null

//     // let cost = godfavorInfo.cost[godfavorInfo.level]
//     let user = godfavorInfo.user

//     if (Situation.player[`${user}`].token >= godfavorInfo.cost_) {
//         // 토큰 소비
//         Situation.player[`${user}`].token -= godfavorInfo.cost_
//         if (godfavorInfo.level >= 0) {
//             // 능력 사용
//             callback = godfavorInfo.power(Situation)
//             // console.log(ret)
//         }
//     }

//     return callback
// }


function GetPreparedGodFavor(){
    let preparedGodFavor = Situation.preparedGodFavor
    preparedGodFavor = JSON.parse(JSON.stringify(preparedGodFavor))
    return preparedGodFavor
}



function GetCurrentPhase(){
    return Situation.phase
}


// Situation.player[user].dices[indexes[i]] = state
function SetDicesState(user, indexes, state){
    indexes.forEach(index=>{
        Situation.player[user].dices[index].state = state
    })

}

function SetDicesDir(user, indexes, dirs){
    let cnt = dirs.length
    let dices = Situation.player[user].dices
    // console.log(Situation.player[user].dices)
    for(let i = 0; i < dirs.length; i++){
        let dir = dirs[i]
        let index = indexes[i]
        dices[index].dir = dir
    }
    // console.log(Situation.player[user].dices)
}


function GodFavorCardsPick(user, picked_godfavors) {
    if(Situation.turnEnd[user])
        return false

    Situation.turnEnd[user] = true
    Situation.player[user].godFavors[0] = picked_godfavors[0]
    Situation.player[user].godFavors[1] = picked_godfavors[1]
    Situation.player[user].godFavors[2] = picked_godfavors[2]

    if(Situation.turnEnd[0] && Situation.turnEnd[1])
        return true // 카드 선택 작업 완료, 본격적인 게임 시작
    else
        return false;

}


// 배포 금지
function _WARNING_CHANGE_PHASE(phase) {
    Situation.phase = phase;
}


function DEV_ChooseDice(avatar, index, controller) {
    if (Situation.phase == "resolution")
        return;
    ChooseDice(avatar, index, controller);
}


function DEV_CancleDice(avatar, index, controller) {
    if (Situation.phase == "resolution")
        return;

    CancleDice(avatar, index, controller)
}

function DEV_StandbyDice(avatar, index, controller) {
    if (Situation.phase == "resolution")
        return;

}

function DEV_GodPower_Cost() {
    if (Situation.phase == "resolution")
        return;
}


function DEV_GodPower_Nocost() {
    if (Situation.phase == "resolution")
        return;
}



export {
    GetFirstPlayer, InitialGame, RollDices, SelectObject, TakeDamage, BlockAttack, BellPushed, GetRollDicesCnt, ResetRound, StartRound, GetDicesInfo, GetToken, GetPlayerOrder, PrepareGodFavor, GetPreparedGodFavor, GetCurrentPhase, PushResolutionPhaseCommands, GetNextResolutionPhaseCommand, WaitForPlayerInputAtResolutionPhase, GetResolutionPhaseInputWaitUser, GetExtraInputData, SetDicesState, SetDicesDir, RegisterEvent, TriggerEvent, TakeHeal, StealToken, AddToken, RemoveToken, GetInputData, GodFavorCardsPick

    , DEV_ChooseDice, DEV_CancleDice, DEV_StandbyDice, Situation
}