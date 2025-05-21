import Bluebird from "./utils/Bluebird.js"
// import Game from "./Game/Game.js"
import Game from "../Game/Game.js"
import Agent from "./agent.js"
import LocalSocket from "./LocalSocket.js"
import fs from "fs"


import Redis_Adapter from "redis-bird"

import Machine from "../GameLearning/Machine.js"
import BatchGenerator from "../GameLearning/BatchGenerator.js"
import TF_Model from "../GameLearning/tf_models/TF_Model.js"

import { State_Serialize } from "../GameLearning/Util/utils.js"


const roll_model = new TF_Model(94, 64)
const godfavor_model = new TF_Model(57, 61)

const batch_generator = new BatchGenerator(roll_model, godfavor_model)


class RandomGenerator {
    constructor() {

        this.logs = []
    }


    RandomInteger(from, to){
        let diff = to + 1 - from
        let rand = Math.floor(Math.random() * diff) % diff + from

        // this.PushLog(rand)
        return rand
    }
}

global.gameover_cnt = 0


// game_mode = "constant" or "liberty" or "draft"
export default function CreateGame(game_mode, situation = null, machine_){

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
        new Agent(0, GameEnd, redSockets[0], situation, machine_),
        new Agent(1, GameEnd, redSockets[1], situation, machine_)
    ]

    agents[0].mode = game_mode
    agents[0].state = "playing"

    agents[1].mode = game_mode
    agents[1].state = "playing"


    let res_ = null
    let promise_ = new Promise(res=>{
        res_ = res
    })

    bluebird.Initialize0(...blueSockets)

    let game = new Game(
        bluebird,
        () => {res_(agents)},
        game_mode,
        random_generator)

    bluebird.Initialize1(game)
    

    let data = ["NeedSwap", []]
    blueSockets[0].send(data)

    game.InitialGame(situation)

    return promise_
}



function GameEnd(uid, isWin, score){
    // console.log(uid,isWin, score)
    global.gameover_cnt++

    console.log(`[[ agent-${cluster_index} ]] game over - ${global.gameover_cnt}`)

}




let cluster_index
if(process.env.pm_id != undefined)
    cluster_index = process.env.pm_id
else
    cluster_index = 0



// global.Redis_Adapter = new Redis_Adapter("redis://localhost:6379", (channel_name, msg)=>{
//     console.log(`[ ${channel_name} ] ${msg}`)
// }, `agent-${cluster_index}`, "agent")


function Write_Logs(states, actions, score, f_state, f_action, f_result){
    let log_length = states.length

    let state_, action_

    
    f_state.write("[")
    f_action.write("[")
    f_result.write("[")

    for(let log_index = 0 ;log_index < log_length; log_index++){
        state_ = states[log_index]
        action_ = actions[log_index]


        f_state.write(JSON.stringify(State_Serialize(state_)))
        f_action.write(action_.toString())
        f_result.write(score.toString())

        // this.w_godfavor_state.write(",")
        if(log_index != log_length - 1){
        
            f_state.write(",")
            f_action.write(",")
            f_result.write(",")   
        }
    }

    f_state.write("]")
    f_action.write("]")
    f_result.write("]")
}


function Training(cluster_cnt, agent_cnt){

    let roll_states = [], roll_actions = [], roll_results = [], godfavor_states = [], godfaor_actions = [], godfavor_results = []

    let train_datas = [roll_states, roll_actions, roll_results, godfavor_states, godfaor_actions, godfavor_results]


    for (let cluster_index = 0; cluster_index < cluster_cnt; cluster_index++){
        let read_streams = [
            fs.readFileSync(`./instance_${cluster_index}/roll_state.txt`, "utf-8"),
            fs.readFileSync(`./instance_${cluster_index}/roll_action.txt`, "utf-8"),
            fs.readFileSync(`./instance_${cluster_index}/roll_result.txt`, "utf-8"),
            fs.readFileSync(`./instance_${cluster_index}/godfavor_state.txt`, "utf-8"),
            fs.readFileSync(`./instance_${cluster_index}/godfavor_action.txt`, "utf-8"),
            fs.readFileSync(`./instance_${cluster_index}/godfavor_result.txt`, "utf-8")
        ]
    
        
        read_streams.forEach((stream_, index_)=>{
            // let tmp = stream_.slice(0, -1)
            // tmp = tmp.replace(/\s/g, ",")
            // let tmp = stream_.replace("][", "],[")
            // console.log("\n@@@@@\n")
            // console.log(tmp)
            // console.log("\n@@@@@\n")

            let data_ = JSON.parse(stream_)
            // console.log(tmp)
            // let data_ = JSON.parse("[" + tmp + "]")
            // console.log(data_.length)
            // console.log(data_)

            train_datas[index_].push(...data_)
        })
    }


    console.log(roll_states.length)
    console.log(roll_actions.length)
    console.log(roll_results.length)
    console.log(godfavor_states.length)
    console.log(godfaor_actions.length)
    console.log(godfavor_results.length)


    for (let i = 0; i < agent_cnt; i++) {

        console.log(roll_states[i].length)
        console.log(roll_actions[i].length)
        console.log(roll_results[i].length)
        console.log(godfavor_states[i].length)
        console.log(godfaor_actions[i].length)
        console.log(godfavor_results[i].length)

    }



}



async function Main() {

    const f_roll_state = fs.createWriteStream(`./instance_${cluster_index}/roll_state.txt`)
    const f_roll_action = fs.createWriteStream(`./instance_${cluster_index}/roll_action.txt`)
    const f_roll_result = fs.createWriteStream(`./instance_${cluster_index}/roll_result.txt`)

    const f_godfavor_state = fs.createWriteStream(`./instance_${cluster_index}/godfavor_state.txt`)
    const f_godfavor_action = fs.createWriteStream(`./instance_${cluster_index}/godfavor_action.txt`)
    const f_godfavor_result = fs.createWriteStream(`./instance_${cluster_index}/godfavor_result.txt`)

    let f_streams = [f_roll_state, f_roll_action, f_roll_result, f_godfavor_state, f_godfavor_action, f_godfavor_result]

    f_streams.forEach(f_stream=>{f_stream.write("[")})


    const machine_ = new Machine(null, batch_generator, roll_model, godfavor_model)
    // for (let i = 0; i < 100; i++)
    let gameover_promise = []

    let game_cnt = 1

    for (let i = 0; i < game_cnt; i++) {
        let ret = CreateGame("liberty", null, machine_)
        gameover_promise.push(ret)
        // agents.push(...ret)
        // agents.push(ret[0])

        // if(ret[0].win == true)
        //     agents.push(ret[0])
        // else
        //     agents.push(ret[1])

        // if(i % 100 == 0)
        console.log(i, "-th game")
    }

    let results = await Promise.all(gameover_promise)
    // console.log(results)

    let agent_size = results.length

    let roll_state, roll_action, godfavor_state, godfavor_action
    let result = undefined
    for (let i = 0; i < agent_size; i++) {
        for (let j = 0; j < 2; j++) {
            let agent = results[i][j]
            let logs = agent.logs


            roll_state = logs.roll.state
            roll_action = logs.roll.action

            godfavor_state = logs.godfavor.state
            godfavor_action = logs.godfavor.action

            result = agent.win == true ? 1.0 : -1.0

            Write_Logs(roll_state, roll_action, result, f_roll_state, f_roll_action, f_roll_result)
            Write_Logs(godfavor_state, godfavor_action, result, f_godfavor_state, f_godfavor_action, f_godfavor_result)

            if(i != agent_size -1 || j != 1){
                f_streams.forEach(f_stream=>{f_stream.write(",")})

            }
            // console.log("")
        }
        // console.log("\n==================\n")
    }

    f_streams.forEach(f_stream=>{f_stream.write("]")})

    setTimeout(() => { Training(1, game_cnt * 2) }, 3000)



    // console.log(read_streams[0])

    // read_streams[0] = read_streams[0].slice(0, -1)
    // read_streams[0] = read_streams[0].replace(/\s/g, ",")

    // let read_roll_states = JSON.parse("[" + read_streams[0] + "]")
    // console.log(read_roll_states)


    // let read_roll_states = JSON.parse("[" + read_streams[0] + "]")
    // let read_roll_states = read_streams[0].split(" ")
    // read_roll_states.pop()
    // console.log(read_roll_states[read_roll_states.length - 1])

    // console.log(read_roll_states)





    // while(global.situations_stack.length != 0){
    //     let force_sync_ = global.situations_stack.pop()
    //     console.log(force_sync_)

    // }


    // await global.TensorModel.Fit(agents)

}

// await global.TensorModel.Save(`file://model_00_00${batch_}`)



Main()


// global.Redis_Adapter.ready.then(()=>{
//     console.log(`agent-${cluster_index} - start`)
//     Main()
// })

// setTimeout(async function () {
//     // CreateGame("constant")

//     // global.situations_stack = []
//     // setInterval(()=>{ console.log(global.situations_stack.length) },10000)


//     for(let batch_ = 0; batch_ < 1; batch_++){
//         for (let j = 0; j < 1; j++) {
//             console.log(`[[ ${j} ]]`)
//             let agents = []
    
//             for (let i = 0; i < 1; i++) {
//                 let ret = await CreateGame("liberty")
//                 agents.push(...ret)
//                 // agents.push(ret[0])
    
//                 // if(ret[0].win == true)
//                 //     agents.push(ret[0])
//                 // else
//                 //     agents.push(ret[1])
    
//                 if(i % 100 == 0)
//                     console.log(i, "-th game")
//             }


//             // while(global.situations_stack.length != 0){
//             //     let force_sync_ = global.situations_stack.pop()
//             //     console.log(force_sync_)

//             // }

            
//             await global.TensorModel.Fit(agents)
    
//         }
    
//         // await global.TensorModel.Save(`file://model_00_00${batch_}`)

//     }



// },3000)