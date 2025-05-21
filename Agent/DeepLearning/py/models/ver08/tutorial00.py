import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



raw_data = {
    "weapon" : [[0,1,4,5,0,1]],
    "mark" : [[0,1,2,2,0,1]]
}
    
tf = {}
for key in raw_data:
    tf[key] = tensorflow.constant(raw_data[key])


weapon_ = layers.Embedding(input_dim=6, output_dim = 16, mask_zero=True)(tf["weapon"])
mark_ = layers.Embedding(input_dim=3, output_dim = 16, mask_zero=True)(tf["mark"])

bi_lstm = layers.Bidirectional(layers.LSTM(8, return_sequences=True, return_state=False))

weapon_ = bi_lstm(weapon_)
weapon_ = bi_lstm(weapon_)
weapon_ = bi_lstm(weapon_)

mark_ = bi_lstm(mark_)
mark_ = bi_lstm(mark_)
mark_ = bi_lstm(mark_)

print(weapon_)
print(mark_)
# print(weapon_._keras_mask)
# print(mark_._keras_mask)

print("\n\n=================================\n\n")

# weapon_ = layers.GlobalMaxPooling1D()(weapon_)
# mark_ = layers.GlobalMaxPooling1D()(mark_)


# print(weapon_)
# print(mark_)

# print("\n\n=================================\n\n")


situation_raw_data = [0.5, 0.3, 0.2, 0.1]
situation_tf = tensorflow.constant(situation_raw_data)
situation_tf = tensorflow.repeat([[situation_tf]], 6, -2)
# situation_tf= layers.RepeatVector(1)(situation_tf)

print(situation_tf)

conc_ = layers.Concatenate()([weapon_, mark_, situation_tf])
print(conc_)

bi_lstm_ = layers.Bidirectional(layers.LSTM(8, return_sequences=True, return_state=False))

ret_ = bi_lstm_(conc_)
ret_ = bi_lstm_(conc_)

ret_ = layers.Dense(1)(ret_)

print(ret_)



"""
mod.add(Dense(128, activation='relu', input_dim=29))
mod.add(Dense(1, activation='sigmoid'))
mod.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
mod.summary()
"""