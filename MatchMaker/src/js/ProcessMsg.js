/*

msg = {type : "auth", param = {}}

[param]
1. type = "auth"
param = [ matchmaking-token ]




*/

import * as Storage from "./storage.js"

const operate = {
    "auth" : (...param) => {return _auth(...param)}
}

export default (type, param)=>{

    let op = operate[`${type}`]
    if(op != null && op != undefined)
        return op(...param)
    else
        return null

}




function _auth(token){
    if(Storage.VerifyToken(token))
        return true
    else
        return token
}

