import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers


def Model():
    inputs={        
        "hp" : keras.Input(shape=(None, 1), dtype = 'float32'),
        "token" : keras.Input(shape=(None,1), dtype = 'float32'),
        "weapon" : keras.Input(shape=(None,5), dtype = 'float32'), 
        "mark" : keras.Input(shape=(None,1), dtype = 'float32'),
        "card" : keras.Input(shape=(None,3), dtype = 'int32'),
    }

    hp = layers.Rescaling(scale = 1./15., offset=0.0)(inputs["hp"])
    hp = tensorflow.repeat(hp, 6, -2)

    token = layers.Rescaling(scale = 1./50., offset=0.0)(inputs["token"])
    token = tensorflow.repeat(token, 6, -2)

    mark = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["mark"])
    mark = tensorflow.repeat(mark, 6, -2)
    
    weapon = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["weapon"])
    # weapon = layers.RepeatVector(6)(weapon)
    # weapon = tensorflow.repeat([weapon], 6, -0)
    # weapon = layers.Reshape((6,5))(weapon)
    weapon = tensorflow.repeat(weapon, 6, -1)
    weapon = layers.Reshape((5,6))(weapon)
    # weapon = layers.Conv2DTranspose()(weapon)
    weapon = tensorflow.transpose(weapon, perm=[0, 2, 1])
    
    card = layers.Embedding(input_dim = 20, output_dim = 16, input_length = 3)(inputs["card"])
    card = layers.Reshape((1,48))(card)
    card = layers.Dense(16)(card)
    card = tensorflow.repeat(card, 6, 1)

    # card = layers.GlobalMaxPooling1D()(card_)

    # outputs={
    #     "hp" : hp,
    #     "token" : token,
    #     "weapon" : weapon,
    #     "mark" : mark,
    #     "card" : card
    # }

    output = layers.Concatenate()([hp, token, weapon, mark, card])


    model = keras.Model(inputs, output)
    
    return model




def Example():
    raw_data = {
        "hp" : [[12]],
        "token" : [[15]],
        "weapon" : [[1, 1, 0, 2, 0]],
        "mark" : [[2]],
        "card" : [[0, 12, 8]],
    }
    
    model = Model()
    model.summary()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
        # print(tf[key])
    ret = model(tf)
    
    for key in ret:
        print(ret[key])


# Example()


def Reinforcement():
    raw_data = {
        "hp" : [[12], [6], [11]],
        "token" : [[15], [22], [7]],
        "weapon" : [[1, 0, 2, 0, 3],[1, 1, 0, 1, 1],[3, 0, 1, 1, 1]],
        "mark" : [[2], [4], [2]],
        "card" : [[0, 12, 8],[4, 12, 2],[1, 6, 8]],
    }

    
    model = Model()
    model.summary()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
        print(tf[key])

    ret = model(tf)
    
    # for key in ret:
    #     print(ret[key])

    print(ret["weapon"])

# Reinforcement()

# tensor = tensorflow.constant([[12],[6],[11]], shape = (3,1))
# print(tensor)
# df = tensorflow.repeat(tensor, 6, -1)
# print(df)


# tensor = tensorflow.constant([[11]], shape = (1,1))
# print(tensor)
# df = tensorflow.repeat(tensor, 6, -1)
# print(df)