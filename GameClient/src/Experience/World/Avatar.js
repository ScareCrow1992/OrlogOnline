import * as THREE from 'three'
import Experience from '../Experience.js'
// import Token from './Token.js'
import Token from './Token_Pool.js'
import HealingBall from './HealingBall.js'

export default class Avatar{
    constructor(anchorSign) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.token_pool = new Token(anchorSign)

        // data
        this.dices = [];
        this.diceDictionary = {};

        this.token_dices = []
        this.tokenDiceDictionary = {}

        this.godFavors = [];
        this.godFavorDictionary = {};
        
        this.healthStones = [];
        this.healthStoneDictionary = {}
        this.health = 15
        this.health_anim_index
        
        this.tokens = [];

        this.tray = new THREE.Vector3();

        this.bowl

        this.frostbite = 0



        // 주사위 대기열
        this.chosenDicesSite = []
        this.chosenDicesSite_token = []
        this.waitingDicesSite = [];
        this.actionEndDicesSite = [];
        this.diceChosenIndex = []; // this.diceWaitingIndex[i] : i 주사위의 chosenDicesSite 내의 index

        this.diceChosenIndex_token = []
       

        this.sortedDiceForBattle = []

        // anchors
        this.diceStartAnchor = new THREE.Vector3(0, 5, 12.5 * anchorSign)
        this.diceChosenAnchor = new THREE.Vector3(4, 0.5, 2 * anchorSign);
        this.diceWaitingAnchor = new THREE.Vector3(-9, 0.5, 2 * anchorSign);
        this.actionEndAnchor = new THREE.Vector3(4 * anchorSign, 0.5, 9.75 * anchorSign);
        this.tokenStackAnchor = new THREE.Vector3(4 * anchorSign, 0, 4 * anchorSign)
        this.godFavorAnchor = new THREE.Vector3(4.5 * anchorSign, 0.1, 7.375 * anchorSign)
        this.healthStoneAnchor = new THREE.Vector3(-3.9 * anchorSign, 0.25, 6 * anchorSign)
        this.coinAnchor = new THREE.Vector3(-13, 0.15 / 2, 6 * anchorSign)
        // this.coinAnchor = new THREE.Vector3(12, 0.15 / 2, 6 * anchorSign)
        this.anchorSign = anchorSign
        this.doubleCubeAnchor = new THREE.Vector3(-12, -50, 5 * anchorSign)

        // let tmpgeo = new THREE.CylinderGeometry( 1, 1, 0.15, 32 )
        // let tmpmat = new THREE.MeshStandardMaterial({color : "red"})
        // let tmpbox = new THREE.Mesh(tmpgeo, tmpmat)
        // this.experience.scene.add(tmpbox)
        // tmpbox.position.copy(this.coinAnchor)

        this.eventEmitter
        this.index
        
        // this.setDebug()

        // this.PrintAnchors()

        this.tokens_need_init = []
        this.tokens_need_destroy = []


        // window.addEventListener("keydown", (event) => {
        //     if (event.key === "s")
        //         this.CreateNewToken(this.GetNextTokenPosition())


        //     if (event.key === "d") {
        //         this.SpendToken(1)
        //     }

        //     if(event.key === "f"){
        //         this.Token_Destroy_Immediately(1)
        //         this.Token_Destroy_Animation()
        //     }

        //     if (event.key === "g") {
        //         let user = this.anchorSign > 0 ? "bottom" : "top"
        //         console.log("[ avatar ]",user, this.tokens.length)
        //         console.log("[ pool ]", this.token_pool.user, this.token_pool.index_queue)
        //     }
            

        // })

        // setTimeout(()=>{

        //     for (let i = 0; i < 21; i++) {
        //             this.CreateNewToken(this.GetNextTokenPosition())    
        //     }
        // }, 2500)

    }


    get max_hp(){
        return 15 - this.frostbite
    }


    InitialGame(info){
        this.ResetRound()

        // this.tokens.forEach(token=>{
        //     token.destroy()
        // })
        this.tokens = []
        
        this.token_pool.Clear()

        this.healthStones.forEach(healthStone=>{
            let position = healthStone.GetPosition().clone()
            position.y = this.healthStoneAnchor.y
            // healthStone.MoveTo(position)
            healthStone.SetPosition(position)
            healthStone.eventEmitter = this.eventEmitter;
            healthStone.avatarIndex = this.index;
            healthStone.InitialGame()
        })
        this.health = 15
        this.health_anim_index = 15

        let damageHealth = this.health - info.health
        // this.health = info.health
        for (let i = 0; i < damageHealth; i++)
            this.GetTargetHealthStone(null)


        let addedToken = info.token
        for (let i = 0; i < addedToken; i++) {
            this.CreateNewToken(this.GetNextTokenPosition())
        }

        this.godFavors.forEach(godFavor=>{
            godFavor.moveTo(new THREE.Vector3(0, 0, -20))
        })

        
            
        this.godFavors.length = 0

        
        this.dices.forEach(dice => dice.InitialGame())



        // this.health = info.health

    }



    GameOver(){
        this.ResetRound()

        // this.tokens.forEach(token=>{
        //     token.destroy()
        // })

        this.token_pool.GameOver()
        this.tokens = []

        this.healthStones.forEach(healthStone=>{
            let position = healthStone.GetPosition().clone()
            position.y = this.healthStoneAnchor.y
            // healthStone.MoveTo(position)
            healthStone.SetPosition(position)
            healthStone.eventEmitter = this.eventEmitter;
            healthStone.avatarIndex = this.index;
            healthStone.InitialGame()
        })
        this.health = 15
        this.frostbite = 0

        this.dices.forEach((dice, index)=>{
            this.DiceToActionEnd(dice, index)
            dice.GameOver()
        })

        // this.token_dices.forEach((dice, index)=>{
        //     this.DiceToActionEnd(dice, 6 + index)
        // })

        this.godFavors.forEach((godFavor)=>{
            godFavor.GameOver()
        })

        this.bowl.Reset_Position()

    }


    OrganizeTable(){
        let pos = this.tray.clone()
        pos.z +=  7 * this.anchorSign

        this.bowl.Move(pos)

        this.healthStones.forEach(stone=>{
            stone.mesh.position.y = -5
        })

        this.dices.forEach(dice=>{
            dice.Organize(this.anchorSign)
        })
    }



    SetupTable(){
        let pos = this.tray.clone()

        this.bowl.Move(pos)

        this.healthStones.forEach(stone=>{
            stone.mesh.position.y = this.healthStoneAnchor.y
        })

        this.dices.forEach(dice=>{
            dice.Setup(this.anchorSign)
        })
    }


    GetDicesIndexsOnCondition(condition){
        let indexes = []
        this.dices.forEach((dice,index)=>{
            if(condition(dice) && dice.state != "ban")
                indexes.push(index)
        })
        return indexes
    }



    GetDiceMarks(){
        let marks = []
        this.sortedDiceForBattle.forEach(dice=>{
            if(dice.state !== "ban")
                marks.push(...dice.getMarks())
        })

        return marks;
    }

    GetDiceMark_Single(){

    }


    GetSortedDiceForBattle(){
        return this.sortedDiceForBattle;
    }


    ResetRound(){
        this.chosenDicesSite = []
        this.chosenDicesSite_token = []
        this.waitingDicesSite = []
        this.actionEndDicesSite = []
        this.diceChosenIndex = []
        this.diceChosenIndex_token = []

        this.health_anim_index = this.health

        this.dices.forEach(dice=>{
            dice.ResetRound()
        })

        this.token_dices.forEach(dice=>{
            dice.ResetRound()
        })

    }

    DiceToActionEnd(dice, index){

        let pos = this.actionEndAnchor.clone()
        pos.x += index * this.anchorSign * 1.3
        let ret = dice.DiceToActionEnd(pos)
        return ret
        // promises.push(ret)
    }

    DicesToWaiting(chosenDicesIndex, chosenTokenIndex){
        // console.log(chosenDicesIndex);
        // DiceToWaiting(pos)

        // if(this.diceChosenIndex.includes(index))
        // chosenDice들을 x 좌표 기준으로 정렬한다
        let tmpDices = []
        chosenDicesIndex.forEach(chosenIndex=>{
            tmpDices.push({index : chosenIndex, x : this.dices[chosenIndex].getPosition().x})
        })

        tmpDices.sort((a,b)=>{return a.x - b.x})
        tmpDices.forEach((element,i)=>{
            chosenDicesIndex[i] = element.index
        })
        
        let nPosition = new THREE.Vector3()
        nPosition.copy(this.diceWaitingAnchor);
        nPosition.x += this.waitingDicesSite.length * 1.3

        let promises = []
        chosenDicesIndex.forEach(index => {
            let ret = this.dices[index].DiceToWaiting(nPosition)
            promises.push(ret)
            this.waitingDicesSite.push(this.dices[index])        
            nPosition.x +=  1.3
        })


        // tmpDices = []
        // chosenTokenIndex.forEach(chosenIndex=>{
        //     tmpDices.push({index : chosenIndex, x : this.token_dices[chosenIndex].getPosition().x})
        // })

        // console.log(chosenTokenIndex)
        // tmpDices.sort((a,b)=>{return a.x - b.x})
        // tmpDices.forEach((element,i)=>{
        //     chosenTokenIndex[i] = element.index
        // })
        

        // chosenTokenIndex.forEach(index => {
        //     let ret = this.token_dices[index].DiceToWaiting(nPosition)
        //     promises.push(ret)
        //     this.waitingDicesSite.push(this.token_dices[index])        
        //     nPosition.x +=  1.3
        // })


        this.chosenDicesSite = []
        this.chosenDicesSite_token = []
        return promises
    }


    Withdraw(){
        this.dices.forEach(dice=>{
            dice.Withdraw(this.diceStartAnchor)
        })
    }


    // diceFaces = [...INT]     (0~5 or -1 = 안굴림)
    RollDices(weapon_diceDirs, diceTransformLogs, token_diceDirs){
        // this.RetrieveDices()

        

        let logIndex = 0;
        let promises = []

        this.dices.forEach((dice, index) =>{
            if(weapon_diceDirs[index] != null){
                let ret = this.dices[index].Roll(weapon_diceDirs[index], diceTransformLogs[logIndex], this.diceStartAnchor)
                promises.push(ret)
                logIndex++;
            }
        })


        // this.token_dices.forEach((dice, index) =>{
        //     if(token_diceDirs[index] != null){
        //         let ret = this.token_dices[index].Roll(token_diceDirs[index], diceTransformLogs[logIndex], this.diceStartAnchor)
        //         promises.push(ret)
        //         logIndex++;
        //     }
        // })

        return promises
    }


    PhysicsRollDices(){
        this.dices.forEach(dice=>{
            dice.PhysicsRoll();
        })
    }

    /*
    CalcRolledDiceTransform(diceFaces){
        let totalAngle = Math.random() * 2 * Math.PI;

        let diceInfos = [];
        diceInfos[0] = {}
        diceInfos[0].angle = 0.0;
        diceInfos[0].radius = Math.random() * 0.3;
        diceInfos[0].face = diceFaces[0]

        for (let i = 1; i < diceFaces.length; i++) {
            let diceInfo = {}
            diceInfo.angle = (2 * Math.PI * (i - Math.random() * 0.35)) / (5.0)
            diceInfo.radius = 1.4 + 0.5 * Math.random();
            diceInfo.face = diceFaces[i];
            diceInfos.push(diceInfo)
        }


        let ret = []
        diceInfos.forEach((diceInfo, index)=>{
            let position = new THREE.Vector3(
                diceInfo.radius * Math.cos(totalAngle + diceInfo.angle) + this.tray.x,
                0.5,
                diceInfo.radius * Math.sin(totalAngle + diceInfo.angle) + this.tray.z
            )
            
            let face = diceInfo.face;
            let rotation = Math.PI * 2 * Math.random();

            ret[index] = {}
            ret[index].position = position;
            ret[index].face = face;
            ret[index].rotation = rotation;

            // this.dices[index].roll(position, face, rotation)
        })

        return ret
    }
    */

    // return = {type : "dice", index : 0}
    checkSelectedObject(obj){
        if(obj.getID() in this.diceDictionary){
            // console.log(this.diceDictionary[obj.getID()])
            return {type : "dice", index : this.diceDictionary[obj.getID()].index}
        }

        if(obj.getID() in this.tokenDiceDictionary){
            // console.log(this.diceDictionary[obj.getID()])
            return {type : "tokendice", index : this.tokenDiceDictionary[obj.getID()].index}
        }

        if(obj.getID() in this.godFavorDictionary){
            let godfavor_ = this.godFavorDictionary[obj.getID()]

            return {type : "godfavor", index : godfavor_.index, info : godfavor_.obj.info }
        }

        
        if(obj.getID() in this.healthStoneDictionary){
            return {type : "healthstone", index : this.healthStoneDictionary[obj.getID()].index}
        }   
    }

    FindFromDictionary(obj_id){
        if(obj_id in this.diceDictionary){
            // console.log(this.diceDictionary[obj.getID()])
            return this.diceDictionary[obj_id].obj
        }

        if(obj_id in this.godFavorDictionary){
            return this.godFavorDictionary[obj_id].obj
        }

        
        if(obj_id in this.healthStoneDictionary){
            return this.healthStoneDictionary[obj_id].obj
        }

        return null
    }


    PhaseStart(phase_){
        switch(phase_){
            case "godfavor":
                this.dices.forEach(dice=>{
                    dice.TokenMark_Hightlight_On()
                })
                break;


            case "resolution":
                this.dices.forEach(dice=>{
                    dice.TokenMark_Hightlight_Off()
                })
                break;
        }
    }


    SetDiceFormation(diceFormation, game_style){
        this.sortedDiceForBattle = []

        // this.waitingDicesSite 의 주사우들을 선형탐색하여 diceFormation 정보에 맞게끔 정렬시킨다.
        // console.log(diceFormation)


        let weaponsOnSector = diceFormation.weapons
        let actionPosition = this.diceWaitingAnchor.clone()

        if (game_style === "modern"){
            this.token_dices.forEach((dice, moveOrder)=>{
                dice.MoveToAction(actionPosition.clone(), moveOrder)
                actionPosition.x += 1.3
            })
            actionPosition.x += 0.5 
        }
        else
            actionPosition.x = this.diceWaitingAnchor.x + 1

        let moveOrder = 0
        let baseLine = actionPosition.x;
        let promises = []
        for(let sectorIndex = 0; sectorIndex < 6; sectorIndex++){
            let weaponOnSector = weaponsOnSector[sectorIndex]

            this.dices.forEach((dice, index)=>{
                // console.log(dice.state)
                if(dice.state !== "ban" && dice.getWeapon() == weaponOnSector){
                    // console.log(`${index}-th dice is formationed`)
                    this.sortedDiceForBattle.push(dice)
                    let ret = dice.MoveToAction(actionPosition.clone(), moveOrder)
                    promises.push(ret)
                    actionPosition.x += 1.3
                    moveOrder++
                    dice.state = "waiting"
                }
            })
            // actionPosition.x += 0.5
            baseLine += (1.3 * diceFormation[`${sectorIndex}`] + 0.5)
            actionPosition.x = baseLine
        }

        // console.log(this.sortedDiceForBattle)

        
        return promises
    }


    // 대기열을 확인하여 적절한 장소로 fly 시킨다.
    // 이전에 작성했던 코드들을 참고할것
    ChooseDice(diceIndex, phase){
        let emptyIndex;
        for (emptyIndex = 0; emptyIndex < 6; emptyIndex++)
            if (this.chosenDicesSite[emptyIndex] == null)
                break;

        let nPosition = new THREE.Vector3

        switch(phase){
            case "roll":
                nPosition.copy(this.diceChosenAnchor);
                nPosition.x += (emptyIndex * 1.3);
        
                this.chosenDicesSite[emptyIndex] = this.dices[diceIndex]
                this.diceChosenIndex[diceIndex] = emptyIndex;

                break;

            case "godfavor":
                nPosition.copy(this.dices[diceIndex].getPosition())
                nPosition.y += 3

                break;
        }

        
        let prom = this.dices[diceIndex].ChooseDice(nPosition, phase)

        return prom
    }


    CancleDice(diceIndex, phase){
        let prom = this.dices[diceIndex].CancleDice(phase)
        this.chosenDicesSite[this.diceChosenIndex[diceIndex]] = null
        this.diceChosenIndex[diceIndex] = -1

        return prom
    }


    ClickDice(diceIndex, phase){
        let diceState = this.dices[diceIndex].GetDiceState()
        if(diceState === "tray" || diceState === "waiting"){
            return this.ChooseDice(diceIndex, phase)
        }
        else if(diceState === "chosen" || diceState === "levitation"){
            return this.CancleDice(diceIndex, phase)
        }
    }





    
    ChooseDice_Token(diceIndex){
        let emptyIndex;
        for (emptyIndex = 0; emptyIndex < 2; emptyIndex++)
            if (this.chosenDicesSite_token[emptyIndex] == null)
                break;

        let nPosition = new THREE.Vector3

        nPosition.copy(this.diceChosenAnchor);
        nPosition.z -= 1.95;
        nPosition.x += (emptyIndex * 1.3);

        this.chosenDicesSite_token[emptyIndex] = this.token_dices[diceIndex]
        this.diceChosenIndex_token[diceIndex] = emptyIndex;

        console.log(diceIndex, nPosition)
        let prom = this.token_dices[diceIndex].ChooseDice(nPosition, "roll")

        return prom
    }


    CancleDice_Token(diceIndex){
        let prom = this.token_dices[diceIndex].CancleDice("roll")
        this.chosenDicesSite_token[this.diceChosenIndex_token[diceIndex]] = null
        this.diceChosenIndex_token[diceIndex] = -1

        return prom
    }



    ClickDice_Token(diceIndex){
        let diceState = this.token_dices[diceIndex].GetDiceState()
        if(diceState === "tray"){
            return this.ChooseDice_Token(diceIndex)
        }
        else if(diceState === "chosen"){
            return this.CancleDice_Token(diceIndex)
        }

    }


    // Token_Disappear(){
    //     // this.tokens.forEach((token)=>{token.Disappear()})
    //     let token = this.tokens.pop()
    //     if(token == undefined)
    //         return

    //     token.Disappear()
    //     setTimeout(()=>{
    //         this.Token_Disappear()
    //     }, 100)


    // }


    // Token_Appear(){
    //     this.tokens.forEach((token)=>{token.Appear()})

    // }


    GetDiceState(index){
        return this.dices[index].GetDiceState()
    }

    GodFavorPower(index, level){
        

        // 사용 가능 여부 확인
        // 상대의 방해때문에 사용 못할 수 있음
        this.godFavors[index].Power(level)

    }


    Get_FireWorks_Position(){
        let pos = this.healthStoneAnchor.clone()
        pos.setX(pos.x + this.anchorSign * (-2.25))
        pos.setY(3.5)
        return pos
    }


    // Get_HealthStoneAnchor(){
    //     return this.healthStoneAnchor.clone()
    // }

    Get_HealthStone_Area_Center() {
        return this.healthStones[7].GetPosition().clone()
    }


    AddOtherToken(stealed_token){
        // this.tokens.push(newToken)
        // let new_token = stealed_token.steal_callback()
        // let new_token = new Token(this.GetNextTokenPosition())
        let new_token = this.token_pool.NewToken(this.GetNextTokenPosition())
        this.tokens.push(new_token)

        return new_token
    }


    Check_Token_FreeSpace(){
        return this.tokens.length < 50
    }

    GetToken(dicesWithTokenIndex){
        let promises = []
        dicesWithTokenIndex.forEach(index=>{
            let dicePosition = this.dices[index].getPosition()
            
            let prom = this.CreateNewToken(dicePosition)
            promises.push(prom)
        })
        return promises
    }



    GetToken_Modern(token_create_info){
        let promises = []
        token_create_info.forEach((cnt, index)=>{
            let token_dice = this.token_dices[index]
            let dicePosition = token_dice.getPosition().clone()

            for(let i=0; i<cnt; i++){
                let prom = this.CreateNewToken(dicePosition)
                promises.push(prom)

                dicePosition.y += 0.2
            }
        })


        return Promise.all(promises).then(()=>{
            this.DiceToActionEnd(this.token_dices[0], 6)
            this.DiceToActionEnd(this.token_dices[1], 7)
        })
    }


    SpendToken(cnt) {
        let promises = []
        if (this.eventEmitter)
            this.eventEmitter.trigger(`${this.index}-use-token`, [cnt])

        for (let i = 0; i < cnt; i++) {
            if (this.tokens.length == 0)
                return;

            promises.push(this.tokens.pop().Spend())
            this.token_pool.ReturnToken()

            if (this.eventEmitter) {
                this.eventEmitter.trigger(`${this.index}-use-token-anim`, [this.GetNextTokenPosition()])
            }
        }

        return Promise.all(promises)
    }

    CreateNewToken(from){
        if(this.tokens.length >= 50)
            return null
        
        // console.log(this.tokens.length)

        // let token = new Token(from, this.anchorSign)
        let token = this.token_pool.NewToken(from)
        let to = this.GetNextTokenPosition()
        let prom = token.initialMove(to)
        this.tokens.push(token)

        return prom
    }



    Token_Destroy_Immediately(cnt) {
        let lost_cnt = 0
        for (let i = 0; i < cnt; i++) {
            if (this.tokens.length == 0)
                return;

            this.tokens_need_destroy.unshift(this.tokens.pop())
            this.token_pool.ReturnToken()
            lost_cnt++
        }

        return lost_cnt
    }


    Token_Destroy_Animation() {
        let token = this.tokens_need_destroy.pop()
        if (token == undefined)
            return;
        else {
            // token.Disappear()
            token.Spend()
            this.Token_Destroy_Animation()
            // setTimeout(() => { this.Token_Destroy_Animation() }, 150)
        }



        // while(true){
        //     let token = this.tokens_need_destroy.pop()
        //     if(token == undefined)
        //         break;
        //     else{
        //         token.Disappear()
        //     }            
        // }
    }


    Token_Create_Immediately(){
        if(this.tokens.length >= 50)
            return

        let pos = this.GetNextTokenPosition()
        // let token = new Token(pos, this.anchorSign)
        let token = this.token_pool.NewToken(pos)
        this.tokens.push(token)
        this.tokens_need_init.unshift(token)

    }


    Token_Initial_Animation(from){
        let token = this.tokens_need_init.pop()
        if(token === undefined)
            return;

        token.Set_Begin_Position_Effect(from)
        token.initialMove(from, true)
    }


    GetNextTokenPosition() {
        let newTokenSite = new THREE.Vector3(0, 0, 0)
        let cnt = this.tokens.length

        let unit_length = 1.3

        let origin = this.tokenStackAnchor.clone()
        if(this.anchorSign < 0){
            origin.z += this.anchorSign * unit_length * 0.5
            origin.x += this.anchorSign * unit_length * 4
        }

        newTokenSite.z = (unit_length * Math.floor(cnt / 25)) + origin.z

        cnt = Math.floor(cnt % 25)
        newTokenSite.x = unit_length * Math.floor(cnt / 5) + origin.x

        newTokenSite.y = 0.2 + 0.3 * Math.floor(cnt % 5) + origin.y

        // newTokenSite.x *= this.anchorSign;
        // newTokenSite.z *= this.anchorSign;

        return newTokenSite;
    }

    GetHealth(){
        return this.health;
    }


    GetTokenLength(){
        return this.tokens.length
    }


    Get_Tokens_Area_Position(){
        let from = this.tokenStackAnchor.clone()
        let to = from.clone()

        to.setX(to.x + this.anchorSign * 1.3 * 4)


        return [from, to]
    }


    Get_Need_Heal_Positions(cnt){
        let positions_ = []

        for (let i = 0; i < cnt; i++) {
            let stone_index = this.health_anim_index + i;
            if(stone_index >= this.max_hp)
                break;


            positions_.push(this.healthStones[stone_index].GetPosition().clone())
        }

        return positions_
    }


    Get_Damage_Stones_Positions(damage){
        let positions_ = []
        for (let i = 0; i < damage; i++) {
            let stone_index = this.health_anim_index - 1 - i
            if(stone_index < 0)
                break;

            positions_.push(this.healthStones[stone_index].GetPosition().clone())
        }


        return positions_
    }

    DamageAnim(){
        this.experience.sound.Play_StoneShed()
        this.health_anim_index--;

    }



    GetLastHealthStone(){
        if (this.health > 0)
            return this.healthStones[this.health - 1]
        else
            return null;
    }

    GetTargetHealthStone(weaponType = null, needAnimSync = false) {
        let ret = null
        if (this.health > 0) {
            let healthStonePosition = this.healthStones[--this.health].GetPosition().clone()

            // console.log("명치공격", this.health_anim_index)

            // console.log(this.eventEmitter)

            // if(weaponType != null)

            if (this.eventEmitter) {
                this.eventEmitter.trigger(`${this.index}-damage-${weaponType}`, [healthStonePosition])
            }
            // this.eventEmitter.trigger(`${this.avatarIndex}-damage-${weapon_kind}-anim`,[this.GetPosition()]);
            // console.log(`${this.index}-damage-${weaponType}`)
            if (!needAnimSync) {
                // this.healthStones[this.health].mesh.position.y -= 5
                this.healthStones[this.health].Damaged()
            }
            ret = healthStonePosition
        }

        if (this.health <= 0) {
            this.experience.controller.FinishGame(this.index)
        }

        return ret;
    }


    GetDices_Top_Position_By_Indexes(indexes){
        let positions = this.GetDicesPosition_By_Indexes(indexes)
        positions.forEach(pos_=>{
            pos_.setComponent(1, 1)
        })

        return positions
    }


    GetDicesPosition_By_Indexes(indexes){
        let positions = []

        indexes.forEach(index_=>{
            let pos_ = this.dices[index_].getPosition().clone()
            positions.push(pos_)
        })

        return positions
    }


    Take_FrostBite(cnt){
        let index = 14 - (this.frostbite)
        this.frostbite += cnt

        let destroyed_stones = []
        let positions = []

        while(true){
            if(index < 0 || cnt == 0)
                break;

            positions.push(this.healthStones[index].GetPosition())

            console.log(index, this.health - 1)

            if (index == (this.health - 1)) {
                destroyed_stones.push(this.GetLastHealthStone())
                this.GetTargetHealthStone(null, true)
            }

            cnt--
            index--
        }


        return [positions, destroyed_stones]

    }



    ConvertDiceMark(weaponName, color, dicesIndex, changedValue, transforms){
        let promises = [], callbacks = []

        dicesIndex.forEach((index, i)=>{
            let dice = this.dices[index]
            let value = changedValue[i]
            let ret = dice.ConvertDiceMark(value, weaponName, color, transforms)
            promises.push(ret[0])
            callbacks.push(ret[1])
        })

        // this.dices.forEach(dice=>{
        //     if(condition(dice)){
        //         let ret = dice.ConvertDiceMark(cnt, weaponName, color, transforms)
        //         promises.push(ret[0])
        //         callbacks.push(ret[1])
        //     }
        // })
        return [promises, callbacks]
    }


    DecreaseDiceMark(color, dicesIndex, changedValue){
        let promises = [], callbacks = []

        dicesIndex.forEach((index, i)=>{
            let dice = this.dices[index]
            let value = changedValue[i]
            let ret = dice.DecreaseDiceMark(value, color)
            promises.push(ret[0])
            callbacks.push(ret[1])
        })

        return [promises, callbacks]
    }


    Highlighting_Marks(color, dicesIndex, duration){
        let promises = []
        dicesIndex.forEach((index, i)=>{
            let dice = this.dices[index]
            promises.push(dice.Highlighting_Mark(color, duration))
        })
    
        return Promise.all(promises)
    }



    HealthStones_Change_Color(hue_value){
        this.healthStones.forEach(stone=>{
            stone.ChangeMaterialColor(hue_value)
        })
    }


    HealthStones_Reset_Color(){
        this.healthStones.forEach(stone=>{
            stone.ResetMaterialColor()
        })
    }


    HealthStones_ShineOn(){
        console.log("Bloom Effect On")
        this.healthStones.forEach(stone=>{
            stone.Shine_On()
        })
    }    

    HealthStones_ShineOff(){
        this.healthStones.forEach(stone=>{
            stone.Shine_Off()
        })
    }    

    


    HealthStonesInteractOn() {
        let stones = []
        this.healthStones.forEach(stone => {
            if (stone.state === "fine")
                stones.push(stone)
        })

        this.experience.world.TurnOnInteract(stones)
    }


    HealthStonesInteractOff() {
        this.experience.world.TurnOffInteract(this.healthStones)
    }


    Heal(){
        // let promise
        if (this.health < this.max_hp) {
            // this.healthStones[this.health].mesh.position.y = this.healthStoneAnchor.y
            // console.log(this.healthStones[this.health])
            // this.healthStones[this.health].Recovery()
            // promise = this.healthStones[this.health].Blink()
            
            this.health++
        }
    }


    HealAnimation(animation_type = null){
        let promise
        if(this.health_anim_index < this.max_hp){
            this.healthStones[this.health_anim_index].Recovery(animation_type)
            promise = this.healthStones[this.health_anim_index].Blink()
            this.health_anim_index++;
        }
        return promise
    }


    async HealingBall_Animation(from_position, animation_type = null){

        if(this.health_anim_index < this.max_hp){
            // this to_position = this.Get_Need_Heal_Positions(1)
            
            let stone_index = this.health_anim_index;
            this.health_anim_index++

            // console.log("치유 필요", stone_index)

            let to_position = this.healthStones[stone_index].GetPosition().clone()
            
            let healing_ball = new HealingBall()
            await healing_ball.Move(from_position, to_position, 0.7)

            this.healthStones[stone_index].Recovery(animation_type)
            await this.healthStones[stone_index].Blink()
        }
    }


    BanDices(bannedDicesIndex){
        // this.dices.forEach(dice=>{
        //     if(dice.state === "levitation"){
        //         this.DiceToActionEnd(dice, 6)
        //         dice.state = "ban"
        //     }
        // })
        let promises = []
        bannedDicesIndex.forEach(index=>{
            let prom = this.DiceToActionEnd(this.dices[index], 25)
            promises.push(prom)
            this.dices[index].state = "ban"
        })
        return Promise.all(promises)
    }


    GetTargetToken(){
        // console.log(this.tokens)
        if(this.tokens.length > 0){
            let taken_token = this.tokens.pop()
            this.token_pool.ReturnToken()
            // taken_token.Taken()
            return taken_token
        }
        else
            return null
    }


    AddDices(nDices){
        this.dices.push(...nDices)

        nDices.forEach((nDice, index)=>{
            //0xbf009c #ff80e8

            this.diceDictionary[`${nDice.getID()}`] = {obj : nDice, index : 6 + index}

            nDice.setDiceMaterialColor(new THREE.Color(0xff80e8))
            nDice.isDisappeared = false
            nDice.DiceToActionEnd = function(){
                this.Disappear()
                return null
            }
        })
        // console.log(this.dices)
    }


    ReduceDices(cnt){
        for(let i=0; i<cnt; i++){
            let deletedDice = this.dices.pop()

            if(deletedDice.isDisappeared == false)
                deletedDice.Disappear()

            let diceID = deletedDice.getID()
            delete this.diceDictionary[`${diceID}`]
            this.experience.world.RemoveDice(deletedDice)
        }
    }

    GetAvatarInfo(){
        let dicesState = []
        this.dices.forEach(dice=>{
            dicesState.push(dice.GetDiceState())
        })

        let dicesState_token = []
        this.token_dices.forEach(dice=>{
            dicesState_token.push(dice.GetDiceState())
        })

        return {
            health : this.health,
            token : this.tokens.length,
            dicesState : dicesState,
            dicesState_token : dicesState_token
        }
    }


    ForceSync(info) {
        // info = {hp, token, dices = [{dir, state}, ...], godFavors}
        let hp_diff = info.health - this.GetHealth()

        if (hp_diff > 0) {
            for (let i = 0; i < hp_diff; i++) {
                this.Heal()
                this.HealAnimation()
            }
        }
        else if (hp_diff < 0) {
            hp_diff *= -1
            for (let i = 0; i < hp_diff; i++) {
                this.GetTargetHealthStone("none")
            }
        }

        let token_diff = info.token - this.tokens.length
        // console.log(token_diff)

        if (token_diff > 0) {
            for (let i = 0; i < token_diff; i++)
                this.CreateNewToken(this.GetNextTokenPosition())

        }
        else if (token_diff < 0) {
            this.SpendToken(token_diff * -1)
        }




        // console.log(info)

    }



    _DBG_SetDiceFaceColor(index){
        this.dices[index]._DBG_setFaceColor()

    }
    _DBG_ResetDiceFaceColor(index){
        this.dices[index]._DBG_resetFaceColor()
    }

    SetDiceMaterialColor(index, hsl){
        let color = new THREE.Color()
        color.setHSL(hsl[0], hsl[1], hsl[2])
        this.dices[index].setDiceMaterialColor(color)

    }

    ResetDiceMaterialColor(index){
        this.dices[index].resetDiceMaterialColor()
    }


    setDebug() {}


    PrintAnchors(){
        // this.diceStartAnchor = new THREE.Vector3(0, 5, 11.5 * anchorSign)
        // this.diceChosenAnchor = new THREE.Vector3(4, 0.5, 1.3 * anchorSign);
        // this.diceWaitingAnchor = new THREE.Vector3(-9, 0.5, 1.3 * anchorSign);
        // this.actionEndAnchor = new THREE.Vector3(4 * anchorSign, 0.5, 8 * anchorSign);
        // this.tokenStackAnchor = new THREE.Vector3(4, 0, 3.5 * anchorSign)
        // this.godFavorAnchor = new THREE.Vector3(4 * anchorSign, 0.5, 6 * anchorSign)
        // this.healthStoneAnchor = new THREE.Vector3(-3.9 * anchorSign, 0.5, 6 * anchorSign)
    
        let anchors = [this.diceStartAnchor, this.diceChosenAnchor, this.diceWaitingAnchor, this.actionEndAnchor, this.tokenStackAnchor, this.godFavorAnchor, this.healthStoneAnchor, this.coinAnchor, this.doubleCubeAnchor ]

        let anchor_geo = new THREE.BoxGeometry(1,1,1)
        anchors.forEach((anchor, index)=>{
            let anchor_mat = new THREE.MeshBasicMaterial({transparent : true, opacity : 0.5})
            anchor_mat.color.setHSL(index / anchors.length, 1, 0.5)
            console.log(index / anchors.length)

            let anchor_mesh = new THREE.Mesh(anchor_geo, anchor_mat)
            anchor_mesh.position.copy(anchor)
            this.scene.add(anchor_mesh)
        })
    
    
    }

}