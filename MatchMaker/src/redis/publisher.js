import { createClient } from 'redis';


export default class Publisher {
    constructor() {
        this.Initialize()

    }


    async Initialize() {
        this.client = createClient({"url" : "redis://host.docker.internal:6379"});


        this.client.on('error', err => console.log('Redis Client Error', err));

        console.log("connect to redis DB")
        await this.client.connect();
        console.log("connected to redis DB")

        // await this.client.set('key', 'value');

    }


    async Publish(){

    }


    

    async Set(key, value){



    }


    async Get(key){
        let ret = await this.client.get(key)
        return ret
    }



    async Push(key, arr){
        await this.client.rPush(key, arr)
    }


    async Range(key, from, to){
        let ret = await this.client.lRange(key, from, to)
        return ret
    }


    async Del(key){
        await this.client.del(key)
    }


    UserDir(uid){
        return "/user/" + uid +"/"
    }

    async AddUser(uid, data){
        let key = this.UserDir(uid)
        await this.client.json.set(key, ".", data)
    }

    async SetUserProperty(uid, property, value){
        // let data_ = JSON.stringify(data)
        let key = this.UserDir(uid)
        await this.client.json.set(key, "." + property, value)
        // await this.client.set(key, data_)
    }


    async FindUser(uid){
        let key = this.UserDir(uid)
        let ret = await this.client.json.get(key)
        return ret
    }


    async DelUser(){
        let key = this.UserDir(uid)
        await this.client.json.del(key)
    }

}