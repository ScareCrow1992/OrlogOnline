
// import axios from "axios";

function Get_Candidate_Info(avatars_info, dices_dir, dices_cnt, select_mask){
    let limit_ = Math.pow(2, dices_cnt)
    for(let mask_ = 0; mask_ < limit_; mask_++){
        let bit_mask_partly = mask_.toString(2)
        bit_mask_partly = bit_mask_partly.padStart(dices_cnt, "0")

        let bit_mask = new Array(6).fill(false)

        let index_partly = 0
        for (let i = 0; i < 6; i++) {
            if(dices_dir[i] != null){
                bit_mask[i] = bit_mask_partly[index_partly] == "1" ? true : false 
                index_partly++
            }
            else {
                // bit_mask[i] = false
            }
        }

        console.log(bit_mask)

    }
}



Get_Candidate_Info(null, [0, 0, null, null, 0, 0], 4, null)






// let obj = {
//     stone_index : 0,
//     get "stone-power"() { return (++this.stone_index < 15 ? this.stone_index : this.stone_index = 0) },
//     // stone : this.stone_index
// //     get stone(){
// //         // console.log(this.stone_index)
// //         this.stone_index++
// //         if(this.stone_index > 15)
// //             this.stone_index = 0
// //         return this.stone_index
// //     }
// }

// for (let i = 0; i < 30; i++)
//     console.log(obj["stone-power"])

// let arr = [
//     { index : 0, weight : 999},{index : 1, weight : 50},{index : 2, weight : 400},{index : 3, weight : 850}
// ]

// arr.sort((lhs, rhs) => { return lhs.weight - rhs.weight })

// console.log(arr)

// console.log(Date.now().toString())

// let aaa = {val : 0}
// let bbb = aaa
// console.log(bbb)
// aaa = {val : 1}
// console.log(bbb)
// console.log(aaa)

// class Person{
//     constructor(cb){
//         this.name = "person"
//         // cb()
//         this.cb = cb
//     }

//     method(){
//         this.cb()
//     }
// }


// class Earth{
//     constructor(){
//         let person = new Person(() => { this.method() })
//         this.name = "earth"

//         person.method()
//         // console.log(person.method)
//     }



//     method(){
//         console.log(`[${this.name}] : Earth ~~`)
//     }

// }


// let earth = new Earth()


// const options_starttime = { hour: "2-digit", minute: "2-digit", hour12 : true };

// let d = new Date(Date.now())
// console.log(d.toLocaleTimeString("en-US", options_starttime))


// import { Command, Argument } from "commander";

// let work = new Command()

// // console.log(process.argv)

// function myParseInt(value){
//     console.log(value)

//     return parseInt(value)
// }

// // work.command('work')
// work.command('work')
//     // .addArgument(new Argument('<from>', 'integer argument', myParseInt))
//     // .addArgument(new Argument('[cnt]', 'integer argument', myParseInt).default(100, "count"))
//     .argument('<from>', 'integer argument', myParseInt)
//     .argument('[cnt]', 'integer argument', myParseInt, 500)
//     // .option('--first', 'display just the first substring')
//     // .option('-s, --separator <char>', 'separator character', ',')
//     .action((from, cnt) => {
//         // console.log(from, cnt)
//         // console.log(arguments)
//         console.log(typeof from)
//         console.log(typeof cnt)
//         console.log(`work the agent from ${from} to ${from + cnt}`)
//         // console.log(from, cnt)
//         // const limit = options.first ? 1 : undefined;
//         // console.log(str.split(options.separator, limit));
//     });


// work.command('create')
//     .argument('<cnt>', 'integer argument', parseInt)
//     // .option('--first', 'display just the first substring')
//     // .option('-s, --separator <char>', 'separator character', ',')
//     .action((cnt) => {
//         // console.log(arguments)
//         console.log(`create new ${cnt} dummies`)
//         // console.log(from, cnt)
//         // const limit = options.first ? 1 : undefined;
//         // console.log(str.split(options.separator, limit));
//     });



// let cmd = "node ddd.js work 700".split(' ')
// work.parse(cmd)
// console.log(ret)

// cmd = "node ddd.js create 100".split(' ')
// work.parse(cmd)
// console.log(ret)




// let arr = [0,1,2,3,4,5]

// function func(a,b,c,d,e,f,g,h){
//     console.log(a,b,c,d,e,f,g,h)
// }

// func(...arr)



// let i = 0
// console.log(typeof i === "number")


// import DummyLoader from "#dummy_loader"

// let loader = new DummyLoader()
// console.log(loader)
// loader.CreateDummy(10)
// console.log(loader.GetDummyInfo(0,10))

// let before = Date.now() - 35462548
// let now = Date.now()
// let diff = new Date(now - before)

// console.log(diff.getMinutes())

// import minimist from "minimist";

// let cmd = "create 100"
// cmd = cmd.split(" ")
// cmd = minimist(cmd)

// let act = cmd["_"][0]
// let args = cmd["_"].slice(1)

// delete args["_"]
// let option = args

// console.log(act, args)
// console.log(typeof args[0])

// let txt = `create 100 200 -i hello -j 5000 4000`.split(' ')

// let parsed = minimist(txt)

// let act = parsed["_"][0]
// let args = parsed["_"].slice(1)

// delete parsed["_"]
// let option = parsed

// // console.log(act)
// // console.log(args)
// // console.log(option)

// function func(a,b,c, option){
//     console.log(a)
//     console.log(b)
//     console.log(c)
//     console.log(option)
// }

// func(...args, option)


// class Person{
//     constructor(){
//         // this.Method()
//         this["Method"]()
//     }

//     Method(){console.log("hello world")}
// }

// let person = new Person()

// console.log(person)

// import { Command } from "commander";

// console.log("wow")


// let program = new Command();

// program.command("hello").action(()=>{console.log(arguments)})


// // import chalk from "chalk";

// // console.log(chalk.rgb(128,65,23)("hello world"))