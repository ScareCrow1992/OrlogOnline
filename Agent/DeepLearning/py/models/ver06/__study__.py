import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



"""
0 : Axe
1 : Arrow
2 : Helmet
3 : Shield
4 : Steal
"""
# dice_weapon = { "0" : 0, "1" : 1, "2" : 4, "3" : 0, "4" : 2, "5" : 1 }
dice_weapon = [0, 1, 4, 0]
tf_weapon = tensorflow.convert_to_tensor(dice_weapon)


"""
0 : none
1 : marked
2 : empty
"""
# dice_mark = { "0" : 0, "1" : 1, "2" : 1, "3" : 0, "4" : 2, "5" : 1 }
dice_mark = [0, 1, 1, 0]
tf_mark = tensorflow.convert_to_tensor(dice_mark)


"""

"""
label = [[0], [1], [1], [0]]





weapon_input = keras.Input(shape=(), dtype='int32')
mark_input = keras.Input(shape=(), dtype='bool')

embedding = layers.Embedding(input_dim=6, output_dim = 16, input_length = 6)

embedded_weapon = embedding(weapon_input)
embedded_mark = embedding(mark_input)

embedding_model = keras.Model(weapon_input, embedded_weapon)

embedding_model.summary()







val = embedding(tf_weapon)
# print(val._keras_mask)
print(val)


val_mark = embedding(tf_mark)
print(val_mark)


print("\n==========================\n")

dense_16 = layers.Dense(16, activation="relu")

val_ = dense_16(val)

# print(val_._keras_mask)
print(val_)

print("\n==========================\n")

dense_1 = layers.Dense(1, activation="sigmoid")

val__ = dense_1(val_)

# print(val__._keras_mask)
print(val__)


print("\n==========================\n")

# loss_cross_entropy = keras.losses.CategoricalCrossentropy()

# loss_cross_entropy(val__, label).numpy()