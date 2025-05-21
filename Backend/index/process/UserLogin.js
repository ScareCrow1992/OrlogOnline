// import FindUser from "#db_process/FindUser.js"
import AddUser from "#db_process/AddUser.js"
import FindUser_Summary from "#db_process/FindUser_Summary.js"


export default async function(sub, email){

    // console.log("[[ UserLogin ]]")
    // console.log(sub)
    // console.log(email)
    let ret = await FindUser_Summary(sub)
    
    // console.log(ret)
    if(ret == null){
        AddUser(sub, email)
        return null
        // return await FindUser_Summary(sub)
    }
    else
        return ret
}
