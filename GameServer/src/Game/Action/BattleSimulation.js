
const whoIsAttackOnSector = [0, 0, 1, 1, 0, 1];

const sectorKeysOrders = [
    ["axe", "arrow", "helmet", "shield", "steal", "none"],
    ["helmet", "shield", "axe", "arrow", "none", "steal"]
]


// dicesCommand = [[ 공방 횟수, 명치 횟수 ],[]]
// [[선공], [후공]]
export default async function BattleSimulation(dicesCommand, dicesFormation, order, avatars){
    let firstPlayer = order[0]
    let secondPlayer = order[1]

    let firstAvatar = avatars[`${order[0]}`]
    let secondAvatar = avatars[`${order[1]}`]

    let firstMarks = firstAvatar.GetDiceMarks()
    let secondMarks = secondAvatar.GetDiceMarks()

    let firstWaitingDices = firstAvatar.GetSortedDiceForBattle()
    let firstWaitingDicesIndex = 0
    let secondWaitingDices = secondAvatar.GetSortedDiceForBattle()
    let secondWaitingDicesIndex = 0

    let firstBonusDicesCnt = 0
    let secondBonusDicesCnt = 0

    let firstWeapons = []
    let secondWeapons = []

    // firstMarks.InstantiateWeapon()


    firstMarks.forEach(mark=>{
        let newWeapon = mark.InstantiateWeapon()
        firstWeapons.push( newWeapon )
    })
    
    secondMarks.forEach(mark=>{
        let newWeapon = mark.InstantiateWeapon()
        secondWeapons.push( newWeapon )
    })

    
    let firstWeaponIndex = 0
    let secondWeaponIndex = 0

    for(let sectorIndex = 0; sectorIndex < 6; sectorIndex++){
        // dicesCommand[attacker][sectorIndex][0] 과 dicesCommand[defender][sectorIndex][0] 이 공방을 주고 받는다.
        let attackerIndex, defenderIndex
        let attackerWeapons, defenderWeapons
        let attackWeaponIndex, defenceWeaponIndex
        let attackerAvatar, defenderAvatar
        let attackMarks, defenceMarks
        let attackPlayer, defencePlayer
        
        if(whoIsAttackOnSector[sectorIndex] == 0){
            attackerWeapons = firstWeapons
            defenderWeapons = secondWeapons
            attackerIndex = 0
            defenderIndex = 1
            attackWeaponIndex = firstWeaponIndex
            defenceWeaponIndex = secondWeaponIndex
            attackerAvatar = firstAvatar
            defenderAvatar = secondAvatar
            attackMarks = firstMarks
            defenceMarks = secondMarks
            attackPlayer = firstPlayer
            defencePlayer = secondPlayer
        }
        else{
            attackerWeapons = secondWeapons
            defenderWeapons = firstWeapons
            attackerIndex = 1
            defenderIndex = 0
            attackWeaponIndex = secondWeaponIndex
            defenceWeaponIndex = firstWeaponIndex
            attackerAvatar = secondAvatar
            defenderAvatar = firstAvatar
            attackMarks = secondMarks
            defenceMarks = firstMarks
            attackPlayer = secondPlayer
            defencePlayer = firstPlayer
        }


        let exchangeAttackCnt = dicesCommand[attackerIndex][sectorIndex][0]
        let exchangeDefenceCnt = dicesCommand[defenderIndex][sectorIndex][0]
        let promises = []
        // console.log(`sector ${sectorIndex} : ${exchangeAttackCnt} / ${exchangeDefenceCnt}`)
        for(; exchangeAttackCnt > 0; exchangeAttackCnt--){
            let attackerTarget = defenderWeapons[defenceWeaponIndex].GetPosition()
            let defenderTarget = attackerWeapons[attackWeaponIndex].GetPosition()

            attackMarks[attackWeaponIndex].TurnOnLight()
            defenceMarks[defenceWeaponIndex].TurnOnLight()

            promises.push(attackerWeapons[attackWeaponIndex].Action(attackerTarget))
            promises.push(defenderWeapons[defenceWeaponIndex].Action(defenderTarget, defenderAvatar))
            attackWeaponIndex++
            defenceWeaponIndex++
        }

        // Disappear weapons
        await Promise.all([...promises]).then((resolves)=>{resolves.forEach(callback=>{callback()})})


        defenceWeaponIndex += dicesCommand[defenderIndex][sectorIndex][1]
        let mainbodyCnt = dicesCommand[attackerIndex][sectorIndex][1]

        promises = []
        for(;mainbodyCnt > 0; mainbodyCnt--){
            let target = attackerWeapons[attackWeaponIndex].GetTarget(defenderAvatar)
            if(target != null){
                attackMarks[attackWeaponIndex].TurnOnLight()
                // console.log(target)
                // target.Action(null, defenderAvatar)
                promises.push(attackerWeapons[attackWeaponIndex].Action(target, attackerAvatar))
            }
            attackWeaponIndex++
        }
        
        // Disappear weapons
        await Promise.all([...promises]).then((resolves)=>{resolves.forEach(callback=>{callback()})})
        
        if(defenderAvatar.GetHealth() <= 0){
            return attackPlayer
        }

        // 전투를 완료한 주사위들을 전장밖으로 옮긴다
        let firstWaitingDicesCntAtSector = dicesFormation[0][sectorIndex][0] + dicesFormation[0][sectorIndex][1]

        let secondWaitingDicesCntAtSector = dicesFormation[1][sectorIndex][0] + dicesFormation[1][sectorIndex][1]


        for (let i = 0; i < firstWaitingDicesCntAtSector; i++) {
            let battleEndDice = firstWaitingDices[firstWaitingDicesIndex]
            if (firstAvatar.DiceToActionEnd(battleEndDice, firstWaitingDicesIndex - firstBonusDicesCnt) == null)
                firstBonusDicesCnt++;
            firstWaitingDicesIndex++
        }

        for (let i = 0; i < secondWaitingDicesCntAtSector; i++) {
            let battleEndDice = secondWaitingDices[secondWaitingDicesIndex]

            if (secondAvatar.DiceToActionEnd(battleEndDice, secondWaitingDicesIndex - secondBonusDicesCnt) == null)
                secondBonusDicesCnt++
            secondWaitingDicesIndex++
        }



        if(whoIsAttackOnSector[sectorIndex] == 0){
            firstWeaponIndex = attackWeaponIndex
            secondWeaponIndex = defenceWeaponIndex
        }
        else{
            secondWeaponIndex = attackWeaponIndex
            firstWeaponIndex = defenceWeaponIndex
        }

    }


    
    firstWeapons.forEach(weapon=>{weapon.Destroy()})
    secondWeapons.forEach(weapon=>{weapon.Destroy()})

    // console.log(firstBonusDicesCnt)


    return "none";

    for(let sectorIndex = 0 ; sectorIndex < 6; sectorIndex++){
        await Promise.all([firstAvatar.BattleCommand(), secondAvatar.BattleCommand()])
    }


}