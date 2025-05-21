import operation from "./operation.js"
import Redbird from "./Redbird.js"


// WebSocket.setMaxListeners(1000);

// agent는 전용망을 통해 agentID로 인증한다.

export default class Agent {
    constructor(uid, callback, socket_) {
        this.uid = uid
        this.callback = callback
        this.index = 1
        this.gosfavor_extra_input;

        this.socket = socket_

        this.redbird = new Redbird()
        this.redbird.socket = this.socket
        this.redbird.controller = this;

        this.socket.partnerbird = this.redbird

        this.gameover = false


        
    }


    MessageEnqueue(func, params) {
        if(this.gameover == true)
            return;

        // console.log(func)
        // console.log(`${func} : ${params}`)
        // console.log(`func : ${func}`)

        let msg = operation(func, params, this.index)
        
        if (func == "RollDices" || func == "RollDices" || func == "SelectGodFavorPower") {
            // console.log(msg)
            if (msg != null) {
                msg.then((res) => {
                    this.redbird.MessageEnqueue(res[0], res[1])
                })
            }
        }
        else if(func == "GodFavorAction"){
            this.gosfavor_extra_input = msg;
        }
        else if(func == "ExtraInputBegin"){
            if(msg){
                this.redbird.MessageEnqueue(this.gosfavor_extra_input[0], this.gosfavor_extra_input[1])
            }
        }
        else {
            if (func == "NeedSwap") {
                this.index = 0
            }
            else if (func == "GameOver") {
                // console.log("[[ agent gameover ]] ")
                this.gameover = true;
                this.socket = null;
            }
    
            else if (msg != null) {
                this.redbird.MessageEnqueue(msg[0], msg[1])
            }
        }
        // console.log("[[ MessageEnqueue ]]")
        // console.log(msg)
        // this.socket.send(msg)
    }
}

