import Playout_Edge from "./Playout_Edge.js"
// import { Parse_Action } from "../Util/utils.js"
import { Random } from "random-js"

const random = new Random();


export default class Playout_Node{
    constructor(machine, state, before_edge, life, agent_index, roll_entropy, godfavor_entropy, is_random){

        // console.log(state)
        // console.log("avatar : ", state.avatar.dices_)
        // console.log("opponent : ", state.opponent.dices_)

        // if(state.situation.phase == 0)
        //     console.log("rolled : ", state.situation.rolled_dices)
        
        // console.log("\n==================\n")

        this.machine = machine
        this.state = state
        this.before_edge = before_edge

        this.action_mask = []

        this.roll_entropy = roll_entropy
        this.godfavor_entropy = godfavor_entropy

        this.is_random = is_random


        this.value_ = {
            "avatar" : 0.0,
            "opponent" : 0.0
        }

        this.value_count_ = {
            "avatar" : 0,
            "opponent" : 0
        }

        // this.value = 0
        // this.acc_value = 0

        this.visit_count = 0        // 노드 방문 횟수

        this.edges = []
        this.life = life

        this.agent_index = agent_index
        this.agent = null

        let turn_ = this.state.situation.turn
        let order_ = this.state.situation.order


        let phase_ = this.state.situation.phase

        if(order_[turn_ % 2] == agent_index)
            this.agent = "avatar"
        else
            this.agent = "opponent"


        
        this.new_value = { "avatar": 0.0, "opponent": 0.0 }
        this.new_count = { "avatar": 0, "opponent": 0 }


        this.select_size = 0
        this.select_count = undefined
        this.select_mask = undefined

        this.Init_Select_Info()


    }


    set value(rhs){
        this.value_[`${this.agent}`] = rhs
    }


    get value(){
        return this.value_[`${this.agent}`]
    }


    set value_count(rhs) {
        this.value_count_[`${this.agent}`] = rhs
    }


    get value_count() {
        return this.value_count_[`${this.agent}`]
    }


    get expected_value() {
        // console.log(this.value_)
        // console.log(this.visit_count_)

        let avatar_expected_value = undefined
        if(this.value_count_["avatar"] != 0)
            avatar_expected_value = this.value_["avatar"] / this.value_count_["avatar"]
        else
            avatar_expected_value = 0

        
        let opponent_expected_value = undefined
        if(this.value_count_["opponent"] != 0)
            opponent_expected_value = this.value_["opponent"] / this.value_count_["opponent"]
        else
            opponent_expected_value = 0
        
        

        // let total_value_count = this.value_count_["avatar"] + this.value_count_["opponent"]

        // avatar_expected_value = avatar_expected_value * (this.value_count_["avatar"] / total_value_count)
        // opponent_expected_value = opponent_expected_value * (this.value_count_["opponent"] / total_value_count)

        


        // console.log("expected values : ", avatar_expected_value, opponent_expected_value)
        let ret = (avatar_expected_value - opponent_expected_value) / 2.0
        // console.log("expected value : ", ret)

        if (this.agent == "avatar")
            return ret
        else
            return -1.0 * ret
    }



    Get_SelectRatio(){
        // console.log(this.state.situation.phase)
        let ret = [...this.select_count]

        for (let i = 0; i < 6; i++) {
            ret[i] /= (this.Get_VisitCount())
        }

        // console.log("ratio : ", ret)

        return ret
    }


    Init_Select_Info(){
        

        let select_size = null
        if(this.state.situation.phase == 0){
            // ROLL
            select_size = 6

            this.select_count = new Array(select_size).fill(0)
            this.select_mask = new Array(select_size).fill(true)

            let c_dices = this.state[`${this.agent}`].dices_

            for(let dice_index = 0; dice_index < 6; dice_index++){
                if(c_dices.weapon[dice_index] == null){
                    this.select_mask[dice_index] = true
                    this.select_size++
                }
                else
                    this.select_mask[dice_index] = false

            }
        }
        else if(this.state.situation.phase == 1){
            // GODFAVOR
            select_size = 0
        }   
    }


    Set_Selection_Info(selected_edge){
        
        if(this.state.situation.phase == 0){
            // ROLL
            let chosen_dice = selected_edge.action.chosen
            // console.log(chosen_dice)
            for(let dice_index = 0; dice_index < 6; dice_index++){
                if(chosen_dice[dice_index] == true){
                    this.select_count[dice_index]++
                }
            }
        }
    }


    // Gameover(){

    //     let ret_value = {"avatar" : 0.0, "opponent" : 0.0}
    //     ret_value[`${this.agent}`] = 1.0

    //     let ret_count = {"avatar" : 0, "opponent" : 0}
    //     ret_count[`${this.agent}`] = 1

    //     this.Backtracking(ret_value, ret_count)
    // }



    // Lifeover(value){        
    //     let ret_value = {"avatar" : 0.0, "opponent" : 0.0}
    //     ret_value[`${this.agent}`] = value

    //     let ret_count = {"avatar" : 0, "opponent" : 0}
    //     ret_count[`${this.agent}`] = 1
        
    //     this.Backtracking(ret_value, ret_count)
    // }



    // Backtracking(next_value, next_value_count){

    //     this.value_["avatar"] += next_value["avatar"]
    //     this.value_["opponent"] += next_value["opponent"]

    //     this.value_count_["avatar"] += next_value_count["avatar"]
    //     this.value_count_["opponent"] += next_value_count["opponent"]

    //     // console.log(this.agent)
    //     // console.log("value : ", this.value_)
    //     // console.log("cnt : ", this.value_count_)
    //     // console.log(this.expected_value)


    //     next_value["avatar"] += this.new_value["avatar"]
    //     next_value["opponent"] += this.new_value["opponent"]

    //     next_value_count["avatar"] += this.new_count["avatar"]
    //     next_value_count["opponent"] += this.new_count["opponent"]


    //     this.new_value["avatar"] = 0
    //     this.new_value["opponent"] = 0

    //     this.new_count["avatar"] = 0
    //     this.new_count["opponent"] = 0


    //     if(this.before_edge != null)
    //         this.before_edge.Backtracking(next_value, next_value_count)
    // }


    // Playout_dep(actions, value){
    //     this.visit_count++

        

    //     if (this.state.situation.gameover == true) {
    //         this.Gameover()
    //         return null
    //     }
    //     else if(this.life == 0){
    //         this.Lifeover(value)
    //         return null
    //     }

    //     if (this.edges.length == 0) {
    //         // console.log(this.agent)

    //         this.value = this.value + value
    //         this.value_count = this.value_count + 1
    //         this.new_value[`${this.agent}`] = value
    //         this.new_count[`${this.agent}`] = 1



    //         actions.forEach(action_ => {
    //             this.Create_Edges(action_)
    //         })
    //     }

    //     let best_edge = null
    //     let best_arc = -5000


    //     let shuffled_edges = [...this.edges]

    //     random.shuffle(shuffled_edges)

    //     shuffled_edges.forEach(edge_ => {
    //         let arc = edge_.Get_ARC()
    //         if (arc > best_arc) {
    //             best_arc = arc
    //             best_edge = edge_
    //         }

    //         // console.log(arc)
    //     })
    //     // console.log("\n===================\n")

    //     return best_edge.Playout()



    // }



    async Playout() {
        
        this.visit_count++

        if (this.state.situation.gameover == true) {
            // this.value = 1.0
            // this.value_count = 1

            let avatar_value, opponent_value
            let winner, loser

            if (this.state.situation.winner == this.agent_index) {
                
                avatar_value = 1.0
                opponent_value = -1.0
                winner = "avatar"
                loser = "opponent"
                // if (this.agent == "avatar") {
                //     avatar_value = 1.0
                //     opponent_value = -1.0
                //     winner = "avatar"
                //     loser = "opponent"
                // }
                // else {
                //     avatar_value = -1.0
                //     opponent_value = 1.0
                //     winner = "opponent"
                //     loser = "avatar"
                // }
            }
            else {
                avatar_value = -1.0
                opponent_value = 1.0
                winner = "opponent"
                loser = "avatar"
                // if (this.agent == "avatar") {
                //     avatar_value = -1.0
                //     opponent_value = 1.0
                //     winner = "opponent"
                //     loser = "avatar"
                // }
                // else {
                //     avatar_value = 1.0
                //     opponent_value = -1.0
                //     winner = "avatar"
                //     loser = "opponent"
                // }
            }

            this.value_[`${winner}`] = 1.0
            this.value_[`${loser}`] = -1.0
            
            this.value_count_["avatar"] = 1
            this.value_count_["opponent"] = 1

            // console.log(this.state.situation.winner, this.agent_index, this.agent)
            // console.log(winner, loser)
            // console.log("\n====================\n")

            let ret_value = {"avatar" : avatar_value, "opponent" : opponent_value}
            // ret_value[`${winner}`] = 1.0

            let ret_count = {"avatar" : 1, "opponent" : 1}
            // ret_count[`${winner}`] = 1

            return [ret_value, ret_count]
            // return this.expected_value
        }

        if (this.life == 0) {
            let [actions, value_, action_mask] = await this.machine.Predict(this.state, this.agent_index, this.agent)

            this.action_mask = action_mask

            this.value = value_
            this.value_count = 1
            
            let ret_value = {"avatar" : 0.0, "opponent" : 0.0}
            ret_value[`${this.agent}`] = value_

            let ret_count = {"avatar" : 0, "opponent" : 0}
            ret_count[`${this.agent}`] = 1
            
            actions.forEach(action_ => {
                this.Create_Edges(action_)
            })

            return [ret_value, ret_count]
        }

        let new_value = { "avatar": 0.0, "opponent": 0.0 }
        let new_count = { "avatar": 0, "opponent": 0 }
        if (this.edges.length == 0) {
            // console.log(this.agent)
            let [actions, value_, action_mask] = await this.machine.Predict(this.state, this.agent_index, this.agent)

            this.action_mask = action_mask

            this.value = this.value + value_
            this.value_count = this.value_count + 1
            new_value[`${this.agent}`] = value_
            new_count[`${this.agent}`] = 1


            actions.forEach(action_ => {
                this.Create_Edges(action_)
            })

            if(value_ < -0.9 || value_ > 0.9){
                return [new_value, new_count]
            }
        }


        let shuffled_edges = [...this.edges]
        random.shuffle(shuffled_edges)


        // shuffled_edges.forEach(edge_=>{console.log(edge_.action)})


        // ARC값이 최대인 edge를 선택하고, 플레이 아웃을 진행후, backtracking 한다
        let best_edge = null
        let best_arc = -5000
        // console.log(shuffled_edges.length)
        shuffled_edges.forEach(edge_ => {
            let arc = edge_.Get_ARC()
            // console.log(edge_.action.action_index, arc)
            if (arc > best_arc) {
                best_arc = arc
                best_edge = edge_
            }
            // console.log(arc)
        })

        // console.log(best_edge.action)

        this.Set_Selection_Info(best_edge)


        let [next_value, next_value_count] = await best_edge.Playout()

        this.value_["avatar"] += next_value["avatar"]
        this.value_["opponent"] += next_value["opponent"]

        this.value_count_["avatar"] += next_value_count["avatar"]
        this.value_count_["opponent"] += next_value_count["opponent"]

        next_value["avatar"] += new_value["avatar"]
        next_value["opponent"] += new_value["opponent"]

        next_value_count["avatar"] += new_count["avatar"]
        next_value_count["opponent"] += new_count["opponent"]

        return [next_value, next_value_count]
    }



    IsGameover(){
        return this.state.situation.gameover
    }


    Get_VisitCount_Children(){
        let ret = []
        this.edges.forEach((edge_)=>{
            ret.push(edge_.Get_VisitCount())
            // console.log(edge_.Get_ARC(), edge_.Get_ExpectedValue())
        })

        return ret
    }
    


    Get_VisitCount(){
        // return this.value_count_["avatar"] + this.value_count_["opponent"]
        return this.visit_count
    }


    Get_ExpectedValue(){
        return this.expected_value
    }


    Get_ExpectedValue_Raw(){
        let expected_value = this.expected_value
        // if(this.agent == "opponent")
        //     expected_value = -expected_value
        return expected_value
    }


    Get_State(){
        return JSON.parse(JSON.stringify(this.state))
    }


    Create_Edges(action){
        this.edges.push(new Playout_Edge(this.machine, this, action.probability, action, this.life, this.agent_index, this.agent, this.roll_entropy, this.godfavor_entropy, this.is_random))
    }


    Get_Phase(){
        return this.state.situation.phase
    }




    Get_Playout_Softmax(){
        // let temperature = 2.7182818 / 40.0
        let temperature = 0.25


        let action_size = undefined
        if(this.state.situation.phase == 0)
            action_size = 64
        else
            action_size = 61

        let playout_probs = new Array(action_size).fill(0)
        let action_index = undefined
        let visit_count = undefined
        let prob = undefined

        let numerator, denomirator

        // denomirator = Math.exp(this.Get_VisitCount() / temperature)

        denomirator = 0
        

        this.edges.forEach(edge_ => { 
            action_index = edge_.Get_ActionIndex()
            visit_count = edge_.Get_VisitCount()

            // numerator = Math.exp(visit_count / temperature)

            prob = visit_count / this.Get_VisitCount()

            if(isNaN(prob)){
                console.log("edge's visit count is NaN")
            }

            // prob = numerator / denomirator
            playout_probs[action_index] = prob
        })

        
        // this.edges.forEach(edge_ => { 
        //     visit_count = edge_.Get_VisitCount()
        //     denomirator += Math.exp(visit_count / temperature)
        // })

        for (let i = 0; i < action_size; i++) {
            // denomirator += Math.exp(playout_probs[i] / temperature)
            denomirator += playout_probs[i]
        }


        for (let i = 0; i < action_size; i++) {
            // numerator = Math.exp(playout_probs[i] / temperature)
            numerator = playout_probs[i]

            if(numerator == 0 && denomirator == 0){

            }
            else{
                playout_probs[i] = numerator / denomirator
            }

            if(isNaN(playout_probs[i])){
                console.log(action_size, numerator, denomirator)
                console.log(playout_probs)
            }
        }


        if(isNaN(playout_probs[0])){
            console.log(this.state)
            console.log(playout_probs)
            this.edges.forEach(edge_ => { 
                action_index = edge_.Get_ActionIndex()
                visit_count = edge_.Get_VisitCount()
    
                // numerator = Math.exp(visit_count / temperature)
    
                prob = visit_count / this.Get_VisitCount()
    
                // prob = numerator / denomirator
                console.log(action_index, visit_count, this.Get_VisitCount(), edge_.Get_ActionIndex())
            })
        }

        // console.log(playout_probs)


        return playout_probs
    }


}