from models.ver05.model import PreprocessingModel, TrainingModel

import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

from utils._list import Str2List, SliceList

import os


class PrintDot(keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs):
        if epoch % 10 == 0: print('')
        print('.', end='')


keys = ["HP-0", "Token-0", "Weapon-0", "Mark-0", "Card-0", "HP-1", "Token-1", "Weapon-1", "Mark-1", "Card-1", "Round"]

features = {}
valid_features = {}

for key in keys:
    path_ = "./save_data/datas_/{0}.txt".format(key)
    # print(path_)

    f = open(path_, "r")

    dat = f.read()
    arr = Str2List(dat)

    if (key == "Card-0") or (key == "Card-1"):
        arr = SliceList(arr, 3)

    if (key == "Weapon-0") or (key == "Weapon-1"):
        arr = SliceList(arr, 5)

    anchor = len(arr) // 10
    features[key] = arr[:-anchor]
    valid_features[key] = arr[-anchor:]

    # print("[[ {0} ]] : {1} // {2} // {3}".format(key, len(arr), len(arr[:-anchor]), len(arr[-anchor:])))
    # print(arr)
    # print("\n")


    f.close()


f = open("./save_data/datas_/Winner.txt", "r")
dat = f.read()

arr = Str2List(dat)

anchor = len(arr) // 10

labels = arr[:-anchor]
valid_labels = arr[-anchor:]

# print(labels)

# print(features)

# print("[[ {0} ]] : {1} // {2} // {3}".format("Label", len(arr), len(arr[:-anchor]), len(arr[-anchor:])))


# print(labels)

for key in keys:
    print("[[ {0} ]]".format(key))
    print(len(features[key]))
    print("\n\n")


for key in keys:
    print("[[ {0} ]]".format(key))
    print(len(valid_features[key]))
    print("\n\n")


# f = open("C:/Users/gogow/OrlogOnline/Orlog-Online/Agent/save_data/datas/Card-0.txt", "r")




# features = {
#     "HP-0" : [15, 13, 6],
#     "Token-0" : [15, 13, 6],
#     "Weapon-0" : [[1, 2, 0, 0, 3],[0, 1, 0, 2, 3],[1, 1, 0, 3, 1]],
#     "Mark-0" : [3, 1, 5],
#     "Card-0" : [[1,2,7],[0,12,15],[6,9,12]],
#     "HP-1" : [15, 13, 6],
#     "Token-1" : [15, 30, 42],
#     "Weapon-1" : [[1, 2, 0, 0, 3],[0, 1, 0, 2, 3],[1, 1, 0, 3, 1]],
#     "Mark-1" : [3, 1, 5],
#     "Card-1" : [[1,2,7],[0,12,15],[6,9,12]],
#     "Round" : [1, 2, 5]   
# }


# labels = [-1,1, -1]





preprocessing_model = PreprocessingModel()

dataset = tensorflow.data.Dataset.from_tensor_slices((features, labels)).batch(1)
dataset = dataset.map(lambda x, y: (preprocessing_model(x), y), num_parallel_calls=tensorflow.data.AUTOTUNE)

next(dataset.take(1).as_numpy_iterator())

vali_data = tensorflow.data.Dataset.from_tensor_slices((valid_features, valid_labels)).batch(1)
vali_data = vali_data.map(lambda x, y: (preprocessing_model(x), y), num_parallel_calls=tensorflow.data.AUTOTUNE)

training_model = TrainingModel()
training_model = keras.models.load_model("./save_model/model05_weights_v02.keras")

EPOCHS = 5

history = training_model.fit(dataset, epochs=EPOCHS, validation_data = vali_data)



training_model.save("./save_model/model05_weights_v02_00.keras")

# preprocessing_model.summary()
# training_model.summary()


