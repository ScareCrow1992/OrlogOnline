import Bluebird from "./utils/Bluebird.js"
// import Game from "./Game/Game.js"
import Game from "../Game/Game.js"
import Agent from "./agent.js"
import LocalSocket from "./LocalSocket.js"

// import Redis_Adapter from "redis-bird"

import Machine from "../GameLearning/Machine.js"
import BatchGenerator from "../GameLearning/BatchGenerator.js"
import TF_Model from "../GameLearning/tf_models/TF_Model.js"

import FileManager from "./FileManager.js"

// import TensorCollector from "./TensorCollector.js"

global.gameover_cnt = 0

const ROLL = 0, GODFAVOR = 1



// global.tensor_collector = new TensorCollector()

// setInterval(()=>{
//     if (global.gc) {
//         // console.log("run garbage collector")
//         global.tensor_collector.gc()
//         global.gc()
//     }
//     else {
//         // console.log("can't find GC")
//     }        
// }, 60000)



export default class Launcher {
    constructor() {


        this.roll_model = new TF_Model(94, 64, ROLL)
        this.godfavor_model = new TF_Model(57, 61, GODFAVOR)
        this.batch_generator = new BatchGenerator(this.roll_model, this.godfavor_model)

        this.roll_model_new = new TF_Model(94, 64, ROLL)
        this.godfavor_model_new = new TF_Model(57, 61, GODFAVOR)
        this.batch_generator_new = new BatchGenerator(this.roll_model_new, this.godfavor_model_new)

        this.fileManager = new FileManager()

        this.machine = new Machine(null, this.batch_generator, this.batch_generator_new, this.roll_model, this.godfavor_model, this.roll_model_new, this.godfavor_model_new)

        this.agents = []


        this.state_ = "idle"

    
    }


    Transport(func, args){
        switch (func) {
            case "createstream":
                this.fileManager.Create_Write_Stream(args[0])
                return null

            case "creategame":
                setTimeout(() => {
                    this.CreateGame("liberty", null, args[0])
                        .then(agents => { this.agents = agents; this.Compare() })
                }, 4000)
                return global.cluster_index

            case "training":
                this.Training(...args)
                return null

            case "savelogs":
                this.SaveLogs(this.agents, args[0], args[1])
                return global.cluster_index

            case "savemodel":
                this.SaveModel(...args)
                return null

            case "loadmodel":
                this.LoadModel(...args)
                return null

            // case "loadmodel_other":
            //     this.LoadModel_Other(...args)
            //     return null

            case "compare":
                return this.Compare(...args)
                
            case "setmode":
                this.Set_Mode(...args)
                return null
    

            case "ping":
                return "pong"

            case "info":
                console.log("return info")
                return this.Get_Info()


        }

        return null
    }



    Set_Mode(mode_){
        if(mode_ == "training"){
            console.log("training mode on")
            this.machine.Set_Mode_Training()
        }
        else if (mode_ == "test"){
            console.log("test mode on")
            this.machine.Set_Mode_Test()
        }

    }



    async CreateGame(game_mode, situation, game_cnt){
        this.agents = null
        // console.log(arguments)
        this.machine.Reset_Playout_Cnt()
        this.machine.Set_GameCnt(game_cnt)
        let gameover_promise = []
        global.gameover_cnt = 0

        this.state_ = "working"

        for (let i = 0; i < game_cnt; i++) {
            let ret = this._CreateGame_("liberty", null)
            gameover_promise.push(ret)
            // agents.push(...ret)
            // agents.push(ret[0])
    
            // if(ret[0].win == true)
            //     agents.push(ret[0])
            // else
            //     agents.push(ret[1])
    
            // if(i % 100 == 0)
            // console.log(i, "-th game")
        }
    
        let agents = await Promise.all(gameover_promise)

        this.state_ = "idle"

        
        let msg = {
            func : "simulation_end",
            args : [global.cluster_index]
        }

        global.Redis_Adapter._Notify("cli-0", msg)


        return agents  // [game_cnt][2]
    }


    _CreateGame_(game_mode, situation) {

        let random_generator = new RandomGenerator()
        let bluebird = new Bluebird()


        let redSockets = [
            new LocalSocket(), new LocalSocket()
        ]

        let blueSockets = [
            new LocalSocket(), new LocalSocket()
        ]


        redSockets[0].othersocket = blueSockets[0]
        redSockets[1].othersocket = blueSockets[1]

        redSockets[0].index = 0
        redSockets[1].index = 1

        blueSockets[0].othersocket = redSockets[0]
        blueSockets[1].othersocket = redSockets[1]


        blueSockets[0].partnerbird = bluebird
        blueSockets[1].partnerbird = bluebird

        blueSockets[0].index = 0
        blueSockets[1].index = 1


        let agents = [
            new Agent(0, GameEnd, redSockets[0], situation, this.machine),
            new Agent(1, GameEnd, redSockets[1], situation, this.machine)
        ]

        agents[0].mode = game_mode
        agents[0].state = "playing"

        agents[1].mode = game_mode
        agents[1].state = "playing"


        let res_ = null
        let promise_ = new Promise(res => {
            res_ = res
        })

        bluebird.Initialize0(...blueSockets)

        let game = new Game(
            bluebird,
            () => { res_(agents) },
            game_mode,
            random_generator)

        bluebird.Initialize1(game)


        let data = ["NeedSwap", []]
        blueSockets[0].send(data)


        game.InitialGame(situation)

        return promise_
    }


    SaveModel(ver){
        this.roll_model_new.SaveModel(ver, "roll")
        this.godfavor_model_new.SaveModel(ver, "godfavor")

    }


    LoadModel(ver, type){

        if(type == 0){

            console.log("old model loaded : ", ver)

            this.roll_model.LoadModel(ver, "roll")
            this.godfavor_model.LoadModel(ver, "godfavor")
    
            this.machine.Set_Version(ver)
        }
        else{
            console.log("new model loaded : ", ver)


            this.roll_model_new.LoadModel(ver, "roll")
            this.godfavor_model_new.LoadModel(ver, "godfavor")
            
        }
    }


    // LoadModel_Other(ver){
    //     this.roll_model.LoadModel_Other(ver, "roll")
    //     this.godfavor_model.LoadModel_Other(ver, "godfavor")

    // }


    // agents [gamecnt][2]
    SaveLogs(agents, url, instance_index){

        this.fileManager.Write_Logs(agents, url, instance_index)
    }


    LoadLogs(cluster_cnt, ver){
        return this.fileManager.Read_Logs(cluster_cnt, ver)
    }


    async Training(cluster_cnt, ver) {
        console.log("cluster_cnt : ", cluster_cnt, ", ver : ", ver)
        if(global.cluster_index != 0)
            return

        let [roll_logs, godfavor_logs, agent_cnt] = this.LoadLogs(cluster_cnt, ver)

        // console.log(roll_logs.states.length)
        // console.log(roll_logs.mask.length)
        // console.log(agent_cnt)

        await this.roll_model_new.Fit(roll_logs, agent_cnt)
        await this.godfavor_model_new.Fit(godfavor_logs, agent_cnt)

        
        let msg = {
            func : "training_end",
            args : []
        }

        if(global.Redis_Adapter)
            global.Redis_Adapter._Notify("cli-0", msg)

    }


    Get_Info(){
        return [global.cluster_index, this.state_, this.machine.Get_Playout_Cnt(),
            global.gameover_cnt, "null", "null"]
    }




    Compare(){
        let game_cnt = this.agents.length
        let ret = new Array(2).fill(0)
        for (let game_index = 0; game_index < game_cnt; game_index++) {
            if(this.agents[game_index][0].win == true){
                let agent_index = this.agents[game_index][0].index
                ret[agent_index]++

            }
            if(this.agents[game_index][1].win == true){
                let agent_index = this.agents[game_index][1].index
                ret[agent_index]++
            }
        }

        

        console.log("compare : ", ret)

        return ret
    }


    async Test(){
        // test

        console.log("Test Start")

        this.LoadModel(0, 0)
        this.LoadModel(0, 1)

        // await this.Training(20, 1)

        // await this.Training(30, 2)

        global.gameover_cnt = 10000

        // return
        setTimeout(async () => {

            

            // let state_ = {
            //     avatar: {
            //         health: 11,
            //         token: 0,
            //         godFavors: [4, 7, 13],
            //         dices: {
            //             axe: 0,
            //             arrow: 0,
            //             helmet: 0,
            //             shield: 3,
            //             steal: 0,
            //             mark: 0,
            //             empty: 3
            //         },
            //         dices_: {
            //             weapon: [null, null, "shield", "shield", null, "shield"],
            //             // weapon: new Array(6).fill(null),
                        
            //             mark: [false, false, false, false, false, false]
            //         }
            //     },
            //     opponent: {
            //         health: 8,
            //         token: 2,
            //         godFavors: [6, 7, 19],
            //         dices: {
            //             axe: 0,
            //             arrow: 0,
            //             helmet: 0,
            //             shield: 6,
            //             steal: 0,
            //             mark: 4,
            //             empty: 0
            //         },
            //         dices_: {
            //             weapon: ["shield", "shield", "shield", "shield", "shield", "shield"],
            //             mark : [false, true, true, false, true, true]
            //             // weapon: new Array(6).fill(null),
            //             // mark: new Array(6).fill(false)
            //         }
            //     },
            //     situation: {
            //         order: [0, 1],
            //         round: 0,
            //         turn: 2,
            //         phase: 0,
            //         // rolled_dices : {
            //         //     weapon: ["arrow", "arrow", "arrow", "arrow", "arrow", "axe"],
            //         //     mark : [false, false, false, false, false, false]
            //         //     // weapon: [null, null, null, "steal", "arrow", null],
            //         //     // mark : [false, false, false, false, true, false]
            //         // }
            //     }
            // }


            // 0 0 1 0 1 0
            // let rolled_dices = ["top", "top", null, null, "top", null]
            // let rolled_dices = ["bottom", "bottom", "back", "right", "right", "front"]
            // let rolled_dices = ["front", "back", "back", "back", "bottom", "left"]
            // let rolled_dices = ["front", "left", "right", null, null, null]
            // let rolled_dices = ["top", "top", "top", "top", "top", "top"]

            

            // let [actions, value, mask] = await this.machine.Predict(state_, 0, "avatar")
            // actions.sort((a, b)=>{
            //     return a.probability - b.probability
            // })
            // actions.forEach(action_=>{
            //     console.log(action_)
            // })

            // console.log("action size : ", actions.length)
            
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)
            // this.machine.Playout(state_, rolled_dices, 11, 0, null, 64)

        }, 2000)

    }

}




function GameEnd(uid, isWin, score) {
    // console.log(uid,isWin, score)

    // if(isWin == true)
    //     console.log("winner : ", uid)
    global.gameover_cnt++

    if (global.gameover_cnt % 20 == 19)
        console.log(`[[ agent-${cluster_index} ]] game over - ${global.gameover_cnt}`)

}



class RandomGenerator {
    constructor() {

        this.logs = []
    }


    RandomInteger(from, to) {
        let diff = to + 1 - from
        let rand = Math.floor(Math.random() * diff) % diff + from

        // this.PushLog(rand)
        return rand
    }
}
