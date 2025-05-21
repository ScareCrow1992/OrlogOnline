
import axios from 'axios';


// const a= "hello world!"

function MainLoop(){

    axios.get("http://" + global.config.env.GAME_SERVER + "/matching/idle_sockets_cnt")
        .then((msg) => {
            console.log(`idle socket cnt = ${msg.data.cnt}`) 
            StartMatch(msg.data.cnt) 
            /*console.log(msg.data.cnt)*/ })

    // 1. 게임서버에게 소켓 여유 갯수를 전달받는다.
    // 2. 여유갯수를 참고하여 매칭을 시도한다

}


function StartMatch(idle_sockets_cnt){
    global.SocketServer.StartUserMatching(idle_sockets_cnt, "constant")
    global.SocketServer.StartUserMatching(idle_sockets_cnt, "liberty")
    global.SocketServer.StartUserMatching(idle_sockets_cnt, "draft")
    

}


export default function (interval_time) {
    setInterval(MainLoop, interval_time);
}