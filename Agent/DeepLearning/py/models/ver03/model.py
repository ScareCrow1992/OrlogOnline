
import pandas
import numpy
import tensorflow
from tensorflow import keras
from keras import layers


features = {
    'type': [0, 1, 1],
    'size': ['small', 'small', 'medium'],
    'weight': [2.7, 1.8, 1.6],
}
labels = [1, 1, 0]
predict_features = {'type': [0], 'size': ['foo'], 'weight': [-0.7]}


vocab = ['small', 'medium', 'large']
one_hot_dims = 3
embedding_dims = 4
weight_mean = 2.0
weight_variance = 1.0



inputs = {
  'type': keras.Input(shape=(), dtype='int64'),
  'size': keras.Input(shape=(), dtype='string'),
  'weight': keras.Input(shape=(), dtype='float32'),
}
# Convert index to one-hot; e.g. [2] -> [0,0,1].
type_output = keras.layers.CategoryEncoding(
      one_hot_dims, output_mode='one_hot')(inputs['type'])
# Convert size strings to indices; e.g. ['small'] -> [1].
size_output = keras.layers.StringLookup(vocabulary=vocab)(inputs['size'])
# Normalize the numeric inputs; e.g. [2.0] -> [0.0].
weight_output = keras.layers.Normalization(
      axis=None, mean=weight_mean, variance=weight_variance)(inputs['weight'])
outputs = {
  'type': type_output,
  'size': size_output,
  'weight': weight_output,
}
preprocessing_model = keras.Model(inputs, outputs)




dataset = tensorflow.data.Dataset.from_tensor_slices((features, labels)).batch(1)
dataset = dataset.map(lambda x, y: (preprocessing_model(x), y),
                      num_parallel_calls=tensorflow.data.AUTOTUNE)
# Display a preprocessed input sample.
next(dataset.take(1).as_numpy_iterator())



inputs = {
  'type': keras.Input(shape=(one_hot_dims,), dtype='float32'),
  'size': keras.Input(shape=(), dtype='int64'),
  'weight': keras.Input(shape=(), dtype='float32'),
}
# Since the embedding is trainable, it needs to be part of the training model.
embedding = keras.layers.Embedding(len(vocab), embedding_dims)

print(inputs['size'])

print("\n============================\n")

print(inputs["type"])
print(embedding(inputs['size']))
print(tensorflow.expand_dims(inputs['weight'], -1))

print("\n============================\n")


outputs = keras.layers.Concatenate()([
    inputs['type'],
    embedding(inputs['size']),
    tensorflow.expand_dims(inputs['weight'], -1),
])
outputs = keras.layers.Dense(1)(outputs)
training_model = keras.Model(inputs, outputs)



# Train on the preprocessed data.
training_model.compile(
    loss=tensorflow.keras.losses.BinaryCrossentropy(from_logits=True))
training_model.fit(dataset)



inputs = preprocessing_model.input
outputs = training_model(preprocessing_model(inputs))
inference_model = keras.Model(inputs, outputs)

inference_model.summary()

predict_dataset = tensorflow.data.Dataset.from_tensor_slices(predict_features).batch(1)
inference_model.predict(predict_dataset)



