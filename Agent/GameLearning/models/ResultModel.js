// import * as tf from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs-node-gpu';

import { Random } from "random-js";
const random = new Random();

export default class ResultModel {
    constructor(model_ = null) {
        this.model_ = model_

        if (this.model_ == null) {

            let input_ = tf.input({ shape: [60], name: "input" })

            let tmp = input_
            tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-4" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-3" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
            tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-2" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
            tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-1" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
            tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-0" }).apply(tmp)
            tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
            let output_ = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "sigmoid", name: "output" }).apply(tmp)

            this.instance = tf.model({ inputs: input_, outputs: output_, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });

            // model.summary()

        }
        else {
            this.ready = tf.loadLayersModel(this.model_)
            this.ready.then(res => {
                this.instance = res;
                console.log("model is loaded")
                this.instance.compile({ loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });
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



    Tensor_State_Single(state){
        let tensor = tf.tensor2d([state])

        return tensor
    }



    // avatar의 roll 차례에만 predict가 요청됨
    Trim_Data_Single(state) {
        // console.log(arguments)

        let parsed_state = this.Parse_State(state)
        let serialized_state = this.Serialize_State_Single(parsed_state)
        let tensor_state = this.Tensor_State_Single(serialized_state)
        // console.log(serialized_state)


        return tensor_state
    }



    async Predict(state, available_godfavors){
        let serialized_data = this.Trim_Data_Single(state, available_godfavors)
        // console.log(serialized_data)

        // console.log(serialized_data)
        // let start_ = performance.now()
        let ret = this.instance.predict(serialized_data)
        ret = await ret.data()



        let probs = ret.slice(0, 11)
        let critic = ret[11]
        // console.log(probs, critic)

        return probs
    }


    Fit(agents) {

    }


    Save(url_) {
        let promise_ = this.instance.save(url_)

        return promise_
    }


    Fit_(logs, win, score) {

    }



}