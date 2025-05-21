import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

import dice, avatar, situation

def Model():
    dice_model = dice.Model()
    [avatar_model_A, avatar_model_B]  = [avatar.Model(), avatar.Model()]
    situation_model = situation.Model()

    inputs = [
        dice_model.input,
        avatar_model_A.input,
        avatar_model_B.input,
        situation_model.input
    ]

    conc_input = [
        dice_model(inputs[0]),
        avatar_model_A(inputs[1]),
        avatar_model_B(inputs[2]),
        situation_model(inputs[3])]

    conc_output = layers.Concatenate()(conc_input)

    A = layers.Bidirectional(
        layers.LSTM(units=64, activation='sigmoid', recurrent_activation='hard_sigmoid', return_sequences=True, return_state=False))(conc_output)
    
    A = keras.layers.Dropout(0.5)(A)

    B = layers.Bidirectional(
        layers.LSTM(units=64, activation='sigmoid', recurrent_activation='hard_sigmoid', return_sequences=True, return_state=False))(A)
    
    B = keras.layers.Dropout(0.5)(B)


    C = layers.Bidirectional(
        layers.LSTM(units=64, activation='sigmoid', recurrent_activation='hard_sigmoid', return_sequences=True, return_state=False))(B)

    output = layers.Dense(1, activation='sigmoid')(C)


    model = keras.Model(inputs, output)
    # model.summary()
    
    optimizer = keras.optimizers.Adam(learning_rate=0.0001, clipnorm=1.0)
    loss = keras.losses.BinaryCrossentropy(from_logits=True)

    model.compile(loss=loss, optimizer=optimizer, metrics=[keras.metrics.BinaryAccuracy()])

    return model



def example():
    dice_data = {
        "weapon" : [[0,1,0,5,0,1]],
        "mark" : [[0,1,0,2,0,1]]
    }

    avatar_A_data = {
        "hp" : [[12]],
        "token" : [[15]],
        "weapon" : [[1, 1, 0, 2, 0]],
        "mark" : [[2]],
        "card" : [[0, 12, 8]],
    }

    avatar_B_data = {
        "hp" : [[12]],
        "token" : [[15]],
        "weapon" : [[1, 1, 0, 2, 0]],
        "mark" : [[2]],
        "card" : [[0, 12, 8]],
    }

    situation_data = {
        "order" : [[1]],
        "round" : [[4]]
    }

    dice_tensor = {}
    for key in dice_data:
        dice_tensor[key] = tensorflow.constant(dice_data[key])

    avatar_A_tensor = {}
    for key in avatar_A_data:
        avatar_A_tensor[key] = tensorflow.constant(avatar_A_data[key])

    
    avatar_B_tensor = {}
    for key in avatar_B_data:
        avatar_B_tensor[key] = tensorflow.constant(avatar_B_data[key])

    
    situation_tensor = {}
    for key in situation_data:
        situation_tensor[key] = tensorflow.constant(situation_data[key])

    inputs = [
        dice_tensor,
        avatar_A_tensor,
        avatar_B_tensor,
        situation_tensor
    ]

    model = Model()
    model.summary()
    
    ret = model.predict(inputs)
    print(ret)

example()


def example_():
    dice_data = {
        "weapon" : [[0,1,4,5,0,1]],
        "mark" : [[0,1,2,2,0,1]]
    }

    avatar_A_data = {
        "hp" : [[12]],
        "token" : [[15]],
        "weapon" : [[1, 1, 0, 2, 0]],
        "mark" : [[2]],
        "card" : [[0, 12, 8]],
    }

    avatar_B_data = {
        "hp" : [[12]],
        "token" : [[15]],
        "weapon" : [[1, 1, 0, 2, 0]],
        "mark" : [[2]],
        "card" : [[0, 12, 8]],
    }

    situation_data = {
        "order" : [[1]],
        "round" : [[4]]
    }

    dice_tensor = {}
    for key in dice_data:
        dice_tensor[key] = tensorflow.constant(dice_data[key])

    avatar_A_tensor = {}
    for key in avatar_A_data:
        avatar_A_tensor[key] = tensorflow.constant(avatar_A_data[key])

    
    avatar_B_tensor = {}
    for key in avatar_B_data:
        avatar_B_tensor[key] = tensorflow.constant(avatar_B_data[key])

    
    situation_tensor = {}
    for key in situation_data:
        situation_tensor[key] = tensorflow.constant(situation_data[key])


    
    dice_model = dice.Model()
    [avatar_model_A, avatar_model_B]  = [avatar.Model(), avatar.Model()]
    situation_model = situation.Model()

    inputs = [
        dice_tensor,
        avatar_A_tensor,
        avatar_B_tensor,
        situation_tensor
    ]

    conc_input = [
        dice_model(inputs[0]),
        avatar_model_A(inputs[1]),
        avatar_model_B(inputs[2]),
        situation_model(inputs[3])]

    conc_output = layers.Concatenate()(conc_input)
    print(conc_output._keras_mask)


# example()

