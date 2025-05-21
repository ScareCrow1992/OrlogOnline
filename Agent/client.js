
import WebSocket from 'ws';
//34.123.29.3



let ws = new WebSocket("wss://gs.orlog.io/hello")
// emitter.setMaxListeners(25)
for(let i=0; i<10; i++){
    ws.on("open", (data) => {
        // let index = i % 4
        console.log("connected~")
        // let index = 31
        ws.send(`[socket - ${i}] hello`)
    })
}

