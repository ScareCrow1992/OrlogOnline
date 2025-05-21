import { Random } from "random-js"

let random_ = new Random()
let godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];


export default function(users){
    let godFavors = random_.shuffle(godFavorNames)



    let indexes = new Array(users.length)
    for(let i=0; i<indexes.length; i++)
        indexes[i] = i
    
    indexes = random_.shuffle(indexes)

    
    let first = {
        sub : users[indexes[0]].id,
        godfavors : godFavors.slice(-3)
    }
    let second = {
        sub : users[indexes[1]].id,
        godfavors : godFavors.slice(-6, -3)
    }



    let banned = godFavors.slice(-10, -6)

    let winner = Math.random() > 0.5 ? 1 : 0

    let start_time = Date.now() - random_.integer(50000,150000)
    let end_time = start_time + (Math.floor(Math.random() * 100000))

    let replay = new Array(random_.integer(5, 15))
    for (let i = 0; i < replay.length; i++)
        replay[i] = { step: i }

    let mode = ["constant", "liberty", "draft"][random_.integer(0, 2)]
    // mode = "constant"


    let result={
        winner : winner,
        banned : banned,
        start_time : start_time,
        end_time : end_time,
        replay : replay,
        mode : mode
    }

    return [first, second, result]

}
