import RedisAdapter from "redis-bird"
import { Random } from "random-js";

const random = new Random()

export default class TaskScheduler{
    constructor(delayed_time = 100){
        this.timer = delayed_time


        let redis_url = `redis://${process.env.REDIS}`

        this.redis_adapter = new RedisAdapter(redis_url, (channel_name, msg) => {
            // console.log(`[ ${channel_name} ] ${msg}`)
        }, "taskscheduler-0", "taskscheduler")


        // this.redis_adapter = new RedisAdapter()

        this.Loop()
    }


    async Loop(){
        while(true){
            await new Promise(res => setTimeout(res, this.timer))
            await this.Check_TaskQueue()

        }
    }



    async Check_TaskQueue(){
        // let current_time = Date.now()
        let tasks = await this.redis_adapter.Get_TaskRange(Date.now())

        tasks.forEach(task => {
            // console.log(`[task]`)
            // console.log(task)
            this._Task(task.func, task.args)
        })
        // zrangebyscore(current_time, +inf)
    }





    async _Task(func, args){
        this.redis_adapter[`${func}`](...args)
    }





}