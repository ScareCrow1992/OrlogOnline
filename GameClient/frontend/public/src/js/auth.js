
import PageAdmin from "/js/page_admin.js"

let idToken = null
let sub = null
let matchAuthToken = null
let responsePayload = null

function handleCredentialResponse(response) {
    // console.log(response)
    // console.log("Encoded JWT ID token: " + response.credential);

    // console.log("login complete")

    window.Play_Buttons_Active()


    responsePayload = parseJwt(response.credential);

    // console.log(responsePayload)
    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);
    // console.log("Auth code: " + response.code)

    sub = responsePayload.sub
    idToken = response.credential;


    Login().then(res=>{
        // console.log(res.data)
        let user_info = res.data
        // console.log(typeof user_info.email)

        let user_profile_wrapper = document.getElementById("user_profie_wrapper")

        document.getElementById("buttonDiv").style.display = "none"
        user_profile_wrapper.style.display = "flex"
        // user_profile_wrapper.style.content = `url("${responsePayload.picture}")`

        let user_profile_picture = user_profile_wrapper.getElementsByClassName("user_profile_picture")[0]
        user_profile_picture.style.content = `url("${responsePayload.picture}")`
        
        let user_profile_name = user_profile_wrapper.getElementsByClassName("user_profile_name")[0]
        user_profile_name.innerText = user_info.email.split("@")[0]

        window.user_name = user_profile_name.innerText

        // let rank_scores = document.getElementsByClassName("rank-score-style")
        // rank_scores[0].innerText = user_info.scores["constant"]
        // rank_scores[1].innerText = user_info.scores["liberty"]
        // rank_scores[2].innerText = user_info.scores["draft"]

        PageAdmin.ChangeScore(user_info.scores)
        
    })
        .catch(console.log)


    // idToken += "ddd"
    
}



function GetAuthData(){
    const config_ = {
        headers: { Authorization: `Bearer ${idToken}` }
        // headers: { 
        //     "Content-Type": `application/json;charset=UTF-8`,
        //     "Accept": "application/json",
        //     Authorization: `Bearer ${idToken}`,
        //     "Access-Control-Allow-Origin": `${window.config["HTTP"]}://${window.config["game-client"]}`,
        //     'Access-Control-Allow-Credentials':"true"
        // }
    };


    return config_
}



function Login(){
    const config_ = GetAuthData()
    const bodyParameters = { key: "value" };
    // console.log(window.config)

    return axios.post(
        `${window.config["HTTP"]}://${window.config["game-client"]}/auth/login` ,
        bodyParameters,
        config_
    )


    

    // if (window.config["HTTP"] === "https") {

        // google.accounts.id.revoke(id, (done) => {
        //     console.log(done)

        //     const client = google.accounts.oauth2.initCodeClient({
        //         client_id: 'CLIENT_ID',
        //         scope: 'https://www.googleapis.com/auth/devstorage.full_control',
        //         login_hint : id,
        //         select_account : false,
        //         ux_mode: 'popup',
        //         prompt : "none",
        //         callback: (response) => {
        //             const xhr = new XMLHttpRequest();
        //             xhr.open('GET', "https://orlog.io", true);
        //             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //             // Set custom header for CRSF
        //             xhr.setRequestHeader('X-Requested-With', 'XmlHttpRequest');
        //             xhr.onload = function () {
        //                 // console.log('Auth code response: ' + xhr.responseText);
        //                 console.log(response.code)
        //             };
        //             xhr.send('code=' + response.code);
        //         },
        //     });
    
        //     client.requestCode()
        // })


        // return axios.get(
        //     // `${window.config["HTTP"]}://${window.config["game-client"]}/auth/login` ,
        //     // `https://storage.googleapis.com/storage/v1/b/orlog-online-386011.appspot.com?fields=cors`,
        //     "https://console.cloud.google.com/storage/browser/orlog-online-386011.appspot.com",
        //     // bodyParameters,
        //     config_
        // )


    // }
    // else {
    //     return "offline game"
    // }

}



function Verify(req, game_mode = "liberty"){
    // const config_ = {
        // headers: { Authorization: `Bearer ${responsePayload.sub}` }
    //     headers: { Authorization: `Bearer ${idToken}` }
    // };

    // const bodyParameters = { key: "value", game_mode : game_mode };

    const config_ = GetAuthData()
    
    const bodyParameters = { key: "value", game_mode : game_mode };

    // console.log("Hello~~~~")
    // console.log(`game client : ${window.config["game-client"]}`)
    return axios.post(
        `${window.config["HTTP"]}://${window.config["game-client"]}/auth/` + req ,
        bodyParameters,
        config_
    )
}



window.onload = function () {
    window.Play_Buttons_Active()
    return;
    let oauth_response = localStorage.getItem("oauth_response")
    oauth_response = JSON.parse(oauth_response)
    handleCredentialResponse(oauth_response)


    return;


    google.accounts.id.initialize({
        client_id: "<client id>",
        auto_select: true,
        close_on_tap_outside: false,
        itp_support: true,
        // scope: ["profile", "email", 'https://www.googleapis.com/auth/devstorage.full_control'],
        redirect_uri : "https://orlog.io/index.html",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
            theme: "outline",
            size: "large",
            // type: "icon",
            // login_uri: "http://localhost:3000/auth/zzz",
            // auto_select: true,
            // close_on_tap_outside: false,
            // itp_support: true
        }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}




document.getElementById("setting-signout").addEventListener("click", () => {
    google.accounts.id.disableAutoSelect()
})



function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function GameStart(req, game_mode) {
    return Verify(req, game_mode)
}


function SetMatchAuthToken(token_){
    matchAuthToken = token_
}

function GetMatchAuthToken(){
    return matchAuthToken
}





export { GameStart, SetMatchAuthToken, GetMatchAuthToken }