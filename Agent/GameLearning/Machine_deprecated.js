import { Random } from "random-js"
import Tree from "./Tree.js";
import fs from "fs"
import AvailableGodFavors from "./Util/AvailableGodFavors.js";


const WIN = 0
const LOSE = 1
const DRAW = 2
const ACTIVE = 3
const NODE = 4


const w_tmp = fs.createWriteStream("./tmp000.txt")


const empty_godfavor = {
    preparedGodFavor: { godfavorIndex: -1, level: -1, godfavorNameIndex: -1 },
    extra: null,
    input: null
}

function createNDimArray(dimensions) {
    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        var newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
    } else {
        return undefined;
    }
}


const random = new Random();


const weapons = ["arrow", "axe", "helmet", "shield", "steal"]
const dice_weapons = ["axe", "axe", "arrow", "helmet", "shield", "steal"]


export default class Machine{
    constructor(simulator, model = null, model_roll, model_godfavor, w_streams){

        global.node_cnt = 0
        global.gameover = 0
        global.simulation_cnt = 0
        global.duplicated_state = 0
        global.attached_edge = 0

        this.model = model
        this.model_roll = model_roll
        this.model_godfavor = model_godfavor
        // this.cache = createNDimArray([16, 26, 16, 26, 4, 3, 4, 3, 2])
        this.cache = new Map()
        let initial_state = this.Create_Initial_State()

        this.node_life = 3
        this.state_branch_limit = 3
        this.action_branch_limit = 2


        this.w_streams = w_streams
        
        this.w_roll_state = this.w_streams[0]
        this.w_roll_rolled_weapon = this.w_streams[1]
        this.w_roll_rolled_mark = this.w_streams[2]
        this.w_roll_action = this.w_streams[3]
        this.w_roll_winrate = this.w_streams[4]

        this.w_godfavor_state = this.w_streams[5]
        this.w_godfavor_avaialable_name = this.w_streams[6]
        this.w_godfavor_avaialable_level = this.w_streams[7]
        this.w_godfavor_action = this.w_streams[8]
        this.w_godfavor_winrate = this.w_streams[9]

        this.w_result_state = this.w_streams[10]
        this.w_result_action = this.w_streams[11]
        this.w_result_winrate = this.w_streams[12]

        // this.w_states = fs.createWriteStream("./states.txt")
        // this.w_actions = fs.createWriteStream("./actions.txt")
        // this.w_results = fs.createWriteStream("./GameLearning/learning_data/result/score.txt")
        // this.w_results = fs.createWriteStream("./dfdfdf.txt")



        this.tree = new Tree(0, initial_state, this, this.node_life, this.state_branch_limit, this.action_branch_limit, this.w_streams)
        this.simulator = simulator

    }



    async Power() {
        

        let run_start = performance.now()

        // return;
        let start_ = performance.now()
        let [leaf_node_states, gameover_node_states] = await this.tree.Play()

        // let filtered_leaf_states = this.States_Filter(leaf_node_states, 4)
        
        console.log("simulation cnt : ", global.simulation_cnt)

        let end_ = performance.now()
        console.log("running time : ", end_ - start_)
        console.log("node cnt : ", global.node_cnt)
        console.log("gameover : ", global.gameover)
        console.log("중복 :", global.duplicated_state)
        console.log("==============================\n")

        // if(gameover_node_states.length > 0){
        //     gameover_node_states[gameover_node_states.length - 1].BackLog()
        // }
        // return;

        // let leaf_node_states_recursive = [leaf_node_states, [], [], [], []]
        let before_leaf_node_states = leaf_node_states
        let after_leaf_node_states = []

        let time_step_length = 5

        this.Get_Balanced_Leaf_Node(before_leaf_node_states)

        // console.log(leaf_node_states_recursive[0])
        for (let i = 1; i < time_step_length; i++) {
            // console.log("simulation cnt : ", global.simulation_cnt)
            let start_ = performance.now()


            if (before_leaf_node_states.length > 5) {
                before_leaf_node_states.sort((a, b) => { 
                    return (a.avatar.health - a.opponent.health) - ( b.avatar.health - b.opponent.health)
                })
        
            }

            let simulation_cnt = Math.min(5, before_leaf_node_states.length)
            let unit_length = Math.floor(before_leaf_node_states.length / (simulation_cnt))

            if(unit_length == 0)
                break;

            

            let leaf_node_promises = []

            // console.log("target size : ", before_leaf_node_states.length)
            for (let j = 0; j < simulation_cnt; j++) {

                let target_index = j * unit_length + Math.floor(unit_length / 2)
                // console.log("target index : ", target_index)

                // console.log("selected index : ", j * unit_length)
                // let [leaf_node_result, gameover_node_result] = await this.tree.Play_Node(before_leaf_node_states[target_index])

                let [leaf_node_result, gameover_node_result] = await this.tree.Play_Node(before_leaf_node_states[target_index])


                after_leaf_node_states.push(...leaf_node_result)



                // leaf_node_promises.push(promise_)

                // console.log(result_states)
                // after_leaf_node_states.push(...leaf_node_result)
                // indexes.push(j * unit_length)



                // if (i == time_step_length - 1 && j == simulation_cnt - 1 && gameover_node_result.length > 0) {
                //     let random_index = random.integer(0, gameover_node_result.length - 1)
                //     gameover_node_result[random_index].BackLog()
                // }
            }


            
            // let res = await Promise.all(leaf_node_promises)
            // res.forEach(([leaf_node_result, gameover_node_result], j)=>{
            //     after_leaf_node_states.push(...leaf_node_result)


            // })



            // return


            // console.log(leaf_node_states_recursive[i])

            let end_ = performance.now()

            console.log("running time : ", end_ - start_)
            console.log("node cnt : ", global.node_cnt)
            console.log("gameover : ", global.gameover)
            console.log("중복 :", global.duplicated_state)
            console.log("==============================\n")

            before_leaf_node_states = after_leaf_node_states
            after_leaf_node_states = []
            // console.log(indexes)
            // indexes = []
        }


        let run_end = performance.now()
        console.log("[[ total running time ]] : ", run_end - run_start)


        // this.w_streams.forEach(stream_ => {
        //     stream_.write("[")
        // })


        this.tree.Traversal()

        
        // this.w_streams.forEach(stream_ => {
        //     stream_.write("]")
        // })

        // console.log(this.tree.root.edges[0].node_to.state.situation.logs[3].situation.rolled)
        // console.log(this.tree.root.edges[0].node_to.state.situation.logs[3].situation.chosen)


        // this.model_roll.Save()
    }



    Get_Balanced_Leaf_Node(leaf_nodes){
        let nodes = [...leaf_nodes]

        nodes.sort((a, b) => { 
            return (a.avatar.health - a.opponent.health) - ( b.avatar.health - b.opponent.health)
        })

        nodes.forEach(node_=>{
            w_tmp.write(`${node_.avatar.health} , ${node_.opponent.health}`)
            w_tmp.write(`\n\n`)
        })
        
        // w_tmp.write(J)

    }


    // gameover가 아닌 node만을 골라서 게임을 재시작한다
    // 4개의 노드를 고른 후 시뮬레이션을 재시작한다
    // 미선택 노드들은 health와 token 차이를 분석하고 점수를 매긴다
    States_Filter(states, filtering_cnt){
        // console.log(leaf_node_states[5])

        let states_length = states.length
        let ret_
        if(states_length > filtering_cnt){
            ret_ = [...states.slice(0, filtering_cnt / 2), ...states.slice(-filtering_cnt / 2)]
        }
        else{
            ret_ = states
        }

        return ret_
    }


    Operate_Cache(state, action, op, scores = null){
        let hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order

        hp0 = state.avatar.health
        token0 = state.avatar.token
        // token0 = Math.floor(state.avatar.token / 2)

        hp1 = state.opponent.health
        token1 = state.opponent.token
        // token1 = Math.floor(state.opponent.token / 2)
        
        godfavor0 = 3
        level0 = 0

        godfavor1 = 3
        level1 = 0

        if(action != null){
            if(action.avatar){
                godfavor0 = action.avatar.preparedGodFavor.godfavorIndex
                level0 = action.avatar.preparedGodFavor.level

                if(godfavor0 == -1){
                    godfavor0 = 3
                    level0 = 0
                }
            }

            if(action.opponent){
                godfavor1 = action.opponent.preparedGodFavor.godfavorIndex
                level1 = action.opponent.preparedGodFavor.level

                if(godfavor1 == -1){
                    godfavor1 = 3
                    level1 = 0
                }

            }
        }

        // round = state.situation.round
        // round = 0
        order = state.situation.order[0]


        let args_ = [hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order]

        switch(op){
            case "GET":
                return this.Get_Cache(...args_)
                break;

            case "SET":
                return this.Set_Cache(...args_, scores)
                break;

            case "INCR":
                return this.Incr_Cache(...args_, scores)
                break;

            case "ACTIVE":
                // this.Active_Cache(...args_)
                break;
        }

    }


    Get_Cache(hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order){
        // console.log(round)
        // global.order_[order]++

        let key = JSON.stringify({hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order})

        let check = this.cache.get(key)

        // let check = this.cache[hp0][token0][hp1][token1][godfavor0][level0][godfavor1][level1][order]
        // return null
        if (check == undefined) {
            // this.cache[hp0][token0][hp1][token1][order] = [0, 0, 0]
            return null
        }
        else {
            global.duplicated_state++
            return check
        }
    }


    Set_Cache(hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order, update_scores){

        let key = JSON.stringify({hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order})

        // let scores = this.cache[hp0][token0][hp1][token1][godfavor0][level0][godfavor1][level1][order]
        let scores = this.cache.get(key)

        if (scores == undefined) {
            this.cache.set(key, [0, 0, 0])
            scores = this.cache.get(key)
            // this.cache[hp0][token0][hp1][token1][godfavor0][level0][godfavor1][level1][order] = [0, 0, 0]
            // scores = this.cache[hp0][token0][hp1][token1][godfavor0][level0][godfavor1][level1][order] 
        }

        scores[WIN] = update_scores[WIN]
        scores[LOSE] = update_scores[LOSE]
        scores[DRAW] = update_scores[DRAW]
        // scores[ACTIVE] = update_scores[ACTIVE]
        // scores[NODE] = update_scores[NODE]

        // console.log(scores)

    }


    Incr_Cache(hp0, token0, hp1, token1,godfavor0, level0, godfavor1, level1, order, incr_scores){
        
        let key = JSON.stringify({hp0, token0, hp1, token1, godfavor0, level0, godfavor1, level1, order})

        // let scores = this.cache[hp0][token0][hp1][token1][godfavor0][level0][godfavor1][level1][order]
        // console.log(scores)
        // console.log(scores)
        // console.log(arguments)
        // console.log("~~~~~~~~~~~")
        
        let scores = this.cache.get(key)

        // try{
        scores[WIN] += incr_scores[WIN]
        scores[LOSE] += incr_scores[LOSE]
        scores[DRAW] += incr_scores[DRAW]

        // }
        // catch(err){
        //     console.log(arguments)
        //     console.log(scores)
        // }
    }


    // Active_Cache(hp0, token0, hp1, token1, godfavor, level, order){
    //     let scores = this.cache[hp0][token0][hp1][token1][godfavor][level][order]
    //     scores[ACTIVE] = 1
    // }



    Play(state, action, agent_index){
        return this.simulator.Run(state, action, agent_index)
    }


    // goal_state 될 수 있는 state들을 생성하여 반환하는 함수
    // create_per_roll : 각각의 roll 마다 생성되는 case의 갯수
    Create_Rollphase_States(goal_state, create_per_branch, life, turn_index, cache){
        if(life < 0)
            return [];

        let state_key = JSON.stringify(goal_state)
        if(cache.has(state_key)){
            // console.log("중복케이스")
            return [];
        }
        else{
            cache.add(state_key)
        }

        let ret = []

        for (let i = 0; i < create_per_branch; i++) {
            let new_state = JSON.parse(JSON.stringify(goal_state))
            new_state.situation.turn--
    
            const weapons__ = ["axe", "arrow", "helmet", "shield", "steal", "mark"]
            let turn_user = undefined
            if (new_state.situation.order[0] == turn_index)
                turn_user = "avatar"
            else
                turn_user = "opponent"
    
            let user_info = new_state[`${turn_user}`]
            let reduced_weapon = {
                // "axe" : random.integer(0, user_info.dices.axe),
                // "arrow" : random.integer(0, user_info.dices.arrow),
                // "helmet" : random.integer(0, user_info.dices.helmet),
                // "shield" : random.integer(0, user_info.dices.shield),
                // "steal" : random.integer(0, user_info.dices.steal),
                // "mark" : random.integer(0, user_info.dices.mark),
            }

            weapons__.forEach(weapon__=>{
                reduced_weapon[`${weapon__}`] = random.integer(0, user_info.dices[`${weapon__}`])
                user_info.dices[`${weapon__}`] -= reduced_weapon[`${weapon__}`]
            })

            user_info.dices.mark = Math.min(user_info.dices.mark, 6 - user_info.dices.axe)
            user_info.dices.mark = Math.min(user_info.dices.mark,
                user_info.dices.arrow + user_info.dices.helmet + user_info.dices.shield + user_info.dices.steal)


            if(cache.has(JSON.stringify(new_state)) != true){
                // console.log(cache.has(JSON.stringify(new_state)))
                // console.log(user_info.dices)
                // console.log(new_state.situation)

                // let rolled_cnt = 



                ret.push(new_state)
            }
            
            let states_ = this.Create_Rollphase_States(new_state, create_per_branch, life - 1, 1 - turn_index, cache)

            ret.push(...states_)
        }

        return ret

    }


    // node를 최대 4개 선정한다
    // avatar와 opponent가 각각 유리한 경우 2개씩
    // 너무 극심하게 차이가 나는 경우는 제외
    Create_Initial_State() {
        let state_ = {
            avatar: {
                health: 15, token: 0,
                godFavors: [6, 12, 17],
                dices: null,
                dices_: {
                    weapon: ["axe", "axe", "axe", "axe", "axe", "axe"],
                    mark: [false, false, false, false, false, false]
                }
            },
            opponent: {
                health: 15, token: 0,
                godFavors: [0, 2, 7],
                // godFavors: [2, 13, 17],
                dices: null,
                dices_: {
                    weapon: ["axe", "axe", "axe", "axe", "axe", "axe"],
                    mark: [false, false, false, false, false, false]
                }
            },
            situation: {
                order: [0, 1],
                round: 0,
                turn : 0
            }
        }

        state_.avatar.dices = this.Create_Random_Dice("mark")
        state_.avatar.dices_ = this.Create_Parsed_Dices(state_.avatar.dices)

        state_.opponent.dices = this.Create_Random_Dice("mark")
        state_.opponent.dices_ =  this.Create_Parsed_Dices(state_.opponent.dices)


        this.Operate_Cache(state_, "SET", [0, 0, 0])


        return state_

    }


    // 주어진 state에서 weapons만 다른 state들을 대량 생산한다
    async Create_Random_State_Multiple(state, cnt, agent_index){
        let ret_states = []

        let logs = []
        ret_states = await this.Create_Roll_Process(state, agent_index, cnt, 0, logs)
        logs = null

        // random.shuffle(weapons)
        // let avatar_weapons = ["mark", ...weapons]

        // random.shuffle(weapons)
        // let enemy_weapons = ["mark", ...weapons]

        // // let patterns = []

        // if(state.situation.round < 3){
        //     avatar_weapons = ["mark"]
        //     enemy_weapons = ["mark"]
        //     cnt = 1
        // }


        // for (let i = 0; i < cnt; i++) {
        //     for (let j = 0; j < cnt; j++) {
        //         let new_state = JSON.parse(JSON.stringify(state))
        //         new_state.avatar.dices = this.Create_Random_Dice(avatar_weapons[i])
        //         new_state.avatar.dices_ = this.Create_Parsed_Dices(new_state.avatar.dices)

        //         new_state.opponent.dices = this.Create_Random_Dice(enemy_weapons[j])
        //         new_state.opponent.dices_ =  this.Create_Parsed_Dices(new_state.opponent.dices)

        //         ret_states.push(new_state)

        //         patterns.push([avatar_weapons[i], enemy_weapons[j]])
        //     }
        // }


        return ret_states
    }



    
    async Create_Random_State_Multiple_NoLog(state, cnt, agent_index){
        let ret_states = []

        // let logs = []
        // ret_states = await this.Create_Roll_Process(state, agent_index, cnt, 0, logs)
        // logs = null

        random.shuffle(weapons)
        let avatar_weapons = ["mark", ...weapons]

        random.shuffle(weapons)
        let enemy_weapons = ["mark", ...weapons]

        // let patterns = []

        if(state.situation.round < 3){
            avatar_weapons = ["mark"]
            enemy_weapons = ["mark"]
            cnt = 1
        }


        for (let i = 0; i < cnt; i++) {
            for (let j = 0; j < cnt; j++) {
                let new_state = JSON.parse(JSON.stringify(state))
                new_state.avatar.dices = this.Create_Random_Dice(avatar_weapons[i])
                new_state.avatar.dices_ = this.Create_Parsed_Dices(new_state.avatar.dices)

                new_state.opponent.dices = this.Create_Random_Dice(enemy_weapons[j])
                new_state.opponent.dices_ =  this.Create_Parsed_Dices(new_state.opponent.dices)

                ret_states.push(new_state)

                // patterns.push([avatar_weapons[i], enemy_weapons[j]])
            }
        }


        return ret_states
    }



    Create_State(){

    }



    // Create_Roll_Process(state, turn_index){
    //     let processes = []  // 라운드별 절차


    //     for(let round = 0; round < 4; round++){
    //         let turn_user = undefined
    //         if (new_state.situation.order[0] == turn_index)
    //             turn_user = "avatar"
    //         else
    //             turn_user = "opponent"

    //         let chosen_cnt = state[`${turn_user}`].dices["axe"] + state[`${turn_user}`].dices["arrow"] + state[`${turn_user}`].dices["helmet"] + state[`${turn_user}`].dices["shield"] + state[`${turn_user}`].dices["steal"]
    //         let rolled_cnt = 6 - chosen_cnt

    //         let rolled_dices = this.Create_RolledDices(rolled_cnt)
            
    //         let cmd = {
    //             rolled : rolled_dices,
    //             chosen : chosen_dices
    //         }
    //     }
    // }


    // round 4, 5 에서는 모든 주사위 강제 선택시키기 (로그에 추가 안해도 됨)
    async Create_Roll_Process(state, agent_index, branch_limit, turn, logs){
        let processes_ = []

        // if(round == 4){
        //     state.situation.logs = [...logs]
        //     return [state]
        // }

        // if(turn > 2)
        //     branch_limit = 1

        if(state.avatar.dices.empty == 0 && state.opponent.dices.empty == 0){
            state.situation.logs = [...logs]
            return [state]
        }


        let turn_user = undefined
        if(state.situation.order[0] == agent_index)
            turn_user = "avatar"
        else if(state.situation.order[0] ==  1 - agent_index)
            turn_user = "opponent"

        let before_state = JSON.parse(JSON.stringify(state))
        // let after_state = JSON.parse(JSON.stringify(state))
        // after_state.situation.round++


        let rolled_cnt = before_state[`${turn_user}`].dices.empty 
        let rolled_dices = this.Create_RolledDices(before_state[`${turn_user}`].dices_)
        // console.log(rolled_cnt, rolled_dices)

        
        for (let i = 0; i < branch_limit; i++) {

            let after_state = JSON.parse(JSON.stringify(state))
            after_state.situation.turn++

            let choose_mask = undefined
            if(turn < 4){
                choose_mask = await this.Predict_Roll(after_state, rolled_dices, turn_user)
            }
            else{
                choose_mask = [true, true, true, true, true, true]
                after_state[`${turn_user}`].dices_.weapon.forEach((weapon_, index_)=>{
                    if(weapon_ != null)
                        choose_mask[index_] = false
                })
            }


            choose_mask.forEach((mask_, index) => {
                if (mask_ == true && after_state[`${turn_user}`].dices_.weapon[index] == null) {
                    let chosen_weapon = rolled_dices.weapon[index]
                    let is_mark = rolled_dices.mark[index]

                    after_state[`${turn_user}`].dices[`${chosen_weapon}`]++
                    after_state[`${turn_user}`].dices.empty--

                    after_state[`${turn_user}`].dices_.weapon[index] = chosen_weapon


                    if (is_mark == true){
                        after_state[`${turn_user}`].dices.mark++
                        after_state[`${turn_user}`].dices_.mark[index] = true
                    }
                }
            })

            let before_state_ = JSON.parse(JSON.stringify(before_state))
            before_state_.situation.chosen = choose_mask
            before_state_.situation.rolled = rolled_dices

            // processes_.push(before_state_)

            if (turn < 4)
                logs.push(before_state_)

            let ret = await this.Create_Roll_Process(after_state, 1 - agent_index, branch_limit, turn + 1, logs)

            if (turn < 4)
                logs.pop()

            processes_.push(...ret)

            if(turn >= 4)
                break;

            // console.log(ret[0].situation)
        }

        return processes_
    }



    async Predict_Roll(state, rolled_dices, turn_user){
        let state_ = JSON.parse(JSON.stringify(state))
        if(turn_user == "opponent"){
            let tmp = state_.avatar
            state_.avatar = state_.opponent
            state_.opponent = tmp
        }

        
        // let start_ = performance.now()

        // let choose_mask = [false, false, false, false, false, false]
        let choose_mask = await this.model.Predict_Roll(state_, rolled_dices)
        // await this.model_roll.Predict(state_, rolled_dices)

        // let end_ = performance.now()
        // console.log("running time : ", end_ - start_)

        return choose_mask
    }



    async Predict_Godfavor(state, avaialable_4_avatar, avaialable_4_opponent){

        // await this.model_godfavor.Predict(state, avaialable_4_avatar)
        // await this.model.Predict_Godfavor(state, avaialable_4_opponent)

    }



    Create_RolledDices(current_dices_){

        let rolled_dices = {
            weapon : [null, null, null, null, null, null],
            mark : [false, false, false, false, false, false]
        }

        random.shuffle(dice_weapons)

        for(let i=0; i<current_dices_.weapon.length; i++){
            if(current_dices_.weapon[i] == null){
                rolled_dices.weapon[i] = `${dice_weapons[i]}`
                rolled_dices.mark[i] = rolled_dices.weapon[i] != "axe" ? random.bool() : false
            }
        }

        random.shuffle(rolled_dices)

        return rolled_dices
    }



    // Create_Random_State_Single(weapon){

    // }


    Create_Parsed_Dices(dices){
        let dices_ = {
            weapon : new Array(6).fill("axe"),
            mark : new Array(6).fill(false)
        }

        let dice_face_index = 0
        for (let i = 0; i < 5; i++) {
            let weapon_name = weapons[i]
            let weapon_cnt = dices[`${weapon_name}`]
            for (let j = 0; j < weapon_cnt; j++) {
                dices_.weapon[dice_face_index] = weapon_name
                dice_face_index++
            }
        }

        let dice_mark_cnt = dices.mark
        for (let i = 0; i < 6; i++) {
            if (dices_.weapon[i] == "axe")
                continue;

            if (dice_mark_cnt == 0)
                break;

            dices_.mark[i] = true
            dice_mark_cnt--

        }


        return dices_
    }


    // 특정 무기에 특화된 주사위 조합을 만든다
    Create_Random_Dice(weapon){
        let ret = {
            axe: 0,
            arrow: 0,
            helmet: 0,
            shield: 0,
            steal: 0,
            empty: 0,
            mark: 0
        }

        // if(Math.random() < 0.1){
        //     ret.axe = 2
        //     ret.steal = 4
        // }
        // else{
        //     ret.axe = 5
        //     ret.steal = 1

        // }

        // return ret
        let random_cnt = 0;
        switch(weapon){
            case "axe":
                random_cnt = random.integer(2,3)
                break;

            case "mark":
                random_cnt = 0
                break;

            default:
                random_cnt = random.integer(1,3)
                break;
        }

        ret[`${weapon}`] = random_cnt

        let left_cnt = 6 - random_cnt
        random.shuffle(weapons)
        let i = 0
        while (true) {
            // if (weapons[i] == weapon)
            //     continue

            let new_cnt = random.integer(0, left_cnt)

            if (weapon == "mark")
                new_cnt = Math.min(new_cnt, 3)

            ret[`${weapons[i]}`] += new_cnt
            left_cnt -= new_cnt

            // console.log(left_cnt)
            if(left_cnt == 0)
                break;

            i++
            if (i == weapon.length)
                i = 0
        }

        // for (let i = 0; i < weapons.length; i++) {
        //     if(weapons[i] == weapon)
        //         continue

        //     let new_cnt = random.integer(0, left_cnt)

        //     if(weapon == "mark")
        //         new_cnt = Math.min(new_cnt, 3)

        //     ret[`${weapons[i]}`] = new_cnt
        //     left_cnt -= new_cnt
        // }

        // ret["arrow"] += left_cnt
    

        if(weapon == "mark")
            ret.mark = random.integer(4,6)
        else
            ret.mark = random.integer(1, 3)


        if(weapon != "mark" && ret[`${weapon}`] > 3)
            ret.mark = Math.min(ret.mark, 9 - ret[`${weapon}`])

        
        ret.mark = Math.min(ret.mark, 6 - ret.axe)

        return ret
    }



    async Create_Action_Multiple(state_, cnt){
        let actions_ = []
        let [avaialable_4_avatar, avaialable_4_opponent] = AvailableGodFavors(0, state_)
        // console.log(avaialable_4_avatar)
        random.shuffle(avaialable_4_avatar)
        random.shuffle(avaialable_4_opponent)

        avaialable_4_avatar = [empty_godfavor, ...avaialable_4_avatar]
        avaialable_4_opponent = [empty_godfavor, ...avaialable_4_opponent]

        let avatar_cnt = Math.min(cnt, avaialable_4_avatar.length)
        let opponent_cnt = Math.min(cnt, avaialable_4_opponent.length)

        await this.Predict_Godfavor(state_, avaialable_4_avatar, avaialable_4_opponent)

        for (let avatar_index = 0; avatar_index < avatar_cnt; avatar_index++) {
            for(let opponent_index = 0; opponent_index < opponent_cnt; opponent_index++){
                let action_single = {
                    avatar : avaialable_4_avatar[avatar_index],
                    opponent : avaialable_4_opponent[opponent_index],
                    available_avatar : avaialable_4_avatar,
                    available_opponent : avaialable_4_opponent
                }

                actions_.push(action_single)
            }
        }

        // for (let i = 0; i < cnt * cnt; i++){
        //     let ret = this.Create_Action(state_)
        //     actions_.push(ret)
        // }

        return actions_
    }


    Create_Action(state_){
        // let [avaialable_avatar, avaialable_opponent] = AvailableGodFavors(1, state_)


        return {
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


    }



    
    // action = {chosen : [6], rolled : { weapon : [6], mark : [6] }}
    Write_Data_Roll(state, rolled_dices, action, winrate){

        let parsed_state = this.model_roll.Parse_State(state)
        let s_state = this.model_roll.Serialize_State_Single(parsed_state)

        let parsed_rolled_dices = this.model_roll.Parse_RolledDice_Single(rolled_dices)
        let s_rolled_dices = this.model_roll.Serialize_RolledDice_Single(parsed_rolled_dices)


        let parsed_action = this.model_roll.Parse_Chosen(action)

        let s_rolled_weapon = new Array(7).fill(null)
        let s_rolled_mark = new Array(7).fill(null)

        for (let i = 0; i < 7; i++) {
            s_rolled_weapon[i] = s_rolled_dices[i * 2]
            s_rolled_mark[i] = s_rolled_dices[i * 2 + 1]
        }

        // console.log(s_rolled_weapon)
        // console.log(s_rolled_mark)


        this.w_roll_state.write(JSON.stringify(s_state))
        this.w_roll_rolled_weapon.write(JSON.stringify(s_rolled_weapon))
        this.w_roll_rolled_mark.write(JSON.stringify(s_rolled_mark))
        this.w_roll_action.write(JSON.stringify(parsed_action))
        this.w_roll_winrate.write(JSON.stringify(winrate))

        this.w_roll_state.write(",")
        this.w_roll_rolled_weapon.write(",")
        this.w_roll_rolled_mark.write(",")
        this.w_roll_action.write(",")
        this.w_roll_winrate.write(",")
    }



    Write_Data_Godfavor(state, available_godfavors, action, winrate){
        
        let parsed_state = this.model_godfavor.Parse_State(state)
        let s_state = this.model_godfavor.Serialize_State_Single(parsed_state)

        let parsed_godfavors = this.model_godfavor.Parse_Godfavors_Single(available_godfavors)
        let s_godfavors = this.model_godfavor.Serialize_Godfavors_Single(parsed_godfavors)

        let parsed_action = this.model_godfavor.Parse_Action(state, action, winrate)

        let s_godfavors_name = new Array(10).fill(null)
        let s_godfavors_level = new Array(10).fill(null)

        for (let i = 0; i < 10; i++) {
            s_godfavors_name[i] = s_godfavors[i * 2]
            s_godfavors_level[i] = s_godfavors[i * 2 + 1]
        }

        // console.log(s_rolled_weapon)
        // console.log(s_rolled_mark)


        this.w_godfavor_state.write(JSON.stringify(s_state))
        this.w_godfavor_avaialable_name.write(JSON.stringify(s_godfavors_name))
        this.w_godfavor_avaialable_level.write(JSON.stringify(s_godfavors_level))
        this.w_godfavor_action.write(JSON.stringify(parsed_action))
        this.w_godfavor_winrate.write(JSON.stringify(winrate))

        this.w_godfavor_state.write(",")
        this.w_godfavor_avaialable_name.write(",")
        this.w_godfavor_avaialable_level.write(",")
        this.w_godfavor_action.write(",")
        this.w_godfavor_winrate.write(",")



        // this.w_godfavor_state = this.w_streams[5]
        // this.w_godfavor_avaialable_name = this.w_streams[6]
        // this.w_godfavor_avaialable_level = this.w_streams[7]
        // this.w_godfavor_action = this.w_streams[8]
        // this.w_godfavor_winrate = this.w_streams[9]

    }



    Serialize_Data_Godfavor(state, godfavor, winrate){





    }



    Serialize_Data_Result(state, action, winrate){


    }


}