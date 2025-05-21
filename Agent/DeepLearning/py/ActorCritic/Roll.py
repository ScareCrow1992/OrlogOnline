from A2CAgent import A2CAgent

import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
import numpy as np

import asyncio
import math

class Roll_Agent : 
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
        #         "order" : keras.Input(shape=(1,), dtype = "float32"),
        #         "turn" : keras.Input(shape=(1,), dtype = "float32")
        #     },
        #     "rolled_dices" : keras.Input(shape=(6,6), dtype = "float32")
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
        #     inputs["situation"]["order"],
        #     layers.Rescaling(scale = 1./4. , offset= 0.0)(inputs["situation"]["turn"]),
        #     layers.Flatten()(inputs["rolled_dices"]),
        # ]
        
        inputs = keras.Input(shape=(94,), dtype = "float32")

        mask_ = keras.Input(shape=(64,), dtype = tf.bool)

        
        action_size = 64
        discount_factor = 0.95
        learning_rate = 0.0001

        optimizer = optimizers.Adam(learning_rate=learning_rate, clipnorm=5.0)

        self.A2C_agent = A2CAgent(inputs, mask_, action_size, discount_factor, learning_rate, optimizer)


    async def Predict(self, state_, mask_):
        ret = self.A2C_agent.GetAction(state_, mask_)
        return ret
    

    def Fit(self, states, masks, actions, scores):
        # history_zip = zip(states, masks, actions, scores)
        self.A2C_agent.Fit(states, masks, actions, scores)
        


def Playout(agent_, state_, mask_):
    cache_cnt = np.full((64), 0)
    cache_value = np.full((64), 0)

    # for j in range(0, 21):
    #     score = (-abs(10 - j) + 5.0) / 5.0
    #     print(j, "==>>", score)

    policy, value, mask_policy = asyncio.run(agent_.Predict(state_, mask_))

    # print(value)
    # print(mask_)
    # print(policy)
    # print(mask_policy)
    # print("\n================\n")

    for i in range(0, 1000):
        
        # selected_action_index = np.argmax(mask_policy)

        # print(cache_cnt)
        # print(mask_policy)
        # print("\n================\n")
        
        Q_value = cache_value / (1 + cache_cnt.sum())
        U_value = 0.2 * mask_policy \
            * np.divide( \
                np.full((64), math.sqrt(cache_cnt.sum())), \
                (1 + cache_cnt) \
            )
        
        # print(mask_policy)
        # print(U_value)

        selected_action_index = np.argmax(Q_value + U_value)


        score = (-abs(10 - selected_action_index) + 5.0) / 5.0


        cache_value[selected_action_index] += value
        cache_cnt[selected_action_index] += 1


        # print(selected_action_index, "==>>", score)
        # print(cache_value)
        # print(cache_cnt)
        # print("\n================\n")

    
    # print(cache_value)
    
    selected_action_index = np.argmax(cache_cnt)

    # print(selected_action_index)

    # print(cache_cnt)
    # print(cache_cnt / cache_cnt.sum())

    playout_actions = cache_cnt / cache_cnt.sum()
    print(cache_value)
    print(cache_cnt)
    print(playout_actions)
    print("\n================\n")

    # playout_value = (-abs(10 - selected_action_index) + 5.0) / 5.0

    return playout_actions





def Test():
    agent_ = Roll_Agent()

    mask_ = [[True,True,True,True,True,True,True,True,True,True,
            True,True,True,True,True,True,True,True,True,True,
            True,False,False,False,False,False,False,False,False,False,
            False,False,False,False,False,False,False,False,False,False,
            False,False,False,False,False,False,False,False,False,False,
            False,False,False,False,False,False,False,False,False,False,
            False, False, False, False]]
    
    state_ = np.random.rand(1, 94)


    for i in range(0, 100):
        playout_actions = Playout(agent_, state_, mask_)
        # print(playout_actions)

        selected_action_index = np.argmax(playout_actions)
        print(selected_action_index)
        score = (-abs(10 - selected_action_index) + 5.0) / 5.0



        agent_.Fit([state_[0], state_[0]], [mask_[0], mask_[0]], [playout_actions, playout_actions], [[score], [score]])


# Test()