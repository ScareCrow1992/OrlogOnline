
import axios from 'axios';

export default class Socket {
    constructor(ws) {
        this.socket = ws
        this.socket.send("success")
        this.state = null  // "registered", "offered", "approved", "processed", "gamestarted"

        // registered : 매칭서버에 정상 등록되어 있음
        // offered : 게임 참가 요청을 보냄
        // approved : 게임 참가 가능
        // processed : 매칭 작업 진행중
        // gamestarted : 게임서버와 연결 완료

        // ws.addEventListener('open', ()=>{console.log("hello world")})

        ws.addEventListener('message', (msg) => {
            // console.log(msg.data)
            switch (this.state) {
                case "registered":
                    if (msg.data === "disconnect") {
                        global.SocketServer.CloseSocket(ws.uid, "purple")
                    }

                    break;
                case "offered":
                    if (msg.data === "true")
                        this.state = "approved"
                    else {
                        global.SocketServer.CloseSocket(ws.uid, "orange")
                    }
                    break;
            }

            if (msg.data === "ping") {
                this.socket.send("pong")
            }

        })

        ws.on('close', function message(data) {
            // console.log(data)
            if (ws.uid /*&& data != 1005*/) {

                if (this.state === "approved") {
                    // console.log(`[ ${ws.uid} ] socket closed ( state = ${this.state} )`)
                }

                // match maker 내부 작업
                // console.log(`${ws.uid}'s connect is closed by client!!`)
                if (global.SocketServer)
                    global.SocketServer.CloseSocket(ws.uid)
            }
        })


        ws.addEventListener("error", (event) => {
            // console.log("WebSocket error: ", event);
        });


    }

    GetUID() {
        return this.socket.uid
    }


    ClearUID() {
        this.socket.uid = null
    }


    Close(signal) {
        switch (signal) {
            case "green":
                // 정상 종료

                break;

            case "yellow":
                // 게임서버 등록 실패
                break;


            case "orange":
                // 매칭 완료 알림을 거절함
                break;

            case "brown":
                // 매칭 완료 알림을 무시함
                break;

            case "purple":
                // 매칭 대기중 연결 해제 요청이 들어옴
                break;

            case "red":
                // 비정상 종료
                break;

        }

        this.state = null
        this.socket.close()
    }


    ConnectToGameServer() {
        // console.log("send to dummy !!")
        if (this.GetState() == 1) {
            this.socket.send("1")
            return true;
        }
        else {
            // console.log(`${this.socket.uid}'s state is ${this.socket.readyState}`)
            return false;
        }
    }

    OfferGame() {
        this.state = "offered"

        this.socket.send("offer")
    }

    PostConnection(matching_token, ws) {
        this.matching_token = matching_token
        this.state = "registered"

    }



    CheckValidate() {

        if (this.socket == null)
            return false

        if (this.GetState() == 2 || this.GetState() == 3)
            return false

        return true


        // if(this.state === "offered")
        //     return false
        // else
        //     return true

        // if(this.socket.readyState == 1 &&  this.state === "approved")
        //     return true
        // else
        //     return false

    }



    GetCustomState() {
        return this.state
    }


    GetState() {
        return this.socket.readyState
    }


    Disconnect() {

    }

}