import Init from "./Init.js"
import AddUser from "./AddUser.js"
import Get_Random_Battle from "../test/Get_Random_Battle.js"
import AddResult from "./AddResult.js"


let users = [
    { id: "77775555", email: "ahri@naver.com" },
    { id: "354364553453", email: "gogowjdgo1@gmail.com" },
    { id: "6563454312", email: "pixelbot@gmail.com" },
    { id: "54646254342", email: "yohoho@daum.net" },
    { id: "54654757345234", email :"choose@samsung.com"}
]


export default function () {
    // console.log(`${process.env.pm_id} : ${process.env.name}`)
    // console.log(random_battles)

    Init().then(() => {
        // users.forEach(user => { AddUser(user.id, user.email) })
        // let random_battles = Get_Random_Battle(users, 5)
        // random_battles.forEach(result =>{
        //     AddResult(result[0], result[1], result[2])
        // })
        
    })
}