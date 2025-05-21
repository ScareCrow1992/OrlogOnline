import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
import numpy as np

from A2C import A2C
from util.State2Tensor import State2Tensor


import time


class A2CAgent:
    def __init__(self, inputs, mask_, action_size, discount_factor, learning_rate, optimizer):

        self.inputs = inputs
        self.mask_ = mask_
        self.action_size = action_size
        self.discount_factor = discount_factor
        self.learning_rate = learning_rate

        self.optimizer = optimizer

        self.model = A2C(self.action_size, self.inputs, self.mask_)



    def GetAction(self, state_, mask_):
        # state = State2Tensor(state_)


        state = tf.constant(state_)
        mask = tf.constant(mask_, dtype = tf.bool)

        action, value, mask_action = self.model.Predict(state, mask)
        return action, value, mask_action



    def Fit(self, states, masks, actions, scores):

        inputs = [tf.constant(states), tf.constant(masks)]
        outputs = [tf.constant(actions), tf.constant(scores), tf.constant(actions)]

        # for state, mask, actions, value in history_zip:
        #     # print(state)
        #     # print(mask)
        #     # print(actions)
        #     # print(value)
        #     # print("\n==========================\n")

        #     inputs.append([tf.constant(state), tf.constant(mask)])
        #     outputs.append([tf.constant(actions), tf.constant(value), tf.constant(actions)])

        
        # # print(len(inputs))
        # # print(len(outputs))
        self.model.Fit(inputs, outputs)


    def TrainModel(self, history):
        model_params = self.model.GetParams()

        running_rewards = 0

        loss_values = 0

        # for state, action, masked_action, selected_action_index, prob, mask, reward in history:
            # running_rewards = reward + self.discount_factor * running_rewards
            # returns.insert(running_rewards)

        
        with tf.GradientTape() as tape:
            for state, selected_action_index, selection_prob, mask, result, converted_prob in history:


                action, value, masked_action = self.GetAction(state, mask)

                # actor_loss
                advantage = result - value[0]
                
                tiny_ = tf.constant(0.0000001)
                actor_loss = tf.math.log(selection_prob + tiny_) * advantage

                # critic_loss
                critic_loss = tf.square(result - value)

                # mask_loss
                mask_loss_ = tf.square(action - converted_prob)
                mask_loss = tf.math.reduce_mean(mask_loss_, [0])

                # print(actor_loss)
                # print(critic_loss)
                # print(mask_loss)

                loss_sum = critic_loss + mask_loss
                loss_values += loss_sum

        # print(mask_loss_)

        # grads = tape.gradient(loss_sum_, model_params)
        # print(grads)

        # print("@@@@@")

        grads = tape.gradient(loss_values, model_params)
        self.optimizer.apply_gradients(zip(grads, model_params))

        # print(grads)
            



def Example():
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
            # "turn" : 0
        }
    }



    mask_ = [True,True,True,True,True,True,True,True,True,True,
             True,True,False,False,False,False,False,False,False,False,
             False,False,False,False,False,False,False,False,False,False,
             False,False,False,False,False,False,False,False,False,False,
             False,False,False,False,False,False,False,False,False,False,
             False,False,False,False,False,False,False,False,False,False,
             False]

    agent_ = A2CAgent()
    policy, value, mask_policy = agent_.GetAction(state, mask_)

    random_results = tf.random.normal([61], 0.5, 0.15, tf.float32)

    arr_ = [0.0] * 61
    arr_[0] = 20.0

    plus_tensor = tf.constant([arr_], dtype=tf.float32)

    # print(random_results)
    # print(plus_tensor)
    # print(mask_policy)
    
    random_results = random_results + plus_tensor

    random_results = random_results * mask_policy
    random_results = layers.Softmax()(random_results, mask_)

    # print(random_results)

    converted_probs = random_results
    selected_prob = np.max(random_results)
    selected_action_index = np.argmax(random_results)


    before_ = time.process_time()
    for i in range(0, 50):
        # print(arg)
        arg = zip([state], [selected_action_index], [selected_prob], [mask_], [0.8], [converted_probs])
        agent_.TrainModel(arg)
    

    after_ = time.process_time()

    print("소요 시간 : ", after_ - before_)



# Example()

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