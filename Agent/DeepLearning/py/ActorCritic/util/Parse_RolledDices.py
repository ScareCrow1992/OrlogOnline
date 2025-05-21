
weapon_dict = {
    "axe" : [1, 0, 0, 0, 0],
    "arrow" : [0, 1, 0, 0, 0],
    "helmet" : [0, 0, 1, 0, 0],
    "shield" : [0, 0, 0, 1, 0],
    "steal" : [0, 0, 0, 0, 1],
}

def Parse_RolledDices(rolled_dices):
    ret = []
    for dice_index in range(0, 6):
        weapon = rolled_dices["weapon"][dice_index]
        token = rolled_dices["mark"][dice_index]

        tmp = []

        if weapon is not None:
            tmp.extend(weapon_dict[weapon])
        else:
            tmp.extend([0, 0, 0, 0, 0])

        if token == True and weapon is not None:
            tmp.append(1)
        else:
            tmp.append(0)
        
        ret.append(tmp)

    return ret

