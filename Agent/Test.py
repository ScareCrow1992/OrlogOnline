import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
from keras import initializers

import numpy as np

class Cache:
    def __init__(self):
        self.mem_ = {}
        self.total = 0

    def get(self, key_):
        str_ = ""
        for i in key_:
            str_ += str(i)

        # print(str_)

        if str_ in self.mem_:
            self.mem_[str_] += 1
            return self.mem_[str_] - 1
        else:
            self.mem_[str_] = 0
            return 0
    def get_total(self):
        return self.total
    
    def incr_total(self):
        self.total += 1



cache_ = Cache()
# cache_.get([0,2,3,2])


# huber_loss = keras.losses.Huber()
huber_loss = keras.losses.MeanSquaredError()

optimizer = keras.optimizers.Adam(learning_rate=0.0025)

gamma = 0.85
eps = np.finfo(np.float32).eps.item() 

def get_score(state, time_):
    score = 0
    # print(state)
    for i in range(time_, time_ + 1):
        for j in range(0, 4):
            if(state[i][0][j] > 0.5):
                score += 2 ** (state[i][0][j] + j)

    if(time_ == 7):
        score_ = 0
        for i in range(0, time_ + 1):
            for j in range(0, 4):
                if(state[i][0][j] > 0.5):
                    score_ += 2 ** (state[i][0][j] + j)

        if score_ < 16.5:
            score = 256

    # print("<<", score,">>")

    return score


def step(state, action, time_):

    round_ = state["round"][0] * 4
    round_ = tf.cast(round_, dtype = tf.int32)
    round_ = tf.get_static_value(round_)
    
    new_chosen_ = [
        tf.identity(state["chosen"][0]),
        tf.identity(state["chosen"][1]),
        tf.identity(state["chosen"][2]),
        tf.identity(state["chosen"][3]),
        tf.identity(state["chosen"][4]),
        tf.identity(state["chosen"][5]),
        tf.identity(state["chosen"][6]),
        tf.identity(state["chosen"][7]),
    ]


    new_chosen = tf.get_static_value(new_chosen_[time_])
    new_chosen[0][action] = 1.0

    new_chosen_[time_] = tf.constant(new_chosen)
    # print(new_chosen_)
    reward = get_score(new_chosen_, time_)
    # print(reward)

    new_round = tf.constant([(round_ + 1) / 4.0])

    new_state = {
        "chosen" : new_chosen_,
        "round" : new_round
    }

    # print("========================")

    return new_state, reward



def chosen2index(chosen):
    ret = 0
    for index in range(0, 4):
        ret += index * chosen[index]

    return str(int(tf.get_static_value(ret)))


def get_action(state, action_probs, time_):
    action_probs = tf.get_static_value(action_probs[0])
    # _total_ = 1 + _total_


    str_ = ""
    for time__ in range(0, time_):
        chosen_ = state[time__]
        
        chosen_index = chosen2index(chosen_[0])
        str_ += chosen_index

    # print(str_)

    # N = cache_.get(str_)
    # print(str_, N)

    ret_probs = []

    for i in range(0, 8):
        str__ = str_ + str(i)
        # print(str__,  cache_.get(str__), "  ]]]")
        N = cache_.get(str__)
        ret_probs.append(action_probs[i] *  (1 + cache_.get_total()) / (1 + N))

    ret = -1
    large_prob = 0
    # print(ret_probs)
    for i in range(0, 4):
        # print(ret_probs[i])
        # print(ret_probs[i], large_prob)
        if ret_probs[i] > large_prob:
            large_prob = ret_probs[i]
            ret = i

    cache_.incr_total()
    
    return ret


def simulation(model : keras.Model, state, batch_):

    with tf.GradientTape() as tape:
        action_probs_history = []
        critic_value_history = []
        rewards_history = []

        for t in range(0,8):
            # print(state)
            action_probs, critic_value = model(state)

            # action = get_action(state["chosen"], action_probs,t)

            # if batch_ % 20 == 10 :
            if batch_ < 3 :
                action = 3
            elif batch_ % 200 == 80:
                action = 0
            else:
                action = np.random.choice(4, p=np.squeeze(action_probs))




            print(action_probs)
            print(action)
            action_probs_history.append(tf.math.log(action_probs[0, action]))
            critic_value_history.append(critic_value[0, 0])
            next_state, reward = step(state, action, t)
            # print(reward)
            rewards_history.append(reward)

            state = next_state


        # print(state)
        # print(rewards_history)
        returns = []
        discounted_sum = 0
        # print(rewards_history)
        for r in rewards_history[::-1]:
            discounted_sum = r + gamma * discounted_sum
            returns.insert(0, discounted_sum)

        print(returns)

        # Normalize
        returns = np.array(returns)
        # returns = (returns - np.mean(returns)) / (np.std(returns) + eps)
        returns = returns / 256.0
        returns = returns.tolist()
        print(returns)


        # print(returns)
        print("====================================")
        
        history = zip(action_probs_history, critic_value_history, returns)

        actor_losses = []
        critic_losses = []

        for log_prob, value, ret in history:
            diff = ret - value
            actor_losses.append(-log_prob * diff)
            # actor loss

            # The critic must be updated so that it predicts a better estimate of
            # the future rewards.

            # critic_losses.append(tf.square(ret-value))
            critic_losses.append(
                huber_loss( tf.expand_dims(value, 0), tf.expand_dims(ret, 0))
                # huber_loss(value, ret)
            )

        # Backpropagation
        loss_value = sum(actor_losses) + sum(critic_losses)
        # print(loss_value)
        grads = tape.gradient(loss_value, model.trainable_variables)
        optimizer.apply_gradients(zip(grads, model.trainable_variables))

        action_probs_history.clear()
        critic_value_history.clear()
        rewards_history.clear()




def example():
    # state = [False, False, False, True, 4]
    # score = get_score(state)
    # print(score)

    input_ = {
        "chosen" : [
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32"),
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32"), 
            keras.Input(shape = (4,), dtype = "float32")
        ],
        "round" : keras.Input(shape = (1,), dtype = "float32")
    }

    conc = layers.Concatenate()([
        input_["chosen"][0], input_["chosen"][1], input_["chosen"][2], input_["chosen"][3], 
        input_["chosen"][4], input_["chosen"][5], input_["chosen"][6], input_["chosen"][7],
        input_["round"]])
    tmp = layers.Dense(64, activation = "relu")(conc)
    # tmp = layers.Dense(128, activation = "relu")(tmp)
    # tmp = layers.Dense(128, activation = "relu")(tmp)
    tmp = layers.Dense(64, activation = "relu")(tmp)
    tmp = layers.Dense(64, activation = "relu")(tmp)
    tmp = layers.Dense(64, activation = "tanh")(tmp)
    policy = layers.Dense(4, activation = "softmax")(tmp)

    tmp = layers.Dense(64, activation = "relu")(conc)
    tmp = layers.Dense(64, activation = "relu")(tmp)
    # tmp = layers.Dense(128, activation = "relu")(tmp)
    # tmp = layers.Dense(128, activation = "relu")(tmp)
    tmp = layers.Dense(64, activation = "relu")(tmp)
    value = layers.Dense(1, activation = "sigmoid")(tmp)

    output_ = [policy, value]


    model = keras.Model(input_, output_)
    # model.summary()

    start_state = {
        "chosen" : [tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]), tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]),tf.constant([[0.0, 0.0, 0.0, 0.0]]) ],
        "round" : tf.constant([0.0])
    }

    # score_ = get_score(start_state["chosen"], 0)
    # print(score_)

    for i in range(0, 500):
        simulation(model, start_state, i)

    # data_ = {
    #     "chosen" : tf.constant([[1.0, 1.0, 0.0, 1.0]]),
    #     "round" : tf.constant([0.5])
    # }

    # ret = model(data_)
    # print(ret)


# example()


probs = [0, 9, 1, 35, 5]

max_index = np.argmax(probs)

print(max_index)