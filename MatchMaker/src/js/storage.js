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



let uid_set = new Set()


// for matching authorization
let tokens = new Set()

// { key = token, value = uid }
let uid_by_token = {}
let token_by_uid = new Map()


// 해당 uid 유저가 등록한 게임모드
let uid_2_mode = new Map()

// 해당 게임모드로 등록한 유저들의 uid
// let mode_2_uid = {
//     "constant" : new Set(),
//     "liberty" : new Set(),
//     "draft" : new Set()
// }


function GetGameMode(uid_){
    return uid_2_mode.get(uid_)
}


function _GetRandomToken(){
    return random.string(1300)
}

function SetUID(uid_, game_mode){
    // console.log(game_mode)
    if(!GetUID(uid_)){
        uid_set.add(uid_)
        uid_2_mode.set(uid_, game_mode)
        // mode_2_uid[`${game_mode}`].add(uid_)

        let token_ = AddToken(uid_)

        let data_ = {
            uid : uid_,
            token : token_,
            gamemode : game_mode,
            state : "requested",
            opponent : null,
            socket_server : null,
            logic_server : null
        }

        global.publisher.AddUser(uid_, data_)

        return token_
    }
    else
        return null
}


function GetUID(uid_) {
    return uid_set.has(uid_)
}


function SetSocket(token, socket_){
    let uid_ = uid_by_token[`${token}`]
    if (uid_ == null || uid_ == undefined)
        return null


}


function Close(uid_, matching_token = null) {
    let uid_game_mode = uid_2_mode.get(uid_)
    if(uid_game_mode){
        uid_2_mode.delete(uid_)
        // mode_2_uid[`${uid_game_mode}`].delete(uid_)
    }

    uid_set.delete(uid_)

    if(matching_token == null)
        matching_token = token_by_uid.get(uid_)

    if(matching_token){
        tokens.delete(matching_token)
        delete uid_by_token[`${matching_token}`]
    }
    token_by_uid.delete(uid_)
    
}


function Validate(uid){
    
}


function AddToken(uid){
    // console.log(uid)
    while(true){
        let newToken = _GetRandomToken()
        // console.log(newToken)
        if(!VerifyToken(newToken)){
            tokens.add(newToken)
            uid_by_token[`${newToken}`] = uid
            token_by_uid.set(uid, newToken)

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
    return uid_set
}

// function Get_UID_By_Token(){
//     return uid_by_token
// }

function ADMIN_GetToken(){
    return tokens
}


function ADMIN_GetTotalData(){
    return [uid_set, tokens, uid_by_token]
}


export {SetUID, GetUID, SetSocket, AddToken, VerifyToken, Close, GetGameMode,
ADMIN_GetUID, Get_UID_By_Token, ADMIN_GetToken, ADMIN_GetTotalData
}

