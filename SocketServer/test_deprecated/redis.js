import { createClient } from 'redis';


async function main() {

    const client = createClient({ "url": "redis://127.0.0.1:6379" });

    await client.on('error', err => console.log('Redis Client Error', err));

    console.log("connect to DB")

    await client.connect();

    console.log("connected to DB")
    
    // client.json.set()

    // await client.json.set("hello_ddd", '.', { node: 4303 })
    // let val = await client.json.get("hello_ddd")
    // console.log(val)

    await client.json.set("hello_ddd", ".", {age : 52})
    let val = await client.json.get("hello_ddd")
    console.log(val)


    await client.json.set("hello_ddd", ".name", "john")
    val = await client.json.get("hello_ddd")
    console.log(val)

    await client.json.set("hello_ddd", ".friend", {age : 48, name : "tom"})
    val = await client.json.get("hello_ddd")
    console.log(val)

    await client.json.set("hello_ddd", ".friend.sex", "woman")
    val = await client.json.get("hello_ddd")
    console.log(val)

    // client.set("0", 0)
    // await client.set("1", 1)
    // client.set("2", 2)
    // client.set("3", 3)
    // client.set("4", 4)
    // client.set("person", JSON.stringify({age : 45, name : "john"}))

    // let val = await client.get("person000")

    // console.log(JSON.parse(val))


    // console.log(process.env.pm_id)
    // let pm_id = process.env.pm_id
    // client.subscribe(`socket-${pm_id}`, (message)=>{console.log(`[socket ${pm_id}] : ${message}`)})

    // await client.set('key', 'value');
    // const value = await client.get('key');
    // console.log(value)

    // await client.subscribe(`socket0`, (message)=>{console.log(`[socket0] : ${message}`)})
    // await client.publish("socket0", "hello")


    // client.select(0)
    // client.get("aaa")
    // client.select(1)
    // client.get("aaa")
    // client.select(2)
    // client.get("aaa")
    // client.select(3)
    // client.get("aaa")
    // client.select(4)
    // client.get("aaa")


    // await client.select(0)
    // await client.set("wow", [0, 1, 2, 3, 4, 5, 6, 7])
    // let val = await client.get("wow")
    // let arr = ["99", "1", "2", "3"]
    // await client.lPush("wow", "0", "1", "2", "3", "4")
    // await client.rPush(...arr)
    // await client.rPush("abc", arr)
    // let val = await client.lRange("abc", 0, -1)
    // console.log(val)

    // let keys = await client.keys("*")
    // console.log(keys)



    // await client.select(1)
    // await client.subscribe(`socket1`, (message)=>{console.log(`[socket1] : ${message}`)})
    // await client.set("wow", "world")

    // let ret = ParsingKey(
    //     { hp: 10, token: 12, axe: 3, arrow: 0, helmet: 1, shield: 2, steal: 0, mark: 3 },
    //     { hp: 13, token: 4, axe: 1, arrow: 4, helmet: 1, shield: 1, steal: 2, mark: 5 }
    // )

    // // await client.set(ret, 10)
    // await client.incr(ret)
    // await client.incr(ret)
    // await client.incr(ret)
    // await client.incr(ret)

    // let val = await client.get(ret)
    // console.log(val)


    // await client.sendCommand(['SET', 'key123', 'va2423lue']);

    // await client.sendCommand(["BITFIELD", "player:1:stats", "SET", "u32", "#0", 9999])

    // await client.sendCommand(['HGETALL', 'user:123']); // ['key1', 'field1', 'key2', 'field2']

    // console.log(ret)



}


main()



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

    if (first_player == 1)
        winner = 1 - winner

    let score
    if (winner == 0)
        score = 1
    else
        score = -1

    // winner = first_player == 1 ? 1 - winner : winner

    let log_key = ParsingKey(userA, userB, first_player, turn)
    client.incrBy(log_key, score).then(() => {
        if ((cnt++ % 5000) == 0) {
            console.log(cnt)

        }
    })

}

function InsertLogs(logs, winner) {
    logs.forEach(log => { InsertLog(log, winner) })
}
