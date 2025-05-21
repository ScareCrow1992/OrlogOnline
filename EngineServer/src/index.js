import Engine from "./engine.js"
import Redis_Adapter from 'redis-bird'
import Config from "./config.js"


global.config = Config;

let redis_url = `redis://${process.env.REDIS}`
// let redis_url = "redis://localhost:6379"

global.channel = `engine-${process.env.pm_id}`
// global.channel = "engine-0"

global.redis_adapter = new Redis_Adapter(redis_url, onMessage, global.channel, "engine")


// setTimeout(() => {
//     console.log(global)
//     // setInterval(() => {
//     //     let mem_ = process.memoryUsage()
//     //     /*{
//     //         rss: 4935680,
//     //         heapTotal: 1826816,
//     //         heapUsed: 650472,
//     //         external: 49879,
//     //         arrayBuffers: 9386
//     //     }*/
//     //     console.log("[ " + global.channel + " ]")
//     //     console.log("rss : " + mem_.rss / 1024 / 1024 + " mb")
//     //     console.log("heapTotal : " + mem_.heapTotal / 1024 / 1024 + " mb")
//     //     console.log("heapUsed : " + mem_.heapUsed / 1024 / 1024 + " mb")
//     //     console.log("external : " + mem_.external / 1024 + " kb")
//     //     console.log("arrayBuffers : " + mem_.arrayBuffers / 1024 + " kb")
//     //     console.log(" ")
//     //     console.log(" ")
//     // }, 10000)
// }, parseInt(process.env.pm_id) * 5000)




let engine = new Engine()


function onMessage (channel_name, type, func, args, sender, id) {
    // console.log(arguments)
    
    let ret = engine.Transport(func, args)

        if(type === "notify"){
    
        }
    
    
        if (type == "request") {
            // 응답 수행
            // ret를 되돌려준다

            ret.then(res => {
                let msg = {
                    func: func,
                    args: [res],
                    id: id
                }

                this._Response(sender, msg)
            })

        }

}





// import pm2 from "pm2"

// // console.log()
// pm2.describe(process.env.pm_id, (...arg) => { monit(...arg) })

// function monit(arg, desc){
//     // console.log(arguments)
//     console.log(desc[0].monit.cpu)
// }
