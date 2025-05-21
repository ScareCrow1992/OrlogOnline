
def Dict2List(dict_):
    ret = []
    for key in dict_:
        if isinstance(dict_[key], dict):
            # ret.append(key)
            ret.extend(Dict2List(dict_[key]))
        else:
            if isinstance(dict_[key], list):
                ret.extend(dict_[key])
            else:
                ret.append(dict_[key])
            # ret.append(tf.constant(dict_[key]))
            # ret.append(key)

    return ret