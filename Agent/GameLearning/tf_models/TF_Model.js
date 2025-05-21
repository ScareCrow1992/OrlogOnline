

let tf = null
tf = await import("@tensorflow/tfjs-node")


// if (process.env.pm_id == undefined || process.env.pm_id == "0")
//     tf = await import("@tensorflow/tfjs-node-gpu")
// else
//     tf = await import("@tensorflow/tfjs-node")



// let tensorflow_str = "@tensorflow/tfjs-node-gpu"

// if (process.env.pm_id == undefined || process.env.pm_id == 0)
//     tensorflow_str = "@tensorflow/tfjs-node-gpu"
// else
//     tensorflow_str = "@tensorflow/tfjs"

// console.log(tensorflow_str)

// import * as tf from `${tensorflow_str}`;
// import '@tensorflow/tfjs-node';
// import * as tf from '@tensorflow/tfjs';
import fs from "fs"
import { Random } from 'random-js';

const ROLL = 0, GODFAVOR = 1


const random_ = new Random()

export default class TF_Model {
    constructor(input_size, action_size, type_) {

        this.model = null
        this.model_other = null


        this.type = type_

        let input_ = tf.input({ shape: [input_size] })
        // let mask_ = tf.input({shape : [action_size]})

        this.action_size = action_size

        this.unit_size = 4 * input_size


        // let conc_  = tf.layers.concatenate().apply([input_, mask_])

        let dropout_ = 0.15

        let tmp = input_
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu"}).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu"}).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu"}).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu"}).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)

        let embed = tmp


        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(embed)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu"}).apply(tmp)
        // tmp = tf.layers.layerNormalization({axis : 1}).apply(tmp)
        let action_output = tf.layers.dense({ units: this.action_size, activation: "softmax", name: "action_head" }).apply(tmp)

        // tmp = input_
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(embed)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.dropout({ rate: dropout_ }).apply(tmp)
        // tmp = tf.layers.dense({ units: this.unit_size, activation: "relu" }).apply(tmp)
        // tmp = tf.layers.layerNormalization({axis : 1}).apply(tmp)
        let value_output = tf.layers.dense({ units: 1, activation: "tanh", name : "value_head"  }).apply(tmp)

        this.model = tf.model({ inputs: input_, outputs: [action_output, value_output]})

        // this.model.summary()

        // this.model.compile({loss : {"action_head" : "categoricalCrossentropy" , "value_head" : "meanSquaredError"}, optimizer: "adam" })

        this.Init_Entropy_Distribution()


        // if(type_ == ROLL)
        //     this.LoadModel(41, "roll")
        // else
        //     this.LoadModel(41, "godfavor")


    }


    async Predict(states, masks){
        // console.time("predict");
        let states_tensor = tf.tensor2d(states)

        let mask_tensor = tf.tensor2d(masks)
        
        let mask_tensor_float = tf.cast(mask_tensor, "float32")


        // console.log(states_tensor.shape)

        let [actions_tensor, value_tensor] = this.model.predict(states_tensor, { verbose: 0 })


        // actions_tensor.array().then(res=>console.log(res))

        // console.log(actions_tensor.shape)
        // console.log(actions_data.length, actions_data[0].length)


        let masked_actions_tensor = tf.mul(mask_tensor_float, actions_tensor)
        // masked_actions_tensor.print()

        let sum_prob_scalar, sum_prob_scalar_, masked_actions_tensor_

        // if(this.type == GODFAVOR){
        // sum_prob_scalar = tf.sum(masked_actions_tensor, 1)
        // sum_prob_scalar_ = sum_prob_scalar.expandDims(1)
        // masked_actions_tensor_ = masked_actions_tensor.div(sum_prob_scalar_)

        // }
        // else{
        //     masked_actions_tensor_ = masked_actions_tensor
        // }

        let actions_promise = masked_actions_tensor.array()
        let value_promise = value_tensor.array()

        let [actions_arr, value_arr] = await Promise.all([actions_promise, value_promise])

        // console.timeEnd("predict");

        global.tensor_collector.push(states_tensor)
        global.tensor_collector.push(mask_tensor)
        global.tensor_collector.push(mask_tensor_float)
        global.tensor_collector.push(actions_tensor)
        global.tensor_collector.push(masked_actions_tensor)

        // if(this.type == GODFAVOR){
        // global.tensor_collector.push(masked_actions_tensor_)
        // global.tensor_collector.push(sum_prob_scalar)
        // global.tensor_collector.push(sum_prob_scalar_)
        // }

        global.tensor_collector.push(value_tensor)

        // console.log(actions_arr)
        // console.log(value_arr)
        // console.log("\n~~~~~~~~~\n")

        return [actions_arr, value_arr]
    }


    async Fit(logs, agent_cnt){

        let adam_ = tf.train.adam(0.005)

        this.model.compile({loss : {"action_head" : "categoricalCrossentropy" , "value_head" : "meanSquaredError"}, optimizer: adam_ })

        let states = logs.states
        let actions = logs.actions
        let values = logs.values
        let results = logs.results
        let masks = logs.mask

        let states_, actions_, values_, result_, mask_
        let expected_value = undefined


        let states_tensor = [], actions_tensor = [], values_tensor = [], mask_tensor = []

        for (let agent_index = 0; agent_index < agent_cnt; agent_index++) {
            states_ = states[agent_index]
            actions_ = actions[agent_index]
            values_  = values[agent_index]
            result_ = results[agent_index]
            mask_ = masks[agent_index]


            // actions_.forEach(act_ => {this.SoftMax(act_)})

            // console.log(`[[ ${agent_index} ]]\n`)
            expected_value = this.Parse_Log(values_, result_)

            // console.log("\n=================================\n")

            states_tensor.push(...states_)
            actions_tensor.push(...actions_)
            values_tensor.push(...expected_value)
            // mask_tensor.push(...mask_)

        }

        states_tensor = tf.tensor2d(states_tensor)
        actions_tensor = tf.tensor2d(actions_tensor)
        values_tensor = tf.tensor1d(values_tensor)
        let values_tensor_ = values_tensor.expandDims(1)

        // console.log(states_tensor.shape)
        // console.log(actions_tensor.shape)
        // console.log(values_tensor.shape)


        // let mask_tensor_ = tf.tensor2d(mask_tensor)
        // let mask_tensor__ = tf.cast(mask_tensor_, "float32")


        // await this.model.fit(states_tensor, [actions_tensor, values_tensor_], { epochs: 2, validationSplit : 0.1 })
        await this.model.fit(states_tensor, [actions_tensor, values_tensor_], { epochs: 2 })


        global.tensor_collector.push(states_tensor)
        // global.tensor_collector.push(mask_tensor_)
        // global.tensor_collector.push(mask_tensor__)
        global.tensor_collector.push(actions_tensor)
        global.tensor_collector.push(values_tensor)
        global.tensor_collector.push(values_tensor_)


    }


    async SaveModel(ver, model_type){
        let url = `file://tf_models/${ver}/${model_type}`

        
        if (!fs.existsSync(`./tf_models/${ver}`)){
            fs.mkdirSync(`./tf_models/${ver}`);
        }

        
        if (!fs.existsSync(`./tf_models/${ver}/${model_type}`)){
            fs.mkdirSync(`./tf_models/${ver}/${model_type}`);
        }
        

        // let url = "file://ddeserd/"

        await this.model.save(url)
    }



    async LoadModel(ver, model_type){

        if(this.model != null){
            console.log("dispose model")
            this.model.dispose()
        }

        let url = `file://tf_models/${ver}/${model_type}/model.json`

        this.model = await tf.loadLayersModel(url)
        console.log("model is loaded")

        // this.model.summary()


        // this.LoadModel_Other(ver - 5, model_type)

    }
    

    // async LoadModel_Other(ver, model_type){

    //     if(this.model_other != null){
    //         console.log("dispose model")
    //         this.model_other.dispose()
    //     }

    //     let url = `file://tf_models/${ver}/${model_type}/model.json`

    //     this.model_other = await tf.loadLayersModel(url)
    //     console.log("model is loaded [[ OTHER ]]")
    // }

    // async Model_Release_Other(){

    // }



    Parse_Log(values, result) {
        // console.log("result : ", result)
        // console.log(values)
        // console.log(states.length, actions.length, values.length)

        let experience_value = new Array(values.length)
        let last = values.length - 1


        let weight = undefined
        if(this.type == ROLL)
            weight = 0.5
        else if(this.type == GODFAVOR)
            weight = 0.5

        experience_value[last] = result[0]

        for (let i = last - 1; i >= 0; i--) {
            // console.log(values[i], experience_value[i + 1])
            experience_value[i] = (1.0 - weight) * values[i] + experience_value[i + 1] * weight
        }

        // console.log(experience_value[0] )


        return experience_value
    }


    async Init_Entropy_Distribution(){
        
        let action_size = this.action_size

        // let action_size = undefined

        // // if(this.type == ROLL)
        // //     action_size = 64
        // // else
        // //     action_size = 61


        let norm = tf.randomNormal([action_size], 0.5, 0.015, "float32")


        let bias_arr = new Array(action_size).fill(0)
        bias_arr[0] = 0.2
        bias_arr[1] = 0.2
        bias_arr[2] = 0.2
        // bias_arr[3] = 0.2
        // bias_arr[4] = 1.0
        // bias_arr[5] = 1.0
        

        let bias = tf.tensor1d(bias_arr)

        norm = norm.add(bias)
        norm = norm.mul(norm)
        norm = norm.mul(norm)
        // norm = norm.mul(norm)
        // norm = norm.mul(norm)
        // norm = norm.mul(norm)
        // norm = norm.mul(norm)
        // norm = norm.mul(norm)

        let div_ = norm.sum()
        norm = norm.div(div_)
        norm = await norm.data()        
        norm.sort()

        // console.log(norm)


        this.entropy_distribution = norm

        
        // console.log(this.entropy_distribution)
    }


    Clone_Entropy_Distribution(){
        // return new Array(this.entropy_distribution.length).fill(1.0)


        let ret = [...this.entropy_distribution]


        random_.shuffle(ret)


        // if(this.type == ROLL)
        //     ret[0] = 0.0001
        // else if(this.type == GODFAVOR)
        //     ret[this.action_size - 1] = 0.0001

        // console.log(ret)
    
        return ret
    }



    SoftMax(arr){
        // console.log("before : ", arr)

        let temperature = 0.25
        let action_size = arr.length

        
        let action_index = undefined
        let visit_count = undefined
        let prob = undefined

        let numerator = 0, denomirator = 0
        

        for (let i = 0; i < action_size; i++) {
            denomirator += Math.exp(arr[i] / temperature)
            // denomirator += playout_probs[i]
        }


        for (let i = 0; i < action_size; i++) {
            numerator = Math.exp(arr[i] / temperature)
            // numerator = playout_probs[i]

            if(numerator == 0 && denomirator == 0){

            }
            else{
                arr[i] = numerator / denomirator
            }

            if(isNaN(arr[i])){
                console.log("NAN")
                // console.log(action_size, numerator, denomirator)
                // console.log(playout_probs)
            }
        }

        // console.log()
        // console.log("after : ", arr)
        // console.log("\n=============================\n")
    }




    __Test__(){
        let state = tf.rand([60, 94], Math.random)

        console.time("predict");
        let ret = this.model.predict(state, { verbose: 0 })
        let actions = ret[0]
        let value = ret[1]
        // console.log(actions)
        // console.log(value)
        console.timeEnd("predict");

        for (let i = 0; i < 100; i++) {
            console.time("predict");
            state = tf.rand([60, 94], Math.random)
            ret = this.model.predict(state, { verbose: 1 })
            actions = ret[0]
            value = ret[1]
            // console.log(actions)
            // console.log(value)
            console.timeEnd("predict");

        }
    }

}