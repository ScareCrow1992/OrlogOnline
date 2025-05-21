
import { Random } from "random-js"


let random = new Random()

let states = ["idle", "waiting", "playing"]


function AgentTableDatas(agent_cnt){
    let ret = new Array(agent_cnt)
    const options_playtime = { minute: "numeric", second: "numeric", hour12 : true };
    const options_starttime = { hour: "2-digit", minute: "2-digit", hour12 : true };

    for(let i=0; i<agent_cnt; i++){
        let play_time = new Date(random.integer(200000,800000))
        let play_time_parsed = `${play_time.getMinutes()}m ${play_time.getSeconds()}s`
        // let play_time_parsed = play_time.toLocaleTimeString("en-US", options_playtime)

        let start_time = new Date(Date.now() - play_time)
        let start_time_parsed = start_time.toLocaleTimeString("en-US", options_starttime)

        // start_time_parsed = " "
        // play_time_parsed = " "

        // ret[i][j] = [`${i * row + j}`, "{red-fg}idle{/red-fg}", start_time_parsed, play_time_parsed]
        ret[i] = [`${i}`, states[random.integer(0,2)], start_time_parsed, play_time_parsed]
    }


    // for(let i=0; i<table_cnt; i++){
    //     ret[i] = new Array(row)
    //     for(let j = 0; j<row; j++){
    //         let play_time = new Date(random.integer(200000,800000))
    //         let play_time_parsed = `${play_time.getMinutes()}m ${play_time.getSeconds()}s`
    //         // let play_time_parsed = play_time.toLocaleTimeString("en-US", options_playtime)

    //         let start_time = new Date(Date.now() - play_time)
    //         let start_time_parsed = start_time.toLocaleTimeString("en-US", options_starttime)

    //         // ret[i][j] = [`${i * row + j}`, "{red-fg}idle{/red-fg}", start_time_parsed, play_time_parsed]
    //         ret[i][j] = [`${i * row + j}`, states[random.integer(0,2)], start_time_parsed, play_time_parsed]
    //     }
    // }

    return ret
}



// console.log(AgentTableDatas(4, 25))


export { AgentTableDatas }

