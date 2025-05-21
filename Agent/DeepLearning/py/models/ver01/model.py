
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
    { "first": 1, "turn": 5 }
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





def DataModeling_User(avatar, turn):
    user_info = [
        [
            avatar["hp"] / 15.0,
            avatar["token"] / 50.0,
            avatar["axe"] / 6.0,
        ],[
            avatar["arrow"] / 6.0,
            avatar["helmet"] / 6.0,
            avatar["shield"] / 6.0,
        ],[
            avatar["steal"] / 6.0,
            avatar["mark"] / 6.0,
            turn
        ]   
    ]

    ret = [
        numpy.array(user_info[0]),
        numpy.array(user_info[1]),
        numpy.array(user_info[2]),
        numpy.array(avatar["god_favors"])
    ]

    return ret

def DataModeling(avatar_info):
    turn = numpy.float32(avatar_info[2]["turn"] / 6.0)

    # print(avatar_info)
    users = [DataModeling_User(avatar_info[0], turn), DataModeling_User(avatar_info[1], turn)]

    first_user = avatar_info[2]["first"]

    # state = {
    #     "user-first": users[0] if first_user == 0 else users[1], 
    #     "user-second" : users[1] if first_user == 0 else users[0],
    #     "turn" : avatar_info[2]["turn"] / 6.0
    # }

    state = [
        users[0] if first_user == 0 else users[1], 
        users[1] if first_user == 0 else users[0]
    ]


    ret = [*state[0], *state[1]]


    return numpy.array(ret)


def UserLayer(index):
    user_input = {
        # "hp": keras.Input(shape=(1), dtype='float32', name="HP-{0}".format(index)),
        # "token" : keras.Input(shape=(1), dtype='float32', name="Token-{0}".format(index)),
        # "axe" : keras.Input(shape=(1), dtype='float32', name="Axe-{0}".format(index)),
        # "arrow" : keras.Input(shape=(1), dtype='float32', name="Arrow-{0}".format(index)),
        # "helmet" : keras.Input(shape=(1), dtype='float32', name="Helmet-{0}".format(index)),
        # "shield" : keras.Input(shape=(1), dtype='float32', name="Shield-{0}".format(index)),
        # "steal" : keras.Input(shape=(1), dtype='float32', name="Steal-{0}".format(index)),
        # "mark" : keras.Input(shape=(1), dtype='float32', name="Mark-{0}".format(index)),
        "info_A" : keras.Input(shape=(3), dtype='float32', name="info-A-{0}".format(index)),
        "info_B" : keras.Input(shape=(3), dtype='float32', name="info-B-{0}".format(index)),
        "info_C" : keras.Input(shape=(3), dtype='float32', name="info-C-{0}".format(index)),
        "card" : keras.Input(shape=(3), dtype='int32', name="Card-{0}".format(index))
    }

    # print(user_input["user"])


    # hp_0 = user_input["hp"]
    # token_0 = user_input["token"]
    # axe_0 = user_input["axe"]
    # arrow_0 = user_input["arrow"]
    # helmet_0 = user_input["helmet"]
    # shield_0 = user_input["shield"]
    # steal_0 = user_input["steal"]
    # mark_0 = user_input["mark"]
    info_A_0 = user_input["info_A"]
    # print(info_A_0)

    info_B_0 = user_input["info_B"]
    info_C_0 = user_input["info_C"]
    
    card_0 = user_input["card"]


    # hp_1 = layers.Dense(EMBEDDING_DIM)(hp_0)
    # token_1 = layers.Dense(EMBEDDING_DIM)(token_0)
    # axe_1 = layers.Dense(EMBEDDING_DIM)(axe_0)
    # arrow_1 = layers.Dense(EMBEDDING_DIM)(arrow_0)
    # helmet_1 = layers.Dense(EMBEDDING_DIM)(helmet_0)
    # shield_1 = layers.Dense(EMBEDDING_DIM)(shield_0)
    # steal_1 = layers.Dense(EMBEDDING_DIM)(steal_0)
    # mark_1 = layers.Dense(EMBEDDING_DIM)(mark_0)


    info_A_1 = tensorflow.expand_dims(info_A_0, -1)
    # print(info_A_1)
    info_A_2 = layers.Dense(EMBEDDING_DIM)(info_A_1)
    # print(info_A_2)

    
    info_B_1 = tensorflow.expand_dims(info_B_0, -1)
    info_B_2 = layers.Dense(EMBEDDING_DIM)(info_B_1)

    
    info_C_1 = tensorflow.expand_dims(info_C_0, -1)
    info_C_2 = layers.Dense(EMBEDDING_DIM)(info_C_1)

    # hp_2 = tensorflow.expand_dims(hp_1, -2)
    # token_2 = tensorflow.expand_dims(token_1, -2)
    # axe_2 = tensorflow.expand_dims(axe_1, -2)
    # arrow_2 = tensorflow.expand_dims(arrow_1, -2)
    # helmet_2 = tensorflow.expand_dims(helmet_1, -2)
    # shield_2 = tensorflow.expand_dims(shield_1, -2)
    # steal_2 = tensorflow.expand_dims(steal_1, -2)
    # mark_2 = tensorflow.expand_dims(mark_1, -2)

    # print(card_0)
    card_1 = layers.CategoryEncoding(num_tokens = 20, output_mode = 'multi_hot')(card_0)
    card_2 = layers.Embedding(20, EMBEDDING_DIM)(card_1)


    print(card_0)
    print(card_1)
    print(card_2)

    # output = layers.Concatenate(axis = 1)([ hp_2, token_2, axe_2, arrow_2, helmet_2, shield_2, steal_2, mark_2, card_2 ])

    output = layers.Concatenate(axis = 1)([ info_A_2, info_B_2, info_C_2, card_2 ])
    print(output)


    input = [info_A_0, info_B_0, info_C_0, card_0]
    
    return [input, output]
    


def Model():
    [user_first_input, user_first_output] = UserLayer(0)
    [user_second_input, user_second_output] = UserLayer(1)


	
    input = user_first_input + user_second_input

    
    
  
    concatenated_data = layers.Concatenate(axis = 1, name="model_input")([user_first_output, user_second_output])

    print(user_first_output)
    print(user_second_output)
    print(concatenated_data)


    # return keras.Model(inputs = input, outputs = concatenated_data)
    # print(input)

    flattened_data = layers.Flatten()(concatenated_data)

    print(flattened_data)
    dense_0 = layers.Dense(464, activation="relu")(flattened_data)
    dense_1 = layers.Dense(256, activation="relu")(dense_0)
    dense_2 = layers.Dense(128, activation="relu")(dense_1)
    dense_3 = layers.Dense(64, activation="relu")(dense_2)
    dense_4 = layers.Dense(32, activation="relu")(dense_3)
    output = layers.Dense(1, activation="relu")(dense_4)

    model = keras.Model(inputs = input, outputs = output)
    
    optimizer = keras.optimizers.RMSprop(0.001)

    model.compile(loss="mse", optimizer=optimizer)
 

    # model.summary()

    # print(model.input)

    return model




def UnitTest(state_):
    return DataModeling(state_)
    


data = DataModeling(state0)

# data = pandas.DataFrame(data)
# print(type(data))

# for d in data:
    # print(len(d))

# for d in data[8]:
#     print(type(d))
    
# for d in data[17]:
#     print(type(d))

model = Model()
# model.summary()
# model.predict(data)
# print(model.inputs)


# print(model.input)

# print(data)

# data[0] = numpy.array([data[0]])
# data[1] = numpy.array([data[1]])
# data[2] = numpy.array([data[2]])
# data[3] = numpy.array([data[3]])
# data[4] = numpy.array([data[4]])

# print(data)

# data = numpy.array([numpy.array(val) for val in data])

# print(len(data))
# print(len(data[0]))
# print(len(data[0][0]))
# print(len(data[0][0][0]))

# [print(i.shape, i.dtype) for i in model.inputs]


# model.predict(data)

model.summary()

# df = pandas.DataFrame.from_list(data)



a = {
    "info-A-0" : data[0],
    "info-B-0" : data[1],
    "info-C-0" : data[2],
    "Card-0" : data[3],
    "info-A-1" : data[4],
    "info-B-1" : data[5],
    "info-C-1" : data[6],
    "Card-1" : data[7],
}

tf = tensorflow.data.Dataset.from_tensors([data])
# tf = tensorflow.data.Dataset.from_tensor_slices(tf)

# print(data)
# print("########################")
# print(tf)

# print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
dataset = tf.enumerate()
aaa = []

# for element in dataset.as_numpy_iterator():
#     aaa.append(element)
#     print(element)


print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
print(data)
print("########################")
# print(tf)

# model.predict(x = [data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7]])


input_ = keras.Input(shape=(3), dtype='float32')

a = layers.CategoryEncoding(num_tokens = 20, output_mode = 'multi_hot')(input_)
b = layers.Embedding(20, EMBEDDING_DIM)(a)
c = layers.Flatten()(b)
output_ = layers.Dense(16)(c)

# output_ = layers.Reshape((160, 1))(b)

model_ = keras.Model(input_, output_)

ddd = [1,2,3]

model_.summary()

val = model_.predict(ddd)
print(val)
print(len(val))







# i = keras.Input(shape=(), dtype='float32')
# o = layers.Rescaling(scale = 1./15., offset=0.0)(i)

# m = keras.Model(i, o)

# m.summary()

# print("\n\n\n\n")

# model_ = keras.Sequential([
#     layers.Dense(128, activation='relu', input_shape=(5,2)),
#     layers.Dense(64, activation='relu'),
#     layers.Dense(32, activation='relu'),
#     layers.Dense(1)])

# optimizer = keras.optimizers.RMSprop(0.001)

# model_.compile(loss='mse',
#                 optimizer=optimizer,
#                 metrics=['mae', 'mse'])

# model_.build(input_shape=(5,2))


# print(model.input)
# print(model_.input)

# model_.summary()