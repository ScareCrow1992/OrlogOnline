import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers


def Model():
    inputs = {
        "weapon" : keras.Input(shape=(None,), dtype = 'int32'),
        "mark" : keras.Input(shape=(None,), dtype = 'bool')
    }

    weapon = layers.Embedding(input_dim=5, output_dim = 8)(inputs["weapon"])
    mark = layers.Embedding(input_dim=2, output_dim = 8)(inputs["mark"])

    outputs = {
        "weapon" : weapon,
        "mark" : mark
    }

    model = keras.Model(inputs, outputs)

    model.summary()

    return model



def preprocess_example():
    # 굴린 주사위의 갯수 = 리스트 크기
    raw_data = {
        "weapon" : [0,0,1,4], # <0, 1, 2, 3, 4, 5>
        "mark" : [True, False, False, True] # <True, False>
    }

    model = Model()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
    ret = model(tf)
    print(ret)


preprocess_example()

"""

def TestCodes():
        


    ds = tensorflow.convert_to_tensor(dice["weapon"])
    # ds = tensorflow.data.Dataset.from_tensor_slices(dice)
    # print(ds.get_single_element())

    dice_input = {
        "weapon" : keras.Input(shape=(), dtype = 'int32'),
        "mark" : keras.Input(shape=(), dtype = 'bool')
    }

    dice_weapon_embedding_layer = layers.Embedding(input_dim=6, output_dim = 16, input_length = 6)

    dice_mark_embedding_layer = layers.Embedding(input_dim=2, output_dim = 8, input_length = 6)


    dice_weapon_embedded = dice_weapon_embedding_layer(dice_input["weapon"])
    dice_mark_embedded = dice_mark_embedding_layer(dice_input["mark"])



    dice_weapon_model = keras.Model(dice_input["weapon"], dice_weapon_embedded)
    dice_mark_model = keras.Model(dice_input["mark"], dice_mark_embedded)

    dice_weapon_model(ds)




    dices = {
        "weapon" : [0,3,2, 1,0,2,2],
        "mark" : [True, True, False, False, False, True, True]
    }

    dices_limit = [3, 4]


    # dss = tensorflow.data.Dataset.from_tensors(dices)

    ds_weapon = tensorflow.RaggedTensor.from_row_lengths(values = dices["weapon"], row_lengths = dices_limit, name = "weapon")
    ds_mark = tensorflow.RaggedTensor.from_row_lengths(values = dices["mark"], row_lengths = dices_limit, name = "mark")

    dss = tensorflow.data.Dataset.from_tensors((ds_weapon, ds_mark))
    print(dss)

"""