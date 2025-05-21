import express from "express"

import FindUser from "#db_process/FindUser.js"
import AddUser from "#db_process/AddUser.js"
import UserLogin from "#db_process/UserLogin.js"


let userRouter = express.Router()
export default userRouter


// 유저 접속
userRouter.get('/login', (req, res, next)=>{
    // console.log(`[ pid ${process.env.pm_id} ] = ${req.query.id} , ${req.query.email}  `)

    // console.log(`[  ${req.query.id} , ${req.query.email}  ]`)

    let user_info = UserLogin(req.query.id, req.query.email)
    // user_info.then(console.log)

    res.send(true)
    // setTimeout(()=>{res.send(true)}, 5000)
    

})


// 유저 프로필 로드
userRouter.get('/profile', (req, res, next)=>{
    // console.log("[[ profile ]]")
    
    // console.log(`[ server ${process.env["HTTP_PORT"]} ] :: [ pid ${process.env.pm_id} ] = ${req.query.id}  `)

    res.send(req.query.id)
})
