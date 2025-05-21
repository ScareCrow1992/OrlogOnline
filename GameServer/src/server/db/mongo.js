import { MongoClient, ServerApiVersion } from "mongodb"

let mongo_client, game_DB, repository_coll


export default {
    CreateRepository : (...params)=>{ return CreateRepository(...params) },
    InsertLog : (...params)=>{ return InsertLog(...params) },
    SortRepositoryDocu : (...params)=>{ return SortRepositoryDocu(...params) }
}



async function CreateRepository(uid0, uid1){
    let ret = await repository_coll.insertOne({ users: [uid0, uid1], date: Date.now(), log: [] })
    return ret.insertedId
}


async function InsertLog(doc_id, logs){
    // await repository_coll.updateOne({_id : doc_id}, {$push : {log : log}})
    await repository_coll.updateOne({_id : doc_id}, {$push : {log : {$each : logs}}})
}


async function SortRepositoryDocu(doc_id) {
    await repository_coll.aggregate([
        {
            $project:
            {
                _id: doc_id,
                result: { $sortArray: { input: "$log", sortBy: { order: 1 } } }
            }
        }
    ])
}



