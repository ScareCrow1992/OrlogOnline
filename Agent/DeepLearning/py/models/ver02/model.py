import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras.layers import Input, Dense, concatenate
from keras.models import Model
from keras.utils import plot_model

# Model A
a_ip_img = Input(shape=(32,32,1), name="Input_a")
al_1 = Dense(64, activation = "relu",name ="a_layer_1")(a_ip_img)
al_2 = Dense(128, activation="relu",name ="a_layer_2")(al_1)
al_3 = Dense(64, activation="relu",name ="a_layer_3")(al_2)
al_4 = Dense(32, activation="sigmoid",name ="a_output_layer")(al_3)

#Model B
b_ip_img = Input(shape=(32,32,1), name="Input_b")
bl_1 = Dense(64, activation="relu",name ="b_layer_1")(b_ip_img)
bl_2 = Dense(32, activation = "sigmoid",name ="b_output_layer")(bl_1)

#Merging model A and B
a_b = concatenate([al_4,bl_2],name="concatenated_layer")

#Final Layer
output_layer = Dense(16, activation = "sigmoid", name = "output_layer")(a_b)

#Model Definition 
merged = Model(inputs=[(a_ip_img,b_ip_img)],outputs=[output_layer], name = "merged model")

#Model Details
merged.summary()
keras.utils.plot_model(merged, "output/architecture.png", show_shapes=True)