// server side


// let i = 0;

export default class LogAdapter {
    constructor(logs) {

        this.game
        this.logs = logs

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
        this.timer.blueBird = this
        this.guardian = new Guardian(this.game)
    }
    

    // 송신 (to Controller)
    MessageEnqueue(func, params, user = null) {
        // console.log(func)

        let timer = 0
        if (global.config.need_timer_cmds.includes(func))
            timer = global.config.limited_time[`${func}`]

        let data = JSON.stringify([func, params, timer])

        this.Send(data)
    }



    Send(data, user = null) {
        if (user == null || user == 0)
            this.topsocket.send(data)

        if (user == null || user == 1)
            this.bottomsocket.send(data)

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

            let filter_ret = this.guardian.Filter(obj.func, obj.params)
            // console.log(`[[ Guardian ]] : ${filter_ret}`)
            let msg = {
                type: "recv",
                params: obj.params
            }

            if (filter_ret) {
                let ret = this.game.MessageEnqueue(obj.func, obj.params)
                if(ret){
                }
            }

            // let receivedUserIndex = obj.params[obj.params.length - 1]
        }


    }
}