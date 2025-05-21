

export default class WS{
    constructor(ws){
        this.instance = ws
        this.state_ = null  // onMessage의 분기점 기준일 뿐, 실질적인 상태 판별용으로는 사용금지
        // "idle", "requested", "waiting", "preparing", "playing", "gameover", null

        this.promise_resolve = null
        this.gameover_checked = false


        // console.log("i'm socket~")
        // ws.send("hello~~")
        this.Initialize(ws)
    }


    

    set state(rhs) { this.state_ = rhs }

    get state() { return this.state_ }  // 정합성을 위해 redis에서의 상태를 읽어야 함


    GetUid() { return this.instance.uid }

    Initialize(ws){
        this.state = "waiting"
        
        ws.addEventListener('message', (msg)=>{this.On_Message(msg)})

    }


    
    ResetSocketInstance(){
        // console.log("[[ Reset Socket Instance ]]")
        if(this.instance != null){
            // console.log("[[ Reset Socket Instance ]]")
            global.redis_adapter.Socket_Closed(this.instance.uid)

            this.instance.close()
            // this.instance.removeAllListeners()
            this.instance.uid = null
            this.instance = null

        }

        if(this.promise_resolve != null){
            this.promise_resolve(false)
            this.promise_resolve = null
        }

    }



    // 이미 연결된 이후에 이벤트가 등록되므로 호출 불가능
    On_Open(event){
        // this.instance.send("world!")
        // console.log("connected~")

    }


    On_Close() {
        let instance_ = this.instance
        // setTimeout(() => { instance_.terminate() }, 35000)

        this.ResetSocketInstance()
        // console.log(this.state, this.gameover_checked)
        // if (this.state == "gameover" && this.gameover_checked == true)
        //     this.ResetSocketInstance()
        // else
        //     setTimeout(() => { this.ResetSocketInstance(), 5000 })
        

        return this.state

    }


    On_Message(msg){
        let msg_data = msg.data
        // console.log(this.state, msg_data)
        switch(this.state){
            case "waiting":

                if(this.instance.rankgame == true)
                    return;

                if(!msg_data)
                    return
                
                let msg_obj = JSON.parse(msg_data)

                switch(msg_obj.func){
                    case "Start_FriendlyGame":
                        global.redis_adapter.Start_FriendlyGame(msg_obj.gamemode, this.instance.uid)
                    break;

                    case "Exit_Lobby":
                        global.redis_adapter.Exit_Lobby(this.instance.uid)
                    break;


                }



                // if(msg_obj.func == "Start_FriendlyGame"){
                //     console.log(msg_obj, this.instance.uid, this.instance.rankgame)
                //     global.redis_adapter.Start_FriendlyGame(msg_obj.gamemode, this.instance.uid)
                // }

                break;

            case "playing":
                // console.log(`[ws - ${this.GetUid()}]`, msg_data)
                // msg_data = JSON.parse(msg_data)
                // console.log(`[ws - ${this.GetUid()}]`, msg_data)
                // console.log(msg)

                if(msg_data == "GameOver_Check"){
                    this.gameover_checked = true
                }
                else{
                    global.redis_adapter.Notify_Engine_Receive(this.GetUid(), msg_data)
                }
                break;
            
            case "prepared":
                // console.log("prepared~")
                if (msg_data == "prepared" && this.promise_resolve != null) {
                    this.promise_resolve(true)
                    this.promise_resolve = null
                    this.state = "playing"
                }

                break;
            
            // default:
            //     console.log(this.state, msg_data)
            //     break;
        }
    }


    CheckAlive() {
        if (this.instance != null) {
            switch (this.instsance.readyState) {
                case 0:
                    // CONNECTING
                    return true
                    break;

                case 1:
                    // OPEN
                    return true
                    break;

                case 2:
                    // CLOSING
                    return false
                    break;

                case 3:
                    // CLOSED
                    return false
                    break;

                default:
                    return false;
                    break;
            }
        }
        else {
            return false
        }
    }


    Send(data) {
        let data_stringify = JSON.stringify(data)
        // console.log("[ readystate ]", this.instance.readyState)
        
        // if (this.state !== null)
        if (this.instance.readyState == 1) {
            try { this.instance.send(data_stringify) }
            catch (err) { console.log(err) }

        }
        else {
            console.log(` [${this.instance.uid}] failed to send data`)
        }

    }



    Request(data) {
        // console.log("[[ Request ]]", data)
        if(this.promise_resolve != null){
            console.log(`[ LEAKED - ${this.instance.uid}] promise_resolve `)
        }
        let promise = new Promise(res => { this.promise_resolve = res })

        this.Send(data)
        return promise
    }


}

