import redis

import pandas

import numpy
import tensorflow
from tensorflow import keras
from keras import layers


class PrintDot(keras.callbacks.Callback):
  def on_epoch_end(self, epoch, logs):
    if epoch % 100 == 0: print('')
    print('.', end='')


def DataParsing(datas):
    info = datas.split(':')
 
    ret = []
    ret.extend(info[0].split('-'))
    ret.extend(info[1].split('-'))
    ret.extend(info[2])


    ret = list(map(float, ret))
    # print(type(ret[0]))

    ret[0] = ret[0] / 15.0
    ret[8] = ret[8] / 15.0
    
    ret[1] = ret[1] / 50.0
    ret[9] = ret[9] / 50.0

    ret[2] = ret[2] / 6.0
    ret[3] = ret[3] / 6.0
    ret[4] = ret[4] / 6.0
    ret[5] = ret[5] / 6.0
    ret[6] = ret[6] / 6.0
    ret[7] = ret[7] / 6.0

    ret[10] = ret[10] / 6.0
    ret[11] = ret[11] / 6.0
    ret[12] = ret[12] / 6.0
    ret[13] = ret[13] / 6.0
    ret[14] = ret[14] / 6.0
    ret[15] = ret[15] / 6.0

    ret[16] = ret[16] / 5.0



    return ret


def BuildModel(dataset):
    model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=[len(dataset.keys())]),
    layers.Dense(64, activation='relu'),
    layers.Dense(32, activation='relu'),
    layers.Dense(1)])

    optimizer = keras.optimizers.RMSprop(0.001)

    model.compile(loss='mse',
                optimizer=optimizer,
                metrics=['mae', 'mse'])

    return model



df_key = ["hp-0", "token-0", "axe-0", "arrow-0", "helmet-0", "shield-0", "steal-0", "mark-0", 
          "hp-1", "token-1", "axe-1", "arrow-1", "helmet-1", "shield-1", "steal-1", "mark-1", 
          "round"]

# print("hello world")

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# val = r.get("15-0-3-1-1-0-1-2:15-0-1-0-1-0-1-0:2")

# print(val)

# val = r.get("10-5-4-0-1-0-1-2:7-7-1-1-2-1-1-5:5")
# print(val)

keys = r.keys("*")
# print(len(keys))
# print(keys[30])
# print( r.get(keys[55]) ) 

train_keys = keys[0:18440]
train_labels = r.mget(train_keys)
train_labels = list(map(float, train_labels))

train_keys = list(map(DataParsing, train_keys))

train_df = pandas.DataFrame(numpy.array(train_keys), columns = df_key)
train_labels = pandas.DataFrame(numpy.array(train_labels))


# test_keys = keys[801:803]
# test_labels = r.mget(test_keys)
# test_labels = list(map(float, test_labels))

# test_keys = list(map(DataParsing, test_keys))

# test_df = pandas.DataFrame(numpy.array(test_keys), columns = df_key)
# test_labels = pandas.DataFrame(numpy.array(test_labels))


model = BuildModel(train_df)
print("[build model complete]")

model.load_weights("./save_model/reinforce.keras")

print("[load model complete]")

# model.summary()



EPOCHS = 100

history = model.fit(train_df, train_labels, epochs=EPOCHS, validation_split = 0.2, verbose=0, callbacks=[PrintDot()])

# print(model.predict(test_df))
# print(model.predict(test_df[20]))
# print(model.predict(test_df[80]))


# print("\n\n\n")

# print(test_labels)


# print("\n\n\n")

# print(test_df)

model.save("./save_model/reinforce01.keras")