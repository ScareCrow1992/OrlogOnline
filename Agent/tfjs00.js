// import * as tf from '@tensorflow/tfjs'
import * as tf from '@tensorflow/tfjs-node-gpu';



async function func_A() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, batchInputShape: [null, 4], activation: "relu" }));
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "tanh" }));
}



async function func_B() {

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
    tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-3" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let hidden = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-0" }).apply(tmp)


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
        for (let bit_ = 0; bit_ < 6; bit_++) {
            if (bit_mask[bit_] == "1") {
                // selected_dice_layer[bit_] = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, rolled_dices_input[2 * i], rolled_dices_input[2 * i + 1]])
                selected_dice_layer[bit_ * 2] = rolled_dices_input[2 * bit_]
                selected_dice_layer[bit_ * 2 + 1] = rolled_dices_input[2 * bit_ + 1]
            }
            else {
                selected_dice_layer[bit_ * 2] = null_input[0]
                selected_dice_layer[bit_ * 2 + 1] = null_input[1]
            }
        }


        tmp = tf.layers.concatenate({ name: `select-${bit_mask}-Conc` }).apply([hidden, ...selected_dice_layer])

        tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-III` }).apply(tmp)
        tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-II` }).apply(tmp)
        tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
        tmp = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-I` }).apply(tmp)
        layers[mask_] = tf.layers.dropout({ rate: 0.3, name: `select-${bit_mask}` }).apply(tmp)
        // layers[mask_] = 

    }

    tmp = tf.layers.concatenate().apply([...layers])
    let action = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "softmax", name: "action" }).apply(tmp)

    tmp = hidden
    tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let critic = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "sigmoid", name: "critic-0" }).apply(tmp)

    let output = tf.layers.concatenate().apply([action, critic])
    let model = tf.model({ inputs: [state_input, ...rolled_dices_input, ...null_input], outputs: output, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });


    model.compile({ loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });



    let data_state = tf.tensor2d([new Array(60).fill(0.3), new Array(60).fill(0.5), new Array(60).fill(0.1)])

    let weapon_0 = tf.tensor2d([[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_0 = tf.tensor2d([[0], [1], [1]])


    let weapon_1 = tf.tensor2d([[1, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_1 = tf.tensor2d([[0], [1], [1]])


    let weapon_2 = tf.tensor2d([[1, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_2 = tf.tensor2d([[0], [1], [1]])


    let weapon_3 = tf.tensor2d([[0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_3 = tf.tensor2d([[0], [1], [1]])


    let weapon_4 = tf.tensor2d([[0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_4 = tf.tensor2d([[0], [1], [1]])


    let weapon_5 = tf.tensor2d([[0, 1, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0]])
    let mark_5 = tf.tensor2d([[0], [1], [1]])

    
    let weapon_6 = tf.tensor2d([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]])
    let mark_6 = tf.tensor2d([[0], [0], [0]])


    let result = tf.tensor2d([new Array(65).fill(0.3), new Array(65).fill(0.5), new Array(65).fill(0.1)])

    model.fit([data_state, weapon_0, mark_0, weapon_1, mark_1, weapon_2, mark_2, weapon_3, mark_3, weapon_4, mark_4, weapon_5, mark_5, weapon_6, mark_6], result, { epochs: 4, verbose: 1 })


    // let ret_ = model.predict([data_state, weapon_0, mark_0, weapon_1, mark_1, weapon_2, mark_2, weapon_3, mark_3, weapon_4, mark_4, weapon_5, mark_5])

    // console.log(ret_)

    // ret_.data().then(res=>{console.log(res)})


}


function func_C() {


    let godfavors_input = [
        tf.input({ shape: [20], name: "godfavor-name-0" }),
        tf.input({ shape: [3], name: "godfavor-level-0" }),
        tf.input({ shape: [20], name: "godfavor-name-1" }),
        tf.input({ shape: [3], name: "godfavor-level-1" }),
        tf.input({ shape: [20], name: "godfavor-name-2" }),
        tf.input({ shape: [3], name: "godfavor-level-2" }),

        tf.input({ shape: [20], name: "godfavor-name-3" }),
        tf.input({ shape: [3], name: "godfavor-level-3" }),
        tf.input({ shape: [20], name: "godfavor-name-4" }),
        tf.input({ shape: [3], name: "godfavor-level-4" }),
        tf.input({ shape: [20], name: "godfavor-name-5" }),
        tf.input({ shape: [3], name: "godfavor-level-5" }),

        tf.input({ shape: [20], name: "godfavor-name-6" }),
        tf.input({ shape: [3], name: "godfavor-level-6" }),
        tf.input({ shape: [20], name: "godfavor-name-7" }),
        tf.input({ shape: [3], name: "godfavor-level-7" }),
        tf.input({ shape: [20], name: "godfavor-name-8" }),
        tf.input({ shape: [3], name: "godfavor-level-8" }),

        tf.input({ shape: [20], name: "godfavor-name-9" }),
        tf.input({ shape: [3], name: "godfavor-level-9" }),
    ]

    let state_input = tf.input({ shape: [64], name: "state__" })

    let tmp = state_input
    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let hidden = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-0" }).apply(tmp)


    let layers = new Array(10).fill(null)
    for (let i = 0; i < 10; i++) {
        let conc_layer = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, godfavors_input[2 * i], godfavors_input[2 * i + 1]])

        let tmp = conc_layer
        tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-2` }).apply(tmp)
        tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
        tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-1` }).apply(tmp)
        tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
        layers[i] = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `godfavor-${i}_action-0` }).apply(tmp)
    }

    tmp = tf.layers.concatenate().apply(layers)
    let godfavor_action = tf.layers.dense({ units: 10, activation: "softmax", name: "action__" }).apply(tmp)

    tmp = hidden
    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let critic = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-0" }).apply(tmp)

    let output = tf.layers.concatenate().apply([godfavor_action, critic])
    const model = tf.model({ inputs: [state_input, ...godfavors_input], outputs: output, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });


    model.summary()


}




function func_D() {

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
    tmp = tf.layers.dense({ units: 512, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-3" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 512, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 512, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let hidden = tf.layers.dense({ units: 64, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "hidden-0" }).apply(tmp)


    let layers = new Array(64).fill(null)
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
        for (let bit_ = 0; bit_ < 6; bit_++) {
            if (bit_mask[bit_] == "1") {
                // selected_dice_layer[bit_] = tf.layers.concatenate({ name: `select-${i}` }).apply([hidden, rolled_dices_input[2 * i], rolled_dices_input[2 * i + 1]])
                selected_dice_layer[bit_ * 2] = rolled_dices_input[2 * bit_]
                selected_dice_layer[bit_ * 2 + 1] = rolled_dices_input[2 * bit_ + 1]
            }
            else {
                selected_dice_layer[bit_ * 2] = null_input[0]
                selected_dice_layer[bit_ * 2 + 1] = null_input[1]
            }
        }


        tmp = tf.layers.concatenate({ name: `select-${bit_mask}-Conc` }).apply([hidden, ...selected_dice_layer])

        tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-III` }).apply(tmp)
        tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-II` }).apply(tmp)
        tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
        tmp = tf.layers.dense({ units: 128, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: `select-${bit_mask}-I` }).apply(tmp)
        layers[mask_] = tf.layers.dropout({ rate: 0.3, name: `select-${bit_mask}` }).apply(tmp)
        // layers[mask_] = 

    }


    tmp = hidden

    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-2" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.3 }).apply(tmp)
    tmp = tf.layers.dense({ units: 256, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-1" }).apply(tmp)
    tmp = tf.layers.dropout({ rate: 0.1 }).apply(tmp)
    let critic = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "critic-0" }).apply(tmp)


    let output = tf.layers.concatenate().apply([...layers, critic])
    let model = tf.model({ inputs: [state_input, ...rolled_dices_input, ...null_input], outputs: output, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });

    model.summary()

}


function func_E() {
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
    let output_ = tf.layers.dense({ units: 1, kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }), activation: "relu", name: "output" }).apply(tmp)

    let model = tf.model({ inputs: input_, outputs: output_, loss: 'meanSquaredError', optimizer: "rmsprop", metrics: ["mae", "mse"] });

    model.summary()
}


func_B()