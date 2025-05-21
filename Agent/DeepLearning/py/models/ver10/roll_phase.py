import tensorflow
from tensorflow import keras
from keras import layers

import avatar


def Model():
    [avatar_model_A, avatar_model_B] = [avatar.Model(), avatar.Model()]
    inputs = [
        avatar_model_A.input,
        avatar_model_B.input,
    ]

    roll_inputs = {
        "weapon" : keras.Input(shape=(5,), dtype = 'float32'), 
        "mark" : keras.Input(shape=(1,), dtype = 'float32')
    }






