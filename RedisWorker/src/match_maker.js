import RedisAdapter from "redis-bird"
import { Random } from "random-js";
import distributions from "distributions"

const random = new Random()






export default class MatchMaker{
    
    constructor(delayed_time = 15000){
        this.timer = delayed_time


        let redis_url = `redis://${process.env.REDIS}`

        this.redis_adapter = new RedisAdapter(redis_url, (...params)=>{ this.onMessage(...params) }, "matchmaker-0", "matchmaker")


        // this.redis_adapter = new RedisAdapter()

        this.Loop()
    }


    onMessage(channel_name, type, func, args, sender, id){
        // console.log(arguments)
        if(func == "MatchMake"){
            this.MatchMake(...args)
        }
    }



    async Loop(){
        while(true){
            await this.MatchMake("constant")
            await new Promise(res => setTimeout(res, this.timer / 3 ))
            
            await this.MatchMake("liberty")
            await new Promise(res => setTimeout(res, this.timer / 3 ))

            await this.MatchMake("draft")
            await new Promise(res => setTimeout(res, this.timer / 3 ))

        }
    }

    SetTimer(delayed_time){
        this.timer = delayed_time
    }


    // type = array
    // /waiting/constant/ = uid
    // /waiting/liberty/ = uid
    // /waiting/draft/ = uid
    async MatchMake(gamemode, rankgame = true, uids = null) {

        if(rankgame == true){
            uids = await this.redis_adapter.GetWaitingUids(gamemode)
        }

        // console.log(`<< ${gamemode} >>`)
        // console.log(typeof uids)
        // console.log(Object.keys(uids))
        let uids_ = Object.values(uids)
        // console.log(typeof uids_)
        // console.log(uids_)



        // console.log(uids_)

        if(uids_.length % 2 === 1){
            uids_.pop()
        }

        // uids_ = []
        if (uids_.length > 0) {
            // console.log(uids_)

            if(rankgame == true){
                // 1. uids를 점수를 기준으로 오름차순 정렬 한다
                // 2. 감마 분포의 형태로 만든 7개의 기준점으로 배열을 나눈다
                // 3. 각 배열에 대해 랜덤 셔플 한다
                // 4. 부분 배열들을 다시 잇는다

                let scores_ = await this.redis_adapter.Get_User_Scores(uids_)
                // console.log(scores_)

                let ret_ = ShuffleUsers(uids_, scores_)
                // console.log(ret_)
            }
            else{
                random.shuffle(uids_)
            }

            let performances = await this.redis_adapter.Broadcast_GetPerformance("engine")
            let perfs = []
            // console.log(performances)
            performances.forEach(perf => {
                let func = perf.func

                if (func !== "__ERROR__") {
                    let usage = perf.args[0]
                    let sender = perf.sender

                    // console.log(sender, usage)
                    perfs.push({ usage: usage, sender: sender })
                }
            })

            if(perfs.length == 0)
                return;

            perfs.sort((lhs, rhs) => { return lhs.usage - rhs.usage })
            // console.log(perfs)

            let optimal_engine_server = perfs[0].sender
            let prepare_games_ret = await this.redis_adapter.Request_PrepareGames(optimal_engine_server, uids_, gamemode, rankgame)

            // console.log(prepare_games_ret)

            prepare_games_ret.args[0].forEach((prepare_ret, index)=>{
                let first_uid = uids_[index * 2]
                let second_uid = uids_[index * 2 + 1]    

                let data, socket_state

                if(prepare_ret == false){
                    // 엔진서버에서 게임 인스턴스의 준비에 실패함
                    // 게임 재실행 요청 전송
                    // data = "MatchFail"
                    // socket_state = "fail"

                    this.redis_adapter.Notify_Socket_Matching_Fail(first_uid)
                    this.redis_adapter.Notify_Socket_Matching_Fail(second_uid)


                }
                else{
                    // console.log(first_uid, second_uid)
                    
                    let ret0 = this.redis_adapter.Request_Socket_Matching_Success(first_uid)
                    let ret1 = this.redis_adapter.Request_Socket_Matching_Success(second_uid)

                    Promise.all([ret0, ret1]).then(resolves=>{
                        // console.log(resolves)
                        if(resolves[0].func != "__ERROR__" && resolves[1].func != "__ERROR__"){
                            this.redis_adapter.Notify_GameStart(first_uid, second_uid)
                        }
                        else{
                            // 게임 매칭 요청에 소켓이 무응답 함
                            // 원인 : 클라이언트 변조, 통신 상태 불량
                            // (서버 과부하, 네트워크 이슈...)
                            this.redis_adapter.Notify_GameInvalid(first_uid, second_uid, optimal_engine_server)
                        }
                    })


                    // data = "MatchSuccess"
                    // socket_state = "playing"
                }

                // Promise.all([
                //     this.redis_adapter.Notify_Socket_SetState(first_uid, socket_state),
                //     this.redis_adapter.Notify_Socket_SetState(second_uid, socket_state)
                // ])

                // this.redis_adapter.Notify_Socket_Send(first_uid, data)
                // this.redis_adapter.Notify_Socket_Send(second_uid, data)

            })

            if(rankgame == true)
                await this.redis_adapter.DelWaitingUids(gamemode, uids_)


            // 매칭이 완료된 소켓들에게 gamestart 신호를 보낸다 (notify)

        }

    }

}











function ShuffleUsers(uids, scores){
    let user_infos=[]
    let length_ = uids.length
    for (let i = 0; i < length_; i++) {
        user_infos.push({ uid: uids[i], score: scores[i] })
    }

    user_infos.sort(cmp)
    let pivots = GetSlicePivots(length_)

    let ret = []

    for (let index = 0; index < pivots.length - 1; index++) {
        // console.log(`from ${pivots[index + 1]} to ${pivots[index] - 1}`)
        let from = pivots[index]
        let to = pivots[index + 1]

        let arr = user_infos.slice(from, to)
        random.shuffle(arr)

        ret = ret.concat(arr)

        // console.log(`[[ ${index} ]]`)
        // console.log(arr)
    }

    return ret
}


function cmp(userA, userB){
    return userA.score - userB.score
}


function GetSlicePivots(cnt) {
    let pivots = []
    pivots.push(0)

    var normal = distributions.Normal(0/* mean */, 1.5 /* std deviation */);

    let last_pivot = 0
    for (let i = -3; i <= 3; i++) {
        // last_width = normal.cdf(i)
        let new_pivot = Number.parseInt(normal.cdf(i) * cnt)

        if (new_pivot > last_pivot) {
            pivots.push(new_pivot)
            last_pivot = new_pivot
        }
    }

    if (cnt > last_pivot) {
        pivots.push(cnt)
    }

    return pivots
}


