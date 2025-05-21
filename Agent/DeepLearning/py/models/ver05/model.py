import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers




cards_num = 20
one_hot_dims = 3
embedding_dims = 8



# features = {
#     "HP-0" : [15/15, 13/15, 6/15],
#     "Token-0" : [15/50, 13/50, 6/50],
#     "Weapon-0" : [[1/6, 2/6, 0, 0, 3/6],[0, 1/6, 0, 2/6, 3/6],[1/6, 1/6, 0, 3/6, 1/6]],
#     "Mark-0" : [3/6, 1/6, 5/6],
#     "Card-0" : [[1,2,7],[0,12,15],[6,9,12]],
#     "HP-1" : [15/50, 13/50, 6/50],
#     "Token-1" : [15/15, 13/15, 6/15],
#     "Weapon-1" : [[1/6, 2/6, 0, 0, 3/6],[0, 1/6, 0, 2/6, 3/6],[1/6, 1/6, 0, 3/6, 1/6]],
#     "Mark-1" : [3/6, 1/6, 5/6],
#     "Card-1" : [[1,2,7],[0,12,15],[6,9,12]],
#     "Round" : [1/6, 2/6, 5/6]   
# }


features = {
    "HP-0" : [15, 13, 6],
    "Token-0" : [15, 13, 6],
    "Weapon-0" : [[1, 2, 0, 0, 3],[0, 1, 0, 2, 3],[1, 1, 0, 3, 1]],
    "Mark-0" : [3, 1, 5],
    "Card-0" : [[1,2,7],[0,12,15],[6,9,12]],
    "HP-1" : [15, 13, 6],
    "Token-1" : [15, 30, 42],
    "Weapon-1" : [[1, 2, 0, 0, 3],[0, 1, 0, 2, 3],[1, 1, 0, 3, 1]],
    "Mark-1" : [3, 1, 5],
    "Card-1" : [[1,2,7],[0,12,15],[6,9,12]],
    "Round" : [1, 2, 5]   
}


labels = [-1,1, -1]
# 1 : 선공 승리
# -1 : 후공 승리




predict_features = {
    "HP-0" : [12, 9, 6],
    "Token-0" : [15, 13, 6],
    "Weapon-0" : [[1, 2, 0, 1, 2],[1, 1, 0, 1, 3],[1, 0, 3, 1, 1]],
    "Mark-0" : [3, 1, 5],
    "Card-0" : [[1,2,7],[0,12,15],[6,9,12]],
    "HP-1" : [5, 3, 6],
    "Token-1" : [1, 30, 20],
    "Weapon-1" : [[0, 2, 1, 2, 1],[2, 1, 3, 1, 0],[1, 1, 1, 1, 1]],
    "Mark-1" : [3, 1, 5],
    "Card-1" : [[1,2,7],[0,12,15],[6,9,12]],
    "Round" : [3, 1, 3]   
}



def PreprocessingModel():
    inputs = {
        "HP-0" : keras.Input(shape=(), dtype='float32'),
        "Token-0" : keras.Input(shape=(), dtype='float32'),
        "Weapon-0" : keras.Input(shape=(5), dtype='float32'),
        "Mark-0" : keras.Input(shape=(), dtype='float32'),
        "Card-0" : keras.Input(shape=(3), dtype='int32'),
        "HP-1" : keras.Input(shape=(), dtype='float32'),
        "Token-1" : keras.Input(shape=(), dtype='float32'),
        "Weapon-1" : keras.Input(shape=(5), dtype='float32'),
        "Mark-1" : keras.Input(shape=(), dtype='float32'),
        "Card-1" : keras.Input(shape=(3), dtype='int32'),
        "Round" : keras.Input(shape=(), dtype='float32')
    }

    hp_0 = layers.Rescaling(scale = 1./15., offset=0.0)(inputs["HP-0"])
    hp_1 = layers.Rescaling(scale = 1./15., offset=0.0)(inputs["HP-1"])

    token_0 = layers.Rescaling(scale = 1./50., offset=0.0)(inputs["HP-0"])
    token_1 = layers.Rescaling(scale = 1./50., offset=0.0)(inputs["HP-1"])

    weapon_0 = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["Weapon-0"])
    weapon_1 = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["Weapon-1"])

    mark_0 = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["Mark-0"])
    mark_1 = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["Mark-1"])

    card_0 = layers.CategoryEncoding(num_tokens = cards_num, output_mode = 'multi_hot')(inputs["Card-0"])
    card_1 = layers.CategoryEncoding(num_tokens = cards_num, output_mode = 'multi_hot')(inputs["Card-1"])

    round = layers.Rescaling(scale = 1./6., offset=0.0)(inputs["Round"])

    outputs = {
        "HP-0" : hp_0,
        "Token-0" : token_0,
        "Weapon-0" : weapon_0,
        "Mark-0" : mark_0,
        "Card-0" : card_0,
        "HP-1" : hp_1,
        "Token-1" : token_1,
        "Weapon-1" : weapon_1,
        "Mark-1" : mark_1,
        "Card-1" : card_1,
        "Round" : round
    }

    return keras.Model(inputs, outputs)



def TrainingModel():
    inputs = {
        "HP-0" : keras.Input(shape=(), dtype='float32'),
        "Token-0" : keras.Input(shape=(), dtype='float32'),
        "Weapon-0" : keras.Input(shape=(5), dtype='float32'),
        "Mark-0" : keras.Input(shape=(), dtype='float32'),
        "Card-0" : keras.Input(shape=(20), dtype='int32'),
        "HP-1" : keras.Input(shape=(), dtype='float32'),
        "Token-1" : keras.Input(shape=(), dtype='float32'),
        "Weapon-1" : keras.Input(shape=(5), dtype='float32'),
        "Mark-1" : keras.Input(shape=(), dtype='float32'),
        "Card-1" : keras.Input(shape=(20), dtype='int32'),
        "Round" : keras.Input(shape=(), dtype='float32')
    }


    embedding_layer = keras.layers.Dense(16, activation='relu', use_bias=False)

    concatenated_data = keras.layers.Concatenate()([
        tensorflow.expand_dims(inputs['HP-0'], -1),
        tensorflow.expand_dims(inputs['Token-0'], -1),
        inputs['Weapon-0'],
        tensorflow.expand_dims(inputs['Mark-0'], -1),
        embedding_layer(inputs['Card-0']),
        tensorflow.expand_dims(inputs['HP-1'], -1),
        tensorflow.expand_dims(inputs['Token-1'], -1),
        inputs['Weapon-1'],
        tensorflow.expand_dims(inputs['Mark-1'], -1),
        embedding_layer(inputs['Card-1']),
        tensorflow.expand_dims(inputs['Round'], -1),
    ])

    A = keras.layers.Dense(128, activation='relu')(concatenated_data)
    B = keras.layers.Dropout(0.5)(A)
    C = keras.layers.Dense(128, activation='relu')(B)
    D = keras.layers.Dropout(0.5)(C)
    E = keras.layers.Dense(128, activation='relu')(D)
    output = keras.layers.Dense(1, activation='sigmoid')(E)

    model = keras.Model(inputs, output)

    optimizer = keras.optimizers.Adam(learning_rate=0.0001, clipnorm=1.0)

    model.compile(loss='mse',
            optimizer=optimizer,
            metrics=['mae', 'mse'])

    # model.summary()

    return model
    


    # embedding = keras.layers.Embedding(cards_num, embedding_dims)
    # print(embedding(inputs["Card-0"]))
    
    # outputs = keras.layers.Concatenate()([
    #     embedding(inputs["Card-0"]),
    #     embedding(inputs["Card-1"])
    # ])

    # print(outputs)



    # ret = keras.layers.Dense(1)(outputs)
    # print(ret)



def InferenceModel(preprocessing_model, training_model):
    inputs = preprocessing_model.input
    outputs = training_model(preprocessing_model(inputs))

    inference_model = keras.Model(inputs, outputs)

    # inference_model.summary()

    return inference_model





# preprocessing_model = PreprocessingModel()

# dataset = tensorflow.data.Dataset.from_tensor_slices((features, labels)).batch(1)
# dataset = dataset.map(lambda x, y: (preprocessing_model(x), y), num_parallel_calls=tensorflow.data.AUTOTUNE)

# next(dataset.take(1).as_numpy_iterator())

# vali_data = dataset

# training_model = TrainingModel()

# EPOCHS = 5

# history = training_model.fit(dataset, epochs=EPOCHS, validation_data = vali_data)

# inference_model = InferenceModel(preprocessing_model, training_model)
# predict_dataset = tensorflow.data.Dataset.from_tensor_slices(predict_features).batch(1)

# ret = inference_model.predict(predict_dataset)

# print("\n\n======================================================\n\n")
# print(ret)
