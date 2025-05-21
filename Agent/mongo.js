import { MongoClient } from "mongodb"
import Bitwise from "./utils/Godfavor_Bitwise.js"


let player = {
    sub: "123456789",
    godfavors: 0b11100000000000000000
}



let mongo_client, orlog_DB, users_coll, games_coll = {}

async function Init(){
    mongo_client = new MongoClient("mongodb://rabbit:root1234@127.0.0.1:27017/", { compressors: ["snappy"], monitorCommands: true });

    console.log("connection")
    await mongo_client.connect()
    console.log("ping")
    await mongo_client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!")

    orlog_DB = mongo_client.db("orlog")
    users_coll = orlog_DB.collection("users")
    games_coll["constant"] = orlog_DB.collection("games_constant")
    games_coll["liberty"] = orlog_DB.collection("games_liberty")
    games_coll["draft"] = orlog_DB.collection("games_draft")

    return mongo_client

    // let ret = await users_coll.insertOne({ hello: "world", date: Date.now(), log: [1,2,3,4] })
}


async function AddUser(sub){
    let user = {
        sub: sub,
        game_history: {
            "constant": [],
            "liberty": [],
            "draft": []
        }
    }

    let ret = await users_coll.findOne({sub : user.sub})
    // console.log(ret)

    if (ret == null)
        await users_coll.insertOne(user)
    // console.log(ret.insertedId)
}


async function User_Update_Game_History(user, mode,game_doc_id){
    switch(mode){
        case "constant":
            users_coll.updateOne({sub : user.sub}, { $push : {"game_history.constant" : game_doc_id}})
            break;

        case "liberty":
            users_coll.updateOne({sub : user.sub}, { $push : {"game_history.liberty" : game_doc_id}})
            break;

        case "draft":
            users_coll.updateOne({sub : user.sub}, { $push : {"game_history.draft" : game_doc_id}})
            break;
    }

}


async function Create_Game_Document(first, second, result){
    let first_ = await users_coll.findOne({sub : first.sub})
    let second_ = await users_coll.findOne({sub : second.sub})

    if(first_ == null || second_ == null)
        return null



    let winner_ = result.winner == 0 ? first : second
    // console.log(Bitwise)
    let banned_ = Bitwise(result.banned)

    first.godfavors = Bitwise(first.godfavors)
    second.godfavors = Bitwise(second.godfavors)


    let game_document = {
        users: [first, second],  // 선공, 후공
        winner: winner_, // Object _id
        banned: banned_,
        date: result.start_time, //Date.now()
        duration: result.end_time - result.start_time,
        logs: result.replay
    }

    return game_document
}


async function Insert_Game_Document(doc, mode){
    return await games_coll[`${mode}`].insertOne(doc)
}



async function Add_Game_Document(first, second, result){
    let game_doc = await Create_Game_Document(first, second, result)

    let ret = await Insert_Game_Document(game_doc, result.mode)
    // console.log(ret.insertedId)

    User_Update_Game_History(first, result.mode, ret.insertedId)
    User_Update_Game_History(second, result.mode, ret.insertedId)

    return ret
}


async function DBG_ClearCollections(){
    users_coll.deleteMany({})
    games_coll["constant"].deleteMany({})
    games_coll["liberty"].deleteMany({})
    games_coll["draft"].deleteMany({})

}




async function main(){
    await Init()

}


export {Init, AddUser, Add_Game_Document, DBG_ClearCollections}


main()
