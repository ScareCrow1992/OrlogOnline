from AI_Machine import AI_Machine

import tensorflow as tf;
print(tf.config.list_physical_devices('GPU'))
# import os
# os.environ["TF_CPP_MIN_VLOG_LEVEL"] = "2"


# import tensorflow as tf
# from tensorflow.python.client import device_lib
# print(tf.config.list_physical_devices('GPU'))

# print(device_lib.list_local_devices())

# print(tf.test.is_built_with_cuda())
# tf.test.gpu_device_name()


# from multiprocessing import Process
from threading import Thread


def Main(index_):
    print(index_)
    channel = "ai-" + index_
    print("start", channel)
    
    ai_machine = AI_Machine("localhost", channel, None)
    ai_machine.Work()

Main("0")


# if __name__ == '__main__':

#     p0 = Thread(target=Main, args=("0",))
#     p1 = Thread(target=Main, args=("1",))
#     p2 = Thread(target=Main, args=("2",))
#     p3 = Thread(target=Main, args=("3",))

#     p0.start() 
#     p1.start() 
#     p2.start() 
#     p3.start()


#     # p0.close()
#     # p1.close()
#     # p2.close()
#     # p3.close()


#     p0.join()
#     p1.join()
#     p2.join()
#     p3.join()


# from RedisAdapter import RedisAdapter


# redis_adapter = RedisAdapter("localhost", "ai-0")
# redis_adapter.set("hello", "world")

# value = redis_adapter.get("hello")
# print(value)

# redis_adapter.Work()




# loop = asyncio.get_event_loop()
# try:
#     asyncio.ensure_future(redis_adapter.Work())

#     loop.run_forever()
# except KeyboardInterrupt:
#     pass
# finally:
#     print("Closing Loop")
#     loop.close()
# redis_adapter.Work()

