import axios from "axios"

let backend_host = `http://${process.env.LOCAL_BACK_END}`


function AddResult(first_user, second_user, situation){

    let path = "/AddResult"

    let url = backend_host + "/local" + path

    // console.log(situation)


    let data = {
        first : JSON.stringify(first_user),
        second : JSON.stringify(second_user),
        situation : JSON.stringify(situation)
    }
    
    global.axios_pool({
        method: "post", // 요청 방식
        url: url, // 요청 주소
        data: data
    })

    // axios.post(url)
    // .then((ret) => {
    //     console.log(ret.data)
    // })
    // .catch(console.log)
}

export { AddResult }


// setTimeout(() => { AddResult({sub : "ddd", arr : [0,1,2]}, {sub : "abc", arr : [7,8,9]}, { winner: 0 }) }, 3000)