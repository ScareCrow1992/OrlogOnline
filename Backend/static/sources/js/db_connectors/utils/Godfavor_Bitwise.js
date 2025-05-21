const dict = { Baldr: 0, Bragi: 1, Brunhild: 2, Freyja: 3, Freyr: 4, Frigg: 5, Heimdall: 6, Hel: 7, Idun: 8, Loki: 9, Mimir: 10, Odin: 11, Skadi: 12, Skuld: 13, Thor: 14, Thrymr: 15, Tyr: 16, Ullr: 17, Var: 18, Vidar: 19 };

export default function (godfavors) {
    let bitwise = 0
    godfavors.forEach(godfavor => {
        // bitwise |= (1 << dict[`${godfavor}`])
        bitwise |= (1 << godfavor)
    })

    // console.log(bitwise)
    return bitwise
}
