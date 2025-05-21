import Layout_Element from "./Layout_Element.js";
import Table_Box from "./Table_Box.js";
import Prompt_Box from "./Prompt_Box.js";
import Command_Console from "./controller/Command_Console.js";

import { DataFormat } from "./callbacks/Table_Callback.js"

import blessed from "blessed"

import chalk from "chalk";

// import Command_Operation from "./controller/Command_Operation.js";

export default class Screen_Controller {
    constructor(cli) {
        this.cli = cli
        this.screen = blessed.screen({
            smartCSR: true,
            terminal: 'xterm-256color',
            autoPadding: true,
            cursor: {
                artificial: true,
                shape: 'line',
                blink: true   
            }
            // title : "my window title"
        });
        this.screen.title = "my window title"

        this.cAgent_index = 0
        this.cLauncher_index  = 0

        this.Initialize(cli)
        this.RegisterEvents()
        
        this.ShowAgents([])
        this.ShowLaunchers([])
        this.Render()



    }


    get display_game_table_cnt(){
        return 2
    }

    get display_game_limit_row(){
        return 25
    }



    get display_agent_table_cnt() {
        return 3
    }


    get display_agent_limit_row() {
        return 25
    }



    get display_launcher_table_cnt() {
        return 2
    }


    get display_launcher_limit_row() {
        return 25
    }



    get display_agent_cnt(){
        return this.display_agent_table_cnt * this.display_agent_limit_row
    }


    get agent_table_head() {
        return ["index", "state", "game_mode", "start_time", "play_time"]
    }


    get display_launcher_cnt(){
        return this.display_launcher_table_cnt * this.display_launcher_limit_row
    }


    get launcher_table_head(){
        return ["index", "state", "playout_cnt", "gameover_cnt", "start_time", "play_time"]
    }


    Initialize(cli) {
        // this.command_operation = new Command_Operation(this)

        this.layout_box = new Layout_Element(this.screen)

        this.agent_table_boxes = new Array(this.display_agent_table_cnt)
        // console.log(DataFormat("agent_table"))
        for (let i = 0; i < this.display_agent_table_cnt; i++) {
            this.agent_table_boxes[i] = new Table_Box(this.layout_box.instance, this.agent_table_head, this.display_agent_limit_row, DataFormat("agent_table"))
            this.agent_table_boxes[i].Hide()
        }


        this.launcher_table_boxes = new Array(this.display_launcher_table_cnt)
        // console.log(DataFormat("agent_table"))
        for (let i = 0; i < this.display_launcher_table_cnt; i++) {
            this.launcher_table_boxes[i] = new Table_Box(this.layout_box.instance, this.launcher_table_head, this.display_launcher_limit_row, DataFormat("launcher_table"))
        }


        this.command_console = new Command_Console(this.layout_box.instance, this, cli)

        this.screen.key('j', ()=>{
            
            // this.tmp_box.cancel()
        })

        // this.__Test__()
    }


    // CommandSubmit(cmd){
    //     let ret = this.command_operation.CommandSubmit(cmd)

    //     this.command_console.Print(ret)


    //     this.Render()
    // }

    ShowStatus(info){
        this.command_console.ShowAgentInfo(info)
    }

    RegisterEvents() {

        // exit
        this.screen.key(['C-q'], function (ch, key) {
            return process.exit(0);
        });

        
        // console input
        this.screen.key('i', () => {
            this.command_console.Input.readInput();
        });

        // refresh
        this.screen.key('r', () => {
            // agent 테이블 정보를 새로고침한다
            // this.command_console.Input.readInput();
            this.cli.show_(this.cAgent_index)

        });

        // next page
        this.screen.key('w', () => {
            this.cli.show_(this.cAgent_index + this.display_agent_cnt)
            
        });

        // prev page
        this.screen.key('q', () => {
            this.cli.show_(this.cAgent_index - this.display_agent_cnt)
            
        });


        this.screen.key('1', () => {
            this.view_agent()
        });

        this.screen.key('2', () => {
            this.view_ai()
        });


    }


    view_agent(){
        for (let i = 0; i < this.display_agent_table_cnt; i++) {
            this.agent_table_boxes[i].Show()
        }

        // console.log(DataFormat("agent_table"))
        for (let i = 0; i < this.display_launcher_table_cnt; i++) {
            this.launcher_table_boxes[i].Hide()
        }
    }


    view_ai(){
        for (let i = 0; i < this.display_agent_table_cnt; i++) {
            this.agent_table_boxes[i].Hide()
        }

        // console.log(DataFormat("agent_table"))
        for (let i = 0; i < this.display_launcher_table_cnt; i++) {
            this.launcher_table_boxes[i].Show()
        }


    }



    Render() {
        this.screen.render()
    }


    Print(txt){
        this.command_console.Print(txt)
    }




    ShowLaunchers(launchers_data){

        for (let i = 0; i < this.display_launcher_table_cnt; i++) {

            let from = this.display_launcher_limit_row * i;
            let to = this.display_launcher_limit_row * (i + 1)

            let sliced_data = launchers_data.slice(from, to)
            this.launcher_table_boxes[i].ShowTable(sliced_data)

        }

        if (launchers_data.length > 0)
            this.cLauncher_index = launchers_data[0][0]


        this.Render()

    }

    // agents_data = [[this.uid, this.state, start_time_parsed, play_time_parsed], ...]
    ShowAgents(agents_data){
        // let formatted_data = (agents_data[0])
        // console.log(formatted_data)

        for (let i = 0; i < this.display_agent_table_cnt; i++) {

            let from = this.display_agent_limit_row * i;
            let to = this.display_agent_limit_row * (i + 1)

            let sliced_data = agents_data.slice(from, to)
            this.agent_table_boxes[i].ShowTable(sliced_data)

        }

        if (agents_data.length > 0)
            this.cAgent_index = agents_data[0][0]

        // this.agent_table_boxes[0].ShowTable(agents_data[0])
        // this.agent_table_boxes[1].ShowTable(agents_data[1])
        // this.agent_table_boxes[2].ShowTable(agents_data[2])

        this.Render()
    }


    RunAgents(index, cnt){
        // index : -1 => 현재 페이지의 시작인덱스
        // cnt : -1 => 현재 페이지에서 보이는 갯수

        if(index == -1)
            index = this.cAgent_index

        if(cnt == -1)
            cnt = this.display_agent_cnt

        
        return [index, cnt]

        // this.Print(`[[ run (${index}, ${cnt}) ]]`)
        // let registered_cnt = this.

    }


    clear(){
        this.command_console.Clear()
    }

    


    refresh_(){

    }

}