import * as tf from '@tensorflow/tfjs'

// import * as tf from '@tensorflow/tfjs-node-gpu';


function func_A(){
    const x = tf.input({shape: [4]});
    const y = tf.layers.dense({units: 1, activation: 'softmax'}).apply(x);
    const model = tf.model({inputs: x, outputs: y});
    
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    model.summary()
    
    const xs = tf.tensor2d([[0,1,2,3]]);
    // const ys = tf.scalar(0.5);
    const ys = tf.tensor1d([5]);
    
    // model.predict(xs)
    model.fit(xs, ys, {epochs: 5, batchSize : 2})

}


async function func_B(){
    const x = tf.input({shape:[3]})
    const y = tf.layers.categoryEncoding({numTokens : 20, outputMode : "multiHot"}).apply(x)
    const model = tf.model({inputs :x, outputs :y})


    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    model.summary()

    // const xs = tf.tensor1d([0, 1, 2, 3, 4])
    // let ys = null
    // model.execute(xs, ys)

    // const xs = tf.tensor2d([[0, 1, 1]])
    // let ret_ = model.predict(xs)
    // console.log(ret_)
    // ret_.print()
}

async function func_C(){
    
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 32, inputShape: [58], activation : "relu"}));

    // model.add(tf.layers.dense({units: 32, batchInputShape: [null, 58], activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 32, activation : "relu"}));
    model.add(tf.layers.dense({units: 1, activation : "sigmoid"}));



    model.compile({loss: 'meanSquaredError', optimizer: 'sgd', metrics : ["mse"]});
    // model.summary()

    const xs = tf.tensor2d([
        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0.5,0,
        0.5,0.5,
        0.3,0.16,0.4,0,0.3,0.2,0.6,
        1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0, 0.3, 0.7,0,0,
        0.5,0.5,
        0.3,0.16,0.4,0,0.3,0.2,0.6],
        [1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,0.5,0,
        0.5,0.5,
        0.3,0.16,0.4,0,0.3,0.2,0.6,
        1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0.5,0.5,
        0.3,0.16,0.4,0,0.3,0.2,0.6]
    ])

    let ret_ = model.predict(xs)
    ret_.print()


}


func_C()