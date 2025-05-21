import Agent from "../index/agent_deprecated.js"


// import { WebSocket } from "ws";
import LocalSocket from "../index/LocalSocket.js"

import Game from "../Game/Game.js"

import Bluebird from "../index/Bluebird.js";
import Config from "../index/config.js"

// import * as FS from "fs"



// import * as Redis from "../DeepLearning/redis.js"

global.config = Config

let server_address = "ws://localhost:8510/ws?agentID="

let i = 0


let cb = (winner, situation) => {
    let logs = situation.logs
    let logs_godfavor = situation.logs_godfavor

    if(++i % 1 == 0){
        console.log(`[ ${i} ] Game Over, winner : [ ${winner} ]`)
    }

    // console.log(logs)
    // Redis.InsertLogs(logs, winner)

    let winner_ = new Array(logs.First.length)

    logs.First.forEach((first, index)=>{
        winner_[index] = first == winner ? 1 : -1
    })

    logs.Winner = winner_

    // global.fs.Write(logs, logs_godfavor)
    // FS.Write(logs)


    // fs.writeFile('./save_data/datas.txt', "hello World!", err => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     // file written successfully
    // });
}

for (let i = 0; i < 1; i++){
    Run()    
    // console.log("hello")

}

// Redis.Init().then(() => {
//     // Run()
//     // setTimeout(() => {
//     //     Run()
//     // }, 3500);
//     for (let i = 0; i < 1; i++)
//         Run()    
//     // setTimeout(() => { Run() }, i * 1000)
// })



async function Run() {
    // console.log("Hello world!")

    let socketA = new LocalSocket()
    socketA.index = 0

    let socketB = new LocalSocket()
    socketB.index = 1

    let agentA = new Agent(0, cb, socketA)
    let agentB = new Agent(1, cb, socketB)



    let socketC = new LocalSocket()
    socketC.index = 0

    let socketD = new LocalSocket()
    socketD.index = 1


    socketA.othersocket = socketC
    socketC.othersocket = socketA

    socketB.othersocket = socketD
    socketD.othersocket = socketB


    CreateGame(socketC, socketD)

}



async function CreateGame(topSocket, bottomSocket) {
    let bluebird = new Bluebird()
    topSocket.partnerbird = bluebird
    bottomSocket.partnerbird = bluebird

    bluebird.Initialize0(topSocket, bottomSocket)

    topSocket.index = 0
    bottomSocket.index = 1

    let data = JSON.stringify(["NeedSwap", []])
    topSocket.send(data)

    // console.log("before game")
    let game = new Game(bluebird, 77777, cb, "constant")
    // bluebird.game = game
    // cb.situation = game.situation


    // console.log("after game")


    // bluebird.Initialize1(game)


}


// function Test__(){
//     console.log("111")

//     if(this.afterCall)
//         this.afterCall()

//     // prototype.afterCall()
// }

// Test__.prototype.afterCall = ()=>{console.log("222")}

// var t = new Test__()




export default {}

