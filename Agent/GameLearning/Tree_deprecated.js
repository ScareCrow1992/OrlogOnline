import Node from "./Node.js";

// wstreams.write(`[[ Dummy - ${this.uid} ]]\n`)

export default class Tree{
    constructor(agent_index, state, machine, life, state_branch_limit, action_branch_limit){
        this.agent_index = agent_index
        this.node_life = life
        this.machine = machine
        this.branch_limit = state_branch_limit
        this.machine.Operate_Cache(state, {}, "SET", [0, 0, 0, 0, this.root])

        // this.w_states = w_states
        // this.w_actions = w_actions
        // this.w_results = w_results


        this.root = new Node(agent_index, state, machine, life, state_branch_limit, action_branch_limit, null)

    }


    // Traversal(){
    //     let states_result =[[], []], actions_result = [[], []]

    //     actions_result[0].push(null)
    //     actions_result[1].push(null)
    //     this.root.Traversal(states_result, actions_result)

    //     // this.root.Traversal(this.w_states, this.w_actions, this.w_results)

    //     console.log("state 결과 크기 : ", states_result[0].length, states_result[1].length)
    //     console.log("action 결과 크기 : ", actions_result[0].length, actions_result[1].length)

    //     return { states_result, actions_result }
    // }


    
    Traversal(){
        this.root.Traversal()

        // this.root.Traversal(this.w_states, this.w_actions, this.w_results)

    }



    async Play(){
        let results = await this.root.Play()
        
        console.log(this.root.scores, this.root.win_rate)
        // console.log(this.root.scores[0] / 10000000, this.root.scores[1] / 10000000)


        return results
    }



    async Play_Node(result){
        // console.log(result)
        result.from_node.life = this.node_life + 1

        let from_node = result.from_node

        let result_state = result
        let from_action = result.from_action

        delete result.from_node
        delete result.from_action
        
        // console.log(from_action)
        // console.log(result_state)

        // console.log([0,0,0, 0, from_node])
        // this.machine.Operate_Cache(from_node.state, from_action, "SET", [...from_node.scores, 0, from_node])
        // console.log(from_node.state)
        // console.log(from_action)
        this.machine.Operate_Cache(from_node.state, from_action, "SET", [0, 0, 0])


        // console.log(result_state)
        let states = await this.machine.Create_Random_State_Multiple_NoLog(result_state, this.branch_limit, from_node.agent_index)
        // console.log(states)
        from_node.AddNode_Multiple(states, from_action)

        let leaf_node_result = [], gameover_node_result = []
        await from_node.Play_Edges(leaf_node_result, gameover_node_result)
        
        console.log(this.root.scores, this.root.win_rate)

        // console.log("recursive leaf length", leaf_node_result.length)

        // let to_node = from_node.AddNode(last_state, from_edge)

        // let results = to_node.Play()


        return [leaf_node_result, gameover_node_result]
    }

}