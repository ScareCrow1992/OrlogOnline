import dotenv from 'dotenv'
dotenv.config();

import axios from 'axios'
import { Agent } from "http";



let axios_pool = axios.create({
    httpAgent: new Agent({
        maxSockets: 50,
        // maxTotalSockets : 2,
        maxFreeSockets: 5,
        keepAlive: true,
        timeout: 120000,
        freeSocketTimeout: 60000,
        keepAliveMsecs : 120000
    })
});

export default {
    MMF_loop : 15000,
    gameserver_local : "http://game-server:8510",
    offer_game_waiting_time : 7500,  // client가 match server의 offer 요청에 반응하기 위한 제한 시간
    env : process.env,
    axios_pool : axios_pool
}