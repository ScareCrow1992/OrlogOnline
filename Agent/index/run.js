import Launcher from "./Launcher.js";
import Redis_Adapter from "redis-bird"


global.cluster_index = undefined
if (process.env.pm_id != undefined)
    global.cluster_index = process.env.pm_id
else
    global.cluster_index = 0
let launcher = null

// launcher = new Launcher()
// launcher.Test()

setTimeout(() => {
    global.Redis_Adapter = new Redis_Adapter("redis://host.docker.internal:6379", onMessage, `ai-${global.cluster_index}`, "ai")

    // global.Redis_Adapter = new Redis_Adapter("redis://localhost:6379", onMessage, `ai-${global.cluster_index}`, "ai")



    global.Redis_Adapter.ready.then(() => {
        launcher = new Launcher()
        // launcher.Test()
    })


    function onMessage(channel_name, type, func, args, sender, id) {
        console.log(arguments)


        let ret = launcher.Transport(func, args)


        if (type == "request") {
            let msg = {
                func: func,
                args: [ret],
                id: id
            }

            this._Response(sender, msg)

        }

    }

}, global.cluster_index * 100)








// async function Main() {
//     let game_cnt = 30
//     let ver_ = "000"
//     let agents =  await launcher.CreateGame("liberty", null, game_cnt)

//     launcher.SaveLogs(agents, ver_)

//     // setTimeout(() => { launcher.Training(1) }, 2000)
// }
