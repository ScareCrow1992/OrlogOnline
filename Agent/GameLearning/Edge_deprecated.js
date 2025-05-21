import Node from "./Node.js"

export default class Edge{
    constructor(machine){
        this.machine = machine
    }

    CreateNode(agent_index, state, action, machine, life, state_branch_limit, action_branch_limit, node_from) {
        
        /*
        {
            avatar: {
                preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
                extra: null,
                input: null
                // preparedGodFavor: { godfavorIndex: 0, level: 1, godfavorNameIndex: 3 },
                // extra : null,
                // input : null
            },
            opponent: {
                preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
                extra: null,
                input: null
                // preparedGodFavor: { godfavorIndex: 1, level: 2, godfavorNameIndex: 5 },
                // extra: [[true, true, false, false, false, true], [false, false, false, false, false, false]],
                // input: { index : 4, type : "healthstone"}
            }
        }
        */

        // this.pattern = [...pattern]  // from, to
        
        this.agent_index = agent_index
        this.action = action

        this.node_from = node_from   // 출발 노드
        this.node_to = new Node(agent_index, state, machine, life, state_branch_limit, action_branch_limit, this) // 도착 노드
    }

    // Traversal(states, actions, before_state) {
    //     const INPUT = 0, OUTPUT = 1
    //     this.action.before_state = before_state
    //     actions[INPUT].push(this.action)
    //     actions[OUTPUT].push(this.node_to.win_rate)

    //     this.node_to.Traversal(states, actions)
    // }



    Traversal() {

        // 승률 : node_to
        // state : node_from
        // action : this.action

        
        let winrate_ = this.node_to.win_rate
        let scores_ = this.node_to.scores
        if(scores_[0] != 0 || scores_[1] != 0){
            this.machine.Write_Data_Godfavor(this.node_from.state, this.action.available_avatar, this.action, winrate_)

        }


        // if(Number.isInteger(winrate_) == true && (winrate_ == 1 || winrate_ == 0)){
        //     // 모델에 의한 예측값을 대신 반영하는것을 고려해보자

        // }
        // else{
        //     this.machine.Write_Data_Godfavor(this.node_from.state, this.action.available_avatar, this.action, winrate_)

        // }


        this.node_to.Traversal()
    }



    ConnectNode(node_from, node_to, action){
        this.node_from = node_from
        this.node_to = node_to

        this.action = action


        node_to.AttachEdge(this)
    }


    Get_ToNode(){
        return this.node_to
    }


    async Play(){
        let ret = await this.node_to.Play()
        return ret
    }


    Backtracking(scores){
        this.node_from.Backtracking(scores)

    }


    AttachedNode_IncrScore(scores){
        this.node_from.IncrScore(scores)
    }


    BackLog(){
        console.log(this.action)
        this.node_from.BackLog()
    }


}