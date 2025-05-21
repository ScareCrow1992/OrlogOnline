// { pick: pick_, ban: ban_ }




export default function (avatar, user, turn, pick, ban, current_banpick) {
    if (avatar != user)
        return null

    // console.log(current_banpick)


    let cards = new Array(20)
    for (let i = 0; i < cards.length; i++)
        cards[i] = i

    let cannot_select_cards = new Set(cards)

    current_banpick.ban.forEach(ban => {
        if (ban != -1)
            cannot_select_cards.delete(ban)
    })

    current_banpick.pick[0].forEach(pick => {
        if (pick != -1)
            cannot_select_cards.delete(pick)
    })

    current_banpick.pick[1].forEach(pick => {
        if (pick != -1)
            cannot_select_cards.delete(pick)
    })

    let arr = [...cannot_select_cards]

    // console.log(arr)

    let input_info = { pick: null, ban: null }
    if (pick)
        input_info.pick = arr[0]

    if (ban)
        input_info.ban = arr[1]

    // console.log(input_info)

    return [
        "BellPushed",
        [
            avatar,
            input_info,
            "cardselect",
            [
                {
                    "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"],
                    health: 15,
                    token: 5
                }, {
                    "dicesState": ["chosen", "chosen", "chosen", "chosen", "chosen", "chosen"],
                    health: 15,
                    token: 10
                }
            ]
        ]
    ]
}