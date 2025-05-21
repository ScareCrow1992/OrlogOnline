

export default function (info_) {
    let info = JSON.parse(JSON.stringify(info_))

    // console.log(info)

    // info.health /= 15.0;
    // info.token /= 50.0

    info.dices = { axe: 0, arrow: 0, helmet: 0, shield: 0, steal: 0, empty: 0, mark: 0 }

    info.weapon.forEach(weapon_ => {
        info.dices[`${weapon_}`]++
    })

    info.dices.empty = 6 - (
        info.dices.axe + info.dices.arrow + info.dices.helmet + info.dices.shield + info.dices.steal
    )

    info.mark.forEach(mark_ => {
        if (mark_ == true)
            info.dices.mark++
    })

    return info
}