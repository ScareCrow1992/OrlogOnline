import EventEmitter from "./Utils/EventEmitter.js";


export default class Socket extends EventEmitter{
    constructor(onMessage, matching_token){
        super()
        this.onMessage = onMessage

        this.Connect_SocketServer(matching_token)

        // console.log(online)
        // console.log(this.ws)



        // this.ws.on('message', data=>{
        //     console.log(data)
        //     // switch(data.type){
        //     //     case "GodFavorPhaseOn":
        //     //         break;

        //     //         case 
        //     // }
        // })



        // trigger from server
        // this.trigger("GodFavorPhaseOn")

        // this.trigger("initial-game", [text, duration, first])

        // this.trigger("old-phase-end", [phase])

        // this.trigger("new-phase-start", [phase])

    }

    Connect_SocketServer(matching_token){
        let socketserver_url = `${window.config["WS"]}://${window.config["socket-server"]}/ws?token=${matching_token}`

        this.ws = new WebSocket(socketserver_url)
        // this.partnerbird = bird

        this.SetState("requested")


        this.ws.onmessage = (event) => {

            let data = event.data

            if (this.state == "playing")
                this.partnerbird.Transport(data)
            else
                this.onMessage(data)
        }

        
        this.ws.onerror = (event) =>{
            console.log(event)
        }

    }




    PrepareGame(bird){
        this.partnerbird = bird
    }



    SetState(state){
        this.state = state
    }


    send(data) {
        if (this.ws.readyState == 1)
            this.ws.send(data)

    }



    // CallFunction(data){
    //     let sync = data.sync
    //     let name = data.function
    //     let params = data.params



    //     if(sync == true){

    //     }

    // }









    // trigger to server
    BellPushed(player){
        this.ws.send(player)
    }

    // objectSelected(obj){
    //     this.ws.send(obj)
    
    // }

}
