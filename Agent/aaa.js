import * as tf from '@tensorflow/tfjs'



async function main(){


    const model = tf.sequential();
    model.add(tf.layers.dense({units: 8, inputShape: [4], activation : "relu"}));
    model.add(tf.layers.dense({units: 8, activation : "relu"}));
    model.add(tf.layers.dense({units: 1, activation : "sigmoid"}));

    model.compile({loss: 'meanSquaredError', optimizer: 'sgd', metrics : ["mse"]});

    // console.log(tf.ones([2,4]))
    // console.log(tf.tensor2d([[0,1,2,3],[4,5,6,7]]))

    
    const h = await model.fit(tf.ones([8, 8]), tf.ones([8, 8]), {
        batchSize: 4,
        epochs: 3
    });

}

async function main_A() {
    const model = tf.sequential({
        layers: [tf.layers.dense({ units: 1, inputShape: [10] })]
    });
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    for (let i = 1; i < 5; ++i) {
        const h = await model.fit(tf.ones([8, 10]), tf.ones([8, 1]), {
            batchSize: 8,
            epochs: 3
        });
        console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
    }
}

main_A()


// main()