// import EventEmitter from "./Utils/EventEmitter.js";


export default class Socket{
    constructor(matching_token, onclose_callback, req){
        // super()
        // this.onMessage = onMessage

        this.req = req// "gamestart" or "createlobby"


        this.Connect_SocketServer(matching_token, onclose_callback)

        // console.log(online)
        // console.log(this.ws)

        this.state = "waiting"

        // this.ws.on('message', data=>{
        //     console.log(data)
        //     // switch(data.type){
        //     //     case "GodFavorPhaseOn":
        //     //         break;

        //     //         case 
        //     // }
        // })



        // trigger from server
        // this.trigger("GodFavorPhaseOn")

        // this.trigger("initial-game", [text, duration, first])

        // this.trigger("old-phase-end", [phase])

        // this.trigger("new-phase-start", [phase])

    }



    Disconnect_OnWaiting(){
        // state가 prepared 혹은 playing 일 경우 취소 불가능
        // 1. 서버측에 소켓 연결 취소를 통보
        // 2. 소켓 연결 해제 가능 여부를 점검
        // 3. 서버에서 알맞은 조치를 수행 및 메시지 전달
        if(this.state !== "playing"){
            // console.log("close socket")
            // disconencted
            this.ws.close()
            
        }
        else{
            // fail
            // console.log("fail to close socket")

            // 임시코드
        }

    }


    Connect_SocketServer(matching_token, onclose_callback){
        let socketserver_url = `${window.config["WS"]}://${window.config["socket-server"]}/ws?token=${matching_token}`

        this.ws = new WebSocket(socketserver_url)
        // this.partnerbird = bird

        this.SetState("requested")


        this.ws.onmessage = (event) => {
            let data = event.data
            if (this.state == "playing")
                this.partnerbird.Transport(data)
            else {
                let data_ = JSON.parse(data)
                if (data_ == "MatchSuccess") {
                    this.state = "playing"
                    window.OnlineMode(this)
                    this.send("prepared")
                }
                else{
                    if(this.req == "gamestart"){
                        console.log(`[ matching fail ] ${data_}`)

                    }
                    else{
                        switch (data_.msg) {
                            case "CreateLobby_On":
                                window.CreateLobby_On(data_.param, () => { this.Disconnect_OnWaiting() })
                                break;

                            case "JoinLobby_On":
                                window.JoinLobby_On(data_.param, () => { this.Disconnect_OnWaiting() })
                                break;

                            case "JoinGuest":
                                window.JoinGuest(data_.param, (gamemode) => { this.Start_FriendlyGame(gamemode) })
                                break;

                        }

                    }

                }
                // game start 신호가 들어올 경우
                // window.OnlineMode() 함수를 호출한다.
            }
            
        }

        
        this.ws.onerror = (event) =>{
            console.log(event)
        }


        this.ws.onclose = (event) => {
            window.Play_Buttons_Active()
            // console.log("closed~~~")
            onclose_callback(event)
        }

    }


    Start_FriendlyGame(gamemode){
        // console.log("start : ", gamemode)
        this.send(JSON.stringify({func : "Start_FriendlyGame", gamemode}))
    }


    // Exit_Lobby(){
    //     this.send(JSON.stringify({func : "Exit_Lobby"}))
    // }



    PrepareGame(bird){
        this.partnerbird = bird
    }



    SetState(state){
        this.state = state
    }


    send(data) {
        if (this.ws.readyState == 1){
            // console.log("send data correctly~")
            this.ws.send(data)
        }

    }



    // CallFunction(data){
    //     let sync = data.sync
    //     let name = data.function
    //     let params = data.params



    //     if(sync == true){

    //     }

    // }









    // trigger to server
    BellPushed(player){
        this.ws.send(player)
    }

    // objectSelected(obj){
    //     this.ws.send(obj)
    
    // }

}
