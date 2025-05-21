



const diceFaceInfo = [{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "arrow", token: true },
    "back": { weapon: "steal", token: true }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "steal", token: true },
    "front": { weapon: "arrow", token: false },
    "back": { weapon: "helmet", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "arrow", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "shield", token: false }
},

{
    "right": { weapon: "arrow", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: true },
    "back": { weapon: "axe", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "arrow", token: true }

},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "arrow", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "helmet", token: true }

}]



const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const index2dir = ["right", "left", "top", "bottom", "front","back"]

// [[before],[after]]
function GetGodFavorPowerCallback(godFavorsInfo, order, superVisor, situation){
    // godFavorsInfo : [
    //     {godfavorIndex : -1, level: -1, godfavorNameIndex: -1},
    //     {godfavorIndex : -1, level: -1, godfavorNameIndex: -1}
    // ],

    let godFavorsStat = []
    // console.log(godFavorsInfo)


    godFavorsInfo.forEach((godFavorInfo, user) => {
        // console.log(godFavorInfo)
        if (godFavorInfo.godfavorIndex != -1){
            // godFavorsStat.push(godFavorInfo)

            let newStat = godFavorInfo
            let _name = godFavorNames[godFavorsInfo[user].godfavorNameIndex]

            let _tmpstat = godfavors_stat[`${_name}`]

            Object.keys(_tmpstat).forEach(key=>{
                newStat[`${key}`] = _tmpstat[`${key}`]
            })

            newStat.user = user
            newStat.opponent = 1 - newStat.user
            newStat.order = order[user]

            newStat.cost_ = newStat.cost[newStat.level]
            // newStat.token_ = situation.player[newStat.user].token

            newStat.power = function(Situation) {
                let datas = {
                    userIndex : newStat.user,
                    opponentIndex : 1 - newStat.user,
                    player : Situation.player[newStat.user],
                    opponent : Situation.player[1 - newStat.user],
                    level : newStat.level,
                    cost: newStat.cost[newStat.level],
                    effectValue: newStat.effectValue[newStat.level]
                }
                newStat.token_ = situation.player[newStat.user].token

                // console.log(Situation.player[newStat.user])
                // console.log(`before : ${this.token_} & ${this.cost_}}`)
                if (this.token_ >= this.cost_) {
                    // this.token_ = situation.player[newStat.user].token
                    Situation.player[newStat.user].token -= this.cost_
                    superVisor.TriggerEvent(`${newStat.user}-use-token`, [this.cost_])
                    // console.log(`after : ${this.token_} & ${this.cost_}}`)

                    if (this.level >= 0) {
                        godFavorsPower[`${godFavorNames[godFavorsInfo[user].godfavorNameIndex]}`].call(newStat, Situation, datas, superVisor)
                        
                    }
                }

            }
            godFavorsStat.push(newStat)


            // godFavorsStat.push(godfavors_stat[`${godFavorNames[godFavorsInfo[user].godfavorNameIndex]}`])
        }
    })


    godFavorsStat.forEach((newStat, user) => {
        let _name = godFavorNames[godFavorsInfo[user].godfavorNameIndex]
        // console.log(`cost_ = ${newStat.cost_}`)
        // console.log(`token = ${situation.player[newStat.user].token}`)
        if (newStat.level >= 0 && (newStat.cost_ <= newStat.token_)) {

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
                        return postProcess[`${_name}`].call(newStat, LogicKit, controller)
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
                        return extraInput[`${_name}`].call(newStat, LogicKit, game)
                }

            }

            if (registerTrigger[`${_name}`]) {
                newStat.registerTrigger = function (superVisor) {
                    if (newStat.cost_ <= newStat.token_) {
                        registerTrigger[`${_name}`].call(newStat, superVisor)
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


    
    // if (godFavorsStat.length >= 1 && godFavorsStat[0].godfavorNameIndex == 15) {
    //     if (godFavorsStat.length >= 2)
    //         godFavorsStat[0].targetGodFavor = godFavorsStat[1]
    //     else
    //         godFavorsStat[0].targetGodFavor = null
    // }


    


    // console.log(godFavorsStat)

    // console.log(godFavorsStat)
    
    // if (godFavorsStat.length >= 1 && godFavorsStat[0].godfavorNameIndex == 15) {
    //     if (godFavorsStat.length >= 2)
    //         godFavorsStat[0].targetGodFavor = godFavorsStat[1]
    //     else
    //         godFavorsStat[0].targetGodFavor = null
    // }



    // 스림, 바르.... 상대 카드를 참조해야하는 능력은 여기서 미리 연산한다.





    // if(godFavorsStat.length  >= 2){
    //     godFavorsStat[0].targetGodFavor = godFavorsStat[1]
    //     godFavorsStat[1].targetGodFavor = godFavorsStat[0]
    // }
    // else if(godFavorsStat.length == 1){
    //     godFavorsStat[0].targetGodFavor = null
    // }

    // if (godFavorsStat.length >= 2 && godFavorsStat[0].godfavorNameIndex == 15) {
    //     // 스림의 도둑질
    //     // godFavorsStat[0].afterDecision = godFavorsStat[1].afterDecision
    //     godFavorsStat[0].targetGodFavor = godFavorsStat[1]
    // } else {
    //     godFavorsStat[0].targetGodFavor = null
    // }



    let ret = [[],[]]
    godFavorsStat.forEach(godFavorStat=>{
        ret[godFavorStat.afterDecision ? 1 : 0].push(godFavorStat)
    })


    // ret.preActivation
    // ret.registerTrigger
    // ret.extraInput
    // ....
    


    return ret

    let favor = ret[0][0]
    favor.power()

    
    
    // console.log(godFavorsStat[0])
    // godFavorsPower.Thor(null, 1, godFavorsStat[0])

    // console.log(ret)


    // let arr = []
    // arr.push(godfavors_stat.Thor)
    // arr.push(godfavors_stat.Idun)
    // arr.push(godfavors_stat.Odin)


    // console.log(arr)
    // arr.sort((a,b)=>{
    //     console.log(a.priority)
    //     console.log(b.priority)
    //     if(a.afterDecision != b.afterDecision)
    //         return a.afterDecision ? 1 : -1
    //     else
    //         return a.priority - b.priority
    // })

    // console.log(arr)


}



const preActivation = {
    "Thrymr": function (myInfo, opponentInfo) {
        let levelDecreased = myInfo.effectValue[myInfo.level]
        opponentInfo.level -= levelDecreased
    },
}



const registerTrigger = {
    "Heimdall":function(superVisor){
        let healCoefficient = this.effectValue[this.level]

        superVisor.RegisterEvent(`${this.user}-block-axe`, (cnt)=>{
            superVisor.TakeHeal(this.user, cnt * healCoefficient)
        })        

        superVisor.RegisterEvent(`${this.user}-block-arrow`, (cnt)=>{
            superVisor.TakeHeal(this.user, cnt * healCoefficient)
        })
    },
    "Hel" : function(superVisor){
        let healCoefficient = this.effectValue[this.level]
        let opponent = 1 - this.user

        superVisor.RegisterEvent(`${opponent}-damage-axe`, (damage)=>{
            superVisor.TakeHeal(this.user, damage * healCoefficient)
        })   

    },
    "Mimir" : function(superVisor){
        let tokenCoefficient = this.effectValue[this.level]
        console.log("[[[ mimir ]]]")
        console.log(this)

        superVisor.RegisterEvent(`${this.user}-damage-axe`, (damage)=>{
            superVisor.AddToken(this.user, damage * tokenCoefficient)
        })        

        superVisor.RegisterEvent(`${this.user}-damage-arrow`, (damage)=>{
            superVisor.AddToken(this.user, damage * tokenCoefficient)
        })

        superVisor.RegisterEvent(`${this.user}-damage-godfavor`, (damage)=>{
            superVisor.AddToken(this.user, damage * tokenCoefficient)
        })

    },
    "Ullr": function (superVisor) {
        let byPassArrowCnt = this.effectValue[this.level]

        superVisor.RegisterEvent(`${this.user}_arrow_battle_simulation`, (commanders) => {
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
    "Var": function (superVisor) {
        let opponent = 1 - this.user
        let healCoefficient = this.effectValue[this.level]
        superVisor.RegisterEvent(`${opponent}-use-token`, (usedToken)=>{
            superVisor.TakeHeal(this.user, usedToken * healCoefficient)
        })
    }
}



const extraInput = {
    // "Odin" : function(){},
    "Frigg" : function(LogicKit, game) {
        game.controller.MessageEnqueue("GodFavorExtraAction", [])

        let extraInputData = LogicKit.GetExtraInputData()
        // console.log(extraInputData)
        let user = this.user
        let opponent = 1 - this.user

        let rerollDiceCnt = this.effectValue[this.level]

        // user
        let rerollDicesIndex_User = []
        extraInputData[user].dicesState.forEach((state, index)=>{
            if(state === "levitation"){
                if(rerollDiceCnt > 0){
                    rerollDicesIndex_User.push(index)
                    rerollDiceCnt--;
                }
            }
        })


        let rerollDicesIndex_Opponent = []
        extraInputData[opponent].dicesState.forEach((state, index)=>{
            if(state === "levitation"){
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
        LogicKit.SetDicesDir(user, rerollDicesIndex_User, newdirs)

        let cnt = extraInputData[user].dicesState.length
        let diceRollDirs = Array(cnt).fill(null)
        newdirs.forEach((dir, index)=>{
            let i = rerollDicesIndex_User[index]
            diceRollDirs[i] = dir
        })
        // console.log(diceRollDirs)
        game.controller.MessageEnqueue("RollDices", [user, diceRollDirs, newdirs.length])



        
        newdirs=[]
        rerollDicesIndex_Opponent.forEach(()=>{
            let newdir = clamp(Math.floor(Math.random() * 6), 0, 5)
            let dir = index2dir[newdir]
            newdirs.push(dir)
        })
        LogicKit.SetDicesDir(opponent, rerollDicesIndex_Opponent, newdirs)

        cnt = extraInputData[opponent].dicesState.length
        diceRollDirs = Array(cnt).fill(null)
        newdirs.forEach((dir, index)=>{
            let i = rerollDicesIndex_Opponent[index]
            diceRollDirs[i] = dir
        })
        // console.log(diceRollDirs)
        game.controller.MessageEnqueue("RollDices", [opponent, diceRollDirs, newdirs.length])


        let diceFormation, playerOrder
        [diceFormation, playerOrder, ] = LogicKit.GetDiceFormation()
        game.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])
        

    },
    "Loki" : function(LogicKit, game) {
        game.controller.MessageEnqueue("GodFavorExtraAction", [])

        // resolution phase의 추가 입력 처리 로직
        let extraInputData = LogicKit.GetExtraInputData()
        let opponent = 1 - this.user

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
        game.controller.MessageEnqueue("BanDices", [opponent, [...bannedDicesIndex]])

        LogicKit.SetDicesState(opponent, bannedDicesIndex, "ban")

        let diceFormation, playerOrder
        [diceFormation, playerOrder, ] = LogicKit.GetDiceFormation()
        // console.log(diceFormation)

        // 재정렬
        game.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])

        // console.log(`${this.effectValue[level]} dices are banned!`)
    },
    "Odin": function(LogicKit, game){
        let extraInputData = LogicKit.GetExtraInputData()
        let inputInfo = LogicKit.GetInputData()

        // console.log(extraInputData)
        // console.log(inputInfo)
        
        let healthStoneIndex = inputInfo.index
        let avatar = inputInfo.avatar
        let health = extraInputData[avatar].health
        let damage = health - (healthStoneIndex)
        // console.log(`health : ${health}, clickedIndex = ${healthStoneIndex}`)

        let tokenCoefficient = this.effectValue[this.level]

        LogicKit.TakeDamage(avatar, damage, "none")
        LogicKit.AddToken(avatar, damage * tokenCoefficient)

        
        game.controller.MessageEnqueue("GodFavorExtraAction", [{damage : damage, coefficient : tokenCoefficient}])
    },
    "Tyr": function(LogicKit, game){
        let extraInputData = LogicKit.GetExtraInputData()
        let inputInfo = LogicKit.GetInputData()

        // console.log(extraInputData)
        // console.log(inputInfo)
        
        let healthStoneIndex = inputInfo.index
        let avatar = inputInfo.avatar
        let opponent = 1 - avatar
        let health = extraInputData[avatar].health
        let damage = health - (healthStoneIndex)
        // console.log(`health : ${health}, clickedIndex = ${healthStoneIndex}`)

        let tokenCoefficient = this.effectValue[this.level]

        LogicKit.TakeDamage(avatar, damage, "none")
        LogicKit.RemoveToken(opponent, damage * tokenCoefficient)

        
        game.controller.MessageEnqueue("GodFavorExtraAction", [{damage : damage, coefficient : tokenCoefficient}])
    }


}


const postProcess = {
    "Freyja": function (LogicKit, controller) {
        // 새로운 주사위 추가, formation 재정렬 명령 전송
        // Game.ResolutionPhaseBegin 의 전송작업 맨 앞에서 실행되어야 함
        let diceFormation, playerOrder
        [diceFormation, playerOrder,] = LogicKit.GetDiceFormation()
        let newDiceCnt = this.effectValue[this.level]

        // console.log(this)

        // 추가된 주사위 굴리기
        //controller.MessageEnqueue("RollDices", [avatar, dirs, rollDicesCnt, ret])
        controller.MessageEnqueue("RollDices", [this.user, this.nIndexes, newDiceCnt])


        // 재정렬
        controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])


        // 추가 토큰
        // LogicKit.GetExtraToken(this.user, nTokenIndex)
        // controller.MessageEnqueue("GetToken", [[this.user], [nTokenIndex]])

    },
    "Frigg": function () { },
    "Vidar" : function(LogicKit, controller){
        // this.bannedDicesIndex
        let opponent = 1 - this.user
        controller.MessageEnqueue("BanDices", [opponent, [...this.bannedDicesIndex]])

        
        let diceFormation, playerOrder
        [diceFormation, playerOrder,] = LogicKit.GetDiceFormation()
        controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])


        // data.player.dices.forEach(dice => {
        //     if (dice.weapon == "steal" && dice.state != "ban")
        //         stealCnt++
        // })

        // superVisor.AddToken(this.user, stealCnt * tokenCoefficient)

    }
}





// superVisor.AddToken(this.user, damage * tokenCoefficient)


const godFavorsPower = {
    "Baldr": function (situation, data) {
        let addedArmor = data.effectValue

        // data.player.token -= data.cost
        data.player.dices.forEach(dice => {
            if ((dice.weapon == "helmet" || dice.weapon == "shield") && dice.state != "ban")
                dice.power += addedArmor
        })
    },
    "Bragi": function (situation, data, superVisor){
        let stealCnt = 0
        let tokenCoefficient = data.effectValue

        data.player.dices.forEach(dice => {
            if (dice.weapon == "steal" && dice.state != "ban")
                stealCnt++
        })

        superVisor.AddToken(this.user, stealCnt * tokenCoefficient)
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
    "Freyja": function(situaion, data) {
        let newDiceCnt = data.effectValue
        this.nIndexes = [null, null, null, null, null, null]
        this.nDiceIndexes = []
        // this.nTokenIndex = []
        // this.nFaceIndexes = []
        for(let i=0; i<newDiceCnt; i++){
            let nDiceIndex = clamp(Math.floor(Math.random() * 6), 0, 5)
            let nDirIndex = clamp(Math.floor(Math.random() * 6), 0, 5)
            

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
    "Freyr": function(situaion, data) {
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

        
        
        // 증량할 무기 대상을 전송

    },
    "Frigg": function(situaion, data) {

    },
    "Heimdall": function(situaion, data) {},
    "Hel": function(situaion, data) {},
    "Idun": function(situaion, data) {
        let healValue = data.effectValue

        // data.player.token -= data.cost
        data.player.health += (healValue)
    },
    "Loki": function(situaion, data) {
        // // let bannedDiceCnt = data.effectValue
        // return function(LogicKit){
        //     // console.log("wait for input from player")
        //     return data.userIndex;
        // }
    },
    "Mimir": function(situaion, data){},
    "Odin": function(situaion, data){},
    "Skadi": function(situation, data){
        let addedArrow = data.effectValue

        // data.player.token -= data.cost
        data.player.dices.forEach(dice=>{
            if(dice.weapon == "arrow" && dice.state != "ban")
                dice.power += addedArrow
        })

    },
    "Skuld": function (situaion, data, superVisor){
        let tokenBrokenCoefficient = data.effectValue
        
        let arrowCnt = 0
        data.player.dices.forEach(dice=>{
            if(dice.weapon == "arrow" && dice.state != "ban")
                arrowCnt++
        })

        let opponent = 1 - this.user
        superVisor.RemoveToken(opponent, tokenBrokenCoefficient * arrowCnt)

        // data.opponent.SpendToken(tokenBrokenCoefficient * arrowCnt)

    },
    "Thor": function (situaion, data, superVisor) {
        let damage = data.effectValue
        
        // data.player.token -= data.cost
        // data.opponent.health -= damage
        superVisor.TakeDamage(data.opponentIndex, damage, "godfavor")
    },
    "Thrymr": function (situaion, data) {},
    "Tyr": function(situaion, data){},
    "Ullr": function (situaion, data) {},
    "Var": function (situaion, data) {},
    "Vidar": function (situaion, data, superVisor) {
        let bannedDiceCnt = data.effectValue
        this.bannedDicesIndex = []

        let opponent = 1 - this.user

        data.opponent.dices.forEach((dice, index)=>{
            if(dice.weapon == "helmet" && dice.state != "ban" && bannedDiceCnt > 0){
                this.bannedDicesIndex.push(index)
                bannedDiceCnt--;
            }
        })

        superVisor.SetDicesState(opponent, this.bannedDicesIndex, "ban")

    }
}







function Hello(Situation){
    // console.log(Situation)
}

export {GetGodFavorPowerCallback}


const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];


const godfavors_stat = {
    "Baldr": {
        title : "Baldr's Invulnerability",
        description : "Add {HELMET} for each die that rolled {HELMET}.<br>Add {SHIELD} for each die that rolled {SHIELD}.",
        spec : function(level){return `+${this.effectValue[level]} {HELMET} & {SHIELD} per die`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff9900,
        weaponName : "BrunhildAxe"
    },
    "Bragi": {
        title : "Bragi's Verve",
        description : "Gain ⌘ for each die that rolled a {STEAL}.",
        spec : function(level){return `Gain ${this.effectValue[level]} ⌘ per die`},
        cost : [4, 8, 12],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xa47c00,
        weaponName : "BrunhildAxe"
    },
    "Brunhild": {
        title : "Brunhild's Fury",
        description : "Multiply each {AXE} die.<br>Round up to a whole number.",
        spec : function(level){return `x${this.effectValue[level]} {AXE}`},
        cost : [6, 10, 18],
        afterDecision : false,
        effectValue : [1.5, 2, 3],
        priority : 4,
        color : 0x1155cc,
        weaponName : "BrunhildAxe"
    },
    "Freyja": {
        title : "Freyja's Plenty",
        description : "Roll additional dice this round.",
        spec : function(level){return `+${this.effectValue[level]} dice`},
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [1,2,3],
        priority : 2,
        color : 0xff00ff,
        modelName : "FreyjaDice"
    },
    "Freyr": {
        title : "Freyr's Gift",
        description : "Add to the total of whichever die face is in majority.",
        spec : function(level){return `+${this.effectValue[level]}`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xff93ff
    },
    "Frigg": {
        title : "Frigg's Sight",
        description : "Re-roll any of your, or your opponent's, dice.",
        spec : function(level){return `Re-roll ${this.effectValue[level]} dice`},
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 2,
        color : 0xd9d9d9
    },
    "Heimdall": {
        title : "Heimdall's Watch",
        description : "Gain health tokens for each attack you block.",
        spec : function(level){return `+ ${this.effectValue[level]} HP per Block`},
        cost : [4, 7, 10],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0x674ea7
    },
    "Hel": {
        title : "Hel's Grip",
        description : "Each {AXE} damage dealt to the opponent heals you.",
        spec : function(level){return `+ ${this.effectValue[level]} HP per damage`},
        cost : [6, 12, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0x38761d
    },
    "Idun": {
        title : "Idun's Rejuvenation",
        description : "Gain health tokenss.",
        spec : function(level){return `Heal ${this.effectValue[level]} HP`},
        cost : [4, 7, 10],
        afterDecision : true,
        effectValue : [2, 4, 6],
        priority : 7,
        color : 0xffff00
    },
    "Loki": {
        title : "Loki's Trick",
        description : "Ban opponent's dice for the Round.",
        spec : function(level){return `Ban ${this.effectValue[level]} dice`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 2,
        color : 0x999999
    },
    "Mimir": {
        title : "Mimir's Wisdom",
        description : "Gain ⌘ for each attack dealt to you causing damage.",
        spec : function(level){return `+ ${this.effectValue[level]} ⌘ per damage`},
        cost : [3, 5, 7],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xfcd048
    },
    "Odin": {
        title : "Odin's Sacrifice",
        description : "Sacrifice any number of your health tokens and gain ⌘ per health token sacrificed.",
        spec : function(level){return `Gain ${this.effectValue[level]} ⌘ per health token`},
        cost : [6, 8, 10],
        afterDecision : true,
        effectValue : [3, 4, 5],
        priority : 7,
        color : 0xffffff
    },
    "Skadi": {
        title : "Skadi's Hunt",
        description : "Add {ARROW} for each die that rolled {ARROW}",
        spec : function(level){return `+${this.effectValue[level]} {ARROW} per die`},
        cost : [6, 8, 10],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff0000
    },
    "Skuld": {
        title : "Skuld's Claim",
        description : "Destroy apponent's ⌘ for each die that rolled {ARROW}",
        spec : function(level){return `-${this.effectValue[level]} ⌘ per die`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x3da5ad,
        weaponName : "SkadiArrow"
    },
    "Thor": {
        title : "Thor's Strike",
        description : "Deal damage to the opponent.",
        spec : function(level){return `-${this.effectValue[level]} HP`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [4, 8, 12],
        afterDecision : true,
        effectValue : [2, 5, 8],
        priority : 6,
        color : 0x00ffff,
    },
    "Thrymr": {
        title : "Thrymr's Theft",
        description : "Reduce the effect level of the God Favor invoked by opponent this turn.",
        spec : function(level){return `Reduce ${this.effectValue[level]} level`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x000000,
    },
    "Tyr": {
        title : "Tyr's Pledge",
        description : "Sacrifice any number of your health tokens to destroy opponent's ⌘",
        spec : function(level){return `Destroy ${this.effectValue[level]} ⌘ per HP`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x9900ff,
    },
    "Ullr": {
        title : "Ullr's Aim",
        description : "Your {ARROW} bypasses the opponent's {SHIELD}",
        spec : function(level){return `${this.effectValue[level]} {ARROW} bypasses {SHIELD}`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 6],
        priority : 4,
        color : 0x93c47d
    },
    "Var": {
        title : "Var's Bond",
        description : "Each ⌘ spent by your opponent heals you.",
        spec : function(level){return `+${this.effectValue[level]} HP per ⌘`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [10, 14, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x00ff00
    },
    "Vidar": {
        title : "Vidar's Might",
        description : "Remove rolled {HELMET} dice from opponent.",
        spec : function(level){return `-${this.effectValue[level]} {HELMET}`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [2, 4, 6],
        priority : 4,
        color : 0xcc4125
    }


}



