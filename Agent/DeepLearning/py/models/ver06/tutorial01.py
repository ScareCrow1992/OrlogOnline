import keras.backend as K
from keras.models import Model
from keras.layers import Input, Embedding, concatenate
from keras.layers import Dense, GlobalMaxPooling1D, Reshape
from keras.optimizers import Adam

import tensorflow

K.clear_session()

# Using embeddings for categorical features
modifier_type_embedding_in=[]
modifier_type_embedding_out=[]

# sample categorical features
categorical_features = ['modifier_type']

modifier_input_ = Input(shape=(None,), name='modifier_type_in')
# Let's assume 10 unique type of modifiers and let's have embedding dimension as 6
modifier_output_ = Embedding(input_dim=10, output_dim=6, name='modifier_type')(modifier_input_)

modifier_type_embedding_in.append(modifier_input_)
modifier_type_embedding_out.append(modifier_output_)

print(modifier_type_embedding_in)
print("\n=======================================\n")
print(modifier_type_embedding_out)
print("\n=======================================\n")


# sample continuous features
statistics = ['duration', "size"]
statistics_inputs =[Input(shape=(None, len(statistics),), name='statistics')] # Input(shape=(1,))

print(statistics_inputs)
print("\n=======================================\n")


# sample continuous features
abilities = ['buyback_cost', 'cooldown', 'number_of_deaths', 'ability', 'teleport', 'team', 'level', 'max_mana', 'intelligence']
abilities_inputs=[Input(shape=(len(abilities),), name='abilities')] # Input(shape=(9,))

print(abilities_inputs)
print("\n=======================================\n")

concat = concatenate(modifier_type_embedding_out + statistics_inputs)

print(concat)
print("\n=======================================\n")

FC_relu = Dense(128, activation='relu', name='fc_relu_1')(concat)
FC_relu = Dense(128, activation='relu', name='fc_relu_2')(FC_relu)
print(FC_relu)
print("\n=======================================\n")
max_pool = GlobalMaxPooling1D()(FC_relu)
print(max_pool)
print("\n=======================================\n")
print(abilities_inputs)
print("\n=======================================\n")

model = concatenate(abilities_inputs + [max_pool])
model = Dense(64, activation='relu', name='fc_relu_3')(model)
model_out = Dense(1, activation='sigmoid', name='fc_sigmoid')(model)

model_in = abilities_inputs + modifier_type_embedding_in + statistics_inputs
model = Model(inputs=model_in, outputs=model_out)
model.compile(loss='binary_crossentropy', optimizer=Adam(lr=2e-05, decay=1e-3), metrics=['accuracy'])

model.summary()



# modifier_type = tensorflow.constant([[1,5,2],[2,1,3],[5,2,3],[5,2,5]])
# statistics_ = tensorflow.constant([[0.1,0.2,0.3],[0.1,0.2,0.3],[0.1,0.2,0.3],[0.1,0.2,0.3]])
# abilities_ = tensorflow.constant([[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]])


# modifier_type = tensorflow.constant([[1,5,2],[1,5,2]])
# statistics_ = tensorflow.constant([[[0.1, 0.8],[0.2, 0.4 ],[0.3, 0.1]],[[0.1, 0.3],[0.2, 0.2],[0.3, 0.5]]])
# abilities_ = tensorflow.constant([[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],[0.5,0.5,0.5,0.5,0.5,0.5,0.7,0.8,0.9]])

modifier_type = tensorflow.constant([[1,5,2]])  #(None, None)
statistics_ = tensorflow.constant([[[0.1, 0.8],[0.2, 0.4 ],[0.3, 0.1]]])
abilities_ = tensorflow.constant([[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]])   # (None, 9)



ret = model([abilities_, modifier_type, statistics_ ])

print("\n\n=================================\n\n")

print(ret)