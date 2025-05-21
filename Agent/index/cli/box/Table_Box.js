
import chalk from "chalk";
import boxen from "boxen";
import blessed from "blessed"
import { table } from 'table';

const config = {
    // borderColor : "gray",
    border: {
        topBody: `═`,
        topJoin: `╤`,
        topLeft: `╔`,
        topRight: `╗`,

        bottomBody: `═`,
        bottomJoin: `╧`,
        bottomLeft: `╚`,
        bottomRight: `╝`,

        bodyLeft: `║`,
        bodyRight: `║`,
        bodyJoin: `│`,

        joinBody: `─`,
        joinLeft: `╟`,
        joinRight: `╢`,
        joinJoin: `┼`
    },
    columnDefault: {
        //   width: 1,
        paddingLeft: 1,
        paddingRight: 1,
        alignment: "center",
        verticalAlignment: 'middle'
    },
    columns: [
        // { alignment: 'center' },
        // { alignment: 'center' },
        // { alignment: 'center' },
    ],
};

const border_color = "#454545"
let border_keys = Object.keys(config.border)
border_keys.forEach(key => {
    let border = config.border[`${key}`]
    config.border[`${key}`] = `{${border_color}-fg}` + border + "{/}"
})



export default class Table_Box {
    constructor(layout, table_head, row_limit, data_format_callback) {
        this.table_head = table_head
        this.table_limit_row = row_limit
        this.DataFormat = data_format_callback

        
        this.table_data = new Array(this.table_limit_row + 1)
        this.table_data[0] = this.table_head

        // console.log(this.table_data)

        this.Initialize(layout)

        // for(let i=0; i<this.display_agent_table_cnt; i++){
        //     this.agents_data[i] = new Array(this.display_agent_limit_row + 1)
        //     this.agents_data[i][0] = this.table_head
        // }

    }

    

    // get display_agent_limit_cnt(){
    //     return this.display_agent_limit_row * this.display_agent_table_cnt
    // }


    Initialize(layout) {

        this.instance = blessed.box({
            parent: layout,
            top: 0,
            left: 0,
            // width: "shrink",
            // height: 'shrink',
            // clickable: true,
            // content: `${chalk.red('Hello world!')}Hello {bold}world{/bold}!`,
            // content: table(data, config),
            tags: true,
            border: {
                // type: 'line'
            },
            style: {
                // fg: 'white',
                // bg: 'magenta',
                border: {
                    // fg: '#454545'
                },
                // hover: {
                // bg: 'green'
                // }
            }
        })

        // let data___ = table(this.agents_data, config)
        // this.instance.setContent(data___)


        // for(let i=0; i<3; i++){
        // this.box.add(agents_table)
        // this.box.setContent("hello")
        // }



        // this.box.setData(data)

        // screen.append(this.layout)
        // this.Focus()
    }


    ShowTable(data) {
        // for (let table_index = 0; table_index < this.display_agent_table_cnt; table_index++) {


        this.table_data = this.DataFormat(data)

        // console.log(data)
        // console.log("hello\n\n\n\n\n\n\n")

        // console.log(this.table_data)
        
        // console.log(table(this.agents_data[table_index]))


        // console.log(table(this.agents_data[0], config))

        // this.agent_tables.forEach((table_, index) => {
        //     // console.log(table(this.agents_data[index], config))
        let table__ = table(this.table_data, config)
        // console.log(table__)
        this.instance.setContent(table__)
        // })

    }



    Hide(){
        this.instance.hide()
    }


    Show(){
        this.instance.show()
    }


    Focus() {
        // this.layout.focus();
    }

    RegisterEvents() {

        // box.key('enter', function (ch, key) {
        //     box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
        //     box.setLine(1, 'bar');
        //     box.insertLine(1, 'foo');
        //     screen.render();
        // });
    }
}

