// server side

export default class Bluebird {
    constructor() {
        this.topsocket
        this.bottomsocket
        this.game


        this.messageQueue = [];
        this.state = true;
        this.flag = [false, false]
    }

    // 송신 (to Controller)
    MessageEnqueue(func, params) {

        let needSync = false;
        if (func == "InitialGame" || func == "GameStart") {
            needSync = true;
        }



        let data = JSON.stringify([func, params])
        this.messageQueue.push({ needSync: needSync, data: data })

        if (this.state)
            this.MessageDequeue()

    }


    MessageDequeue() {
        if (!this.state || this.messageQueue.length == 0)
            return

        if (this.messageQueue[0].needSync == true) {
            this.messageQueue[0].needSync = false
            let checkdata = JSON.stringify(["CheckReady", []])
            this.topsocket.send(checkdata)
            this.bottomsocket.send(checkdata)
            this.flag[0] = false;
            this.flag[1] = false;
            this.state = false;
        }
        else {
            while (this.messageQueue.length > 0) {
                let data = this.messageQueue.shift()
                this.topsocket.send(data.data)
                this.bottomsocket.send(data.data)
            }
        }
    }


    WorkComplete(user) {
        this.flag[Number(user)] = true;

        if (this.flag[0] && this.flag[1]) {
            this.state = true
            this.flag[0] = false
            this.flag[1] = false
        }

        this.MessageDequeue()
    }




    Transport(data, playerIndex) {
        // console.log(data)
        let parsedData = JSON.parse(data)
        let obj = {
            func: parsedData[0],
            params: parsedData[1]
        }

        // console.log(`player[${playerIndex}]'s request is received`)

        // console.log(`${obj.func}, ${obj.params[0]}`)

        if (obj.func == "CheckReady"){
            // console.log("CheckReady : " , playerIndex)
            this.WorkComplete(playerIndex)
        }
        else {
            if (obj.func === "BellPushed" && obj.params[0] === "client") {
                // console.log("client button is pushed")
                switch (playerIndex % 2) {
                    case 0:
                        // top player
                        obj.params[0] = 0
                        break;

                    case 1:
                        // bottom player
                        obj.params[0] = 1
                        break;
                }
            }
            // let receivedUserIndex = obj.params[obj.params.length - 1]
            this.game.MessageEnqueue(obj.func, obj.params)
        }
    }
}