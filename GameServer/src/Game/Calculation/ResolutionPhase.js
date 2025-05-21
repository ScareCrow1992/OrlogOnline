
function GetDicesWithTokenIndex(dices){
    let dicesWithTokenIndex=[[],[]]

    let firstAvatarDice = dices[0]
    firstAvatarDice.forEach((dice, index) => {
        if (dice.token && dice.state != "ban") {
            dicesWithTokenIndex[0].push(index)
        }
    })


    let secondAvatarDice = dices[1]
    secondAvatarDice.forEach((dice, index) => {
        if (dice.token && dice.state != "ban") {
            dicesWithTokenIndex[1].push(index)
        }
    })

    // console.log(dicesWithTokenIndex)

    return dicesWithTokenIndex
}



const whoIsAttackOnSector = [0, 0, 1, 1, 0, 1];

const sectorKeysOrders = [
    ["axe", "arrow", "helmet", "shield", "steal", "none"],
    ["helmet", "shield", "axe", "arrow", "none", "steal"]
]

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

// dices = [[선공 주사위], [후공 주사위]]
function GetBattleInformation(sectors, superVisor, situation) {
    let dicesCommand=[[], []]
    let dicesFormation = [[],[]]
    // console.log(sectors)
    
    for (let sectorIndex = 0; sectorIndex < 6; sectorIndex++) {

        let attacker = whoIsAttackOnSector[sectorIndex]
        let defender = 1 - attacker

        let attackWeapon = sectorKeysOrders[attacker][sectorIndex]
        let defenceWeapon = sectorKeysOrders[defender][sectorIndex]


        // 공격력 계산
        let attackPower = sectors[`${attacker}`][`${attackWeapon}`].power
        let defencePower = sectors[`${defender}`][`${defenceWeapon}`].power

        dicesCommand[attacker][sectorIndex] = []
        dicesCommand[defender][sectorIndex] = []

        dicesCommand[attacker][sectorIndex][0] = clamp(attackPower, 0, defencePower)
        dicesCommand[attacker][sectorIndex][1] = clamp(attackPower - defencePower, 0, attackPower)

        dicesCommand[defender][sectorIndex][0] = clamp(defencePower, 0, attackPower)
        dicesCommand[defender][sectorIndex][1] = clamp(defencePower - attackPower, 0, defencePower)


        // 전투결과 변동 요구 트리거
        let order = superVisor.GetPlayerOrder.call(situation)
        superVisor.TriggerEvent.call(situation,`${order[attacker]}_${attackWeapon}_battle_simulation`, [[dicesCommand[attacker][sectorIndex], dicesCommand[defender][sectorIndex]]])


        // 전투결과 실시간 반영
        let damage = dicesCommand[attacker][sectorIndex][1]
        let block = dicesCommand[defender][sectorIndex][0]

        if(sectorIndex <= 3){
            superVisor.BlockAttack.call(situation, order[defender], block, attackWeapon)
            superVisor.TakeDamage.call(situation, order[defender], damage, attackWeapon)
        }
        else
            superVisor.StealToken.call(situation, order[defender], damage)
    
            



        // 주사위 갯수 계산
        let attackCnt = sectors[`${attacker}`][`${attackWeapon}`].cnt
        let defenceCnt = sectors[`${defender}`][`${defenceWeapon}`].cnt

        dicesFormation[attacker][sectorIndex] = []
        dicesFormation[defender][sectorIndex] = []

        dicesFormation[attacker][sectorIndex][0] = clamp(attackCnt, 0, defenceCnt)
        dicesFormation[attacker][sectorIndex][1] = clamp(attackCnt - defenceCnt, 0, attackCnt)
        
        dicesFormation[defender][sectorIndex][0] = clamp(defenceCnt, 0, attackCnt)
        dicesFormation[defender][sectorIndex][1] = clamp(defenceCnt - attackCnt, 0, defenceCnt)

    }


    let battleResult = [{}, {}]
    battleResult[0].takenDamage = 0
    battleResult[0].stealedToken = 0
    
    battleResult[1].takenDamage = 0
    battleResult[1].stealedToken = 0
    

    
    for (let sectorIndex = 0; sectorIndex < 6; sectorIndex++) {
        let attacker = whoIsAttackOnSector[sectorIndex]
        let defender = 1 - attacker

        let damage = dicesCommand[attacker][sectorIndex][1]

        if(sectorIndex <= 3)
            battleResult[defender].takenDamage += damage
        else
            battleResult[defender].stealedToken += damage



    }

    return [dicesCommand, battleResult, dicesFormation]
}



export { GetDicesWithTokenIndex, GetBattleInformation }