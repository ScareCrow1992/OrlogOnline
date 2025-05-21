



import * as tf from '@tensorflow/tfjs-node-gpu';




async function func(){

    let input_ = tf.input({ shape: [94]})

    let unit_size = 2 * 94

    let tmp = input_
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    let action_output = tf.layers.dense({units : 64, activation : "sigmoid"}).apply(tmp)

    tmp = input_
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    tmp = tf.layers.dense({units : unit_size, activation : "relu"}).apply(tmp)
    let value_output = tf.layers.dense({units : 1, activation : "tanh"}).apply(tmp)

    let model = tf.model({ inputs: input_, outputs : [action_output, value_output] })
    model.summary()

    let state = tf.rand([3, 94], Math.random)
    console.log(state.shape)

    console.time("predict");
    let ret = model.predict(state, {verbose : 0})
    let actions = ret[0]
    let value = ret[1]
    // console.log(actions)
    // console.log(await actions.array())
    // console.log(value)
    let arr_ = await actions.softmax().array()

    console.log(arr_)
    // arr_ = arr_.softmax()

    console.timeEnd("predict");


    let mask = [
        true, false, false, false, false, true, true, true, true, true,
        true, true, true, true, true, false, true, true, true, true,
        true, true, true, true, true, true, true, true, true, true,
        false,false,false,false,false,false,false,false,false,false,
        false,false,false,false,false,false,false,false,false,false,
        false,false,false,false,false,false,false,false,false,false,
        true, false, true, true
    ]

    let masks = [mask, mask, mask]
    let mask_tensor = tf.tensor2d(masks)
    // mask_tensor.print()

    let mask_tensor_float = tf.cast(mask_tensor, "float32")
    let mul__ = mask_tensor_float.mul(actions)
    // mul__.print()
    let maximum_prob = tf.sum(mul__, 1)
    maximum_prob = maximum_prob.expandDims(1)
    // console.log(maximum_prob.expandDims(1).shape)
    let ret___ = await mul__.div(maximum_prob).array()

    // console.log(ret___)

    // console.log(maximum_prob.shape)
    
    // let mul___ =  mul__.div(maximum_prob)
    // mul___.print()
    // mul___.softmax().print()
    
    // let mask_layer = tf.layers.masking({ maskValue: 0.0, poolSize:[3,64]})

    // let ddd = mask_layer.apply(mul__)
    // // ddd.print()

    // let softmax_layer = tf.layers.softmax()
    // ddd.kerasMask.print()
    // let ddd_ = softmax_layer.apply(ddd)
    // ddd_.print()


    // mul__.softmax().print()

    


    // let masked_arr = await tf.booleanMaskAsync(actions, mask_tensor);
    

    // console.log(masked_arr)
    return

    for (let i = 0; i < 100; i++) {


        console.time("predict");
        state = tf.rand([60, 94], Math.random)
        ret = model.predict(state, { verbose: 1 })
        actions = ret[0]
        value = ret[1]
        console.log(actions.shape)
        // console.log(value)
        await actions.array()
        console.timeEnd("predict");

    }
}


func()
