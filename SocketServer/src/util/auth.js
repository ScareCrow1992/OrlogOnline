export default async function (matching_token) {
    // redis를 통해 matching_token을 검색하여 sub를 얻는다
    // matching_token이 없다면 false 반환

    // 지금은 무조건 true를 반환시킨다

    // return global.redis_adapter.FindToken(matching_token)

    let uid = await global.redis_adapter.FindToken(matching_token)

    if(uid == null)
        return null
        
    let user = await global.redis_adapter.FindUser(uid)

    if(user == null)
        return null

    if(user.state !== "requested")
        return null

    return user



    return new Promise(resolve => {
        global.redis_adapter.FindToken(matching_token).then((uid)=>{
            if(uid == null)
                resolve(null)
            else{
                global.redis_adapter.FindUser(uid).then((user)=>{
                    if(user == null)
                        resolve(null)
                    else{
                        if(user.state !== "requested")
                            resolve(null)
                        else{
                            global.redis_adapter.Socket_Open(uid, global.channel).then(()=>{
                                resolve(uid)
                            })
                        }
                    }
                })
            }
        })
    })



    // return new Promise(resolve => {

    //     global.redis_adaptor

        // resolve(true)
        // if (matching_token === "success")
        //     resolve(true)
        // else
        //     resolve(false)

    // })
}