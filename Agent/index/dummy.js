import operation from "./operation.js"
import { WebSocket } from "ws";
import Redbird from "./Redbird.js"
// import axios from "axios";
import { Random } from "random-js";
import { Agent } from "http";


import fs from "fs"

let wstreams = fs.createWriteStream(`./dummy_log_${Date.now()}.txt`)





WebSocket.setMaxListeners(100000);
const random = new Random();

// agent는 전용망을 통해 agentID로 인증한다.
let match_ws = "ws://0.0.0.0:7500/ws?token="
// let gameserver_ws = "ws://0.0.0.0:7500/ws?token="
let gameclient_host = "http://0.0.0.0:3000"

// let match_ws = "wss://gs.orlog.io/ws?token="
// let gameserver_ws = "wss://gs.orlog.io/ws?token="
// let gameclient_host = "https://orlog.io"

// let match_ws = "ws://mm.orlog.io/ws?token="
// let gameserver_ws = "ws://gs.orlog.io/ws?token="
// let gameclient_host = "http://orlog.io"

// let match_ws = "ws://34.136.186.199:9000/ws?token="
// let gameserver_ws = "ws://34.136.186.199:8500/ws?token="
// let gameclient_host = "http://34.136.186.199:3000"

const options_playtime = { minute: "numeric", second: "numeric", hour12: true };
const options_starttime = { hour: "2-digit", minute: "2-digit", hour12: true };


export default class Dummy {
    constructor(uid, callback, axios_pool, machine_) {
        this.uid = uid

        this.isAgent = false

        this.callback = callback
        this.index = 1
        this.token = null;
        this.godfavor_extra_input;
        this.disposable_time = 0
        this.acc_time = 0
        this.sleeping_time = 0
        this.axios_pool = axios_pool
        this.godFavors = []

        this.machine = machine_
        // this.reserved_msg = null

        this.play_cnt = 0
        this.gameover = false

        this.state = "idle"
        this.game_mode = " "
        // this.start_time = new Date(Date.now() - 10000)
        this.start_time = new Date(Date.now())
        this.play_time = " "

        this.logs = []

        this.order = null


        // let backend_host = "http://0.0.0.0:7370"


    }

    get Info() {
        let play_time = new Date(Date.now() - this.start_time)
        let play_time_parsed = " "
        let start_time_parsed = " "

        if (this.state !== "idle") {
            play_time_parsed = `${play_time.getMinutes()}m ${play_time.getSeconds()}s`
            start_time_parsed = this.start_time.toLocaleTimeString("en-US", options_starttime)
        }
        else if(this.play_cnt > 0){
            play_time_parsed = `${this.play_time.getMinutes()}m ${this.play_time.getSeconds()}s`
        }


        return [this.uid, this.state, this.game_mode, start_time_parsed, play_time_parsed]
    }


    GameEnd() {
        setTimeout(() => {
            // this.state = "idle"
            this.State_Reset()

            this.token = null;
            this.disposable_time = 0
            this.acc_time = 0
            this.sleeping_time = 0
            this.godFavors = []

            
            this.gameover = false
            this.play_time = new Date(Date.now() - this.start_time)
            this.game_mode = " "
            // this.start_time = " "
            this.play_cnt++
        }, 4567)


        // if(this.reserved_msg != null){
        //     clearTimeout(this.reserved_msg)
        //     this.reserved_msg = null
        // }

        this.disposable_time = 0
        this.acc_time = 0
        this.sleeping_time = 0
        this.index = 1
        
        this.godFavors = []
    }


    State_Reset(){
        this.state = "idle"
        // this.start_time = new Date(Date.now())

    }


    MathchingServer_Requested(){
        this.state = "requested"
        this.start_time = new Date(Date.now())
    }
    

    MathchingServer_Registered() {
        this.state = "waiting"
        // this.start_time = new Date(Date.now())
    }


    Game_Started() {
        // this.reserved_msg = null
        this.state = "playing"
        // this.start_time = new Date(Date.now())
    }

    GameServer_Prepared(){
        this.state = "prepared"
        // this.start_time = new Date(Date.now())
    }

    Work(game_mode) {
        if (this.state === "idle") {
            this.game_mode = game_mode
            // this.Request_MatchingServer()
            this.Game_Start()
            return true
        }
        else
            return false

    }



    Verify(game_mode = "liberty"){

        // const config_ = {
            // headers: { Authorization: `Bearer ${responsePayload.sub}` }
        //     headers: { Authorization: `Bearer ${idToken}` }
        // };
    
        // const bodyParameters = { key: "value", game_mode : game_mode };
        // this.state = "requested"
        const config_ = {
            headers: { Authorization: `Bearer ${this.uid}` }
        };
        
        const bodyParameters = { key: "value", game_mode : game_mode };
    
        // console.log(`${gameclient_host}/dummy/gamestart`)

        // console.log("Hello~~~~")
        // console.log(`game client : ${window.config["game-client"]}`)
        return this.axios_pool.post(
            `${gameclient_host}/dummy/gamestart` ,
            bodyParameters,
            config_
        )
    }


    Game_Start() {
        this.MathchingServer_Requested()


        this.Verify(this.game_mode)
            .then((resolve) => {
                if (resolve.data != null) {
                    this.token = resolve.data
                    this.Connect_Server()
                }
                else {
                    wstreams.write(`[[ Gamestart Denied - ${this.uid} ]]\n`)
                    wstreams.write("< /dummy/gamestart >\n")
                    wstreams.write("< received not true >\n")
                    wstreams.write(`${resolve.data}`)
                    wstreams.write("\n\n")
                    this.State_Reset()

                }
            })
            .catch((err) => {
                wstreams.write(`[[ Gamestart Catch - ${this.uid} ]]\n`)
                wstreams.write("< /dummy/gamestart >\n")

                let err_txt = JSON.stringify(err)
                wstreams.write(`${err_txt}\n`)
                wstreams.write("\n\n")

                this.State_Reset()
            })

    }


    // Request_MatchingServer() {
    //     // console.log(url)

    //     this.MathchingServer_Requested()

    //     let game_mode = this.game_mode
    //     let index_ = this.uid
    //     // axios_pool.get(`http://0.0.0.0:9000/register_match_pool?uid=${index_}&game_mode=${game_mode}`)
    //     this.Verify(game_mode)
    //         .then((ret) => {
    //             if (ret.data != false) {
    //                 this.token = ret.data
    //                 // dummies[`${index_}`] = new Dummy(index_, cb, token)
    //                 this.Connect_Server()

    //             }
    //             else{
    //                 wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)
    //                 wstreams.write("< /dummy/gamestart >\n")
    //                 wstreams.write("< received not true >\n")
    //                 wstreams.write(`${ret.data}`)
    //                 wstreams.write("\n\n")
    //                 this.State_Reset()

    //             }
    //         }).catch((err)=>{
    //             wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)
    //             wstreams.write("< /dummy/gamestart >\n")
    //             wstreams.write(JSON.stringify(err))
    //             wstreams.write("\n\n")

    //             this.State_Reset()
    //         })

    // }


    Connect_Server() {
        // 매칭서버 연결
        this.matching_socket = new WebSocket(match_ws + this.token)

        // setTimeout(() => {
        //     if (this.state == "requested") {
        //         wstreams.write(`\n\n[[ Dummy - ${this.uid} ]]\n`)
        //         wstreams.write("< socket is hanged >\n")
        //         wstreams.write(`${this.matching_socket.readyState}`)
        //         wstreams.write("\n\n")


        //         if (this.matching_socket.readyState == 1) {
        //             this.matching_socket.send("ping")
        //         }

        //         if (this.matching_socket.readyState == 3){
        //             this.State_Reset()
        //         }

        //     }
        // }, 30000)

        this.matching_socket.onopen = (event) => {

            let rullet = random.integer(0, 100)
            
            this.MathchingServer_Registered()
            // if (rullet < 20) {
            //     this.State_Reset()
            // }
            // else {
            //     this.MathchingServer_Registered()
            // }


            if (this.uid < -999)
                setTimeout(() => { wstreams.write("wrong index");this.matching_socket.close() }, 1500)
        }


        this.matching_socket.onclose = (event) => {
            // this.GameServer_Prepared()
            // 로그 기록
            // wstreams.write(`[socket closed - ${this.uid}] ${this.state}\n\n`)
            if (this.state === "requested") {
                // wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)
                // wstreams.write("< matching socket connection failed >\n")
                // wstreams.write("\n\n")

                this.State_Reset()
            }
            else if(this.state === "waiting"){
                // wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)
                // wstreams.write("< matching socket disconnected >\n")
                // wstreams.write("\n\n")

                this.State_Reset()
            }
            else if (this.state === "playing") {
                if (this.gameover === false){
                    wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)
                    wstreams.write("< socket closed on playing >\n")
                    wstreams.write(`${event.code}\n`)
                    wstreams.write(`${event.reason}\n`)
                    wstreams.write(`${event.wasClean}\n`)
                    wstreams.write("\n\n")

                }

                this.GameEnd()

            }

            // this.State_Reset()
            // this.GameEnd()

        }


        this.matching_socket.onerror = (err) => { 
            wstreams.write(`[[ Socket Error - ${this.uid} ]]\n`)
            wstreams.write(`${err.message}\n\n`) 
        }

        this.matching_socket.onmessage = (msg) => {
            // this.redbird.Transport(event.data)

            let data = msg.data
            // console.log(data)


            // if (JSON.parse(data) === "MatchSuccess" /*&& this.state === "idle"*/) {
            //     wstreams.write(`[[ MatchSuccess - ${this.uid} ]] ${this.state}\n\n`)
            // }


            if (this.state == "playing")
                this.redbird.Transport(data)
            else if (this.state == "waiting") {
                let data_ = JSON.parse(data)
                if (data_ == "MatchSuccess") {
                    this.redbird = new Redbird()
                    this.redbird.socket = this.matching_socket
                    this.redbird.controller = this;

                    // this.state = "playing"
                    this.Game_Started()

                    // window.OnlineMode(this)
                    this.matching_socket.send("prepared")
                }
                else {
                    // console.log(`[ matching fail ] ${data_}`)
                    // console.log(typeof data_)
                }

            }


            return;
            // switch (msg.data) {
            //     case "pong":
            //         wstreams.write(`\n\n[[ Dummy - ${this.uid} ]]\n`)
            //         wstreams.write("< socket's hang is released >\n")
            //         wstreams.write(`${this.matching_socket.readyState}`)
            //         wstreams.write("\n\n")

            //         this.MathchingServer_Registered()

            //         break;

            //     case "1":
            //         this.GameServer_Prepared()
            //         this.gameserver_socket = new WebSocket(gameserver_ws + this.token)
            //         this.redbird = new Redbird()
            //         this.redbird.socket = this.gameserver_socket
            //         this.redbird.controller = this;


            //         setTimeout(() => {
            //             if (this.state == "prepared") {
            //                 wstreams.write(`\n\n[[ Dummy - ${this.uid} ]]\n`)
            //                 wstreams.write("< game socket is hanged >\n")
            //                 wstreams.write(`${this.matching_socket.readyState}`)
            //                 wstreams.write("\n\n")


            //                 // if (this.gameserver_socket.readyState == 1) {
            //                 //     this.matching_socket.send("ping")
            //                 // }

            //                 if (this.gameserver_socket.readyState == 3) {
            //                     this.State_Reset()
            //                 }

            //             }
            //         }, 30000)



            //         this.gameserver_socket.onopen = () => {
            //             this.Game_Started()
            //             // this.state = "playing"
            //             // this.start_tme = Date.now()
            //             // if (this.uid % 100 == 0)
            //             //     console.log(`${this.uid} is connected to gameserver`)
            //         }

            //         this.gameserver_socket.onmessage = (event) => {
            //             this.redbird.Transport(event.data)
            //         }

            //         this.gameserver_socket.onclose = (event) => {
            //             if(event.code != 1005){
            //                 wstreams.write(`\n[[ game socket close - ${this.uid} ]]\n`)
            //                 wstreams.write("< code > : ")
            //                 wstreams.write(`${event.code}`)
            //                 wstreams.write(`\n< dummy state > : ${this.state}`)
            //                 wstreams.write("\n\n")
                            
            //             }


            //             this.GameEnd()
            //         }

            //         this.gameserver_socket.onerror = (err)=>{ wstreams.write(JSON.stringify(err)) }

            //         break;

            //     case "offer": {
            //         // console.log("approve to matching")
            //         this.matching_socket.send("true")
            //         break;
            //     }
            // }
        }
    }


    MessageEnqueue(func, params) {
        let msg = operation.call(this, func, params, this.index)

        let own_animation_time_funcs = global.server_config.animation_time
        if (Object.prototype.hasOwnProperty.call(own_animation_time_funcs, func)) {
            let animation_time = 0
            if (func == "DiceBattle")
                animation_time += Math.max(1000, global.server_config.animation_time["DiceBattle"](params[0]) - 7500)
            else
                animation_time += global.server_config.animation_time[`${func}`]

            // console.log(`[ ${func} ] :: acc time ( ${this.acc_time} ) + animation time ( ${animation_time} )` )
            this.acc_time += animation_time
        }



        let own_limited_time_funcs = global.server_config.limited_time
        if (Object.prototype.hasOwnProperty.call(own_limited_time_funcs, func)) {
            // console.log(`acctime : ${this.acc_time}`)
            this.sleeping_time = this.acc_time
            this.acc_time = 0

        }


        if (func == "DiceBattle") {
            let battle_time = global.server_config.animation_time["DiceBattle"](params[0])
            // console.log(`battle animation time = ${battle_time}`)

            // this.disposable_time = Math.max(1500, battle_time - 10000)

        }



        if (func == "RollDices" || func == "RollDices" || func == "SelectGodFavorPower") {
            // console.log(msg)
            if (msg != null) {
                msg.then((res) => {
                    this.SendMessage(func, res[0], res[1])
                })
            }
        }
        // else if (func == "GodFavorAction") {
        //     this.godfavor_extra_input = msg;
        // }
        // else if (func == "ExtraInputBegin") {
        //     // console.log(msg)
        //     if (msg) {

        //         // console.log(this.gosfavor_extra_input)
        //         this.SendMessage(func, this.godfavor_extra_input[0], this.godfavor_extra_input[1])
        //     }
        // }
        else {
            if (func == "NeedSwap") {
                this.index = 0
            }
            else if (func == "GameOver") {
                // this.gameserver_socket.close()
                
                
                this.gameover = true
                this.callback(this.uid, msg === this.index, this.logs)
                // this.GameEnd()
            }

            else if (msg != null) {
                // console.log(`[[ ${func} ]]  ${this.acc_time}`)
                // this.redbird.MessageEnqueue(msg[0], msg[1])
                this.SendMessage(func, msg[0], msg[1])
            }
        }
    }


    SendMessage(func, operation, params) {
        // let animation_time = global.server_config.animation_time[`${func}`]
        // let bias_time = random.integer(2000, 4000)
        // let total_time = animation_time + bias_time + this.disposable_time

        let sleeping_time = this.sleeping_time
        if (func == "CheckReady") {
            sleeping_time = Math.max(500, sleeping_time - 2000)
        }
        else {
            sleeping_time += random.integer(3000, 5000)
        }

        let redbird = this.redbird
        // this.acc_time = 0
        // redbird.MessageEnqueue(operation, params)


        setTimeout(() => {
            // console.log(`<< ${this.uid} >>, [[ ${func} ]],  - timer : ${sleeping_time} -`)
            // console.log(`animation time : ${global.server_config.animation_time[`${func}`]}`)
            // console.log(``)
            this.acc_time = 0
            // this.disposable_time = 0
            redbird.MessageEnqueue(operation, params)
        }, sleeping_time)
    }

}



function Test() {

    let cb = (uid, result) => {
        // console.log(`${uid} agent - Game Over (${result ? "WIN" : "DEFEAT"})`);
        delete dummies[`${uid}`]

        --left_cnt
        if (left_cnt % 100 == 0) {
            // console.log(`left cnt : ${left_cnt}`)
        }

        // console.log(dummies)

    }

    let axios_pool = axios.create({
        httpAgent: new Agent({
            maxSockets: 50,
            // maxTotalSockets : 2,
            // maxFreeSockets:1
            keepAlive: true,
            timeout: 60000
        })
    });

    // console.log(axios_pool)

    let dummies = {}
    let left_cnt = 5000
    let uids = new Array(left_cnt)
    let i = 0;

    for (let ddd = 0; ddd < 10; ddd++) {
        setTimeout(() => {
            for (let index = 0; index < 500; index++) {
                uids[i] = i

                // axios.get(`http://localhost:9000/register_match_pool?uid=${i}`)
                //     .then((ret) => {
                //         if (ret.data != false) {
                //             let token = ret.data
                //             dummies[`${i}`] = new Dummy(i, cb, token)
                //         }
                //     }).catch(console.log)

                let backend_host = "http://0.0.0.0:7370"
                let path = "/user/login"
                let query = `?id=${i}&email=bot${i}@orlog.com`

                let url = backend_host + path + query
                // console.log(url)


                axios_pool.get(url)
                    .then((ret) => {
                        // console.log(ret.data)
                    })
                    .catch(() => { })

                let game_mode = "draft"

                let index_ = i
                axios_pool.get(`http://0.0.0.0:9000/register_match_pool?uid=${index_}&game_mode=${game_mode}`)
                    .then((ret) => {
                        if (ret.data != false) {
                            let token = ret.data
                            dummies[`${index_}`] = new Dummy(index_, cb, token)
                        }
                    }).catch(() => {})

                i++

            }


        }, ddd * 30000)


    }





    // setTimeout(() => { console.log(dummies) }, 7000)

    // console.log(dummies)
    // console.log(uids)



}



