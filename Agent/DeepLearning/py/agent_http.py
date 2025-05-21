from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
from ast import literal_eval
import predict




class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        print("[after read]")
        print(post_data)
        # logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                # str(self.path), str(self.headers), post_data.decode('utf-8'))

        self._set_response()
        # self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))

        data_ = literal_eval(post_data.decode('utf-8'))

        path = str(self.path)
        """
            switch(path)
                case "/pick_dice" :
                
                break;
        """

        keys = data_["keys"]
        
        print("[before predict]")
        [worst, best] = predict.Predict(keys)

        response = str(worst) + '/' + str(best)
        response = response.encode('utf-8')
        print("[before send]")
        print(response)
        self.wfile.write(response)
        # a = '0/0'
        # a = a.encode('utf-8')
        # self.wfile.write("0/0")
        # print("[after send]")



def run(server_class=HTTPServer, handler_class=S, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()