import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



# weapon_input : Shape = ( Batch, dice_cnt )
# mark_output : Shape = ( Batch, dice_cnt, 16 )

"""
Shape = {
    "weapon" : ( Batch, dice_cnt ) ▶▶▶ ( Batch, dice_cnt, 16 )
    "mark" : ( Batch, dice_cnt ) ▶▶▶ ( Batch, dice_cnt, 16 )
}
"""


def Model():
    inputs = {
        "weapon" : keras.Input(shape=(None,), dtype = 'int32'),
        "mark" : keras.Input(shape=(None,), dtype = 'bool')
    }

    weapon = layers.Embedding(input_dim=5, output_dim = 16)(inputs["weapon"])
    mark = layers.Embedding(input_dim=2, output_dim = 16)(inputs["mark"])

    # print(layers.GlobalMaxPooling1D()(weapon))

    outputs = {
        "weapon" : weapon,
        "mark" : mark
    }

    model = keras.Model(inputs, outputs)

    return model


def Model_():
    input =  keras.Input(shape=(None,), dtype = 'int32')

    weapon = layers.Embedding(input_dim=5, output_dim = 16)(input)

    bi_lstm = layers.Bidirectional(layers.LSTM(4, return_sequences=True, return_state=True))
    output = bi_lstm(weapon)

    # output = layers.LSTM(4, return_sequences=True, return_state=True)(weapon)

    model = keras.Model(input, output)
    model.summary()


    # print(layers.GlobalMaxPooling1D()(weapon))

    # outputs = {
    #     "weapon" : weapon,
    #     "mark" : mark
    # }

    # model = keras.Model(inputs, outputs)

    return model


def example_():
    raw_data = [[0, 3, 0, 2],[0, 3, 2, 2],[0, 3, 2, 2],[0, 3, 0, 2]]
    model = Model_()

    tensor = tensorflow.constant(raw_data)
    ret = model(tensor)
    print("\n\n==============================\n\n")
    print(ret)
    
    ret = model(tensor)
    print("\n\n==============================\n\n")
    print(ret)


example_()

def example():
    raw_data = {
        "weapon" : [0,3,2],
        "mark" : [True, True, False]
    }

    model = Model()

    model.summary()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
    
    ret = model(tf)
    print(ret["weapon"])

    print("\n\n======================================\n\n")

    ret = model(tf)
    print(ret["weapon"])



    print("\n\n======================================\n\n")
    # print(ret["weapon"])

    # input_ = layers.Embedding(input_dim=5, output_dim = 16)(keras.Input(shape=(None,), dtype = 'int32'))
    # output_ = layers.GlobalMaxPooling1D()(input_)

    # model_ = keras.Model(input_, output_)

    # ret_ = model_(ret["weapon"])

    
    # print("\n\n======================================\n\n")
    # print(ret_)
    

    



# example()


def batch_learning_example():
    dices = {
        "weapon" : [0,3,2, 1,0,2,2],
        "mark" : [True, True, False, False, False, True, True]
    }

    dices_limit = [3, 4]

    ds_weapon = tensorflow.RaggedTensor.from_row_lengths(values = dices["weapon"], row_lengths = dices_limit, name = "weapon")
    ds_mark = tensorflow.RaggedTensor.from_row_lengths(values = dices["mark"], row_lengths = dices_limit, name = "mark")

    # dss = tensorflow.data.Dataset.from_tensors((ds_weapon, ds_mark))
    dss = {
        "weapon" : ds_weapon,
        "mark" : ds_mark
    }

    print(dss)

    model = Model()
    ret = model(dss)
    print(ret)


# batch_learning_example()