import { createClient } from 'redis';


export default class Subscriber {
    constructor(channel_name) {
        this.Initialize(channel_name)
    }


    async Initialize(channel_name) {
        this.client = createClient({"url" : "redis://host.docker.internal:6379"});


        this.client.on('error', err => console.log('Redis Client Error', err));

        console.log("connect to redis DB")
        await this.client.connect();
        console.log("connected to redis DB")

        // await this.client.set('key', 'value');

        await this.client.subscribe(channel_name, (msg) => { this.Subscribe(msg) })

    }


    Subscribe(msg) {



    }





}