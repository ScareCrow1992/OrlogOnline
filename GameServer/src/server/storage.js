import { Random } from "random-js";
import bcrypt from "bcrypt";

const random = new Random(); // uses the nativeMath engine


// console.log(random.integer(-9007199254740992,9007199254740992))
// console.log(random.string(1300))
// console.log(random.string(1300))
// console.log(random.string(1300))
// console.log(random.string(1300))
// console.log(random.string(1300))




// async function cryptTest(){

//     let pw = random.string(10)
//     let saltRounds = 5;
    
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hash = await bcrypt.hash(pw, salt);
    
//     let ret1 = await bcrypt.compare(pw, hash)
//     console.log(ret1)
    
//     let trash = random.string(300)
//     let ret2 = await bcrypt.compare(trash, hash)
//     console.log(ret2)
// }

// cryptTest()



let uid = new Set()

// { key = uid, value = socket_obj}
let sockets = {}

// for matching authorization
let tokens = new Set()

// { key = token, value = uid }
let uid_by_token = {}


function _GetRandomToken(){
    return random.string(1300)
}

function SetUID(uid_){
    if(!GetUID(uid_)){
        uid.add(uid_)
        return true
    }
    else
        return false
}


function GetUID(uid_){
    return uid.has(uid_)
}



function close(token) {
    let uid_ = uid_by_token[`${token}`]

    if (uid_ != null && uid_ != undefined) {
        uid.delete(uid_)
        delete sockets[`${uid_}`]
    }
}



function AddToken(uid){
    // console.log(uid)
    while(true){
        let newToken = _GetRandomToken()
        // console.log(newToken)
        if(!VerifyToken(newToken)){
            tokens.add(newToken)
            uid_by_token[`${newToken}`] = uid

            return newToken
        }
    }
}


function VerifyToken(token){
    return tokens.has(token)
}


function Get_UID_By_Token(token){
    return uid_by_token[`${token}`]
}



function ADMIN_GetUID(){
    return uid
}

// function Get_UID_By_Token(){
//     return uid_by_token
// }

function ADMIN_GetToken(){
    return tokens
}


// export {SetUID, GetUID, AddToken, VerifyToken, close,
// ADMIN_GetUID, Get_UID_By_Token, ADMIN_GetToken
// }

