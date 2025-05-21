// import * as tf from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs-node-gpu';

import { Random } from "random-js";
const random = new Random();

export default class GodfavorModel {
    constructor(model_ = null) {
        this.model_ = model_

        if (this.model_ == null) {

            let godfavors_input = [
                tf.input({ shape: [20], name: "godfavor-name-0" }),
                tf.input({ shape: [1], name: "godfavor-level-0" }),
                tf.input({ shape: [20], name: "godfavor-name-1" }),
                tf.input({ shape: [1], name: "godfavor-level-1" }),
                tf.input({ shape: [20], name: "godfavor-name-2" }),
                tf.input({ shape: [1], name: "godfavor-level-2" }),
        
                tf.input({ shape: [20], name: "godfavor-name-3" }),
                tf.input({ shape: [1], name: "godfavor-level-3" }),
                tf.input({ shape: [20], name: "godfavor-name-4" }),
                tf.input({ shape: [1], name: "godfavor-level-4" }),
                tf.input({ shape: [20], name: "godfavor-name-5" }),
                tf.input({ shape: [1], name: "godfavor-level-5" }),
        
                tf.input({ shape: [20], name: "godfavor-name-6" }),
                tf.input({ shape: [1], name: "godfavor-level-6" }),
                tf.input({ shape: [20], name: "godfavor-name-7" }),
                tf.input({ shape: [1], name: "godfavor-level-7" }),
                tf.input({ shape: [20], name: "godfavor-name-8" }),
                tf.input({ shape: [1], name: "godfavor-level-8" }),
        
                tf.input({ shape: [20], name: "godfavor-name-9" }),
                tf.input({ shape: [1], name: "godfavor-level-9" }),
            ]
        
            let state_input = tf.input({ shape: [60], name: "state__" })
        
            let tmp = state_input
            tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-5" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-4" }).apply(tmp)
            // tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-3" }).apply(tmp)
            // tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-2" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
            tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-1" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            let hidden = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-0" }).apply(tmp)
        
        
            let layers = new Array(10).fill(null)
            for (let i = 0; i < 10; i++) {
                let conc_layer = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, godfavors_input[2 * i], godfavors_input[2 * i + 1]])
        
                let tmp = conc_layer
                // tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-III` }).apply(tmp)
                // tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
                tmp = tf.layers.dense({ units: 32, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-II` }).apply(tmp)
                tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
                tmp = tf.layers.dense({ units: 32, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-I` }).apply(tmp)
                tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
                layers[i] = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-O` }).apply(tmp)
            }
        
            tmp = tf.layers.concatenate().apply(layers)
            let godfavor_action = tf.layers.dense({ units: 10, activation: "softmax", name: "output-policy" }).apply(tmp)
        
            tmp = hidden
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-3" }).apply(tmp)
            // tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            tmp = tf.layers.dense({ units: 32, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-2" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            tmp = tf.layers.dense({ units: 32, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-1" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
            let critic = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "sigmoid", name: "output-value" }).apply(tmp)
        
            // let output = tf.layers.concatenate().apply([godfavor_action, critic])
            // this.instance = tf.model({ inputs: [state_input, ...godfavors_input], outputs: output, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });
        
            this.instance = tf.model({ inputs: [state_input, ...godfavors_input], outputs: [godfavor_action, critic] });


            this.instance.compile({ loss: { "output-value": "meanSquaredError", "output-policy": "categoricalCrossentropy" }, optimizer: "adam" });

            this.instance.summary()
        
        }
        else {
            this.ready = tf.loadLayersModel(this.model_)
            this.ready.then(res => {
                this.instance = res;
                console.log("model is loaded")
                this.instance.compile({ loss: { "output-value": "meanSquaredError", "output-policy": "categoricalCrossentropy" }, optimizer: "adam" });
            })
        }


        this.isStart = false
    }



    
    Card_CategoryEncoding(avatar_info) {
        let cards_arr = avatar_info.godFavors

        let cards_encoding = new Array(20).fill(0)
        cards_encoding[cards_arr[0]] = 1
        cards_encoding[cards_arr[1]] = 1
        cards_encoding[cards_arr[2]] = 1

        avatar_info.cards = cards_encoding
    }


    Parse_Agent_Single(agent) {
        let raw_data = JSON.parse(JSON.stringify(agent))

        // console.log(raw_data.dices.empty)

        raw_data.health /= 15.0
        raw_data.token /= 50.0

        raw_data.dices.axe /= 6.0
        raw_data.dices.arrow /= 6.0
        raw_data.dices.helmet /= 6.0
        raw_data.dices.shield /= 6.0
        raw_data.dices.steal /= 6.0
        raw_data.dices.empty /= 6.0
        raw_data.dices.mark /= 6.0

        this.Card_CategoryEncoding(raw_data)

        return raw_data
    }

    Parse_Agent_Multiple(raw_datas) {
        raw_datas.forEach(raw_data => {
            this.Parse_Agent_Single(raw_data.avatar)
            this.Parse_Agent_Single(raw_data.opponent)
        })
    }


    Parse_State(state){
        let parsed_avatar = this.Parse_Agent_Single(state.avatar)
        let parsed_opponent = this.Parse_Agent_Single(state.opponent)
        let parsed_situation = {
            order : state.situation.order[0],
            turn : state.situation.turn / 3
        }

        let parsed_state = {
            avatar : parsed_avatar,
            opponent : parsed_opponent,
            situation : parsed_situation
        }

        return parsed_state
    }



    Tensor_State_Single(state){
        return tf.tensor2d([state])
    }


    Serialize_State_Single(state) {

        let avatar_ = state.avatar
        let opponent_ = state.opponent
        let situation_ = state.situation

        let arr_ = [
            avatar_.health, avatar_.token,
            avatar_.dices.axe, avatar_.dices.arrow, avatar_.dices.helmet, avatar_.dices.shield, avatar_.dices.steal, avatar_.dices.empty, avatar_.dices.mark,
            ...avatar_.cards,
            opponent_.health, opponent_.token,
            opponent_.dices.axe, opponent_.dices.arrow, opponent_.dices.helmet, opponent_.dices.shield, opponent_.dices.steal, opponent_.dices.empty, opponent_.dices.mark,
            ...opponent_.cards,
            situation_.order, situation_.turn
        ]

        // return tf.tensor2d([arr_])
        return arr_
    }


    Serialize_State_Multiple(states) {
        // console.log(raw_datas[0].avatar.dices)
        let arr_ = []
        states.forEach(state__ => {
            let ret = this.Serialize_State_Single(state__)
            arr_.push(ret)
        })

        // console.log(arr_[0])
        let tensor_ = tf.tensor2d(arr_)
        return [tensor_, arr_]
    }


    Parse_Godfavors_Single(godfavors){
        // let parsed_godfavor = [new Array(20).fill(0), new Array(1).fill(0)]

        // let parsed_godfavor = new Array(10).fill(null)

        let parsed_godfavor = {
            godFavorNameIndex : new Array(10).fill(null),
            level : new Array(10).fill(null)
        }

        // console.log("length : ", godfavors.length)

        for (let i = 0; i < 10; i++) {
            // parsed_godfavor[i] = [new Array(20).fill(0), new Array(1).fill(0)]

            parsed_godfavor.godFavorNameIndex[i] = new Array(20).fill(0)
            parsed_godfavor.level[i] = new Array(1).fill(0)

            let godFavorNameIndex = godfavors[i].preparedGodFavor.godfavorNameIndex
            let level = godfavors[i].preparedGodFavor.level
    

            if(godFavorNameIndex != -1 && level != -1){
                parsed_godfavor.godFavorNameIndex[i][godFavorNameIndex] = 1
                parsed_godfavor.level[i][0] = level / 2
            }
        }

        return parsed_godfavor
    }



    Serialize_Godfavors_Single(parsed_godfavors) {
        let arr = []

        for (let i = 0; i < 10; i++) {
            arr.push(parsed_godfavors.godFavorNameIndex[i])
            arr.push(parsed_godfavors.level[i])
        }

        return arr
    }


    Tensor_Godfavors_Single(godfavors){
        let arr = []

        for (let i = 0; i < 10; i++) {
            arr.push(tf.tensor2d([godfavors[i * 2]]))
            arr.push(tf.tensor2d([godfavors[i * 2 + 1]]))

        }

        return arr

    }




    Parse_Action(state, action, winrate){
        let ret = new Array(10).fill(0)

        let godfavors = state.avatar.godFavors

        let godfavor_ = action.avatar.preparedGodFavor.godfavorNameIndex
        let level_ = action.avatar.preparedGodFavor.level


        for (let i = 0; i < 3; i++) {
            if (godfavor_ == godfavors[i]) {
                ret[3 * i + level_] = winrate
            }
        }

        if (godfavor_ == -1) {
            ret[0] = 1
        }

        // console.log(availables)
        // let ret = this.Parse_Godfavors_Single(availables.available_avatar)
        // ret = this.Serialize_Godfavors_Single(ret)

        return ret
    }



    Append_ForceSyncs(raw_datas, depth) {



    }




    // avatar의 roll 차례에만 predict가 요청됨
    Trim_Data_Single(state, available_godfavors) {
        // console.log(arguments)

        let parsed_state = this.Parse_State(state)
        let serialized_state = this.Serialize_State_Single(parsed_state)
        let tensor_state = this.Tensor_State_Single(serialized_state)
        // console.log(serialized_state)

        let parsed_available_godfavors = this.Parse_Godfavors_Single(available_godfavors)
        let serialized_available_godfavors = this.Serialize_Godfavors_Single(parsed_available_godfavors)
        let tensor_available_godfavors = this.Tensor_Godfavors_Single(serialized_available_godfavors)
        // console.log(serialized_rolled_dices)

        // let serialized_data = serialized_state.concat(serialized_rolled_dices)
        let serialized_data = [tensor_state, ...tensor_available_godfavors]

        return serialized_data
    }



    async Predict(state, available_godfavors){
        let serialized_data = this.Trim_Data_Single(state, available_godfavors)
        // console.log(serialized_data)

        // console.log(serialized_data)
        // let start_ = performance.now()
        let ret = this.instance.predict(serialized_data)
        // console.log(ret)
        let probs = await ret[0].data()
        let critic = await ret[1].data()


        // let probs = ret.slice(0, 10)
        // let critic = ret[10]
        // console.log(probs, critic)

        return [probs, critic]
    }


    Fit(states, available_names, available_levels, actions, winrates) {

        // console.log(arguments)

        let batch_cnt = states.length
        console.log("batch cnt : ", batch_cnt)


        let available_tensor = new Array(20)
        for (let i = 0; i < 20; i++) {
            available_tensor[i] = new Array(batch_cnt)
        }

        for (let i = 0; i < batch_cnt; i++) {
            available_tensor[0][i] = available_names[i][0]
            available_tensor[1][i] = available_levels[i][0]
            
            available_tensor[2][i] = available_names[i][1]
            available_tensor[3][i] = available_levels[i][1]
            
            available_tensor[4][i] = available_names[i][2]
            available_tensor[5][i] = available_levels[i][2]
            
            available_tensor[6][i] = available_names[i][3]
            available_tensor[7][i] = available_levels[i][3]
            
            available_tensor[8][i] = available_names[i][4]
            available_tensor[9][i] = available_levels[i][4]
            
            available_tensor[10][i] = available_names[i][5]
            available_tensor[11][i] = available_levels[i][5]
            
            available_tensor[12][i] = available_names[i][6]
            available_tensor[13][i] = available_levels[i][6]
            
            available_tensor[14][i] = available_names[i][7]
            available_tensor[15][i] = available_levels[i][7]
            
            available_tensor[16][i] = available_names[i][8]
            available_tensor[17][i] = available_levels[i][8]
            
            available_tensor[18][i] = available_names[i][9]
            available_tensor[19][i] = available_levels[i][9]    
        }

        let states_ = tf.tensor2d(states)

        let available_tensor_ = new Array(20)

        for (let i = 0; i < 20; i++) {
            available_tensor_[i] = tf.tensor2d(available_tensor[i])
        }


        
        for (let i = 0; i < 20; i++) {
            available_tensor[i] = new Array(batch_cnt)
        }



        let actions_ = tf.tensor2d(actions)
        let winrates_ = tf.tensor1d(winrates)
        
        let promise_ = this.instance.fit([states_, ...available_tensor_], [actions_, winrates_], {
            epochs: 8, validationSplit: 0.8, shuffle: true, verbose: 1
        })


        return promise_

    }


    Save(url_) {
        let promise_ = this.instance.save(url_)

        return promise_
    }





}