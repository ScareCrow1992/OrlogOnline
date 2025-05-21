import pandas

import numpy
import tensorflow
from tensorflow import keras
from keras import layers


import asyncio
from websockets.server import serve



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


def BuildModel():
    model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=[17]),
    layers.Dense(64, activation='relu'),
    layers.Dense(32, activation='relu'),
    layers.Dense(1)])

    optimizer = keras.optimizers.RMSprop(0.001)

    model.compile(loss='mse', optimizer=optimizer, metrics=['mae', 'mse'])

    return model



model = BuildModel()

print("[build model complete]")

model.load_weights("./save_model/reinforce01.keras")

print("[load model complete]")


def Predict(message):
    # print(type(message))
    msgs = message.split('/')
        # message = [message]
    df = list(map(DataParsing, msgs))
    prediction = model.predict(df, verbose = 0)
    # print(prediction)

    [worst, best] = [numpy.argmin(prediction), numpy.argmax(prediction)]
    return [worst, best]



# async def echo(websocket):
#     async for message in websocket:
#         msgs = message.split('/')
#         # message = [message]
#         df = list(map(DataParsing, msgs))
#         prediction = model.predict(df)
#         print(prediction)

#         [worst, best] = [numpy.argmin(prediction), numpy.argmax(prediction)]

#         await websocket.send(str(worst) + '/' + str(best))

# async def main():
#     async with serve(echo, "localhost", 8765):
#         await asyncio.Future()  # run forever

# asyncio.run(main())


