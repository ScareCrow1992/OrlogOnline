
import config from './config/config.js';

global.config = config


import Redis_Adapter from 'redis-bird'

import main from "./process/Main.js"
import UserLogin from "#db_process/UserLogin.js"
import AddResult from "#db_process/AddResult.js"
import FindUser_Summary from '#db_process/FindUser_Summary.js';


let redis_url = `redis://${process.env.REDIS}`

global.channel = `backend-${process.env.pm_id}`
// global.channel = "backend-0"

global.redis_adapter = new Redis_Adapter(redis_url, onMessage, global.channel, "backend")



async function onMessage (channel_name, type, func, args, sender, id) {
    // console.log(arguments)
    console.log(func)
    let ret = null
    switch(func){
        case "User_Login":
            ret = await UserLogin(...args)
            // console.log(user_info)
            break;

        case "Add_Result":
            ret = await AddResult(...args)
            break;


        case "FindUser_Summary":
            ret = await FindUser_Summary(...args)
            break;


        default:


            break;
    }

    // console.log(ret)
    // console.log(type)
    if(type == "request"){
        let msg = {
            func: func,
            args: [ret],
            id: id
        }
    
        this._Response(sender, msg)
        
    }


    // let ret = engine.Transport(func, args)

    //     if(type === "notify"){
    
    //     }
    
    
    //     if (type == "request") {
    //         // 응답 수행
    //         // ret를 되돌려준다

    //         ret.then(res => {
    //             let msg = {
    //                 func: func,
    //                 args: [res],
    //                 id: id
    //             }

    //             this._Response(sender, msg)
    //         })

    //     }



}




main()