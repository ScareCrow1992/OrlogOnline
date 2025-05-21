
// import ServerSocket from "./utils/ServerSocket.js"

// global.config = Config;

// import init_redis from "./js/processes/init_redis.js"

import Config from "./config.js"
global.config = Config;

import path from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';


import { fileURLToPath } from 'url';
import * as Storage from "./js/storage.js"
import SocketServer from "./js/socketserver.js"
import MMF from "./js/MMF.js"

import Subscriber from "#redis/subscriber.js";
import Publisher from "#redis/publisher.js";


global.publisher = new Publisher()
global.subscriber = new Subscriber("match-0")



// import dotenv from 'dotenv'

// dotenv.config();
// console.log(process.env)



MMF(global.config.MMF_loop)


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log(__dirname)

const app = express()
const server = http.createServer(app)

const port = 9000
const publicDirectoryPath = path.join(__dirname, '.././');


// SocketServer(server)
let socketServer = new SocketServer(server, "/ws")
// global.socketServer = socketServer;

console.log(publicDirectoryPath)

app.use(express.static(publicDirectoryPath, { index: "./src/html/index.html" }));
app.use("/admpage", express.static("src"))

// Public
app.get('/register_match_pool', (req, res, next) => {
    let uid = req.query.uid
    let game_mode = req.query.game_mode

    // console.log("I receive the req!")
    // console.log(`uid ~~~~ ${uid}`)

    // 1. uid 중복여부 확인 후 보관, backend에게 답장
    // 2. back-end가 client에게 matchmaker 서버로 연결요청 보냄
    // 3. browser가 소켓 연결 시도, matchmakers는 일단 받아줌
    // 4. 첫번째 통신으로 uid를 전송, matchmaker는 자신이 지닌 uid와 비교 (verify는 backend에서 사전에 끝냈음)
    //   4-1. uid 일치) 소켓 연결 유지, 후속 작업 진행
    //   4-2. uid 불일치) 소켓 연결 해제, 백엔드에게 통보

    let ret = Storage.SetUID(uid, game_mode)

    if(ret == null){
        console.log(`[ dummy ${uid} ] : already registered (${game_mode})`)
        console.log("< check the data consistency >")
        socketServer.CheckSocket(uid)
        ret = Storage.SetUID(uid, game_mode)    
    }

    // console.log(`check UID result = ${ret}`)
    if (ret != null) {
        // let token = Storage.AddToken(uid)
        res.send(ret)  // match making 등록 완료
    }
    else{
        console.log(`[ dummy ${uid} ] : already registered (${game_mode})`)
        console.log("< deny the connect >")
        res.send(false) // uid 중복
    }

})






// Local
const localApp = express()
const localServer = http.createServer(localApp)
localServer.listen(9010, () => {
    console.log(`Local Server is up on port 9010!`)
})

localApp.post('/game_create_complete', express.json(), (req, res, next)=>{
    
    // 게임이 시작된 uid들의 matching socket을 끊는다.
    let uids = req.body

    // console.log("socket's closed !!")
    // console.log(uids)

    socketServer.CloseSockets(uids)
    res.send(true)

})

localApp.post('/users_not_connected', express.json(), (req, res, next)=>{
    
    // 게임서버에 연결되지 않은 uids
    let uids = req.body

    console.log("users not connected to gameserver")
    console.log(uids)

    socketServer.CheckSockets(uids)
    res.send(true)

})




// admin page

let admin_router = express.Router()

admin_router.get("/uid", (req, res, next) => {
    let data_set = Storage.ADMIN_GetUID()
    let arr = []
    for (const item of data_set) {
        arr.push(item)
    }
    res.send(arr)
})


admin_router.get("/storage",(req, res, next)=>{
    let data = Storage.ADMIN_GetTotalData()
    console.log(data)
    res.send(true)
})


app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));


let corsOptions = {
    origin: 'http://localhost:7777',
}


app.use("/admin", cors(corsOptions), admin_router)




// // check
// for (let i = 0; i < 100; i++) {
//     Storage.SetUID(i)
//     Storage.AddToken(i)
// }

// console.log(Storage.ADMIN_GetUID())
// console.log(Storage.Get_UID_By_Token())
// console.log(Storage.ADMIN_GetToken())

// server listen
server.listen(port, () => {
    console.log(`MatchkMaker is up on port ${port}!`)
})



