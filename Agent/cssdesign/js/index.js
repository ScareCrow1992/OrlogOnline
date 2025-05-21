// import ServerSocket from "./utils/ServerSocket.js"

import path from 'path';
import http from 'http';
import express from 'express';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express()
const server = http.createServer(app)
server.timeout = 60000

const port = 2424
const publicDirectoryPath = path.join(__dirname, '../');


app.use(express.static(publicDirectoryPath, { index: "./page.html" }));


app.use("/css", express.static('css'));
app.use("/js", express.static('js'));
app.use("/html", express.static('html'))
app.use("/img", express.static('img'))




server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})