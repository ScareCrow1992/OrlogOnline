from Godfavor import Godfavor_Agent
from Roll import Roll_Agent
from RedisAdapter import RedisAdapter
from util.Parse_RolledDices import Parse_RolledDices

import tensorflow as tf
import asyncio


class AI_Machine :
    def __init__(self, url, name, model_version):

        self.redis_adapter = RedisAdapter(url, name, self.Listen)

        self.godfavor_agent = Godfavor_Agent()
        self.roll_agent = Roll_Agent()

        self.model_version = model_version


    def Work(self):
        asyncio.run(self.redis_adapter.Work())


    async def Listen(self, func_, args_):
        ret = None
        if func_ == "Predict":
            ret = await self.Predict(*args_)
        elif func_ == "Get_Model_Version":
            ret = self.Get_Model_Version()
        
        return ret
        


    def Get_Model_Version(self):
        return self.model_version


    async def Predict(self, state, mask, phase):
        # print(len(states), phase)
        # phase = state["situation"]["phase"]

        # state["situation"]["order"] = state["situation"]["order"][0]

        # for user in ["avatar", "opponent"]:
        #     if "dices_" in state[user]:
        #         del state[user]["dices_"]
        #     if "empty" in state[user]["dices"]:
        #         del state[user]["dices"]["empty"]

        # tensor_state = tf.constant([state])

        if phase == 0:
            return await self.Predict_Roll(state, mask)
        elif phase == 1:
            return await self.Predict_Godfavor(state, mask)




    async def Predict_Roll(self, state, mask):
        # print("<< Roll >>")




        # rolled_dices = Parse_RolledDices(state["situation"]["rolled_dices"])
        
        # for junk_key in ["round", "winner", "gameover", "phase", "rolled_dices"] :
        #     if junk_key in state["situation"]:
        #         del state["situation"][junk_key]

        # state["rolled_dices"] = rolled_dices


        action, value, masked_action = await self.roll_agent.Predict(state, mask)

        # masked_action_raw = masked_action[0].numpy().tolist()
        # value_raw = value[0].numpy().tolist()[0]

        # masked_action_raw = masked_action.numpy().tolist()
        # value_raw = value.numpy().tolist()

        masked_action_raw = masked_action.tolist()
        value_raw = value.tolist()

        return [masked_action_raw, value_raw]


    async def Predict_Godfavor(self, states, mask):
        # print("<< Godfavor >>")


        # if "inputs" in state:
        #     del state["inputs"]

        # for junk_key in ["round", "winner", "gameover", "phase", "rolled_dices", "turn"] :
        #     if junk_key in state["situation"]:
        #         del state["situation"][junk_key]

        
        # # print(state)
        action, value, masked_action = self.godfavor_agent.Predict(states, mask)

        # masked_action_raw = masked_action[0].numpy().tolist()
        # value_raw = value[0].numpy().tolist()[0]

        # masked_action_raw = masked_action.numpy().tolist()
        # value_raw = value.numpy().tolist()

        
        masked_action_raw = masked_action.tolist()
        value_raw = value.tolist()

        return [masked_action_raw, value_raw]

    