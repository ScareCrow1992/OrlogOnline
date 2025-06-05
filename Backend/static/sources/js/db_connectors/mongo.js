import { MongoClient, ServerApiVersion } from "mongodb"
import Bitwise from "#db_connector/utils/Godfavor_Bitwise.js"


let player = {
    sub: "123456789",
    godfavors: 0b11100000000000000000
}



let mongo_client, orlog_DB, user_coll, games_coll = {}

async function Init(){

    console.log(global.config["mongo_uri"])

    mongo_client = new MongoClient(global.config["mongo_uri"], {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        compressors: ["snappy"],
        monitorCommands: true
    });

    console.log("start to db connection")
    // console.log("connection")
    try {
        await mongo_client.connect()
    }
    catch (err) {
        console.log(err)
    }
    console.log("connecting to db successful!!")
    // console.log("ping")
    await mongo_client.db("admin").command({ ping: 1 });

    orlog_DB = mongo_client.db("orlog")
    user_coll = orlog_DB.collection("user")
    games_coll["constant"] = orlog_DB.collection("games_constant")
    games_coll["liberty"] = orlog_DB.collection("games_liberty")
    games_coll["draft"] = orlog_DB.collection("games_draft")

    return mongo_client

}


async function ChangeScore(sub, score, game_mode) {
    // console.log(score)
    let key_ = `scores.${game_mode}`

    let op_ = {}
    op_[`${key_}`] = score
    // console.log(arguments)

    if (score > 0) {
        user_coll.updateOne({ sub: sub }, { $inc: op_ })
    }
    else {

        let update_condition = { sub: sub }
        update_condition[`scores.${game_mode}`] = { $gte: 100 - score }

        // console.log(update_condition)
        op_[`${key_}`] = score

        user_coll.updateOne(update_condition, { $inc: op_ })

    }


    return;
    switch(mode){
        case "constant":
            // user_coll.updateOne({ sub: sub }, { $inc: { key_: score } })
            break;

        case "liberty":
            break;

        case "draft":
            break;
    }

}



async function AddUser(sub, email){
    // console.log("[[ AddUser ]]")
    // console.log(sub)
    // console.log(email)

    let user = {
        sub: sub,
        email: email,
        scores : {
            "constant": 0,
            "liberty": 0,
            "draft": 0
        },
        game_history: {
            "constant": [],
            "liberty": [],
            "draft": []
        }
    }

    let ret = await user_coll.findOne({sub : user.sub})
    // console.log(ret)

    if (ret == null)
        await user_coll.insertOne(user)
    // console.log(ret.insertedId)
}


async function FindUser(sub){
    let ret = await user_coll.findOne({sub : sub})

    return ret;
}


async function FindUser_Summary(sub){

    let property = { "projection" : { "game_history": false, "_id" : false }}

    // console.log(property)

    let ret = await user_coll.findOne({ sub: sub }, property)

    return ret;

}


async function User_Update_Game_History(user, mode,game_doc_id){
    switch(mode){
        case "constant":
            await user_coll.updateOne({sub : user.sub}, { $push : {"game_history.constant" : game_doc_id}})
            break;

        case "liberty":
            await user_coll.updateOne({sub : user.sub}, { $push : {"game_history.liberty" : game_doc_id}})
            break;

        case "draft":
           await  user_coll.updateOne({sub : user.sub}, { $push : {"game_history.draft" : game_doc_id}})
            break;
    }
}


async function Create_Game_Document(first, second, result){

    let winner_ = result.winner == 0 ? first : second
    // console.log(Bitwise)
    
    let winner = null, loser = null

    let banned_ = null



    if (result.mode === "draft")
        banned_ = Bitwise(result.banned)

    first.godfavors = Bitwise(first.godfavors)
    second.godfavors = Bitwise(second.godfavors)


    let game_document = {
        user: [first, second],  // 선공, 후공
        winner: winner_, // Object _id
        banned: banned_,
        date: result.start_time, //Date.now()
        duration: result.end_time - result.start_time,
        logs: result.replay
    }

    return game_document
}


async function Insert_Game_Document(doc, mode){
    // console.log(doc)
    // console.log(mode)
    return await games_coll[`${mode}`].insertOne(doc)
}



async function AddGameDocument(first, second, result){
    // console.log(first)
    // console.log(result)

    let game_doc = await Create_Game_Document(first, second, result)

    let ret = await Insert_Game_Document(game_doc, result.mode)
    // console.log(ret.insertedId)

    await User_Update_Game_History(first, result.mode, ret.insertedId)
    await User_Update_Game_History(second, result.mode, ret.insertedId)

    return game_doc
}


async function DBG_ClearCollections(){
    user_coll.deleteMany({})
    games_coll["constant"].deleteMany({})
    games_coll["liberty"].deleteMany({})
    games_coll["draft"].deleteMany({})

}




async function test_main(){
    await Init()

    await AddUser("77775555")
    await AddUser("354364553453")
    await AddUser("6563454312")
    await AddUser("54646254342")
    await AddUser("54654757345234")


    let first = {
        sub : "77775555",
        godfavors : ["Odin", "Idun", "Thor"]
    }

    let second = {
        sub : "354364553453",
        godfavors : ["Skuld", "Skadi", "Heimdall"]
    }

    let result = {
        winner : 0,
        banned : ["Baldr", "Bragi", "Brunhild", "Freyja"],
        start_time : Date.now() - 1000 * 300,
        end_time : Date.now(),
        replay : [{ step: 0 }, { step: 1 }, { step: 2 }],
        mode : "draft"
    }

    let ret = await AddGameDocument(first, second, result)

}


export {Init, AddUser, ChangeScore, AddGameDocument, DBG_ClearCollections, FindUser, FindUser_Summary}
