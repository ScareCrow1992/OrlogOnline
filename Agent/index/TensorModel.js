// import * as tf from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs-node-gpu';

import { Random } from "random-js";
const random = new Random();

export default class TensorModel {
    constructor(model_ = null){
        this.model_ = model_

        if(this.model_ == null){

            this.instance = tf.sequential();
            this.instance.add(tf.layers.dense({units: 256, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:'relu', inputShape: [64]}));
            this.instance.add(tf.layers.dropout({rate : 0.4}))
            // this.instance.add(tf.layers.dense({
            //     units: 16, activation: 'relu', batchInputShape: [null, 18]
            // }));
            // this.instance.add(tf.layers.dropout({rate : 0.2}))
            // this.instance.add(tf.layers.dense({units: 16, activation:'relu'}));
            // this.instance.add(tf.layers.dropout({rate : 0.2}))
            // this.instance.add(tf.layers.dense({units: 16, activation:'relu'}));
            // this.instance.add(tf.layers.dropout({rate : 0.15}))
            // this.instance.add(tf.layers.dense({units: 16, activation:'relu'}));
            // this.instance.add(tf.layers.dropout({rate : 0.15}))
            this.instance.add(tf.layers.dense({units: 256, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:'relu'}));
            this.instance.add(tf.layers.dropout({rate : 0.4}))
            // this.instance.add(tf.layers.dense({units: 512, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:'relu'}));
            // this.instance.add(tf.layers.dense({units: 512, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:'relu'}));
            this.instance.add(tf.layers.dense({units: 256, kernelRegularizer : tf.regularizers.l2({l2 : 0.001}), activation:'relu'}));
            this.instance.add(tf.layers.dropout({rate : 0.4}))
            this.instance.add(tf.layers.dense({units: 1, activation:'sigmoid'}));
    
            this.instance.compile({loss: 'meanSquaredError', optimizer: "rmsprop", metrics : ["mae", "mse"]});
            this.instance.summary()

        }
        else{
            console.log(this.model_)
            this.ready = tf.loadLayersModel(this.model_)
            this.ready.then(res => { 
                this.instance = res;
                console.log("model is loaded")
                this.instance.compile({loss: 'meanSquaredError', optimizer: "rmsprop", metrics : ["mae", "mse"]});
            })
        }


        this.isStart = false
    }
    

    Card_CategoryEncoding(avatar_info){
        let cards_arr = avatar_info.godFavors

        let cards_encoding = new Array(20).fill(0)
        cards_encoding[cards_arr[0]] = 1
        cards_encoding[cards_arr[1]] = 1
        cards_encoding[cards_arr[2]] = 1
    
        avatar_info.cards = cards_encoding
    }


    Parse_Single(raw_data){
        // console.log(raw_data.dices.empty)

        raw_data.health /= 15.0
        raw_data.token /= 50.0

        raw_data.heal /= 15.0
        raw_data.damage /= 15.0

        raw_data.dices.axe /= 6.0
        raw_data.dices.arrow /= 6.0
        raw_data.dices.helmet /= 6.0
        raw_data.dices.shield /= 6.0
        raw_data.dices.steal /= 6.0
        raw_data.dices.empty /= 6.0
        raw_data.dices.mark /= 6.0



        this.Card_CategoryEncoding(raw_data)
    }

    Parse_Multiple(raw_datas){
        raw_datas.forEach(raw_data=>{
            this.Parse_Single(raw_data.avatar)
            this.Parse_Single(raw_data.opponent)
        })
    }



    Convert2Tensor_Single(raw_data_avatar, raw_data_opponent, raw_data_situation){
        let arr_ = [
            raw_data_avatar.health, raw_data_avatar.token,
            raw_data_avatar.heal, raw_data_avatar.damage,
            raw_data_avatar.dices.axe, raw_data_avatar.dices.arrow, raw_data_avatar.dices.helmet, raw_data_avatar.dices.shield, raw_data_avatar.dices.steal, raw_data_avatar.dices.empty, raw_data_avatar.dices.mark,
            ...raw_data_avatar.cards,
            raw_data_opponent.health, raw_data_opponent.token, 
            raw_data_opponent.heal, raw_data_opponent.damage,
            raw_data_opponent.dices.axe, raw_data_opponent.dices.arrow, raw_data_opponent.dices.helmet, raw_data_opponent.dices.shield, raw_data_opponent.dices.steal, raw_data_opponent.dices.empty, raw_data_opponent.dices.mark,
            ...raw_data_opponent.cards,
            raw_data_situation.order, raw_data_situation.roll
        ]


        return arr_
    }


    Convert2Tensor_Mutliple(raw_datas){
        // console.log(raw_datas[0].avatar.dices)
        let arr_ = []
        raw_datas.forEach(raw_data_=>{
            let ret = this.Convert2Tensor_Single(raw_data_.avatar, raw_data_.opponent, raw_data_.situation)
            arr_.push(ret)
        })

        // console.log(arr_[0])
        let tensor_ = tf.tensor2d(arr_)
        return [tensor_, arr_]
    }


    Append_ForceSyncs(raw_datas, depth){



    }

    

    Predict(raw_datas, phase, depth){
        // if(phase == "godfavor" && depth < 5){
        //     // global.situations_stack.push (JSON.stringify({ depth :  }))

        // }

        this.Parse_Multiple(raw_datas)
        let [tensor_2d_, array_data] = this.Convert2Tensor_Mutliple(raw_datas)

        // tensor_2d_.print()
        let index_promise = this.Predict_(tensor_2d_, raw_datas)


        return [array_data, index_promise]
        

    }


    Predict_(input_, raw_datas){
        let ret_ = this.instance.predict(input_)
        // console.log(typeof ret_)
        // ret_.data().then(res=>{console.log(res); console.log(typeof res); console.log(Object.values(res))})
        let promise_ = new Promise(res=>{
            ret_.data().then(arr_=>{
                // arr_ : 확률 리스트

                // let values_ = Object.values(arr_)
                // console.log(raw_datas)
                // raw_datas.forEach((raw_data_, index__)=>{
                //     console.log(`[ ${index__} ] : ${JSON.stringify(raw_data_.avatar.dices)}, << ${values_[index__]} >>`)
                // })

                // console.log(values_)

                // if(values_.length < 150 && this.isStart == false){
                //     // console.log(values_[10], values_[10], values_[20])
                    
                //     // console.log(values_)
                //     this.isStart = true
                // }


                let max_val_ = -9999999999
                let max_index_ = 0

                let keys_ = Object.keys(arr_)
                
                let candidates = new Array(keys_.length).fill(null)

                keys_.forEach((key_)=>{
                    let val_ = arr_[`${key_}`]
                    if (val_ > max_val_) {
                        max_val_ = val_
                        max_index_ = key_
                    }

                    candidates[parseInt(key_)] = {key_, val_}
                })



                let tmp___ = max_index_

                candidates.sort((a, b) => { return a.val_ - b.val_ })



                max_index_ = candidates.length - 1
                // while (true) {
                //     if (max_index_ < 0) {
                //         max_index_ = 0
                //         break;
                //     }

                //     if (random.integer(0, 9) < 5) {
                //         break;
                //     }
                //     else {
                //         max_index_--;
                //     }
                // }

                // if (max_index_ < 0)
                //     max_index_ = 0


                if (random.integer(0, 9) > 8) {
                    max_index_ = random.integer(0, max_index_)
                }

                max_index_ = candidates[max_index_].key_

                let ret_index_ = parseInt(max_index_)

                // console.log("max prop = ",max_val_)

                // console.log("[[ on Model ]]")
                // console.log(raw_datas[ret_index_])
                // console.log("\n\n\n")

                input_.dispose()


                // console.log(keys_.length, ret_index_, tmp___ )
                // console.log(ret_index_)
                // console.log(candidates[max_index_].key_)
                res(ret_index_)
                // res(parseInt(tmp___))
                // res(0)

            })
        })

        return promise_

    }


    Fit(agents){
        let xs = []
        let ys = []

        
        agents.forEach(agent_=>{
            // console.log(agent_.logs.length)
            let [xs_, ys_] = global.TensorModel.Fit_(agent_.logs, agent_.win, agent_.score)
            
            xs.push(...xs_)
            ys.push(...ys_)
        })


        // console.log(xs)

        // console.log(xs.length)
        // console.log(ys.length)

        let tensor_x = tf.tensor2d(xs)
        let tensor_y = tf.tensor2d(ys)
        // console.log(tensor_x)

        // let batch_size = ys.length
        // let batch_size = 18;


        // console.log(batch_size)

        // tensor_y.sigmoid().print()
        // tensor_y = tensor_y.div(tf.scalar(4))
        tensor_y = tensor_y.sigmoid()
        
        // console.log(ys)
        // tensor_y.data().then(res=>{console.log(res)})
        // tensor_y.print()

        // console.log("Start fit")

        // tensor_x.print()

        // tensor_y.print()
        
        let promise_ = this.instance.fit(tensor_x, tensor_y, { epochs: 4, validationSplit : 0.9, shuffle : true, verbose : 1 })

        promise_.then(()=>{
            console.log("end fit")
            this.isStart = false
            // this.instance.save("C:/Users/gogow/repo/projects/orlog/Agent/index/mymodel.keras")
            // this.instance.save(tf.io.browserFiles("file://"))


            // let result = this.instance.evaluate(tensor_x, tensor_y, { batchSize: batch_size })
            // console.log(result)
            // result[0].print()
            // result[1].print()
            // result[2].print()
        })
        
        return promise_

        // this.instance.save("downloads://my-model-1")
    }


    Save(url_){        
        let promise_ = this.instance.save(url_)

        return promise_
    }


    Fit_(logs, win, score){
        if(win == false)
            score *= -1

        score *= (6 / 20)

        // if(score > 1)
        //     score = 8
        // else if(score < -1)
        //     score = -8

        // if(score > -0.05  && score < 0.05){
        //     score = -4
        // }


        let unit_length = 64
        let slice_cnt = (logs.length / 64) - 1
        
        let batched_logs = []
        let batched_scores = []

        
        if(score > -1 && score < 1){
            score = -2
        }

        if(score > 0.25|| score < -0.25){
            for(let i=0; i<slice_cnt; i++){
                batched_logs.push(logs.slice(i * unit_length, (i + 1) * unit_length))
                batched_scores.push([score])
            }
        }
        // }
        // else{
        // console.log("[[ Draw ]]")
        // }

        // console.log(logs.length, score)

        return [batched_logs, batched_scores]
    }



}