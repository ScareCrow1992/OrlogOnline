// import RollPhase from '../Phase/RollPhase.js'

const RAGNAROK = 60

import * as superVisor from './Calculation/SuperVisor.js'
// import * as RollPhase from './Calculation/RollPhase.js'
// import * as GodFavorPhase from './Calculation/GodfavorPhase.js'
// import * as ResolutionPhase from './Calculation/ResolutionPhase.js'

import * as LogicKit from './LogicKit.js'

import readline from 'readline'

import EventEmitter from "../Game/Calculation/EventEmitter.js"



const diceFaceInfo = [{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "arrow", token: true },
    "back": { weapon: "steal", token: true }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "steal", token: true },
    "front": { weapon: "arrow", token: false },
    "back": { weapon: "helmet", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "arrow", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "shield", token: false }
},

{
    "right": { weapon: "arrow", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: true },
    "back": { weapon: "axe", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "arrow", token: true }

},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "arrow", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "helmet", token: true }

}]






export default class Simulator {
    constructor(game_mode, game_style) {
        // console.log("[game start]")

        // this.debug = debug

        // dummy
        this.controller = {
            MessageEnqueue: () => { }
        };

        this.isOver = false

        this.caller = {
            "BellPushed": (...params) => { this.BellPushed(...params) },
            "DoubleGame": (...params) => { this.DoubleGame(...params) }
            // "objectSelected": (...params) => { this.objectSelected(...params) },
            // "godFavorAction": (...params) => { this.godFavorAction(...params) }
        }

        // if (debug)
        //     this.setDebug()


        game_style = "classic" // "modern" or "classic"
        this.situation = {
            acc_frostbite: 3,
            first: undefined,
            msg_logs: [],
            game_mode: game_mode,
            game_style: game_style,
            start_time: Date.now(),
            logs: {
                "HP-0": [],
                "Token-0": [],
                "Weapon-0": [],
                "Mark-0": [],
                "Card-0": [],
                "HP-1": [],
                "Token-1": [],
                "Weapon-1": [],
                "Mark-1": [],
                "Card-1": [],
                "Round": [],
                "First": []
            },
            logs_godfavor: {
                "HP-0": [],
                "Token-0": [],
                "Weapon-0": [],
                "Mark-0": [],
                "Card-0": [],
                "HP-1": [],
                "Token-1": [],
                "Weapon-1": [],
                "Mark-1": [],
                "Card-1": [],
                "First": []
            },
            logs_: [],
            banned_cards: [-1, -1, -1, -1, -1, -1],
            double_cube: { owner: null, double_index: 0, proposed: 0, get score() { return this.double_index > 0 ? this.double_index * 2 : 1 } }, // score = 2 ^ (double_index)
            double_game_proposed: [false, false],
            round: 0,
            draft: 0, // ( 0 ~ 6 )
            phase_: "roll",     // "roll" "godfavor" "resolution" "end"
            set phase(rValue) {
                this.phase_ = rValue
                // console.log(rValue)
            },
            get phase() {
                return this.phase_
            },
            turnNum: 0,
            order: [0, 1],
            turnEnd: [false, false],
            timeover: false,
            preparedGodFavor: [
                { godfavorIndex: -1, level: -1, godfavorNameIndex: -1, token: -1, cost: -1 },
                { godfavorIndex: -1, level: -1, godfavorNameIndex: -1, token: -1, cost: -1 }
            ],
            // resolution = [ { cmd : godfavor, avatar : 0, index : 1 } ]
            resolutionCallbacks: [],
            resolutionCallIndex: 0,
            resolutionWaitInputForUser: -1,
            inputInfo: [null, null],
            extraInput: [null, null],
            winner: "none",
            orderSwap: function () {
                this.order[0] = this.order[1]
                this.order[1] = 1 - this.order[0]
            },
            player: [
                {
                    frostbite: 0,
                    acc_dmg: 0,
                    used_token: 0,
                    get max_hp() {
                        return 15 - this.frostbite
                    },
                    godFavors: [-1, -1, -1],
                    health: 15,
                    token: 0,
                    dices:
                        [{
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }],
                    token_dices: [
                        {
                            dir: "top",
                            state: "tray",
                            get cnt() {
                                switch (this.dir) {
                                    case "right":
                                        return 0
                                        break;

                                    case "left":
                                        return 0
                                        break;

                                    case "top":
                                        return 1
                                        break;

                                    case "bottom":
                                        return 1
                                        break;

                                    case "front":
                                        return 2
                                        break;

                                    case "back":
                                        return 3
                                        break;
                                }
                            }
                        },
                        {
                            dir: "top",
                            state: "tray",
                            get cnt() {
                                switch (this.dir) {
                                    case "right":
                                        return 0
                                        break;

                                    case "left":
                                        return 0
                                        break;

                                    case "top":
                                        return 1
                                        break;

                                    case "bottom":
                                        return 1
                                        break;

                                    case "front":
                                        return 2
                                        break;

                                    case "back":
                                        return 3
                                        break;
                                }
                            }
                        }
                    ]
                },
                {
                    frostbite: 0,
                    acc_dmg: 0,
                    used_token: 0,
                    get max_hp() {
                        return 15 - this.frostbite
                    },
                    godFavors: [-1, -1, -1],
                    health: 15,
                    token: 0,
                    dices:
                        [{
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }, {
                            dir: "top",
                            weapon: "axe",
                            token: true,
                            state: "tray",
                            power: 1
                        }],

                    token_dices: [
                        {
                            dir: "top",
                            state: "tray",
                            get cnt() {
                                switch (this.dir) {
                                    case "right":
                                        return 0
                                        break;

                                    case "left":
                                        return 0
                                        break;

                                    case "top":
                                        return 1
                                        break;

                                    case "bottom":
                                        return 1
                                        break;

                                    case "front":
                                        return 2
                                        break;

                                    case "back":
                                        return 3
                                        break;
                                }
                            }
                        },
                        {
                            dir: "top",
                            state: "tray",
                            get cnt() {
                                switch (this.dir) {
                                    case "right":
                                        return 0
                                        break;

                                    case "left":
                                        return 0
                                        break;

                                    case "top":
                                        return 1
                                        break;

                                    case "bottom":
                                        return 1
                                        break;

                                    case "front":
                                        return 2
                                        break;

                                    case "back":
                                        return 3
                                        break;
                                }
                            }
                        }
                    ]
                }
            ]
        }


        this.situation.eventEmitter = new EventEmitter()

        // this.InitialGame()
        // setTimeout(() => {this.InitialGame()}, 1500)
        // this.InitialGame()




        // readline.emitKeypressEvents(process.stdin);

        // if (process.stdin.isTTY)
        //     process.stdin.setRawMode(true);

        // process.stdin.on('keypress', (chunk, key) => {
        //     if (key) {
        //         switch (key.name) {
        //             case 'q':
        //                 process.exit();
        //                 break;

        //             case 'r':
        //                 this.InitialGame();
        //                 break;
        //         }
        //     }


        // });

    }



    // ConvertFromKey(avatar_info, opponent_info, situation) {
    //     this.isOver = false

    //     this.situation.order

    //     this.situation.player[0].health
    //     this.situation.player[0].token
    //     this.situation.


    //         this.situation.player[0].godFavors[0] = avatar_info.godFavors[0]

    // }

    MessageEnqueue(func, params) {
        let currentPhase = LogicKit.GetCurrentPhase(this.situation)

        if (this.isOver == false) {
            return this.caller[`${func}`](...params)
            // return this.BellPushed(...params)
        }
        else
            return false
    }



    InitialGame() {
        // console.log(this.situation)
        LogicKit.InitialGame(this.situation)
        let getFirst = LogicKit.GetFirstPlayer(this.situation, this.randomGenerator.RandomInteger(0, 1))

        this.situation.first = getFirst

        // let this.situation = LogicKit._GetSituation()
        // console.log(situation)
        this.controller.MessageEnqueue("InitialGame", [this.situation, getFirst, this.situation.game_mode, this.situation.game_style])

        if (this.situation.game_mode == "liberty") {
            this.controller.MessageEnqueue("Liberty", [])
        }

        if (this.situation.game_mode == "constant") {
            this.GameStart()
        }

        if (this.situation.game_mode == "draft")
            this.Draft(getFirst, 0)


        // this.PrepareCard()
    }

    Print_Msg_Log() {
        // console.log(this.situation.msg_logs)

        // this.situation.msg_logs.forEach(msg => {
        //     if (msg.type == "recv")
        //         console.log(msg)
        // })

    }


    PushMsgLog(msg) {
        this.situation.msg_logs.push(msg)
    }



    SituationLog() {
        let sleeping_time = new Date(Date.now() - this.controller.last_send_time)
        console.log(`player-0 (hp) : ${this.situation.player[0].health}`)
        console.log(`player-1 (hp) : ${this.situation.player[1].health}`)
        console.log(`gameover : ${this.isOver}`)
        console.log(`phase : ${this.situation.phase}`)
        console.log(`godfavor-0 : ${this.situation.player[0].godFavors}`)
        console.log(`godfavor-1 : ${this.situation.player[1].godFavors}`)
        console.log(`turn : ${this.situation.turnNum}`)
        console.log(`waiting_user : ${this.GetSleepUser()}`)
        console.log(`sleeping_time : ${sleeping_time.getMinutes()}m ${sleeping_time.getSeconds()}s`)
        console.log("==========================================\n")
    }


    SituationSimplify() {
        let players_info = []
        // godFavors: [12, 4, 14],
        // health: 15,
        // token: 0,
        // dices:
        for (let index = 0; index < 2; index++) {
            let player = this.situation.player[index]
            let ret = {}
            ret["godFavors"] = player.godFavors
            ret["health"] = player.health
            ret["token"] = player.token
            ret["weapon"] = []
            ret["mark"] = []
            ret["state"] = []


            player.dices.forEach((dice, index) => {
                ret["weapon"].push(dice.weapon)
                ret["mark"].push(dice.token)
                ret["state"].push(dice.state)
            })

            players_info.push(ret)
        }
        players_info.push(this.situation.order)

        return players_info
    }


    GetSleepUser() {
        let ret = [false, false]
        let turn_index, user_index

        switch (this.situation.phase) {
            case "cardselect":
                if (this.situation.game_mode == "draft") {
                    turn_index = (this.situation.draft) % 2
                    user_index = this.situation.order[turn_index]

                    ret[user_index] = true
                }
                else if (this.situation.game_mode == "liberty") {
                    ret[0] = !this.situation.turnEnd[0]
                    ret[1] = !this.situation.turnEnd[1]
                }


                break;

            case "roll":
                turn_index = (this.situation.turnNum) % 2
                user_index = this.situation.order[turn_index]

                ret[user_index] = true

                break;

            case "godfavor":
                ret[0] = !this.situation.turnEnd[0]
                ret[1] = !this.situation.turnEnd[1]
                break;

            case "resolution":
                if (this.situation.resolutionWaitInputForUser != -1)
                    ret[this.situation.resolutionWaitInputForUser] = true

                break;

        }

        return ret
    }



    GameStart() {
        LogicKit.InitialGame(this.situation)
        // let this.situation = LogicKit._GetSituation()

        this.controller.MessageEnqueue("GameStart", [this.situation, this.situation.game_mode, this.situation.game_style])
        this.controller.MessageEnqueue("PhaseChange", ["cardselect", "roll"])

        this.StartRound()

    }


    StartRound() {
        // console.log("start round!")

        // console.log(this.situation.round, RAGNAROK)

        if (this.situation.round === (RAGNAROK)) {
            this.Ragnarok()
        }

        let avatar = LogicKit.StartRound(this.situation)

        this.controller.MessageEnqueue("StartRound", [])
        this.RollDices(avatar, this.situation)
    }


    ResetRound() {
        let whoIsWinner = LogicKit.ResetRound(this.situation)
        // console.log(whoIsWinner)
        if (whoIsWinner == "none") {
            this.controller.MessageEnqueue("ResetRound", [])


            this.controller.MessageEnqueue("PhaseChange", ["resolution", "roll"])
        }

        return whoIsWinner
    }

    /*
    user : draft 진행 유저
    turn : 차례 횟수
    pick : < true / false >
    ban : < true / false >
    */
    Draft(user, turn) {
        let pick = turn == 0 ? false : true
        let ban = turn == 6 ? false : true


        let current_banpick = {
            ban: this.situation.banned_cards,
            pick: [
                this.situation.player[0].godFavors,
                this.situation.player[1].godFavors
            ]
        }

        // this.controller.MessageEnqueue("Draft", [user, turn, pick, ban], user)
        this.controller.MessageEnqueue("Draft", [user, turn, pick, ban, current_banpick])
    }


    RollDices(avatar) {


        let ret = LogicKit.RollDices(this.situation, avatar)
        // ret = { func : "RollDices", params : [avatar, dirs, rollDicesCnt], isDicePickLimit : ret}

        this.controller.MessageEnqueue(ret.func, ret.params)

        if (ret.isDicePickLimit) {
            // 마지막 차례이므로 강제로 턴을 종료시킨다
            this.BellPushed(avatar, true)
        }
    }


    /* ret = { type : "dice", index : 0, avatar : "top" } */
    // 서버 전용으로 수정 필요
    // objectSelected(objInfo, clientPhase) {
    //     console.log("[[ Object Selected ]]")
    //     console.log(params)

    //     if (clientPhase !== LogicKit.GetCurrentPhase(this.situation)) {
    //         // console.log(`[client] : ${clientPhase},  [server] : ${LogicKit.GetCurrentPhase(this.situation)}`)
    //         return
    //     }

    //     let ret = LogicKit.SelectObject(this.situation, objInfo)
    //     // ret = {callback : callback, avatar : avatar, index : index}

    //     if (ret != null) {
    //         switch (ret.callback) {
    //             case "ChooseDice":
    //                 // this.controller.ChooseDice(ret.avatar, ret.index)    
    //                 this.controller.MessageEnqueue("ChooseDice", [ret.avatar, ret.index])
    //                 break;

    //             case "CancleDice":
    //                 // this.controller.CancleDice(ret.avatar, ret.index)    
    //                 this.controller.MessageEnqueue("CancleDice", [ret.avatar, ret.index])
    //                 break;

    //         }
    //     }

    // }


    // godFavorAction(godFavorIndex, level, user) {
    //     // console.log("[[ godFavorAction ]]")
    //     // console.log(params)
    //     // user가 사용할 능력을 game Situation에 저장한다.
    //     LogicKit.PrepareGodFavor(this.situation, godFavorIndex, level, user)
    //     this.BellPushed(user)
    // }

    SetDiceMaterialColor(color, index) {
        // superVisor.setDiceMaterialColor(color,index);
    }



    DoubleGame(avatar) {
        // let currentPhase = LogicKit.GetCurrentPhase(this.situation)
        let params = LogicKit.DoubleGame(this.situation, avatar)

        // console.log(params)
        if (params != null) {
            this.controller.MessageEnqueue("DoubleGame", params)
        }

    }


    // avatarsInfo = [{}, {health : 11, token : 20, dicesState : ["tray", "tray", "chosen" ...]}]
    BellPushed(avatar, inputInfo, clientPhase = false, avatarsInfo) {
        let currentPhase = LogicKit.GetCurrentPhase(this.situation)


        if (clientPhase !== currentPhase && clientPhase) {
            // 클라이언트-서버간 phase 미일치
            // console.log(inputInfo)
            console.log(`[client] : ${clientPhase},  [server] : ${currentPhase}`)
            return false
        }


        if (currentPhase === "resolution") {
            let waitingUser = LogicKit.GetResolutionPhaseInputWaitUser(this.situation, avatarsInfo, inputInfo, avatar)
            // console.log(waitingUser)
            // console.log(avatar)
            // console.log(inputInfo)
            if (avatar === waitingUser)
                this.ResolutionPhaseCommand()
        }
        else if (currentPhase === "cardselect") {
            // param = { user : 0, godfavors [0, 6, 9]}
            // console.log("printed here")
            if (this.situation.game_mode === "liberty") {
                let canStartGame = LogicKit.GodFavorCardsPick(this.situation, avatar, inputInfo.godfavors)
                if (canStartGame)
                    this.GameStart()
            }
            else if (this.situation.game_mode === "draft") {
                // 선택한 카드, 밴한 카드의 목록을 최신화 시킨다.
                /*
                inputInfo = {
                    user : 0,
                    pick : 5,
                    ban : 3
                }
                */

                // console.log(`[ban & pick] avatar : ${avatar} `)
                // console.log(`[ban & pick] input user : ${this.situation.order[this.situation.draft % 2]} `)


                if (avatar != this.situation.order[this.situation.draft % 2]) {
                    // console.log(`user [${avatar}] 's wrong bell is pushed `)
                    return false;
                }


                // 불가능한 명령이 접수되었으면 그냥 랜덤픽 진행
                let ret = LogicKit.BanPick(this.situation, avatar, inputInfo.pick, inputInfo.ban)



                // 카드 이동 명령
                this.controller.MessageEnqueue("BanPickCardMove", [avatar, ret.pick, ret.ban])


                if (this.situation.draft < 6) {
                    // 새로운 Draft 시작
                    this.situation.draft++
                    let user_ = this.situation.order[this.situation.draft % 2]
                    let turn_ = this.situation.draft

                    this.Draft(user_, turn_)

                }
                else {
                    // Draft 끝
                    this.GameStart()
                }
            }
        }
        else {
            let ret, diceFormation, playerOrder, sectorPower, changedPhase
            [ret, diceFormation, playerOrder, sectorPower, changedPhase]
                = LogicKit.BellPushed(this.situation, `${avatar}`, inputInfo, avatarsInfo)



            if (ret.isCallback)
                this.BellPushed_Waiting(ret.func, ret.params)

            switch (ret.nextAction) {
                case "RollDice":
                    this.BellPushed_RollDice(avatar)
                    break;
                case "RollPhaseEnd":
                    this.BellPushed_RollPhaseEnd(diceFormation, playerOrder, ret.avatar_stats)
                    break;

                case "GodFavorEnd":
                    this.BellPushed_GodFavorEnd()
                    break;
            }
        }

        if (this.situation.timeover == true)
            this.situation.timeover = false

        // this.Print_Msg_Log()

        return true
    }

    BellPushed_Waiting(func, params) {
        this.controller.MessageEnqueue(func, params)
    }


    BellPushed_RollDice(avatar) {
        this.RollDices(1 - avatar)
    }


    BellPushed_RollPhaseEnd(diceFormation, playerOrder, avatar_stats) {
        let players_info = this.SituationSimplify()

        this.controller.MessageEnqueue("SetDiceFormation", [[...playerOrder], diceFormation])
        this.controller.MessageEnqueue("PhaseChange", ["roll", "godfavor"])
        this.controller.MessageEnqueue("SelectGodFavorPower", [players_info])
    }


    BellPushed_GodFavorEnd() {
        this.controller.MessageEnqueue("PhaseChange", ["godfavor", "resolution", this.situation.preparedGodFavor])
        this.ResolutionPhasePrepare()
        // setTimeout(() => { this.ResolutionPhasePrepare() }, 2500)
    }


    CreateResolutionPhaseCallChain() {

    }



    GodFavor(godFavorAction, callback = null) {

        delete godFavorAction.power
        // delete godFavorAction.targetGodFavor

        // let parsed_situation = LogicKit.ParsingSituation(this.situation)
        let players_info = this.SituationSimplify()

        this.controller.MessageEnqueue("GodFavorAction", [godFavorAction, players_info])

        if (callback != null && callback) {
            this.cb = callback
            return this.cb(LogicKit)
        }
    }


    RegisterGodfavorAction(callbacks, godFavorAction) {
        // let this.situation = LogicKit._GetSituation()

        // if(godFavorAction.registerTrigger){
        // LogicKit.registerTrigger(godFavorAction.registerTrigger)
        // }

        callbacks.push(() => {
            godFavorAction.power(this.situation, this)
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



    Run(state_, action_, agent_index) {
        global.simulation_cnt++
        
        this.isOver = false
        this.situation.winner = "none"
        this.situation.round = state_.situation.round
        this.situation.order = [...state_.situation.order]
        this.situation.phase = "resolution"

        for (let player_index = 0; player_index < 2; player_index++) {
            let agent_type = null
            if (player_index == agent_index)
                agent_type = "avatar"
            else
                agent_type = "opponent"

            this.situation.player[player_index].health = state_[`${agent_type}`].health
            this.situation.player[player_index].token = state_[`${agent_type}`].token
            this.situation.player[player_index].godFavors = [...state_[`${agent_type}`].godFavors]

            for (let dice_index = 0; dice_index < 6; dice_index++) {
                this.situation.player[player_index].dices[dice_index].weapon = state_[`${agent_type}`].dices_.weapon[dice_index]
                this.situation.player[player_index].dices[dice_index].token = state_[`${agent_type}`].dices_.mark[dice_index]

                this.situation.player[player_index].dices[dice_index].state = "waiting"

            }

            let preparedGodFavor_lhs = this.situation.preparedGodFavor[player_index]
            let preparedGodFavor_rhs = action_[`${agent_type}`].preparedGodFavor

            preparedGodFavor_lhs.godfavorIndex = preparedGodFavor_rhs.godfavorIndex
            preparedGodFavor_lhs.level = preparedGodFavor_rhs.level
            preparedGodFavor_lhs.godfavorNameIndex = preparedGodFavor_rhs.godfavorNameIndex

            if (action_[`${agent_type}`].extra != null) {
                this.situation.extraInput[player_index] = [
                    { dicesState: new Array(6).fill(null) },
                    { dicesState: new Array(6).fill(null) }
                ]

                for (let user_index = 0; user_index < 2; user_index++) {
                    for (let dice_index = 0; dice_index < 6; dice_index++) {
                        if (action_[`${agent_type}`].extra[user_index][dice_index] == true)
                            this.situation.extraInput[player_index][user_index].dicesState[dice_index] = "levitation"

                    }
                }
            }


            if (action_[`${agent_type}`].input != null) {
                this.situation.inputInfo[player_index] = JSON.parse(JSON.stringify(action_[`${agent_type}`].input))
            }

        }

        this.ResolutionPhasePrepare()
        this.ResetRound()

        let state = this.Result_2_State(agent_index)
        return state

    }



    Result_2_State(agent_index) {
        let avatar_index = agent_index
        let opponent_index = 1 - avatar_index

        let ret = {
            avatar: {
                health: this.situation.player[avatar_index].health,
                token: this.situation.player[avatar_index].token,
                godFavors: [...this.situation.player[avatar_index].godFavors],
                dices: { axe: 0, arrow: 0, helmet: 0, shield: 0, steal: 0, mark: 0, empty: 6 },
                dices_ : {
                    weapon: new Array(6).fill(null),
                    mark: new Array(6).fill(false)
                }
            },
            opponent: {
                health: this.situation.player[opponent_index].health,
                token: this.situation.player[opponent_index].token,
                godFavors: [...this.situation.player[opponent_index].godFavors],
                dices: { axe: 0, arrow: 0, helmet: 0, shield: 0, steal: 0, mark: 0, empty: 6 },
                dices_ : {
                    weapon: new Array(6).fill(null),
                    mark: new Array(6).fill(false)
                }
            },
            situation: {
                order: [...this.situation.order],
                round: this.situation.round + 1,
                winner: this.situation.winner,
                gameover: this.isOver,
                turn : 0,
                phase : 0   // roll phase
            }
        }

        // console.log(ret)

        return ret
    }



    ResolutionPhasePrepare() {
        let callbacks = []
        let godFavorActions = LogicKit.GodFavorAction(this.situation)

        godFavorActions[0].forEach(godFavorAction => {
            this.RegisterGodfavorAction(callbacks, godFavorAction)
        })

        // Resolution Phase Start

        if (this.situation.game_style === "classic") {
            callbacks.push(() => {
                let playerOrder = LogicKit.GetPlayerOrder(this.situation)
                let dicesWithTokenIndex = LogicKit.GetToken(this.situation)
                if (dicesWithTokenIndex[0].length != 0 || dicesWithTokenIndex[1].length != 0)
                    this.GetToken(playerOrder, dicesWithTokenIndex)
            })
        }
        else {
            callbacks.push(() => {
                let token_create_info = LogicKit.GetToken_Modern(this.situation)
                this.GetToken_Modern(token_create_info)

            })
        }


        callbacks.push(() => { this.ResolutionPhaseMiddle() })

        godFavorActions[1].forEach(godFavorAction => {
            this.RegisterGodfavorAction(callbacks, godFavorAction)
        })


        if (this.situation.round >= RAGNAROK) {
            callbacks.push(() => { this.Frostbite() })
        }

        // callbacks.push(() => { this.RoundEnd() })
        // callbacks.push(() => { this.ResetRound() })


        // callbacks.forEach(callback=>{
        //     callback()
        // })



        // console.log("push the resolution commands")
        LogicKit.PushResolutionPhaseCommands(this.situation, callbacks)

        return this.ResolutionPhaseCommand()
    }


    Frostbite() {
        let ret = LogicKit.Frostbite(this.situation)

        const TARGET = ret[0]

        if (TARGET !== null)
            this.controller.MessageEnqueue("Frostbite", ret)
    }


    Ragnarok() {
        this.controller.MessageEnqueue("Ragnarok", [])

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


    ResolutionPhaseCommand() {
        // console.log("start")
        let gameover = false
        while (true) {
            let cmd = LogicKit.GetNextResolutionPhaseCommand(this.situation)
            // console.log(cmd)
            if (cmd == null) {
                break;
            }
            // console.log("!!!!!Game Logic is Go On!!!!!")
            this.cmd_ = cmd
            let needInput = this.cmd_()

            let newPhase = LogicKit.GetCurrentPhase(this.situation)

            if (newPhase == "end" && this.isOver == false) {
                // console.log(params)
                // console.log("gameover~~")
                gameover = true
                this.GameOver(this.situation.winner)
                break;
            }
            // console.log("needInput ? = " + needInput)
            // needInput = 추가 입력이 필요한 유저
            // !! DEPRECATED !!
            needInput = null
            if (needInput == 0 || needInput == 1) {
                LogicKit.WaitForPlayerInputAtResolutionPhase(this.situation, needInput)
                this.controller.MessageEnqueue("ExtraInputBegin", [needInput])


                // console.log("it's need input")
                break;
            }
        }

        return gameover
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


    ResolutionPhaseMiddle() {
        let playerOrder = LogicKit.GetPlayerOrder(this.situation)
        let sectorsInfo = LogicKit.GetDiceSector(this.situation)
        let dicesCommand, battleResult, dicesFormation
        [dicesCommand, battleResult, dicesFormation] = LogicKit.GetBattleInformation(sectorsInfo, this.situation)
        this.Battle(playerOrder, dicesCommand, dicesFormation)

    }


    // ResolutionPhaseEnd(){
    //     godFavorActions[1].forEach(godFavorAction=>{
    //         LogicKit.ActivateGodFavorPower(godFavorAction)
    //         this.GodFavor(godFavorAction, null)
    //     })

    //     // console.log(godFavorActions[1])
    //     this.RoundEnd()
    // }


    GetToken(playerOrder, dicesWithTokenIndex) {
        this.controller.MessageEnqueue("GetToken", [playerOrder, dicesWithTokenIndex])
    }

    GetToken_Modern(token_create_info) {
        this.controller.MessageEnqueue("GetToken_Modern", [token_create_info])
    }

    Battle(playerOrder, dicesCommand, dicesFormation) {
        // console.log(dicesCommand)
        // console.log(dicesFormation)
        this.controller.MessageEnqueue("DiceBattle", [dicesCommand, playerOrder, dicesFormation])
    }


    RoundEnd() {

        let whoIsWinner = this.ResetRound()


        this.StartRound()

        // if(this.situation.round > 25){

        //     this.Draw()
        // }
        // else{
        //     this.StartRound()
        // }

        // if (whoIsWinner == "none") {
        // this.StartRound()
        // }
        // else{
        // this.GameOver(whoIsWinner)
        // }

    }


    GameOver(winner) {
        if (this.isOver == false) {
            this.isOver = true
            let score = undefined
            if (winner != null) {
                // let used_token = this.situation.player[`${winner}`].used_token
                score = this.situation.player[`${winner}`].health

                if (this.situation.round > 25) {
                    console.log("[[ round over ]]", this.situation.round)
                    score /= 2
                }
            }
            else
                score = -5

            score = score + 5

            this.controller.MessageEnqueue("GameOver", [winner, score, this.situation.game_mode])
            this.situation.score_ = score
            // this.controller.GameOver()
            // this.gameover_callback(winner, this.situation)

            // console.log("game over")
        }
    }

    Destroy() {

    }


    Draw() {
        console.log("[[ Draw ]]")
        this.GameOver(null)
    }


    AlertStop(stopper) {
        this.GameOver(1 - stopper)

    }


    Surrender(stopper) {
        this.GameOver(1 - stopper)
    }


    // setDebug() {
    //     if (this.debug.active) {

    //         window.addEventListener('keydown', e => {
    //             if (e.key == "r") {
    //                 // game reset
    //                 this.InitialGame();

    //             }
    //         })


    //         this.situationViewerDom = document.getElementById("situation-viewer")
    //         this.situationViewerHeader = document.getElementById("situation-header")
    //         this.situationViewerTop = document.getElementById("situation-top")
    //         this.situationViewerBottom = document.getElementById("situation-bottom")

    //         let dummy = 0;

    //         this.mainfolder = this.debug.ui.addFolder("Game");
    //         this.mainfolder.add(this, "_DBG_ConsoleReset")
    //             .name("[Console] Refresh")
    //         this.mainfolder.add(this, "_DBG_ConsoleFold")
    //             .name("[Console] Fold")
    //         this.mainfolder.add(this, "_DBG_ConsoleUnfold")
    //             .name("[Console] Unfold")
    //         this.mainfolder.add(this, "GetToken")
    //             .name("[Game] GetToken")


    //         let avatars = [0, 1]

    //         this.info = {
    //             "0": {
    //                 rollDices: () => { this.RollDices(0) },
    //                 PhysicsRollDices: () => { this.PhysicsRollDices(0) },
    //                 bellPushed: () => { this.BellPushed(0) },
    //                 dice: 0,
    //                 chooseDice: () => { superVisor.DEV_ChooseDice(0, this.info[0].dice, this.controller) },
    //                 cancleDice: () => { superVisor.DEV_CancleDice(0, this.info[0].dice, this.controller) },
    //                 turnOndiceColor: () => { this._DBG_TurnOnDiceColor(0) },
    //                 turnOffdiceColor: () => { this._DBG_TurnOffDiceColor(0) },
    //                 turnOnFaceColor: () => { this._DBG_TurnOnFaceColor(0) },
    //                 turnOffFaceColor: () => { this._DBG_TurnOffFaceColor(0) }
    //             },
    //             "1": {
    //                 rollDices: () => { this.RollDices(1) },
    //                 PhysicsRollDices: () => { this.PhysicsRollDices(1) },
    //                 bellPushed: () => { this.BellPushed(1) },
    //                 dice: 0,
    //                 chooseDice: () => { superVisor.DEV_ChooseDice(1, this.info[1].dice, this.controller) },
    //                 cancleDice: () => { superVisor.DEV_CancleDice(1, this.info[1].dice, this.controller) },
    //                 turnOndiceColor: () => { this._DBG_TurnOnDiceColor(1) },
    //                 turnOffdiceColor: () => { this._DBG_TurnOffDiceColor(1) },
    //                 turnOnFaceColor: () => { this._DBG_TurnOnFaceColor(1) },
    //                 turnOffFaceColor: () => { this._DBG_TurnOffFaceColor(1) }
    //             }
    //         }


    //         this._DBG_GodFavorInfo = {
    //             user: 1,
    //             level: 1,
    //             godfavorIndex: 0,
    //             cost_: 0
    //         }
    //         this.godFavor = this.debug.ui.addFolder(`God Favor`);
    //         this.godFavor.add(this._DBG_GodFavorInfo, "user", [0, 1, 2])
    //         this.godFavor.add(this._DBG_GodFavorInfo, "level", [0, 1, 2])
    //         this.godFavor.add(this._DBG_GodFavorInfo, "godfavorIndex", [0, 1, 2])
    //         this.godFavor.add(this, "_DBG_GodFavorAction")


    //         // _DBG_GodFavorAction


    //         avatars.forEach(avatar => {
    //             this.debugFolder = this.debug.ui.addFolder(`${avatar}`);

    //             this.debugFolder.add(this.info[`${avatar}`], "rollDices").name("[Avatar] Roll Dices")
    //             // this.debugFolder.add(this.info[`${avatar}`], "physicsRollDices").name("[Avatar] Physics Roll Dices")
    //             this.debugFolder.add(this.info[`${avatar}`], "bellPushed").name("[Avatar] Bell Pushed")

    //             this.debugFolder.add(this.info[`${avatar}`], "turnOndiceColor").name("[Visual] Turn On Dice Color")
    //             this.debugFolder.add(this.info[`${avatar}`], "turnOffdiceColor").name("[Visual] Turn Off Dice Color")
    //             this.debugFolder.add(this.info[`${avatar}`], "turnOnFaceColor").name("[Visual] Turn On Face Color")
    //             this.debugFolder.add(this.info[`${avatar}`], "turnOffFaceColor").name("[Visual] Turn Off Face Color")


    //             this.debugFolder.add(this.info[`${avatar}`], "dice", { "red": 0, "yellow": 1, "green": 2, "sky": 3, "blue": 4, "purple": 5 })
    //                 .name("[Dice] Select")

    //             this.debugFolder.add(this.info[`${avatar}`], "chooseDice").name("[Dice] Choose")
    //             this.debugFolder.add(this.info[`${avatar}`], "cancleDice").name("[Dice] Cancle")

    //         })
    //     }
    // }

    // printSituation(obj, head) {
    //     let ret = ""
    //     if (typeof obj === "object") {
    //         for (const [key, value] of Object.entries(obj)) {
    //             // Object.keys(obj).forEach(key => {
    //             ret += `\n${head}${key} : `
    //             ret += this.printSituation(value, head + "　　")
    //             ret += ` `
    //         }
    //     }
    //     else if (Array.isArray(obj)) {
    //         obj.forEach(value => {
    //             ret += this.printSituation(value, head + ", ")
    //         })
    //     }
    //     else if (typeof obj === "function") {
    //     }
    //     else {
    //         return obj;
    //     }

    //     return ret;
    // }



    // _DBG_ConsoleReset() {
    //     // console.log(LogicKit.superVisor)
    //     // let this.situation = LogicKit._GetSituation()
    //     this.situationViewerHeader.innerText = `
    //         phase : ${this.situation.phase}
    //         turnNum : ${this.situation.turnNum}
    //         order : ${this.situation.order}
    //     `
    //     this.situationViewerTop.innerText = this.printSituation(this.situation.player[0], "")
    //     this.situationViewerBottom.innerText = this.printSituation(this.situation.player[1], "")

    // }

    // _DBG_ConsoleFold() {
    //     this.situationViewerDom.classList.remove("visible")
    // }

    // _DBG_ConsoleUnfold() {
    //     this.situationViewerDom.classList.add("visible")
    // }



    // _DBG_TurnOnDiceColor(avatar_) {
    //     let avatar = this.controller.avatars[`${avatar_}`]

    //     for (const index of Array(avatar.dices.length).keys()) {
    //         let hue = index / avatar.dices.length
    //         avatar.SetDiceMaterialColor(index, [hue, 1, 0.75]);
    //     }

    // }


    // _DBG_TurnOffDiceColor(avatar_) {
    //     let avatar = this.controller.avatars[`${avatar_}`]

    //     for (const index of Array(avatar.dices.length).keys()) {
    //         avatar.ResetDiceMaterialColor(index);
    //     }

    // }


    // _DBG_TurnOnFaceColor(avatar_) {
    //     let avatar = this.controller.avatars[`${avatar_}`]

    //     for (const index of Array(avatar.dices.length).keys()) {
    //         avatar._DBG_SetDiceFaceColor(index)
    //     }
    // }


    // _DBG_TurnOffFaceColor(avatar_) {
    //     let avatar = this.controller.avatars[`${avatar_}`]

    //     for (const index of Array(avatar.dices.length).keys()) {
    //         avatar._DBG_ResetDiceFaceColor(index)
    //     }
    // }

    // /*
    // this._DBG_GodFavorInfo = {
    //     user : 0,
    //     level : 0,
    //     godfavorIndex : 0,
    //     cost_ : 0
    // }
    // */



    // _DBG_GodFavorAction() {
    //     this.controller.MessageEnqueue("GodFavorAction", [this._DBG_GodFavorInfo])
    // }



    // this.experience.controller._GodFavorAction({user : 1, level : 2, cost_ : 0})


}