import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

import dice
import avatar






def Model():
    # 4개의 주사위 정보를 담음
    


    dice_model = dice.Model()
    avatar_model_0 = avatar.Model()
    avatar_model_1 = avatar.Model()


    dice_input = dice_model.input
    dice_output = dice_model(dice_input)

    avatar_input_0 = avatar_model_0.input
    avatar_output_0 = avatar_model_0(avatar_input_0)

    avatar_input_1 = avatar_model_1.input
    avatar_output_1 = avatar_model_1(avatar_input_1)

    inputs = [dice_input, avatar_input_0, avatar_input_1]

    
    serialized_shape = []
    
    for key in dice_output:
        serialized_shape.append(dice_output[key])

    for key in avatar_output_0:
        serialized_shape.append(avatar_output_0[key])
        
    for key in avatar_output_1:
        serialized_shape.append(avatar_output_1[key])

    concatenate = layers.Concatenate()(serialized_shape)
    dense = layers.Dense(16, activation = "relu")(concatenate)
    output = layers.Dense(1, activation="sigmoid")(dense)

    model = keras.Model(inputs, output)
    # model.summary()

    return model






def UnitTest():
    raw_data_dice = {
        "weapon" : [0,0,1,4], # <0, 1, 2, 3, 4, 5>
        "mark" : [True, False, False, True] # <True, False>
    }

    raw_data_avatar_0 = {
        "hp" : 12,
        "token" : 15,
        "weapon" : [1, 1, 0, 2, 0],
        "mark" : 2,
        "card" : [0, 12, 8],
    }

    raw_data_avatar_1 = {
        "hp" : 12,
        "token" : 15,
        "weapon" : [1, 1, 0, 2, 0],
        "mark" : 2,
        "card" : [0, 12, 8],
    }

    dice_tensor = {}
    for key in raw_data_dice:
        dice_tensor[key] = tensorflow.constant(raw_data_dice[key])

    avatar_0_tensor = {}
    for key in raw_data_avatar_0:
        avatar_0_tensor[key] = tensorflow.constant(raw_data_avatar_0[key])

    avatar_1_tensor = {}
    for key in raw_data_avatar_1:
        avatar_1_tensor[key] = tensorflow.constant(raw_data_avatar_1[key])

    ds = [dice_tensor, avatar_0_tensor, avatar_1_tensor]


    # ds = [
    #     tensorflow.data.Dataset.from_tensors(raw_data_dice),
    #     tensorflow.data.Dataset.from_tensors(raw_data_avatar_0),
    #     tensorflow.data.Dataset.from_tensors(raw_data_avatar_1)
    # ]

    # raw_data = [raw_data_dice, raw_data_avatar_0, raw_data_avatar_1]
    # ds = tensorflow.data.Dataset.from_tensors(raw_data)

    
    model = Model()

    val = model(ds)
    print(val)




UnitTest()