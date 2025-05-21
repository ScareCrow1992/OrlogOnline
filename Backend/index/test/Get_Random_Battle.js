import Get_Random_Battle from "#db_connector/test/random_battle.js"

export default function (users, cnt) {
    let ret = []
    for (let i = 0; i < cnt; i++)
        ret.push(Get_Random_Battle(users))

    return ret
}