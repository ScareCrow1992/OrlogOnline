
import blessed from "blessed"
import Command_Operation from "./Command_Operation.js"
import { table } from "table"
import { table_config } from "#cli_utils"

export default class Command_Console{
    constructor(layout, screen, cli){

        this.screen = screen
        this.command_operation = new Command_Operation(screen, this, cli)


        this.Initialize_Wrapper(layout)
        this.Initialize_StatusConsole()
        this.Initialize_OutputConsole()
        this.Initialize_InputConsole()

    }


    get Status(){
        return this.status_console
    }

    get Input(){
        return this.input_console
    }


    get Output(){
        return this.output_console
    }


    Initialize_Wrapper(layout){
        this.wrapper_container = blessed.box({
            parent: layout,
            // top: 0,
            // left: 0,
            // cursor: 'line',
            // cursorBlink: true,
            // screenKeys: false,
            right : 0,
            width: 'shrink',
            height: "100%",
            tags: true,
            border: {
                // type: 'line'
            },
            style: {
                // fg: 'white',
                // bg: 'yellow',
                border: {
                    // fg: '#454545'
                },
                // hover: {
                // bg: 'green'
                // }
            },
            value : ">> ",
            // action : ()=>{console.log(arguments)}
        })
    }


    Initialize_StatusConsole(){
        this.status_console = blessed.box({
            parent: this.wrapper_container,
            top: 0,
            left: 0,
            // cursor: 'line',
            // cursorBlink: true,
            // screenKeys: false,
            // right : 0,
            width: "100%",
            height: "70%",
            padding : {left : 1, right : 1},
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                // fg: 'white',
                // bg: '#222222',
                border: {
                    fg: '#454545'
                },
                // hover: {
                // bg: 'green'
                // }
            }
        })
    }


    Initialize_OutputConsole(){
        this.output_console = blessed.textarea({
            parent: this.wrapper_container,
            top: "66%",
            left: 0,
            // cursor: 'line',
            // cursorBlink: true,
            // screenKeys: false,
            // right : 0,
            width: "100%",
            height: "25%",
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                // fg: 'white',
                bg: '#004400',
                border: {
                    fg: '#454545'
                },
                // hover: {
                // bg: 'green'
                // }
            }
            // action : ()=>{console.log(arguments)}
        })

    }


    Initialize_InputConsole(){
        this.input_console = blessed.textbox({
            parent: this.wrapper_container,
            top: "88%",
            left: 0,
            // cursor: 'line',
            // cursorBlink: true,
            // screenKeys: false,
            // top:"60%",
            // right : 0,
            // valign : "middle",
            // cursor : "block",
            // cursor : {color : 'red'},
            width: '100%',
            height: "10%",
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                // fg: 'white',
                bg: '#000088',
                border: {
                    fg: '#454545'
                },
                // hover: {
                // bg: 'green'
                // }
            },
            padding: { left: 5, right: 0, top : 1, bottom : 0 }
            // content:">> "
            // value : ">> ",
            // action : ()=>{console.log(arguments)}
        })

        // this.input_console.cursorReset()
        

        let shell_symbol = blessed.box({
            parent: this.input_console,
            top:"-12%",
            left: -3,
            // valign: "middle",
            width: 'shrink',
            height: "24%",
            padding: { left: 0, right: 0, top : 0, bottom : 0  },
            style: { transparent: false, bg: '#000088' },
            // border: {
            //     type: 'line'
            // },
            content: ">> "
        })


        
        this.input_console.on('submit', ()=>{

            let txt = this.input_console.getValue()

            this.CommandSubmit(txt)


        })

    }

    ShowAgentInfo(info){
        /*
        info = {
            agents : 총 에이전트숫자,
            idle :
            waiting : 
            playing : ,
            total : 총 플레이 횟수
        }
        */
        let keys = Object.keys(info)
        let table_data = new Array(keys.length)
        for (let i = 0; i < table_data.length;) {
            table_data[i] = [keys[i], info[`${keys[i]}`]]
            i++
        }

        // let table_data = [[1,2],[3,4],[5,6]]

        this.status_console.setContent(table(table_data, table_config))
            
        this.screen.Render()

    }


    Print(txt){
        // let keys = Object.keys(txt)

        // keys.forEach(key=>{
        //     let dat = txt[`${key}`]
        //     this.output_console.setValue( this.output_console.getValue() + "\n " + key + ":" + dat)
        // })

        this.output_console.setValue( this.output_console.getValue() + "\n " + txt)

        this.screen.Render()

    }

    Clear(){
        // this.Print("[[ Clear ]]")
        this.output_console.clearValue()
        this.screen.Render()

    }

    CommandSubmit(txt){
        this.output_console.setValue( this.output_console.getValue() + "\n >> " + txt)
        // this.output_console.add("\n >> " + txt)
        this.input_console.clearValue()
        // this.input_console.setValue(">> ")
        this.Input.readInput()

        this.command_operation.Command(txt)

        // this.screen.CommandSubmit(txt)
    }


}



