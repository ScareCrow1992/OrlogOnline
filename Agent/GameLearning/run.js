import Redis_Adapter from "redis-bird"
import Machine from "./Machine.js";
// import { Create_Initial_State } from "./Util/utils.js"
import BatchGenerator from "./BatchGenerator.js";

let cluster_index

if(process.env.pm_id != undefined)
    cluster_index = process.env.pm_id
else
    cluster_index = 0

global.Redis_Adapter = new Redis_Adapter("redis://localhost:6379", (channel_name, msg)=>{
    console.log(`[ ${channel_name} ] ${msg}`)
}, `agent-${cluster_index}`, "agent")




const batch_generator = new BatchGenerator()



function Main(){
    let machine = new Machine(null, batch_generator)

    for (let i = 0; i < 1; i++)
        machine.Training(i)
    // machine.Playout(state_, dirs_, life, agent_index)
    // machine.Playout(state_, dirs_, life, agent_index)
    // machine.Playout(state_, dirs_, life, agent_index)
    // machine.Playout(state_, dirs_, life, agent_index)

}



global.Redis_Adapter.ready.then(()=>{
    // for (let i = 0; i < 100; i++)
    Main()
})


// console.log(process.env.pm_id)
