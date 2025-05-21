import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

def Model():
    inputs={        
        "order" : keras.Input(shape=(1), dtype = 'int32'),
        "round" : keras.Input(shape=(None, 1), dtype = 'float32')
    }

    order = layers.Embedding(input_dim = 2, output_dim = 16, input_length = 1)(inputs["order"])
    order = tensorflow.repeat(order, 6, 1)

    round = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["round"])
    round = tensorflow.repeat(round, 6, -2)

    # outputs={
    #     "order" : order,
    #     "round" : round
    # }

    output = layers.Concatenate()([order, round])

    model = keras.Model(inputs, output)

    return model




def example():
    raw_data = {
        "order" : [[0]],
        "round" : [[4]]
    }

    model = Model()
    model.summary()
    
    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])

    ret = model(tf)
    print(ret)


# example()


def Reinforcement():
    raw_data = {
        "order" : [[0],[0],[1]],
        "round" : [[5],[3],[0]]
    }

    
    model = Model()
    model.summary()
    
    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])

    ret = model(tf)
    print(ret)


# Reinforcement()