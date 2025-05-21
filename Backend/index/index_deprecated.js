
// import ServerSocket from "./utils/ServerSocket.js"
import path from 'path';
import http from 'http';
import express from 'express';

import Router_User from "./routers/user/router_user.js"
import Router_Local from "./routers/local/router_local.js"

import { fileURLToPath } from 'url';

import main from "./process/Main.js"

import WebSocket, { WebSocketServer } from 'ws';
import config from './config/config.js';

global.config = config


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const publicDirectoryPath = path.join(__dirname, './');

const app = express()
const server = http.createServer({
    keepAlive : true,
    keepAliveTimeout: 60000
}, app)

let port = parseInt(process.env["HTTP_PORT"]) // + parseInt(process.env.pm_id)

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})


app.all("/*", (req,res,next)=>{
    // console.log(`[ ${process.env.name}${process.env.pm_id} ]` + req.method + " : " + req.url);
    next();
})


app.use(express.static(publicDirectoryPath, { index: "./static" }));
app.use(express.static("user"))

app.use('/user', Router_User)

// app.get(`/${process.env.name}${process.env.pm_id}`, (req, res, next)=>{
//     console.log(` [[ ${process.env.name}${process.env.pm_id} ]]`)
//     res.send("hello")
// })






const local_app = express()
const local_server = http.createServer(local_app)

let local_port = parseInt(process.env["LOCAL_PORT"])

local_server.listen(local_port, ()=>{
    console.log(`local server is up on port ${local_port}!`)
})



local_app.all("/*", (req,res,next)=>{
    // console.log(`[ Local - ${process.env.name}${process.env.pm_id} ]` + req.method + " : " + req.url);
    next();
})


local_app.post("/AddGameDocument", express.json(),(req, res, next)=>{
    // console.log(req.body)
    res.send("ok")
})


local_app.use("/local", Router_Local)

main()


// const wss = new WebSocketServer({ server: server, path: "/hello" })

// wss.on('connection', (ws, req) => {
//     ws.on('message', (data) => {
//         console.log(` [ ${process.env.name}${process.env.pm_id} ] : ${data} `)
//     })
// })