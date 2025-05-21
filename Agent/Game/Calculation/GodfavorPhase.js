import godFavorStats from "../Data/godFavorStats.js";
import diceFaceInfo from "../Data/diceFaceInfo.js"

global.GodFavorStats = godFavorStats
global.godFavorIndexDict = Object.keys(global.GodFavorStats)


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const index2dir = ["right", "left", "top", "bottom", "front","back"]

// [[before],[after]]
function GetGodFavorPowerCallback(godFavorsInfo, order, superVisor, situation){

    let godFavorsStat = []
    // console.log(godFavorsInfo)


    godFavorsInfo.forEach((godFavorInfo, user) => {
        // console.log(godFavorInfo)
        if (godFavorInfo.godfavorIndex != -1){
            // godFavorsStat.push(godFavorInfo)

            let newStat = godFavorInfo
            let _name = godFavorNames[godFavorsInfo[user].godfavorNameIndex]

            let _tmpstat = godFavorStats[`${_name}`]

            Object.keys(_tmpstat).forEach(key=>{
                newStat[`${key}`] = _tmpstat[`${key}`]
            })

            newStat.user = user
            newStat.opponent = 1 - newStat.user
            newStat.order = order[user]

            newStat.cost_ = newStat.cost[newStat.level]

            newStat.power = function(Situation, game) {
                let datas = {
                    userIndex : this.user,
                    opponentIndex : 1 - this.user,
                    player : Situation.player[this.user],
                    opponent : Situation.player[1 - this.user],
                    level : this.level,
                    cost: this.cost[this.level],
                    effectValue: this.effectValue[this.level]
                }
                this.token_ = Situation.player[this.user].token

                if (this.token_ >= this.cost_) {
                    // this.token_ = situation.player[this.user].token
                    Situation.player[this.user].token -= this.cost_
                    // Situation.player[this.user].used_token += this.cost_

                    superVisor.TriggerEvent.call(Situation, `${this.user}-use-token`, [this.cost_])
                    // console.log(`after : ${this.token_} & ${this.cost_}}`)

                    if (this.level >= 0) {
                        godFavorsPower[`${godFavorNames[godFavorsInfo[user].godfavorNameIndex]}`].call(this, Situation, datas, superVisor, game)
                        
                    }
                }
            }
            
            godFavorsStat.push(newStat)


            // godFavorsStat.push(godfavors_stat[`${godFavorNames[godFavorsInfo[user].godfavorNameIndex]}`])
        }
    })


    godFavorsStat.forEach((newStat, user) => {
        let _name = godFavorNames[godFavorsInfo[user].godfavorNameIndex]
        let token_ = situation.player[user].token
        
        if (newStat.level >= 0 && (newStat.cost_ <= token_)) {

            if (godFavorsStat.length >= 2) {
                if (preActivation[`${_name}`]) {
                    let me = user
                    let you = 1 - me

                    preActivation[`${_name}`](godFavorsStat[me], godFavorsStat[you])
                }
            }
        }
    })

    godFavorsStat.forEach((newStat, user) => {
        let _name = godFavorNames[godFavorsStat[user].godfavorNameIndex]
        if (newStat.level >= 0) {

            // (newStat.cost_ <= situation.player[newStat.user].token)
            
            if (postProcess[`${_name}`])
                newStat.postProcess = function (LogicKit, controller) {
                    if (newStat.cost_ <= newStat.token_)
                        return postProcess[`${_name}`].call(newStat, LogicKit, controller, situation)
                }

            if (extraInput[`${_name}`]) {
                newStat.canExecution = function () {
                    if (newStat.cost_ <= newStat.token_)
                        return newStat.user
                    else
                        return null;
                }

                newStat.extraInput = function (LogicKit, game) {
                    if (newStat.cost_ <= newStat.token_)
                        return extraInput[`${_name}`].call(newStat, LogicKit, game, situation)
                }

            }

            if (registerTrigger[`${_name}`]) {
                newStat.registerTrigger = function (superVisor) {
                    if (newStat.cost_ <= newStat.token_) {
                        registerTrigger[`${_name}`].call(newStat, superVisor, situation)
                    }
                }
            }
        }
    })


    godFavorsStat.sort((a, b) => {
        if (a.afterDecision != b.afterDecision)
            return a.afterDecision ? 1 : -1
        else if (a.priority != b.priority)
            return a.priority - b.priority
        else
            return a.order - b.order
    })


    let ret = [[],[]]
    godFavorsStat.forEach(godFavorStat=>{
        ret[godFavorStat.afterDecision ? 1 : 0].push(godFavorStat)
    })

    return ret
}



const preActivation = {
    "Thrymr": function (myInfo, opponentInfo) {
        let levelDecreased = myInfo.effectValue[myInfo.level]
        opponentInfo.level -= levelDecreased
        // console.log(`[levelDecreased] = ${levelDecreased}`)
        // console.log(`[opponent level] = ${opponentInfo.level}`)
    },
}



const registerTrigger = {
    "Heimdall":function(superVisor, situation){
        let healCoefficient = this.effectValue[this.level]

        superVisor.RegisterEvent.call(situation,`${this.user}-block-axe`, (cnt)=>{
            superVisor.TakeHeal.call(situation,this.user, cnt * healCoefficient)
        })        

        superVisor.RegisterEvent.call(situation,`${this.user}-block-arrow`, (cnt)=>{
            superVisor.TakeHeal.call(situation,this.user, cnt * healCoefficient)
        })
    },
    "Hel" : function(superVisor, situation){
        let healCoefficient = this.effectValue[this.level]
        let opponent = 1 - this.user

        superVisor.RegisterEvent.call(situation,`${opponent}-damage-axe`, (damage)=>{
            superVisor.TakeHeal.call(situation,this.user, damage * healCoefficient)
        })   

    },
    "Mimir" : function(superVisor, situation){
        let tokenCoefficient = this.effectValue[this.level]

        superVisor.RegisterEvent.call(situation,`${this.user}-damage-axe`, (damage)=>{
            superVisor.AddToken.call(situation,this.user, damage * tokenCoefficient)
        })        

        superVisor.RegisterEvent.call(situation,`${this.user}-damage-arrow`, (damage)=>{
            superVisor.AddToken.call(situation,this.user, damage * tokenCoefficient)
        })

        superVisor.RegisterEvent.call(situation,`${this.user}-damage-godfavor`, (damage)=>{
            superVisor.AddToken.call(situation,this.user, damage * tokenCoefficient)
        })

    },
    "Ullr": function (superVisor, situation) {
        let byPassArrowCnt = this.effectValue[this.level]

        superVisor.RegisterEvent.call(situation,`${this.user}_arrow_battle_simulation`, (commanders) => {
            // attackerCmd[0] , defenderCmd[0] : exchange
            // attackerCmd[1] : main body attack

            let attackerCmd = commanders[0]
            let defenderCmd = commanders[1]


            let changeValue = Math.min(attackerCmd[0], byPassArrowCnt)
            attackerCmd[0] -= changeValue
            attackerCmd[1] += changeValue

            defenderCmd[0] -= changeValue
            defenderCmd[1] += changeValue

        })

    }
    ,
    "Var": function (superVisor, situation) {
        let opponent = 1 - this.user
        let healCoefficient = this.effectValue[this.level]
        superVisor.RegisterEvent.call(situation, `${opponent}-use-token`, (usedToken) => {
            superVisor.TakeHeal.call(situation, this.user, usedToken * healCoefficient)
        })
    }
}



const extraInput = {
    // "Odin" : function(){},
    "Frigg" : function(LogicKit, game, situation) {
        let user = this.user
        let opponent = 1 - this.user

        let extraInputData = LogicKit.GetExtraInputData(situation, user)
        // console.log(extraInputData)

        let rerollDiceCnt = this.effectValue[this.level]

        // user
        let rerollDicesIndex_User = []
        let dices = situation.player[user].dices
        extraInputData[user].dicesState.forEach((state, index)=>{
            if(state === "levitation" && dices[index].state !== "ban"){
                if(rerollDiceCnt > 0){
                    rerollDicesIndex_User.push(index)
                    rerollDiceCnt--;
                }
            }
        })


        let rerollDicesIndex_Opponent = []
        dices = situation.player[opponent].dices
        extraInputData[opponent].dicesState.forEach((state, index)=>{
            if(state === "levitation" && dices[index].state !== "ban"){
                if(rerollDiceCnt > 0){
                    rerollDicesIndex_Opponent.push(index)
                    rerollDiceCnt--;
                }
            }
        })

        
        let userRerollCnt = rerollDicesIndex_User.length
        let opponentRerollCnt = rerollDicesIndex_Opponent.length
        // console.log(`${userRerollCnt} , ${opponentRerollCnt}`)


        let newdirs = []
        rerollDicesIndex_User.forEach(()=>{
            let newdir =  clamp(Math.floor(Math.random() * 6), 0, 5)
            let dir = index2dir[newdir]
            newdirs.push(dir)
        })
        LogicKit.SetDicesDir(situation, user, rerollDicesIndex_User, newdirs)

        let cnt = extraInputData[user].dicesState.length
        let diceRollDirs = Array(cnt).fill(null)
        newdirs.forEach((dir, index)=>{
            let i = rerollDicesIndex_User[index]
            diceRollDirs[i] = dir
        })
        // console.log(diceRollDirs)

        game.controller.MessageEnqueue("GodFavorExtraAction", [{ avatar: "bottom", dices_index: rerollDicesIndex_User }])
        game.controller.MessageEnqueue("SpecialRollDices", [user, diceRollDirs, newdirs.length])
        
        newdirs=[]
        rerollDicesIndex_Opponent.forEach(()=>{
            let newdir = clamp(Math.floor(Math.random() * 6), 0, 5)
            let dir = index2dir[newdir]
            newdirs.push(dir)
        })
        LogicKit.SetDicesDir(situation, opponent, rerollDicesIndex_Opponent, newdirs)

        cnt = extraInputData[opponent].dicesState.length
        diceRollDirs = Array(cnt).fill(null)
        newdirs.forEach((dir, index)=>{
            let i = rerollDicesIndex_Opponent[index]
            diceRollDirs[i] = dir
        })
        // console.log(diceRollDirs)
        game.controller.MessageEnqueue("GodFavorExtraAction", [{ avatar: "top", dices_index: rerollDicesIndex_Opponent }])
        game.controller.MessageEnqueue("SpecialRollDices", [opponent, diceRollDirs, newdirs.length])


        let diceFormation, playerOrder
        [diceFormation, playerOrder, ] = LogicKit.GetDiceFormation(situation)
        game.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])
        

    },
    "Loki" : function(LogicKit, game, situation) {
        // game.controller.MessageEnqueue("GodFavorExtraAction", [])
        let user = this.user
        let opponent = 1 - this.user

        // resolution phase의 추가 입력 처리 로직
        let extraInputData = LogicKit.GetExtraInputData(situation, user)

        let bannedDiceCnt = this.effectValue[this.level]
        let bannedDicesIndex = []

        extraInputData[opponent].dicesState.forEach((state, index)=>{
            if(state === "levitation"){
                if(bannedDiceCnt > 0){
                    bannedDicesIndex.push(index)
                    bannedDiceCnt--;
                }
            }
        })

        game.controller.MessageEnqueue("GodFavorExtraAction", [{ avatar: opponent, dices_index: bannedDicesIndex }])
        // game.controller.MessageEnqueue("GodFavorExtraAction", [{ damage: damage, coefficient: tokenCoefficient }])


        game.controller.MessageEnqueue("BanDices", [opponent, [...bannedDicesIndex]])

        LogicKit.SetDicesState(situation, opponent, bannedDicesIndex, "ban")

        let diceFormation, playerOrder
        [diceFormation, playerOrder, ] = LogicKit.GetDiceFormation(situation)
        // console.log(diceFormation)

        // 재정렬
        game.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])

    },
    "Odin": function(LogicKit, game, situation){
        let user = this.user
        let opponent = 1 - this.user

        let extraInputData = LogicKit.GetExtraInputData(situation, user)
        let inputInfo = LogicKit.GetInputData(situation, user)
    
        if(inputInfo){
            // console.log("[[[ Odin - extraInputData ]]]")
            // console.log(extraInputData)

            // console.log("\n\n")
            // console.log("[[[ Odin - inputInfo ]]]")
            // console.log(inputInfo)
            // let healthStoneIndex = inputInfo.index
            // let health = situation.player[user].health
            let damage = inputInfo.index
    
            let tokenCoefficient = this.effectValue[this.level]
    
            LogicKit.TakeDamage(situation, user, damage, "none")
            LogicKit.AddToken(situation, user, damage * tokenCoefficient)
    

            game.controller.MessageEnqueue("GodFavorExtraAction", [{ damage: damage, coefficient: tokenCoefficient }])
        }
        else {
            game.controller.MessageEnqueue("GodFavorExtraAction", [{ damage: 0, coefficient: 0 }])
        }
    },
    "Tyr": function (LogicKit, game, situation) {
        let user = this.user
        let opponent = 1 - this.user

        let extraInputData = LogicKit.GetExtraInputData(situation, user)
        let inputInfo = LogicKit.GetInputData(situation, user)

        // console.log(extraInputData)

        if (inputInfo) {
            // let healthStoneIndex = inputInfo.index
            let avatar = inputInfo.avatar
            let opponent = 1 - avatar
            // let health = situation.player[avatar].health
            // let damage = health - (healthStoneIndex)
            let damage = inputInfo.index
            let tokenCoefficient = this.effectValue[this.level]

            LogicKit.TakeDamage(situation, avatar, damage, "none")
            LogicKit.RemoveToken(situation, opponent, damage * tokenCoefficient)


            game.controller.MessageEnqueue("GodFavorExtraAction", [{ damage: damage, coefficient: tokenCoefficient }])
        }
        else {
            game.controller.MessageEnqueue("GodFavorExtraAction", [{ damage: 0, coefficient: 0 }])
        }
    }


}


const postProcess = {
    "Freyja": function (LogicKit, controller, situation) {
        // 새로운 주사위 추가, formation 재정렬 명령 전송
        // Game.ResolutionPhaseBegin 의 전송작업 맨 앞에서 실행되어야 함
        let diceFormation, playerOrder
        [diceFormation, playerOrder,] = LogicKit.GetDiceFormation(situation)
        let newDiceCnt = this.effectValue[this.level]

        // console.log(this)

        // 추가된 주사위 굴리기
        controller.MessageEnqueue("SpecialRollDices", [this.user, this.nIndexes, newDiceCnt])

        // 재정렬
        controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])


    },
    "Frigg": function () { },
    // "Vidar" : function(LogicKit, controller, situation){
    //     // this.bannedDicesIndex
    //     let opponent = 1 - this.user
    //     controller.MessageEnqueue("BanDices", [opponent, [...this.bannedDicesIndex]])

        
    //     let diceFormation, playerOrder
    //     [diceFormation, playerOrder,] = LogicKit.GetDiceFormation(situation)
    //     controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])

    // }
}





// superVisor.AddToken(this.user, damage * tokenCoefficient)


const godFavorsPower = {
    "Baldr": function (situation, data) {
        let addedArmor = data.effectValue

        this.dices_index = []
        this.marks_cnt = []
        this.weapon_types = []

        // data.player.token -= data.cost
        data.player.dices.forEach((dice, index) => {
            if ((dice.weapon == "helmet" || dice.weapon == "shield") && dice.state != "ban"){
                dice.power += addedArmor

                this.dices_index.push(index)
                this.marks_cnt.push(dice.power)
                this.weapon_types.push(dice.weapon)
            }
        })

    },
    "Bragi": function (situation, data, superVisor){
        let stealCnt = 0
        let tokenCoefficient = data.effectValue

        data.player.dices.forEach(dice => {
            if (dice.weapon == "steal" && dice.state != "ban")
                stealCnt++
        })

        superVisor.AddToken.call(situation, this.user, stealCnt * tokenCoefficient)
    },
    "Brunhild": function(situation, data){
        let multipliyValue = data.effectValue

        // data.player.token -= data.cost

        let cnt = 0

        data.player.dices.forEach(dice=>{
            if(dice.weapon == "axe"  && dice.state != "ban")
                cnt++
        })
        let multipliedCnt = Math.ceil(cnt * multipliyValue)
        let quotient = Math.floor(multipliedCnt / cnt)
        let remainder = multipliedCnt % cnt

        data.player.dices.forEach(dice => {
            if (dice.weapon == "axe"  && dice.state != "ban")
                dice.power += (quotient - 1)
                // dice.power = quotient
        })

        data.player.dices.forEach(dice => {
            if (dice.weapon == "axe" && remainder > 0  && dice.state != "ban"){
                dice.power++
                remainder--
            }
        })


    },
    "Freyja": function( situation, data, superVisor, game) {
        let newDiceCnt = data.effectValue
        this.nIndexes = [null, null, null, null, null, null]
        this.nDiceIndexes = []
        // this.nTokenIndex = []
        // this.nFaceIndexes = []
        for(let i=0; i<newDiceCnt; i++){
            // let nDiceIndex = clamp(Math.floor(Math.random() * 6), 0, 5)
            // let nDirIndex = clamp(Math.floor(Math.random() * 6), 0, 5)
            
            let nDiceIndex = game.randomGenerator.RandomInteger(0, 5)
            let nDirIndex = game.randomGenerator.RandomInteger(0, 5)

            // let nDiceFaceIndex = 0
            // console.log(nDiceFaceIndex)
            this.nDiceIndexes.push(nDiceIndex)
            this.nIndexes.push(index2dir[nDirIndex])

            // this.nFaceIndexes.push(nDirIndex)

            // console.log(diceFaceInfo[nDiceFaceIndex])
            let newDice = {
                index : nDiceIndex,
                dir : index2dir[nDirIndex], 
                get weapon() { return diceFaceInfo[this.index][`${this.dir}`].weapon },
                get token(){ return diceFaceInfo[this.index][`${this.dir}`].token },
                state : "waiting",
                power : 1
            }
            data.player.dices.push(newDice)

            // if(diceFaceInfo[nDiceIndex][index2dir[nDirIndex]].token)
            //     nTokenIndex.push(6 + i)
        }
        
        // console.log(data.player.dices[6].weapon)
    },
    "Freyr": function(situation, data) {
        let weaponsCnt = {
            "axe" : 0,
            "arrow" : 0,
            "shield" : 0,
            "helmet" : 0,
            "steal" : 0
        }

        data.player.dices.forEach(dice => {
            if (dice.state != "ban") {
                let weapon = dice.weapon
                weaponsCnt[`${weapon}`]++
            }
        })

        let maxCnt = -9999
        for(const key in weaponsCnt)
            maxCnt = Math.max(maxCnt, weaponsCnt[`${key}`])
        

        let maxCntWeapons = []
        Object.keys(weaponsCnt).forEach(key=>{
            if(weaponsCnt[`${key}`] == maxCnt)
                maxCntWeapons.push(key)
        })

        let maxIndex = Math.floor(Math.random() * maxCntWeapons.length)
        maxIndex = Math.max(0, maxIndex)
        maxIndex = Math.min(maxIndex, maxCntWeapons.length - 1)


        this.increasedWeapon = maxCntWeapons[maxIndex]
        this.weaponIndexes = []
        this.increasedValue = []
        let weaponAddedCnt = data.effectValue

        data.player.dices.forEach((dice, index) => {
            if (dice.weapon == this.increasedWeapon && dice.state !== "ban") {
                this.weaponIndexes.push(index)
            }
        })

        let cnt = this.weaponIndexes.length
        let totalCnt = cnt + weaponAddedCnt


        
        let quotient = Math.floor(totalCnt / cnt)
        let remainder = totalCnt % cnt

        data.player.dices.forEach(dice => {
            if (dice.weapon == this.increasedWeapon  && dice.state != "ban")
                dice.power += (quotient - 1)
                // dice.power = quotient
        })

        data.player.dices.forEach(dice => {
            if (dice.weapon == this.increasedWeapon && remainder > 0  && dice.state != "ban"){
                dice.power++
                remainder--
            }
        })

        data.player.dices.forEach(dice => {
            if (dice.weapon == this.increasedWeapon && dice.state != "ban"){
                this.increasedValue.push(dice.power)
            }
        })

    },
    "Frigg": function(situation, data) {

    },
    "Heimdall": function(situation, data) {},
    "Hel": function(situation, data) {},
    "Idun": function(situation, data, superVisor) {
        let healValue = data.effectValue
        // data.player.health += (healValue)
        
        superVisor.TakeHeal.call(situation,data.userIndex, healValue)

    },
    "Loki": function(situation, data) {},
    "Mimir": function(situation, data){},
    "Odin": function(situation, data){},
    "Skadi": function(situation, data){
        let addedArrow = data.effectValue

        data.player.dices.forEach(dice=>{
            if(dice.weapon == "arrow" && dice.state != "ban")
                dice.power += addedArrow
        })

    },
    "Skuld": function (situation, data, superVisor){
        let tokenBrokenCoefficient = data.effectValue
        let arrowCnt = 0
        data.player.dices.forEach(dice=>{
            if(dice.weapon == "arrow" && dice.state != "ban")
                arrowCnt++
        })

        let opponent = 1 - this.user
        superVisor.RemoveToken.call(situation, opponent, tokenBrokenCoefficient * arrowCnt)
    },
    "Thor": function (situation, data, superVisor) {
        let damage = data.effectValue
        superVisor.TakeDamage.call(situation,data.opponentIndex, damage, "godfavor")
    },
    "Thrymr": function (situation, data) {},
    "Tyr": function(situation, data){},
    "Ullr": function (situation, data) {},
    "Var": function (situation, data) {},
    "Vidar": function (situation, data, superVisor) {
        let removedDiceCnt = data.effectValue
        this.removedDicesIndex = []
        this.removedCnt = []

        let removed_index= []

        // let opponent = 1 - this.user

        let dices = data.opponent.dices
        let dices_cnt = dices.length
    
        let dice_index = dices_cnt - 1
        let is_Changed = false
        while(true){
            let cDice = dices[dice_index]
            if(cDice.weapon == "helmet" && cDice.state != "ban" && cDice.power > 0){
                cDice.power--
                removedDiceCnt--
                removed_index.push(dice_index)
                is_Changed = true
            }

            if(removedDiceCnt == 0)
                break;

            dice_index--;

            // console.log(dice_index, is_Changed)

            if(dice_index === -1){
                dice_index = dices_cnt - 1

                if (is_Changed == false)
                    break;

                is_Changed = false
            }
        }

        let indexes = new Array(dices.length).fill(0)
        removed_index.forEach(index => {
            indexes[index]++
        })

        indexes.forEach((cnt, index)=>{
            if(cnt > 0){
                this.removedDicesIndex.push(index)
                this.removedCnt.push(cnt)
            }
        })



        // dices.forEach((cDice, index) => {
        //     if (cDice.weapon == "helmet" && cDice.state != "ban") {
        //         this.removedDicesIndex.push(index)
        //         this.removedCnt.push(cDice.power)
        //     }
        // })







        // data.opponent.dices.forEach((dice, index)=>{
        //     if(dice.weapon == "helmet" && dice.state != "ban" && removedDiceCnt > 0){
        //         this.bannedDicesIndex.push(index)
        //         removedDiceCnt--;
        //     }
        // })

        // superVisor.SetDicesState.call(situation, opponent, this.bannedDicesIndex, "ban")

    }
}



export {GetGodFavorPowerCallback}


const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];

