import * as Mongo from "#db_connector/mongo.js"
import * as Redis from "#db_connector/redis.js"
// import * as Maria from "#db_connector/mysql.js"


function AddUser(id, email){
    // console.log("[[ AddResult 1 ]]")
    // Maria.AddUser(id, email)
    Redis.AddUser(id, email)
    Mongo.AddUser(id, email)    

}



function AddResult(first, second, result) {
    // Maria.AddResult(first.sub, second.sub, result.mode)
    Mongo.AddGameDocument(first, second, result)

}


function ChangeScore(sub, score, game_mode){
    Redis.ChangeScore(sub, score, game_mode)
    Mongo.ChangeScore(sub, score, game_mode)
}


function FindUser(sub){
    return Mongo.FindUser(sub)
}


function FindUser_Summary(sub) {
    AddUser(sub, sub)

    console.log(`FindUser_Summary : ${sub}`)
    let promise_ = new Promise((res) => {
        Redis.FindUser_Summary(sub).then((ret) => {
            if (ret == null) {
                console.log("not in cache")
                Mongo.FindUser_Summary(sub).then((user_info) => {
                    console.log(user_info)
                    if (user_info != null) {
                        res(user_info)
                        Redis.Caching_User(user_info)
                    }
                    else{
                        res(null)
                    }
                })
            }
            else {
                console.log("exist in cache")
                res(ret)
            }
        })
    })

    return promise_
}


function Init(){
    let promise_ = new Promise(res=>{
        Redis.Init().then(()=>{
            Mongo.Init().then((ret)=>{
                res(ret)
            })
        })
    })

    // let prom1 = Mongo.Init()

    return promise_
    // let mongo = Mongo.Init()
    // let maria = Maria.Init()

    // console.log(mongo)


    // console.log("world")
    // console.log(mongo)
    // console.log(maria.Promise())
    // maria.Promise.then(()=>{"hello"})

    // return mongo
}


function test_main(){
    let promise = Init()
    promise.then(()=>{
        // users.forEach(user=>{
        //     AddUser(user.id, user.email)
        // })


        // for (let i = 0; i < 30; i++) {
        //     let [first, second, result] = random_battle()
        //     // console.log(result)
        //     Maria.AddResult(first.sub, second.sub, result.mode)
        //     Mongo.AddGameDocument(first, second, result)

        // }


    })
}

// test_main()


function _DBG_Clear(){
    let promise = Init()
    promise.then(()=>{
        // Maria._DBG_Truncate()
        Mongo.DBG_ClearCollections()

    })

}


// _DBG_Clear()


export {Init, AddUser, AddResult, ChangeScore, FindUser, FindUser_Summary}