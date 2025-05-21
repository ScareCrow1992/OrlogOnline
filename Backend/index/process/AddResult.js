import { AddResult, ChangeScore } from "#db_connector/databases.js"


export default function (first, second, result) {
    AddResult(first, second, result)
    // console.log(ret)

    let winner = null, loser = null

    if(result.winner == 0){
        winner = first.sub
        loser = second.sub
    }
    else{
        winner = second.sub
        loser = first.sub
    }

    // console.log(winner, loser)

    ChangeScore(winner, result.score, result.mode)
    ChangeScore(loser, -result.score, result.mode)


    return "success"
}


