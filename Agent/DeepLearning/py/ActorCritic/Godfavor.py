from A2CAgent import A2CAgent

import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
import numpy as np

class Godfavor_Agent : 
    def __init__(self):
        
        # inputs = {
        #     "avatar" : {
        #         "health" : keras.Input(shape=(1,), dtype = "float32"),
        #         "token" : keras.Input(shape=(1,), dtype = "float32"),
        #         "godFavors" : keras.Input(shape=(3,), dtype = "float32"),
        #         "dices" : {
        #             "axe" : keras.Input(shape=(1,), dtype = "float32"),
        #             "arrow" :keras.Input(shape=(1,), dtype = "float32"),
        #             "helmet" : keras.Input(shape=(1,), dtype = "float32"),
        #             "shield" :keras.Input(shape=(1,), dtype = "float32"),
        #             "steal" : keras.Input(shape=(1,), dtype = "float32"),
        #             "mark" :keras.Input(shape=(1,), dtype = "float32")
        #         },
        #     },
        #     "opponent" : {
        #         "health" : keras.Input(shape=(1,), dtype = "float32"),
        #         "token" : keras.Input(shape=(1,), dtype = "float32"),
        #         "godFavors" : keras.Input(shape=(3,), dtype = "float32"),
        #         "dices" : {
        #             "axe" : keras.Input(shape=(1,), dtype = "float32"),
        #             "arrow" :keras.Input(shape=(1,), dtype = "float32"),
        #             "helmet" : keras.Input(shape=(1,), dtype = "float32"),
        #             "shield" :keras.Input(shape=(1,), dtype = "float32"),
        #             "steal" : keras.Input(shape=(1,), dtype = "float32"),
        #             "mark" :keras.Input(shape=(1,), dtype = "float32")
        #         },
        #     },
        #     "situation" : {
        #         "order" : keras.Input(shape=(1,), dtype = "float32")
        #     }
        # }

        # parsed_inputs = [
        #     layers.Rescaling(scale = 1./15. , offset= 0.0)(inputs["avatar"]["health"]),
        #     layers.Rescaling(scale = 1./50. , offset= 0.0)(inputs["avatar"]["token"]),
        #     layers.CategoryEncoding(num_tokens = 20, output_mode="multi_hot")(inputs["avatar"]["godFavors"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["axe"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["arrow"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["helmet"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["shield"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["steal"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["avatar"]["dices"]["mark"]),
            
        #     layers.Rescaling(scale = 1./15. , offset= 0.0)(inputs["opponent"]["health"]),
        #     layers.Rescaling(scale = 1./50. , offset= 0.0)(inputs["opponent"]["token"]),
        #     layers.CategoryEncoding(num_tokens = 20, output_mode="multi_hot")(inputs["opponent"]["godFavors"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["axe"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["arrow"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["helmet"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["shield"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["steal"]),
        #     layers.Rescaling(scale = 1./6. , offset= 0.0)(inputs["opponent"]["dices"]["mark"]),
        #     inputs["situation"]["order"]
        # ]

        inputs = keras.Input(shape=(57,), dtype = "float32")
        
        mask_ = keras.Input(shape=(61,), dtype = tf.bool)

        
        action_size = 61
        discount_factor = 0.95
        learning_rate = 0.0001

        optimizer = optimizers.Adam(learning_rate=learning_rate, clipnorm=5.0)

        self.A2C_agent = A2CAgent(inputs, mask_, action_size, discount_factor, learning_rate, optimizer)


    def Predict(self, state_, mask_):
        # print(len(mask_))
        return self.A2C_agent.GetAction(state_, mask_)
        
        # print(action)
        # print(value)
        # print(masked_action)


