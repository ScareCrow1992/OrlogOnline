import Edge from "./Edge.js"

const WIN = 0
const LOSE = 1
const DRAW = 2
const ACTIVE = 3
const NODE = 4

export default class Node {
    constructor(agent_index, state, machine, life, state_branch_limit, action_branch_limit, edge_from) {
        global.node_cnt++
        // console.log(global.node_cnt)
        if (global.node_cnt % 10000 == 0){
            console.log(global.node_cnt)
            // console.log("round : ", state.situation.round)
        }

        /*
        this.state = {
            avatar: {
                godFavors: null,
                health: 0,
                token: 0,
                heal: 0,
                damage: 0,
                dices: {
                    axe: 0,
                    arrow: 0,
                    helmet: 0,
                    shield: 0,
                    steal: 0,
                    empty: 0,
                    mark: 0
                },
                dices_ : {
                    weapon : [ ~~ ],
                    mark : [ ~~ ]
                }
            },
            opponent : {
                godFavors: null,
                health: 0,
                token: 0,
                heal: 0,
                damage: 0,
                dices: {
                    axe: 0,
                    arrow: 0,
                    helmet: 0,
                    shield: 0,
                    steal: 0,
                    empty: 0,
                    mark: 0
                },
                dices_ : {
                    weapon : [ ~~ ],
                    mark : [ ~~ ]
                }
            },
            situation : {
                order : [1, 0],
                round : 4
            }
        }
        */

        this.agent_index = agent_index
        this.state = state
        this.machine = machine

        this.scores = [0, 0, 0] // 승, 패, 무승부
        this.win_rate = 0

        this.life = life // life 가 0이면 분산 불가능
        this.state_branch_limit = state_branch_limit
        this.action_branch_limit = action_branch_limit



        // if (this.state.situation.round > 2) {
        //     this.state_branch_limit = 1
        //     this.action_branch_limit = 1
        // }


        this.edges = []


        // root node는 edge_from이 null 이다
        this.edge_from = edge_from
        this.attached_edges = []

        this.processes = []

        this.isComplete = false


    }

    // Traversal(states, actions) {
    //     const INPUT = 0, OUTPUT = 1
    //     states[INPUT].push(this.state)
    //     states[OUTPUT].push(this.win_rate)

    //     this.edges.forEach((edge_ => {
    //         edge_.Traversal(states, actions, JSON.parse(JSON.stringify(this.state)))
    //     }))


    // }

    
    Traversal() {
        let logs = this.state.situation.logs
        // if(logs != undefined){
        //     logs.forEach(log=>{
        //         let state_ = this.edge_from.node_from.state
        //         let rolled_dices_ = log.situation.rolled
        //         let action_ = log.situation.chosen
        //         let winrate_ = this.win_rate

        //         if(Number.isInteger(winrate_) == true && (winrate_ == 1 || winrate_ == 0)){
        //             // 모델에 의한 예측값을 대신 반영하는것을 고려해보자
        //         }
        //         else{                
        //             this.machine.Write_Data_Roll(state_, rolled_dices_, action_, winrate_)
        //         }
        //     })
        // }


        this.edges.forEach((edge_ => {
            edge_.Traversal()
        }))
    }


    BackLog(pattern_from, pattern_to){

        console.log(this.state)
        if (this.state.opponent.dices_) {
            console.log(this.state.avatar.dices_)
            console.log(this.state.opponent.dices_)

        }

        console.log("\n\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\n")

        if(this.edge_from != null){
            this.edge_from.BackLog()
        }
    }


    AttachEdge(attached_edge_arg){
        // console.log("[[ Attached ]] : ", this.attached_edges.length)
        this.attached_edges.push(attached_edge_arg)
    }



    ConnectNode(to_node, action){
        let from_node = this
        let edge_ = new Edge(this.machine)
        edge_.ConnectNode(from_node, to_node, action)
    }


    Create_Footprint_Cases(cnt) {
        // this.state가 될 수 있는 state 들을 만든다




    }


    Backtracking(scores) {
        let new_element = undefined
        if(scores[WIN] == 1)
            new_element = 1
        else if(scores[LOSE] == 1)
            new_element = 0

        // if(new_element == 1){
        //     console.log("WIN")
        // }

        if(new_element == 1 || new_element == 0){
            let total_game = 1 + this.scores[WIN] + this.scores[LOSE]
            this.win_rate = this.win_rate + (new_element - this.win_rate) / total_game
        }


        this.IncrScore(scores)

        // console.log(this.attached_edges)

        let from_action = null
        if(this.edge_from != null)
            from_action = this.edge_from.action

        this.machine.Operate_Cache(this.state, from_action, "INCR", this.scores)
        // this.machine.Operate_Cache(this.state, from_action, "ACTIVE")

        if(this.edge_from != null)
            this.edge_from.Backtracking(scores)

        // let cache_ = new Set()
        // this.state.situation.turn = 4
        // let roll_phase_states = this.machine.Create_Rollphase_States(this.state, 1, 3, 1 - this.agent_index, cache_)
        
        

        // if (global.node_cnt % 1000 == 0){
        //     console.log("created rollphase case : ", roll_phase_states.length)
        //     console.log(roll_phase_states)
        // }
        // cache_.clear()

        // this.attached_edges.forEach(attached_edge_=>{
        //     attached_edge_.AttachedNode_IncrScore(this.scores)
        // })


        // console.log(this.scores)
    }


    IncrScore(scores){
        // console.log(scores)
        this.scores[WIN] += scores[WIN]
        this.scores[LOSE] += scores[LOSE]
        this.scores[DRAW] += scores[DRAW]
        
    }



    GameOver(simulation_result, action_, gameover_node_result){

        let edge_gameover = new Edge(this.machine)

        let gameover_state = JSON.parse(JSON.stringify(simulation_result))

        edge_gameover.CreateNode(this.agent_index, gameover_state, action_, this.machine, this.life - 1, this.state_branch_limit, this.action_branch_limit, this, [])


        global.gameover++
        simulation_result.leaf_node = edge_gameover.node_to
        // gameover_node_result.push(simulation_result)
        gameover_node_result.push(edge_gameover.node_to)

        // back tracking

        let result_scores = [0, 0, 0]
        // console.log("winner : ", simulation_result.situation.winner)
        if(simulation_result.situation.winner == this.agent_index){
            result_scores[WIN]++
        }
        else{
            result_scores[LOSE]++
        }

        this.Backtracking(result_scores)

    }


    async Play() {
        // action 수행 결과 게임이 안끝났다면 다음 node를 생성한다
        // hp와 token, round, order가 바뀐다.
        // 현재 노드의 life가 0 이라면 분기를 생성하지 않고 대기한다

        let leaf_node_result = []
        let gameover_node_result = []

        let actions = await this.machine.Create_Action_Multiple(this.state, this.action_branch_limit)

        let actions_length = actions.length

        for(let action_index = 0; action_index< actions_length; action_index++){
            let action_ = actions[action_index]

            let simulation_result = this.machine.Play(this.state, action_, this.agent_index)

            let ret = this.machine.Operate_Cache(simulation_result, action_, "GET")
            if (ret != null) {

                // 중복된 케이스여도 게임오버는 backtracking을 수행할 수 있다.
                if (simulation_result.situation.gameover == true) {
                    // if(global._dbg_checklog == true){
                    //     console.log(simulation_result)
                    //     console.log(action_)
                    // }
                    // console.log("Game Over")
                    // this.BackLog()

                    this.GameOver(simulation_result, action_, gameover_node_result)

                }

                if(ret[ACTIVE] == 1){
                    // backtracking을 완료한 node의 cached record를 반영한다
                    this.IncrScore(ret)
                }
                else{
                    // backtracking을 미수행한 node의 cache이므로 미반영 or 추가 조치 필요
                    // let cached_node = ret[NODE]
                    // this.ConnectNode(cached_node, action_)
                }

            }
            else {
                let ret = this.machine.Operate_Cache(simulation_result, action_, "SET", [0, 0, 0])
                if (simulation_result.situation.gameover == true) {
                    this.GameOver(simulation_result, action_, gameover_node_result)

                }
                else {
                    if (this.life - 1 > 0) {
                        let states = await this.machine.Create_Random_State_Multiple_NoLog(simulation_result, this.state_branch_limit, this.agent_index)
                        // console.log(states.length)
                        this.AddNode_Multiple(states, action_)
                    }
                    else {
                        // console.log(simulation_result)
                        simulation_result.from_node = this
                        simulation_result.from_action = action_
                        leaf_node_result.push(simulation_result)
                    }
                }

            }

        }

        // let edge_promises = []
        if (this.life - 1 > 0) {
            await this.Play_Edges(leaf_node_result, gameover_node_result)
            // edge_promises.push(promise_)
        }

        // await Promise.all(edge_promises)

        this.isComplete = true

        return [leaf_node_result, gameover_node_result]
    }


    AddNode_Multiple(states, action) {
        states.forEach((state_) => {
            // let pattern_ = patterns[index]
            this.AddNode(state_, action)
        })
    }



    async Play_Edges(leaf_node_result, gameover_node_result){
        for(let edge_index = 0; edge_index < this.edges.length; edge_index++){
            let edge_ = this.edges[edge_index]
            let [simulation_result_leaf, simulation_result_gameover] = await edge_.Play()
            leaf_node_result.push(...simulation_result_leaf)
            gameover_node_result.push(...simulation_result_gameover)
        }
    }



    AddNode(state, action) {
        let edge = new Edge(this.machine)

        edge.CreateNode(this.agent_index, state, action, this.machine, this.life - 1, this.state_branch_limit, this.action_branch_limit, this)

        this.edges.push(edge)

        return edge.Get_ToNode()
    }

}