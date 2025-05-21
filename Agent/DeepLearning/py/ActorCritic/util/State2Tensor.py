import tensorflow as tf

def State2Tensor(dict_):
    ret = {}
    for key in dict_:
        if isinstance(dict_[key], dict):
            ret[key] = State2Tensor(dict_[key])
        else:
            ret[key] = tf.constant([dict_[key]], dtype = tf.float32)

    return ret
