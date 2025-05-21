import EventEmitter from "../Utils/EventEmitter.js";
import BattleSimulation from "../Game/Action/BattleSimulation.js";
import Experience from "../Experience.js";


let avatarsIndex = ["top","bottom"]
const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


export default class Controller {
    constructor(){
        this.experience = new Experience()
        this.physics = this.experience.physics
        this.ui = this.experience.ui
        this.inputAdmin // Express에서 초기화
        this.camera = this.experience.camera
        this.sound = this.experience.sound
        
        this.extraPickedDiceCnt = -1
        this.double_cube = null

        this.surrender = false


        // console.log(this.physics)

        // this.bluebird = this.experience.bluebird

        // this.flipCoin = this.experience.world.flipCoin

        this.avatars = {
            top: {},
            bottom: {},
            get 0(){
                return this[`${avatarsIndex[0]}`]
            },
            get 1(){
                return this[`${avatarsIndex[1]}`]
            }
        };

        this.godFavorCards;
        this.godFavorCardsState = []    // "tray", "chosen", "banned"
        // this.pickedGodFavorCardsIndex = [null, null, null]
        this.chosenGodFavorCardsCnt = 0


        this.messageQueue = []

        this.caller = {
            "StartRound" : (...params)=>{this._StartRound(...params)},
            "ResetRound" : (...params)=>{this._ResetRound(...params)},
            "InitialGame" : (...params)=>{this._InitialGame(...params)},
            "Liberty" : (...params)=>{this._Liberty(...params)},
            "Draft" : (...params)=>{this._Draft(...params)},
            "BanPickCardMove" : (...params)=>{this._BanPickCardMove(...params)},
            "SpecialRollDices" : (...params)=>{this._RollDices(...params)},
            "RollDices" : (...params)=>{this._RollDices(...params)},
            "DicesToWaiting" : (...param)=>{this._DicesToWaiting(...param)},
            "SetDiceFormation" : (...params)=>{this._SetDiceFormation(...params)},
            "GetToken" : (...params)=>{this._GetToken(...params)},
            "GetToken_Modern" : (...params)=>{this._GetToken_Modern(...params)},
            "DiceBattle" : (...params)=>{this._DiceBattle(...params)},
            "Sleep" : (...params)=>{this._Sleep(...params)},
            "PhaseChange" : (...params)=>{this._PhaseChange(...params)},
            "WaitForEmpty" : (...params)=>{this._WaitForEmpty(...params)},
            "PickGodfavor" : (...params)=>{this._PickGodfavor(...params)},
            "ChooseDice" : (...params)=>{this._ChooseDice(...params)},
            "CancleDice" : (...params)=>{this._CancleDice(...params)},
            "ClickDice" : (...params)=>{this._ClickDice(...params)},
            "ClickDice_Token" : (...params)=>{this._ClickDice_Token(...params)},
            "ExtraClickDice" : (...params)=>{this._ExtraClickDice(...params)},
            "NeedSwap" : (...params)=>{this._NeedSwap(...params)},
            "SelectGodFavorPower" : (...params)=>{this._SelectGodFavorPower(...params)},
            "GodFavorAction" : (...params)=>{this._GodFavorAction(...params)},
            "GodFavorExtraAction" : (...params)=>{this._GodFavorExtraAction(...params)},
            "BanDices" : (...params)=>{this._BanDices(...params)},
            "GameStart" : (...params)=>{this._GameStart(...params)},
            "GameOver" : (...params)=>{this._GameOver(...params)},
            "CheckReady" : (...params)=>{this._CheckReady(...params)},
            "BellPush" : (...params)=>{this._BellPush(...params)},
            "ExtraInputBegin" : (...params)=>{this._ExtraInputBegin(...params)},
            "DoubleGame" : (...params)=>{this._DoubleGame(...params)},
            "Ragnarok" : (...params)=>{this._Ragnarok(...params)},
            "Frostbite" : (...params)=>{this._Frostbite(...params)},
            "UserTag" : (...params)=>{this._UserTag(...params)}
        }

//GetToken_Modern

        this.stopTimer = ["BanPickCardMove","GameStart", "DicesToWaiting", "PhaseChange", "GodFavorExtraAction"]

        // this.startTimer = [""]

        //_NeedSwap

        // window.addEventListener("keydown", (event)=>{
        //     if (event.key == "k") {
        //         console.log(this.messageQueue)
        //         console.log("state : " + this.state)
        //         console.log("phase : " + this.phase)
        //     }

        // })

        this.callbacksOnRoundReset = []
        this.godFavorExtraAction = null

        this.state = false

        this.phase = "roll" // "cardselect", "roll", "godfavor", "resolution"
        this.game_mode

        this.eventEmitter = new EventEmitter()



        this.banned_card = {authorization : false, index:-1, instance : null}
        this.picked_card = {authorization : false, index:-1, instance : null}

        this.banned_card_cnt = 0
        this.picked_card_cnt = [0, 0]

        // this._NeedSwap()

        this.no_signal_callback = null

        this.experience.resources.on('ready', ()=>{        
            this.time = this.experience.time

            this.debug = this.experience.debug
            this.setDebug()

        })


        // this.dbg_check_ready_impossible = false
        // window.addEventListener("keydown", (event) => {
        //     if (event.key == "y") {
        //         // this.experience.SendCheck()
        //         this.dbg_check_ready_impossible = !this.dbg_check_ready_impossible
        //     }
        // })


    }




    // IsIdle(){
    //     return this.state
    // }

    MessageEnqueue(func, params, timer) {
        if (func == "ForceSync"){
            this.ForceSync(...params)
        }
        else {

            let eventEmitter = new EventEmitter()
            // let promise = new Promise((resolve) => {
            //     eventEmitter.on("trigger", (event) => { resolve(event) })
            // })
            params.push(eventEmitter)
            this.messageQueue.push({ func, params, timer })
            // console.log(this.messageQueue)
            // eventEmitter.trigger("trigger")
            // this.bird.MessageEnqueue(func,params)

            // return promise
        }

    }

    MessageDequeue() {
        if (this.messageQueue.length > 0) {
            let element = this.messageQueue.shift()
            // console.log(element.params)
            this.state = false;

            if(this.no_signal_callback != null){
                clearTimeout(this.no_signal_callback)
                this.no_signal_callback = null
            }

            if (element.timer > 0){
                this.ui.hideAlert()
                this.time.SetTimer(element.timer, false)
            }

            if (this.stopTimer.includes(element.func)){
                this.experience.time.StopTimer()
            }

            this.caller[`${element.func}`](...element.params)
            // console.log(this.caller[`${element.func}`])


        }
    }


    ClearMessageQueue(){
        this.messageQueue.length = 0
    }

    update(){
        this.EventLoop()
    }


    EventLoop(){
        if(this.state == true){
            this.MessageDequeue()
        }
    }


    FinishGame(loser){
        // this.ClearMessageQueue()
        // this.MessageEnqueue("ResetRound", [])
        // this.MessageEnqueue("GameOver", [1 - loser])
        this.state = true;
    }



    _GameStart(situation, game_mode, game_style) {

        let prom = new Promise((res)=>{res(0)})
        if(game_mode == "liberty" || game_mode == "draft"){
            prom = this.SetupTable()
        }

        prom.then(() => {
            this.phase = "roll"
            this.state = true

            this.avatars[`${avatarsIndex[0]}`].eventEmitter = this.eventEmitter
            this.avatars[`${avatarsIndex[0]}`].index = 0
            this.avatars[`${avatarsIndex[0]}`].InitialGame(situation.player[0])
            // this.avatars[`${avatarsIndex[0]}`].Withdraw()
            this.experience.world.AddThing(this.avatars[`${avatarsIndex[0]}`], situation.player[0], avatarsIndex[0])


            this.avatars[`${avatarsIndex[1]}`].eventEmitter = this.eventEmitter
            this.avatars[`${avatarsIndex[1]}`].index = 1
            this.avatars[`${avatarsIndex[1]}`].InitialGame(situation.player[1])
            // this.avatars[`${avatarsIndex[1]}`].Withdraw()
            this.experience.world.AddThing(this.avatars[`${avatarsIndex[1]}`], situation.player[1], avatarsIndex[1])

            this.experience.world.GameStart()
            // this.experience.world.FilterGodfavors()
        })
    }


    _GameOver(winner, score, game_mode){

        // console.log("winner : ", winner, "\nscore : ", score)
        this.ClearMessageQueue()

        // console.log("[[ score ]]")
        // console.log(score)
        let txt
        // console.log(`${avatarsIndex[winner]} is Win !!`)
        // let game_mode = this.experience.redbird.socket.game_mode
        let current_score
        if(avatarsIndex[winner] == "bottom"){
            txt = "WIN"
            current_score = window.PageAdmin.ChangeScore_Single(score, game_mode)
        }
        else if(avatarsIndex[winner] == "top"){
            txt = "DEFEAT"
            current_score = window.PageAdmin.ChangeScore_Single(-score, game_mode)
            score = -score
        }
        else{
            txt = "DRAW"
            // 브라우저를 새로고침 해야 함을 안내한다
        }


            
        this.ui.GameOver(txt, current_score, score)

        this.experience.GameOver()

        this.sound.StopBGM()
        this.sound.Play_Victory()

        setTimeout(() => {
            this.AfterGameOver()
        }, 8300)
        
    }


    AfterGameOver(){
        this._ResetRound()
        
        // this.callbacksOnRoundReset.forEach((callback)=>{
        //     // console.log(callback)
        //     callback()

        // })

        
        // this.avatars["top"].ResetRound()
        // this.avatars["bottom"].ResetRound()
        // this.inputAdmin.ResetRound()
        


        // inputadmin reset


        // ui reset
        // this.eventEmitter.reset()
        // this.inputAdmin.InitialGame()

        setTimeout(() => { 
            this.godFavorExtraAction = null
            this.phase = "roll"
            this.camera.IsometricView()
    
            this.avatars[0].GameOver()
            this.avatars[1].GameOver()
    
            this.state = false

            this.experience.world.GameOver()

            
            this.surrender = false
            avatarsIndex = ["top", "bottom"] 
        }, 2000)
    }


    Clear(){

    }


    _NeedSwap(){
        // console.log("avatars are swapped")
        // let avatarA = this.avatars.top
        // let avatarB = this.avatars.bottom

        // console.log(this.avatars.bottom.actionEndAnchor)

        // this.avatars = {
        //     top: avatarB,
        //     bottom : avatarA
        // }


        avatarsIndex[0] = "bottom"
        avatarsIndex[1] = "top"

        this.flipCoin.PlayerSwap()

        this.state = true;
        
        // console.log(this.avatars.bottom.actionEndAnchor)
    }


    _SelectGodFavorCard(mode){
        switch(mode){
            case "beginner":

            break;

            case "casual":

            break;

            case "expert":

            break;
        }
    }


    _PhaseChange(oldPhase, newPhase, params) {
        if (newPhase === "resolution") {
            params.forEach((param, index) => {
                if (param.godfavorIndex != -1) {
                    setTimeout(() => {
                        this.avatars[`${avatarsIndex[index]}`].godFavors[param.godfavorIndex].Highlight_On()
                    }, 1000)
                }
            })

            this.double_cube.StartResolutionPhase()
        }

        this.ui.phaseEnd(oldPhase)
        this.ui.phaseStart(newPhase)
        this.phase = newPhase

        this.avatars["top"].PhaseStart(this.phase)
        this.avatars["bottom"].PhaseStart(this.phase)
            

        // console.log(newPhase)
        setTimeout(() => { this.state = true }, 1500)
    }


    OrganizeTable(game_mode){
        this.avatars.top.OrganizeTable()
        this.avatars.bottom.OrganizeTable()
        this.experience.world.SetupTable()

        return this.experience.world.ArrangeCards(game_mode)
    }




    SetupTable() {
        // 카드를 흩어지게한다

        return new Promise((res) => {
            this.ui.hideDescription()
            this.ui.showAlertDuration("Ban & Pick Complete", 2.5)
            setTimeout(() => { res(1) }, 2500)
        })
            .then(() => this.experience.world.OrganizeCards())
            .then(() => {
                this.avatars.top.SetupTable()
                this.avatars.bottom.SetupTable()
                this.experience.world.OrganizeTable()

                this.camera.IsometricView()
            })

    }




    _InitialGame(situation, firstuser, game_mode, game_style){
        // this.camera.IsometricView()

        
        this.callbacksOnRoundReset = []

        this.banned_card_cnt = 0
        this.picked_card_cnt = [0, 0]

        this.phase = "roll"
        this.game_mode = game_mode
        this.game_style = game_style
        
        this.eventEmitter.reset()
        this.inputAdmin.InitialGame()

        this.flipCoin.SetFirstPlayer(firstuser)

        
        // this.experience.world.clock.SetUser(avatarsIndex[firstuser])
        this.experience.world.clock.Turn_Toggle(avatarsIndex[firstuser])

        this.avatars[`${avatarsIndex[0]}`].eventEmitter = this.eventEmitter
        this.avatars[`${avatarsIndex[0]}`].index = 0
        this.avatars[`${avatarsIndex[0]}`].InitialGame(situation.player[0])
        // this.avatars[`${avatarsIndex[0]}`].Withdraw()
        // this.experience.world.AddThing(this.avatars[`${avatarsIndex[0]}`], situation.player[0])
        
        this.avatars[`${avatarsIndex[1]}`].eventEmitter = this.eventEmitter
        this.avatars[`${avatarsIndex[1]}`].index = 1
        this.avatars[`${avatarsIndex[1]}`].InitialGame(situation.player[1])
        // this.avatars[`${avatarsIndex[1]}`].Withdraw()
        // this.experience.world.AddThing(this.avatars[`${avatarsIndex[1]}`], situation.player[1])


        
        this.godFavorCards = this.experience.world.godFavors["bottom"]
        this.godFavorCardsState = new Array(Object.keys(this.godFavorCards).length).fill("tray")
        this.chosenGodFavorCardsCnt = 0
        

        this.flipCoin.Flip(firstuser, 1.0).then(() => {
            let text = `${avatarsIndex[firstuser]} player is First`
            let duration = 1.5

            this.ui.viewDescriptionDuration(text, duration)

            switch(game_mode){
                case "constant" :
                    this.Ready_Constant()
                    break;

                case "liberty":
                    this.Ready_Liberty()

                    break;

                case "draft":
                    this.Ready_Draft()
                    break;

            }
        })

    }


    Ready_Constant() {
        this.phase = "roll"
        // console.log("Constant game start~")
        setTimeout(()=>{this.state = true}, 1500)
    }


    Ready_Liberty() {
        this.phase = "cardselect"
        // this.PrepareCard(first)

        new Promise((res) => { setTimeout(() => { res(1) }, 2300) })
            .then(() => {
                this.camera.Topview()
                return this.OrganizeTable("liberty")
            })
            .then(() => {
                // console.log("card select triggered")
                this.state = true;
                return null
            })

    }


    Ready_Draft() {
        this.phase = "cardselect"
        // this.PrepareCard(first)

        new Promise((res) => { setTimeout(() => { res(1) }, 2300) })
            .then(() => {
                this.camera.Topview()
                return this.OrganizeTable("draft")
            })
            .then(() => {
                // console.log("card select triggered")
                // this.inputAdmin.Trigger({ trigger: "CardSelect" })
                this.state = true;
                return this.ui.WriteOnNotice("Pick & Ban")
            })
    }


    PrepareCard(first) {


        setTimeout(() => {
            // this.flipCoin.Flip(first);
            // setTimeout(() => { this.ui.viewDescriptionDuration(text, duration) }, 800)
            setTimeout(() => {
                this.camera.Topview()
                    .then(() => {
                        return this.OrganizeTable()
                    })
                    .then(() => {
                        // this.inputAdmin.SetFilter({trigger : ""})
                        this.inputAdmin.Trigger({trigger : "CardSelect"})
                        this.state = true;
                        return this.ui.WriteOnNotice("Pick & Ban")
                        // temp
                        // this.camera.IsometricView()
                        // this.SetupTable()
                        // this.phase = "roll"
                        // this.state = true;
                        console.log("it's ready!!")
                    })
            }, 2300)

        }, 1000)

        // 카메라를 조정한다.
    }






    _StartRound(){
        // this.ui.phaseStart("roll")


        setTimeout(()=>{
            this.sound.PlayBGM();
            this.state = true;
        }, 750)
    }


    // dicesCommand = [[ 공방 횟수, 명치 횟수 ],[]]
    // [[선공], [후공]]
    _DiceBattle(dicesCommand, order, dicesFormation){
        // console.log(dicesCommand)
        this.ui.GodFavorPowerUI_Deactivate()
        let promise = BattleSimulation(dicesCommand, dicesFormation, order,this.avatars)
        promise.then((resolve)=>{
            // console.log(resolve);
            this.state = true;
            // event.trigger("trigger", [resolve])
        })
    }


    _ResetRound(){
        // console.log("[[[[ RESET ROUND ]]]]")
        // console.log(forced)
        // if(forced == false){
        this.ui.GodFavorPowerUI_Deactivate()
        this.ui.phaseEnd("resolution")
        // }

        this.eventEmitter.reset()

        setTimeout(()=>{
            this.callbacksOnRoundReset.forEach((callback)=>{
                // console.log(callback)
                callback()

            })

            // this.callbacksOnRoundReset_CallController.forEach((callback)=>{
            //     this.cb = callback
            //     console.log(cb)
            //     this.cb()
            // })

            this.flipCoin.FlyToNextAnchor()

            this.state = true
            this.callbacksOnRoundReset = []
        }, 400)
        
        
        this.avatars["top"].ResetRound()
        this.avatars["bottom"].ResetRound()
        this.inputAdmin.ResetRound()
        this.double_cube.ResetRound()

        this.godFavorExtraAction = null
    }


    _PickGodfavor(index, context) {
        let godFavorName = godFavorNames[index]
        let godFavorCard = this.godFavorCards[`${godFavorName}`]
        let card_state = this.godFavorCardsState[index]
        switch (this.game_mode) {
            case "liberty":
                this._PickGodfavor_Liberty(index, card_state, godFavorCard)
                break;

            case "draft":
                this._PickGodfavor_Draft(index, card_state, godFavorCard, context)
                break;
        }
    }


    _PickGodfavor_Liberty(index, card_state, godFavorCard) {
        // console.log(`${godFavorNames[index]} is picked`)
        
        let prom = null
        let pos

        switch (card_state) {
            case "tray":
                if (this.chosenGodFavorCardsCnt < 3) {
                    this.godFavorCardsState[index] = "chosen"
                    prom = godFavorCard.moveSlide(+2)
                    this.chosenGodFavorCardsCnt++
                }
                break;

            case "chosen":
                this.godFavorCardsState[index] = "tray"
                prom = godFavorCard.moveSlide(-2)
                this.chosenGodFavorCardsCnt--

                break;

            case "banned":

                break;
        }

        if (prom != null)
            prom.then(() => this.state = true)
        else
            this.state = true;
    }


    _PickGodfavor_Draft(index, card_state, godFavorCard, context) {
        if(card_state == "waiting")
            return;

        if(context)
            this._PickGodfavor_Draft_Ban(index, card_state, godFavorCard)
        else
            this._PickGodfavor_Draft_Pick(index, card_state, godFavorCard)    
    }


    _PickGodfavor_Draft_Pick(index, card_state, godFavorCard) {
        this.state = true;


        if(!this.picked_card.authorization)
            return;

        if(godFavorCard.state == "waiting" || godFavorCard.state == "banned_sign")
            return;

        if (this.banned_card.index == index) {
            this.banned_card.instance.Ban_Off()
            this.banned_card.instance.state = "tray"

            this.banned_card.index = -1
            this.banned_card.instance = null
        }

        let index_ = this.picked_card.index

        if (this.picked_card.index != -1) {
            this.picked_card.instance.Highlight_Off()
            this.picked_card.instance.state = "tray"

            this.picked_card.index = -1
            this.picked_card.instance = null
        }

        if (index_ == index)
            return;

        godFavorCard.Highlight_On()
        godFavorCard.state = "chosen"
        this.picked_card.index = index
        this.picked_card.instance = godFavorCard

    }


    _PickGodfavor_Draft_Ban(index, card_state, godFavorCard){
        this.state = true;

        if(!this.banned_card.authorization)
            return;

        if(godFavorCard.state == "waiting" || godFavorCard.state == "banned_sign")
            return;

        if(this.picked_card.index == index){
            this.picked_card.instance.Highlight_Off()
            this.picked_card.instance.state = "tray"

            this.picked_card.index = -1
            this.picked_card.instance = null
        }

        let index_ = this.banned_card.index

        if(this.banned_card.index != -1){
            this.banned_card.instance.Ban_Off()
            this.banned_card.instance.state = "tray"
            
            this.banned_card.index = -1
            this.banned_card.instance = null
        }

        if(index_ == index)
            return;

        godFavorCard.Ban_On()
        godFavorCard.state = "banned"
        this.banned_card.index = index
        this.banned_card.instance = godFavorCard

    }


    _Liberty() {
        this.experience.world.clock.Turn_Toggle("bottom")
        this.ui.WriteOnNotice("Free Choice")
        setTimeout(() => {
            this.ui.showDescription("Select 3 God favor cards.")
            this.inputAdmin.Trigger({ trigger: "CardSelect" })
            this.state = true
        }, 2500)
    }


    _Draft(user, turn, pick, ban){
        this.inputAdmin.Trigger({
            trigger : "Draft",
            user : avatarsIndex[user]
        })


        let txt
        if (turn == 0) txt = "Ban (right click)"
        else if (turn == 6) txt = "Pick (left click)"
        else txt = "Ban (right click) & Pick (left click)"

        if (avatarsIndex[user] == "bottom") {

            this.picked_card.index = -1
            this.banned_card.index = -1

            this.picked_card.instance = null
            this.banned_card.instance = null

            this.picked_card.authorization = pick
            this.banned_card.authorization = ban

            this.ui.showDescription(`Select for ${txt}`)
        }
        else {
            this.ui.showDescription(`Opponent in ${txt}`)
        }


        this.state = true
    }



    _BanPickCardMove(user, pick, ban){
        this.ui.hideDescription()

        
        let opponent = avatarsIndex[1 - user]
        this.experience.world.clock.Turn_Toggle(opponent)

        let avatar_dir = avatarsIndex[user]
        let prom_pick = new Promise((res)=>{res(1)})
        if(pick != null){
            prom_pick = this.experience.world.CardPickMove(avatar_dir, pick, this.picked_card_cnt[user])
            this.picked_card_cnt[user]++
        }

        let prom_ban = new Promise((res)=>{
            if(ban != null){
                prom_pick.then(()=>{
                    let prom_ban_ = this.experience.world.CardBanMove(avatar_dir, ban, this.banned_card_cnt)
                    this.banned_card_cnt++
                    prom_ban_.then(()=>{res(1)})
                })
            }
            else{
                res(1)
            }
        })
        
        Promise.all([prom_pick, prom_ban]).then(() => { this.state = true })
    }




    _ChooseDice(avatar, diceIndex){
        // console.log("choose dice")
        let prom = this.avatars[`${avatar}`].ChooseDice(diceIndex, this.phase)
        prom.then(()=>{this.state = true})
    }


    _CancleDice(avatar, diceIndex){
        let prom = this.avatars[`${avatar}`].CancleDice(diceIndex)
        prom.then(()=>{this.state = true})
    }


    _ClickDice(avatar, diceIndex){
        let prom = this.avatars[`${avatar}`].ClickDice(diceIndex, this.phase)
        prom.then((resolve)=>{
            this.state = true
            // console.log(resolve)
            // switch(resolve){
            //     case "choose":
            //         break;

            //     case "cancle":
            //         break;
            // }
        })


    }

    

    _ClickDice_Token(avatar, diceIndex){
        let prom = this.avatars[`${avatar}`].ClickDice_Token(diceIndex, this.phase)
        prom.then((resolve)=>{
            this.state = true
            // console.log(resolve)
            // switch(resolve){
            //     case "choose":
            //         break;

            //     case "cancle":
            //         break;
            // }
        })


    }


    _ExtraClickDice(avatar, diceIndex) {
        // console.log("Extra Click : " + this.extraPickedDiceCnt)
        let diceState = this.avatars[`${avatar}`].GetDiceState(diceIndex)
        // console.log(diceState)
        // "levitation" or "waiting"
        // console.log(this.extraPickedDiceCnt)
        if (diceState === "waiting") {
            if (this.extraPickedDiceCnt <= 0) {
                this.state = true
                return;
            }
            this.extraPickedDiceCnt--
        }
        else if(diceState === "levitation")
            this.extraPickedDiceCnt++

        this._ClickDice(avatar, diceIndex)
    }


    _RollDices(avatar, weapon_dirs, cnt, token_dirs){
        // console.log(arguments)

        // if(this.phase == "roll"){
        let user_
        if (avatarsIndex[avatar] == "top")
            user_ = 0
        else
            user_ = 1

        let cnt_ = Math.floor(this.inputAdmin.rollDicesCnt / 2)
        this.ui.RollDice(avatarsIndex[avatar], cnt_)
            // console.log(user_, cnt_)
        // }

        
        if(this.phase == "roll"){
            // this.experience.world.clock.SetUser(avatarsIndex[avatar])
            this.experience.world.clock.Turn_Toggle(avatarsIndex[avatar])
        }

        let simulation_cnt = cnt
        if(token_dirs[0] != null)
            simulation_cnt++

        if(token_dirs[1] != null)
            simulation_cnt++


        // let diceTransformLogs = this.GetRollDicesSimulation(simulation_cnt, avatar)

        this.GetRollDicesSimulation(simulation_cnt, avatar).then((diceTransformLogs)=>{
            shuffle(diceTransformLogs)

            let prom = this.avatars[`${avatar}`].RollDices(weapon_dirs, diceTransformLogs, token_dirs )
            Promise.all(prom).then(()=> {
                this.state = true
                // console.log("rolling dice is end")
                this.inputAdmin.Trigger({
                    trigger : "RollDice",
                    user : avatarsIndex[avatar],
                    game_style : this.game_style
                })
            })
        })

    }

    _ExtraInputDice(cnt, mine, opponent){
        if(mine == true){
            // 내 주사위 선택 가능
        }

        if(opponent == true){
            // 상대방 주사위 선택 가능
        }

    }


    _ExtraInputHealth(){

    }

    GetAvatarsIndex(){
        return avatarsIndex
    }

    _BanDices(user, bannedDicesIndex){
        let promises = this.avatars[user].BanDices(bannedDicesIndex)
        promises.then(()=>{this.state = true})
    }


    _GodFavorExtraAction(param) {
        this.ui.hideDescription()
        if (this.godFavorExtraAction != null) {

            this.godFavorExtraAction(param)
                .then(() => { this.state = true })
        }
        else
            this.state = true;

        // Tyr's param = {damage, }

    }


    _SelectGodFavorPower(){
        // this.experience.world.clock.SetUser('bottom')
        this.experience.world.clock.Turn_Toggle("bottom")

        this.inputAdmin.Trigger({ trigger: "GodFavor" })
        this.state = true;
    }




    _GodFavorAction(godFavorAction){
        let user = godFavorAction.user
        let level = godFavorAction.level
        let godFavorIndex = godFavorAction.godfavorIndex

        let casterAvatar = this.avatars[user]
        let opponentAvatar = this.avatars[1 - user]

        let prom
        let godFavor = casterAvatar.godFavors[godFavorIndex]

        
        this.ui.GodFavorPowerUI_Activate(godFavor, level)
        
        // if (level < 0 || casterAvatar.tokens.length < godFavorAction.cost_) {
        //     prom = godFavor.Blink()
        //     prom.then(() => {this.state = true;})
        // }
        if (casterAvatar.tokens.length >= godFavorAction.cost_) {
            casterAvatar.SpendToken(godFavorAction.cost_)
            if (level >= 0) {
                this.sound.Play_GodfavorPower()
                prom = godFavor.power(level, casterAvatar, opponentAvatar, godFavorAction)
                if (godFavor.extraPower) {
                    this.godFavorExtraAction = (param) => {
                        return godFavor.extraPower(level, casterAvatar, opponentAvatar, godFavorAction, param)
                    }
                }
                prom.then((callbacks) => {
                    // this.cb = callbacks[0]
                    // this.cb()
                    // console.log(callbacks)
                    if (callbacks) {
                        if (callbacks[0])
                            this.callbacksOnRoundReset.push(...callbacks[0])

                        if (callbacks[1]) {
                            // callback immediately
                            callbacks[1].forEach(callback => {
                                this.cb = callback
                                this.cb()
                            })
                        }
                    }

                    this.state = true;

                })
            }
            else {
                prom = godFavor.Blink()
                prom.then(() => { this.state = true; })
            }
        }
        else {
            prom = godFavor.Blink()
            prom.then(() => { this.state = true; })
        }
        // let prom = this.avatars~~~.power(~~~)
    }

    
    GetRollDicesSimulation(cnt, avatar){
        // let simulationResult = this.physics.DiceRollSimulation(cnt, avatar === "top" ? -1 : 1)
        let simulationResult = this.physics.DiceRollSimulation(cnt, this.avatars[`${avatar}`].anchorSign)
        
        return simulationResult
    }


    GetDiceState(avatar, index){
        return this.avatars[avatar].dices[index].GetDiceState()
    }

    _DicesToWaiting(avatar, dices, token_dices){


        let prom = this.avatars[`${avatar}`].DicesToWaiting(dices, token_dices)
        // this.avatars[`${avatar}`].DicesToWaiting_Token([...token_dices])
        Promise.all(prom).then(()=> {this.state = true})
    }



    _SetDiceFormation(order, diceFormation){
        let promiseTop = this.avatars[`${order[0]}`].SetDiceFormation(diceFormation[0], this.game_style)
        let promiseBottom = this.avatars[`${order[1]}`].SetDiceFormation(diceFormation[1], this.game_style)

        let ret = [...promiseTop, ...promiseBottom]
        // console.log(ret)
        Promise.all(ret).then(()=>{
            this.state = true;
            // event.trigger("trigger")
            // console.log("set dice formation")
        })
        // return ret;
    }

    _GetToken(avatars, dicesWithTokenIndex){
        let ret = []
        // console.log(avatars)
        // console.log(dicesWithTokenIndex)

        if (dicesWithTokenIndex[0].length != 0 || dicesWithTokenIndex[1].length != 0) {
            this.sound.Play_CreateToken()
        }


        avatars.forEach((avatar, index)=>{
            // console.log(avatar)
            // console.log(index)
            let promises = this.avatars[`${avatar}`].GetToken(dicesWithTokenIndex[index])
            ret.push(...promises)
        })
        
        Promise.all(ret).then(()=>{
            this.state = true;
            // event.trigger("trigger")
        })
    }

    // _GetToken_Modern = [
    //     [ 0번 주사위의 생성 갯수, 1번 주사위의 생성 갯수 ],
    //     [ 0번 주사위의 생성 갯수, 1번 주사위의 생성 갯수 ]
    // ]
    _GetToken_Modern(token_create_info){
        let first_user = avatarsIndex[0]
        let second_user = avatarsIndex[1]

        let promises = [
            this.avatars[`${first_user}`].GetToken_Modern(token_create_info[0]),
            this.avatars[`${second_user}`].GetToken_Modern(token_create_info[1])
        ]

        Promise.all(promises).then(() => { this.state = true })
    }


    __checkSelectedObject(obj){
        let naturalObj = this.experience.world.checkSelectedObject(obj)
        let topObj = this.avatars.top.checkSelectedObject(obj)
        let bottomObj = this.avatars.bottom.checkSelectedObject(obj)
    
        
        if(naturalObj != undefined || naturalObj != null){
            return naturalObj
        }


        if(topObj != undefined || topObj !=null){
            topObj.avatar = avatarsIndex[0] == "top" ? 0 : 1
            topObj.isBottom = false
            return topObj
        }

        if(bottomObj != undefined || bottomObj != null){
            bottomObj.avatar = avatarsIndex[0] == "bottom" ? 0 : 1
            bottomObj.isBottom = true
            return bottomObj
        }

        return null;

    }


    __FindFromDictionary(objID){
        let naturalObj = this.experience.world.FindFromDictionary(objID)
        let topObj = this.avatars.top.FindFromDictionary(objID)
        let bottomObj = this.avatars.bottom.FindFromDictionary(objID)

        if(naturalObj != undefined || naturalObj != null){
            // console.log(naturalObj)
            // return null
            return naturalObj
        }

        if(topObj != undefined || topObj !=null){
            topObj.avatar = avatarsIndex[0] == "top" ? 0 : 1
            topObj.isBottom = false
            return topObj
        }

        if(bottomObj != undefined || bottomObj != null){
            bottomObj.avatar = avatarsIndex[0] == "bottom" ? 0 : 1
            bottomObj.isBottom = true
            return bottomObj
        }

        return null;
    }




    ObjectSelected(obj) {
        // this.ui.click(obj)       
        let objInfo = this.__checkSelectedObject(obj)
        // console.log(objInfo)
        // if (objInfo != null)
        //     this.ui.click(obj, objInfo)

        return objInfo
    }


    EnableExtraInputDice(info){

        if(info.user == "bottom"){
            // 능력에 맞는 안내문 출력
            this.inputAdmin.TurnOffAmbigious(info)
            this.ui.showDescription(this.experience.godFavorsNotice[`${info.godfavor}`])    
        }
        else{
            // "상대방 입력을 기다리는 중입니다.""
            this.ui.showDescription("Wait for opponent's input")
        }

    }



    _Sleep(milliSeconds){
        setTimeout(()=>{ this.state = true;}, milliSeconds)
    }


    _WaitForEmpty(){
        this.state = true
        // event.trigger("trigger", true)
        // console.log(this.messageQueue.length)
    }


    CreateItem(item, info){
        switch(item){
            case "dice":
                return this.experience.world.CreateDice(info)
                break;
        }
    }

    GetPhase(){
        // console.log(this.phase)
        return this.phase
    }


    GetAvatarsInfo() {
        return [this.avatars[0].GetAvatarInfo(), this.avatars[1].GetAvatarInfo()]
    }

    SetExtraPickedDiceCnt(cnt_){
        this.extraPickedDiceCnt = cnt_
    }

    _CheckReady() {
        this.state = true;
    
        // if(avatarsIndex[0] == "top")
        // if(this.dbg_check_ready_impossible == false)
        this.experience.SendCheck()


        this.no_signal_callback = setTimeout(()=>{
            this.ui.showAlert("No signal from opponent")
        }, 2500)
        
        // setTimeout(() => {
        //     window.BlackOff()
        //         .then(() => {
        //             this.state = true;
        //             this.experience.SendCheck()
        //         })
        // }, 2500)

    }


    _BellPush(){
        this.experience.mouseManager.BellPush(true)
        // console.log("bell pushed by server")

        this.state = true;
    }


    _ExtraInputBegin(){
        this.state = true;

    }



    _DoubleGame(owner, double_index){
        // console.log(arguments)
        // this.time.AddExtraTime(extraTime)
        this.inputAdmin.DeactivateDoubleCube()
        this.double_cube.DoubleGame(avatarsIndex[owner], double_index)
        this.state = true

    }


    _Ragnarok(){
        this.ui.WriteOnNotice("Ragnarok")

        setTimeout(()=>{this.state = true}, 2500)

    }



    _Frostbite(target, cnt) {
        let target_avatar = avatarsIndex[target]
        this.experience.world.Take_FrostBite(target_avatar, cnt)
            .then(() => { this.state = true })

    }



    _UserTag(first_name, second_name, first_score, second_score){
        
        let first_obj = {
            name : first_name,
            score : first_score
        }

        let second_obj = {
            name : second_name,
            score : second_score
        }

        let top_user, bottom_user

        if(avatarsIndex[0] == "top"){
            top_user = first_obj
            bottom_user = second_obj
        }
        else{
            top_user = second_obj
            bottom_user = first_obj
        }

        this.ui.Set_Tag(top_user, bottom_user)



        this.state = true
    }



    ForceSync(situation){
        // console.log(situation)
        // this.messageQueue.length = 0

        this.avatars[0].ForceSync(situation.player[0])
        this.avatars[1].ForceSync(situation.player[1])
        // switch(situation.phase){
        //     case "roll" :
        //         break;

        //     case "godfavor":
        //         break;
        // }

        this.state = true

    }



    Surrender(){
        if(this.surrender == false){
            this.experience.Surrender()
            this.surrender = true
        }
    }





    _DBG_RollDices(){
        this._RollDices(1, ["right", "left", "top", "bottom", "front", "back"], 6, [null, null])
    }


    _DBG_ForceSync(){
        this.ForceSync(this.situation_config)
    }

    _DBG_InitialGame(){
        // this._InitialGame(this.situation_config)

        this.experience.online = {active : true}

        this.avatars[0].eventEmitter = this.eventEmitter
        this.avatars[0].index = 0
        this.avatars[0].InitialGame(this.situation_config.player[0])
        // this.avatars[0].Withdraw()
        // this.experience.world.AddThing(this.avatars[`${avatarsIndex[0]}`], situation.player[0])
        
        this.avatars[1].eventEmitter = this.eventEmitter
        this.avatars[1].index = 1
        this.avatars[1].InitialGame(this.situation_config.player[1])
        // this.avatars[1].Withdraw()
        // this.experience.world.AddThing(this.avatars[`${avatarsIndex[1]}`], situation.player[1])
        



    }

    
    setDebug(){

        if (this.debug.active) {

            this.situation_config = {
                turnNum: 0,
                phase: "roll",
                order: 0,
                player: []
            }

            let player = {
                health: 15,
                token: 0,
                dices: [],
                godFavors:[0,1,2]
            }

            // 특수 주사위는 index 프로퍼티 존재
            let dice = {
                dir: "up", state : "tray"
            }

            this.situation_config.player = [JSON.parse(JSON.stringify(player)), JSON.parse(JSON.stringify(player))]

            for (let i = 0; i < 6; i++) {
                this.situation_config.player[0].dices.push(JSON.parse(JSON.stringify(dice)))
                this.situation_config.player[1].dices.push(JSON.parse(JSON.stringify(dice)))
            }



            this.debugFolder = this.debug.ui.addFolder(`controller`);
            this.debugFolder.add(this, "_DBG_InitialGame").name("InitialGame")
            this.debugFolder.add(this, "_DBG_ForceSync").name("ForceSync")
            this.debugFolder.add(this, "_DBG_RollDices").name("RollDices")
            this.debugFolder.add(this.situation_config, "turnNum", 0, 5, 1)
            this.debugFolder.add(this.situation_config, "phase", ["roll", "godfavor", "resolution"])
            this.debugFolder.add(this.situation_config, "order", 0, 1, 1)



            let dice_dirs = ["right", "left", "top", "bottom", "front", "back"]
            let dice_state = ["tray", "waiting", "ban"]
            this.debugFolder_avatar = [this.debug.ui.addFolder(`Avatar 0`), this.debug.ui.addFolder(`Avatar 1`)];

            for (let user = 0; user < 2; user++) {
                this.debugFolder_avatar[user].add(this.situation_config.player[user], `health`, 1, 15, 1).name(`hp-${user}`)
                this.debugFolder_avatar[user].add(this.situation_config.player[user], `token`, 0, 50, 1).name(`token-${user}`)

                for (let dice_index = 0; dice_index < 6; dice_index++) {
                    this.debugFolder_avatar[user].add(this.situation_config.player[user].dices[dice_index], `dir`, dice_dirs).name(`dir-${dice_index}`)
                    this.debugFolder_avatar[user].add(this.situation_config.player[user].dices[dice_index], `state`, dice_state).name(`dir-${dice_index}`)
                }

            }

        }

    }

}