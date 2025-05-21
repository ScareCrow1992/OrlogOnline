export default class RandomGenerator {
    constructor() {


        this.logs = []

    }


    RandomInteger(from, to){
        let diff = to + 1 - from
        let rand = Math.floor(Math.random() * diff) % diff + from

        this.PushLog(rand)
        return rand
    }


    PushLog(num){
        this.logs.push(num)
    }
}