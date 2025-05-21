
import Playout_Node from "./Playout_Node.js"
import { Step } from "../Util/utils.js"


const W_puct = 1.0
const C_puct = 0.5

export default class Playout_Edge {
    constructor(machine, from_node, prob, action, life, agent_index, agent, roll_entropy, godfavor_entropy, is_random) {

        
        this.machine = machine
        this.from_node = from_node
        this.to_node = null
        this.prob = prob
        this.action = action
        this.life = life
        this.agent_index = agent_index

        this.agent = agent
        
        this.roll_entropy = roll_entropy
        this.godfavor_entropy = godfavor_entropy

        this.is_random = is_random
    }


    Get_ActionIndex(){
        return this.action.action_index
    }


    Get_ExpectedValue() {
        if(this.to_node == null)
            return 0
        else{
            let expected_value = this.to_node.Get_ExpectedValue()

            if(this.from_node.agent == this.to_node.agent)
                return expected_value
            else
                return -1.0 * expected_value

        }
    }

    
    // Get_ExpectedValue() {
    //     if (this.to_node == null)
    //         return 0.0
    //     else
    //         // return this.to_node.Get_ExpectedValue() / this.from_node.Get_VisitCount()
    //         return this.to_node.Get_ExpectedValue_Raw()
    // }



    Get_VisitCount(){
        if(this.to_node == null)
            return 0
        else
            return this.to_node.Get_VisitCount()
    }


    Playout_Dep(){
        if(this.to_node == null){
            let next_state = this.Step()
            // console.log(next_state)
            this.to_node = new Playout_Node(this.machine, next_state, this, this.life - 1, this.agent_index, this.roll_entropy, this.godfavor_entropy)
        }

        return this.to_node
    }


    Get_Entropy(){
        let phase = this.from_node.Get_Phase()
        let entropy = undefined

        let action_index = this.Get_ActionIndex()

        if(phase == 0){
            // ROLL
            entropy = this.roll_entropy[action_index]
        }
        else{
            // GODFAVOR
            entropy = this.godfavor_entropy[action_index]
        }


        return entropy
    }



    async Playout(){

        // console.log(this.action)

        // console.log("\n==================\n")


        if(this.to_node == null){
            let next_state = this.Step()
            // console.log(next_state)
            this.to_node = new Playout_Node(this.machine, next_state, this, this.life - 1, this.agent_index, this.roll_entropy, this.godfavor_entropy, false)
        }

        
        // this.visit_count++

        let [next_value, new_value_count] = await this.to_node.Playout()
        // console.log("edge : ", next_expected_value)


        return [next_value, new_value_count]
    }


    // from_node 의 state에서 this.input을 수행한 후, 새로운 state를 생성한다
    Step(){
        // console.log(this.action)

        let next_state = Step(this.from_node.Get_State(), this.action, this.agent_index, this.agent)

        return next_state
    }


    

    Get_Probability(){

        if(this.is_random != true && this.is_random != false){
            console.log("ERROR : is_random is strange")
        }

        let random_corr = 0.0
        if(this.is_random == true){
            random_corr = 0.2
        }

        return ((1.0 - random_corr) * this.prob) + (random_corr * this.Get_Entropy())
    }


    Get_UCB(){
        return Math.sqrt(this.from_node.Get_VisitCount()) / (1 + this.Get_VisitCount())
    }

    Get_Bias(){
        return this.Get_Probability() * this.Get_UCB()
    }


    // 매개변수 edge (action) 에 대한 ARC 값을 반환한다
    Get_ARC(){
        let expected_value = this.Get_ExpectedValue()
        let bias = this.Get_Bias()

        // if(expected_value != 0)
        // console.log(expected_value, bias)

        let arc = W_puct * expected_value + C_puct * bias

        // console.log(arc)

        // return Math.random()

        return arc
    }


    Get_To_Node(){
        return this.to_node
    }
    

    // Backtracking(ret_value, ret_count){
    //     this.from_node.Backtracking(ret_value, ret_count)
    // }
}