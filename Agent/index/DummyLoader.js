import Dummy from "./dummy.js"
import axios from "axios";
import { Agent } from "http";

// import Machine from "../GameLearning/Machine.js";
// import TF_Model from "../GameLearning/tf_models/TF_Model.js";

let gameclient_host = "https://orlog.io"

async function Login(axios_pool){
    let path = "/dummy/login"

    for(let uid=3000; uid < 6000; uid++){
        let query = `?id=${uid}&email=bot${uid}@orlog.com`
        let login_url = gameclient_host + path + query
        // console.log(login_url)
        axios_pool.post(login_url)

        await new Promise(res=>{setTimeout(()=>{res(true)}, 50)})

    }
}




export default class DummyLoader {
    constructor() {
        this.dummies = []

        this.axios_pool = axios.create({
            httpAgent: new Agent({
                maxSockets: 250,
                // maxTotalSockets : 2,
                maxFreeSockets: 5,
                keepAlive: false,
                timeout: 20000,
                freeSocketTimeout: 10000,
                keepAliveMsecs : 20000
            })
        });

        this.reserved_delete = false
        this.acc_play_cnt = 0   // 총 플레이 횟수

        // this.roll_model = new TF_Model(94, 64, 0)
        // this.godfavor_model = new TF_Model(57, 61, 1)

        // this.roll_model.LoadModel(23, "roll")
        // this.godfavor_model.LoadModel(23, "godfavor")

        // this.machine = new Machine(0, null, this.roll_model, this.godfavor_model)


    }


    get dummies_cnt(){
        return this.dummies.legnth
    }


    get loader_info(){
        let total = this.dummies.length
        let states = { idle: 0, waiting: 0, playing: 0 }
        // let idle = 0, waiting = 0, playing = 0

        this.dummies.forEach(dummy=>{
            states[`${dummy.state}`]++
        })
        let acc_cnt = this.acc_play_cnt

        let info = {
            total : total,
            idle : states["idle"],
            waiting : states["waiting"],
            playing : states["playing"],
            acc_cnt : acc_cnt
        }

        return info
    }



    GameEnd(){
        this.acc_play_cnt++
    }


    WorkLoad(from, cnt, game_mode) {
        let i = from;
        let registered_cnt = 0
        for (; i < this.dummies.length; i++) {
            if (registered_cnt >= cnt)
            break;

            if (this.dummies[i].Work(game_mode)) {
                registered_cnt++
            }
        }

        return registered_cnt
    }



    CreateDummy(cnt){
        let prev_length = this.dummies.length
        let next_length = prev_length + cnt
        this.dummies.length = next_length

        for(let index = prev_length; index < next_length; index++){
            this.dummies[index] = new Dummy(index, (uid, result, logs) => { this.Callback(uid, result, logs) }, this.axios_pool, this.machine)
        }


    }


    // from에서 cnt 갯수만큼의 dummy 정보를 반환한다
    GetDummyInfo(from, cnt){
        let ret = []
        for (let i = 0; i < cnt; i++) {
            let index = i + from

            if((index >= this.dummies.length) || (index < 0))
                break;

            let info = this.dummies[index].Info
            ret.push(info)
        }
        return ret
    }



    Callback(uid, result, logs) {

        // console.log(logs)

        this.GameEnd()
        // this.dummies[uid].GameEnd()
        
        // console.log(`${uid} agent - Game Over (${result ? "WIN" : "DEFEAT"})`);
        // delete dummies[`${uid}`]

        // --left_cnt
        // if (left_cnt % 100 == 0) {
        //     console.log(`left cnt : ${left_cnt}`)
        // }

        // console.log(dummies)

    }


    // period 생산 주기
    // incremental : 주기당 생산량
    // cnt : 반복 횟수
    DummyLoad(incremental, cnt, period){
        

    }

}



// function test(){
//     let loader = new DummyLoader()
//     loader.CreateDummy(10)
//     console.log(loader.GetDummyInfo(0, 100))
// }

// test()