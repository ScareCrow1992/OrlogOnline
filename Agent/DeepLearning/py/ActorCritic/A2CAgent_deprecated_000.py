import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
import numpy as np

from A2C import A2C
from util.State2Tensor import State2Tensor


import time
import math

# import os

# os.environ['CUDA_VISIBLE_DEVICES'] = ''

# os.environ['CUDA_VISIBLE_DEVICES'] = '-1'




class A2CAgent:
    def __init__(self):

        self.inputs = {
            "avatar" : {
                "health" : keras.Input(shape=(1,), dtype = "float32"),
                "token" : keras.Input(shape=(1,), dtype = "float32"),
                "godFavors" : keras.Input(shape=(3,), dtype = "float32"),
                "dices" : {
                    "axe" : keras.Input(shape=(1,), dtype = "float32"),
                    "arrow" :keras.Input(shape=(1,), dtype = "float32"),
                    "helmet" : keras.Input(shape=(1,), dtype = "float32"),
                    "shield" :keras.Input(shape=(1,), dtype = "float32"),
                    "steal" : keras.Input(shape=(1,), dtype = "float32"),
                    "mark" :keras.Input(shape=(1,), dtype = "float32")
                },
            },
            "opponent" : {
                "health" : keras.Input(shape=(1,), dtype = "float32"),
                "token" : keras.Input(shape=(1,), dtype = "float32"),
                "godFavors" : keras.Input(shape=(3,), dtype = "float32"),
                "dices" : {
                    "axe" : keras.Input(shape=(1,), dtype = "float32"),
                    "arrow" :keras.Input(shape=(1,), dtype = "float32"),
                    "helmet" : keras.Input(shape=(1,), dtype = "float32"),
                    "shield" :keras.Input(shape=(1,), dtype = "float32"),
                    "steal" : keras.Input(shape=(1,), dtype = "float32"),
                    "mark" :keras.Input(shape=(1,), dtype = "float32")
                },
            },
            "situation" : {
                "order" : keras.Input(shape=(1,), dtype = "float32")
            }
        }

        self.parsed_inputs = [
            layers.Rescaling(scale = 1./15. , offset= 0.0)(self.inputs["avatar"]["health"]),
            layers.Rescaling(scale = 1./50. , offset= 0.0)(self.inputs["avatar"]["token"]),
            layers.CategoryEncoding(num_tokens = 20, output_mode="multi_hot")(self.inputs["avatar"]["godFavors"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["axe"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["arrow"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["helmet"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["shield"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["steal"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["avatar"]["dices"]["mark"]),
            
            layers.Rescaling(scale = 1./15. , offset= 0.0)(self.inputs["opponent"]["health"]),
            layers.Rescaling(scale = 1./50. , offset= 0.0)(self.inputs["opponent"]["token"]),
            layers.CategoryEncoding(num_tokens = 20, output_mode="multi_hot")(self.inputs["opponent"]["godFavors"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["axe"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["arrow"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["helmet"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["shield"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["steal"]),
            layers.Rescaling(scale = 1./6. , offset= 0.0)(self.inputs["opponent"]["dices"]["mark"]),
            self.inputs["situation"]["order"]
        ]

        # self.mask_ = keras.Input(shape=(61,), dtype = tf.float32)
        self.mask_ = keras.Input(shape=(61,), dtype = tf.bool)


        self.action_size = 61
        self.discount_factor = 0.95
        self.learning_rate = 0.0001

        self.model = A2C(self.action_size, self.parsed_inputs, self.inputs, self.mask_)

        self.optimizer = optimizers.Adam(learning_rate=self.learning_rate, clipnorm=5.0)
        self.huber_loss = keras.losses.Huber()


    def GetAction(self, state_, mask_):
        state = State2Tensor(state_)

        mask = tf.constant([mask_], dtype = tf.float32)
        # print(mask)

        policy, value, mask_policy = self.model.Predict(state, mask)
        # print(mask_policy)
        return policy, value, mask_policy


    def Fit(self, state_,mask_, y_true):
        state = State2Tensor(state_)
        mask = tf.constant([mask_], dtype = tf.float32)
        self.model.Fit([state, mask], y_true)


    def TrainModel(self, history):
        model_params = self.model.GetParams()

        running_rewards = 0

        loss_values = 0

        # for state, action, masked_action, selected_action_index, prob, mask, reward in history:
            # running_rewards = reward + self.discount_factor * running_rewards
            # returns.insert(running_rewards)

        
        with tf.GradientTape() as tape:
            for state, selected_action_index, selection_prob, mask, result, converted_prob in history:


                policy, value, masked_action = self.GetAction(state, mask)
                # print(policy)
                # print(masked_action)
                # print(value)

                # actor_loss
                
                # zero = tf.zeros(shape = tf.shape(61,), dtype=tf.float32)
                # negatives = tf.fill(tf.shape(61,), -100.0) 
                # where = tf.equal(masked_action, zero)
                # masked_action_ = tf.where(where, negatives, policy)

                onehot_action = tf.one_hot([selected_action_index], self.action_size)
                # print("@@@@@@@@@@@@@@@@@@@")

                # advantage = result - value[0]
                advantage = tf.stop_gradient(result - value[0])
                
                action_prob = tf.reduce_sum(onehot_action * policy)

                tiny_ = tf.constant(0.00001)
                actor_loss = tf.math.log(action_prob + tiny_) * advantage
                actor_loss = -tf.reduce_mean(actor_loss)                

                # critic_loss
                
                # critic_loss = self.huber_loss(tf.expand_dims(value, 0), tf.expand_dims(result, 0))
                # result가 next_state에 의한 모델 출력값과 연관되어야 의미있는 수식이다
                critic_loss = self.huber_loss(tf.expand_dims(value, 0), tf.expand_dims(tf.stop_gradient(result), 0))

                # print(huber_loss)
                critic_loss = 0.5 * tf.square(result - value[0])
                critic_loss = tf.reduce_mean(critic_loss)

                # mask_loss
                # mask_loss_ = tf.square(masked_action - policy)
                # mask_loss = tf.math.reduce_mean(mask_loss_, [0])

                # print(actor_loss)
                # print(critic_loss)
                # print(mask_loss)

                loss_sum = critic_loss + 0.2 * actor_loss #+ 0.3 * mask_loss
                loss_values += loss_sum
                # print(critic_loss, actor_loss)

        # print(mask_loss_)

        # grads = tape.gradient(loss_sum_, model_params)
        # print(grads)

        print("@@@@@")

        grads = tape.gradient(loss_values, model_params)
        self.optimizer.apply_gradients(zip(grads, model_params))

        # print(grads)
            



def Example():
    agent_ = A2CAgent()

    for j in range(0, 3):

        parsing_before_ = time.process_time()
        state = {
            "avatar": {
                "health": 15,
                "token": 18,
                "godFavors": [6, 12, 17],
                "dices": {
                    "axe": 3,
                    "arrow": 0,
                    "helmet": 0,
                    "shield": 0,
                    "steal": 3,
                    "mark": 3
                },
            },
            "opponent": {
                "health": 10,
                "token": 40,
                "godFavors": [0, 2, 15],
                "dices": {
                    "axe": 0,
                    "arrow": 2,
                    "helmet": 0,
                    "shield": 4,
                    "steal": 0,
                    "mark": 4
                },
            },
            "situation" : {
                "order" : 0
            }
        }



        mask_ = [True,True,True,True,True,True,True,True,True,True,
                True,True,False,False,False,False,False,False,False,False,
                False,False,False,False,False,False,False,False,False,False,
                False,False,False,False,False,False,False,False,False,False,
                False,False,False,False,False,False,False,False,False,False,
                False,False,False,False,False,False,False,False,False,False,
                False]



        parsing_after_ = time.process_time()
        # print(parsing_after_, parsing_before_)
        print("데이터 변환 : ", parsing_after_ - parsing_before_ )

        # cache_ = [0] * 61
        cache_ = np.full((61), 0)
        print(cache_)


        before_ = time.process_time()

        for i in range(0, 100):
            # print(arg))

                
            
            predict_before_ = time.process_time()
            policy, value, mask_policy = agent_.GetAction(state, mask_)
            predict_after_ = time.process_time()

            print("신경망 동작 : ", predict_after_ - predict_before_)

            # random_results = tf.random.normal([61], 0.5, 0.15, tf.float32)

            # arr_ = [0.0] * 61
            # arr_[5] = 50.0

            # plus_tensor = tf.constant([arr_], dtype=tf.float32)

            
            # random_results = random_results + plus_tensor

            # random_results = random_results * mask_policy
            # random_results = layers.Softmax()(random_results, mask_)

            # converted_probs = random_results
            # selected_prob = np.max(random_results)
            # selected_action_index = np.argmax(random_results)
            # print(random_results)
            # print("selected prob : ", selected_prob)
            # print("selected action index : ", selected_action_index)
            converted_probs = 0
            critic = -1
            selected_action_index = np.argmax(policy + 0.5 * ( np.full((61), math.sqrt(i)) / (1 + cache_) ))

            # print(cache_)
            # print(policy + 0.5 * ( np.full((61), math.sqrt(i)) / (1 + cache_) ))
            cache_[selected_action_index] += 1
            # print(cache_)

            # print(policy)
            # print(1 / (policy * policy * policy * 1000000))
            # selected_action_index = np.random.choice(61, p = np.squeeze(1 / (1 - policy * policy)))
            # selected_prob = np.max(policy)
            if selected_action_index > 11 :
                critic = -0.75
            else :
                critic = (selected_action_index / 11.0) * (selected_action_index / 11.0)

            # print(selected_action_index, critic)

            # agent_.Fit(state, mask_, [mask_policy, tf.constant([critic]), mask_policy])

            arg = zip([state], [selected_action_index], [0.000], [mask_], [critic], [converted_probs])
            agent_.TrainModel(arg)




        after_ = time.process_time()
        print(before_)
        print(after_)
        print("총 소요 시간 : ", after_ - before_)



Example()

def Custom_Loss(y_true, y_pred):
    d = 5


# arr = [0,1,2,3,4,5]
# for i in arr[::-1]:
#     print(arr[i])


# arr0 = ["a0", "a1", "a2", "a3", "a4"]
# arr1 = ["b0", "b1", "b2", "b3", "b4"]
# arr2 = ["c0", "c1", "c2", "c3", "c4"]

# zip_ = zip(arr0, arr1, arr2)

# for arr0_, arr1_, arr2_ in zip_:
#     print(arr0_, arr1_, arr2_)



# def study():
#     tensor_ = tf.constant([[0, 2, 14, 2 ,6]])

#     print(tensor_)

#     input_ = keras.Input(shape=(5,), dtype = "float32")

#     # dense_ = layers.Dense(25)(input_)

#     output_ = layers.Dense(25, activation = "sigmoid")(input_)

#     # output_ = layers.RepeatVector(3)(input_)

#     model_ = keras.Model(input_, output_)
#     model_.summary()

#     ret = model_(tensor_)
#     # print(ret)

#     # print(repeat_)

#     # layers.Dense(15, activation="None")

#     # resizing_ = layers.Resizing(height = 3, width = 5, interpolation='bilinear',crop_to_aspect_ratio=False)(input_)

#     # ret = repeat_(tensor_)


        

# # study()




# def study00():
#     tensor_ = tf.constant([[0, 2, 3, 2 ,6]])

#     bit_mask_ = tf.constant([[0,1,1,1,0]])

#     print(tensor_)

#     input_ = keras.Input(shape=(5,), dtype = "float32")

#     input_mask = keras.Input(shape = (5,), dtype = "float32")


#     tmp = layers.Multiply()([input_, input_mask])
#     output_ = layers.Masking(mask_value = 0)(tmp)


#     model_ = keras.Model([input_, input_mask], output_)
#     model_.summary()

#     ret = model_([tensor_, bit_mask_])
#     print(ret)

# study00()





# def study01():
#     # x = tf.Variable(3.0)

#     # with tf.GradientTape() as tape:
#         # y = x**2

#     # dy_dx = tape.gradient(y,x)
#     # print(dy_dx)

#     # w = tf.Variable(tf.random.normal((3, 2)), name='w')
#     # b = tf.Variable(tf.zeros(2, dtype=tf.float32), name='b')
#     # x = [[1., 2., 3.]]

#     # with tf.GradientTape(persistent=True) as tape:
#     #     y = x @ w + b
#     #     loss = tf.reduce_mean(y**2)

#     # [dl_dw, dl_db] = tape.gradient(loss, [w, b])

#     # print(w.shape)
#     # print(dl_dw.shape)


#     # a = tf.Variable([1.0, 2.0, 3.0])
#     # b = [4.0,5.0,6.0]

#     # with tf.GradientTape() as tape:
#     #     c = b - (a * a)

#     #     print(c)
#     #     # d = tf.math.reduce_sum(c, [0])

#     # print(c)
#     # # print(d)

#     # dc_da = tape.gradient(c, a)
#     # print(dc_da)
#     # # # print(dc_db)


#     input_ = keras.Input(shape = (3,))

#     output_0 = layers.Dense(5, activation="relu")(input_)
#     output_1 = layers.Dense(5, activation="sigmoid")(input_)

#     model_ = keras.Model(input_, [output_0, output_1])

#     x = tf.constant([[3.0,6.0,8.0]])
#     # x_tensor = tf.convert_to_tensor(x, dtype = tf.float32)
#     # x_tensor = tf.convert_to_tensor([[3.0, 6.0, 8.0]], dtype = tf.float32)
#     [y0, y1] = model_(x)

#     params = model_.trainable_variables

#     with tf.GradientTape() as tape:
#         tape.watch(y0)
#         tape.watch(y1)
#         # tape.watch(x_tensor)
#         tape.watch(x)
#         tape.watch(params)
#         # [y0, y1] = model_(x)

#         loss = y0 - y1
#         print([var.name for var in tape.watched_variables()])

#     # print(y0)
#     # print(loss)

#     dl_dp = tape.gradient(loss, params)
#     # dl_dp = tape.gradient(loss, x)

#     print(dl_dp)





# study01()