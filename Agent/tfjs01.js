import * as tf from '@tensorflow/tfjs-node-gpu';


async function Main(){
    let norm = tf.randomNormal([61], 0.5, 0.015, "float32")

    norm = norm.mul(norm)
    norm = norm.mul(norm)
    norm = norm.mul(norm)
    norm = norm.mul(norm)
    norm = norm.mul(norm)
    norm = norm.mul(norm)
    norm = norm.mul(norm)

    let div_ = norm.sum()

    norm = norm.div(div_)

    norm.sum().print()

    norm = await norm.data()

    norm.sort()

    console.log(norm)

}

Main()