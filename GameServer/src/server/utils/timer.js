import LogAdapter from "./LogAdapter.js";
import Game from "../../Game/Game.js";

export default class Timer {
    constructor() {

        this.game;
        this.situation_info;
        this.sync_cnt = 0
        this.blueBird

        this.sync_callback = null

        this.comapare_keys = ["round", "phase", "turnNum", "draft", "resolutionWaitInputForUser"]

    }


    ParseSituation(situation) {
        let situation_info = {}

        this.comapare_keys.forEach((key)=>{
            situation_info[`${key}`] = situation[`${key}`]
        })

        return situation_info
    }


    
    ManufactureSituation(situation_info, func){
        switch(func){
            case "RollDices" :
                situation_info.phase = "roll"
                break;

            case "SelectGodFavorPower" :
                situation_info.phase = "godfavor"
                break;
        }
    }

    BeginSync(acc_time){
        this.sync_callback = setTimeout(()=>{
            // console.log(`[Time Out] = ${acc_time}`)
            this.Sync_Timeout(acc_time + global.config.sync_timer_bias)
        }, acc_time + global.config.sync_timer_bias)
        
        // console.log(`[Sync Timer Start] : acc time = ${acc_time}, callback id = < ${this.sync_callback} >`)
    }


    CompleteSync(){
        // console.log(`[Complete Sync] = < ${this.sync_callback} >`)
        clearTimeout(this.sync_callback)
    }


    Check(func) {
        if (!this.game)
            return false;

        if (global.config.need_timer_cmds.includes(func)) {
            let situation_info = this.ParseSituation(this.game.situation, func)
            this.ManufactureSituation(situation_info, func)
            // console.log("start timer")

            let animation_time = global.config.animation_time[`${func}`]
            let limited_time = global.config.limited_time[`${func}`]
            let total_limited_time = animation_time + limited_time

            // console.log("timer start!")

            setTimeout(() => {
                let needForce = this.CompareSituation(situation_info, this.game.situation);
                if (needForce) {
                    // console.log("[[ force bell push ]]")
                    let user_indexes = this.game.GetSleepUser()
                    this.game.controller.BellPush(user_indexes)
                    this.game.timeover = true;

                    // this.game.controller.MessageEnqueue("BellPush", [])
                    // console.log("need Force bell push")
                }
                else {
                    // console.log("don't need Force")

                }
            }, total_limited_time)

            return true
        }
        else
            return false
    }


    // StartTimer() {
    //     const current_transport_cnt = [...this.transport_cnt]
    //     setTimeout(() => {
    //         players_index.forEach(player_index => {
    //             if (current_transport_cnt[player_index] == this.transport_cnt[player_index]) {
    //                 let bellPushCmd = JSON.stringify(["BellPush", []])
    //                 this.sockets[player_index].send(bellPushCmd)
    //             }
    //         })
    //     }, global.config.dice_roll_animation_time + global.config.dice_pick_time_limit)
    // }

    CompareSituation(prev_info, curr_info) {
        // console.log("[[ prev info ]]")
        // console.log(prev_info)

        // console.log("\n")

        // console.log("[[ current info ]]")
        // console.log(this.ParseSituation(curr_info))

        // console.log("\n\n")
        // console.log("[[[[ prev_info ]]]]")
        // console.log(prev_info)


        // console.log("[[[[ curr_info ]]]]")
        // console.log(curr_info)




        for (let index = 0; index < this.comapare_keys.length; index++) {
            let key = this.comapare_keys[index]
            let prev_val = prev_info[`${key}`]
            let curr_val = curr_info[`${key}`]

            if (prev_val != curr_val) {
                return false;
            }
        }

        return true;

    }

    Sync_Timeout(){
        // console.log("[[ Sync Timeout ]]")
        let sync_flag = this.blueBird.flag
        if(sync_flag[0] == false && sync_flag[1] == false){
            // draw
            console.log("[ draw~~~ ]")
        }
        else if(sync_flag[0] == false && sync_flag[1] == true){
            // 0번 승리
            console.log(`${this.blueBird.sockets[0].uid} is no signal`)
            // this.game.AlertStop(0)
        }
        else if(sync_flag[0] == true && sync_flag[1] == false){
            // 1번 승리
            console.log(`${this.blueBird.sockets[1].uid} is no signal`)
            // this.game.AlertStop(1)
        }

    }



    Force_BellPush(){


    }


    Force_Sync(){


        let log_adaptor = new LogAdapter(this.game.situation.msg_logs)
        let simulator = new Game(log_adaptor, -1, ()=>{}, this.game.situation.game_mode)

    }


    Force_GameOver(){

        
    }


}