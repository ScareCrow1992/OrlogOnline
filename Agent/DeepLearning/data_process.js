let keys = ["hp", "token", "axe", "arrow", "helmet", "shield", "steal", "mark"]

function ParsingKey(avatars_info) {
    let userA = avatars_info[0]
    let userB = avatars_info[1]
    let who_is_first = avatars_info[2].first
    let turn = avatars_info[2].turn


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






export { ParsingKey }