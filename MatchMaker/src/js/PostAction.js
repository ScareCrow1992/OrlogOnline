/*

msg = {type : "auth", param = {}}

[param]
1. type = "auth"
param = [ uid ]

*/


import * as Storage from "./storage.js"
import * as Alert from "./alert.js"


const operate = {
    "auth": (ws, ret, ...param) => { return _auth(ws, ret, ...param) }
}

export default (type, ws, ret, param) => {
    let op = operate[`${type}`]
    if (op != null && op != undefined)
        return op(ws, ret, ...param)
    else
        return null

}


// param = [ uid ]
// ret = [uid ( uid or true ) ]
// true : 정상 인증 완료
// uid : storage에 미등록된 uid
function _auth(ws, ret, token) {
    if (ret != true) {
        // 연결 끊음
        ws.send("fail")
        Storage.close(token)
        ws.close()

        // console.log(`${token} is already registered`)
        // 백엔드에게 통보 (미등록 uid의 접속 시도 [RED])
        // Alert(~~~)
        
    }
    else {
        // storage에 소켓 보관
        // console.log(`${token} is registered to match making pool !!`)
        // console.log(ws)
        // ws.send(true)
        ws.send("success")
        Storage.SetSocket(token, ws)
    }
}

