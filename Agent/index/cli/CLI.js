// import { createInterface } from "readline"

// import { program, Command } from "commander";
import chalk from "chalk";
import boxen from "boxen";
import inquirer from "inquirer";
import path from "path";
const __dirname = path.resolve();
import Table_Box from "./box/Table_Box.js";
import * as Test from "#test_utils"

import Screen_Controller from "./box/Screen_Controller.js";
import DummyLoader from "#dummy_loader"
import { Random } from "random-js";


import Redis_Adapter from "redis-bird"

import server_config from "../server_config.js";

import GodFavorStats from "../../Game/Data/godFavorStats.js"

global.GodFavorStats = GodFavorStats
global.godFavorIndexDict = Object.keys(GodFavorStats) 
global.server_config = server_config


const random = new Random();
const cluster_cnt = 18
const game_cnt = 50

// import { table } from 'table';


// var blessed = require('blessed');
// var chalk = require('chalk');

function Create_Test_Data(){

}


const game_modes = ["constant", "liberty", "draft"]

class CLI {
    constructor() {

        this.simulating_ai = new Set()

        this.ai_mode = "training"
        this.ai_auto = false
        this.ai_ver = null

        this.instance_index = 0
        this.training_cnt = 0

        setTimeout(() => {
            this.ai_loadmodel_(60)
            this.ai_loadmodel_new_(60)
            // this.ai_ver = 0

            setTimeout(() => { this.ai_auto_() }, 3000)
        }, 4000)

    }

    get dummies_cnt(){
        return this.dummy_loader.dummies_cnt
    }


    Transport(func, args){


        switch(func){
            case "simulation_end":
                this.simulation_end(...args)
                break

            case "training_end":
                this.training_end(...args)
                break
        }



    }


    Initialise(){
        this.screen = new Screen_Controller(this)
        this.dummy_loader = new DummyLoader()

        this.interval_auto_work = null

        // this.agent_tables_box = new Table_Box(this.screen)
        // console.log(box.display_agent_limit_cnt)

        global.print_console = (txt) => { this.Print(txt) }

    }


    Print(txt){
        this.screen.Print(txt)
    }



    Test_show_agents_table(){
        let agent_cnt = this.screen.display_agent_cnt

        let test_agent_data = Test.AgentTableDatas(agent_cnt)
        // console.log(test_agent_data)
        this.screen.ShowAgents(test_agent_data)


        // this.Render()
    }



    // 특정 index를 시작점으로 하여 테이블들을 살펴본다
    ViewIndex(agent_index){

    }


    //
    ViewFilter(){

    }

    // 
    ViewSort(){

    }


    auto_(total, interval_cnt, option){
        this.Print(`[auto] total : ${total}, interval : ${interval_cnt}`)
        // this.Print(`[auto] from : ${option["f"]}, cnt : ${option["c"]}`)

        // let index = option["f"]
        // let cnt = option["c"]

        if(this.interval_auto_work == null){
            this.interval_auto_work = setInterval(()=>{
                let loader_info = this.dummy_loader.loader_info

                let nonIdle_cnt = loader_info["total"] - loader_info["idle"]

                let extra_cnt = total - nonIdle_cnt
                let cnt = Math.min(extra_cnt, interval_cnt)
                cnt = Math.max(0, cnt)

                let game_mode = game_modes[random.integer(0, 2)]

                this.Print(`[auto] cnt : ${cnt}, mode : ${game_mode}`)
                this.run_(0, cnt, {m : game_mode})


            }, 5000)
        }
    }


    release_(){
        if(this.interval_auto_work != null){
            clearInterval(this.interval_auto_work)
            this.interval_auto_work = null
        }

    }




    clear_() {
        this.screen.clear()
    }


    // 에이전트 생성
    create_(cnt) {
        this.dummy_loader.CreateDummy(cnt)
    }


    simulation_end(ai_index){

        let sender = `ai-${ai_index}`

        if(this.simulating_ai.has(sender)){
            this.simulating_ai.delete(sender)
            this.Print(`simulation end = ${sender} (  ${this.simulating_ai.size} / ${cluster_cnt} ) `)
        }

        if (this.simulating_ai.size == 0) {
            this.Print("<< simulation clear ! >>")

            if (this.ai_auto == true){
                if(this.ai_mode == "training")
                    this.ai_auto_loop_after_simulation()
                else if(this.ai_mode == "test")
                    this.ai_auto_loop_after_compare()
            }
        }



    }

    async ai_auto_(){
        this.ai_auto = true

        this.ai_auto_loop_before_simulation()

    }

    async ai_auto_loop_before_simulation() {
        // 0) ai_creategame <game cnt>

        this.ai_setmode_("training")

        await new Promise((res)=>{setTimeout(()=>{res(true)}, 4000)})

        this.ai_creategame_(game_cnt)
    }



    async training_end(){

        if (this.ai_auto == true)
            this.ai_auto_loop_after_training()
    }



    async ai_auto_loop_after_simulation() {
        let ver = this.ai_ver

        await new Promise((res)=>{setTimeout(()=>{res(true)}, 4000)})


        // 1) ai_savelogs <ver>
        await this.ai_savelogs_(ver + 1, null)

        
        await new Promise((res) => { setTimeout(() => { res(true) }, 4000) })

        // this.instance_index++

        this.training_cnt++


        await this.ai_training_(cluster_cnt, ver + 1)



        // if(this.instance_index == 1){
        //     this.instance_index = 0


        //     // 2) ai_training <cluster cnt> <ver>
        //     await this.ai_training_(26, ver + 1)
        // }
        // else{
        //     this.ai_auto_loop_before_simulation()

        // }
    }



    async ai_auto_loop_before_compare(){

        this.ai_setmode_("test")

        await new Promise((res)=>{setTimeout(()=>{res(true)}, 4000)})


        this.ai_creategame_(30)
    }



    
    async ai_auto_loop_after_compare(){

        let rets = await this.ai_compare_()

        let total_cnt = rets[0] + rets[1]
        let win_cnt = rets[1]

        let result = undefined

        if(win_cnt > total_cnt * 0.575)
            result = true
        else
            result = false

        console.log()
        console.log("total : ", total_cnt)
        console.log("win : ", win_cnt, `( > ${total_cnt * 0.575} )`)

        // result = false

        if(result == true){
            // 신버전이 구버전을 이김
            // 버전 패치 진행
            let ver = this.ai_ver

            if (this.ai_ver == null) {
                this.ai_ver = 0
            }
            else {
                // this.ai_ver++
            }

            await this.ai_loadmodel_(ver + 1)

        }


        await new Promise((res) => { setTimeout(() => { res(true) }, 4000) })


        if (this.ai_auto == true)
            this.ai_auto_loop_before_simulation()

    }




    async ai_auto_loop_after_training() {

        let ver = this.ai_ver

        await this.ai_savemodel_(ver + 1)
        await new Promise((res) => { setTimeout(() => { res(true) }, 4000) })


        if (this.training_cnt > 3) {
            this.training_cnt = 0
            await this.ai_loadmodel_new_(ver + 1)

            await new Promise((res) => { setTimeout(() => { res(true) }, 4000) })

            if (this.ai_auto == true) {
                // 현재 버전과 신버전 모델들의 자체 대국을 실시한다
                this.ai_auto_loop_before_compare()
            }
        }
        else {
            this.ai_auto_loop_before_simulation()
        }

    }


    async ai_training_(cnt, ver) {
        let msg = {
            func : "training",
            args : [cnt, ver]
        }

        global.Redis_Adapter._Notify("ai-0", msg)
    }


    async ai_loadmodel_(ver_){
        this.ai_ver = ver_

        let msg = {
            func : "loadmodel",
            args : [ver_, 0]
        }

        await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

    }

    
    async ai_loadmodel_new_(ver_){

        let msg = {
            func : "loadmodel",
            args : [ver_, 1]
        }

        await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)
    }


    async ai_savemodel_(ver_){
        let msg = {
            func : "savemodel",
            args : [ver_]
        }

        global.Redis_Adapter._Notify("ai-0", msg)
    }


    async ai_setmode_(mode_){
        this.ai_mode = mode_
        let msg = {
            func : "setmode",
            args : [mode_]
        }

        global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

    }


    async ai_compare_(){
        let msg = {
            func : "compare",
            args : []
        }

        let resolves = await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

        let results = [0, 0]

        resolves.forEach(res=>{

            results[0] += res.args[0][0]
            results[1] += res.args[0][1]

        })
        let txt_ = JSON.stringify(results)

        
        this.Print(txt_)

        return results

    }




    async ai_savelogs_(ver_, instance_index_){
        let msg = {
            func : "savelogs",
            args : [ver_, instance_index_]
        }

        await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)
    }


    async ai_info_(){
        let msg = {
            func : "info",
            args : []
        }


        let resolves = await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

        // let ai_infos = new Array(50).fill(null)
        let ai_infos = []

        resolves.forEach((res, index) => {
            // ai_infos[index] = res.args[0]
            if(res.func !== "__ERROR__")
                ai_infos.push(res.args[0])
        })

        // global.print_console(Array.isArray(ai_infos))

        this.screen.ShowLaunchers(ai_infos)
    }


    async ai_ping_(){
        // 모든 런처들에게 broadcast를 전송하여 화면을 reset한다

        let msg = {
            func : "ping",
            args : []
        }

        let resolves = await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

        let ai_channels = []

        resolves.forEach(res=>{
            ai_channels.push(res.sender)
        })
        
        global.print_console(ai_channels)

    }


    async ai_createstream_(ver){
        let msg = {
            func : "createstream",
            args : [ver]
        }

        await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)


    }


    async ai_creategame_(cnt){
        let msg = {
            func : "creategame",
            args : [cnt]
        }

        let resolves = await global.Redis_Adapter._Broadcast_Request("ai", msg, 10000)

        let ai_channels = []

        resolves.forEach(res=>{
            if(res.func !== "__ERROR__"){
                // ai_channels.push(res.sender)

                this.simulating_ai.add(res.sender)
            }
        })
        
        // global.print_console(ai_channels)


    }


    show_(from) {
        if (typeof from !== "number")
            return;

        let cnt = this.screen.display_agent_cnt

        let infos = this.dummy_loader.GetDummyInfo(from, cnt)
        this.screen.ShowAgents(infos)
        this.info()
    }

    work_(from, cnt){

    }


    info(){
        let info = this.dummy_loader.loader_info
        this.screen.ShowStatus(info)
    }


    run_(index, cnt, option){
        [index, cnt] = this.screen.RunAgents(index, cnt)

        let game_mode = option["m"]

        // console.log(option)
        // let keys = Object.keys(option)

        // this.Print(`[[ run (${index}, ${cnt}) ]]`)

        let registered_cnt = this.dummy_loader.WorkLoad(index, cnt, game_mode)
        this.Print(`[run] (${index}, ${registered_cnt}) , ${game_mode}`)

    }

}

let cli = new CLI()

// global.Redis_Adapter = new Redis_Adapter("redis://host.docker.internal:6379", onMessage, "cli-0", "cli")

global.Redis_Adapter = new Redis_Adapter("redis://localhost:6379", onMessage, "cli-0", "cli")
global.Redis_Adapter.ready.then(()=>{
    cli.Initialise()
})



function onMessage (channel_name, type, func, args, sender, id) {
    // console.log(arguments)

    let ret = cli.Transport(func, args)
    
    if(type == "request"){
        ret.then(res=>{
            let msg = {
                func: func,
                args: [res],
                id: id
            }
    
            this._Response(sender, msg)
    
        })
    }

    
}





// cli.Test_show_agents_table()



// console.log(table(Test.AgentTableDatas(4,25)[0]))




// Create a screen object.

// Create a box perfectly centered horizontally and vertically.


// Append our box to the screen.
// screen.append(box);

// Add a png icon to the box
// var icon = blessed.image({
//     parent: box,
//     top: 0,
//     left: 0,
//     type: 'overlay',
//     width: 'shrink',
//     height: 'shrink',
//     file: __dirname + '/my-program-icon.png',
//     search: false
// });

// // If our box is clicked, change the content.
// box.on('click', function (data) {
//     box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
//     screen.render();
// });

// If box is focused, handle `enter`/`return` and give us some more content.

// Quit on Escape, q, or Control-C.

// Focus our element.

// Render the screen.


// class CLI{
//     constructor(){
//         this.readline = createInterface({
//             input: process.stdin,
//             output: process.stdout,
//         })
//     }


//     Question(){
//         this.readline.question(`What's your name?`, name => {
//             console.log(`Hi ${name}!`);
//             this.readline.close();
//         });
//     }

// }


