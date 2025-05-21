
import { State_Serialize } from "../GameLearning/Util/utils.js"
import fs from "fs"

const ROLL = 0, GODFAVOR = 1

export default class FileManager {
    constructor() {


        

    }



    Create_Write_Stream(ver, instance_index){

        // let dir = `./tf_datas/instance_${instance_index}/${ver}`
        let dir = `./tf_datas/instance_${global.cluster_index}/${ver}`


        if (!fs.existsSync(`./tf_datas/instance_${global.cluster_index}`)){
            fs.mkdirSync(`./tf_datas/instance_${global.cluster_index}`);
        }

        
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        

        if(this.f_roll_state){
            console.log("close write stream")

            this.f_roll_state.close()
            this.f_roll_action.close()
            this.f_roll_value.close()
            this.f_roll_result.close()
            this.f_roll_mask.close()
    
            this.f_godfavor_state.close()
            this.f_godfavor_action.close()
            this.f_godfavor_value.close()
            this.f_godfavor_result.close()
            this.f_godfavor_mask.close()

        }


        this.f_roll_state = fs.createWriteStream(`${dir}/roll_state.txt`)
        this.f_roll_action = fs.createWriteStream(`${dir}/roll_action.txt`)
        this.f_roll_value = fs.createWriteStream(`${dir}/roll_value.txt`)
        this.f_roll_result = fs.createWriteStream(`${dir}/roll_result.txt`)
        this.f_roll_mask = fs.createWriteStream(`${dir}/roll_mask.txt`)

        this.f_godfavor_state = fs.createWriteStream(`${dir}/godfavor_state.txt`)
        this.f_godfavor_action = fs.createWriteStream(`${dir}/godfavor_action.txt`)
        this.f_godfavor_value = fs.createWriteStream(`${dir}/godfavor_value.txt`)
        this.f_godfavor_result = fs.createWriteStream(`${dir}/godfavor_result.txt`)
        this.f_godfavor_mask = fs.createWriteStream(`${dir}/godfavor_mask.txt`)

        
        this.f_streams = [this.f_roll_state, this.f_roll_action, this.f_roll_value, this.f_roll_result, this.f_roll_mask, this.f_godfavor_state, this.f_godfavor_action, this.f_godfavor_value, this.f_godfavor_result, this.f_godfavor_mask]

    }


    _Read_Log_(cluster_index, ver, train_datas) {
        if(global.cluster_index != 0)
            return

        let dir = `./tf_datas/instance_${cluster_index}/${ver}`

        let read_streams = [
            fs.readFileSync(`${dir}/roll_state.txt`, "utf-8"),
            fs.readFileSync(`${dir}/roll_action.txt`, "utf-8"),
            fs.readFileSync(`${dir}/roll_value.txt`, "utf-8"),
            fs.readFileSync(`${dir}/roll_result.txt`, "utf-8"),
            fs.readFileSync(`${dir}/roll_mask.txt`, "utf-8"),
            fs.readFileSync(`${dir}/godfavor_state.txt`, "utf-8"),
            fs.readFileSync(`${dir}/godfavor_action.txt`, "utf-8"),
            fs.readFileSync(`${dir}/godfavor_value.txt`, "utf-8"),
            fs.readFileSync(`${dir}/godfavor_result.txt`, "utf-8"),
            fs.readFileSync(`${dir}/godfavor_mask.txt`, "utf-8"),
        ]

        read_streams.forEach((stream_, index_)=>{
            let data_ = JSON.parse(stream_)
            train_datas[index_].push(...data_)
        })


        // setTimeout(()=>{
        //     read_streams.forEach(rs=>{
        //         rs.close()
        //     })

        // }, 30000)

    }


    Read_Logs(cluster_cnt, ver){
        if(global.cluster_index != 0)
            return

            
        let roll_states = [], roll_actions = [], roll_values=[], roll_results = [], roll_mask = [], godfavor_states = [], godfavor_actions = [], godfavor_values = [], godfavor_results = [], godfavor_mask = []

        let train_datas = [roll_states, roll_actions, roll_values, roll_results, roll_mask, godfavor_states, godfavor_actions, godfavor_values, godfavor_results, godfavor_mask]


        for(let cluster_index = 0; cluster_index < cluster_cnt; cluster_index++){
            this._Read_Log_(cluster_index, ver, train_datas)
        }


        // console.log(roll_states.length)

        let agent_cnt = roll_states.length

        // for (let i = 0; i < agent_cnt; i++) {

        //     console.log("\n========================\n")

        //     console.log(roll_states[i].length)
        //     console.log(roll_actions[i].length)
        //     console.log(roll_results[i].length)
        //     console.log(godfavor_states[i].length)
        //     console.log(godfavor_actions[i].length)
        //     console.log(godfavor_results[i].length)
        // }

        return [
            { states: roll_states, actions: roll_actions, values: roll_values, results: roll_results, mask : roll_mask },
            { states: godfavor_states, actions: godfavor_actions, values: godfavor_values, results: godfavor_results, mask : godfavor_mask },
            agent_cnt
        ]
    }



    Write_Logs(agents, url, instance_index){
        this.Create_Write_Stream(url, instance_index)

        this.f_streams.forEach(f_stream => { f_stream.write("[") })


        let roll_state, roll_action, roll_values, roll_mask, godfavor_state, godfavor_action, godfavor_values, godfavor_mask
        let result = undefined

        let game_cnt = agents.length
        for (let game_index = 0; game_index < game_cnt; game_index++) {

            let agents_ = agents[game_index]

            if(agents_[0].index != 0){
                let tmp = agents_[1]
                agents_[1] = agents_[0]
                agents_[0] = tmp
                console.log("agents swap !!")
            }

            for (let agent_index = 0; agent_index < 2; agent_index++) {

                let agent = agents_[agent_index]
                let logs = agent.logs

                roll_state = logs.roll.state
                roll_action = logs.roll.action
                roll_values = logs.roll.value
                roll_mask = logs.roll.mask
    
                godfavor_state = logs.godfavor.state
                godfavor_action = logs.godfavor.action
                godfavor_values = logs.godfavor.value
                godfavor_mask = logs.godfavor.mask

    
                result = agent.win == true ? 1.0 : -1.0
                // console.log(agent_index, agent.win , result)
    
                this._Write_Logs_(roll_state, roll_action, roll_values, result, roll_mask, ROLL)
                this._Write_Logs_(godfavor_state, godfavor_action, godfavor_values, result, godfavor_mask, GODFAVOR)

                if (game_index != game_cnt - 1 || agent_index != 1) {
                    this.f_streams.forEach(f_stream => { f_stream.write(",") })
                }
            }
        }
        this.f_streams.forEach(f_stream => { f_stream.write("]") })
    }


    _Write_Logs_(states, actions, values, score, mask, phase) {
        let f_state, f_action, f_value, f_result, f_mask

        if(phase == ROLL){
            f_state = this.f_roll_state
            f_action = this.f_roll_action
            f_value = this.f_roll_value
            f_result = this.f_roll_result
            f_mask = this.f_roll_mask

        }
        else if(phase == GODFAVOR){
            f_state = this.f_godfavor_state
            f_action = this.f_godfavor_action
            f_value = this.f_godfavor_value
            f_result = this.f_godfavor_result
            f_mask = this.f_godfavor_mask

        }
        

        let log_length = states.length

        let state_, action_, value_, mask_

        f_state.write("[")
        f_action.write("[")
        f_value.write("[")
        f_result.write("[")
        f_mask.write("[")


        for (let log_index = 0; log_index < log_length; log_index++) {
            state_ = states[log_index]
            action_ = actions[log_index]
            value_ =  values[log_index]
            mask_ = mask[log_index]


            f_state.write(JSON.stringify(State_Serialize(state_)))

            f_action.write("[")
            f_action.write(action_.toString())
            f_action.write("]")

            f_mask.write("[")
            f_mask.write(mask_.toString())
            f_mask.write("]")


            f_value.write(value_.toString())

            // f_result.write("[")
            f_result.write(score.toString())
            // f_result.write("]")

            // this.w_godfavor_state.write(",")
            if (log_index != log_length - 1) {

                f_state.write(",")
                f_action.write(",")
                f_value.write(",")
                f_result.write(",")
                f_mask.write(",")

            }

            
        }

        // console.log("\n================\n")

        f_state.write("]")
        f_action.write("]")
        f_value.write("]")
        f_result.write("]")
        f_mask.write("]")
        
    }



}
