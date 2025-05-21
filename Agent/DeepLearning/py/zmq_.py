import time
import zmq
import predict
import json

from utils._print_feature import PrintFeature

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

while True:
    message = socket.recv()
    message = message.decode('utf-8')

    [ticket, msg] = message.split("=")

    features = json.loads(msg)

    [worst, best] = predict.Predict(features)

    print("<< Best >>")
    PrintFeature(features, best)

    print("\n\n")
    print("<< Worst >>")
    PrintFeature(features, worst)

    response = {
        "ticket" : ticket,
        "keys" : str(worst) + '/' + str(best)
        # "keys" : str(0) + '/' + str(1)
    }

    response = json.dumps(response)
    response = response.encode('utf-8')


    socket.send(response)

