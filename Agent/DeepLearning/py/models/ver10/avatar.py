import tensorflow
from tensorflow import keras
from keras import layers


def Model():
    inputs = {
        "hp" : keras.Input(shape=(1,), dtype = 'float32'),
        "token" : keras.Input(shape=(1,), dtype = 'float32'),
        "weapon" : keras.Input(shape=(5,), dtype = 'float32'), 
        "mark" : keras.Input(shape=(1,), dtype = 'float32'),
        "card" : keras.Input(shape=(3,), dtype = 'int32'),
    }

    hp = layers.Rescaling(scale = 1./15., offset=0.0)(inputs["hp"])
    token = layers.Rescaling(scale = 1./50., offset=0.0)(inputs["token"])
    mark = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["mark"])
    weapon = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["weapon"])
    card = layers.CategoryEncoding(num_tokens = 20, output_mode="multi_hot")(inputs["card"])
    # card = layers.Dense(8)(card)

    output = layers.Concatenate()([hp, token, weapon, mark, card])

    model = keras.Model(inputs, output)
    model.summary()

    return model


def Example():
    raw_data = {
        "hp" : [12, 6, 11],
        "token" : [15, 22, 7],
        "weapon" : [[1, 0, 2, 0, 3],[1, 1, 0, 1, 1],[3, 0, 1, 1, 1]],
        "mark" : [2, 4, 2],
        "card" : [[0, 12, 8],[4, 12, 2],[1, 6, 19]],
        # "hp" : [12],
        # "token" : [15],
        # "weapon" : [[1, 1, 0, 2, 0]],
        # "mark" : [2],
        # "card" : [[0, 12, 8]],
    }


    model = Model()
    model.summary()
    

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
        # print(tf[key])
    
    print(tf)
    ret = model(tf)
    print(ret)
    # for key in ret:
    #     print(ret[key])
    

# Example()



def Reinforcement():
    raw_data = {
        "hp" : [12, 6, 11],
        "token" : [15, 22, 7],
        "weapon" : [[1, 0, 2, 0, 3],[1, 1, 0, 1, 1],[3, 0, 1, 1, 1]],
        "mark" : [2, 4, 2],
        "card" : [[0, 12, 8],[4, 12, 2],[1, 6, 8]],
    }

    
    model = Model()
    model.summary()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
        print(tf[key])

    ret = model(tf)
    
    print(ret)

# Reinforcement()

# input_ = keras.Input(shape=(1,), dtype = 'float32')
# print(input_)
# output_ = layers.Rescaling(scale = 1./15., offset=0.0)(input_)
# model_ = keras.Model(input_, output_)
# model_.summary()


# x = keras.Input(shape=(32,))
# y = layers.Dense(16, activation='softmax')(x)
# model = keras.Model(x, y)

# # model.summary()
# print(model.input_shape)