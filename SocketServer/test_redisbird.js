import Adapter from "redis-bird"

// let url = "redis://host.docker.internal:6379"

let url = "redis://localhost:6379"

let adp = new Adapter(url, (channel_name, msg)=>{
    console.log(`[ ${channel_name} ] ${msg}`)
})



let sub0 = adp.Subscribe("socket-0")
let sub1 = adp.Subscribe("socket-1")
let sub2 = adp.Subscribe("socket-2")
let sub3 = adp.Subscribe("socket-3")

setTimeout(() => {
    adp.Publish("socket-0", "hello")
    adp.Publish("socket-1", "world")
    adp.Publish("socket-2", "nice")
    adp.Publish("socket-3", "to meet you!")
}, 5000)
