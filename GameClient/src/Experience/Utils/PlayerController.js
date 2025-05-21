import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
import Token from '../World/Token.js'
import gsap from 'gsap'

export default class PlayerController extends EventEmitter {
    constructor(playertype) {
        super()
        // console.log("create player controller")
        // {top, bottom}
        this.playerType = playertype;

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.anchorSign
        if (this.playerType === "top")
            this.anchorSign = -1;
        else
            this.anchorSign = 1;

        // this.tray = this.experience.world.tray[`${this.playerType}`]
        // console.log(this.tray);


        this.tray;
        this.dices = [];
        this.godFavors = [];

        this.diceChosenAhchor = new THREE.Vector3(4, 0, 1.3 * this.anchorSign);
        this.diceWaitingAhchor = new THREE.Vector3(-9, 0, 1.3 * this.anchorSign);
        this.actionEndAhchor = new THREE.Vector3(4 * this.anchorSign, 0, 7.5 * this.anchorSign);
        this.tokenStackAnchor = new THREE.Vector3(4, 0, 3 * this.anchorSign)
        this.godFavorAhchor = new THREE.Vector3(4 * this.anchorSign, 0.5, 6 * this.anchorSign)
        this.healthStoneAnchor = new THREE.Vector3(-3.9 * this.anchorSign, 0.5, 5.5 * this.anchorSign)

        this.actionEndDicesSite = [];
        this.chosenDicesSite = []
        this.waitingDicesSite = [];
        this.stackedTokenSite = [];
        this.healthStoneSite = [];

        this.health = 15;

        this.battleDiesCnt = 0;

        this.setDebug()

        this.roundStart();
        // console.log(this.diceWaitingSites);
    }

    usePower(godFavor, level){
        if(this.playerType == "bottom")
            this.experience.game.changeTurnButtonPushed(godFavor, level);
        else
            this.experience.game.changeTurnButtonDBGPushed(godFavor, level);
    }

    turnStart(isLast = false) {
        this.chosenDicesSite = Array.from({ length: 6 }, () => null)
        if (this.waitingDicesSite.length == 6) {
            // 턴을 즉시 다시 옮긴다.
            this.experience.game.changeTurn();
        }
        else {
            gsap.to(this, { ease: "none", delay: 0.05, duration: 0.7, onStart: () => { this.retrieveDices() }, onComplete: () => { this.rollDices() } })
            //retrieveDices
            //rollDices
            // console.log(isLast)
            if (isLast == true) {
                let anim = gsap.timeline()
                
                anim.to(this, {delay: 1.0, duration:0.6
                ,onStart : ()=>{
                    this.dices.forEach((dice, index) => {
                        if (dice.state == "tray") {
                            dice.state = "chosen"
                            this.chosenDicesSite[index] = dice
                        }
                    })
                    // console.log("lastturn")
                    
                }, onComplete : () => {
                    this.experience.game.changeTurn()
                }})

            }
        }
    }


    turnEnd() {
        this.endTrick()
    }


    roundStart() {
        this.chosenDicesSite = Array.from({ length: 6 }, () => null)
        this.waitingDicesSite = []
    }


    retrieveDices() {
        // this.dices = this.experience.world.dices;
        this.dices.forEach(dice => {
            dice.retrieve()
        })
    }

    rollDices() {
        // this.dices = this.experience.world.dices;
        let diceFaces = Object.keys(this.dices[0].symbolsNormal);
        let totalAngle = Math.random() * 2 * Math.PI;

        let positions = [];
        positions[0] = {}
        positions[0].angle = 0.0;
        positions[0].radius = Math.random() * 0.3;
        positions[0].upface = diceFaces[`${Math.floor(Math.min(Math.random() * 6, 5.99999))}`]

        for (let i = 1; i <= 5; i++) {
            let faceIndex = Math.floor(Math.min(Math.random() * 6, 5.999))
            if (faceIndex > 5.9999)
                faceIndex = 6;
            positions[i] = {}
            positions[i].angle = (2 * Math.PI * (i - Math.random() * 0.35)) / (5.0)
            positions[i].radius = 1.4 + 0.5 * Math.random();
            positions[i].upface = diceFaces[faceIndex];
        }

        this.dices.forEach((dice, index) => {
            let position = positions[index];

            let nPosition = new THREE.Vector3(
                position.radius * Math.cos(totalAngle + position.angle) + this.tray.mesh.position.x,
                0.5,
                position.radius * Math.sin(totalAngle + position.angle) + this.tray.mesh.position.z
            )

            let nFace = position.upface;
            let nRotation = Math.PI * 2 * Math.random();

            dice.roll(nPosition, nFace, nRotation);
        })
    }

    chooseDice(chosenDice) {
        if (chosenDice.state !== 'tray')
            return;

        // 비어있는 site를 찾는다.
        let emptyIndex;
        for (emptyIndex = 0; emptyIndex < 6; emptyIndex++)
            if (this.chosenDicesSite[emptyIndex] == null)
                break;

        let nPosition = new THREE.Vector3
        nPosition.copy(this.diceChosenAhchor);
        nPosition.x += (emptyIndex * 1.3);

        if (chosenDice.choose(nPosition, emptyIndex))
            this.chosenDicesSite[emptyIndex] = chosenDice;
        // chosenDice.state = 'chosen';

        // console.log(this.chosenDicesSite);

        // 비어있는곳으로
    }


    cancleDice(cancledDice) {
        if (cancledDice.cancle()) {
            this.chosenDicesSite[cancledDice.watingIndex] = null;
            // cancledDice.state = 'tray';            
        }
    }

    // 주사위 굴리기 차례 끝내기
    endTrick() {
        // 1. 선택한 주사위를 좌측으로
        // 2. 

        let nPosition = new THREE.Vector3
        nPosition.copy(this.diceWaitingAhchor);
        nPosition.x += this.anchorSign * (this.chosenDicesSite.length * 1.3);

        // console.log(this.chosenDicesSite)

        this.chosenDicesSite.forEach(chosenDice => {
            if (chosenDice != null && chosenDice.wait(this.diceWaitingAhchor, this.waitingDicesSite.length)) {
                // console.log(this.waitingDicesSite.length);
                this.waitingDicesSite.push(chosenDice);
            }
        })

    }

    getToken(indexes) {
        // console.log(indexes)
        let x, y, z
        let newTokenSite
        indexes.forEach(index => {
            // this.dices[`${index}`].mesh.position.x += 1;
            let tokenDice = this.dices[`${index}`];
            // console.log(tokenDice)


            newTokenSite = this.getNextTokenPosition()

            let newToken = new Token(tokenDice.mesh.position.clone())
            this.stackedTokenSite.push(newToken);

            newToken.initialMove(newTokenSite);

        })
    }

    stealToken(targetToken) {
        let newTokenSite = this.getNextTokenPosition()

        targetToken.slideMove(newTokenSite);
        this.stackedTokenSite.push(targetToken)
    }

    getNextTokenPosition() {
        let newTokenSite = new THREE.Vector3(0, 0, 0)
        let cnt = this.stackedTokenSite.length

        newTokenSite.z = (1.3 * Math.floor(cnt / 25)) + this.anchorSign * this.tokenStackAnchor.z

        cnt = Math.floor(cnt % 25)
        newTokenSite.x = 1.3 * Math.floor(cnt / 5) + this.tokenStackAnchor.x

        newTokenSite.y = 0.2 + 0.25 * Math.floor(cnt % 5) + + this.tokenStackAnchor.y

        newTokenSite.x *= this.anchorSign;
        newTokenSite.z *= this.anchorSign;

        return newTokenSite;

    }

    diceClicked(clickedDice) {
        switch (clickedDice.state) {
            case "tray":
                this.chooseDice(clickedDice)
                break;

            case "chosen":
                this.cancleDice(clickedDice)
                break;
        }

    }

    dicesAction() {


    }


    getLastToken() {
        if (this.stackedTokenSite.length <= 0)
            return null;
        else
            return this.stackedTokenSite.pop();
    }



    getLastHealthStone() {
        if (this.health <= 0)
            return null;
        else
            return this.healthStoneSite[this.health - 1];
    }

    takeDamage() {
        if (this.health <= 0) {
            return null;
        }

        this.health--;


        if (this.health == 0) {
            // 게임 끝
        }
        // console.log(this.health);
    }


    takeHeal() {
        if (this.health >= 15) {
            return null;
        }

        // this.healthStoneSite[this.health].appear();

        this.health++;
        // console.log(this.health);

        // return this.healthStoneSite[this.health - 1];
    }

    diceBattleEnd(diceObj) {

        diceObj._DEBUG_roundReset(this.actionEndAhchor, this.battleDiesCnt++, this.anchorSign);

    }


    roundReset() {
        this.battleDiesCnt = 0;
        this.actionEndDicesSite = [];
        this.chosenDicesSite = []
        this.waitingDicesSite = [];
        this.roundStart()

    }


    _DBG_takeDamage() {
        this.health--;
        this.healthStoneSite[this.health].disappear()

        // healthstone의 애니메이션을 반환해야한다.
    }



    _DBG_takeHeal() {
        this.healthStoneSite[this.health].appear();
        this.health++;

    }


    _DEBUG_roundReset() {
        this.chosenDicesSite = []
        this.waitingDicesSite = [];


        // this.dices = this.experience.world.dices;
        this.dices.forEach((dice, index) => {
            dice._DEBUG_roundReset(this.actionEndAhchor, index, this.anchorSign);
        })

    }

    _DEBUG_choiseAllDice() {
        this.dices.forEach(dice => {
            dice.testChoise();
        })
    }

    setDebug() {
        if (this.debug.active) {

            // let chosenDiceGeo = new THREE.BoxGeometry(1, 1, 1, 1,1,1);
            // console.log(chosenDiceGeo);
            // let chosenDiceMat = new THREE.MeshStandardMaterial({ color: this.playerType === 'top' ? 'red' : 'green' });
            // chosenDiceMat.wireframe = true;
            // let chosenDiceMesh = new THREE.Mesh(chosenDiceGeo, chosenDiceMat);
            // this.scene.add(chosenDiceMesh);
            // chosenDiceMesh.position.x = 4;
            // chosenDiceMesh.position.z = 1.3 * this.anchorSign;

            // for (let i = 0; i < 6; i++) {
            //     let waitingDiceGeo = new THREE.BoxGeometry(1, 1, 1, 4,4,4);
            //     let waitingDiceMat = new THREE.MeshStandardMaterial({ color: this.playerType === 'top' ? 'red' : 'green' });
            //     waitingDiceMat.wireframe = true;
            //     let waitingDiceMesh = new THREE.Mesh(waitingDiceGeo, waitingDiceMat);
            //     this.scene.add(waitingDiceMesh);
            //     waitingDiceMesh.position.x = -7 + i * 1.3;
            //     waitingDiceMesh.position.z = 1.3 * this.anchorSign;
            // }

            // let actionEndDiceGeo = new THREE.BoxGeometry(1, 1, 1, 4,4,4);
            // let actionEndDiceMat = new THREE.MeshStandardMaterial({ color: this.playerType === 'top' ? 'red' : 'green' });
            // actionEndDiceMat.wireframe = true;
            // let actionEndDiceMesh = new THREE.Mesh(actionEndDiceGeo, actionEndDiceMat);
            // this.scene.add(actionEndDiceMesh);
            // actionEndDiceMesh.position.x = 4 * this.anchorSign;
            // actionEndDiceMesh.position.z = 7.5 * this.anchorSign;

            // console.log("wow");
            this.debugFolder = this.debug.ui.addFolder(`${this.playerType} player`);

            this.debugFolder
                .add(this, "rollDices")

            this.debugFolder
                .add(this, "retrieveDices")

            this.debugFolder
                .add(this, "_DBG_takeDamage")

            this.debugFolder
                .add(this, "_DBG_takeHeal")

            this.debugFolder
                .add(this, "endTrick")

            this.debugFolder
                .add(this, "_DEBUG_roundReset")

            this.debugFolder
                .add(this, "_DEBUG_choiseAllDice")


        }
    }

}