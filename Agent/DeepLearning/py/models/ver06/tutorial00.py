import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



def AvatarModel():
    inputs={        
        "hp" : keras.Input(shape=(), dtype = 'float32'),
        "token" : keras.Input(shape=(), dtype = 'float32'),
        "weapon" : keras.Input(shape=(5), dtype = 'float32'), 
        "mark" : keras.Input(shape=(), dtype = 'float32'),
        "card" : keras.Input(shape=(3), dtype = 'int32')
    }

    hp = layers.Rescaling(scale = 1./15., offset=0.0)(inputs["hp"])
    token = layers.Rescaling(scale = 1./50., offset=0.0)(inputs["token"])
    mark = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["mark"])
    weapon = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["weapon"])
    card = layers.CategoryEncoding(num_tokens = 20, output_mode = 'multi_hot')(inputs["card"])
    # card = layers.Embedding(input_dim = 20, output_dim = 16, input_length = 3)(inputs["card"])

    # hp = tensorflow.expand_dims(hp, -1)
    # token = tensorflow.expand_dims(token, -1)
    # mark = tensorflow.expand_dims(mark, -1)

    
    outputs={
        "hp" : hp,
        "token" : token,
        "weapon" : weapon,
        "mark" : mark,
        "card" : card
    }

    model = keras.Model(inputs, outputs)
    
    return model


def DiceModel():
    inputs = {
        "weapon" : keras.Input(shape=(), dtype = 'int32'),
        "mark" : keras.Input(shape=(), dtype = 'bool')
    }

    weapon = layers.Embedding(input_dim=6, output_dim = 8, input_length = 6)(inputs["weapon"])
    mark = layers.Embedding(input_dim=2, output_dim = 8, input_length = 6)(inputs["mark"])

    outputs = {
        "weapon" : weapon,
        "mark" : mark
    }

    model = keras.Model(inputs, outputs)

    # model.summary()

    return model



def avatar_example():
    raw_data = {
        "hp" : 12,
        "token" : 15,
        "weapon" : [1, 1, 0, 2, 0],
        "mark" : 2,
        "card" : [0, 12, 8],
    }

    model = AvatarModel()

    # ds = tensorflow.data.Dataset.from_tensors(raw_data)
    # tf = ds.map(lambda x : (model(x)), num_parallel_calls=tensorflow.data.AUTOTUNE)
    # for element in tf.as_numpy_iterator():
    #     print(element)

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
    ret = model(tf)
    print(ret)

    # print(model(model.input))



def dice_example():
    # 굴린 주사위의 갯수 = 리스트 크기
    raw_data = {
        "weapon" : [0,0,1,4], # <0, 1, 2, 3, 4, 5>
        "mark" : [True, False, False, True] # <True, False>
    }

    model = DiceModel()

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
    ret = model(tf)
    print(ret)

    # print(model(model.input))



# dice_example()

# avatar_example()




dice_model = DiceModel()
avatar_model_0 = AvatarModel()


dice_input = dice_model.input
dice_output = dice_model(dice_input)

avatar_input_0 = avatar_model_0.input
avatar_output_0 = avatar_model_0(avatar_input_0)


# tensorflow.repeat(avatar_output_0)
layers.RepeatVector(avatar_output)


inputs = [dice_input, avatar_input_0]

print(dice_output)
print(avatar_output_0)

serialized_shape = []

# for key in dice_output:
#     serialized_shape.append(dice_output[key])

# for key in avatar_output_0:
#     serialized_shape.append(avatar_output_0[key])
    




# concatenate = layers.Concatenate()(serialized_shape)
# dense = layers.Dense(16, activation = "relu")(concatenate)
# output = layers.Dense(1, activation="sigmoid")(dense)

# model = keras.Model(inputs, output)
# model.summary()


