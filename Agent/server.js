import WebSocket, { WebSocketServer } from 'ws';
// import ServerSocket from "./utils/ServerSocket.js"

import path from 'path';
import http from 'http';
import express from 'express';


WebSocket.setMaxListeners(1000);

const app = express()
const server = http.createServer(app)

let port = 7373

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})


app.use("/*", (req,res,next)=>{
    console.log("nice~~")
    console.log("wow~~")
    console.log(req)
    next();
})


server.on("upgrade", (request, socket, head) => {
    // console.log("it's middleware~")

    socket.on('error', onSocketError);

    let data = request.url.split('?')[1].split('=')
    let key = data[0]
    let matching_token = data[1]

    console.log(`[token] ${matching_token}`)

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




// app.ws("/hello",()=>{console.log("hello")})

const wss = new WebSocketServer({ noServer: true, path: "/hello" })

wss.on('connection', (ws, req) => {
    ws.on('message', (data) => {
        console.log(data)
    })
})