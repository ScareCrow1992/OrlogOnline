// import Agent from "./agent.js";
// import axios from "axios";

import server_config from "./server_config.js";

import GodFavorStats from "../Game/Data/godFavorStats.js"

global.GodFavorStats = GodFavorStats
global.godFavorIndexDict = Object.keys(GodFavorStats) 
global.server_config = server_config


// import TensorCollector from "./TensorCollector.js";

// global.tensor_collector = new TensorCollector()

setInterval(()=>{
    if (global.gc) {
        // console.log("run garbage collector")
        global.tensor_collector.gc()
        global.gc()
    }
    else {
        // console.log("can't find GC")
    }        
}, 60000)

// import Dummy from "./DummyLoader.js";
// import "./cli/CLI.js"



import {} from "./run.js";


// global.TensorModel = new TensorModel("file://model_00_000/model.json")
// global.TensorModel = new TensorModel()

// let dummyloader_ = new DummyLoader()

// let modes_ = ["constant", "liberty", "draft"]
// let mode_index = 0

// dummyloader_.CreateDummy(1)
// dummyloader_.WorkLoad(0, 1, "liberty")





// mode_index++
// if(mode_index == 3)
//         mode_index = 0

// setInterval(()=>{
//         dummyloader_.WorkLoad(0, 6, modes_[mode_index])
//         mode_index++
//         if(mode_index == 3)
//                 mode_index = 0
// },5000)


// global.ddd = 0

// import * as FileSystem from "../save_data/FileSystem.js"

// global.fs = FileSystem

// import Run from "../DeepLearning/run.js"

// import * as ZMQ from "../DeepLearning/zmq.js"

// console.log("hello world")

// import Redis from "../DeepLearning/redis.js"

// import { WebSocket } from "ws";

// import mongoose from 'mongoose'
// import { mongo } from "./mongo.js"






// mongoose.connect("mongodb://my-database:27017/match_making")


// const BoardSchema = new mongoose.Schema({
//     writer: String,
//     title: String,
//     contents: String
// })

// export const Board = mongoose.model("match", BoardSchema)

// const board = new Board({
//     writer: "kj rolling",
//     title: "harry porter",
//     contents: "fantasy novel",
// });

// board.save()

// Board.find()
//     .then(res=>{console.log(res)})


if (false) {
    let agents = {}

    let cb = (uid, result) => {
        console.log(`${uid} agent - Game Over (${result ? "WIN" : "DEFEAT"})`); delete agents[`${uid}`]
    }

    let uids = new Array(2)
    for (let i = 0; i < uids.length; i++) {
        uids[i] = i
    }


    for (let i = 0; i < uids.length / 2; i++) {
        axios.get(`http://localhost:8510/matching/PrepareGame?uid0=${uids[i * 2]}&uid1=${uids[i * 2 + 1]}`)
            .then(ret => {
                agents[2 * i] = new Agent(2 * i, cb)
                agents[2 * i + 1] = new Agent(2 * i + 1, cb)

            })
    }

    setTimeout(() => { console.log(agents) }, 7000)
}



