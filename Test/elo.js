import { Random } from "random-js";
import distributions from "distributions"

const random = new Random();

class User {
    constructor(index) {
        this.rating = 1000
        this.index = index + 1
        this.win = 0
        this.lose = 0

    }
}

class ELO {
    constructor() {
        this.K = 24

    }


    Sort(players) {


    }


    GetSlicePivots(cnt) {
        let pivots = []
        pivots.push(0)

        var normal = distributions.Normal(0/* mean */, 1.5 /* std deviation */);

        let last_pivot = 0
        for (let i = -3; i <= 3; i++) {
            // last_width = normal.cdf(i)
            let new_pivot = Number.parseInt(normal.cdf(i) * cnt)

            if (new_pivot > last_pivot) {
                pivots.push(new_pivot)
                last_pivot = new_pivot
            }
        }

        if (cnt > last_pivot) {
            pivots.push(cnt)
        }

        return pivots
    }


    ShuffleUsers(users) {
        users.sort(cmp)

        let ret = []

        let pivots = this.GetSlicePivots(users.length)
        // console.log(pivots)

        for (let index = 0; index < pivots.length - 1; index++) {
            // console.log(`from ${pivots[index + 1]} to ${pivots[index] - 1}`)
            let from = pivots[index]
            let to = pivots[index + 1]

            let arr = users.slice(from, to)
            random.shuffle(arr)

            ret = ret.concat(arr)

            // console.log(`[[ ${index} ]]`)
            // console.log(arr)
        }
        // console.log(ret)

        return ret
    }


    // return winner's index
    Simulation(players) {
        let scope = players[0].index + players[1].index

        let random_int = random.integer(0, scope)
        // console.log(players[0].index-random_int)

        let winner
        if (random_int > players[0].index)
            winner = 0
        else
            winner = 1

        return winner

    }

    updateRating(winner, loser) {
        let score = this.K * loser.rating / (winner.rating + loser.rating)
        score = Number.parseInt(score)
        winner.rating += score
        loser.rating -= score

        loser.rating = Math.max(100, loser.rating)

        winner.win++
        loser.lose++
    }
}


function test() {
    let users = []

    for (let i = 0; i < 100; i++) {
        users.push(new User(i))
    }

    let elo = new ELO()

    // for(let i = 0; i < 1000; i++){
    //     for(let j = 0; j < 1000; j++){
    //         let first = i % 100
    //         let second = j % 100

    //         if(first == second)
    //             continue

    //         let users_ = [users[first], users[second]]
    //         let winner = elo.Simulation(users_)

    //         elo.updateRating(users_[winner], users_[1 - winner])
    //     }
    // }


    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < users.length - 1; j++) {
            let first = j
            let second = j + 1

            let users_ = [users[first], users[second]]
            let winner = elo.Simulation(users_)

            elo.updateRating(users_[winner], users_[1 - winner])

        }
        users = elo.ShuffleUsers(users)

    }


    users.sort(cmp)
    console.log(users)


    // let pivots = elo.GetSlicePivots(users.length)
    // console.log(pivots)

}

function cmp(userA, userB) {
    return userA.rating - userB.rating
}




test()
// let acc = 0
// let last_width = 0
// var normal = distributions.Normal(0/* mean */, 2 /* std deviation */);
// for (let i = -3; i <= 3; i++){
    // console.log(normal.cdf(i) - last_width)
    // last_width = normal.cdf(i)
    // console.log(normal.cdf(i))
// }
// console.log(1 - normal.cdf(3))

// let index = 100

// for(let i=0; i<5; i++){
//     index *= (2/3)
//     console.log(index)
// }

// console.log(index * (1/3))

