import numpy as np

godfavor_dict = { "Baldr" : 0, "Bragi" : 1, "Brunhild" : 2, "Freyja" : 3, "Freyr" : 4, "Frigg" : 5, "Heimdall" : 6, "Hel" : 7, "Idun" : 8, "Loki" : 9, "Mimir" : 10, "Odin" : 11, "Skadi" : 12, "Skuld" : 13, "Thor" : 14, "Thrymr": 15, "Tyr" : 16, "Ullr" : 17, "Var" : 18, "Vidar" : 19 }


def Axe_Coefficient(state_):
    value = 0
    if godfavor_dict["Brunhild"] in state_["avatar"]["godFavors"]:
        value += 1

    if godfavor_dict["Hel"] in state_["avatar"]["godFavors"]:
        value += 1

    if godfavor_dict["Loki"] in state_["opponent"]["godFavors"]:
        value -= 1

    if godfavor_dict["Frigg"] in state_["opponent"]["godFavors"]:
        value -= 1

def Arrow_Coefficient(state_):
    value = 0
    if godfavor_dict["Brunhild"] in state_["opponent"]["godFavors"]:
        value += 1

    if godfavor_dict["Hel"] in state_["opponent"]["godFavors"]:
        value += 1

    
    if godfavor_dict["Loki"] in state_["opponent"]["godFavors"]:
        value += 1



def Helmet_Coefficient(state_):
    d = 5
    
    
def Shield_Coefficient(state_):
    d = 5

    
def Steal_Coefficient(state_):
    d = 5



def RollFilter(state_):
    rolled_dices = state_["rolled_dices"]

    actions = np.full((61), 0.0)
    mask = np.full((61), True)

    for dice_index in range(0, 6):
        weapon_ = rolled_dices["weapon"][dice_index]
        mark_ = rolled_dices["mark"][dice_index]

        if(weapon_ == None):
            actions[dice_index] = 0.0
            continue

            
        if(mark_ == True):
            if(state_["avatar"]["token"] <= 12):
                actions[dice_index] = 1.0
                continue


        if(mark_ == False):
            if(state_["avatar"]["token"] <= 12):
                actions[dice_index] = 0.0
                continue

            


        actions[dice_index] /= 2.0
            


