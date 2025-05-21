import WebSocket, { WebSocketServer } from 'ws';
// import ServerSocket from "./utils/ServerSocket.js"

import path from 'path';
import http from 'http';
import express from 'express';

import Bluebird from './utils/Bluebird.js';


import { fileURLToPath } from 'url';

// import Game from "../client/26-code-structuring-for-bigger-projects-final-main/src/Experience/Game/Game.js"
// import Game from "./src/Game/Game.js"
// import Game from "../Game/Game.js"
import * as Sockets from "./sockets.js"
// import axios from 'axios';

// import Mongo from "./db/mongo.js"

import axios from 'axios';

import Config from "../config.js"

import Subscriber from "#redis/subscriber.js";
import Publisher from "#redis/publisher.js";

global.publisher = new Publisher()
global.subscriber = new Subscriber("socket-0")


global.config = Config;

WebSocket.setMaxListeners(10000);

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// console.log(__dirname)

const app = express()
const server = http.createServer(app)

const port = 8500
const publicDirectoryPath = path.join(__dirname, '../../');

// console.log(publicDirectoryPath + 'src/server/db')
// app.use("/db", express.static(publicDirectoryPath + 'src/server/db'));


global.axios_pool = axios.create({
    httpAgent: new http.Agent({
        maxSockets: 50,
        // maxTotalSockets : 2,
        maxFreeSockets: 5,
        keepAlive: true,
        timeout: 120000,
        freeSocketTimeout: 60000,
        keepAliveMsecs : 120000
    })
});

// app.use(express.static(publicDirectoryPath + 'src'));

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

// const wss = new WebSocketServer({
//     port: 443,
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             // See zlib defaults.
//             chunkSize: 1024,
//             memLevel: 7,
//             level: 3
//         },
//         zlibInflateOptions: {
//             chunkSize: 10 * 1024
//         },
//         // Other options settable:
//         clientNoContextTakeover: true, // Defaults to negotiated value.
//         serverNoContextTakeover: true, // Defaults to negotiated value.
//         serverMaxWindowBits: 10, // Defaults to negotiated value.
//         // Below options specified as default values.
//         concurrencyLimit: 10, // Limits zlib concurrency for perf.
//         threshold: 1024 // Size (in bytes) below which messages
//         // should not be compressed if context takeover is disabled.
//     }
// });




// console.log(zzz)



// wss.on('connection', function connection(ws) {
//     console.log(player + " is connected " )
//     sockets.push(ws)
//     // console.log(sockets.length)

//     ws.index = player++

//     if(player % 2 == 1)
//         return

//     console.log("match start")

// let topSocket = sockets[player - 2]
// let bottomSocket = sockets[player - 1]

// let data = JSON.stringify(["NeedSwap", []])
// topSocket.send(data)

// let bluebird = new Bluebird()
// bluebird.topsocket = topSocket
// bluebird.bottomsocket = bottomSocket


// topSocket.on('message', function message(data) {
//     // console.log(data)

//     bluebird.Transport(data, topSocket.index)
// });


// bottomSocket.on('message', function message(data) {
//     // console.log(data)

//     bluebird.Transport(data, bottomSocket.index)
// });


// let game= new Game(bluebird)
// bluebird.game = game


// });



function gameRouter (ws,req){
    let data = req.url.split('?')[1].split('=')
    let key = data[0]
    let matching_token = data[1]

    // console.log("[[ connected to socket ]]")
    // console.log(value)

    let ret = Sockets.AddSocket(matching_token, ws)

    if (ret != null) {
        global.axios_pool({
            method: "post", // 요청 방식
            url: "http://match-maker:9010/game_create_complete", // 요청 주소
            data: ret
        }).then((ret) => { })
    }
    else{
        // console.log("failed to create socket")
    }
    

    ws.on('message', function message(data) { })
}



const wss = new WebSocketServer({ backlog : 200, server: server, path: "/ws" })

// 공용망 통신 (실제 유저, dummy 접속)
wss.on('connection', gameRouter)



// 내부망 통신용 (서버간 통신, AI Agent 통신 등)
const localApp = express()
const localServer = http.createServer(localApp)
localServer.listen(8510, () => {
    console.log(`Server is up on port 8510!`)
})


// localApp.post("/CheckPost", express.json(), (req, res, next)=>{
//     console.log(req.data)
//     res.send("copy")
// })



localApp.post("/matching/PrepareGames_", express.json(), (req, res, next) => {
    let key = req.body.key
    let game_mode = req.body.game_mode

    // console.log(key)
    // console.log(game_mode)

    let uids, tokens
    let prom0 = global.publisher.Range(key+"-uids", 0, -1).then(ret => {
        uids = ret
        console.log(uids)
    })

    
    let prom1 = global.publisher.Range(key+"-tokens", 0, -1).then(ret => {
        tokens = ret
        console.log(tokens.length)
    })

    Promise.all([prom0, prom1]).then(()=>{
        res.end()
        Sockets.PrepareGames(uids, tokens, game_mode)
    })
})


localApp.post("/matching/PrepareGames", express.json(), (req, res, next) => {
    let uids = req.body.uids
    let matching_tokens = req.body.matching_tokens
    let game_mode = req.body.game_mode
    // console.log(uids)
    // console.log(matching_tokens)
    
    let rets= []

    for (let i = 0; i < uids.length / 2; i++) {
        let uid_A = uids[i * 2]
        let uid_B = uids[i * 2 + 1]

        let matchingToken_A = matching_tokens[i * 2]
        let matchingToken_B = matching_tokens[i * 2 + 1]

        let ret = Sockets.PrepareToAddSocket([uid_A, uid_B], [matchingToken_A, matchingToken_B], game_mode)

        rets.push(ret)
    }
    // console.log(rets)
    res.send({rets : rets, uids : uids})
})

localApp.get("/alert/userstop", (req, res, next) => {
    let uid0 = req.query.uid0
    let uid1 = req.query.uid1
    
    // console.log(`cancled uid = ${uid0}, ${uid1}`)
    // game server 연결 명령전송 실패, 전송된 uid의 prepared 상태를 해제시킨다

    // Sockets.ResetUID(uid0)
    // Sockets.ResetUID(uid1)
})


localApp.get("/matching/idle_sockets_cnt", (req,res,next) => {
    // console.log(`socket limit : ${global.config.socket_limit}`)
    // console.log(`current cnt : ${Sockets.GetSocketCnt()}`)
    let idle_sockets_cnt = global.config.socket_limit - Sockets.GetSocketCnt()
    res.send({ cnt : idle_sockets_cnt })
})

// localApp.get("/matching/PrepareGame", (req, res, query) => {
//     // console.log(req.query)

//     let uids = new Array(2)
//     uids[0] = req.query.uid0
//     uids[1] = req.query.uid1
//     console.log(uids)

//     let ret = Sockets.PrepareToAddSocket(uids)

//     res.send(ret)
// })

const localWss = new WebSocketServer({ server: localServer, path: "/ws" })

localWss.on('connection', gameRouter)
