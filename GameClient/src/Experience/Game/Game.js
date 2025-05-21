// import RollPhase from '../Phase/RollPhase.js'

// import Situation from './Data/Situation.js'


import * as superVisor from './Calculation/SuperVisor.js'
import * as RollPhase from './Calculation/RollPhase.js'
import * as GodFavorPhase from './Calculation/GodfavorPhase.js'
import * as ResolutionPhase from './Calculation/ResolutionPhase.js'

import * as LogicKit from './LogicKit.js'

import readline from 'readline'





export default class Game {
    constructor(controller, debug) {
        this.debug = debug
        this.controller = controller;

        
        this.caller = {
            "BellPushed" : (...params)=>{this.BellPushed(...params)},
            "objectSelected" : (...params)=>{this.objectSelected(...params)},
            "godFavorAction" : (...params)=>{this.godFavorAction(...params)}
        }

        if(debug)
            this.setDebug()

        this.InitialGame()




        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY)
            process.stdin.setRawMode(true);

        process.stdin.on('keypress', (chunk, key) => {
            if (key) {
                switch (key.name) {
                    case 'q':
                        process.exit();
                        break;

                    case 'r':
                        this.InitialGame();
                        break;
                }
            }


        });

    }

    MessageEnqueue(func, params){
        this.caller[`${func}`](...params)

    }



    InitialGame(){
        LogicKit.InitialGame()
        let getFirst = LogicKit.GetFirstPlayer()
        let situation = LogicKit._GetSituation()
        // console.log(situation)
        situation = JSON.parse(JSON.stringify(situation))
        this.controller.MessageEnqueue("InitialGame", [situation, getFirst])
        
        // this.PrepareCard()
    }

    GameStart(){
        LogicKit.InitialGame()
        let situation = LogicKit._GetSituation()

        situation = JSON.parse(JSON.stringify(situation))
        this.controller.MessageEnqueue("GameStart", [situation])

        this.StartRound()

    }



    StartRound(){
        console.log("start round!")

        let avatar = LogicKit.StartRound()
        this.controller.MessageEnqueue("StartRound", [])
        this.RollDices(avatar)
    }


    ResetRound() {
        let whoIsWinner = LogicKit.ResetRound()
        console.log(whoIsWinner)
        if (whoIsWinner == "none") {
            this.controller.MessageEnqueue("ResetRound", [])
            this.controller.MessageEnqueue("PhaseChange", ["resolution", "roll"])
        }

        return whoIsWinner
    }


    RollDices(avatar){
        

        let ret = LogicKit.RollDices(avatar)
        // ret = { func : "RollDices", params : [avatar, dirs, rollDicesCnt], isDicePickLimit : ret}

        
        let current_dices = [[], []]

        for(let dice_index = 0; dice_index < 6; dice_index++){
            current_dices[0].push(this.situation.player[0].dices[dice_index].dir)
            current_dices[1].push(this.situation.player[1].dices[dice_index].dir)
        }

        this.controller.MessageEnqueue(ret.func, [...ret.params, ...current_dices])

        if(ret.isDicePickLimit){
            // 마지막 차례이므로 강제로 턴을 종료시킨다
            this.BellPushed(avatar, true)
        }
    }    


    /* ret = { type : "dice", index : 0, avatar : "top" } */
    // 서버 전용으로 수정 필요
    objectSelected(objInfo, clientPhase){

        
        if(clientPhase !==  LogicKit.GetCurrentPhase()){
            console.log(`[client] : ${clientPhase},  [server] : ${LogicKit.GetCurrentPhase()}`)
            return
        }

        let ret = LogicKit.SelectObject(objInfo)
        // ret = {callback : callback, avatar : avatar, index : index}

        if(ret != null){
            switch(ret.callback){
                case "ChooseDice":
                    // this.controller.ChooseDice(ret.avatar, ret.index)    
                    this.controller.MessageEnqueue("ChooseDice", [ret.avatar, ret.index])
                break;

                case "CancleDice":
                    // this.controller.CancleDice(ret.avatar, ret.index)    
                    this.controller.MessageEnqueue("CancleDice", [ret.avatar, ret.index])
                break;
                
            }
        }
    
    }


    godFavorAction(godFavorIndex, level, user){
        // user가 사용할 능력을 game Situation에 저장한다.
        LogicKit.PrepareGodFavor(godFavorIndex, level, user)
        this.BellPushed(user)
    }

    SetDiceMaterialColor(color, index){
        // superVisor.setDiceMaterialColor(color,index);
    }


// avatarsInfo = [{}, {health : 11, token : 20, dicesState : ["tray", "tray", "chosen" ...]}]
    BellPushed(avatar, inputInfo, clientPhase = false, avatarsInfo){
        let currentPhase = LogicKit.GetCurrentPhase()
        if(clientPhase !==  currentPhase && clientPhase){
            // 클라이언트-서버간 데이터 정합성 미일치
            console.log(`[client] : ${clientPhase},  [server] : ${LogicKit.GetCurrentPhase()}`)
            return
        }


        if (currentPhase === "resolution") {
            let waitingUser = LogicKit.GetResolutionPhaseInputWaitUser(avatarsInfo, inputInfo, avatar)
            // console.log(waitingUser)
            // console.log(avatar)
            // console.log(inputInfo)
            if (avatar === waitingUser)
                this.ResolutionPhaseCommand()
        }
        else if(currentPhase === "cardselect"){
            // param = { user : 0, godfavors [0, 6, 9]}
            // console.log("printed here")
            let canStartGame = LogicKit.GodFavorCardsPick(inputInfo.user, inputInfo.godfavors)
            if(canStartGame)
                this.GameStart()
        }   
        else{
            let ret, diceFormation, playerOrder, sectorPower, changedPhase
            [ret, diceFormation, playerOrder, sectorPower, changedPhase] = LogicKit.BellPushed(`${avatar}`, inputInfo, avatarsInfo)
            
            
    
            if(ret.isCallback)
                this.BellPushed_Waiting(ret.func, ret.params)
    
            switch(ret.nextAction){
                case "RollDice":
                    this.BellPushed_RollDice(avatar)
                    break;
                case "RollPhaseEnd":
                    this.BellPushed_RollPhaseEnd(diceFormation, playerOrder)
                    break;
    
                case "GodFavorEnd":
                    this.BellPushed_GodFavorEnd()
                    break;
            }
        }
    }
    
    BellPushed_Waiting(func, params){
        this.controller.MessageEnqueue(func, params)
    }


    BellPushed_RollDice(avatar){
        this.RollDices(1 - avatar)
    }


    BellPushed_RollPhaseEnd(diceFormation, playerOrder){
        this.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])
        this.controller.MessageEnqueue("PhaseChange", ["roll", "godfavor"])
    }


    BellPushed_GodFavorEnd(){
        this.controller.MessageEnqueue("PhaseChange", ["godfavor", "resolution"])
        setTimeout(()=>{this.ResolutionPhasePrepare()}, 2500)
    }


    CreateResolutionPhaseCallChain(){
        
    }



    GodFavor(godFavorAction, callback = null){

        delete godFavorAction.power
        // delete godFavorAction.targetGodFavor

        this.controller.MessageEnqueue("GodFavorAction", [godFavorAction])

        if (callback != null && callback) {
            this.cb = callback
            return this.cb(LogicKit)
        }
    }


    RegisterGodfavorAction(callbacks, godFavorAction){
        let situation = LogicKit._GetSituation()
        
        // if(godFavorAction.registerTrigger){
        // LogicKit.registerTrigger(godFavorAction.registerTrigger)
        // }

        callbacks.push(() => {
            godFavorAction.power(situation)
            // this.GodFavor(godFavorAction)   // 원본 이외의 데이터가 필요
            this.GodFavor(godFavorAction)
        })

        if (godFavorAction.postProcess) {
            callbacks.push(() => { godFavorAction.postProcess(LogicKit, this.controller) })
        }


        if (godFavorAction.canExecution) {
            callbacks.push(() => { return godFavorAction.canExecution() })
        }

        if (godFavorAction.extraInput) {
            callbacks.push(() => { godFavorAction.extraInput(LogicKit, this) })
        }

        if (godFavorAction.registerTrigger) {
            callbacks.push(() => { godFavorAction.registerTrigger(superVisor) })
        }

    }



    ResolutionPhasePrepare(){
        let callbacks = []
        let godFavorActions = LogicKit.GodFavorAction()

        godFavorActions[0].forEach(godFavorAction => {
            this.RegisterGodfavorAction(callbacks, godFavorAction)
        })

        // Resolution Phase Start
        callbacks.push(() => {
            let playerOrder = LogicKit.GetPlayerOrder()
            let dicesWithTokenIndex = LogicKit.GetToken()
            this.GetToken(playerOrder, dicesWithTokenIndex)
        })

        callbacks.push(() => {
            this.ResolutionPhaseMiddle()
        })

        godFavorActions[1].forEach(godFavorAction => {
            this.RegisterGodfavorAction(callbacks, godFavorAction)
        })

        callbacks.push(()=>{this.RoundEnd()})

        // callbacks.forEach(callback=>{
        //     callback()
        // })

        console.log("push the resolution commands")
        LogicKit.PushResolutionPhaseCommands(callbacks)

        this.ResolutionPhaseCommand()
    }




    // __ResolutionPhasePrepare__(){
    //     let callbacks = []
    //     let godFavorActions = LogicKit.GodFavorAction()
        
    //     godFavorActions[0].forEach(godFavorAction => {
    //         // RegistetrGodfavorAction(callbacks, godFavorAction)
    //         let cb = () => {
    //             // let callback = LogicKit.ActivateGodFavorPower(godFavorAction)
    //             let callback = godFavorAction.power(LogicKit._GetSituation())
    //             return this.GodFavor(godFavorAction, callback)
    //         }
    //         callbacks.push(cb)

    //         if (godFavorAction.extraInput)
    //             callbacks.push(() => { godFavorAction.extraInput(godFavorAction.level, LogicKit, this) })
    //             // console.log(godFavorAction)
    //     })

    //     // Resolution Phase Start
    //     callbacks.push(()=>{
    //         let playerOrder = LogicKit.GetPlayerOrder()
    //         let dicesWithTokenIndex = LogicKit.GetToken()
    //         this.GetToken(playerOrder, dicesWithTokenIndex)
    //     })

    //     callbacks.push(() => {
    //         this.ResolutionPhaseMiddle()
    //     })

    //     godFavorActions[1].forEach(godFavorAction => {
    //         let cb = () => {
    //             godFavorAction.power(LogicKit._GetSituation())
    //             this.GodFavor(godFavorAction)
    //         }
    //         callbacks.push(cb)
    //     })

    //     callbacks.push(()=>{this.RoundEnd()})

    //     // callbacks.forEach(callback=>{
    //     //     callback()
    //     // })

    //     console.log("push the resolution commands")
    //     LogicKit.PushResolutionPhaseCommands(callbacks)

    //     this.ResolutionPhaseCommand()
    // }


    ResolutionPhaseCommand(){
        // console.log("start")
        while(true){
            let cmd = LogicKit.GetNextResolutionPhaseCommand()
            // console.log(cmd)
            if(cmd == null){
                break;
            }
            // console.log("!!!!!Game Logic is Go On!!!!!")
            this.cmd_ = cmd
            let needInput = this.cmd_()
            // console.log("needInput ? = " + needInput)
            // needInput = 추가 입력이 필요한 유저
            if(needInput == 0 || needInput == 1){
                LogicKit.WaitForPlayerInputAtResolutionPhase(needInput)

                console.log("it's need input")
                break;
            }
        }
        // console.log("end")
    }


    // ResolutionPhaseBegin(){
    //     let playerOrder = LogicKit.GetPlayerOrder()
    //     let dicesWithTokenIndex = LogicKit.GetToken()
    //     this.GetToken(playerOrder, dicesWithTokenIndex)
        
    //     let godFavorActions = LogicKit.GodFavorAction()
    //     godFavorActions[0].forEach(godFavorAction=>{
    //         let callback = LogicKit.ActivateGodFavorPower(godFavorAction)
    //         this.GodFavor(godFavorAction, callback)
    //     })

        



    // }


    ResolutionPhaseMiddle(){
        let playerOrder = LogicKit.GetPlayerOrder()
        let sectorsInfo = LogicKit.GetDiceSector()
        let dicesCommand, battleResult, dicesFormation
        [dicesCommand, battleResult, dicesFormation]  = LogicKit.GetBattleInformation(sectorsInfo)
        this.Battle(playerOrder, dicesCommand, dicesFormation)

    }


    ResolutionPhaseEnd(){
        godFavorActions[1].forEach(godFavorAction=>{
            LogicKit.ActivateGodFavorPower(godFavorAction)
            this.GodFavor(godFavorAction, null)
        })

        // console.log(godFavorActions[1])
        this.RoundEnd()
    }


    GetToken(playerOrder, dicesWithTokenIndex){
        this.controller.MessageEnqueue("GetToken", [playerOrder, dicesWithTokenIndex])
    }


    Battle(playerOrder, dicesCommand, dicesFormation){
        console.log(dicesCommand)
        console.log(dicesFormation)
        this.controller.MessageEnqueue("DiceBattle", [dicesCommand, playerOrder, dicesFormation])
    }


    RoundEnd(){
        let whoIsWinner = this.ResetRound()
        if(whoIsWinner == "none")
            this.StartRound()
    }


    setDebug() {
        if (this.debug.active) {

            // window.addEventListener('keydown', e=>{
            //     if(e.key == "r"){
            //         // game reset
            //         this.InitialGame();

            //     }
            // })


            this.situationViewerDom = document.getElementById("situation-viewer")
            this.situationViewerHeader = document.getElementById("situation-header")
            this.situationViewerTop = document.getElementById("situation-top")
            this.situationViewerBottom = document.getElementById("situation-bottom")

            let dummy = 0;
            
            this.mainfolder = this.debug.ui.addFolder("Game");
            this.mainfolder.add(this,"_DBG_ConsoleReset")
                .name("[Console] Refresh")
            this.mainfolder.add(this,"_DBG_ConsoleFold")
                .name("[Console] Fold")
            this.mainfolder.add(this,"_DBG_ConsoleUnfold")
                .name("[Console] Unfold")
            this.mainfolder.add(this,"GetToken")
                .name("[Game] GetToken")


            let avatars = [0, 1]

            this.info = {
                "0" : {
                    rollDices : ()=>{this.RollDices(0)},
                    PhysicsRollDices : ()=>{this.PhysicsRollDices(0)},
                    bellPushed : ()=>{this.BellPushed(0)},
                    dice : 0,
                    chooseDice : ()=>{superVisor.DEV_ChooseDice(0, this.info[0].dice, this.controller)},
                    cancleDice : ()=>{superVisor.DEV_CancleDice(0, this.info[0].dice, this.controller)},
                    turnOndiceColor : ()=>{this._DBG_TurnOnDiceColor(0)},
                    turnOffdiceColor : ()=>{this._DBG_TurnOffDiceColor(0)},
                    turnOnFaceColor : ()=>{this._DBG_TurnOnFaceColor(0)},
                    turnOffFaceColor : ()=>{this._DBG_TurnOffFaceColor(0)}
                },
                "1" : {
                    rollDices : ()=>{this.RollDices(1)},
                    PhysicsRollDices : ()=>{this.PhysicsRollDices(1)},
                    bellPushed : ()=>{this.BellPushed(1)},
                    dice : 0,
                    chooseDice : ()=>{superVisor.DEV_ChooseDice(1, this.info[1].dice, this.controller)},
                    cancleDice : ()=>{superVisor.DEV_CancleDice(1, this.info[1].dice, this.controller)},
                    turnOndiceColor : ()=>{this._DBG_TurnOnDiceColor(1)},
                    turnOffdiceColor : ()=>{this._DBG_TurnOffDiceColor(1)},
                    turnOnFaceColor : ()=>{this._DBG_TurnOnFaceColor(1)},
                    turnOffFaceColor : ()=>{this._DBG_TurnOffFaceColor(1)}
                }
            }


            this._DBG_GodFavorInfo = {
                user : 1,
                level : 1,
                godfavorIndex : 0,
                cost_ : 0
            }
            this.godFavor = this.debug.ui.addFolder(`God Favor`);
            this.godFavor.add(this._DBG_GodFavorInfo, "user", [0, 1, 2])
            this.godFavor.add(this._DBG_GodFavorInfo, "level", [0, 1, 2])
            this.godFavor.add(this._DBG_GodFavorInfo, "godfavorIndex", [0, 1, 2])
            this.godFavor.add(this, "_DBG_GodFavorAction")


            // _DBG_GodFavorAction


            avatars.forEach(avatar => {
                this.debugFolder = this.debug.ui.addFolder(`${avatar}`);
            
                this.debugFolder.add(this.info[`${avatar}`], "rollDices").name("[Avatar] Roll Dices")
                // this.debugFolder.add(this.info[`${avatar}`], "physicsRollDices").name("[Avatar] Physics Roll Dices")
                this.debugFolder.add(this.info[`${avatar}`], "bellPushed").name("[Avatar] Bell Pushed")

                this.debugFolder.add(this.info[`${avatar}`], "turnOndiceColor").name("[Visual] Turn On Dice Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOffdiceColor").name("[Visual] Turn Off Dice Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOnFaceColor").name("[Visual] Turn On Face Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOffFaceColor").name("[Visual] Turn Off Face Color")


                this.debugFolder.add(this.info[`${avatar}`], "dice", {"red" : 0, "yellow" : 1, "green" : 2, "sky" : 3, "blue" : 4, "purple" : 5})
                .name("[Dice] Select")

                this.debugFolder.add(this.info[`${avatar}`], "chooseDice").name("[Dice] Choose")
                this.debugFolder.add(this.info[`${avatar}`], "cancleDice").name("[Dice] Cancle")

            })
        }
    }

    printSituation(obj, head){
        let ret = ""
        if(typeof obj === "object"){
            for (const [key, value] of Object.entries(obj)){
            // Object.keys(obj).forEach(key => {
                ret += `\n${head}${key} : `
                ret += this.printSituation(value, head + "　　")
                ret += ` `
            }
        }
        else if(Array.isArray(obj)){
            obj.forEach(value => {
                ret += this.printSituation(value, head + ", ")
            })
        }
        else if(typeof obj === "function"){
        }
        else{
            return obj;
        }

        return ret;
    }


    
    _DBG_ConsoleReset(){
        // console.log(LogicKit.superVisor)
        let situation = LogicKit._GetSituation()
        this.situationViewerHeader.innerText = `
            phase : ${situation.phase}
            turnNum : ${situation.turnNum}
            order : ${situation.order}
        `
        this.situationViewerTop.innerText = this.printSituation(situation.player[0], "")
        this.situationViewerBottom.innerText = this.printSituation(situation.player[1], "")

    }

    _DBG_ConsoleFold(){
        this.situationViewerDom.classList.remove("visible")
    }

    _DBG_ConsoleUnfold(){
       this.situationViewerDom.classList.add("visible")
    }



    _DBG_TurnOnDiceColor(avatar_){
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()){
            let hue = index / avatar.dices.length
            avatar.SetDiceMaterialColor(index, [hue, 1, 0.75]);
        }
            
    }


    _DBG_TurnOffDiceColor(avatar_){
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()){
            avatar.ResetDiceMaterialColor(index);
        }

    }


    _DBG_TurnOnFaceColor(avatar_){
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()){
            avatar._DBG_SetDiceFaceColor(index)
        }        
    }
    

    _DBG_TurnOffFaceColor(avatar_){
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()){
            avatar._DBG_ResetDiceFaceColor(index)
        }        
    }

    /*
    this._DBG_GodFavorInfo = {
        user : 0,
        level : 0,
        godfavorIndex : 0,
        cost_ : 0
    }
    */



    _DBG_GodFavorAction(){
        this.controller.MessageEnqueue("GodFavorAction", [this._DBG_GodFavorInfo])
    }


    
        // this.experience.controller._GodFavorAction({user : 1, level : 2, cost_ : 0})


}