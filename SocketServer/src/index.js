import { WebSocketServer } from 'ws';

import path from 'path';
import http from 'http';
import express from 'express';

import { fileURLToPath } from 'url';

import Auth from "#auth"

import WSS from "#wss"

import Redis_Adapter from 'redis-bird'

import dotenv from "dotenv";

dotenv.config();

// process.env.pm_id



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// console.log(__dirname)

const app = express()
const server = http.createServer(app)

const port = 7500
const publicDirectoryPath = path.join(__dirname, '../../');


let redis_url = `redis://${process.env.REDIS}`
global.channel = `socket-${process.env.pm_id}`


// let redis_url = "redis://localhost:6379"
// global.channel = `socket-0`


global.redis_adapter = new Redis_Adapter(redis_url, onMessage, global.channel, "socket")


app.get("/healthcheck", (req, res, next) => {
    res.send("perfect")
})

// const wss = new WebSocketServer({ backlog : 200, server: server, path: "/ws/con" })
const wss = new WebSocketServer({ 
    noServer: true,
    path: "/ws",
    perMessageDeflate : false,

    // clientTracking : true
})

const wss_ = new WSS(wss)

function onMessage (channel_name, type, func, args, sender, id) {
    // console.log(arguments)

    let ret = wss_.Transport(func, args)
    
    if(type == "request"){
        ret.then(res=>{
            let msg = {
                func: func,
                args: [res],
                id: id
            }
    
            this._Response(sender, msg)
    
        })
    }

    
    // let ret = engine.Transport(func, args)

    // ret.then(res=>{
    //     if(type === "notify"){
    
    //     }
    
    //     if (type == "request") {
    //         // 응답 수행
    //         // ret를 되돌려준다
    
    //         let msg = {
    //             func: func,
    //             args: [res],
    //             id: id
    //         }
    
    //         this._Response(sender, msg)
    
    //     }

    // })
}



global.redis_adapter.Start_Socket_Server().then(() => {


    server.listen(port, () => {
        console.log(`[ socket-${process.env.pm_id} ] Server is up on port ${port}!`)
    })



    function gameRouter(ws, req) {


    }

    function onSocketError(err) {
        console.error(err);
    }



    server.on("upgrade", (request, socket, head) => {
        // console.log("it's middleware~")

        socket.on('error', onSocketError);

        let data = request.url.split('?')[1].split('=')
        let key = data[0]
        let matching_token = data[1]

        // console.log(`[token] ${matching_token}`)

        Auth(matching_token).then((ret) => {
            if (ret !== null) {
                // console.log(ret)
                // socket.uid = ret

                wss.handleUpgrade(request, socket, head, function done(socket) {
                    wss.emit('connection', socket, request, ret);
                });
                return;
            }
            else {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
        })


    })

})



// 공용망 통신 (실제 유저, dummy 접속)



