import tensorflow as tf
from tensorflow import keras
from keras import layers
from keras import optimizers
from keras import initializers

# print("gpu check")
# print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
# print(tf.config.list_physical_devices('GPU'))

print(tf.test.is_built_with_cuda())
tf.test.gpu_device_name()

def Value_Loss(y_true, y_pred):
    print("[[ Value Loss ]]")
    # print(y_pred)
    print(y_true)
    return y_true - y_pred


def Policy_Loss(y_true, y_pred):
    print("[[ Policy Loss ]]")
    # print(y_pred)
    print(y_true)
    return y_true - y_pred


def Mask_Loss(y_true, y_pred):
    print("[[ Mask Loss ]]")
    print(y_true)
    return y_true - y_pred


def Custom_Loss(y_true, y_pred):
    print(y_true)
    print("")
    print(y_pred)
    print("\n\n")
    return y_true - y_pred



class A2C():
    def __init__(self, action_size, inputs, mask_):

        self.conc_input = layers.Concatenate()

        # unit_size = action_size * 2
        unit_size = action_size * 3

        self.actor_fc0 = layers.Dense(unit_size, activation = "relu")
        self.actor_fc1 = layers.Dense(unit_size, activation = "relu")
        self.actor_fc2 = layers.Dense(unit_size, activation = "relu")
        self.actor_fc3 = layers.Dense(unit_size, activation = "relu")
        self.actor_fc4 = layers.Dense(unit_size, activation = "relu")
        self.actor_fc5 = layers.Dense(unit_size, activation = "relu")
        # self.actor_fc6 = layers.Dense(unit_size, activation = "relu")
        # self.actor_fc7 = layers.Dense(unit_size, activation = "relu")
        # self.actor_fc8 = layers.Dense(unit_size, activation = "relu")
        # self.actor_fc9 = layers.Dense(unit_size, activation = "relu")
        self.hidden_out = layers.Dense(action_size, activation= "sigmoid")
        self.actor_out = layers.Softmax(name = "policy_head")

        self.mask_out = layers.Softmax(name = "mask_head")


        # self.multiply_out = layers.Multiply()([self.hidden_out, mask_])
        # self.multiply_out = layers.Multiply()
        # self.mask_out = layers.Masking(mask_value=0)

        # self.mask_out = layers.
        
        # self.actor_out = layers.Dense(action_size, activation= "softmax", kernel_initializer=initializers.RandomUniform(-1e-3, -1e-3))

        self.critic_fc0 = layers.Dense(unit_size, activation = "relu")
        self.critic_fc1 = layers.Dense(unit_size, activation = "relu")
        self.critic_fc2 = layers.Dense(unit_size, activation = "relu")
        self.critic_fc3 = layers.Dense(unit_size, activation = "relu")
        self.critic_fc4 = layers.Dense(unit_size, activation = "relu")
        self.critic_fc5 = layers.Dense(unit_size, activation = "relu")
        # self.critic_fc6 = layers.Dense(unit_size, activation = "relu")
        # self.critic_fc7 = layers.Dense(unit_size, activation = "relu")
        # self.critic_fc8 = layers.Dense(unit_size, activation = "relu")
        # self.critic_fc9 = layers.Dense(unit_size, activation = "tanh")
        self.critic_out = layers.Dense(1, kernel_initializer=initializers.RandomUniform(-1e-3, -1e-3), name = "value_head", activation = "tanh")

        self.model = self.Model(inputs, mask_)

    
    def Model(self, inputs, mask_):
        # conc_input = self.conc_input(parsed_input)

        drop_out = 0.3

        actor_x = self.actor_fc0(inputs)
        # actor_x = layers.Normalization(axis= 1)(actor_x)
        actor_x = layers.Dropout(drop_out)(actor_x)
        actor_x = self.actor_fc1(actor_x)
        actor_x = layers.Dropout(drop_out)(actor_x)
        actor_x = self.actor_fc2(actor_x)
        actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = layers.Normalization(axis= 1)(actor_x)

        actor_x = self.actor_fc3(actor_x)
        actor_x = layers.Dropout(drop_out)(actor_x)
        actor_x = self.actor_fc4(actor_x)
        actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = self.actor_fc5(actor_x)
        # actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = self.actor_fc6(actor_x)
        # actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = self.actor_fc7(actor_x)
        # actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = self.actor_fc8(actor_x)
        # actor_x = layers.Dropout(drop_out)(actor_x)
        # actor_x = self.actor_fc9(actor_x)
        # actor_x = layers.Dropout(drop_out)(actor_x)
        hidden_x = self.hidden_out(actor_x)

        policy = self.actor_out(hidden_x)
        mask_policy = self.mask_out(hidden_x, mask_)

        critic_x = self.critic_fc0(inputs)
        # critic_x = layers.Normalization(axis= 1)(critic_x)
        critic_x = layers.Dropout(drop_out)(critic_x)
        critic_x = self.critic_fc1(critic_x)
        critic_x = layers.Dropout(drop_out)(critic_x)
        critic_x = self.critic_fc2(critic_x)
        critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = layers.Normalization(axis= 1)(critic_x)

        critic_x = self.critic_fc3(critic_x)
        critic_x = layers.Dropout(drop_out)(critic_x)
        critic_x = self.critic_fc4(critic_x)
        critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = self.critic_fc5(critic_x)
        # critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = self.critic_fc6(critic_x)
        # critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = self.critic_fc7(critic_x)
        # critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = self.critic_fc8(critic_x)
        # critic_x = layers.Dropout(drop_out)(critic_x)
        # critic_x = self.critic_fc9(critic_x)
        # critic_x = layers.Dropout(drop_out)(critic_x)
        value = self.critic_out(critic_x)

        model = keras.Model([inputs, mask_], [policy, value, mask_policy])
        model.summary()

        # model.compile(loss={"value_head":Value_Loss, "policy_head" : Policy_Loss}, optimizer=optimizers.Adam(learning_rate=0.0005, clipnorm = 5.0))

        model.compile(loss={"value_head":"mse", "policy_head" : "categorical_crossentropy", "mask_head" : None}, optimizer=optimizers.Adam(learning_rate=0.005, clipnorm = 5.0))


        # model.compile(loss=Custom_Loss, optimizer=optimizers.Adam(learning_rate=0.0005, clipnorm = 5.0))


        return model


    def Predict(self, state, mask_):
        # ret = self.model([state, mask_])
        # print("state : ", state.shape)
        # print("mask : ", mask_.shape)

        ret = self.model.predict(x=[state, mask_], verbose = 0)


        return ret
    
    def GetParams(self):
        return self.model.trainable_variables
    

    def Fit(self, inputs_, outputs_):
        self.model.fit(x = inputs_, y = outputs_, epochs = 10, verbose = 0)
        


    # def Fit(self, x_input, y_true):
    #     # print(x_input)
    #     # print(y_true)
    #     self.model.fit(x_input, y_true)