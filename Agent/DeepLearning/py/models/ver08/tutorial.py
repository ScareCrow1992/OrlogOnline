import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

raw_data_0 = tensorflow.constant([[1,2,3,4], [0,0,0,0], [5,6,7,8]])
raw_data_1 = tensorflow.constant([[5,6,7,8], [0,0,0,0], [1,2,3,4]])



embedding = layers.Embedding(input_dim=10, output_dim = 16, mask_zero=True)
bi_lstm = layers.Bidirectional(layers.LSTM(8, return_sequences=True, return_state=False))


val_0 = embedding(raw_data_0)
val_1 = embedding(raw_data_1)


conc = layers.Concatenate()([val_0, val_1])
print("\n\n===============================\n\n")
print(conc._keras_mask)

# print(val._keras_mask)
val_ = bi_lstm(conc)
print("\n\n===============================\n\n")
print(val_)
print("\n\n===============================\n\n")
print(val_._keras_mask)
print("\n\n===============================\n\n")


raw_data = [0.8, 0.5, 0.3, 0.7, 0.1, 0.5]
situation_val = tensorflow.repeat([raw_data], 3, -2)
situation_val= layers.RepeatVector(4)(situation_val)
print(situation_val)
print("\n\n===============================\n\n")


conc_ = layers.Concatenate()([val_, situation_val])
print(conc_)
print("\n\n===============================\n\n")

print(conc_._keras_mask)
print("\n\n===============================\n\n")


bi_lstm_ = layers.Bidirectional(layers.LSTM(1, return_sequences=True, return_state=False))

val__ = bi_lstm_(conc_)
print(val__)
print("\n\n===============================\n\n")

val__ = layers.Dense(1)(val__)
print(val__)
