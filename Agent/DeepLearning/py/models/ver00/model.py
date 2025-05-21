
import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers

EMBEDDING_DIM = 8

# scalar_extend_mask = numpy.arange(8).reshape(8)

state0 = [
    {
      "axe": 4,
      "arrow": 1,
      "helmet": 1,
      "shield": 0,
      "steal": 0,
      "mark": 1,
      "god_favors": [0,1,2],
      "hp": 12,
      "token": 13
    },
    {
      "axe": 0,
      "arrow": 2,
      "helmet": 2,
      "shield": 1,
      "steal": 1,
      "mark": 4,
      "god_favors": [3,4,5],
      "hp": 7,
      "token": 0
    },
    { "first": 1, "turn": 6 }
  ]

state1 = [
    {
      "axe": 3,
      "arrow": 1,
      "helmet": 2,
      "shield": 0,
      "steal": 0,
      "mark": 3,
      "god_favors": [0,2,7],
      "hp": 12,
      "token": 14
    },
    {
      "axe": 0,
      "arrow": 2,
      "helmet": 2,
      "shield": 1,
      "steal": 1,
      "mark": 4,
      "god_favors": [3,12,16],
      "hp": 7,
      "token": 6
    },
    { "first": 0, "turn": 3 }
  ]

states = [state0, state1]

label = 0

labels = [1.0, -1.0]    # 선공 승리 / 선공 패배




def DataSet():
    hp0 = tensorflow.feature_column.numeriic_column("hp0")
    token0 = tensorflow.feature_column.numeriic_column("hp0")
    

def DataModeling_User(avatar):
    ret = {
        "hp": avatar["hp"],
        "token" : avatar["token"],
        "dice" : [avatar["axe"], avatar["arrow"], avatar["helmet"], avatar["shield"], avatar["steal"]],
        "mark" : avatar["mark"],
        "card" : avatar["god_favors"]
    }

    return ret

def DataModeling(avatar_info):
    # print(avatar_info)
    users = [DataModeling_User(avatar_info[0]), DataModeling_User(avatar_info[1])]

    first_user = avatar_info[2]["first"]

    state = {
        "user-first": users[0] if first_user == 0 else users[1], 
        "user-second" : users[1] if first_user == 0 else users[0],
        "turn" : avatar_info[2]["turn"]
    }

    return state

    

def DataParsing(state_, label_, model_A, model_B):
    data = DataModeling(state_)

    dataset = [
        tensorflow.data.Dataset.from_tensors(data["user-first"]),
        tensorflow.data.Dataset.from_tensors(data["user-second"])
    ]

    label_ = tensorflow.data.Dataset.from_tensors(label_)

    dataset_first = tensorflow.data.Dataset.zip((dataset[0]))
    dataset_first = model_A(dataset_first.get_single_element())
    dataset_first = model_B(dataset_first)
    # print(dataset_first)

    dataset_second = tensorflow.data.Dataset.zip((dataset[1]))
    dataset_second = model_A(dataset_second.get_single_element())
    dataset_second = model_B(dataset_second)
    # print(dataset_second)


    turn = state_[2]["turn"] / 6.0
    turn = numpy.full(shape=(1, 1, 8), fill_value = turn)

    # turn_input = keras.Input(shape=(1), dtype='int32')(turn)
    # turn_input = layers.Rescaling(scale = 1./6., offset=0.0)(turn_input)
    # turn_output = layers.Dense(EMBEDDING_DIM)(turn_input)
    # print(turn_output)

    return [dataset_first, dataset_second, turn]





def UserInfoLayer(user_input):
    hp_output = layers.Rescaling(scale = 1./15., offset=0.0)(user_input["hp"])
    token_output = layers.Rescaling(scale = 1./50., offset=0.0)(user_input["token"])
    dice_output = layers.Rescaling(scale = 1./6., offset=0.0)(user_input["dice"])
    mark_output = layers.Rescaling(scale = 1./6., offset=0.0)(user_input["mark"])

    
    hp_output = layers.Normalization(axis=None)(hp_output)
    token_output = layers.Normalization(axis=None)(token_output)
    dice_output = layers.Normalization(axis=None)(dice_output)
    mark_output = layers.Normalization(axis=None)(mark_output)

    card_output = layers.CategoryEncoding(num_tokens = 20, output_mode = 'multi_hot')(user_input["card"])
    card_output = layers.Embedding(20, EMBEDDING_DIM, input_length = 3)(card_output)
    card_output = layers.Normalization(axis=None)(card_output)
    
    user_output = {
        "hp" : hp_output,
        "token" : token_output,
        "dice" : dice_output,
        "mark" : mark_output,
        "card" : card_output
    }

    return user_output




def PreProcessModel():
    inputs = {
        "hp": keras.Input(shape=(), dtype='int32'),
        "token" : keras.Input(shape=(), dtype='int32'),
        "dice" : keras.Input(shape=(5), dtype='int32'),
        "mark" : keras.Input(shape=(), dtype='int32'),
        "card" : keras.Input(shape=(3), dtype='int32')
    }

    # user info
    user_input = inputs
    user_output = UserInfoLayer(user_input)

    preprocessing_model_first_user = keras.Model(user_input, user_output)
    return preprocessing_model_first_user



def UserModel():
    inputs = {
        "hp": keras.Input(shape=(1,), dtype='float32'),
        "token" : keras.Input(shape=(1,), dtype='float32'),
        "dice" : keras.Input(shape=(5,), dtype='float32'),
        "mark" : keras.Input(shape=(1,), dtype='float32'),
        "card" : keras.Input(shape=(20,EMBEDDING_DIM), dtype='float32')
    }

    # dimesion extend
    hp = layers.Dense(EMBEDDING_DIM)(inputs["hp"])
    token = layers.Dense(EMBEDDING_DIM)(inputs["token"])
    dice = layers.Dense(EMBEDDING_DIM)(inputs["dice"])
    mark = layers.Dense(EMBEDDING_DIM)(inputs["mark"])

    
    # card_embedding = layers.Embedding(20, EMBEDDING_DIM, input_length = 3)(inputs["card"])


    concatenated_user = layers.Concatenate()([
        tensorflow.expand_dims(hp, -2),
        tensorflow.expand_dims(token, -2),
        tensorflow.expand_dims(dice, -2),
        tensorflow.expand_dims(mark, -2)
    ])


    concatenated_user = layers.Reshape((4, 8), input_shape=(1, 32))(concatenated_user)


    # card_embedding = layers.Embedding(20, EMBEDDING_DIM, input_length = 3)(inputs["card"])

    outputs = layers.Concatenate(axis = 1)([
        concatenated_user,
        # card_embedding
        inputs["card"]
    ])


    # shape=(None, 24, 8)
    return keras.Model(inputs, outputs)




def TrainingModel():

    turn_input = keras.Input(shape=(1, 8), dtype='float32')
    # turn_input = layers.Rescaling(scale = 1./6., offset=0.0)(turn_input)
    # turn_output = layers.Dense(EMBEDDING_DIM)(turn_input)

    preprocessing_model = PreProcessModel()

    # TestPreProcessModel(state, label, preprocessing_model_first_user)

    user_model = UserModel()

    raw_user_input = preprocessing_model.input

    input_user_A = user_model(preprocessing_model(raw_user_input))
    input_user_B = user_model(preprocessing_model(raw_user_input))
    # input_turn = tensorflow.expand_dims(turn_output, 1)


    inputs = [input_user_A, input_user_B, turn_input]

    # shape=(None, 49, 8)
    concatenated_data = layers.Concatenate(axis=1)(inputs)
    # print(concatenated_data)

    # shape=(None, 392)
    flattened_data = layers.Flatten()(concatenated_data)
    # print(flattened_data)
    
    dense_0 = layers.Dense(392, activation="relu")(flattened_data)
    dense_1 = layers.Dense(256, activation="relu")(dense_0)
    dense_2 = layers.Dense(128, activation="relu")(dense_1)
    dense_3 = layers.Dense(64, activation="relu")(dense_2)
    dense_4 = layers.Dense(32, activation="relu")(dense_3)
    output = layers.Dense(1, activation="relu")(dense_4)

    training_model = keras.Model(inputs, output)
    training_model.summary()


    return [preprocessing_model, user_model, training_model]

    # print(concatenated_data)
    # print(output)



[preprocessing_model, user_model, training_model] = TrainingModel()


data_frame = DataParsing(states[0], labels[1], preprocessing_model, user_model)

print(training_model.input)

# ret = training_model(data_frame)
# print(ret)

training_model.compile(loss='mse',
                optimizer=keras.optimizers.RMSprop(0.001),
                metrics=['mae', 'mse'])


# train_df = pandas.DataFrame(data_frame)
# train_labels = pandas.DataFrame(1.0)


# history = training_model.fit(train_df, train_labels, epochs=5, verbose=0)


ret = training_model.predict(data_frame)
print(ret)


# history = training_model.fit(data_frame, 1.0, epochs=5, verbose=0)



# preprocessing_model_first_user = PreProcessModel()

# TestPreProcessModel(state, label, preprocessing_model_first_user)

# training_model = UserModel()



