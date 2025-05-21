// import Situation from "../Data/this.js"

const dirI2S = ["right", "left", "top", "bottom", "front", "back"]
const dicePickLimitTurn = 4

function shuffle_(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}



function PushLog_Dice() {
    let parsed_situation = ParsingSituation.call(this)
    // this.logs.push(parsed_situation)

    let feature_keys = ["HP-0", "Token-0", "Weapon-0", "Mark-0", "Card-0", "HP-1", "Token-1", "Weapon-1", "Mark-1", "Card-1", "Round", "First"]

    feature_keys.forEach(key => {
        this.logs[`${key}`].push(parsed_situation[`${key}`])
    })

}


function PushLog_Godfavor(){
    let parsed_situation = ParsingSituation.call(this)

    let feature_keys = ["HP-0", "Token-0", "Weapon-0", "Mark-0", "Card-0", "HP-1", "Token-1", "Weapon-1", "Mark-1", "Card-1", "First"]

    feature_keys.forEach(key => {
        this.logs_godfavor[`${key}`].push(parsed_situation[`${key}`])

    })

}



function ParsingSituation() {

    let feature = {}

    let weapon_key = { axe: 0, arrow: 1, helmet: 2, shield: 3, steal: 4 }

    feature["Round"] = this.turnNum
    feature["First"] = this.order[0]

    this.order.forEach((user_index, user_order)=>{
        let user_info = this.player[user_index]
        
        feature[`HP-${user_order}`] = user_info.health
        feature[`Token-${user_order}`] = user_info.token

        feature[`Weapon-${user_order}`] = new Array(5).fill(0)
        feature[`Mark-${user_order}`] = 0

        let mark_cnt = 0
        for (let dice_index = 0; dice_index < 6; dice_index++) {
            let dice = user_info.dices[dice_index]

            if(dice.state == "waiting"){
                let weapon = dice.weapon
                let weapon_index = weapon_key[`${weapon}`]
    
                feature[`Weapon-${user_order}`][weapon_index]++
    
                if (dice.token)
                    mark_cnt++
            }

        }

        feature[`Card-${user_order}`] = user_info.godFavors
        // console.log(user_info.godFavors)

        feature[`Mark-${user_order}`] = mark_cnt
    })

    return feature

}


function _PrintSituation(){
    console.log("=============================")
    console.log(`round : ${this.round}`)
    console.log(`[[ player 0 ]]`)
    console.log(`HP : ${this.player[0].health} / token : ${this.player[0].token} / frostbite : ${this.player[0].frostbite}`)
    console.log(`[[ player 1 ]]`)
    console.log(`HP : ${this.player[1].health} / token : ${this.player[1].token} / frostbite : ${this.player[1].frostbite}`)

}


function GetFirstPlayer(firstPlayer){
    // let firstPlayer = Math.floor(Math.random() * 10) % 2
    // this.order[1 - firstPlayer] = "top"
    // this.order[firstPlayer] = "bottom"
    this.order[0] = firstPlayer
    this.order[1] = 1 - firstPlayer

    if(this.game_mode == "liberty" || this.game_mode == "draft")
        this.phase = "cardselect"
    else
        this.phase = "roll"


    return firstPlayer
}


function InitialGame() {
    // eventEmitters.on("initial-game", ()=>{console.log("trigger")})
    // eventEmitters.trigger("initial-game")
    // eventEmitters.trigger("game")

    // console.log(this)

    // console.log("[[[ Initial Game ]]]")
    // console.log(this)
    
    if(this.game_mode !== "draft"){
        this.banned_cards = null
    }

    this.eventEmitter.reset()
    
    // console.log(this)

    this.round = 0
    this.phase = "roll"
    this.turnNum = 0
    this.winner = "none"

    this.turnEnd[0] = false
    this.turnEnd[1] = false


    let players = [0, 1]
    players.forEach(player_ => {
        let player = this.player[player_]
        player.health = 15
        player.token = 0
        player.dices.forEach(dice => { dice.state = "tray" })
    })

    // console.log("Initialize the Game")

    // controller.InitialGame();

    if(this.game_mode == "constant"){
        let constant_cards = [8, 11, 14]
        this.player[0].godFavors = [...constant_cards]
        this.player[1].godFavors = [...constant_cards]
    }

}

function TakeHeal(user, value){
    // console.log(`[ ${user}]  - healing ( ${this.player[user].healt} => ${this.player[user].health + value} )`)

    let max_hp = this.player[user].max_hp

    this.player[user].health += value
    this.player[user].health = Math.min(max_hp, this.player[user].health)
}



function TakeDamage(user, damage, weapon) {
    // console.log(`${this.player[user].health} - ${damage}`)
    if ((this.player[user].health - damage) <= 0){
        damage = this.player[user].health
    }

    if(this.player[user].health > 0 && this.winner == "none"){
        this.player[user].health -= damage
        this.eventEmitter.trigger(`${user}-damage-${weapon}`, [damage])
    }

    // if (weapon == "none")
    // console.log(`[[ ${user}-damage-${weapon}]] ${this.player[user].health} , ${damage}`)
    



    if (damage > 0) {
        // console.log(`[ ${user} ] - damaged by ${weapon} ( ${this.player[user].health + damage} => ${this.player[user].health} )`)
        // mongo.InsertLog(this.doc_id, `[ ${user} ] - damaged by ${weapon} ( ${this.player[user].health + damage} => ${this.player[user].health} )`)
        // this.logs_.push(`[ ${user} ] - damaged by ${weapon} ( ${this.player[user].health + damage} => ${this.player[user].health} )`)

        if(weapon != "frostbite")
            this.player[user].acc_dmg += damage

    }

    // console.log(this.player[user].health)
    if (this.player[user].health <= 0 && this.winner == "none") {
        this.winner = 1 - user;
        this.phase = "end";

        // _PrintSituation.call(this)

        // console.log(this.phase)
    }
}


function BlockAttack(user, cnt, weapon) {
    this.eventEmitter.trigger(`${user}-block-${weapon}`, [cnt])
    if (cnt > 0) {
        // console.log(`[ ${user} ] - blocking the ${weapon} **${cnt}**`)
        // mongo.InsertLog(this.doc_id, `[ ${user} ] - blocking the ${weapon} **${cnt}**`)
        this.logs_.push(`[ ${user} ] - blocking the ${weapon} **${cnt}**`)

    }
}

function StealToken(defender, steal_cnt){
    let attacker = 1 - defender

    let attacker_cnt = this.player[`${attacker}`].token
    let defender_cnt = this.player[`${defender}`].token

    
    steal_cnt = Math.min(steal_cnt, defender_cnt)
    steal_cnt = Math.min(steal_cnt, 50 - attacker_cnt)

    this.player[`${defender}`].token -= steal_cnt
    this.player[`${attacker}`].token += steal_cnt

    // let canStealTokensCnt = Math.min(
    //     this.player[`${defender}`].token,
    //     steal_cnt)

    // this.player[`${defender}`].token -= canStealTokensCnt
    // this.player[`${attacker}`].token += canStealTokensCnt
    

}


function AddToken(user, cnt){
    this.player[`${user}`].token += cnt
    this.player[`${user}`].token = Math.min(
        this.player[`${user}`].token, 50
    )

}

function RemoveToken(user, cnt){
    this.player[`${user}`].token -= cnt
    this.player[`${user}`].token = Math.max(
        this.player[`${user}`].token, 0)
}


function BanPick(user, pick, ban){
    let turn_ = this.draft

    // case : 중복 픽
    // if(this.player[0].godFavors.includes(pick) || this.player[1].godFavors.includes(pick)){
    //     // 랜덤선택
    //     RandomPick_Draft.call(this, "pick", user)
    //     // return false
    // }

    // case : 중복 밴
    // if (this.banned_cards.includes(ban)){
    //     // 랜덤선택
    //     RandomPick_Draft.call(this, "ban", user)

    //     // return false
    // }

    let ban_pick_ret = {
        pick : null,
        ban : null
    }

    if (turn_ > 0) {
        let index = turn_ - 1
        index = Math.floor(index / 2)

        let ret = Check_Effectiveness_Card_Pick.call(this, pick)
        // if (!ret)
        //     console.log("[[[[ random PICK ]]]]")

        if (ret) {
            this.player[user].godFavors[index] = pick
            ban_pick_ret.pick = pick
        }
        else {
            ban_pick_ret.pick = Random_BanPick_Draft.call(this, "pick", user)
        }

    }


    if (turn_ < 6) {
        let ret = Check_Effectiveness_Card_Ban.call(this, ban)

        // if (!ret)
        //     console.log("[[[[ random BAN ]]]]")

        if (ret) {
            this.banned_cards[turn_] = ban
            ban_pick_ret.ban = ban
        }
        else {
            ban_pick_ret.ban = Random_BanPick_Draft.call(this, "ban", user)
        }

    }

    // console.log("[[ Ban & Pick ]]")
    // console.log(this.banned_cards)
    // console.log(this.player[0].godFavors)
    // console.log(this.player[1].godFavors)

    return ban_pick_ret

    // return true;
}


function Check_Effectiveness_Card_Pick(pick){
    let picked = [
        ...this.player[0].godFavors.filter(card => card != -1),
        ...this.player[1].godFavors.filter(card => card != -1),
    ]

    let banned = this.banned_cards.filter(card => card != -1)

    if(picked.includes(pick) || banned.includes(pick) || pick < 0 || pick >= 20 || !Number.isInteger(pick))
        return false
    else
        return true
}

function Check_Effectiveness_Card_Ban(ban){
    let picked = [
        ...this.player[0].godFavors.filter(card => card != -1),
        ...this.player[1].godFavors.filter(card => card != -1),
    ]

    let banned = this.banned_cards.filter(card => card != -1)

    if(picked.includes(ban) || banned.includes(ban) || ban < 0 || ban >= 20 || !Number.isInteger(ban))
        return false
    else
        return true
}


function Random_BanPick_Draft(banpick, user){
    let banned = this.banned_cards.filter(card => card != -1)
    let picked = [
        ...this.player[0].godFavors.filter(card => card != -1),
        ...this.player[1].godFavors.filter(card => card != -1),
    ]

    let cards_not = [...banned, ...picked]

    let cards_ = new Array(20)
    for(let i=0; i<20; i++)
        cards_[i] = i
    
    cards_not.forEach(index=>{cards_[index] = null})

    // console.log("[[[ Random pick & ban ]]]")
    // console.log(cards_not)

    let cards = cards_.filter(index => index != null)

    // console.log(cards)
    shuffle_(cards)

    if (banpick == "ban") {
        let ban_index = this.draft
        this.banned_cards[ban_index] = cards[0]
    }
    else {
        let pick_index = Math.floor((this.draft - 1) / 2)
        this.player[user].godFavors[pick_index] = cards[0]
    }
    
    return cards[0]
}




// sector 단위로 상세하게 과정 나눠야함 (Hel 능력이 도끼에만 한정되므로)
// function BattleSimulation(battleResult) {
//     let firstAvatar = this.order[0]
//     let secondAvatar = this.order[1]

//     let canStealTokensCnt = Math.min(
//         this.player[`${secondAvatar}`].token,
//         battleResult[1].stealedToken)

//     this.player[`${secondAvatar}`].health -= battleResult[1].takenDamage
//     this.player[`${secondAvatar}`].token -= canStealTokensCnt
//     this.player[`${firstAvatar}`].token += canStealTokensCnt
//     // Hel 트리거 = 공격자 체력 증가(도끼데미지)

//     if (this.player[`${secondAvatar}`].health <= 0)
//         return firstAvatar

//     canStealTokensCnt = Math.min(
//         this.player[`${firstAvatar}`].token,
//         battleResult[0].stealedToken)

//     this.player[`${firstAvatar}`].health -= battleResult[0].takenDamage
//     this.player[`${firstAvatar}`].token -= canStealTokensCnt
//     this.player[`${secondAvatar}`].token += canStealTokensCnt
//     // Hel 트리거 = 공격자 체력 증가 (도끼데미지)

//     if (this.player[`${firstAvatar}`].health <= 0)
//         return secondAvatar


//     return null
// }



// // param = [[선공], [후공]]
// // dicesCommand = [[ 공방 횟수, 명치 횟수 ],[]]
// // battleResult = [{ takenDamage : <int> , stealedToken : <int> }, {}]
// function DiceBattle(dicesCommand, battleResult, controller) {
//     let whoIsWin = BattleSimulation(battleResult)

//     return controller.MessageEnqueue("DiceBattle", [dicesCommand, this.order])

// }





function GetDicesInfo() {
    let first = this.order[0]
    let second = this.order[1]
    // console.log(...this.player[`${first}`].dices)
    // console.log(...this.player[`${second}`].dices)
    return [[...this.player[`${first}`].dices], [...this.player[`${second}`].dices]]

}


function StartRound() {
    // 체력, 토큰, 주사위, situation 등 모든 정보를 리셋
    // mongo.InsertLog(this.doc_id, `round : ${this.round}`)
    this.logs_.push(`round : ${this.round}`)
    
    let avatar = this.order[0 % 2]
    this.turnEnd[0] = false
    this.turnEnd[1] = false
    this.preparedGodFavor[0].godfavorIndex = -1
    this.preparedGodFavor[0].level = -1
    this.preparedGodFavor[0].godfavorNameIndex = -1
    this.preparedGodFavor[1].godfavorIndex = -1
    this.preparedGodFavor[1].level = -1
    this.preparedGodFavor[1].godfavorNameIndex = -1
    
    this.round++

    return avatar
}


function Frostbite(){
    let target = null
    let cnt = 0

    let userA, userB
    userA = this.player[0]
    userB = this.player[1]

    if(userA.acc_dmg == userB.acc_dmg){
        this.acc_frostbite += 3
    }
    else{
        cnt = this.acc_frostbite
        this.acc_frostbite = 3

        if(userA.acc_dmg > userB.acc_dmg)
            target = 0
        else
            target = 1
        
        Take_Frostbite.call(this, target, cnt)
    }

    return [target, cnt]
}


function Take_Frostbite(player_index, new_cnt){
    let user = this.player[player_index]

    user.frostbite += new_cnt

    console.log(`[ frostbite ], hp : ${user.health}, max_hp : ${user.max_hp}`)

    if(user.max_hp < user.health){
        let diff_hp  = user.health - user.max_hp

        TakeDamage.call(this, player_index, diff_hp, "frostbite")
    }
}




function ResetRound() {
    // console.log(`round : ${this.round}`)
    // _PrintSituation.call(this)
    // console.log(this.phase)
    // if(this.phase != "end")
    this.phase = "roll"

    this.turnNum = 0
    this.orderSwap()

    for (let i = 0; i < 6; i++) {
        this.player[0].dices[i].state = "tray"
        this.player[0].dices[i].power = 1

        this.player[1].dices[i].state = "tray"
        this.player[1].dices[i].power = 1
    }

    for (let i = 0; i < 2; i++){
        this.player[0].token_dices[i].state = "tray"
        this.player[1].token_dices[i].state = "tray"
    }


    this.player.forEach(user=>{
        while(user.dices.length > 6)
            user.dices.pop()

        user.acc_dmg = 0
    })
    
    this.resolutionWaitInputForUser = -1
    this.eventEmitter.reset()

    
    this.inputInfo[0] = null
    this.inputInfo[1] = null

    this.extraInput[0] = null
    this.extraInput[1] = null

    this.double_game_proposed[0] = false
    this.double_game_proposed[1] = false

    // this.resolutionCallbacks = null

    // console.log(Situation)
    // console.log(this.phase)

    return WhoIsWinner.call(this)
}


function WhoIsWinner(){
    // console.log(this.winner)
    if(this.winner != "none"){
        this.logs_.push(`winner : ${this.winner}`)
        

    }
    return this.winner
}



function RegisterEvent(trigger, callback){
    this.eventEmitter.on(`${trigger}`, (param) => { callback(param) })
}

function TriggerEvent(trigger, value){
    // console.log(trigger)
    // console.log(value)
    this.eventEmitter.trigger(`${trigger}`, value)
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
    switch (this.phase) {
        case "roll":
            let prevAvatar
            // if (isLastTurn) {
            //     prevAvatar = this.order[(this.turnNum + 1) % 2]
            //     avatar = prevAvatar
            // }
            // else

                prevAvatar = this.order[this.turnNum % 2]

            // console.log(`${avatar}, ${prevAvatar}`)
            if (avatar == prevAvatar) {
                let prevDices = this.player[`${prevAvatar}`].dices
                let dicesStateFromClient
                if(avatarsInfo != null)
                    dicesStateFromClient = avatarsInfo[prevAvatar].dicesState
                else{
                    // console.log("what the...?")
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

                    if ((this.turnNum < dicePickLimitTurn && dice.state === "tray" && dicesStateFromClient[index] === "chosen") ||
                        (this.turnNum >= dicePickLimitTurn && dice.state === "tray")
                    ) {
                        // 1. 기회 남음 : 유저가 선택한 주사위를 waiting으로
                        // 2. 기회 없음 : 나머지 주사위를 모두 다 waiting으로
                        dice.state = "waiting"
                        chosenDices.push(index)
                    }
                })


                let chosenDices_token = []
                if (this.game_style === "modern") {

                    let prevDices_token = this.player[`${prevAvatar}`].token_dices

                    let dicesStateFromClient
                    if (avatarsInfo != null)
                        dicesStateFromClient = avatarsInfo[prevAvatar].dicesState_token
                    else {
                        // console.log("what the...?")
                        prevDices_token.forEach((dice, index) => {
                            if (dice.state === "waiting")
                                dicesStateFromClient = "waiting"
                            else
                                dicesStateFromClient = "chosen"
                        })
                    }

                    prevDices_token.forEach((dice, index) => {

                        if ((this.turnNum < dicePickLimitTurn && dice.state === "tray" && dicesStateFromClient[index] === "chosen") ||
                            (this.turnNum >= dicePickLimitTurn && dice.state === "tray")
                        ) {
                            // 1. 주사위 턴이 남아있을경우 선택된 주사위를 waiting으로
                            // 2. 주사위 턴이 더이상 없을 경우 남은 주사위를 굴린 후 곧바로 waiting으로
                            dice.state = "waiting"
                            chosenDices_token.push(index)
                        }
                    })


                }

                // controller.MessageEnqueue("DicesToWaiting", [avatar, chosenDices])


                // PushLog_Dice.call(this)

                // 턴 증가
                this.turnNum++;

                let nextAction
                if (this.turnNum < 6)
                    nextAction = "RollDice";
                else{
                    this.phase = "godfavor"
                    nextAction = "RollPhaseEnd";
                }

                
                return {
                    isCallback : true,
                    func: "DicesToWaiting",
                    params: [avatar, chosenDices, chosenDices_token],
                    nextAction: nextAction,
                    avatar_stats : ParsingSituation.call(this)
                }

            }
            else
                return {isCallback : null, nextAction: null }

            break;

        case "godfavor":
            // PrepareGodFavor(godFavorIndex, level, user)
            let need_extra_input = false
            if (playerInfo != null)
                need_extra_input = PrepareGodFavor.call(this, playerInfo.godFavorIndex, playerInfo.level, avatar)

            this.turnEnd[`${avatar}`] = true

            if (need_extra_input) {
                // 추가 입력 정보를 situation에 저장한다
                // console.log(`[ need extra input] true`)

                PrepareExtraInput.call(this, avatar, playerInfo.extraInput, avatarsInfo, playerInfo)
            }
            else {
                // console.log(`[ need extra input] false`)
            }



            if (this.turnEnd[0] == true && this.turnEnd[1] == true) {
                this.double_cube["double_index"] = this.double_cube["proposed"]
                this.phase = "resolution"
                return { isCallback: false, nextAction : "GodFavorEnd"};
            }
            else
                return {isCallback : false};


            break;
    }

    return {isCallback : null, nextAction: null }
}


// 굴려야 할 주사위 갯수 반환
function GetRollDicesCnt(avatar) {
    // console.log(this)
    let cnt = 0;
    this.player[`${avatar}`].dices.forEach(dice => {
        cnt += (dice.state === "tray" ? 1 : 0)
    })
    return cnt;
}

function GetRollDicesCnt_Token(avatar){
    let cnt = 0;
    this.player[`${avatar}`].token_dices.forEach(dice => {
        cnt += (dice.state === "tray" ? 1 : 0)
    })
    return cnt;
}

// function PushDicesLog(){
//     let str = "~~[ "
//     let dices = this.player[0].dices
//     dices.forEach(dice=>{
//         str += " " + dice.weapon + " "
//     })
    
//     str += " ] / [ "

//     dices = this.player[1].dices
//     dices.forEach(dice=>{
//         str += " " + dice.weapon + " "
//     })

//     str += " ] ~~"

//     mongo.InsertLog(this.doc_id, str)
//     // console.log(str)
// }


// avatar : "top" or "bottom"
// dirs : [0,2,1,2,4,2]      (주사위 방향 정보)
function RollDices(avatar, dirs) {
    this.player[`${avatar}`].dices.forEach((dice, index) => {
        if (dice.state == "tray") {
            dice.dir = dirI2S[dirs[index]]
            dirs[index] = dice.dir
        }
        else
            dirs[index] = null;
    })
    // console.log(this.turnNum)

    let rollDicesCnt = GetRollDicesCnt.call(this, avatar)
    let rollDicesCnt_token = GetRollDicesCnt_Token.call(this, avatar)

    let ret

    if (this.game_style === "classic") {
        if (this.turnNum >= dicePickLimitTurn || rollDicesCnt == 0)
            ret = true
        else
            ret = false;
    }
    else {
        if (this.turnNum >= dicePickLimitTurn || (rollDicesCnt == 0 && rollDicesCnt_token == 0))
            ret = true
        else
            ret = false;

    }

    // PushDicesLog.call(this)
    let avatar_stats = ParsingSituation.call(this)


    let dirs_token = []
    if (this.game_style === "modern") {
        dirs_token = RollDices_Token.call(this, avatar)
    }
    else {
        dirs_token = [null, null]
    }


    // controller.MessageEnqueue("RollDices", [avatar, dirs, rollDicesCnt, ret])
    return { func: "RollDices", params: [avatar, dirs, rollDicesCnt, dirs_token, avatar_stats], isDicePickLimit: ret }

}


function RollDices_Token(avatar){
    let dirs = [
        Math.min(Math.floor(Math.random() * 6), 5),
        Math.min(Math.floor(Math.random() * 6), 5)
    ]

    this.player[`${avatar}`].token_dices.forEach((dice, index) => {
        if (dice.state == "tray") {
            dice.dir = dirI2S[dirs[index]]
            dirs[index] = dice.dir
        }
        else
            dirs[index] = null;
    })

    return dirs
}




/* objInfo = { type : "dice", index : 0, avatar : "top" } */
// function SelectObject(objInfo, ) {

//     // this.phase = "hello"
//     // console.log(this.phase)
//     // console.log(objInfo)
//     switch (this.phase) {
//         case "roll":
//             if (objInfo.type == "dice")
//                 return pickUpDice.call(this, objInfo)


//             break;

//         case "godfavor":
//             if (objInfo.type == "godfavor")
//                 return choiseGodFavor.call(this, objInfo)

//             break;

//         case "resolution":
//             if (objInfo.type == "dice"){
//             }
//             break;

//     }

//     return null
// }




function pickUpDice(objInfo) {
    let currentTurnAvatar = this.order[this.turnNum % 2]
    // "bottom" or "top"

    // 평범한 주사위 선택
    if (currentTurnAvatar == objInfo.avatar && this.turnNum < dicePickLimitTurn) {

        let diceState = this.player[`${currentTurnAvatar}`].dices[objInfo.index].state
        // console.log(diceState)
        switch (diceState) {
            case "tray":
                return ChooseDice.call(this, currentTurnAvatar, objInfo.index)
                break;

            case "chosen":
                return CancleDice.call(this, currentTurnAvatar, objInfo.index)
                break;

            case "waiting":

                break;
        }
    }
    return null
}


function ChooseDice(avatar, index) {
    this.player[`${avatar}`].dices[index].state = "chosen";
    // controller.ChooseDice(avatar, index);

    return {callback : "ChooseDice",avatar : avatar, index : index}

}


function CancleDice(avatar, index) {
    this.player[`${avatar}`].dices[index].state = "tray"
    // controller.CancleDice(avatar, index)
    return {callback : "CancleDice",avatar : avatar, index : index}

}


function GetToken(dicesWithTokenIndex) {
    this.order.forEach((avatar, index) => {
        let token_cnt = dicesWithTokenIndex[index].length
        AddToken.call(this, avatar, token_cnt)
    })

    // controller.GetToken(this.order, dicesWithTokenIndex)
    // let promise = controller.MessageEnqueue("GetToken", [this.order, dicesWithTokenIndex])

    // return promise
}


function GetToken_Modern(){
    this.order.forEach((order_, index) => {
        let avatar = this.player[order_]
        let token_cnt = avatar.token_dices[0].cnt + avatar.token_dices[1].cnt

        AddToken.call(this, order_, token_cnt)
    })

    // let first = this.order[0]
    // let second = this.order[1]

    let first = 0
    let second = 1

    return [
        [this.player[first].token_dices[0].cnt, this.player[first].token_dices[1].cnt],
        [this.player[second].token_dices[0].cnt, this.player[second].token_dices[1].cnt]
    ]

}



// function choiseGodFavor() {



// }


function ExceptDicesFromBattle(cnt){

}


function GetPlayerOrder(){
    return this.order
}


function PushResolutionPhaseCommands(cmds){
    this.resolutionCallIndex = 0
    // console.log(cmds)
    this.resolutionCallbacks = cmds
    // this.resolutionCallbacks = JSON.parse(JSON.stringify(cmds))
    // console.log(this.resolutionCallbacks)
}


function GetNextResolutionPhaseCommand(){
    // console.log("[supervisor] : callbacks = " + this.resolutionCallbacks)
    // console.log("[supervisor] : index = " + this.resolutionCallIndex)
    // console.log("[supervisor] : wait user = " + this.resolutionWaitInputForUser)
    if(this.resolutionWaitInputForUser != -1)
        return null

    this.resolutionWaitInputForUser = -1

    if(this.resolutionCallIndex >= this.resolutionCallbacks.length)  
        return null
    else{
        // console.log("length : " + this.resolutionCallbacks.length)
        // console.log("index : " + this.resolutionCallIndex)
        // console.log(this.resolutionCallbacks)
        let ret =  this.resolutionCallbacks[this.resolutionCallIndex++]
        // console.log(ret)
        return ret;
    }
}


function WaitForPlayerInputAtResolutionPhase(user){
    this.resolutionWaitInputForUser = user
    // console.log("[supvervisor] : setting the wait user = " + this.resolutionWaitInputForUser + ", " + user)
}


function GetResolutionPhaseInputWaitUser(avatarsInfo, inputInfo, avatar){
    let waituser =  this.resolutionWaitInputForUser
    if (waituser == avatar) {
        this.resolutionWaitInputForUser = -1
        this.extraInput = JSON.parse(JSON.stringify(inputInfo))
        this.inputInfo = JSON.parse(JSON.stringify(avatarsInfo))
        // console.log(this.extraInput)
    }
    // console.log("get wait user : " + waituser)
    return waituser
}


function GetExtraInputData(user){
    return this.extraInput[user]
}


function GetInputData(user){
    return this.inputInfo[user]
}


function PrepareGodFavor(godFavorIndex, level, user){
    // console.log(this.godFavorNames)
    if(this.turnEnd[user] == false){
        this.preparedGodFavor[user].godfavorIndex = godFavorIndex
        this.preparedGodFavor[user].level = level
        this.preparedGodFavor[user].godfavorNameIndex = this.player[user].godFavors[godFavorIndex]
        // console.log(this.preparedGodFavor[user])
    }

    let godFavorNameIndex = this.preparedGodFavor[user].godfavorNameIndex
    
    let godFavor_name = global.godFavorIndexDict[godFavorNameIndex]
    let godFavor_stat = global.GodFavorStats[`${godFavor_name}`]

    return godFavor_stat.extra_input
    
}



/*
[Arguments] {
  '0': '1',
  '1': { type: 'healthstone', index: 4, avatar: 1, isBottom: true },
  '2': [
    { health: 15, token: 30, dicesState: [Array] },
    { health: 15, token: 30, dicesState: [Array] }
  ]
}
*/

function PrepareExtraInput(avatar, inputInfo, avatarsInfo, playerInfo) {
    // console.log(arguments)
    // this.resolutionWaitInputForUser = -1
    this.extraInput[avatar] = JSON.parse(JSON.stringify(avatarsInfo))
    try{
        this.inputInfo[avatar] = JSON.parse(JSON.stringify(inputInfo))

    }
    catch{
        console.log("Catch!")
        console.log(playerInfo)
        console.log(inputInfo)
        console.log(this.preparedGodFavor[avatar].godfavorNameIndex)
        console.log("===========================")
        // console.log(inputInfo)
    }
    // console.log(this.extraInput)

    // console.log("get wait user : " + waituser)
    // return waituser
}


// function ActivateGodFavorPower(godfavorInfo) {
//     let callback = null

//     // let cost = godfavorInfo.cost[godfavorInfo.level]
//     let user = godfavorInfo.user

//     if (this.player[`${user}`].token >= godfavorInfo.cost_) {
//         // 토큰 소비
//         this.player[`${user}`].token -= godfavorInfo.cost_
//         if (godfavorInfo.level >= 0) {
//             // 능력 사용
//             callback = godfavorInfo.power(Situation)
//             // console.log(ret)
//         }
//     }

//     return callback
// }


function GetPreparedGodFavor(){
    let preparedGodFavor = this.preparedGodFavor
    preparedGodFavor = JSON.parse(JSON.stringify(preparedGodFavor))
    return preparedGodFavor
}



function GetCurrentPhase(){
    return this.phase
}


// this.player[user].dices[indexes[i]] = state
function SetDicesState(user, indexes, state){
    indexes.forEach(index=>{
        this.player[user].dices[index].state = state
    })

}

function SetDicesDir(user, indexes, dirs){
    let cnt = dirs.length
    let dices = this.player[user].dices
    // console.log(this.player[user].dices)
    for(let i = 0; i < dirs.length; i++){
        let dir = dirs[i]
        let index = indexes[i]
        dices[index].dir = dir
    }
    // console.log(this.player[user].dices)
}


function GodFavorCardsPick(user, picked_godfavors) {
    if (this.turnEnd[user])
        return false

    this.turnEnd[user] = true

    let effectiveness = Check_Effectiveness_Card_Liberty.call(this, picked_godfavors)
    // console.log("[[ EFFECT!! ]]")
    // console.log(effectiveness)

    if (effectiveness == false) {
        // console.log("[[ False ]]")
        picked_godfavors = [8, 11, 14]
    }

    picked_godfavors.forEach((card, index) => {
        this.player[user].godFavors[index] = card
    })


    if (this.turnEnd[0] && this.turnEnd[1])
        return true // 카드 선택 작업 완료, 본격적인 게임 시작
    else
        return false;

}


function Check_Effectiveness_Card_Liberty(cards) {
    // console.log(cards)

    if(this.timeover)
        return false

    // 1. 길이 확인
    if (cards.length != 3)
        return false

    // 2. 중복 확인
    if ((cards[0] == cards[1]) || (cards[1] == cards[2]) || (cards[0] == cards[2]))
        return false

    // 3. 숫자 유효성 확인(정수, 0 ~ 19)

    for (let i = 0; i < 3; i++) {
        let index = cards[i]
        if (!Number.isInteger(index) || (index < 0) || (index > 19))
            return false
    }


    return true
}


function DoubleGame(avatar) {
    if(this.double_game_proposed[avatar])
        return null

        
    if (this.double_cube.proposed > 3)
        return null


    let cPhase = GetCurrentPhase.call(this)
    // console.log("[ Current Phase ]",cPhase)

    switch (cPhase) {
        case "roll":
            let current_avatar = this.order[(this.turnNum) % 2]
            // console.log("[ Current Avatar ]", current_avatar)
            // console.log(" [ Argument Avatar ] ", avatar)
            if (current_avatar != avatar)
                return null


            if (this.double_cube.owner == null) {
                this.double_cube.proposed++
                this.double_cube.owner = 1 - avatar
            }
            else if (this.double_cube.owner == avatar) {
                this.double_cube.proposed++
                this.double_cube.owner = 1 - avatar
            }
            else
                return null
            break;

        // case "godfavor":

        //     if (this.double_cube.owner == avatar) {
        //         this.double_cube.proposed++
        //         this.double_cube.owner = 1 - avatar
        //     }
        //     else
        //         return null
        //     break;

        default:
            return null
            break;
    }

    // this.double_cube.proposed++
    this.double_game_proposed[avatar] = true
    return [this.double_cube.owner, this.double_cube.proposed]
}



// 배포 금지
function _WARNING_CHANGE_PHASE(phase) {
    this.phase = phase;
}


function DEV_ChooseDice(avatar, index, controller) {
    if (this.phase == "resolution")
        return;
    ChooseDice(avatar, index, controller);
}


function DEV_CancleDice(avatar, index, controller) {
    if (this.phase == "resolution")
        return;

    CancleDice(avatar, index, controller)
}

function DEV_StandbyDice(avatar, index, controller) {
    if (this.phase == "resolution")
        return;

}

function DEV_GodPower_Cost() {
    if (this.phase == "resolution")
        return;
}


function DEV_GodPower_Nocost() {
    if (this.phase == "resolution")
        return;
}



export {
    GetFirstPlayer, InitialGame, RollDices, TakeDamage, BlockAttack, BellPushed, GetRollDicesCnt, ResetRound, StartRound, GetDicesInfo, GetToken, GetToken_Modern, GetPlayerOrder, GetPreparedGodFavor, GetCurrentPhase, PushResolutionPhaseCommands, GetNextResolutionPhaseCommand, WaitForPlayerInputAtResolutionPhase, GetResolutionPhaseInputWaitUser, GetExtraInputData, SetDicesState, SetDicesDir, RegisterEvent, TriggerEvent, TakeHeal, StealToken, AddToken, RemoveToken, GetInputData, GodFavorCardsPick, BanPick, DoubleGame, Frostbite

    , DEV_ChooseDice, DEV_CancleDice, DEV_StandbyDice
}