
/*
situation = {
    turnNum : INT,
    diceInTrays : [...BOOL]  // tray에 있는 dice들의 목록
}
*/


// function BeginRollPhase() {
//     // 모든 주사위 state를 "tray"로 만든다.
// }


// let INT = -1;
// let BOOL = false;
// function RollPhase(situation) {
//     let ret = {
//         dicesRollResult: [INT,],  // 주사위 굴린 후 결과값 (0 ~ 5, -1 = 안굴림)
//         changePhase: BOOL,
//         pickDice: BOOL,    // 주사위 선택권 존재 여부
//         passTurn: BOOL     // 자동 턴 넘김 여부
//     }


//     if (situation.turnNum == 6) {
//         ret.changePhase = true;
//     }
//     else {
//         ret.changePhase = false;
//         if (CheckDicesInTrayCnt(situation.diceInTrays)) {
//             ret.dicesRollResult = RollDices(situation.diceInTrays)

//             if (situation.diceRollcnt >= 4)
//                 ret.pickDice = false;
//             else
//                 ret.pickDice = true;
//         }
//         else {
//             ret.passTurn = true;
//         }
//     }

//     return ret;
// }


function RollDices(dices) {
    let ret = []
    dices.forEach(isInTray => {
        if (isInTray) {
            let newDir = Math.floor(Math.random() * 6)
            newDir = Math.max(newDir, 0);
            newDir = Math.min(newDir, dices.length - 1)
            // dicesDir.push(Math.floor(Math.random()* 6))'
            ret.push(newDir);
        }
        else
            ret.push(-1);
    })

    return ret;
}

// function CheckDicesInTrayCnt(dices) {
//     let ret = false;
//     dices.forEach(dice => {
//         if (dice)
//             ret = true;
//     })
//     return ret;
// }

// let tmp_index = 0
// let tmp_arr = [
//     [0, 0, 0, 4, 4, 4],
//     [5, 3, 4, 4, 4, 4]
// ]

function SetDicesDir() {
    // let ret = [...tmp_arr[tmp_index]]
    // tmp_index++
    // tmp_index = tmp_index % 2
    // return ret

    // return [0,0,0,0,0,0]


    let dirs = [];
    for (let i = 0; i < 6; i++) {
        dirs[i] = Math.floor(Math.random() * 6);
        dirs[i] = Math.min(dirs[i], 5)
    }

    return dirs

}


const sectorKeysOrders = [
    ["axe", "arrow", "helmet", "shield", "steal", "none"],
    ["helmet", "shield", "axe", "arrow", "none", "steal"]
]



const whoIsAttackOnSector = [0, 0, 1, 1, 0, 1];



function GetDiceSector(dices) {

    let sectors = [{},
    {}]

    sectorKeysOrders[0].forEach(key => {
        sectors[0][`${key}`] = {}
        sectors[1][`${key}`] = {}

        sectors[0][`${key}`].cnt = 0
        sectors[0][`${key}`].power = 0
        sectors[1][`${key}`].cnt = 0
        sectors[1][`${key}`].power = 0
    })

    let sectorFaces;
    //  [[[주사위 face],[],[]], [[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]];
    // sectorFaces[sectorIndex][공격 0 / 방어 1 / 명치 2][face index]
    // sectorFaces[sectorIndex][공격 / 방어][face index] : 서로 공격을 주고 받는다
    // sectorFaces[sectorIndex][명치][face index] : 특수행동(명치 공격 or 토큰 스틸)
    sectorKeysOrders.forEach((sectorKeyOrder, order) => {
        sectorKeyOrder.forEach(sectorKey => {
            // console.log(player)
            // console.log(this.playerController[`${player}`])
            dices[order].forEach((dice, index) => {
                if (dice.weapon === sectorKey && dice.state === "waiting") {
                    sectors[order][`${sectorKey}`].cnt++
                    sectors[order][`${sectorKey}`].power += dice.power;
                }
            })
        })
    })
    // console.log(sectors)

    return sectors;
}


function GetDiceFormation(dices) {
    // [선공 배치], [후공 배치] 

    // 선공 : axe -> arrow -> helmet -> shield -> steal -> none
    // 후공 : helmet -> shield -> axe -> arrow -> none -> steal
    // 우선 sector를 위의 조건에 맞추어 차례대로 채운다.

    // 정확한 주사위 정보가 아니라, sector별 갯수만 전송하면 된다.
    // 나머지는 avatar가 waiting 순서를 파악해서 옮길것이다

    // console.log(sectors)

    let sectors = GetDiceSector(dices)

    let dicesFormation = [{}, {}]
    dicesFormation[0].weapons = sectorKeysOrders[0]
    dicesFormation[1].weapons = sectorKeysOrders[1]
    // [ 선공 ], [ 후공 ]

    let sectorPower = [{},{}]

    for (let sectorIndex = 0; sectorIndex < 6; sectorIndex++) {
        // let attacker, defender
        // attacker = whoIsAttackOnSector[sectorIndex]
        // defender = 1 - attacker

        let firstAvatar = 0
        let secondAvatar = 1

        let firstWeapon = sectorKeysOrders[firstAvatar][sectorIndex]
        let secondWeapon = sectorKeysOrders[secondAvatar][sectorIndex]

        let firstCnt = sectors[firstAvatar][`${firstWeapon}`].cnt
        let secondCnt = sectors[secondAvatar][`${secondWeapon}`].cnt

        let firstPower = sectors[firstAvatar][`${firstWeapon}`].power
        let secondPower = sectors[secondAvatar][`${secondWeapon}`].power


        let length = Math.max(firstCnt, secondCnt)
        dicesFormation[0][sectorIndex] = length
        dicesFormation[1][sectorIndex] = length

        sectorPower[0][sectorIndex] = firstPower
        sectorPower[1][sectorIndex] = secondPower

        /*
        let attackWeapon = sectorKeysOrders[attacker][sectorIndex]
        let defenceWeapon = sectorKeysOrders[defender][sectorIndex]

        let attackCnt = sectors[defender][`${defenceWeapon}`]

        let defenceCnt = sectors[attacker][`${attackWeapon}`]

        let length = Math.max(attackCnt, defenceCnt)
        dicesFormation[0][sectorIndex] = length
        dicesFormation[1][sectorIndex] = length
        */




        // let attackMainCnt = sectors[attacker][`${attackWeapon}`] - sectors[defender][`${defenceWeapon}`] 
        // attackMainCnt = Math.max(0, attackMainCnt)

        // dicesFormation[defender][sectorIndex][0] = sectors[defender][`${defenceWeapon}`]
        // dicesFormation[defender][sectorIndex][1] = 0

        // dicesFormation[attacker][sectorIndex][0] = sectors[attacker][`${attackWeapon}`] - attackMainCnt
        // dicesFormation[attacker][sectorIndex][1] = attackMainCnt
    }
    // console.log(dicesFormation)

    // console.log(sectorPower)

    return [dicesFormation, sectorPower]




    // console.log(sectors)

    // return sectors


    // sectors를 참고하여 주사위들을 정렬한다

    // let first = this.order[0];
    // let firstKeyOrder = this.sectorKeysOrders[0];
    // let firstController = this.playerController[`${first}`];
    // let firstSector = this.sectors[0];
    // let firstBaseLineZ = firstController.diceWaitingAhchor.z;

    // // console.log(firstSector);

    // let second = this.order[1];
    // let secondKeyOrder = this.sectorKeysOrders[1];
    // let secondController = this.playerController[`${second}`]
    // let secondSector = this.sectors[1];
    // let secondBaseLineZ = secondController.diceWaitingAhchor.z;
    // // console.log(secondSector)

    // var lastBaseLineX = firstController.diceWaitingAhchor.x - 1.5;


    // for (let i = 0; i < 6; i++) {
    //     // firstSector와 secondSector의 i번째 주사위 갯수를 확인, 이동 실시

    //     // 선공 주사위 이동
    //     let firstKey = firstKeyOrder[i]
    //     let index = 0;
    //     for (let key in firstSector[`${firstKey}`]) {
    //         let firstAttackDice = firstSector[`${firstKey}`][`${key}`]
    //         let pos = {};
    //         pos.z = firstBaseLineZ;
    //         pos.y = 0.5
    //         pos.x = lastBaseLineX + index * 1.3;
    //         let height = i * 1.5 + 2;
    //         // console.log(firstAttackDice)
    //         firstAttackDice.moveTo(height, pos)

    //         index++;
    //     }

    //     let secondKey = secondKeyOrder[i]
    //     index = 0;
    //     for (let key in secondSector[`${secondKey}`]) {
    //         let secondAttackDice = secondSector[`${secondKey}`][`${key}`]
    //         let pos = {};
    //         pos.z = secondBaseLineZ;
    //         pos.y = 0.5
    //         pos.x = lastBaseLineX + index * 1.3;
    //         let height = i * 1.5 + 2;
    //         secondAttackDice.moveTo(height, pos)

    //         index++;
    //     }

    //     lastBaseLineX =
    //         lastBaseLineX + 0.5 + 1.3 *
    //         Math.max(
    //             Object.keys(firstSector[`${firstKey}`]).length,
    //             Object.keys(secondSector[`${secondKey}`]).length)
    // }




}



export { SetDicesDir, GetDiceFormation, GetDiceSector }