import * as Mongo from "./mongo.js"
import * as Maria from "./mysql.js"


let godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];


function shuffle_(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}



function RandomInteger(from, to){
    let diff = to + 1 - from
    let rand = Math.floor(Math.random() * diff) % diff + from

    // this.PushLog(rand)
    return rand
}







function Init(){
    let mongo = Mongo.Init()
    let maria = Maria.Init()

    // console.log(mongo)


    // console.log("world")
    // console.log(mongo)
    // console.log(maria.Promise())
    // maria.Promise.then(()=>{"hello"})

    return mongo
}


function main(){
    let promise = Init()
    promise.then(()=>{
        // users.forEach(user=>{
        //     AddUser(user.id, user.email)
        // })


        // for (let i = 0; i < 30; i++) {
        //     let [first, second, result] = random_battle()
        //     // console.log(result)
        //     Maria.AddResult(first.sub, second.sub, result.mode)
        //     Mongo.Add_Game_Document(first, second, result)

        // }


    })
}

main()


function _DBG_Clear(){
    let promise = Init()
    promise.then(()=>{
        Maria._DBG_Truncate()
        Mongo.DBG_ClearCollections()

    })

}


// _DBG_Clear()