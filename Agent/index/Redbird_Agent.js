// client side


export default class Redbird {
    constructor() {
        this.socket
        this.controller
        // this.onlinesocket


    }



    
    // 송신 (to Game)
    MessageEnqueue(func, params){
        // console.log(func,params)
        // console.log( JSON.parse(JSON.stringify([func,params])) )



        let data = JSON.stringify([func,params])

        // console.log("[[ 송신 ]]")
        // console.log(data)
        // console.log(data)
        this.socket.send(data)
        // this.onlinesocket.send(data)

        // this.socket.send(data)
    }


    // 수신 (to Controller)
    Transport(data){
        // console.log(data)
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
        let parsedData = JSON.parse(JSON.stringify(data))
        let obj = {
            func : parsedData[0],
            params : parsedData[1],
            timer : parsedData[2]
        }

        // console.log("[[ Red Bird ]]")
        // console.log(data)
        // console.log(obj)

        
        if(obj.func == "GameOver"){
            // this.socket.send("Check_GameOver")
        }


        this.controller.MessageEnqueue(obj.func, obj.params, obj.timer)
        // console.log(obj)
        // console.log(obj.params)
    }



}