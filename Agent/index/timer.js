

export default class Timer {
    constructor() {

        this.game;
        this.situation_info;

        this.comapare_keys = ["round", "phase", "turnNum", "draft"]

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


    Check(func) {
        if (!this.game)
            return;
        
        if (global.config.need_timer_cmds.includes(func)) {
            let situation_info = this.ParseSituation(this.game.situation, func)
            this.ManufactureSituation(situation_info, func)
            // console.log("start timer")
            
            let animation_time = global.config.animation_time[`${func}`]
            let limited_time = global.config.limited_time[`${func}`]
            let total_limited_time = animation_time + limited_time

            console.log("timer start!")

            setTimeout(() => {
                let needForce = this.CompareSituation(situation_info, this.game.situation);
                if (needForce) {
                    let user_indexes = this.game.GetSleepUser()
                    this.game.controller.BellPush(user_indexes)

                    // this.game.controller.MessageEnqueue("BellPush", [])
                    // console.log("need Force bell push")
                }
                else{
                    // console.log("don't need Force")

                }
            }, total_limited_time)
        }
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
}