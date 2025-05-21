import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers



model = keras.Sequential([
    keras.Input(shape=(4,)),
    layers.Dense(128, activation='relu'),
    layers.Dense(64, activation='relu'),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activate = "sigmoid")])


optimizer = keras.optimizers.RMSprop(0.001)

model.compile(loss='mse',
            optimizer=optimizer,
            metrics=['mae', 'mse'])

model.summary()

xs_ = tensorflow.constant([
    [0.9, 0.9, 0.1, 0.1],
    [0.6, 0.9, 0.1, 0.1],
    [0.8, 0.9, 0.1, 0.2],
    [0.1, 0.12, 0.8, 0.9],
    [0.2, 0.05, 0.8, 0.9],
    ])
# xs_ = tensorflow.constant([0.9, 0.9, 0.1, 0.1])

ys_ = tensorflow.constant([-1,-1,-1,1,1])

model.fit(xs_,ys_)

ret = model.predict(xs_)

print(ret)
