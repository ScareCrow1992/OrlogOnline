let socket_;
let game_server_socket






function Connect_SocketServer(matching_token) {
    socket_ = new WebSocket(`${window.config["WS"]}://${window.config["match-maker"]}/ws?token=${matching_token}`)
    socket_.state = "requested"

    socket_.addEventListener("close", (msg)=>{
        // window.CancleMatchWaiting()
        socket_.state = "closed"
    })


    socket_.addEventListener("open", ()=>{
        socket_.state = "waiting"
    })

    socket_.addEventListener("message", (msg) => {
        // console.log(msg.data)
        switch (msg.data) {
            case "1":

                window.OnlineMode(`${window.config["WS"]}://${window.config["socket-server"]}/ws?token=${matching_token}`)
                window.PrepareMatch()

                // game_server_socket = new WebSocket(game_server_host + matching_token)
                // this.redbird = new Redbird()
                // this.redbird.socket = game_server_socket
                // this.redbird.controller = this;

                // game_server_socket.onmessage = (event) => {
                //     this.redbird.Transport(event.data)
                // }
                break;

            case "offer":
                // 매칭서버) 게임 참가 권유
                // match_waiting_socket.send("true")
                // window.NoticeMatchJoinOn()

                Send("true")
                // window.PrepareMatch()
                socket_.state = "offered"
                break;
        }
    })
}


function CancleToMatchWaiting(){
    if(socket_.state == "waiting"){
        console.log("matching socket is closed")
        socket_.close()
        Send("disconnect")
    }
}


function AcceptMatch() {
    // console.log("AcceptMatch")
    if (socket_.state == "offered")
        Send("true")
}

function DeclineMatch() {
    if (socket_.state == "offered")
        Send("false")

}


function Send(data){
/*
    disconnect : 매칭 대기상태 해제
    true : 매칭 승인
    false : 매칭 거절
*/
    socket_.send(data)
}


export { CancleToMatchWaiting, Connect_SocketServer, AcceptMatch, DeclineMatch }
