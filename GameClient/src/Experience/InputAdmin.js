import Experience from './Experience.js'

// bottom
const PLAYER_DICE = 0
const PLAYER_TOKEN_DICE = 1
const PLAYER_GODFAVOR = 2
const PLAYER_HEALTHSTONE = 3

// top
const OPPONENT_DICE = 4
const OPPONENT_TOKEN_DICE = 5
const OPPONENT_GODFAVOR = 6
const OPPONENT_HEALTHSTONE = 7


// natural
const PLAYER_BELL = 8
const DOUBLE_CUBE = 9



export default class InputAdmin {
    constructor() {
        this.experience = new Experience()
        this.mousemanager = this.experience.mouseManager    
        this.controller = this.experience.controller
        this.debug = this.experience.debug
        this.time = this.experience.time
        
        this.filter = [false, false, false, false, false, false, false, false, false]
        this.ambigious = false  // phase 전환 구간

        this.rollDicesCnt = 0

        this.need_extra_input = false
        this.cached_godfavor_info = { godFavorIndex : null, level : null, extraInput : null }

        // window.addEventListener("keydown", (e) => {
        //     if(e.key === 'f'){
        //         console.log(this.filter, this.rollDicesCnt)
        //     }
        // });

        
        this.setDebug()

        // this.experience.resources.on("ready", ()=>{
        //     this.TurnOffAmbigious({
        //         trigger: "Resolution",
        //         user: "bottom",
        //         godfavor: "Odin"
        //     })
        // })

    }


    TmpStorageInputInfo(godFavorIndex, level){
        this.need_extra_input = true
        this.cached_godfavor_info.godFavorIndex = godFavorIndex
        this.cached_godfavor_info.level = level
        this.filter[PLAYER_GODFAVOR] = false
    }

    ObjectSelected(obj, context = false){
        if(this.ambigious && this.experience.online.active)
            return;

        let objInfo = this.controller.ObjectSelected(obj)

        // objInfo = {type: 'dice', index: 2, avatar: 1, isBottom: true}
        // objInfo = {type: 'healthstone', index: 9, avatar: 1, isBottom: true}}
        if(objInfo != null){
            switch(objInfo.type){
                case "dice":
                    this.ClickDice(objInfo)
                    break;
                    
                case "tokendice":
                    this.ClickTokenDice(objInfo)
                    break;

                case "godfavor":
                    this.ClickGodFavor(objInfo, context, obj)
                    break;

                case "healthstone":
                    return this.ClickHealthstone(objInfo)
                    break;

                case "doublecube":
                    this.ClickDoubleCube(objInfo)
                    break;
            }
        }
    }


    ProposeDoubleGame(){
        let phase = this.controller.GetPhase()

    }



    ClickGodFavor(objInfo, context, obj) {
        let phase = this.controller.GetPhase()

        if(phase === "godfavor" && this.filter[PLAYER_GODFAVOR] === true)
            this.experience.ui.click(obj, objInfo)

        if (phase === "cardselect"){
            this.controller.MessageEnqueue("PickGodfavor", [objInfo.index, context]

        )}
    }



    ClickDice(objInfo) {
        if ((objInfo.isBottom && this.filter[PLAYER_DICE]) ||
            (!objInfo.isBottom && this.filter[OPPONENT_DICE])) {

            let phase = this.controller.GetPhase()
            if(phase === "godfavor")
                this.controller.MessageEnqueue("ExtraClickDice", [objInfo.avatar, objInfo.index])
            else
                this.controller.MessageEnqueue("ClickDice", [objInfo.avatar, objInfo.index])
            // console.log(objInfo)

        }
    }

    
    ClickTokenDice(objInfo) {
        if ((objInfo.isBottom && this.filter[PLAYER_TOKEN_DICE]) ||
            (!objInfo.isBottom && this.filter[OPPONENT_TOKEN_DICE])) {

            this.controller.MessageEnqueue("ClickDice_Token", [objInfo.avatar, objInfo.index])
            // console.log(objInfo)

        }
    }



    BellPush(user, param) {
        // console.log(arguments)
        if (this.filter[PLAYER_BELL]) {
            // console.log(this.filter)
            this.TurnOnAmbigious()
            this.experience.world.clock.Invert_Toggle()

            if (this.need_extra_input === true) {
                this.cached_godfavor_info.extraInput = param
                // console.log(this.cached_godfavor_info)
                this.experience.redbird.MessageEnqueue("BellPushed", [user, this.cached_godfavor_info, this.controller.GetPhase(), this.controller.GetAvatarsInfo()])
            }
            else {
                this.experience.redbird.MessageEnqueue("BellPushed", [user, param, this.controller.GetPhase(), this.controller.GetAvatarsInfo()])
            }

        }
    }


    ClickHealthstone(objInfo) {
        if ((objInfo.isBottom && this.filter[PLAYER_HEALTHSTONE]) ||
            (!objInfo.isBottom && this.filter[OPPONENT_HEALTHSTONE])) {
            return objInfo
        }
    }


    ClickDoubleCube(objInfo){
        // console.log(objInfo)
        if(this.filter[DOUBLE_CUBE]){
            this.DeactivateDoubleCube()
            this.experience.redbird.MessageEnqueue("DoubleGame", [])

        }
    }


    DeactivateDoubleCube(){
        this.filter[DOUBLE_CUBE] = false

    }


    ClickDice_RollPhase(objInfo){

    }


    // client가 호출 (BellPushed)
    TurnOnAmbigious() {
        this.ambigious = true
        for (let i = 0; i < this.filter.length; i++)
            this.filter[i] = false
        // console.log(this.filter)
        
        // this.time.StopTimer()
    }


    // server가 호출 (SetDiceFormation, RollDice에서 호출)
    // info = { trigger : "RollDice", user : "bottom", godfavor : "Loki" }


    Trigger(info){
        if(info.trigger === "RollDice" && this.rollDicesCnt >= 4)
            return;

        this.TurnOffAmbigious(info)
    }

    TurnOffAmbigious(info){
        this.ambigious = false
        this.SetFilter(info)
    }

    SetFilter(info){
        // console.log(info)
        this.time.StartTimer()
        this.experience.world.clock.Highlight_On()


        switch (info.trigger) {
            case "CardSelect":
                // console.log("NANI?!")
                this.filter[PLAYER_GODFAVOR] = true
                this.filter[PLAYER_BELL] = true

                break;

            case "Draft":
                if(info.user === "bottom"){
                    this.filter[PLAYER_GODFAVOR] = true
                    this.filter[PLAYER_BELL] = true
                }

                break;

            case "RollDice":
                this.rollDicesCnt++
                if (info.user === "bottom") {
                    this.filter[PLAYER_DICE] = true
                    if (info.game_style == "modern")
                        this.filter[PLAYER_TOKEN_DICE] = true
                    this.filter[PLAYER_BELL] = true

                    let doubleCube_owner = this.controller.double_cube.owner
                    if (doubleCube_owner === "bottom" || doubleCube_owner === null)
                        this.filter[DOUBLE_CUBE] = true

                }

                if (info.user === "top" && !this.experience.online.active){
                    this.filter[OPPONENT_DICE] = true
                    this.filter[OPPONENT_TOKEN_DICE] = true
                }




                break;

            case "GodFavor":
                this.filter[PLAYER_GODFAVOR] = true
                this.filter[PLAYER_BELL] = true

                if (!this.experience.online.active)
                    this.filter[OPPONENT_GODFAVOR] = true


                // let doubleCube_owner = this.controller.double_cube.owner

                // if (doubleCube_owner === "bottom")
                //     this.filter[DOUBLE_CUBE] = true

                break;

            case "Resolution":
                this.SetFilterResolutionPhase(info)
                break;
        }





    }

    SetFilterResolutionPhase(info) {
        this.filter[PLAYER_BELL] = true
        switch (info.godfavor) {
            case "Loki": {
                if (info.user === "bottom")
                    this.filter[OPPONENT_DICE] = true
                else if (info.user === "top" && !this.experience.online.active)
                    this.filter[PLAYER_DICE] = true
            }
                break;

            case "Frigg": {
                if (info.user === "bottom"
                    || (info.user === "top" && !this.experience.online.active)
                    ) {
                    this.filter[OPPONENT_DICE] = true
                    this.filter[PLAYER_DICE] = true
                }

                break;
            }

            case "Tyr" :
            case "Odin": {
                if (info.user === "bottom"){
                    this.filter[PLAYER_HEALTHSTONE] = true

                    // health stone에 대한 상호작용 활성화
                    this.experience.controller.avatars[`${info.user}`].HealthStonesInteractOn()

                }
                else if (info.user === "top" && !this.experience.online.active){
                    this.filter[OPPONENT_HEALTHSTONE] = true
                    this.experience.controller.avatars[`${info.user}`].HealthStonesInteractOn()
                }
            
            }
        }
    }

    InitialGame(){
        this.filter = [false, false, false, false, false, false, false, false, false, false]
        this.ambigious = false  // phase 전환 구간

        this.rollDicesCnt = 0
    }


    ResetRound(){
        this.TurnOnAmbigious()
        this.rollDicesCnt = 0
        this.need_extra_input = false
        this.cached_godfavor_info = { godFavorIndex : null, level : null, extraInput : null }
    }

    
    setDebug(){
        if (this.debug.active){




        }
    }

}