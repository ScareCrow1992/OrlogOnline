// server side

export default class Bluebird {
    constructor(){
        this.socket
        this.game

        this.messageQueue=[];
        this.state = true;
        this.flag = [false, false]
    }

    // 송신 (to Controller)
    MessageEnqueue(func, params) {
        // console.log([func,params])
        // console.log( JSON.parse(JSON.stringify([func,params])) )

        let needSync = false;
        if (func == "InitialGame" || func == "GameStart") {
            needSync = true;
        }

        // 일단 큐에 넣는다.
        let data = JSON.stringify([func, params])
        this.messageQueue.push({ needSync: needSync, data: data })

        this.MessageDequeue()
    }




    MessageDequeue() {
        if (!this.state || this.messageQueue.length == 0)
            return

        if (this.messageQueue[0].needSync == true){
            this.messageQueue[0].needSync = false
            this.socket.send(JSON.stringify(["CheckReady", []]))
            this.flag[0] = false;
            this.flag[1] = false;
            this.state = false;
        }
        else{
            while(this.messageQueue.length > 0){
                let data = this.messageQueue.shift()
                this.socket.send(data)
            }
        }
    }



    WorkComplete(user){
        this.flag[user] = true;

        if (this.flag[0] && this.flag[1]) {
            this.state = true
            this.flag[0] = false
            this.flag[1] = false
        }

        this.MessageDequeue()
    }




    Transport(data, user) {
        // console.log(data)
        let parsedData = JSON.parse(data)
        let obj = {
            func: parsedData[0],
            params: parsedData[1]
        }

        // console.log(obj)

        if (func == "CheckReady")
            this.WorkComplete(user)
        else
            this.game.MessageEnqueue(obj.func, obj.params)

        // console.log(obj)
        // console.log(obj.params)
    }

}