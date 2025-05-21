// server side

import Timer from "./timer.js"

let i = 0;

export default class Bluebird {
    constructor() {
        this.topsocket
        this.bottomsocket
        this.sockets = []

        this.messageQueue = [];
        this.state = true;
        this.flag = [false, false]

        this.game
        this.timer = new Timer()


        // setTimeout(()=>console.log(this.messageQueue), 2500)
    }


    Initialize0(topSocket, bottomSocket){
        this.topsocket = topSocket
        this.bottomsocket = bottomSocket
        this.sockets = [topSocket, bottomSocket]
    }


    Initialize1(game){
        this.topsocket.game = game
        this.bottomsocket.game = game

        this.game = game;
        this.timer.game = game
    }
    

    // 송신 (to Controller)
    MessageEnqueue(func, params, user = null) {
        // console.log(func)

        let timer = 0
        if (global.config.need_timer_cmds.includes(func))
            timer = global.config.limited_time[`${func}`]

        let data = JSON.stringify([func, params, timer])

        if(func == "GameOver"){
            this.Send(data)
            return;
        }

        let needSync = false;

        if(global.config.need_sync_cmds.includes(func)
        || global.config.need_timer_cmds.includes(func)){
            needSync = true;
        }

        // console.log(`enqueue : ${func}`)

        this.messageQueue.push({ needSync: needSync, data: data, user : user })

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
            let msg = this.messageQueue.shift()

            let obj = JSON.parse(msg.data)
            let user = JSON.parse(msg.user)

            let func = obj[0]
            // console.log(`dequeue : ${func} , (${i++})`)
            this.timer.Check(func)

            // this.topsocket.send(data.data)
            // this.bottomsocket.send(data.data)
            this.Send(msg.data, user)

            this.MessageDequeue()
        }
    }


    BellPush(user_indexes){
        let data = JSON.stringify(["BellPush", []])

        console.log(user_indexes)
        
        if (user_indexes[0])
            this.topsocket.send(data)

        if (user_indexes[1])
            this.bottomsocket.send(data)

    }


    Send(data, user = null) {
        if (user == null || user == 0)
            this.topsocket.send(data)

        if (user == null || user == 1)
            this.bottomsocket.send(data)

    }



    WorkComplete(user) {
        this.flag[Number(user)] = true;

        if (this.flag[0] && this.flag[1]) {
            this.state = true
            this.flag[0] = false
            this.flag[1] = false
            this.MessageDequeue()
        }

    }


    Transport(data, playerIndex) {
        // console.log(playerIndex)
        playerIndex = playerIndex % 2
        // console.log(data)
        let parsedData = JSON.parse(data)
        let obj = {
            func: parsedData[0],
            params: parsedData[1]
        }


        if (obj.func == "CheckReady") {
            this.WorkComplete(playerIndex)
        }
        else {
            if (obj.func === "BellPushed" && obj.params[0] === "client") {
                obj.params[0] = playerIndex
            }
            // let receivedUserIndex = obj.params[obj.params.length - 1]
            this.game.MessageEnqueue(obj.func, obj.params)
        }


    }
}