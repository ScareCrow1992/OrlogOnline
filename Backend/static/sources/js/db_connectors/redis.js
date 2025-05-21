import { createClient } from 'redis';

let redis_client

async function Init(){

        
    console.log(global.channel, " == start to connect immemory cache")
    // redis_client = createClient({"url" : "redis://default:r4IUzpUI8numdA2FfZYhycq88SXhMyYC@redis-14257.c228.us-central1-1.gce.cloud.redislabs.com:14257"});
    redis_client = createClient({"url" : `redis://${process.env.REDIS}`});


    await redis_client.connect()

    
    console.log(global.channel, " == connected to inmemory cache")


}



async function Caching_User(info){
    await redis_client.json.set(info.sub, ".", info)
    await redis_client.expire(info.sub, 1200)
}



// sub가 존재하면 만료 시간을 증가하면서 game_mode의 점수를 수정한다
async function ChangeScore(sub, score, game_mode){

    let user_info = await redis_client.json.get(sub)
    if(user_info){
        let new_score = user_info.scores[`${game_mode}`] + score
        if((score > 0) || (score < 0 && new_score >= 100))
            await redis_client.json.set(sub, `.scores.${game_mode}`, new_score)
        await redis_client.expire(sub, 1200)
    }
}



// 유저가 없으면 null을 반환한다.
async function FindUser_Summary(sub){
    let user_info = await redis_client.json.get(sub)
    if(user_info){
        await redis_client.expire(sub, 1200)

    }

    return user_info
}



async function AddUser(sub, email){
    this.Caching_User({sub, email, scores : {constant : 0, liberty : 0, draft : 0}})    


}


export {Init, ChangeScore, FindUser_Summary, Caching_User, AddUser}