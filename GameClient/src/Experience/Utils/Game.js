import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
import PlayerController from './PlayerController.js'
import Weapon from '../World/Model/Weapon.js'
import gsap from 'gsap'
// import RollPhase from '../Phase/RollPhase.js'


// 서버의 역할을 임시로 맡는다.

export default class Game extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        // sectorKeysOrders[0] : 선공의 sector 별 주사위 배치
        // sectorKeysOrders[1] : 후공의 sector 별 주사위 배치
        this.sectorKeysOrders = [
            ["axe", "arrow", "helmet", "shield", "steal", "none"],
            ["helmet", "shield", "axe", "arrow", "none", "steal"]
        ]

        this.phase = "Roll" //["Roll", "God Favor", "Resolution phase"]

        // 0 : 선공 공격, 1 : 후공 공격
        this.whoIsAttackOnSector = [0, 0, 1, 1, 0, 1];
        // this.order[this.whoIsAttackOnSector[sectorIndex]] : 해당 sector에서의 공격자

        this.order = ["bottom", "top"]  // 턴 종료 마다 swap 된다.

        this.waitingPlayer=[false, false]// top, bottom
        this.usedGodFavor = {
            top : {},
            bottom : {}
        }


        this.sectors = [{/*First Dices (선공 주사위)*/ }, {/*Second Dices (후공 주사위)*/ }]

        // sectorFaces[sectorIndex][공격 0 / 방어 1 / 명치 2][face index]
        // sectorFaces[sectorIndex][공격 / 방어][face index] : 서로 공격을 주고 받는다
        // sectorFaces[sectorIndex][명치][face index] : 특수행동(명치 공격 or 토큰 스틸)
        this.sectorFaces;
        //  [[[주사위 face],[],[]], [[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]];

        this.playerController = {
            top: new PlayerController("top"),
            bottom: new PlayerController("bottom")
        };



        this.dbg_battle = {
            attacker: "bottom",
            defender: "top",
            attackDice: 0,
            defenceDice: 0,
            attackWeapon: "arrow",
            defenceWeapon: "shield",
            battleSimulationSector: 0
        }


        this.setDebug()

        this.diceRollCnt = 0;

        this.pipeLine = gsap.timeline()

    }


    gameStart() {
        this.roundStart()
    }

    roundStart() {
        this.phase = "Roll"
        let firstPlayer = this.order[0]
        let firstController = this.playerController[`${firstPlayer}`]
        firstController.turnStart()
    }

    roundReset() {
        this.phase = "Roll"
        this.playerController.top.roundReset();
        this.playerController.bottom.roundReset();

        this.diceRollCnt = 0;

        let first = this.order[0]
        let second = this.order[1]
        this.order[1] = first
        this.order[0] = second

    }

    changeTurnButtonPushed(godFavor = null, level = null){
        if(this.order[this.diceRollCnt % 2] == "bottom" && this.phase== "Roll")
            this.changeTurn()
        else if(this.phase == "GodFavor"){
            this.usedGodFavor.bottom.godFavor = godFavor;
            this.usedGodFavor.bottom.level = level;
            
            this.endGodFavorSelection(0)
        }
    }

    changeTurnButtonDBGPushed(godFavor = null, level = null){
        if(this.order[this.diceRollCnt % 2] == "top" && this.phase== "Roll")
            this.changeTurn()
        else if(this.phase == "GodFavor"){
            this.usedGodFavor.top.godFavor = godFavor;
            this.usedGodFavor.top.level = level;

            this.endGodFavorSelection(1)
        }
    }


    endGodFavorSelection(index){
        this.waitingPlayer[index] = true;
        if(this.waitingPlayer[0] == true && this.waitingPlayer[1] == true){
            this.waitingPlayer[0] = false;
            this.waitingPlayer[1] = false;

            this.StartBattlePhase();
        }
    }

    // trigger
    // playerPosition = "top" or "bottom"
    TurnEnd(playerPosition){



    }




    // player : "top" or "bottom"
    // player 가 시작할 차례
    changeTurn() {

        // prev turn processing
        let prevPlayer = this.order[this.diceRollCnt % 2];
        // 선택한 돌들을 모두 옮긴다.
        // 모든 상호작용을 정지시킨다.
        let prevController = this.playerController[`${prevPlayer}`]
        prevController.turnEnd()


        // let situation = {
        //     turnNum : this.diceRollCnt,
        //     diceInTrays : []
        // }

        // let a = this.order[this.diceRollCnt % 2]
        // let b = this.playerController[`${a}`]
        // b.dices.forEach(dice => {
        //     situation.diceInTrays.push(dice.state == "tray")
        // })

        // let information = RollPhase(situation)
        // console.log(information)


        // next  turnprocessing
        // 주사위를 굴린다
        // 상호작용을 재개한다
        this.diceRollCnt++;

        if (this.diceRollCnt == 6) {
            // 전투단계 시작

            this.phase = "GodFavor"
            gsap.to(this, { delay: 0.8, duration: 1.0, onStart: () => { this.SetDicesFormation() }, onComplete: () => {this.GodFavorPhase()}})


            // this.StartBattlePhase()

        }
        else {


            let nextPlayer = this.order[this.diceRollCnt % 2]
            let nextController = this.playerController[`${nextPlayer}`]

            if (this.diceRollCnt >= 4) {
                // 던진 주사위를 곧바로 배치시킨다
                nextController.turnStart(true)

            }
            else {
                // 선택권을 준다
                nextController.turnStart()
            }
        }


    }


    dbg_sectorColorOn() {
        this.sectorFaces = [];
        //[[[],[],[]], [[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]];
        // let attacker = this.whoIsAttackOnSector.index;
        // let defender = attacker =="top" ? "bottom" : "top"

        // this.sector[0] : 선공 주사위
        // this.sector[1] : 후공 주사위
        // this.sector[0].arrow = [...] : 선공측의 arrow 주사위들 (순서대로 배치됨)

        for (let sectorIndex = 0; sectorIndex < 6; sectorIndex++) {
            this.sectorFaces.push([[], [], []]);
            let diceIndex = 0;
            let attackIndex = this.whoIsAttackOnSector[sectorIndex]
            let defenceIndex = 1 - attackIndex;

            let attackMark = this.sectorKeysOrders[attackIndex][sectorIndex]
            let defenceMark = this.sectorKeysOrders[defenceIndex][sectorIndex]

            let attackSector = this.sectors[attackIndex][`${attackMark}`];
            let defenceSector = this.sectors[defenceIndex][`${defenceMark}`];

            let hue = sectorIndex * (1 / 6);
            let newColor = new THREE.Color()
            diceIndex = 0;


            let attackFaces = []
            let defenceFaces = []


            attackSector.forEach(attackDice => {
                attackFaces.push(...attackDice.getTopFaceInstance())
            })

            // console.log(attackFaces)

            defenceSector.forEach(defenceDice => {
                defenceFaces.push(...defenceDice.getTopFaceInstance())
            })

            // console.log(defenceFaces)

            let faceIndex = 0;
            while (true) {
                if (attackFaces.length <= faceIndex || defenceFaces.length <= faceIndex)
                    break;

                this.sectorFaces[sectorIndex][0].push(attackFaces[faceIndex]);

                newColor.setHSL(hue, 1, 0.6)
                attackFaces[faceIndex].material.color.set(newColor);


                this.sectorFaces[sectorIndex][1].push(defenceFaces[faceIndex]);

                newColor.setHSL(hue, 1, 0.15)
                defenceFaces[faceIndex].material.color.set(newColor);

                faceIndex++;
            }

            while (true) {
                if (attackFaces.length <= faceIndex)
                    break;


                this.sectorFaces[sectorIndex][2].push(attackFaces[faceIndex]);

                newColor.setHSL(hue, 1, 0.5)
                attackFaces[faceIndex].material.color.set(newColor);

                faceIndex++
            }

        }
        // console.log(this.sectorFaces);
    }


    // this.sectorFaces[index] 에 속한 face들의 전투를 진행
    dbg_sectorBattleSimulation_Guard(sectorIndex) {

        let attackIndex = this.whoIsAttackOnSector[sectorIndex]
        let defenceIndex = 1 - attackIndex;

        let attacker = this.order[attackIndex]
        let defender = this.order[defenceIndex]


        let attackMark = this.sectorKeysOrders[attackIndex][sectorIndex]
        let defenceMark = this.sectorKeysOrders[defenceIndex][sectorIndex]


        let attCtrl = this.playerController[attacker]
        let defCtrl = this.playerController[defender]

        let sectorAnim = gsap.timeline();
        sectorAnim.addLabel("start")


        for (let faceIndex = 0; faceIndex < this.sectorFaces[sectorIndex][0].length; faceIndex++) {
            let attackFace = this.sectorFaces[sectorIndex][0][faceIndex]
            let defenceFace = this.sectorFaces[sectorIndex][1][faceIndex]


            let attackPosition = new THREE.Vector3()
            attackFace.getWorldPosition(attackPosition)
            let attWeapon = new Weapon(attackMark, attackPosition)

            let defencePosition = new THREE.Vector3()
            defenceFace.getWorldPosition(defencePosition)
            let defWeapon = new Weapon(defenceMark, defencePosition);


            attWeapon.appear();
            defWeapon.appear();

            attWeapon.setTarget(defWeapon);
            defWeapon.setTarget(attWeapon);

            sectorAnim.add(attWeapon.anim, "start");
        }

        sectorAnim.eventCallback("onComplete", ()=>{console.log(`${sectorIndex}-th guard battle is complete `)})

        // let atkFaces = 
    }


    dbg_sectorBattleSimulation_noGuard(sectorIndex) {
        let attackIndex = this.whoIsAttackOnSector[sectorIndex]
        let defenceIndex = 1 - attackIndex;

        let attacker = this.order[attackIndex]
        let defender = this.order[defenceIndex]


        let attackMark = this.sectorKeysOrders[attackIndex][sectorIndex]
        let defenceMark = this.sectorKeysOrders[defenceIndex][sectorIndex]


        let attCtrl = this.playerController[attacker]
        let defCtrl = this.playerController[defender]

        let sectorAnim = gsap.timeline();
        sectorAnim.addLabel("start")

        for (let faceIndex = 0; faceIndex < this.sectorFaces[sectorIndex][2].length; faceIndex++) {
            // 명치 : this.sectorFaces[sectorIndex][2][faceIndex]
            let attackFace = this.sectorFaces[sectorIndex][2][faceIndex]
            let attackPosition = new THREE.Vector3()
            attackFace.getWorldPosition(attackPosition)
            let attWeapon = new Weapon(attackMark, attackPosition)
            let defWeapon;
            
            switch (attackMark) {

                case "steal":
                    defWeapon = defCtrl.getLastToken();
                    if (defWeapon != null) {

                        attWeapon.appear();
                        attWeapon.setTarget(defWeapon)

                        attCtrl.stealToken(defWeapon);
                    }

                    break;

                default:
                    // 명치 공격
                    defWeapon = defCtrl.getLastHealthStone();

                    if (defWeapon != null) {
                        defCtrl.health--;


                        attWeapon.appear();
                        attWeapon.setTarget(defWeapon);

                        // attWeapon.action();
                    }


                    break;
            }
            sectorAnim.add(attWeapon.anim, "start");

            
        }
        sectorAnim.eventCallback("onComplete", ()=>{console.log(`${sectorIndex}-th animation is complete`)})
        // sectorAnim.eventCallback("onStart", ()=>{`${sectorIndex}-th animation is complete`})

    }



    dbg_sectorBattle() {
        this.dbg_sectorBattleSimulation(this.dbg_battle.battleSimulationSector)
    }


    sectorBattleEnd(sectorIndex) {
        // let attackIndex = this.whoIsAttackOnSector[sectorIndex]
        // let defenceIndex = 1 - attackIndex;

        let first = this.order[0];
        let firstController = this.playerController[`${first}`];
        let firstMark = this.sectorKeysOrders[0][sectorIndex]
        let firstSector = this.sectors[0][`${firstMark}`];

        // console.log(this.firstSector)
        firstSector.forEach(dice => {
            firstController.diceBattleEnd(dice)
        })



        let second = this.order[1];
        let secondController = this.playerController[`${second}`];
        let secondMark = this.sectorKeysOrders[1][sectorIndex]
        let secondSector = this.sectors[1][`${secondMark}`];

        secondSector.forEach(dice => {
            secondController.diceBattleEnd(dice)
        })

    }


    dbg_sectorBattleEnd() {
        this.sectorBattleEnd(this.dbg_battle.battleSimulationSector)
    }


    // 전투는 주사위가 아니라 face 단위로 이루어저야 한다.
    diceBattleSimulation(attFace, defFace) {

    }


    dbg_diceBattleSimulation() {
        let attCtrl = this.playerController[this.dbg_battle.attacker]
        let defCtrl = this.playerController[this.dbg_battle.defender]

        let attDice = this.playerController[this.dbg_battle.attacker].dices[this.dbg_battle.attackDice];
        let defDice = this.playerController[this.dbg_battle.defender].dices[this.dbg_battle.defenceDice];

        let attWeapon;
        let defWeapon;

        switch (this.dbg_battle.defenceDice) {
            case "healthstone":
                attWeapon = new Weapon(this.dbg_battle.attackWeapon, attDice.mesh.position)
                defWeapon = defCtrl.getLastHealthStone();

                if (defWeapon != null) {
                    defCtrl.health--;


                    attWeapon.appear();
                    attWeapon.setTarget(defWeapon);

                    // attWeapon.action();
                }


                break;

            case "token":
                defWeapon = defCtrl.getLastToken();
                if (defWeapon != null) {
                    attWeapon = new Weapon("steal", attDice.mesh.position)

                    attWeapon.appear();
                    attWeapon.setTarget(defWeapon)

                    attCtrl.stealToken(defWeapon);
                }

                break;

            default:
                attWeapon = new Weapon(this.dbg_battle.attackWeapon, attDice.mesh.position)
                // console.log(att)
                // console.log(def)
                defWeapon = new Weapon(this.dbg_battle.defenceWeapon, defDice.mesh.position);


                attWeapon.appear();
                defWeapon.appear();

                attWeapon.setTarget(defWeapon);
                defWeapon.setTarget(attWeapon);

                // attWeapon.action();
                // defWeapon.action();

                break;
        }

    }


    // 전투 개시 직전에 주사위들의 전열을 정리시킨다.
    // 필요한 주사위는 waitingDicesSite 에 들어있음
    SetDicesFormation() {
        // 선공 : axe -> arrow -> helmet -> shield -> steal -> none
        // 후공 :  helmet -> shield -> axe -> arrow -> none -> steal
        // 우선 sector를 위의 조건에 맞추어 차례대로 채운다.

        let firstPlayer = this.order.first;

        this.sectors = [[], []]

        this.sectorKeysOrders.forEach((sectorKeyOrder, order) => {
            sectorKeyOrder.forEach(sectorKey => {
                let player = this.order[order];
                this.sectors[order][`${sectorKey}`] = []
                // console.log(player)
                // console.log(this.playerController[`${player}`])
                this.playerController[`${player}`].waitingDicesSite.forEach(dice => {
                    if (dice.weapon === sectorKey)
                        this.sectors[order][`${sectorKey}`].push(dice);
                })
            })
        })


        // sectors를 참고하여 주사위들을 정렬한다

        let first = this.order[0];
        let firstKeyOrder = this.sectorKeysOrders[0];
        let firstController = this.playerController[`${first}`];
        let firstSector = this.sectors[0];
        let firstBaseLineZ = firstController.diceWaitingAhchor.z;
        // console.log(firstSector);

        let second = this.order[1];
        let secondKeyOrder = this.sectorKeysOrders[1];
        let secondController = this.playerController[`${second}`]
        let secondSector = this.sectors[1];
        let secondBaseLineZ = secondController.diceWaitingAhchor.z;
        // console.log(secondSector)

        var lastBaseLineX = firstController.diceWaitingAhchor.x - 1.5;


        for (let i = 0; i < 6; i++) {
            // firstSector와 secondSector의 i번째 주사위 갯수를 확인, 이동 실시

            // 선공 주사위 이동
            let firstKey = firstKeyOrder[i]
            let index = 0;
            for (let key in firstSector[`${firstKey}`]) {
                let firstAttackDice = firstSector[`${firstKey}`][`${key}`]
                let pos = {};
                pos.z = firstBaseLineZ;
                pos.y = 0.5
                pos.x = lastBaseLineX + index * 1.3;
                let height = i * 1.5 + 2;
                // console.log(firstAttackDice)
                firstAttackDice.moveTo(height, pos)

                index++;
            }

            let secondKey = secondKeyOrder[i]
            index = 0;
            for (let key in secondSector[`${secondKey}`]) {
                let secondAttackDice = secondSector[`${secondKey}`][`${key}`]
                let pos = {};
                pos.z = secondBaseLineZ;
                pos.y = 0.5
                pos.x = lastBaseLineX + index * 1.3;
                let height = i * 1.5 + 2;
                secondAttackDice.moveTo(height, pos)

                index++;
            }

            lastBaseLineX =
                lastBaseLineX + 0.5 + 1.3 *
                Math.max(
                    Object.keys(firstSector[`${firstKey}`]).length,
                    Object.keys(secondSector[`${secondKey}`]).length)
        }
    }


    getToken() {
        // 선공 토큰
        let first = this.order[0];
        let firstDices = this.playerController[`${first}`].dices
        let firstController = this.playerController[`${first}`];
        let firstTokenIndexes = []
        firstDices.forEach((dice, index) => {
            if (dice.upToken) {
                // dice.mesh.position.y+=1;
                firstTokenIndexes.push(index)
            }
        })
        firstController.getToken(firstTokenIndexes)


        let second = this.order[1];
        let secondDices = this.playerController[`${second}`].dices
        let secondController = this.playerController[`${second}`]
        let secondTokenIndexes = []
        secondDices.forEach((dice, index) => {
            if (dice.upToken) {
                // dice.mesh.position.y+=1;
                secondTokenIndexes.push(index)
            }
        })
        secondController.getToken(secondTokenIndexes)

    }


    GodFavorPhase(){
        // let anim = gsap.timeline()

        this.trigger("GodFavorPhaseOn");



    }




    StartBattlePhase() {
        var anim = gsap.timeline()
        // console.log("battle start!!")
        
        // 
        
        anim.to(this, { delay: 0.2, duration: 1.0, onStart: () => { this.getToken() } })

        anim.addLabel("start")

        // 전투 전 능력 발동 (우선순위 신경쓰기기)

        // console.log(this.usedGodFavor)
        // console.log(this.playerController.bottom.godFavors)
        // before 능력 발동
        if(this.usedGodFavor.bottom.godFavor != null){
            // before인지 확인 할것
            if(this.usedGodFavor.bottom.godFavor.canUseThePower(this.usedGodFavor.bottom.level)){
                this.usedGodFavor.bottom.godFavor.Power(this.usedGodFavor.bottom.level, anim)

            }
            else{
                // 능력사용 실패이지만, 일단은 사용할것
                this.usedGodFavor.bottom.godFavor.Power(this.usedGodFavor.bottom.level, anim)


            }



        }



        anim.to(this, {
            duration: 0.3, onStart: () => {
                this.dbg_sectorColorOn()
            }
        })
        anim.to(this, {
            duration: 0.5, onStart: () => {
                for (let sectorIndex = 0; sectorIndex < 6; sectorIndex++) {
                    if (this.sectorFaces[sectorIndex][0].length != 0) {
                        anim.to(this, {
                            duration: 1.4, onStart: () => {
                                this.dbg_sectorBattleSimulation_Guard(sectorIndex)
                            }
                        })
                    }

                    if(this.sectorFaces[sectorIndex][2].length != 0) {
                        anim.to(this, {
                            duration: 1.4, onStart: () => {
                                this.dbg_sectorBattleSimulation_noGuard(sectorIndex)
                            }
                        })
                    }

                    anim.to(this, {
                        duration: 0.8, onStart: () => {
                            this.sectorBattleEnd(sectorIndex)
                        }
                    })
                }
            }
        })



        //dbg_sectorBattleEnd
    }


    // this.dbg_battle = {
    //     attacker : "top",
    //     attackDice : 0,
    //     defenceDice : 0,
    //     attackWeapon : "arrow",
    // }

    setDebug() {
        if (this.debug.active) {
            // console.log("wow");
            this.debugFolder = this.debug.ui.addFolder(`Game`);

            this.debugFolder
                .add(this, "StartBattlePhase")

            this.debugFolder
                .add(this, "SetDicesFormation")

            this.debugFolder
                .add(this, "getToken")

            this.debugFolder
                .add(this.dbg_battle, "attacker", ['top', 'bottom'])

            this.debugFolder
                .add(this.dbg_battle, "defender", ['top', 'bottom'])

            this.debugFolder
                .add(this.dbg_battle, "attackDice", [0, 1, 2, 3, 4, 5])

            this.debugFolder
                .add(this.dbg_battle, "defenceDice", [0, 1, 2, 3, 4, 5, "healthstone", "token"])

            this.debugFolder
                .add(this.dbg_battle, "attackWeapon", ["arrow", "axe"])

            this.debugFolder
                .add(this.dbg_battle, "defenceWeapon", ["shield", "helmet"])

            this.debugFolder
                .add(this.dbg_battle, "battleSimulationSector", [0, 1, 2, 3, 4, 5]);

            this.debugFolder
                .add(this, "dbg_diceBattleSimulation")

            this.debugFolder
                .add(this, "dbg_sectorColorOn")

            this.debugFolder
                .add(this, "dbg_sectorBattle")

            this.debugFolder
                .add(this, "dbg_sectorBattleEnd")

            this.debugFolder
                .add(this, "roundReset")

        }
    }




}