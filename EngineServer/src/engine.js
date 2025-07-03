import Bluebird from "./utils/Bluebird.js"
import Game from "./Game/Game.js"
import RandomGenerator from "./utils/RandomGenerator.js";


class SocketAdapter{
    constructor(uid, index){
        this.uid = uid
        this.index = index
        this.blueBird = null
    }


    send(data){
        // console.log("[ ws.send ]")
        // console.log(data)
        global.redis_adapter.Notify_Socket_Send(this.uid, data)
    }


    onMessage(data) {
        // console.log(`[SocketAdapter - ${this.uid}]`)
        // console.log(typeof data)
        // console.log(data)
        if (this.blueBird != null)
            this.blueBird.Transport(data, this.index)
    }

}



export default class Engine {
    constructor() {

        this.games = new Map()
        this.socket_adapters = new Map()
        // key : uid
        // value : game instance
    }


    // 게임 무효화 (점수 미 반영)
    _GameInvalid(first_uid, second_uid){
        // console.log(`[${global.channel}] { game invalid } : ${first_uid}, ${second_uid}`)
        
        this.games.delete(first_uid)
        this.games.delete(second_uid)

        this.socket_adapters.delete(first_uid)
        this.socket_adapters.delete(second_uid)

        global.redis_adapter.GameOver(first_uid, second_uid)
    }


    _AlertStop(stopper_uid, opponent_uid, socket_state) {

        let game_ = this.games.get(stopper_uid)
        if(game_){
            console.log(`[${global.channel}] < alert stop > : ${stopper_uid}, ${opponent_uid} (turn : ${game_.situation.round})`)
            game_.SituationLog()
            // let stopper_index_ = game_.controller.GetIndex(stopper_uid)
            let stopper_index_ = this.socket_adapters.get(stopper_uid).index
            game_.AlertStop(stopper_index_)
        }

    }


    // 소켓서버 => 엔진서버
    _Receive(uid, data){
        // console.log(`[ ${uid} ] ${data}`)
        let socket_adapter = this.socket_adapters.get(uid)
        // console.log(`[socket adapter - ${uid}`)
        
        if(socket_adapter != null){
            socket_adapter.onMessage(data)
        }
    }


    Transport(func, args) {
        // console.log(arguments)
        return this[`_${func}`](...args)
    }



    Check_Game_Exist(uid){
        return this.games.has(uid)
    }



    async _GameStart(first_uid, second_uid, first_name, second_name, first_score, second_score){
        let game_ = this.games.get(first_uid)

        // console.log(arguments)
        
        let data = ["NeedSwap", []]
        game_.controller.topsocket.send(data)

        game_.controller.MessageEnqueue("UserTag", [first_name, second_name, first_score, second_score])

        game_.InitialGame()
    }



    async _GetPerformance(){
        return this.games.size
    }


    async _PrepareGames(uids, gamemode, rankgame, isBot) {
        let rets = []
        if(isBot == true){
            let length = uids.length
            for (let i = 0; i < length; i ++) {

                let ret = this.PrepareGame_Bot(uid, gamemode, rankgame)
                rets.push(ret)
            }
        }
        else {
            let length = uids.length
            for (let i = 0; i < length; i += 2) {
                let first = i
                let second = i + 1

                let pair_uids = [uids[first], uids[second]]
                let ret = this.PrepareGame(pair_uids, gamemode, rankgame)
                rets.push(ret)
            }
        }

        return Promise.all(rets)
    }


    async _SocketClose(signal){
        switch (signal) {
            case "red":
                // alert stop
                break;
        }
        return null
    }


    async PrepareGame(pair_uids, gamemode, rankgame){
        let first = pair_uids[0]
        let second = pair_uids[1]


        if(this.Check_Game_Exist(first) || this.Check_Game_Exist(second)){
            // 예외) 로직서버에 게임인스턴스가 이미 존재
            return false
        }


        this.CreateGame(first, second, gamemode, rankgame)

        global.redis_adapter.Engine_Ready(first, second, global.channel)

        // new Game()

        // global.redis_adapter.Engine_Ready(second, gamemode)

        return true
    }





    CreateGame(top_uid, bottom_uid, game_mode, rankgame){
        let top_socket_adapter = new SocketAdapter(top_uid, 0)
        let bottom_socket_adapter = new SocketAdapter(bottom_uid, 1)

        this.socket_adapters.set(top_uid, top_socket_adapter)
        this.socket_adapters.set(bottom_uid, bottom_socket_adapter)

        let random_generator = new RandomGenerator()
        let bluebird = new Bluebird()
        bluebird.Initialize0(top_socket_adapter, bottom_socket_adapter)



        try {
            let game = new Game(
                bluebird,
                (winner, situation) => {
                    this.GameOver_Callback(winner, situation, [top_socket_adapter, bottom_socket_adapter], rankgame)
                },
                game_mode,
                random_generator)


            this.games.set(top_uid, game)
            this.games.set(bottom_uid, game)

            
    
            bluebird.Initialize1(game)
        }
        catch (err) {
            console.log(err)
            console.log("failed to create game instance")
            // Game 인스턴스 생성 실패
            // 1. 재생성 시도
            // 2. 클라이언트와 소켓 연결 해제
        }



    }



    GameOver_Callback(winner, situation, sockets, rankgame) {
        // mongo.InsertLog(situation.doc_id, situation.logs_)

        // games.delete(sockets[0].uid)

        situation.winner = winner

        let lead_index = situation.first

        let first = {
            sub: sockets[0].uid,
            godfavors: situation.player[0].godFavors
        }

        let second = {
            sub: sockets[1].uid,
            godfavors: situation.player[1].godFavors
        }

        let result_situaion = this.Result_Situation(situation)


        // console.log("[[ Gameover_Callback ]]")
        // console.log(first)
        // console.log(second)
        // console.log(result_situaion)

        
        // console.log("rankgame : ", rankgame)
        if(winner != null && rankgame == true)
            global.redis_adapter.AddResult(first, second, result_situaion)

        // console.log(result_situaion)
        global.redis_adapter.GameOver(first.sub, second.sub)
        this.games.delete(first.sub)
        this.games.delete(second.sub)

        this.socket_adapters.delete(first.sub)
        this.socket_adapters.delete(second.sub)

        // Backend.AddResult(first, second, result_situaion)
        // SocketsClose(winner, sockets)
    }


    Result_Situation(situation){
        // let situation = JSON.parse(JSON.stringify(situation_))
        
        // console.log("[[ double_index ]]")
        // console.log(situation.double_cube.double_index)

        // console.log(situation.winner)
        // console.log(situation.player[0])
        // console.log(situation.player[1])

        let ret = {
            winner : situation.winner,
            banned : situation.banned_cards,
            start_time : situation.start_time,
            // score : situation.double_cube.score,
            score : situation.score_,
            end_time : Date.now(),
            mode : situation.game_mode,
            replay : situation.msg_logs,
            lead: situation.first
        }
    
        return ret
    }
    
    
    ResetUID(uid){

    }



    AlertStop(uid){



    }







}


