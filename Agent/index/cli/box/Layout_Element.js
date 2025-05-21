
import blessed from "blessed"


export default class Layout_Element{
    constructor(screen){
        this.Initialize(screen)

        // this.agents_tables = new Array(this.display_agent_table_cnt)
        // this.agents_tables.forEach(agent_table=>{
        //     agent_table = new AgentTable_Box(this.instance)
        // })
    }

    // get display_agent_table_cnt(){
    //     return 3
    // }

    Initialize(screen) {
        this.instance = blessed.layout({
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            clickable: true,
            shrink : true,
            // content: `${chalk.red('Hello world!')}Hello {bold}world{/bold}!`,
            // content: table(data, config),
            tags: true,
            layout: "inline",
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
        });

        screen.append(this.instance)
    }




}