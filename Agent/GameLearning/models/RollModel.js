// import * as tf from '@tensorflow/tfjs'
// import os from "os"
// os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

// import os from "os"



import * as tf from '@tensorflow/tfjs-node-gpu';

import { Random } from "random-js";
const random = new Random();

function softmax_cross_entropy_with_logits(y_true, y_pred){
    
	let p = y_pred
	let pi = y_true

	// let zero = tf.zerosLike(pi)
    let ones = tf.onesLike(pi)
	let where = tf.equal(pi, ones)

	// let negatives = tf.fill(pi.shape, -100.0) 
    let zeros = tf.zerosLike(pi)

	p = tf.where(where, zeros, p)

	// let loss = tf.nn.softmax_cross_entropy_with_logits(labels = pi, logits = p)

    let loss = tf.losses.softmaxCrossEntropy(pi, p)

    return loss
}



export default class RollModel {
    constructor(model_ = null) {
        this.model_ = model_

        if (this.model_ == null) {

            let rolled_dices_input = [
                tf.input({ shape: [5], name: "weapon-0" }),
                tf.input({ shape: [1], name: "mark-0" }),
                tf.input({ shape: [5], name: "weapon-1" }),
                tf.input({ shape: [1], name: "mark-1" }),
                tf.input({ shape: [5], name: "weapon-2" }),
                tf.input({ shape: [1], name: "mark-2" }),
                tf.input({ shape: [5], name: "weapon-3" }),
                tf.input({ shape: [1], name: "mark-3" }),
                tf.input({ shape: [5], name: "weapon-4" }),
                tf.input({ shape: [1], name: "mark-4" }),
                tf.input({ shape: [5], name: "weapon-5" }),
                tf.input({ shape: [1], name: "mark-5" })
            ]
        
            let null_input = [
                tf.input({ shape: [5], name: "weapon-null" }),
                tf.input({ shape: [1], name: "mark-null" })]
        
            let state_input = tf.input({ shape: [60], name: "state" })
        
            let conc_input = tf.layers.concatenate({ name: "conc-input" }).apply([state_input, ...rolled_dices_input])
        
        
            let tmp = conc_input
            tmp = tf.layers.dense({ units: 64, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-5" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-4" }).apply(tmp)
            // tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-3" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            tmp = tf.layers.dense({ units: 128, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-2" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            tmp = tf.layers.dense({ units: 64, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-1" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.1}).apply(tmp)
            let hidden = tf.layers.dense({ units: 16, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "hidden-0" }).apply(tmp)
        
        
            let layers = new Array(32).fill(null)
            // for (let i = 0; i < 6; i++) {
            //     let conc_layer = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, rolled_dices_input[2 * i], rolled_dices_input[2 * i + 1]])
        
            //     let tmp = conc_layer
            //     tmp = tf.layers.dense({ units: 256, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `dice-${i}_action-2` }).apply(tmp)
            //     tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            //     tmp = tf.layers.dense({ units: 256, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `dice-${i}_action-1` }).apply(tmp)
            //     tmp = tf.layers.dropout({rate : 0.1}).apply(tmp)
            //     layers[i] = tf.layers.dense({ units: 1, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "sigmoid", name: `dice-${i}_action-0` }).apply(tmp)
            // }
        
        
            // let null_weapon = tf.layers.inputLayer({ inputShape: [5], name: "weapon-null" }).apply(tf.tensor1d[0,0,0,0,0,0])
            // let null_mark = tf.layers.inputLayer({ inputShape: [1], name: "mark-null" }).apply(tf.tensor1d([0]))
        
            for (let mask_ = 0; mask_ < 64; mask_++) {
                let bit_mask = mask_.toString(2)
                bit_mask = bit_mask.padStart(6, "0")
        
                let selected_dice_layer = new Array(6).fill(null)
                for(let bit_ = 0; bit_ < 6; bit_++){
                    if(bit_mask[bit_] == "1"){
                        // selected_dice_layer[bit_] = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, rolled_dices_input[2 * i], rolled_dices_input[2 * i + 1]])
                        selected_dice_layer[bit_ * 2] = rolled_dices_input[2 * bit_]
                        selected_dice_layer[bit_ * 2 + 1] =  rolled_dices_input[2 * bit_ + 1]
                    }
                    else{
                        selected_dice_layer[bit_ * 2] = null_input[0]
                        selected_dice_layer[bit_ * 2 + 1] = null_input[1]
                    }
                }
        
        
                tmp = tf.layers.concatenate({name : `select-${bit_mask}-Conc`}).apply([hidden, ...selected_dice_layer])
        
                // tmp = tf.layers.dense({ units: 32, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `select-${bit_mask}-IV` }).apply(tmp)
                // tmp = tf.layers.dense({ units: 32, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `select-${bit_mask}-III` }).apply(tmp)
                tmp = tf.layers.dense({ units: 32, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `select-${bit_mask}-II` }).apply(tmp)
                tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
                tmp = tf.layers.dense({ units: 16, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: `select-${bit_mask}-I` }).apply(tmp)
                layers[mask_] = tf.layers.dropout({rate : 0.3, name : `select-${bit_mask}`}).apply(tmp)
                // layers[mask_] = 
        
            }
        
            tmp = tf.layers.concatenate().apply([...layers])
            let action = tf.layers.dense({ units: 64, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:"softmax", name: "output-policy"}).apply(tmp)

            tmp = hidden
            // tmp = tf.layers.dense({ units: 128, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "critic-3" }).apply(tmp)
            // tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            tmp = tf.layers.dense({ units: 128, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "critic-2" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.3}).apply(tmp)
            tmp = tf.layers.dense({ units: 64, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "relu", name: "critic-1" }).apply(tmp)
            tmp = tf.layers.dropout({rate : 0.1}).apply(tmp)
            let critic = tf.layers.dense({ units: 1, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation: "sigmoid", name: "output-value" }).apply(tmp)
        
            // let output = tf.layers.concatenate().apply([action, critic])
            let output = [action, critic]
            this.instance = tf.model({ inputs: [state_input, ...rolled_dices_input, ...null_input], outputs: output });

            

            // this.instance.compile({ loss: { "output-value": "meanSquaredError", "output-policy": softmax_cross_entropy_with_logits }, optimizer: "sgd" });
            // this.instance.compile({ loss: { "output-value": "meanSquaredError", "output-policy": "categoricalCrossentropy" }, optimizer: "sgd" });
            this.instance.compile({ loss: { "output-value": "meanSquaredError", "output-policy": "categoricalCrossentropy" }, optimizer: "adam" });

        
            // this.instance.summary()

        }
        else {
            console.log(this.model_)
            this.ready = tf.loadLayersModel(this.model_)
            this.ready.then(res => {
                this.instance = res;
                console.log("model is loaded")
                this.instance.compile({ loss: 'categoricalCrossentropy', optimizer: "sgd", metrics: ["mae", "mse"] });
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

        // raw_data.heal /= 15.0
        // raw_data.damage /= 15.0

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
        return tf.tensor2d([state])

    }


    Parse_RolledDice_Single(rolled_dice){
        let parsed_rolled_dices = {
            weapon : [new Array(5).fill(0),new Array(5).fill(0),new Array(5).fill(0),new Array(5).fill(0),new Array(5).fill(0),new Array(5).fill(0)],
            mark : new Array(6).fill(0)
        }

        const weapon_dictionary = {
            "axe" : 0,
            "arrow" : 1,
            "helmet" : 2,
            "shield" : 3,
            "steal" : 4
        }

        for (let i = 0; i < 6; i++) {
            let target_weapons = rolled_dice.weapon
            let target_marks = rolled_dice.mark


            if (target_weapons[i] != null) {
                let weapon_index = weapon_dictionary[`${target_weapons[i]}`]
                parsed_rolled_dices.weapon[i][weapon_index] = 1
            }

            if(target_marks[i] == true)
                parsed_rolled_dices.mark[i] = 1

        }

        return parsed_rolled_dices
    }



    Serialize_RolledDice_Single(parsed_rolled_dices){
        let arr = []

        for (let i = 0; i < 6; i++) {
            arr.push(parsed_rolled_dices.weapon[i])
            arr.push([parsed_rolled_dices.mark[i]])

            // arr.push(parsed_rolled_dices.weapon[i], [parsed_rolled_dices.mark[i]])
        }

        arr.push([0, 0, 0, 0, 0])
        arr.push([0])

        return arr
    }


    Parse_Chosen(chosen, winrate){
        let ret = new Array(64).fill(0)

        let two_value = 1
        let index = 0
        for (let i = 0; i < 6; i++) {
            if (chosen[i] == true) {
                index += two_value
            }
            two_value *= 2
        }

        ret[index] = 1

        // ret.push(winrate)

        return ret


        // let ret = new Array(6).fill(0)
        // for(let i=0; i<6; i++){
        //     if(chosen[i] == true)
        //         ret[i] = 1
        //     else
        //         ret[i] = 0
        // }

        // return ret
    }



    Tensor_RolledDice_Single(rolled_dices){
        let arr = []

        for (let i = 0; i < 7; i++) {
            arr.push(tf.tensor2d([rolled_dices[2 * i]]))
            arr.push(tf.tensor2d([rolled_dices[2 * i + 1]]))
        }
        
        // arr.push(tf.tensor2d([[0, 0, 0, 0, 0]]))
        // arr.push(tf.tensor2d([[0]]))

        return arr
    }


    Append_ForceSyncs(raw_datas, depth) {



    }




    // avatar의 roll 차례에만 predict가 요청됨
    Trim_Data_Single(state, rolled_dices) {
        // console.log(arguments)

        let parsed_state = this.Parse_State(state)
        let serialized_state = this.Serialize_State_Single(parsed_state)
        let tensor_state = this.Tensor_State_Single(serialized_state)
        // console.log(serialized_state)


        let parsed_rolled_dices = this.Parse_RolledDice_Single(rolled_dices)
        let serialized_rolled_dices = this.Serialize_RolledDice_Single(parsed_rolled_dices)
        let tensor_rolled = this.Tensor_RolledDice_Single(serialized_rolled_dices)
        // console.log(serialized_rolled_dices)

        // let serialized_data = serialized_state.concat(serialized_rolled_dices)
        let serialized_data = [tensor_state, ...tensor_rolled]

        return serialized_data

    }



    async Predict(state, rolled_dices){
        let serialized_data = this.Trim_Data_Single(state, rolled_dices)
        // console.log(serialized_data)

        
        // let start_ = performance.now()
        let ret = this.instance.predict(serialized_data)
        // let end_ = performance.now()

        // console.log("running time : ", end_ - start_)

        // console.log(ret)
        ret = await ret.data()

        // console.log(ret)

        let probs = ret.slice(0, 64)
        let critic = ret[64]
        // console.log(probs, critic)

        return [probs, critic]
    }


    Fit(states, rolled_weapons, rolled_marks, actions, winrates) {

        // actions.forEach(action__=>{
        //     console.log(action__.slice(-1))
        // })

        // return 
        // console.log(arguments)
        // let winrates_ = tf.tensor1d(winrates)

        let batch_cnt = states.length
        console.log("batch cnt : ", batch_cnt)


        let rolled_tensor = new Array(14)
        for (let i = 0; i < 14; i++) {
            rolled_tensor[i] = new Array(batch_cnt)
        }


        for (let i = 0; i < batch_cnt; i++) {
            rolled_tensor[0][i] = rolled_weapons[i][0]
            rolled_tensor[1][i] = rolled_marks[i][0]
            
            rolled_tensor[2][i] = rolled_weapons[i][1]
            rolled_tensor[3][i] = rolled_marks[i][1]
            
            rolled_tensor[4][i] = rolled_weapons[i][2]
            rolled_tensor[5][i] = rolled_marks[i][2]
            
            rolled_tensor[6][i] = rolled_weapons[i][3]
            rolled_tensor[7][i] = rolled_marks[i][3]
            
            rolled_tensor[8][i] = rolled_weapons[i][4]
            rolled_tensor[9][i] = rolled_marks[i][4]
            
            rolled_tensor[10][i] = rolled_weapons[i][5]
            rolled_tensor[11][i] = rolled_marks[i][5]
            
            rolled_tensor[12][i] = rolled_weapons[i][6]
            rolled_tensor[13][i] = rolled_marks[i][6]
            
        }

        let states_ = tf.tensor2d(states)

        let rolled_tensor_ = new Array(14)

        for (let i = 0; i < 14; i++) {
            rolled_tensor_[i] = tf.tensor2d(rolled_tensor[i])
        }

        let actions_ = tf.tensor2d(actions)
        let winrates_ = tf.tensor1d(winrates)
        
        let promise_ = this.instance.fit([states_, ...rolled_tensor_], [actions_, winrates_], {
            epochs: 5, validationSplit: 0.9, shuffle: true, verbose: 1
        })


        return promise_

    }


    Load(){
        
    }


    Save(url_ = "file://ml_000") {
        let promise_ = this.instance.save(url_)

        return promise_
    }


    Fit_(logs, win, score) {

    }



    

}