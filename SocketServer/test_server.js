import WebSocket, { WebSocketServer } from 'ws';
// import ServerSocket from "./utils/ServerSocket.js"

import path from 'path';
import http from 'http';
import express from 'express';


import { fileURLToPath } from 'url';

// import Game from "../client/26-code-structuring-for-bigger-projects-final-main/src/Experience/Game/Game.js"
// import Game from "./src/Game/Game.js"
// import Game from "../Game/Game.js"
// import axios from 'axios';

// import Mongo from "./db/mongo.js"



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// console.log(__dirname)

const app = express()
const server = http.createServer(app)

const port = 8500
const publicDirectoryPath = path.join(__dirname, '../../');

// console.log(publicDirectoryPath + 'src/server/db')
// app.use("/db", express.static(publicDirectoryPath + 'src/server/db'));



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


// app.use("/ws/con", (req, res, next) => {
//     console.log("[app] : middleware~")
//     next()
// })


function gameRouter (ws,req){

    console.log("[wss] : connection~")


    return 5

    // let data = req.url.split('?')[1].split('=')
    // let key = data[0]
    // let matching_token = data[1]

    // // console.log("[[ connected to socket ]]")
    // // console.log(value)

    // let ret = Sockets.AddSocket(matching_token, ws)

    // if (ret != null) {
    //     global.axios_pool({
    //         method: "post", // 요청 방식
    //         url: "http://match-maker:9010/game_create_complete", // 요청 주소
    //         data: ret
    //     }).then((ret) => { })
    // }
    // else{
    //     // console.log("failed to create socket")
    // }
    

    // ws.on('message', function message(data) { })
}



server.on("upgrade", (request, socket, head) => {
    // console.log(request)

    let keys = Object.keys(head)

    console.log(request.url)
    // socket.on('error');

    // This function is not defined on purpose. Implement it with your own logic.
    // authenticate(request, function next(err, client) {
    //     if (err || !client) {
    //         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //         socket.destroy();
    //         return;
    //     }

    //     socket.removeListener('error', onSocketError);

    //     wss.handleUpgrade(request, socket, head, function done(ws) {
    //         wss.emit('connection', ws, request, client);
    //     });
    // });

    console.log("it's middleware~")


    setTimeout(()=>{
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
        socket.destroy()
    }, 2000)


    // wss.handleUpgrade(request, socket, head, function done(ws) {
    // wss.emit('connection', socket, request);
    // });
})


// const wss = new WebSocketServer({ backlog : 200, server: server, path: "/ws/con" })
const wss = new WebSocketServer({ backlog : 200, noServer: true, path: "/ws/con" })

// 공용망 통신 (실제 유저, dummy 접속)
wss.on('connection', gameRouter, gameRouter)



