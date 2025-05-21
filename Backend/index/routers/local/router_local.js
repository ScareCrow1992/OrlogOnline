import express from "express"

import AddResult from "#db_process/AddResult.js"


let localRouter = express.Router()
export default localRouter


localRouter.post("/AddResult", express.json(),(req, res, next)=>{
    let data = req.body
    // console.log(req.body)

    data.first = JSON.parse(data.first)
    data.second = JSON.parse(data.second)
    data.situation = JSON.parse(data.situation)

    AddResult(data.first, data.second, data.situation)
    res.send("ok")
})
