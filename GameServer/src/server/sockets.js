import Game from "../Game/Game.js"
import Bluebird from './utils/Bluebird.js';
import mongo from "./db/mongo.js";
import RandomGenerator from "./utils/RandomGenerator.js";
import * as Backend from "#backend"

import {Result_Situation} from "#tool"

// {uid : socket}
let socket_cnt = 0;
let game_sockets = {}
let uid_pair = {}
let matchingToken_uid = {}
let games_by_uid = {}

let game_mode_by_uid = new Map()

let games = new Map()



// 15초 이내에 연결 안되는 유저 정보를 매칭서버에게 통보한다
function UserConnectTimeOut(uids, matching_tokens, game_mode){

    // let ret = [true, true]
    let not_connected_users = []

    // 0번 유저 점검
    let ret0 = Object.prototype.hasOwnProperty.call(game_sockets, uids[0])
    if(ret0 === false){
        not_connected_users.push(uids[0])
    }


    // 1번 유저 점검
    let ret1 = Object.prototype.hasOwnProperty.call(game_sockets, uids[1])
    if(ret1 === false){
        not_connected_users.push(uids[1])
    }

    if(ret0 === false || ret1 === false){
        // delete uid_pair[`${uids[0]}`]
        // delete uid_pair[`${uids[1]}`]

        // delete matchingToken_uid[`${matching_tokens[0]}`]
        // delete matchingToken_uid[`${matching_tokens[1]}`]        

        // game_mode_by_uid.delete(uids[0])
        // game_mode_by_uid.delete(uids[1])


    }


    if (ret0 === false || ret1 === false) {
        // SocketsClose(-1, uids)
        ClearData(uids[0])
        ClearData(uids[1])

        global.axios_pool({
            method: "post", // 요청 방식
            url: "http://match-maker:9010/users_not_connected", // 요청 주소
            data: uids
        }).then((ret) => {  })
        .catch(console.log)
    }

}



function ClearData(uid, matching_tokens, game_mode){
    let socket_ = game_sockets[`${uid}`]
    if(socket_)
        SocketClose(socket_)
    
    ResetUID(uid)
}


function PrepareGames(uids, matching_tokens, game_mode) {
    let length = uids.length
    for (let i = 0; i < length; i += 2) {
        let first = i
        let second = i + 1

        let part_uids = [uids[first], uids[second]]
        let part_tokens = [matching_tokens[first], matching_tokens[second]]

        PrepareGame(part_uids, part_tokens, game_mode)

    }
}


function PrepareGame(uids, matching_tokens, game_mode) {
    // console.log(arguments)

    
    let prom = new Promise((res)=>{})

    let ret = CheckConsistency(uids)
    ret.then((res) => {
        if (res == true) {
            PrepareToAddSocket(uids, matching_tokens, game_mode)

            // 게임서버에 게임을 만든다


        }
    })


    // setTimeout(() => { UserConnectTimeOut(uids, matching_tokens, game_mode) }, 10000)

    return prom

}


// 게임을 생성해도 되는지 데이터 정합성을 검사한다
function CheckConsistency(uids) {

    let prom = new Promise((res) => {

        let ret = true
        // 게임서버 소켓상태 확인
        if (Object.prototype.hasOwnProperty.call(game_sockets, uids[0]) || Object.prototype.hasOwnProperty.call(game_sockets, uids[1])) {


            if (Object.prototype.hasOwnProperty.call(game_sockets, uids[0]))
                console.log(`[RED - ${uids[0]}] socket already exists is attepted to create !!!`)


            if (Object.prototype.hasOwnProperty.call(game_sockets, uids[1]))
                console.log(`[RED - ${uids[1]}] socket already exists is attepted to create !!!`)

            ret = false
        }


        // redis 유저상태 확인
        let key0 = "/game-server/userpool/" + uids[0]
        let key1 = "/game-server/userpool/" + uids[1]

        let prom0 = global.publisher.Get(key0)
        let prom1 = global.publisher.Get(key1)

        Promise.all([prom0, prom1]).then(([ret0, ret1]) => {
            // console.log(ret0)
            // console.log(ret1)

            if (ret0 != null || ret1 != null)
                ret = false


            if (ret0 == null && ret1 != null)
                console.log(`[RED - ${uids[1]}] user already play game at ***`)


            if (ret0 != null && ret1 == null)
                console.log(`[RED - ${uids[0]}] user already play game at ***`)

            res(ret)
        })
    })

    return prom
}



// uids[0], uids[1] 대결 시작
function PrepareToAddSocket(uids, matching_tokens, game_mode) {
    // [RED] 해당 uid의 소켓이 이미 존재함

    // if (!Object.prototype.hasOwnProperty.call(game_sockets, uids[0]) && !Object.prototype.hasOwnProperty.call(game_sockets, uids[1])) {

    // let key0 = "/game-server/userpool/" + uids[0] 
    // let key1 = "/game-server/userpool/" + uids[1] 


    // let data0 = {
    //     uid : uids[0],
    //     token : matching_tokens[0],
    //     gamemode : game_mode
    // }

    // let data1 = {
    //     uid : uids[1],
    //     token : matching_tokens[1],
    //     gamemode : game_mode
    // }

    // data0 = JSON.stringify(data0)
    // data1 = JSON.stringify(data1)


    // global.publisher.SetUserProperty(){

    // }
    



    let key_token_0 = "/game-server/tokenpool/" + matching_tokens[0]
    let key_token_1 = "/game-server/tokenpool/" + matching_tokens[1]





    uid_pair[`${uids[0]}`] = uids[1]
    uid_pair[`${uids[1]}`] = uids[0]

    delete game_sockets[`${uids[0]}`]
    delete game_sockets[`${uids[1]}`]

    matchingToken_uid[`${matching_tokens[0]}`] = uids[0]
    matchingToken_uid[`${matching_tokens[1]}`] = uids[1]

    game_mode_by_uid.set(uids[0], game_mode)
    game_mode_by_uid.set(uids[1], game_mode)



        // console.log(`${uids} is prepared to game`)
        // return true
    // }
    // else {
    //     /// [RED] 해당 uid의 소켓이 이미 존재함

    //     if(Object.prototype.hasOwnProperty.call(game_sockets, uids[0]))
    //         console.log(`[RED - ${uids[0]}] socket already exists is attepted to create !!!`)

        
    //     if(Object.prototype.hasOwnProperty.call(game_sockets, uids[1]))
    //         console.log(`[RED - ${uids[1]}] socket already exists is attepted to create !!!`)
    //     return false
    // }
}


function AddSocket(matching_token, ws){
    let uid = matchingToken_uid[`${matching_token}`]

    if(uid == undefined || uid == null){
        console.log(`[RED - ${uid}] un-registered token is received !!!`)
        return null;
    }

    if (Object.prototype.hasOwnProperty.call(game_sockets, uid)){
        /// [RED] 해당 uid의 소켓이 이미 존재함
        console.log(`[RED - ${uid}] socket already exists is attepted to create !!!`)
        return null;
    }

    game_sockets[`${uid}`] = ws
    game_sockets[`${uid}`].uid = uid
    socket_cnt++;

    let opponent = uid_pair[`${uid}`]
    // console.log(`${uid}'s socket ready`)
    delete matchingToken_uid[`${matching_token}`]


    ws.on('close', function message(data, reason) {
        let cGame = games.get(ws.uid)
        let is_gameover = true

        if(cGame){
            is_gameover = cGame.isOver
        }

        if (ws.uid && (is_gameover != true)) {
            console.log(` [${ws.uid}]'s socket is closed ! `)
            console.log(` [${ws.uid}] reason : ${reason} `)

            SocketClose_Alert(ws)
        }
    })


    if (Object.prototype.hasOwnProperty.call(game_sockets, uid) && Object.prototype.hasOwnProperty.call(game_sockets, opponent)) {
        // 양쪽 모두 접속 완료, 게임 시작


        let topSocket = game_sockets[`${uid}`]

        let bottomSocket = game_sockets[`${opponent}`]

        let game_mode = game_mode_by_uid.get(uid)


        
        if(games.has(topSocket.uid)){
            console.log(`[ ${topSocket.uid}'s game is already exist! ]`)

        }

        if(games.has(bottomSocket.uid)){
            console.log(`[ ${bottomSocket.uid}'s game is already exist! ]`)

        }

        // console.log(`game for ${uid} ans ${opponent} is created`)
        CreateGame(topSocket, bottomSocket, game_mode)

        return [uid, opponent]
    }

    return null
}


function CreateGame(topSocket, bottomSocket, game_mode) {
    let bluebird = new Bluebird()
    bluebird.Initialize0(topSocket, bottomSocket)

    let data = JSON.stringify(["NeedSwap", []])
    topSocket.send(data)

    let random_generator = new RandomGenerator()

    // mongo.CreateRepository(topSocket.uid, bottomSocket.uid)
    //     .then((resolve) => {
    // let doc_id = resolve
    // let doc_id = 999999

    try {
        let game = new Game(bluebird,
            (winner, situation) => { GameOver_Callback(winner, situation, [topSocket, bottomSocket]) },
            game_mode, random_generator)

        topSocket.index = 0
        bottomSocket.index = 1

        games.set(topSocket.uid, game)
        games.set(bottomSocket.uid, game)

        bluebird.Initialize1(game)

        topSocket.on('message', function message(data) {
            bluebird.Transport(data, topSocket.index)
        });

        bottomSocket.on('message', function message(data) {
            bluebird.Transport(data, bottomSocket.index)
        });
    }
    catch (err) {
        console.log(err)
        console.log("failed to create game instance")
        // Game 인스턴스 생성 실패
        // 1. 재생성 시도
        // 2. 클라이언트와 소켓 연결 해제
    }

    // })
}


function GameOver_Callback(winner, situation, sockets){
    // mongo.InsertLog(situation.doc_id, situation.logs_)

    // games.delete(sockets[0].uid)


    let lead_index = situation.first

    let first = {
        sub : sockets[lead_index].uid,
        godfavors : situation.player[lead_index].godFavors
    }

    let second = {
        sub : sockets[1 - lead_index].uid,
        godfavors : situation.player[1 - lead_index].godFavors
    }
    
    let result_situaion = Result_Situation(situation)

    Backend.AddResult(first, second, result_situaion)
    SocketsClose(winner, sockets)
}

// 양쪽 소켓의 연결이 동시에 끊길 경우에 주의할 것
// 클라이언트측에서 일방적으로 연결 끊을경우 (비정상 종료)
function SocketClose_Alert(socket) {
    let uid = socket.uid
    let opponent = uid_pair[`${uid}`]

    console.log(`[alert stop] : ${uid}, ${opponent}`)

    let game = socket.game
    if (game) {
        game.AlertStop(socket.index)
    }

    // let other_socket = sockets[opponent]
    // if (other_socket) {
    //     SocketClose(other_socket)
    // }

    // SocketClose(socket)
}



// uid를 key로 가지는 모든 정보들을 지운다
// 호출 : 소켓 닫힘, 
function SocketsClose(winner, gameover_sockets){
    // console.log("== Sockets Close ==")
    // console.log(`top : ${gameover_sockets[0].uid}`)
    // console.log(`bottom : ${gameover_sockets[1].uid}`)
    // console.log(`[ ${gameover_sockets[0].uid} vs ${gameover_sockets[1].uid} ] => winner is ${gameover_sockets[winner].uid}`)

    // delete games_by_uid[`${gameover_sockets[1].uid}`]

    // game_mode_by_uid.delete(gameover_sockets[1].uid)

    gameover_sockets.forEach(socket=>{
        SocketClose(socket)
    })

}


function SocketClose(socket) {
    // console.log(`closed socket : ${socket.uid}`)
    let uid = socket.uid
    delete game_sockets[`${uid}`]
    // delete uid_pair[`${uid}`]
    socket.uid = null
    socket.close()
    socket_cnt--;

    ResetUID(uid)
}


function ResetUID(uid){
    // console.log("Reset UID")
    // delete ResetUID[`${uid}`]
    game_mode_by_uid.delete(uid)
    delete games_by_uid[`${uid}`]
    delete uid_pair[`${uid}`]
    delete matchingToken_uid[`${uid}`]
    
    games.delete(uid)
}


function GetSocketCnt(){return socket_cnt}

export { PrepareGames, PrepareToAddSocket, AddSocket, GetSocketCnt }