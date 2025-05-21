import WebSocketm, { WebSocketServer } from 'ws';
import ProcessMsg from "./ProcessMsg.js";
import PostAction from "./PostAction.js"
import * as Storage from "./storage.js"
import Socket from "./Socket.js"
import axios from 'axios'


// setTimeout(() => {
//     axios.post("http://game-server:4430/CheckPost", { data: "[0, 1, 2, 3, 4, 5, 67, 8, 9, 10, 11, 12, 13]" })
//         .then((res) => { console.log(res.data) })
// }, 3000)


// setTimeout(() => {
//     axios({
//         method: "post", // 요청 방식
//         url: "http://game-server:4430/CheckPost", // 요청 주소
//         data: {
//             id: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         } // 제공 데이터(body)
//     });
// }, 3000)




// setTimeout(() => {
//     axios({
//         method: "post", // 요청 방식
//         url: "http://game-server:4430/matching/PrepareGames", // 요청 주소
//         data : {
//             uid : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         } // 제공 데이터(body)
//     })
//         .then((ret) => { console.log(ret.data) })
// }, 3000)



const gameserver_host = ""

export default class WSServer {
    constructor(httpserver, path) {

        this.wss
        this.sockets = {
            "constant" : new Map(),
            "liberty" : new Map(),
            "draft" : new Map()
        }
        this.Create_Web_SocketServer(httpserver, path)
    }



    CheckSockets(uids){
        uids.forEach(uid=>{
            this.ClearUserData(uid)
            // this.CheckSocket(uid)
        })
    }


    CheckSocket(uid){
        // storage 정보와 소켓, 둘중 하나라도 데이터가 unvalid 하다면 매칭서버에서 해당 uid에 관련된 모든 정보를 지운다

        // let socket_valid = this.sockets["constant"].has(uid) || this.sockets["liberty"].has(uid) || this.sockets["draft"].has(uid)

        let socket_valid = false
        let game_modes = ["constant", "liberty", "draft"]

        // storage 의 GetGameMode를 참조하지 않고, 직접 검색한다
        game_modes.forEach(game_mode => {
            let sockets = this.sockets[`${game_mode}`]

            if(sockets.has(uid)){
                let socket = sockets.get(uid)
                if(socket.CheckValidate()){
                    socket_valid = true
                }
            }
        })

        let has_uid = Storage.GetUID(uid)

        if(socket_valid == false || has_uid == false){
            console.log(`[ ${uid} ] 정합성이 불일치하는 데이터가 발견되었습니다. 데이터 말소를 실행합니다.`)
            console.log("[ symptom ]")

            if(socket_valid == false && has_uid == true){
                console.log("user 데이터는 존재, 소켓이 없음")
                // 원인 : 매칭서버와 유저간의 소켓 연결이 실패
            }
            if(socket_valid == true && has_uid == false){
                console.log("[예외상황] 소켓은 존재, 유저 데이터가 없음")
                // 발생 불가능
            }

            // this.CloseSocket(uid, "red")
            this.ClearUserData(uid)
        }


        if(socket_valid == true && has_uid == true){
            console.log(`[ ${uid} ] 소켓과 유저데이터 모두 있음.`)
            // 원인 : 게임서버와 유저간의 소켓 연결이 실패, 게임서버로부터 데이터 말소 신호를 아직 받지못함
            // 추후 매칭 서버가 inmemory db를 직접 참조하여, 게임서버와 연결된 소켓의 존재 여부를 파악한다

        }


    }



    ClearUserData(uid) {

        let game_modes = ["constant", "liberty", "draft"]

        game_modes.forEach(game_mode => {
            let sockets = this.sockets[`${game_mode}`]

            if (sockets.has(uid)) {
                let socket = sockets.get(uid)
                if(socket != undefined){
                    socket.ClearUID()
                    socket.Close()
                }
                sockets.delete(uid)
            }
        })

        Storage.Close(uid)


    }



    CloseSockets(uids) {
        uids.forEach(uid => {
            this.CloseSocket(uid)
        })
    }


    CloseSocket(uid, signal = "green"){
        let game_mode = Storage.GetGameMode(uid)
        if (game_mode == undefined || game_mode == null)
            return

        let socket = this.sockets[`${game_mode}`].get(uid)
        if (socket != undefined && socket != null) {
            this.sockets[`${game_mode}`].delete(uid)
            socket.ClearUID()
            let matching_token = socket.matching_token
            Storage.Close(uid, matching_token)

            // console.log(`${uid}s socket is closed`)
            socket.Close(signal)
            // delete this.sockets[`${uid}`]
        }

        

    }


    Create_Web_SocketServer(httpserver, path) {
        this.wss = new WebSocketServer({ backlog : 200, server: httpserver, path: path })
        global.SocketServer = this

        this.wss.on('connection', (ws, req) => {
            // ws.send("socket is connected~~")
            // console.log("socket is connected~~")

            let data = req.url.split('?')[1].split('=')
            let key = data[0]
            let token = data[1]

            // console.log(data)

            let ret = this.PostConnection(token, ws)

            if (!ret)
                ws.close()


            // if (Object.keys(this.sockets).length == 2) {
            //     this.BroadCasting_OfferGame(this.sockets)
            //     console.log("start random matching")
            //     setTimeout(() => {
            //         this.ConnectionToGameServer()
            //     }, global.config.offer_game_waiting_time); // 클라이언트가 offer game에 반응하기 위한 여유시간
            // }



        });

    }


    StartUserMatching(idle_sockets_cnt = 10000, game_mode){
        // console.log("start random matching")
        this.StartUserMatching_(idle_sockets_cnt, this.sockets[`${game_mode}`], game_mode)
    }


    StartUserMatching_(idle_sockets_cnt = 10000, sockets_, game_mode) {

        // 폐기
        this.BroadCasting_OfferGame(sockets_)
        setTimeout(() => {
            this.ConnectionToGameServer(idle_sockets_cnt, sockets_, game_mode)
        }, global.config.offer_game_waiting_time); // 클라이언트가 offer game에 반응하기 위한 여유시간
    }



    BroadCasting_OfferGame(sockets_){
        let uids = sockets_.keys()
        for (const uid of uids) {
            let socket = sockets_.get(uid)
            if (socket.state == "registered")
                socket.OfferGame()
        }
        // uids.forEach(uid=>{
        //     let socket = sockets_.get(uid)
        //     if(socket.state == "registered")
        //         socket.OfferGame()
        // })
    }


    PostConnection(matching_token, ws) {
        let uid = Storage.Get_UID_By_Token(matching_token)
        if (!Storage.VerifyToken(matching_token)) {
            // 미인증 토큰을 이용한 접속 시도 발생
            console.log(`[ user - ${uid} ] : token is un-verify`)
            ws.send("fail")
            return false;
        }


        // 인증 완료
        ws.uid = uid

        global.publisher.SetUserProperty(uid, "state", "waiting")

        let game_mode = Storage.GetGameMode(uid)
        // console.log("[[ Post  Connection ]]")
        // console.log(game_mode)

        let new_socket = new Socket(ws)
        this.sockets[`${game_mode}`].set(uid, new_socket)
        new_socket.PostConnection(matching_token, ws)

        // this.sockets[`${uid}`] = new Socket(ws)
        // this.sockets[`${uid}`].PostConnection(matching_token, ws)
        // console.log(`${uid} is registered to matching server!!!`)

        return true;
    }


    ConnectionToGameServer(idle_sockets_cnt, sockets_, game_mode){
        // let sockets_ = this.sockets[`${game_mode}`]
        this.ConnectionToGameServer_(idle_sockets_cnt, sockets_, game_mode)
    }


    ConnectionToGameServer_(idle_sockets_cnt, sockets_, game_mode) {
        let uids = sockets_.keys()
        uids = Array.from(uids)


        // 매칭서버의 응답에 미응답한 유저들을 제외한다
        for(const uid of uids){
            let socket_ = sockets_.get(uid)
            if(socket_.GetCustomState() === "offered"){
                console.log(` [ dummy ${uid} ] ignore the matchmaker's offer request  `)
                this.CloseSocket(uid)
            }

            // if (sockets_.get(uid).GetState() != 1) {
            //     this.CloseSocket(uid)
            // }
        }
        // uids.forEach((uid) => {
        //     if (sockets_.get(uid).GetState() != 1) {
        //         this.CloseSocket(uid)
        //     }
        // })


        

        let uids_ = sockets_.keys()
        uids_ = Array.from(uids_)

        if (uids.length != uids_.length)
            uids = uids_

        

        let length_ = 0
        uids_ = new Array(uids.length)

        for (let i = 0; i < uids.length; i++) {
            if (length_ > idle_sockets_cnt)
                break;
            let uid = uids[i];
            let socket_ = sockets_.get(uid)
            if (socket_.state == "approved") {
                socket_.state = "processed"
                uids_[length_] = uid
                length_++;
            }
        }

        uids_.length = length_

        uids = uids_

        if(uids.length % 2 != 0 ){
            let uid = uids.pop()
            sockets_.get(uid).state = "approved"
        }

        if(uids.length < 2)
            return;

        uids = shuffle(uids)
        let matching_tokens = new Array(uids.length).fill("")
        uids.forEach((uid, index) => {
            matching_tokens[index] = sockets_.get(uid).matching_token
        })



        
        // 1. redis에 유저 정보들을 등록한다
        // 2. 게임로직서버에 순차적으로 연결 요청을 보낸다
        // 3. 게임로직서버에게 준비가 완료되었다는 응답이 오면 유저들에게 Broadcasting을 보낸다 
        
        // let uids = sockets_.keys()
        // uids = Array.from(uids)
        // console.log("[[ uids ]]")
        // console.log(uids)

        // let matching_uids_ = []
        // let matching_tokens_ = []

        for (let matching_index = 0; matching_index < uids.length; matching_index += 2) {
            // let uids_ = [uids[matching_index], uids[matching_index + 1]]
            // let matching_tokens_ = [matching_tokens[matching_index], matching_tokens[matching_index + 1]]

            let first = uids[matching_index]
            let second = uids[matching_index + 1]

            global.publisher.SetUserProperty(first, "opponent", second)
            global.publisher.SetUserProperty(second, "opponent", first)
        }


        let key_ = "/match-maker/waiting/" + Date.now().toString() + "-" + game_mode
        let prom0 = global.publisher.Push(key_ + "-uids", uids)
        let prom1 = global.publisher.Push(key_ + "-tokens", matching_tokens)

        Promise.all([prom0, prom1])
            .then(() => {
                global.config.axios_pool({
                    method: "post", // 요청 방식
                    url: "http://game-server:8510/matching/PrepareGames_", // 요청 주소
                    data: {
                        key: key_,
                        game_mode: game_mode
                    }
                })
                .then().catch(()=>{
                    global.publisher.Del(key_ + "-uids")
                    global.publisher.Del(key_ + "-tokens")
                })  // 추후 db 비우기로 변경한다
            })




        return;


        // 아래 정보는 모두 폐기한다
        // console.log(this.sockets)
        // console.log(`connect the ${length_} users to game server`) 

        for (let matching_index = 0; matching_index < uids.length; matching_index += 2) {
            let uids_ = [uids[matching_index], uids[matching_index + 1]]
            let matching_tokens_ = [matching_tokens[matching_index], matching_tokens[matching_index + 1]]


            global.config.axios_pool({
                method: "post", // 요청 방식
                url: "http://game-server:8510/matching/PrepareGames", // 요청 주소
                data: {
                    uids: uids_,
                    matching_tokens: matching_tokens_,
                    game_mode: game_mode
                }
            })
                .then((ret) => {
                    let uids = ret.data.uids
                    let rets = ret.data.rets
                    // let uids = ret.data
                    // ret.data.forEach((ret, uids)=>{
                    //     if(ret == true)
                    //         console.log("Yes!!")
                    //     else
                    //         console.log("failed...?")
                    // })


                    for (let i = 0; i < uids.length / 2; i++) {
                        let a = uids[`${2 * i}`]
                        let b = uids[`${2 * i + 1}`]

                        let socket_A = sockets_.get(a);
                        let socket_B = sockets_.get(b)

                        // console.log(this.sockets)

                        if (rets[i] == true) {
                            // console.log(ret.data)
                            let connect_states = [socket_A.ConnectToGameServer(), socket_B.ConnectToGameServer()]

                            if (connect_states[0] == false || connect_states[1] == false) {
                                // 매칭 소켓이 닫혀서 게임서버 연결 명령 전송 불가
                                global.config.axios_pool.get(`http://${global.config.env.GAME_SERVER}/alert/userstop?uid0=${a}&uid1=${b}`)

                                this.CloseSocket(socket_A.GetUID())
                                this.CloseSocket(socket_B.GetUID())
                            }

                        }
                        else {
                            // 게임서버 등록 실패
                            // socket_A.Close("yellow")
                            // socket_B.Close("yellow")
                            this.CloseSocket(socket_A.GetUID())
                            this.CloseSocket(socket_B.GetUID())
                        }
                        // 서버 연결 명령
                    }
                })


        }

        


        // for (let i = 0; i < uids.length / 2; i++) {
        //     axios.get(`http://game-server:4430/matching/PrepareGame?uid0=${uids[i * 2]}&uid1=${uids[i * 2 + 1]}`)
        //         .then(ret => {
        //             // agents[2 * i] = new Agent(2 * i, cb)
        //             // agents[2 * i + 1] = new Agent(2 * i + 1, cb)
                    
        //             let socket_A = this.sockets[`${2 * i}`];
        //             let socket_B = this.sockets[`${2 * i + 1}`]

        //             // console.log(ret.data)

        //             if (ret.data == true) {
        //                 // console.log(ret.data)

        //                 socket_A.ConnectToGameServer()
        //                 socket_B.ConnectToGameServer()

        //             }
        //             else{
        //                 // 게임서버 등록 실패
        //                 socket_A.Close()
        //                 socket_B.Close()
        //             }

        //             // 서버 연결 명령
                    

        //         })
        // }

    }


}





// public


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }