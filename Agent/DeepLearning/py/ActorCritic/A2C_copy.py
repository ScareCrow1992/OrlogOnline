import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
from keras.initializers import initializers


class A2C():
    def __init__(self, action_size, parsed_input, inputs):

        self.conc_input = layers.Concatenate()

        self.actor_fc = layers.Dense(64, activation = "tanh")
        self.actor_out = layers.Dense(action_size, activation= "softmax", kernel_initializer=initializers.RandomUniform(-1e-3, -1e-3))

        self.critic_fc1 = layers.Dense(64, activation = "relu")
        self.critic_fc2 = layers.Dense(64, activation = "relu")
        self.critic_out = layers.Dense(1, kernel_initializer=initializers.RandomUniform(-1e-3, -1e-3))

        self.model = self.Model(parsed_input, inputs)

    
    def Model(self, parsed_input, inputs):
        conc_input = self.conc_input(parsed_input)

        actor_x = self.actor_fc(conc_input)
        policy = self.actor_out(actor_x)

        critic_x = self.critic_fc1(conc_input)
        critic_x = self.critic_fc2(critic_x)
        value = self.critic_out(critic_x)

        model = keras.Model(inputs, [policy, value])
        model.summary()

        return model


    def Predict(self, state):
        return self.model(state)
