import axios from "axios";


// [RED] : 로직상 절대 발생해서는 안됨, 사전차단에 실패하여 마지막 차단로직이 실행됨
// [YELLOW] : 로직상 발생 가능, 사전차단이 수행됐음을 알림

function send(data){
    axios.post(`http://${global.config.env.GAME_CLIENT}/alert`)
}

// 미등록 UID의 소켓 연결 시도
function Attempt_To_Connection_By_Non_Registered_UID(){
    // send(~~~)
}


export {Attempt_To_Connection_By_Non_Registered_UID}
