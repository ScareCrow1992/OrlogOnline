

def Str2List(str):
    arr = str.split(',')
    arr.pop()
    arr = list(map(int, arr))

    return arr


def SliceList(arr, unit_length):
    length_ = len(arr) // unit_length
    ret = []
    for index in range(length_):
        from_ = index * unit_length
        to_ = from_ + unit_length

        sub_list = arr[from_: to_]
        ret.append(sub_list)

    return ret
