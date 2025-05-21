import axios from "axios";


let host = `http://${process.env.BACK_END}`


async function Login(sub, email){

    // console.log(process.env)

    let ret = await global.redis_adapter.Login(sub, email)
    // console.log(ret)

    return ret.args[0];

    // let path = "/user/login"
    // let query = `?id=${sub}&email=${email}`

    // let url = host + path + query
    // console.log(url)


    // await global.axios_pool.get(url)
    // .then((ret) => {
    //     // console.log(ret.data)
    // })
    // .catch(console.log)

    // console.log("[[ user check is successful ]]")
}

export { Login }