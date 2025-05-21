
import path from 'path';
import http from 'http';
import express from 'express';

import { fileURLToPath } from 'url';
// import { OAuth2Client } from 'google-auth-library';

import dotenv from 'dotenv'

import * as Backend from "#backend"

import Redis_Adapter from "redis-bird"

import favicon from "serve-favicon"

import { Random } from "random-js"
let random = new Random();


dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express()
const server = http.createServer(app)

const port = 3000
const publicDirectoryPath = path.join(__dirname, '../');




let redis_url = `redis://${process.env.REDIS}`
global.redis_adapter = new Redis_Adapter(redis_url, (channel_name, msg)=>{
    console.log(`[ ${channel_name} ] ${msg}`)
}, "client-0", "client")




let corsOptions = {
    origin: 'https://storage.orlog.io',
    credentials: true,
    optionsSuccessStatus: 200
    // "origin": "*",
    // "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    // "preflightContinue": false,
    // "optionsSuccessStatus": 204
}

// app.use(cors(corsOptions))

// console.log("hello hello hello")

// 다른 routing 함수보다 앞에 설정되어야 함
// app.all('/*', (req, res, next) => {
//     //res.send(req);
//     // console.log(req.method + " : " + req.url);
//     next();
// });







// console.log(publicUtilPath);

// express.static 메서드는 node 프로세스가 실행되는 디렉터리에 상대적입니다. 따라서 절대경로를 사용하는 것이 안전할 수 있습니다.
// app.use(express.static(publicDirectoryPath));
// app.use(express.static(publicDirectoryPath, {index : "frontpage.html"}));

// console.log("hello")


// app.use(express.static(publicDirectoryPath, {index : "./src/index.html"}));
app.use(favicon(path.join(publicDirectoryPath, 'frontend', 'favicon.ico')))
app.use(express.static(publicDirectoryPath, { index: "./frontend/public/src/html/login.html" }));
// app.use(express.static('src'));
app.use("/css", express.static('frontend/public/src/css'));
app.use("/js", express.static('frontend/public/src/js'));
app.use("/html", express.static('frontend/public/src/html/pages'))
app.use("/textures", static_routing);
app.use("/img", static_routing);
app.use("/entry", express.static('frontend/entry'));
app.use(express.static('frontend'));
app.use(express.static('node_modules'));
app.use(express.static('auth'));


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended : true, limit: '50mb'  }))

// app.set('views', publicDirectoryPath + "frontend/public/src/html");
// app.set("view engine", "ejs")
// app.engine('html', ejs.renderFile);

app.use('/resources/', (req, res, next) =>{
    console.log(req.method + " : " + req.url);
    next(); // 이게 없으면 hanging에 빠진다.
});

// app.get("/resources/", (req,res,next)=>{
//     next();
// });





let r2_url = "https://storage.orlog.io"

// app.use("/textures", express.static('static/textures'));
// app.use("/models", express.static('static/models'));
// app.use("/sounds", express.static('static/sounds'));

// app.use("/textures", static_routing);
// app.use("/models", static_routing);
// app.use("/sounds", static_routing);
app.use("/gameui", express.static('src'));
app.use("/game", express.static('src'));


function static_routing(req,res,next){
    res.status(301).redirect(r2_url + req.originalUrl)
}


app.get('/html', (req, res, next) => {
    res.send("it's ok")
})





// const CLIENT_ID = "<GOOGLE OAUTH CLIENT ID>"
// const client = new OAuth2Client(CLIENT_ID);


async function verify(req, res, next) {

    req.idToken = random.string(50)
    req.email = `${random.string(10)}@gmail.com`
    next()

    // let token = null
    // req.rawHeaders.forEach(header => {
    //     let txt = header.split('Bearer ')[1]
    //     if (txt != null || txt != undefined)
    //         token = txt
    // })


    // await client.verifyIdToken({
    //     idToken: token,
    //     audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    //     // Or, if multiple clients access the backend:
    //     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    // }).then((e) => {
    //     // console.log(e)
    //     const payload = e.getPayload();
    //     // return payload
    //     req.idToken = payload.sub
    //     req.email = payload.email


    //     next()
    // }).catch(next)
}




let authRouter = express.Router()
authRouter.post('/gamestart', (req, res, next) => {
    console.log("[game start]")
    let id = req.idToken
    let name = req.email.split("@")[0]
    console.log(id)
    console.log(name)
    console.log(req.body.game_mode)
    let prom = global.redis_adapter.AddUser(id, req.body.game_mode, true, null, null, name)
    console.log("start add user")
    prom.then((ret)=>{
        console.log("end add user")
        if(ret != null)
            res.send(ret.token)
        else
            res.send(null)
    }).catch(next)
})

authRouter.post('/createlobby', (req, res, next) => {
    // console.log("[Create Lobby]")
    let id = req.idToken
    let name = req.email.split("@")[0]
    let prom = global.redis_adapter.AddUser(id, null, false, true, null, name)
    prom.then((ret)=>{
        if(ret != null)
            res.send(ret.token)
        else
            res.send(null)
    }).catch(next)
})


authRouter.post('/joinlobby', (req, res, next) => {
    // console.log("[Join Lobby]")
    let id = req.idToken
    let name = req.email.split("@")[0]
    let prom = global.redis_adapter.AddUser(id, null, false, false, req.body.game_mode, name)
    prom.then((ret)=>{
        if(ret != null)
            res.send(ret.token)
        else
            res.send(null)
    }).catch(next)
})



function CreateUserData(uid_, game_mode){
    let token_ = null
    while(1){
        token_ =  _GetRandomToken()
    }


    let data_ = {
        uid : uid_,
        token : token_,
        gamemode : game_mode,
        state : "requested",
        opponent : null,
        socket_server : null,
        logic_server : null
    }

}



function _GetRandomToken(){
    return random.string(1300)
}


authRouter.post("/login", (req, res, next)=>{

    // console.log(`[[ ${req.idToken} ${req.email} ]]`)

    // console.log(req.idToken, req.email)

    let prom = Backend.Login(req.idToken, req.email)

    prom.then((user_info_summary)=>{
        // console.log(user_info_summary)
        // console.log("promise is released")
        if (user_info_summary == null) {
            user_info_summary = {
                email : req.email,
                scores : {
                    constant : 0,
                    liberty : 0,
                    draft : 0
                }
            }
        }


        res.send(user_info_summary)
        // res.send("true")
    }).catch(next)

})

// console.log(publicDirectoryPath)


let google_login_router = express.Router()
google_login_router.post("/endpoint", (req, res, next)=>{
    // console.log("[[ POST - login endpoint ]]")
    // console.log(publicDirectoryPath)

    // res.render(publicDirectoryPath + "frontend/public/src/html/index.html", {title : "A"})
    // res.render(publicDirectoryPath + "frontend/public/src/html/index.ejs", {title : "A"})

    // console.log(path.resolve('views/main.html'))
    // console.log(publicDirectoryPath + "frontend/public/src/html/index.html")
    // const config_ = { headers: { Authorization: `Bearer ${req.token}` } }
    // const config_ = {}
    // res.setHeader("Content-Type", "text/html");
    // res.sendFile(path.resolve("frontend/public/src/html/index.html"))
    // res.render(path.resolve("frontend/public/src/html/index.html"))
    res.render(path.resolve("frontend/public/src/html/index.html"))
    // res.end()
})




google_login_router.get("/endpoint", (req, res, next)=>{
    // console.log("[[ GET - login endpoint ]]")
    // console.log(path.resolve("frontend/public/src/html/index.html"))
    // res.render(path.resolve("frontend/public/src/html/index.html"), {"ddd" : "hello"})
    // console.log(res.locals)
    // res.render(path.resolve("frontend/public/src/html/index.html"))
    res.sendFile(path.resolve("frontend/public/src/html/index.html"))
})


async function google_oauth_authentication(req, res, next) {
    // console.log("verify")
    // console.log(req.body.credential)
    let token = null
    // req.rawHeaders.forEach(header => {
    //     let txt = header.split('Bearer ')[1]
    //     if (txt != null || txt != undefined)
    //         token = txt
    // })


    token = req.body.credential

    // console.log(token)


    await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).then((e) => {
        // console.log(e)
        const payload = e.getPayload();
        // return payload
        // console.log(payload.sub)
        req.token = token
        req.idToken = payload.sub
        req.email = payload.email

        // console.log(payload)

        // console.log(req.idToken)
        // console.log(req.email)
        // console.log(payload.code)

        next()
    }).catch(next)
}


async function middle_(req, res, next){
    res.locals.ddd = ""

    next()
}


app.use('/auth', verify, authRouter)

// app.use("/oauth/google", verify, google_login_router)
// app.use("/oauth/google", google_oauth_authentication, google_login_router)
app.use("/oauth/google", google_login_router)



let dummyRouter = express.Router()


dummyRouter.post('/gamestart', (req, res, next) => {
    let token = null
    req.rawHeaders.forEach(header => {
        let txt = header.split('Bearer ')[1]
        if (txt != null || txt != undefined)
            token = txt
    })


    let game_mode = req.body.game_mode
    
    let prom = global.redis_adapter.AddUser(token, game_mode, true, false)
    prom.then((ret)=>{
        if(ret != null)
            res.send(ret.token)
        else
            res.send(null)
    }).catch(next)
    


     return;
     // let token = null
     // req.rawHeaders.forEach(header => {
     //     let txt = header.split('Bearer ')[1]
     //     if (txt != null || txt != undefined)
     //         token = txt
     // })


     // let game_mode = req.body.game_mode

     // // console.log(`[[ ${token} ]]`)
     // // console.log(`[[ ${game_mode} ]]`)


     // global.axios_pool.get(`http://${process.env.MATCH_MAKER}/register_match_pool?uid=${token}&game_mode=${game_mode}`)
     //     .then((ret) => {
     //         if (ret.data != false) {
     //             // match-making pool에 등록 완료
     //             // matching token 발급
     //             // setTimeout(()=>{
     //             res.send(ret.data)

     //             // }, 45000)
     //         }
     //         else{
     //             console.log(`[ dummy ${token} ] : deny to register at matching server!`)
     //             res.send(false)
     //         }

     //     })
     //     .catch(console.log)
 })

let dummies_index = new Array(1000)
for(let i=0; i<dummies_index.length; i++)
    dummies_index[i] = i

let dummies_set = new Set(dummies_index)

// setInterval(() => { console.log(Array.from(dummies_set)) }, 30000)

dummyRouter.post("/login", (req, res, next) => {
    // console.log(`[[ ${req.query.id} ]]`)
    // console.log(`[[${req.query.email} ]]`)
    let prom = Backend.Login(req.query.id, req.query.email)

    dummies_set.delete(parseInt(req.query.id))

    prom.then((user_info_summary) => {
        // setTimeout(()=>{
        //     res.send(true) 

        // }, 30000)
        res.send(user_info_summary)
    }).catch(next)
})


app.use('/dummy', dummyRouter)






app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    // res.render('error', { error: err })
})



let totalUsers = 0;


// 요청 코드 : <script type="module" src="/test/script.js"></script>
// Request URL: http://localhost:3000/test/script.js
// Request Method: GET
// Status Code: 404 Not Found

// 요청 코드 : <img src="../resources/images/dummy/orlog_valhalla.jpg">
// Request URL: http://localhost:3000/resources/images/dummy/orlog_valhalla.jpg
// Request Method: GET
// Status Code: 404 Not Found



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})



server.timeout = 60000
server.maxHeadersCount = 2000
server.timeout = 120000