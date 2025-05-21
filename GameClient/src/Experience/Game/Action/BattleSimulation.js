import { gsap } from "gsap";


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


    setTimeout(()=>{
        firstWeapons.forEach(weapon=>{weapon.Destroy()})
        secondWeapons.forEach(weapon=>{weapon.Destroy()})
    }, 30000)

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
    
    let disappear_animations = []

    let needsSleep = false

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
            // needsSleep = true
        }


        // Disappear weapons
        await Promise.all(promises).then((resolves) => {
            resolves.forEach(callback => { disappear_animations.push(callback()) })
        })

        if(needsSleep){
            needsSleep = false
            await new Promise(res=>{setTimeout(()=>{res(true)}, 220)})
        }
        

        // console.log(firstAvatar.animation_timeline)
        // console.log(secondAvatar.animation_timeline)
        // await Promise.all([firstAvatar.animation_timeline, secondAvatar.animation_timeline])

        defenceWeaponIndex += dicesCommand[defenderIndex][sectorIndex][1]
        let mainbodyCnt = dicesCommand[attackerIndex][sectorIndex][1]

        let promises_ = []
        
        let reversed_index = attackWeaponIndex + (mainbodyCnt - 1)
        // let actual_length = 0

        // if(sectorIndex < 4){
        //     // weapon
        //     actual_length = defenderAvatar.GetHealth()
        // }
        // else{
        //     // steal
        //     actual_length = defenderAvatar.GetTokenLength()
        // }

        // if(mainbodyCnt > actual_length && actual_length > 0){
        //     reversed_index -= (mainbodyCnt - actual_length)
        // }

        // reversed_index = -999


        for(;mainbodyCnt > 0; mainbodyCnt--){
            

            let target = attackerWeapons[reversed_index].GetTarget(defenderAvatar, attackerAvatar)
            if(target != null){
                attackMarks[reversed_index].TurnOnLight()
                // console.log(target)
                // target.Action(null, defenderAvatar)
                promises_.push(attackerWeapons[reversed_index].Action(target, attackerAvatar))
            }

            reversed_index--
            attackWeaponIndex++
            // needsSleep = true
        }
        

        // Disappear weapons after action
        await Promise.all(promises_).then((resolves) => {
            resolves.forEach(callback => { disappear_animations.push(callback()) }) 
        })
        
        if(defenderAvatar.GetHealth() <= 0){
            return attackPlayer
        }

        // await Promise.all([firstAvatar.animation_timeline, secondAvatar.animation_timeline])

        if(needsSleep){
            needsSleep = false
            await new Promise(res=>{setTimeout(()=>{res(true)}, 220)})
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


    await Promise.all(disappear_animations)


    
    firstWeapons.forEach(weapon=>{weapon.Destroy()})
    secondWeapons.forEach(weapon=>{weapon.Destroy()})

    // console.log(firstBonusDicesCnt)


    return "none";

    for(let sectorIndex = 0 ; sectorIndex < 6; sectorIndex++){
        await Promise.all([firstAvatar.BattleCommand(), secondAvatar.BattleCommand()])
    }


}