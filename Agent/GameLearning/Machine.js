import { Parse_Action, Random_Predict, Dir_2_DicesInfo, State_Modify_4_Predict, Create_Action_Mask, State_Serialize, Create_Initial_State } from "./Util/utils.js"
import Playout_Node from "./Playout/Playout_Node.js"

import { Random } from "random-js"

// phase
const ROLL = 0
const GODFAVOR = 1

// mode
const TRAINING = 0
const TEST = 1

const random_ = new Random()

// playout 시뮬레이션용 머신
export default class Machine{
    constructor(model_version, batch_generator, batch_generator_new, roll_model, godfavor_model, roll_model_new, godfavor_model_new){


        this.model_version_ = model_version
        // this.model_version_ = null
        // this.model_version_ = 99

        this.batch_generator = batch_generator
        this.batch_generator_new = batch_generator_new

        this.roll_model = roll_model
        this.godfavor_model = godfavor_model


        this.roll_model_new = roll_model_new
        this.godfavor_model_new = godfavor_model_new


        this.set_predict_limit = 0


        this.acc = 0

        this.mode_ = TRAINING

    }



    

    Set_Mode_Training(){
        this.mode_ = TRAINING
    }


    Set_Mode_Test(){
        this.mode_ = TEST

    }



    Set_GameCnt(game_cnt){

        this.set_predict_limit = 2 * game_cnt - 8

    }


    // async Check_ModelVersion(){
    //     let ret = await global.Redis_Adapter.AI_Request_Version()

    //     return ret.data
    // }



    // async Training(training_index){
            
    //     let state_ = Create_Initial_State()
    //     let dirs_ = ["right", "left", "top", "bottom", "front", "back"]

    //     let life = 11
    //     let agent_index = 0


    //     return await this.Playout(state_, dirs_, life, agent_index, training_index)


    // }



    async Playout(state_, rolled_dices, node_life, agent_index, playout_index, action_size){
        // let version_ = await this.Check_ModelVersion()

        // console.log(agent_index, state_.avatar.godFavors)

        // this.model_version_ = version_
        // this.model_version_ = "000"

        // console.log("mode : ", this.mode_ == TRAINING ? "training" : "test")
        // console.log("action size : ", action_size)
        // console.log("\n~~~~~~~~~~~\n")

        let roll_entropy = this.roll_model.Clone_Entropy_Distribution()
        let godfavor_entropy = this.godfavor_model.Clone_Entropy_Distribution()


        let state = JSON.parse(JSON.stringify(state_))
        if(rolled_dices != null){
            state.situation.rolled_dices = Dir_2_DicesInfo(rolled_dices)
            state.situation.phase = ROLL
            node_life = 6
            // node_life = 2

            // console.log(state.situation.rolled_dices)
        }
        else{
            state.situation.phase = GODFAVOR
            node_life = 12
            // node_life = 2

        }


        let is_random = false
        this.acc++
        if (this.acc % 200 == 0) {
            console.log("<< ", this.acc, " >>")
            console.log(state.avatar.health, state.avatar.token, state.opponent.health, state.opponent.token)
        }

        if (this.acc % 16 == 15) {
            is_random = true
            // is_random = false

        }

        // is_random = false

        if(this.mode_ == TEST)
            is_random = false

        
        let tree_node = new Playout_Node(this, state, null, node_life, agent_index, roll_entropy, godfavor_entropy, is_random)

        let round = 0

        let playout_size = undefined
        if (action_size > 0) {
            if (state.situation.phase == ROLL)
                playout_size = ((300 * (action_size)) / (64)) + 30
            else if (state.situation.phase == GODFAVOR)
                playout_size = ((300 * (action_size)) / (61)) + 15

            if (playout_size < 1)
                playout_size = 15
        }
        else
            playout_size = 1

        if(playout_size == 1)
            node_life = 2


        // console.log(playout_size)
        // playout_size = 1
        // node_life = 5

        let is_played = false

        // if(playout_size < 3){
        //     playout_size = 5
        // }

        for (let i = 0; i < playout_size; i++) {
            let ret = await tree_node.Playout()
            // if (i % 40 == 39)
            //     console.log(`[[ agent - ${process.env.pm_id} ]]`, i, "-th playout / ", node_life * (i + 1))


            is_played = true
        }

        if(is_played == false){
            console.log("playout_size is under 1")
            console.log(playout_size)
            console.log(state_)
            console.log(rolled_dices)
            console.log(action_size)
        }

        // console.log("<< ", this.acc, " >>")

        


        // let copied_edge = [...tree_node.edges]

        // tree_node.edges.forEach(edge__=>{console.log(edge__.Get_ActionIndex())})

        // random_.shuffle(copied_edge)

        // console.log("\n~~~~~~~~\n")

        // tree_node.edges.forEach(edge__=>{console.log(edge__.Get_ActionIndex())})


        let visit_counts = tree_node.Get_VisitCount_Children()
        let children_count = visit_counts.length

        // console.log(tree_node.edges)
        // tree_node.edges.forEach(edge_=>{
        //     console.log(edge_.action.action_index)
        // })

        // console.log("\n~~~~~~~\n")

        let shuffled_edges = [...tree_node.edges]

        random_.shuffle(shuffled_edges)

        let max_prob_index = -1
        let max_prob = -999999
        let max_expected_value = -999999
        for (let i = 0; i < children_count; i++) {
            let visit_count_ = shuffled_edges[i].Get_VisitCount()
            if (max_prob == visit_count_) {
                let c_expected_value = shuffled_edges[i].Get_ExpectedValue()

                if (max_expected_value < c_expected_value) {
                    max_prob = visit_count_
                    max_prob_index = i
                    max_expected_value = c_expected_value
                    // console.log("[equal visit count]")
                    // console.log("max expected value : ", max_expected_value)
                }
            }
            else if (max_prob < visit_count_) {
                let c_expected_value = shuffled_edges[i].Get_ExpectedValue()

                max_prob = visit_count_
                max_prob_index = i
                max_expected_value = c_expected_value
                // console.log("max expected value : ", max_expected_value)
            }
        }

        // let expected_value = tree_node.Get_ExpectedValue_Raw()
        let expected_value = tree_node.Get_ExpectedValue()

        // if (agent_index == 1) {
        // console.log("visit count : ", tree_node.visit_count)
        // console.log()
        // console.log(shuffled_edges[max_prob_index].action)
        // console.log()
        // console.log(visit_counts)
        // console.log(tree_node.select_count)
        // console.log(state_)
        // console.log()
        // console.log(state.situation.rolled_dices)

        // console.log(expected_value)

        // console.log("\n===============================\n")
        // }


        // console.log(tree_node.value_)
        // console.log(tree_node.value_count_)


        
        // console.log(tree_node.Get_Playout_Softmax())
        // console.log(tree_node.action_mask)

        if(max_prob_index == -1){
            console.log("Playout")
            console.log(state_)
        }


        if(tree_node.Get_VisitCount() == 0){
            console.log("visit count = 0")
            console.log(playout_size)
            console.log(state_)
            console.log(rolled_dices)
            console.log(action_size)
        }


        if(tree_node.agent == "opponent"){
            console.log("ERROR! it can't be oppoent")
        }



        
        // console.log(tree_node.edges[0])
        // for (let i = 0; i < 64; i++) {
        //     console.log(`${i} : `, tree_node.edges[i].Get_ARC())
        // }


        // if (state.situation.phase == GODFAVOR)

        let best_edge = shuffled_edges[max_prob_index]

        
        return [tree_node.state, shuffled_edges[max_prob_index].action, best_edge.action.action_index, tree_node.Get_Playout_Softmax(), expected_value, tree_node.action_mask]
        // else
        //     return [tree_node.state, shuffled_edges[max_prob_index].action, null, tree_node.Get_SelectRatio(), expected_value, tree_node.action_mask]


    }


    // async Playout_dep(state_, rolled_dices, node_life, agent_index) {
        
    //     let version_ = await this.Check_ModelVersion()

    //     this.model_version_ = version_
    //     this.model_version_ = "000"

    //     let state = JSON.parse(JSON.stringify(state_))
    //     if(rolled_dices != null){
    //         state.situation.rolled_dices = Dir_2_DicesInfo(rolled_dices)
    //         state.situation.phase = ROLL
    //     }
    //     else
    //         state.situation.phase = GODFAVOR

    //     let tree_node = new Playout_Node(this, state, null, node_life, agent_index)

    //     let round = 0

    //     let agent
    //     let actions, value


    //     let ret_value = null
    //     // playout
    //     let next_node = undefined
    //     for (let i = 0; i < 100; i++) {
    //         next_node = tree_node
    //         while(true){
    //             if(next_node.edges.length == 0){
    //                 state = next_node.state
    //                 agent = next_node.agent
    //                 agent_index = next_node.agent_index
                    

    //                 let ret = await this.Predict(state, agent_index, agent)
    //                 actions = ret[0]
    //                 value = ret[1]
    //             }
    //             else
    //                 [actions, value] = [null, null]
    
    //             // console.log(actions, value)
    //             next_node = next_node.Playout(actions, value)

    //             if(next_node == null)
    //                 break
    //         }

            
    //         if(i % 5 == 0)
    //             console.log(i, "-th playout / ", node_life * (i + 1))

    //     }


    //     // return [tree_node.state, tree_node.edges[max_prob_index].action, max_prob_index]

    //     // console.log(visit_counts)



    //     // console.log("value : ", tree_node.value_)
    //     // console.log("value cnt : ", tree_node.value_count_)
    //     // console.log("expected value : ", tree_node.expected_value)


    // }


    // state에서 수행 가능한 action 배열을 반환한다
    
    async Predict(state, agent_index, agent){
        // console.log(state)



        // if(state.situation.phase == GODFAVOR)
        //     console.log(action_mask)
        // state.mask[`${agent}`] = action_mask
        
        // console.log(state)
        let state_ = JSON.parse(JSON.stringify(state))

        
        // console.log("\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n")

        // console.log(`phase : ${state_.situation.phase == ROLL ? "Roll" : "Godfavor"}`)
        // console.log(`turn : ${state_.situation.turn}`)
        // console.log(`order : ${state_.situation.order}`)
        // console.log(`index : ${agent_index}`)
        // console.log(`agent : ${agent}`)

        // console.log("....")

        
        // if(agent == "opponent"){
        //     console.log("\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        //     console.log(`agent : ${agent}`)
        //     console.log(`index : ${agent_index}`)
        //     console.log(`turn : ${state_.situation.turn}`)
        //     console.log(`order : ${state_.situation.order}`)
        //     console.log(`avatar - [ ${agent_index} ]`, state_.avatar.godFavors)
        //     console.log(`opponent - [ ${1 - agent_index} ]`, state_.opponent.godFavors)
        //     console.log()
        // }


        // console.log("....")

        State_Modify_4_Predict(state_, agent_index, agent)

        let actor_index = agent_index

        if (agent == "opponent") {
            actor_index = 1 - agent_index
            // console.log(`turn : ${state_.situation.turn}`)
            // console.log(`order : ${state_.situation.order}`)
            // console.log(`avatar - [ ${agent_index} ]`, state_.avatar.godFavors)
            // console.log(`opponent - [ ${1 - agent_index} ]`, state_.opponent.godFavors)
            // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n")
        }



        let action_mask = Create_Action_Mask(state_, actor_index)


        // if (state.situation.phase == GODFAVOR) {
            
        //     console.log(state.avatar.godFavors)
        //     if (agent_index == 0 && agent == "avatar") {
        //         console.log("agent : ", agent_index)
        //         console.log(`[ ${actor_index}, ${agent} ] : `, action_mask[1][0])
        //         console.log()
        //     }
        //     else if (agent_index == 1 && agent == "opponent") {
        //         console.log("agent : ", agent_index)
        //         console.log(`[ ${actor_index}, ${agent} ] : `, action_mask[1][0])    
        //         console.log()
        //     }

        //     else if (agent_index == 1 && agent == "avatar") {
        //         console.log("agent : ", agent_index)
        //         console.log(`[ ${actor_index}, ${agent} ] : `, action_mask[1][0])
        //         console.log()
        //     }
        //     else if (agent_index == 0 && agent == "opponent") {
        //         console.log("agent : ", agent_index)
        //         console.log(`[ ${actor_index}, ${agent} ] : `, action_mask[1][0])
        //         console.log()
        //     }
        //     else {
        //         console.log("ERROR!!")
        //     }

        // }


        if(state_.situation.phase == ROLL)
            return this.Predict_Roll(state_, action_mask, agent_index)
        else
            return this.Predict_Godfavor(state_, action_mask, agent_index)
    }



    async Predict_Roll(state, action_mask, agent_index) {
        let probs, value



        // console.log("Roll")

        // let phase = state.situation.phase
        let serialized_state = State_Serialize(state)

        // console.log("roll", action_mask.length)

        if (this.model_version_ != null){

            let batch_generator_ = undefined
            let roll_model_ = undefined

            if(this.mode_ == TRAINING){
                batch_generator_ = this.batch_generator
                roll_model_ = this.roll_model
            }
            else if(this.mode_ == TEST && agent_index == 0){
                batch_generator_ = this.batch_generator
                roll_model_ = this.roll_model

                // let turn_ = state.situation.turn
                // let turn_index = state.situation.order[turn_ % 2]

                // console.log(turn_index, state.avatar.godFavors)
            }
            else if(this.mode_ == TEST && agent_index == 1){
                batch_generator_ = this.batch_generator_new
                roll_model_ = this.roll_model_new

            }
            else{
                console.log("error, no model")
            }


            
            // console.log(this.mode, agent_index)

            if (global.gameover_cnt < this.set_predict_limit && this.batch_generator != null) {
                // console.log("batched")
                let msg  = await batch_generator_.AI_Request_Predict_Roll(serialized_state, action_mask)


                probs = msg[0]
                value = msg[1]
            }
            else {
                // console.log("error")
                // let msg = await global.Redis_Adapter.AI_Request_Predict([serialized_state], [action_mask], 0)
                let msg = await roll_model_.Predict([serialized_state], [action_mask])
                probs = msg[0][0]
                value = msg[1][0][0]

            }

            // console.log(probs)
            
            // let msg = await global.Redis_Adapter.AI_Request_Predict([serialized_state], [action_mask], 0)

            // probs = msg.data[0][0]
            // value = msg.data[1][0][0]


            // console.log(probs)
            // console.log(value)

        }
        else
            [probs, value] = Random_Predict(state, action_mask)

        // if(this.mode_ == TEST && agent_index == 1)
        //     console.log(probs)


        let actions = []
        for (let index = 0; index < probs.length; index++) {
            let parsed_action = Parse_Action(state, index, probs[index])
            if(parsed_action != null)
                actions.push(parsed_action)
        }

        // let actions = Parse_Action_Roll(state, probs)


        return [actions, value, action_mask]
    }



    async Predict_Godfavor(state, action_mask, agent_index){
        let probs, value

        // let phase = state.situation.phase

        let mask_ = action_mask[0]
        let actions_ = action_mask[1]

        // console.log("godfavor", mask_.length)

        let serialized_state = State_Serialize(state)

        if (this.model_version_ != null) {

            let batch_generator_ = undefined
            let godfavor_model_ = undefined

            if(this.mode_ == TRAINING){
                batch_generator_ = this.batch_generator
                godfavor_model_ = this.godfavor_model
            }
            else if(this.mode_ == TEST && agent_index == 0){
                batch_generator_ = this.batch_generator
                godfavor_model_ = this.godfavor_model

            }
            else if(this.mode_ == TEST && agent_index == 1){
                batch_generator_ = this.batch_generator_new
                godfavor_model_ = this.godfavor_model_new

            }


            if (global.gameover_cnt < this.set_predict_limit && this.batch_generator != null) {
                // console.log("batched")
                let msg  = await batch_generator_.AI_Request_Predict_Godfavor(serialized_state, mask_)
                probs = msg[0]
                value = msg[1]
            }
            else {
                // console.log("error")
                // let msg = await global.Redis_Adapter.AI_Request_Predict([serialized_state], [mask_], 1)

                let msg = await godfavor_model_.Predict([serialized_state], [mask_])

                probs = msg[0][0]
                value = msg[1][0][0]
            }

            // let msg = await global.Redis_Adapter.AI_Request_Predict([serialized_state], [mask_], 1)

            // probs = msg.data[0][0]
            // value = msg.data[1][0][0]

            // console.log(probs)
            // console.log(value)
        }
        else
            [probs, value] = Random_Predict(state, mask_)

        // console.log(probs)

        if (isNaN(probs[0]))
            console.log(state)

        let actions = []
        for (let index = 0; index < actions_.length; index++) {
            let name_ = actions_[index].godfavorNameIndex
            let level_ = actions_[index].level

            let action_index = undefined
            if(name_ != -1)
                action_index = name_ * 3 + level_
            else
                action_index = 60

            // console.log(actions_[index])
            actions.push({
                "preparedGodFavor": actions_[index], extra: null, input: null,
                "probability": probs[action_index],
                "action_index" : action_index
            })
        }

        // console.log(actions)
        return [actions, value, mask_]
    }


    
    async Predict_Frigg(state, action_mask, agent_index){
        


    }


    Parse_Action(state, action){



    }



    Random_State_Roll(){

    }


    Get_Playout_Cnt(){
        return this.acc
    }


    Reset_Playout_Cnt(){
        this.acc = 0
    }


    Set_Version(ver){
        this.model_version_ = ver
    }

}
