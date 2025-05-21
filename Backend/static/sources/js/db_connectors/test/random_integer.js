export default function(from, to){
    let diff = to + 1 - from
    let rand = Math.floor(Math.random() * diff) % diff + from

    // this.PushLog(rand)
    return rand
}
