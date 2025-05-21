import pandas

import numpy
import tensorflow
from tensorflow import keras
from keras import layers


import asyncio
from websockets.server import serve

from models.ver05.model import PreprocessingModel, TrainingModel




preprocessing_model = PreprocessingModel()

# core_model = keras.models.load_model('./save_model/model05_weights_v03.keras')

core_model = keras.models.load_model('./save_model/model05_weights_v02_00.keras')

inputs = preprocessing_model.input
outputs = core_model(preprocessing_model(inputs))


inference_model = keras.Model(inputs, outputs)



def Predict(data):
    dataset = tensorflow.data.Dataset.from_tensor_slices(data).batch(1)
    ret = inference_model.predict(dataset, verbose = 0)
    # print(ret)


    [worst, best] = [numpy.argmin(ret), numpy.argmax(ret)]

    print("\n\n===============================\n\n")

    print("[ Worst Score ] - ${0}".format(ret[worst]))
    print("[ Best Score ] - ${0}".format(ret[best]))
    

    

    return [worst, best]