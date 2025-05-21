keys = ["HP-0", "Token-0", "Weapon-0", "Mark-0", "Card-0", "HP-1", "Token-1", "Weapon-1", "Mark-1", "Card-1", "Round"]


def PrintFeature(features, index):
    for key in keys:
        print("[ {0}] : {1}".format(key, features[key][index]))