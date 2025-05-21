import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));


let cnt = 0;

async function Init() {
    console.log("connect to DB")
    await client.connect();
    console.log("connected to DB")



    // await client.set('key', 'value');
    // const value = await client.get('key');
    // console.log(value)


    // let ret = ParsingKey(
    //     {hp : 10, token : 12, axe : 3, arrow : 0, helmet : 1, shield : 2, steal : 0, mark : 3},
    //     {hp : 13, token : 4, axe : 1, arrow : 4, helmet : 1, shield : 1, steal : 2, mark : 5}
    // )

    // await client.set(ret, 10)
    // await client.incr(ret)
    // await client.incr(ret)
    // await client.incr(ret)
    // await client.incr(ret)
    // await client.sendCommand(['SET', 'key123', 'va2423lue']);

    // await client.sendCommand(["BITFIELD", "player:1:stats", "SET", "u32", "#0", 9999])

    // await client.sendCommand(['HGETALL', 'user:123']); // ['key1', 'field1', 'key2', 'field2']

    // console.log(ret)

}


let keys = ["hp", "token", "axe", "arrow", "helmet", "shield", "steal", "mark"]

function ParsingKey(userA, userB, who_is_first, turn) {
    if (who_is_first == 0)
        return ParsingKey_(userA, userB, turn)
    else
        return ParsingKey_(userB, userA, turn)

}

function ParsingKey_(first, second, turn) {
    // console.log(first)
    let str_first = ""
    keys.forEach(key => {
        str_first += first[`${key}`] + "-"
    })
    str_first = str_first.slice(0, str_first.length - 1)

    let str_second = ""
    keys.forEach(key => {
        str_second += second[`${key}`] + "-"
    })
    str_second = str_second.slice(0, str_second.length - 1)

    return str_first + ":" + str_second + ":" + turn
}

function InsertLog(log, winner) {
    let userA = log[0]
    let userB = log[1]
    let first_player = log[2].first
    let turn = log[2].turn

    if(first_player == 1)
        winner = 1 - winner

    let score
    if(winner == 0)
        score = 1
    else
        score = -1    

    // winner = first_player == 1 ? 1 - winner : winner

    let log_key = ParsingKey(userA, userB, first_player, turn)
    client.incrBy(log_key, score).then(() => {
        if ((cnt++ % 5000) == 0){
            console.log(cnt)

        }
    })

}

function InsertLogs(logs, winner) {
    logs.forEach(log => { InsertLog(log, winner) })
}


export { Init, InsertLogs }