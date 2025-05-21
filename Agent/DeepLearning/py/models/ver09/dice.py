import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers


def Model():
    inputs={
        "weapon" : keras.Input(shape=(None,), dtype = 'int32'),
        "mark" : keras.Input(shape=(None,), dtype = 'int32')
    }

    weapon = layers.Embedding(input_dim=6, output_dim = 16, mask_zero=True)(inputs["weapon"])
    mark = layers.Embedding(input_dim=3, output_dim = 16, mask_zero=True)(inputs["mark"])


    bi_lstm_0 = layers.Bidirectional(layers.LSTM(8, return_sequences=True, return_state=False))

    conc_ = layers.Concatenate()([bi_lstm_0(weapon), bi_lstm_0(mark)])

    bi_lstm_1 = layers.Bidirectional(layers.LSTM(16, return_sequences=True, return_state=False))
    output = bi_lstm_1(conc_)

    model = keras.Model(inputs, output)
    return model





def Example():
    raw_data = {
        "weapon" : [[0,1,4,5,0,1]],
        "mark" : [[0,1,2,2,0,1]]
    }

    
    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])

    model = Model()

    val = model(tf)
    # print(val._keras_mask)
    print(val)
    

# Example()



def Reinforcement():
    raw_data = {
        "weapon" : [[0,1,4,5,0,1], [0,1,4,5,0,1]],
        "mark" : [[0,1,2,2,0,1], [0,1,2,2,0,1]]
    }

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])

    model = Model()

    val = model(tf)
    print(val._keras_mask)


# Reinforcement()