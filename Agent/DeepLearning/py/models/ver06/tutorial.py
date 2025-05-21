import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



cs = tensorflow.constant([1,2,3,4,5])
# print(cs)


dic = {
    "a" : [1,2,3],
    "b" : ["A", "B","C"],
    "c" : [[1,2,3],[4,5,6],[7,8,9]]
}

ds = tensorflow.data.Dataset.from_tensor_slices(dic)
# print(ds)



input_ = keras.Input(shape=(1), dtype="int32")

dense_ = layers.Dense(16)(input_)

model_ = keras.Model(input_, dense_)

arr = tensorflow.constant([2,6,12, 15, 25])
# val = tensorflow.expand_dims(arr, -1)

val = model_(arr)
print(val)




input_ = keras.Input(shape=(2), dtype="int32")

dense_ = layers.Dense(16)(input_)

model_ = keras.Model(input_, dense_)

arr = tensorflow.constant([[1,2],[3,4],[5,6],[7,8]])
# val = tensorflow.expand_dims(arr, -1)

val = model_(arr)
print(val)
