import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers







"""
Shape = {
    "hp" : (Batch, ) ▶▶▶ (Batch, ),
    "token" : (Batch, ) ▶▶▶ (Batch, ),
    "weapon" : (Batch, 5) ▶▶▶ (Batch, ),
    "mark" : (Batch, ) ▶▶▶ (Batch, ),
    "card" : (Batch, 3) ▶▶▶ (Batch, 3, 16),
}
"""

def Model():

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
    # card = layers.CategoryEncoding(num_tokens = 20, output_mode = 'multi_hot')(inputs["card"])
    card = layers.Embedding(input_dim = 20, output_dim = 16, input_length = 3)(inputs["card"])

    hp = tensorflow.expand_dims(hp, -1)
    token = tensorflow.expand_dims(token, -1)
    mark = tensorflow.expand_dims(mark, -1)

    
    outputs={
        "hp" : hp,
        "token" : token,
        "weapon" : weapon,
        "mark" : mark,
        "card" : card
    }

    model = keras.Model(inputs, outputs)
    
    return model
    
    # model.summary()


a = Model()
a.summary()

    # print(tf)

    # ds = tensorflow.data.Dataset.from_tensors(raw_data)
    # print(ds)

    # for element in ds.as_numpy_iterator():
    #     print(element)

    # ret = model(ds)
    # print(ret)


    # val = model(t)
    # print(val)

# print(ds)


# model_ = Model()

# Examples


def preprocess_example():
    raw_data = {
        "hp" : 12,
        "token" : 15,
        "weapon" : [1, 1, 0, 2, 0],
        "mark" : 2,
        "card" : [0, 12, 8],
    }

    model = Model()

    # ds = tensorflow.data.Dataset.from_tensors(raw_data)
    # tf = ds.map(lambda x : (model(x)), num_parallel_calls=tensorflow.data.AUTOTUNE)
    # for element in tf.as_numpy_iterator():
    #     print(element)

    tf = {}
    for key in raw_data:
        tf[key] = tensorflow.constant(raw_data[key])
    ret = model(tf)
    print(ret)


    




def reinforce_example():
    raw_datas = {
    "hp" : [14, 12, 15],
    "token" : [9, 6, 2],
    "weapon" : [[1,1,0,1,0],[2,2,0,0,0],[0,0,0,0,1]],
    "mark" : [1, 3, 0],
    "card" : [[0, 12, 8],[3 ,6, 2],[8, 17, 19]]
    }


    ds = tensorflow.data.Dataset.from_tensor_slices(raw_datas)

    # for element in ds.as_numpy_iterator():
        # print(element)

    preprocess_model = Model()

    tf = ds.map(lambda x : (preprocess_model(x)), num_parallel_calls=tensorflow.data.AUTOTUNE)
    print(tf)

    # val = preprocess_model(ds)
    # print(val)

    # for element in tf.as_numpy_iterator():
    #     print(element)



# preprocess_example()
# reinforce_example()
