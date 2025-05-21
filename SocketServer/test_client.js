import WebSocket from "ws"

let ws = new WebSocket("ws://localhost:8500/ws?token=success")

ws.onopen = (ret)=>{
    console.log("connected!")
    ws.send("msg from client~")
}
ws.onmessage = (msg)=>{console.log(msg.data)}

ws.onerror = (console.log)

