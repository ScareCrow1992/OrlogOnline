import { createClient } from 'redis';
import fs from "fs"

let redis_client = createClient({"url" : "redis://localhost:6379"});
let script_ = fs.readFileSync(`./test.lua`)
let script_json = fs.readFileSync("./adduser.lua")


// let script_arr = fs.readFileSync("./get_array.lua")
let script_arr = fs.readFileSync("./get_waiting_scores.lua")


async function Main(){
    

    await redis_client.set("a", 0)

    await redis_client.watch("a")

    await redis_client.set("a", 1)
    await redis_client.set("a", 2)

    await redis_client.multi().set("a", 10).exec().then(()=>{ redis_client.set("b", 999) }).catch(()=>{console.log("failed exec")})


    console.log("Main End")
}


async function Main_A(){
    await redis_client.watch("a")


    await new Promise(res => { setTimeout(() => { res(true) }, 2000) })

    await redis_client.set("a", 0)

    // await redis_client.multi()
    //     .set("a", 400)
    //     .exec()
    //     .catch(()=>{console.log("failed exec")})

    // await redis_client.unwatch()

    console.log("A is end")

}


async function Main_B(){
    await redis_client.watch("a")

    await new Promise(res => { setTimeout(() => { res(true) }, 4000) })

    

    await redis_client.multi()
        .set("a", 800)
        .exec()
        .catch(()=>{console.log("failed exec")})


    console.log("B is end")

}


async function Main_C(){
    await redis_client.set("c", 0)

    await redis_client.watch("c")

    console.log("start C")

    let multi_ = redis_client.multi()

    for(let i=0; i<1; i++){
        multi_ = await multi_.get("c")//.then(console.log)
        console.log(multi_)

        // multi_ = await multi_.set("c", i)

    }
        
    await multi_.exec()


    console.log("end C")

}


async function Main_D(){
    redis_client.set("c", -100)


}


async function Main_E(){
    let sha_ = await redis_client.scriptLoad(script_)
    // let sha_ = "99b552a5b09ca6fe84cdf3814ec3fb96422d7545"

    console.log(sha_)

    // let a = await redis_client.evalSha(
    //     sha_,
    //     // `
    //     // redis.call('set', 'a', ARGV[1])
    //     // return 55
    //     // `,
        
    //     {
    //         keys: ["path", "from",  
    //         "name", "uid", "token", "gamemode", "state", "opponent", "socket_server", "engine_server", "rankgame", "master", "lobby"],
    //         arguments: ["/user/104260162705550826766/", "waiting",
    //         "X","X","X","X","X","X","X","X","true","helloworld","X"]
    //     }
    // )

    // // name, uid, token, gamemode, state, opponent, socket_server, engine_server, rankgame, master, lobby

    // console.log(a)


    // redis_client.eval()

    // console.log(a)

}


async function Main_F(){
    let sha_ = await redis_client.scriptLoad(script_json)

    // console.log(sha_)

    await redis_client.evalSha(
        sha_
    )


}



async function Main_G(){
    let sha_ = await redis_client.scriptLoad(script_arr)


    let ret = await redis_client.evalSha(
            sha_, {
            arguments: ["104260162705550826766"]
        }
    )

    console.log(ret)

}





redis_client.connect().then(()=>{
    // Main_A()
    // Main_B()

    // Main_C()
    // Main_D()

    // Main_E()

    // Main_F()


    Main_G()

})


