import redis
import json
import asyncio

class RedisAdapter:
    def __init__(self, url, name, cb):
        self.name = name
        self.cb = cb
        self.instance = redis.Redis(host=url, port=6379, decode_responses=True)

        self.pubsub = PubSub(self.instance.pubsub(), name)

        self.prediction_index = 0


    def Work(self):
        while True:
            self.Pipe_Streaming("/ai/stream/")
            self.pubsub.Work()



    def Pipe_Streaming(self,key):
        # await asyncio.sleep(1)
        # print("Pipe Streaming")

        iii = self.prediction_index

        # print(iii, " - start blpop")

        res = self.instance.blpop(key, 1)
        # print(iii, " - end blpop")

        if(res is not None):
            key = res[0]
            value = res[1]

            msg = None
            try:
                msg = json.loads(value)
                # print(msg)
            except:
                print("conver to JSON is fail")
                msg = None
            
            if msg is not None:
                
                func_ = msg["func"]
                args_ = msg["args"]
                id_ = msg["id"]
                type_ = msg["type"]
                sender_ = msg["sender"]

                # self.Operate(func_, args_, id_, type_, sender_)

                # print(iii, " - run operate")

                asyncio.run(self.Operate(func_, args_, id_, type_, sender_, iii))
                # ret = self.Operate(func_, args_)

                # if (type_ == "request"):
                #     self.Response(id_, self.name, ret, sender_)

                # print(iii, " - end operate")

                self.prediction_index += 1


    



    async def Operate(self, func_, args_, id_, type_, sender_, iii):
        # print(iii, " - < start async >")
        # print(func_)
        # print(args_)
        # print(id_)
        # print(type_)
        # print(sender_)

        if iii % 100 == 0:
            print(iii)

        # print("[[ ", iii, " ]] - before callback")
        ret = await self.cb(func_, args_)
        # print("[[ ", iii, " ]] - after callback")

        if(type_ == "request"):
            self.Response(id_, self.name, ret, sender_)
            
        # print(iii, " - << end async >>")


    
    def Response(self, id_, name_, msg_, sender_):
        msg = {
            "id" : id_,
            "type" : "response",
            "sender" : name_,
            "data" : msg_
        }

        # print(msg_)

        json_msg = json.dumps(msg)
        self.instance.publish(sender_, json_msg)
        



    def set(self, key, value):
        self.instance.set(key, value)


    def get(self, key):
        return self.instance.get(key)


class PubSub:
    def __init__(self, pubsub : redis.client.PubSub, name):
        pubsub.subscribe(name)
        self.instance = pubsub


    def Work(self):
        # print("on message")
        res = self.instance.get_message(timeout = 0.000001)
        if res is not None:
            # print(f"res: {res}")
            self.Listen(res)



    def Listen(self, res):
        # print(type(res))
        # print(res)
        type_ = res["type"]
        pattern_ = res["pattern"]
        channel_ = res["channel"]
        data_ = res["data"]

        msg = None
        if type_ == "message":
            try:
                msg = json.loads(data_)
                # print(msg)
            except:
                print("conver to JSON is fail")
                msg = None
        
        if msg is not None:
            self.Operate(msg)

    def Operate(self, msg):
        # print(type(msg))
        # print(msg)

        type_ = msg["type"]
        func_ = msg["func"]
        args_ = msg["args"]

        # print(type_, func_, args_)
        # print(type(args_))
        # print(args_[0], args_[1], args_[2], args_[3])
        self.Test_Args(*args_)
    

    def Test_Args(self, a0, a1, a2, a3):
        print(a0, a1, a2, a3)






# rd = redis.Redis(host='localhost', port=6379, decode_responses=0)

# rd.get('foo')

# print(rd)

# rd.set("aaa", "ddd")

# rd.set('foo', 'bar')