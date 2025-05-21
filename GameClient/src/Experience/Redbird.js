// client side


export default class Redbird {
    constructor(){
        this.socket
        this.controller
        // this.onlinesocket

    }


    
    // 송신 (to Game)
    MessageEnqueue(func, params){
        // console.log([func,params])
        // console.log( JSON.parse(JSON.stringify([func,params])) )
        
        // console.log("[[ 송신 ]]")
        // console.log("[[ func ]]")
        // console.log(func)

        // console.log("[[ params ]]")
        // console.log(params)

        // console.log(params)

        let data = JSON.stringify([func,params])
        
        this.socket.send(data)
        
        // this.onlinesocket.send(data)

        // this.socket.send(data)
    }


    // 수신 (to Controller)
    Transport(data){
        // console.log("[[ redbird - transport ]]")
        // console.log(typeof data)
        let parsedData = JSON.parse(data)
        let obj = {
            func : parsedData[0],
            params : parsedData[1],
            timer : parsedData[2]
        }

        // console.log("[[ 수신 ]]")
        // console.log(obj.func)

        if(obj.func == "GameOver"){
            this.socket.send("Check_GameOver")
        }

        this.controller.MessageEnqueue(obj.func, obj.params, obj.timer)
        // console.log(obj)
        // console.log(obj.params)
    }

}