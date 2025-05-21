import WS from "#ws"

export default class WSS {
    constructor(websocketserver) {
        this.instance = websocketserver
        this.sockets = new Map()

        this.Initialize()


        // setInterval(() => {
        //     console.log("socket cnt : ", this.sockets.size)
        //     console.log("redis request cnt : ", global.redis_adapter.sub.onRequest.size)
        //     console.log("clients : ", this.instance.clients.size)

        //     let arr = new Array(4).fill(0)
        //     let clients = this.instance.clients
        //     clients.forEach(ws_ => {
        //         arr[ws_.readyState]++
        //     })

        //     console.log("CONNECTING : ", arr[0])
        //     console.log("OPEN : ", arr[1])
        //     console.log("CLOSING : ", arr[2])
        //     console.log("CLOSED : ", arr[3])

        //     console.log("=================================================")
        // }, 20000)

    }


    Transport(func, args){
        // console.log(arguments)
        return this[`_${func}`](...args)
    }


    // _Check_Socket_Alive(uid){
    //     return new Promise(res => {
    //         let is_alive = this.sockets.has(uid)
    //         let ws_ = this.sockets.get(uid)
    //         // let state_ = 

    //         res(this.sockets.has(uid))
    //     })
    // }


    _GameOver(uid){
        // console.log("[Game Over]", uid)
        let ws_ = this.sockets.get(uid)
        if(ws_ != null){

            ws_.state = "gameover"
            if(ws_.instance.rankgame == true){
                this.On_Close_By_Server(uid)
            }
            else {
                setTimeout(() => {
                    ws_.state = "waiting"
                }, 1500)
            }

        }
    }


    _Send(uid, data){
        // console.log(`[ ${global.channel} ] ${uid} ${data}`)
        let ws_ = this.sockets.get(uid)
        if(ws_ != null){
            ws_.Send(data)

        }
    }


    _Request(uid, data) {
        // console.log(`[ ${global.channel} ] ${uid} ${data}`)
        let ws_ = this.sockets.get(uid)
        if (ws_ != null) {
            return ws_.Request(data)
        }
        else
            return new Promise(res => res(null))
    }


    _Matching_Success(uid){
        // console.log("[[ Matching Success ]]")
        let ws_ = this.sockets.get(uid)
        if(ws_ != null)
            ws_.state = "prepared"

        return this._Request(uid, "MatchSuccess")
    }


    _Matching_Fail(uid){
        let ws_ = this.sockets.get(uid)
        if(ws_ != null)
            ws_.state = "fail"

        this._Send(uid, "MatchFail")
    }

    _Close(uid){
        // console.log("close socket : ", uid)
        this.On_Close_By_Server(uid)
    }

    Initialize() {

        this.instance.on('connection', (ws, req, user_info) => {
            let uid = user_info.uid

            ws.rankgame = user_info.rankgame

            ws.addEventListener("close", (event)=>{this.On_Close_By_Client(ws, event)})
            ws.addEventListener("error", (event) => { console.log(event); this.On_Close_By_Client(ws, event) })

            if(ws.readyState == 2 || ws.readyState == 3){
                // onclose 이벤트 등록 전에 연결이 끊김
                console.log(`[ ${global.channel} ] socket closed before event registering`)
                ws.destroy()
            }
            
            this.On_Connection(ws, req, uid)
            
            global.redis_adapter.Socket_Open(uid, global.channel)

        })
        // console.log("created new socket~")


    }



    On_Close_By_Server(uid){
        // console.log(`[ ${uid} - closed normaly ]`)
        this.SocketClose(uid)
    }


    On_Close_By_Client(ws, event) {
        if(ws.uid != null){
            // console.log(`[ ${ws.uid} - closed abnormal ]`)
            // console.log(event)
            this.SocketClose(ws.uid)
        }
        else{
            this.ResetSocketInstance(ws)
        }



        // if (socket_state === "playing")
        //     global.redis_adapter.Socket_Disconnected_On_Playing(ws.uid)
        // else
        //     global.redis_adapter.Socket_Closed(ws.uid, socket_state)

    }




    ResetSocketInstance(ws_){
        // ws_.removeAllListeners()
        ws_.uid = null
    }



    SocketClose(uid){
        if(uid == null)
            return;

        let ws_object = this.sockets.get(uid)
        // this.sockets.set(uid, null)
        this.sockets.delete(uid)

        if(ws_object == null)
            return
        else{
            ws_object.On_Close()
        }
        // let socket_state = null
        // if (ws_object != null) {
        //     socket_state =ws_object.On_Close()
        // }

        // if(socket_state != null)
    }




    On_Connection(ws, req, uid) {
        ws.uid = uid
        // console.log(`[[ uid ]] ${ws.uid}`)
        // global.redis_adapter.Socket_Open(ws.uid, global.channel)
        this.New_Socket(ws)
    }




    New_Socket(ws){
        this.sockets.set(ws.uid, new WS(ws))

    }


}