



function Result_Situation(situation){
    // let situation = JSON.parse(JSON.stringify(situation_))

    let ret = {
        winner : situation.winner,
        banned : situation.banned_cards,
        start_time : situation.start_time,
        end_time : Date.now(),
        mode : situation.game_mode,
        replay : situation.msg_logs
    }

    return ret
}


export {Result_Situation}