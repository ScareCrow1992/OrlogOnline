
// import axios from "axios";

// import PlayPage from "../html/pages/play.html"

import PageAdmin from "/js/page_admin.js"
import ButtonAdmin from "/js/button_admin.js"
import * as DomAdmin from "/js/dom_admin.js"
import * as Auth from "/js/auth.js"
// import * as Sockets from "./sockets.js"
import config from "config"
import Socket from "./Socket.js"
import language_convert from "./util/languages.js"

// console.log(document.querySelector("#logo-img"))
// console.log(document)

// languages("kr")



var state = {page_id : 1, data : 'test'};
history.pushState(state, null, "/");

// history.pushState(state, null, "/main");

window.lang_ = "en"
window.language_convert_ = language_convert

// window.addEventListener("keydown", event=>{
//     if(event.key === "z"){
//         window.lang_ = window.lang_ === "en" ? "kr" : "en"
//         window.language_convert_(window.lang_)
//     }
// })


document.getElementById("setting-language").addEventListener("click", () => { 
    window.lang_ = window.lang_ === "en" ? "kr" : "en"
    window.language_convert_(window.lang_)
})


// console.log(env)

let webpage = document.getElementById("webpage-root")
// console.log(webpage)
let gamescreen = document.getElementById("game-canvas")
let view_container = document.getElementById("view")

let blackout = document.getElementById("blackout")
let notice_block = document.getElementById("notice-block")

let notice_description = document.getElementById("notice-description")

let check_mark = document.getElementById("check-wrapper")

gamescreen.style.display = "none"
// webpage.style.display = "none"

window.BlackOn = BlackOn
window.BlackOff = BlackOff
window.GameScreenOn = GameScreenOn
window.GameScreenOff = GameScreenOff
window.NoticeMatchJoinOn = NoticeMatchJoinOn
window.NoticeMatchJoinOff = NoticeMatchJoinOff
window.CancleMatchWaiting = CancleMatchWaiting
window.PrepareMatch = PrepareMatch
window.config = config
window.screen_mode = "browser" // "browser" or "game"
window.PageAdmin = PageAdmin

// BlackOff()




function ToggleScreen(){
    webpage.style.display = webpage.style.display == "none" ? "" : "none"
    gamescreen.style.display = gamescreen.style.display == "none" ? "" : "none"

}


window.addEventListener("keydown", e => {
    // if(e.key == "r"){
    //     check_mark.style.display = check_mark.style.display == "none" ? "inline-block" : "none"
    // }

    if (e.key == "t") {
        ToggleScreen()
    }

    // if(e.key == "o"){
    //     BlurOn()
    //     NoticeMatchJoinOn()
    //     // console.log("blur on")
    // }

    // if(e.key == "i"){
    //     BlurOff()
    //     NoticeMatchJoinOff()
    // }

    // if (e.key == "z") {
    //     BlackOn().then(()=>{console.log("Black On")})
    //     // prom.finished.then(()=>{console.log("black on!")})
    // }


    // if (e.key == "x") {
    //     BlackOff().then(()=>{console.log("Black Off")})
    //     // prom.finished.then(()=>{console.log("black off!")})
    // }
})




function BlackOn() {
    let exOpacity = blackout.style.opacity
    NoticeMatchJoinOff()
    DomAdmin.HideMatchAlert()
    blackout.classList.remove("inactive")

    let prom = blackout.animate(
        [{ opacity: `${exOpacity}` }, { opacity: "1.0" }]
        , { duration: 1000 })
    prom.finished.then(() => { blackout.style.opacity = "1.0" })
    return prom.finished
}


function BlackOff() {
    check_mark.style.display = "none"
    blackout.classList.add("inactive")

    let prom = blackout.animate(
        [{ opacity: `${blackout.style.opacity}` }, { opacity: "0.0" }]
        , { duration: 1000 })
    prom.finished.then(() => { blackout.style.opacity = "0.0" })
    return prom.finished
}




function BlurOn() {
    blackout.style.opacity = "0.7"
}

function BlurOff() {
    blackout.style.opacity = "0.0"
}



function GameScreenOn() {
    // console.log("GameScreenOn")
    webpage.style.display = "none"
    gamescreen.style.display = ""
    window.screen_mode = "game"
}


function GameScreenOff() {
    // console.log("GameScreenOff")
    webpage.style.display = ""
    gamescreen.style.display = "none"
    window.screen_mode = "browser"
}




function NoticeMatchJoinOn() {
    // obsolete
    BlurOn()
    notice_description.innerText = "The Match Is Ready"
    notice_block.classList.add("visible")
}



function NoticeMatchJoinOff() {
    // obsolete
    BlurOff()
    notice_block.classList.remove("visible")
    check_mark.style.display = "none"
}


function PrepareMatch() {
    check_mark.style.display = "inline-block"
}


ButtonAdmin.SaveDom("home", document.getElementById("logo"))

let menuButtons = document.getElementsByClassName("menu-button")
ButtonAdmin.SaveDom("play", menuButtons[0])
ButtonAdmin.SaveDom("guide", menuButtons[1])
ButtonAdmin.SaveDom("news", menuButtons[2])
ButtonAdmin.SaveDom("about", menuButtons[3])
ButtonAdmin.SaveDom("lobby", menuButtons[4])
ButtonAdmin.SaveDom("contact", menuButtons[5])

ButtonAdmin.SaveDom("profile", document.getElementById("user_profie_wrapper"))

PageAdmin.InitialView(view_container)




let match_cancle_button = document.getElementById("match-cancle-button")
ButtonAdmin.SaveDom("match-cancle-button", match_cancle_button)
ButtonAdmin.RegisterCallback("match-cancle-button", CancleMatchWaiting)





// let notice_accept_button = document.getElementById("notice-button-accept")
// ButtonAdmin.SaveDom("notice-button-accept", notice_accept_button)
// ButtonAdmin.RegisterCallback("notice-button-accept", AcceptMatch)

// let notice_decline_button = document.getElementById("notice-button-decline")
// ButtonAdmin.SaveDom("notice-button-decline", notice_decline_button)
// ButtonAdmin.RegisterCallback("notice-button-decline", DeclineMatch)



function CancleMatchWaiting() {
    // Sockets.CancleToMatchWaiting()
    DomAdmin.HideMatchAlert()

    if (SocketDisconnect_OnWaiting != null)
        SocketDisconnect_OnWaiting()

}


function Attempt_CancleMatchWaiting() {

}


let SocketDisconnect_OnWaiting = null


// function AcceptMatch() {
//     // obsolete
//     notice_description.innerText = "Entering The Game"
//     Sockets.AcceptMatch()
// }



// function DeclineMatch() {
//     // obsolete
//     Sockets.DeclineMatch()
// }


function GameStart_Signon(){
    
    DomAdmin.ShowMatchAlert()
}




axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/home.html`)
    .then((page) => {
        let dom = CreateElement(page.data, "view-home")
        view_container.appendChild(dom)

        PageAdmin.SavePage("home", dom)
        ButtonAdmin.RegisterCallback("home", (pageName) => { PageAdmin.ConvertView(pageName) })
    })



// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/pages/home.html`)
// axios.get(`http://localhost:3000/html/home.html`)
// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/home.html`)
axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/play.html`)
    .then((page) => {
        let dom = CreateElement(page.data, "view-play")
        // view_container.appendChild(dom)

        PageAdmin.SavePage("play", dom)
        ButtonAdmin.RegisterCallback("play", (pageName) => { PageAdmin.ConvertView(pageName) })

        // 모듈화 필요
        let tmps = dom.getElementsByClassName("content-block-button-rankgame")

        let keys_ = [0, 1, 2]

        let rankgame_buttons = [
            tmps[0], tmps[1], tmps[2]
        ]

        let modes_ = ["constant", "liberty", "draft"]
        keys_.forEach((key_, index)=>{
            let tmp = tmps[`${key_}`]
            let mode_ = modes_[index]
            tmp.addEventListener("click", () => { window.Play_Buttons_Inactive(); GameStart("gamestart", mode_, true).then((res) => { GameStart_Signon() }) })
                
        })



        function Play_Buttons_Active(){
            rankgame_buttons.forEach((btn_) => {
                btn_.style.backgroundImage = ""
                btn_.style.pointerEvents = ""
                btn_.style.userSelect = ""
            })
        }


        function Play_Buttons_Inactive(){
            rankgame_buttons.forEach((btn_) => {
                btn_.style.backgroundImage = "none"
                btn_.style.backgroundColor = "#888888"
                btn_.style.pointerEvents = "none"
                btn_.style.userSelect = "none"
            })
        }


        window.Play_Buttons_Active = Play_Buttons_Active
        window.Play_Buttons_Inactive = Play_Buttons_Inactive

        window.Play_Buttons_Inactive()

        // window.addEventListener("keydown", event=>{
        //     if(event.key == "q"){
        //         window.Play_Buttons_Inactive()
        //     }

        //     if(event.key == "w"){
        //         window.Play_Buttons_Active()
        //     }
        // })

        // console.log("event registered")


        // tmps[0].addEventListener("click", () => { GameStart("gamestart", "constant") })
        // tmps[1].addEventListener("click", () => { GameStart("gamestart", "liberty") })
        // tmps[2].addEventListener("click", () => { GameStart("gamestart", "draft") })

    })



// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/pages/play.html`)


// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/pages/about.html`)
axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/about.html`)
    .then((page) => {
        let dom = CreateElement(page.data, "view-about")
        PageAdmin.SavePage("about", dom)
        ButtonAdmin.RegisterCallback("about", (pageName) => { PageAdmin.ConvertView(pageName) })
    })

// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/pages/news.html`)
// axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/news.html`)
//     .then((page) => {
//         let dom = CreateElement(page.data, "view-news")
//         PageAdmin.SavePage("news", dom)
//         ButtonAdmin.RegisterCallback("news", (pageName) => { PageAdmin.ConvertView(pageName) })
//     })


// axios.get(`${window.config["HTTP"]}://${window.config["static-storage"]}/html/pages/guide.html`)
axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/guide.html`)
    .then((page) => {
        let dom = CreateElement(page.data, "view-guide")
        // console.log(dom)
        PageAdmin.SavePage("guide", dom)
        ButtonAdmin.RegisterCallback("guide", (pageName) => { PageAdmin.ConvertView(pageName) })

        window.guide_page_dom = dom
    })


    
axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/lobby.html`)
.then((page) => {
    let dom = CreateElement(page.data, "view-lobby")
    PageAdmin.SavePage("lobby", dom)
    ButtonAdmin.RegisterCallback("lobby", (pageName) => { PageAdmin.ConvertView(pageName) })

    window.LobbySelect = dom.children[0]
    window.LobbyWaiting = dom.children[1]


    let master_viewer = dom.querySelector("#lobby-master-name")
    let guest_viewer = dom.querySelector("#lobby-guest-name")

    let input_join_lobby_token = dom.querySelector("#input-join-lobby-token")

    let start_buttons = dom.querySelectorAll("#lobby-waiting .content-block-button")
    // console.log(start_buttons)

    start_buttons.forEach(btn => {
        btn.style.background = "#888888"
        btn.style.pointerEvents = "none"
        btn.style.userSelect = "none"
    })

    let room_number_display = window.LobbyWaiting.children[2]
    let room_number_copy_button = dom.querySelector("#lobby-number-copy-icon")
    let room_exit_button = dom.querySelector("#lobby-exit-button")


    room_number_copy_button.addEventListener("click",(event)=>{
        navigator.clipboard.writeText(room_number_display.value);
    })

    dom.querySelector("#lobby-button-create").addEventListener("click", () => {
        let ret = GameStart("createlobby", "constant", false)
        // ret.then(res => { console.log(res) })
    })

    window.LobbyWaiting.style.display = "none"

    let socket_exit_callback = null

    window.CreateLobby_On = (lobby_token, exit_callback) => {
        ToggleLobby()
        window.Play_Buttons_Inactive()

        room_number_display.value = lobby_token
        master_viewer.innerText = window.user_name
        socket_exit_callback =  exit_callback

        room_exit_button.exit_callback = exit_callback
        room_exit_button.addEventListener("click", RoomExit)
    }

    window.JoinLobby_On = (master_id, exit_callback) => {
        ToggleLobby()
        window.Play_Buttons_Inactive()

        master_viewer.innerText = master_id
        guest_viewer.innerText = window.user_name
        socket_exit_callback =  exit_callback

        room_exit_button.exit_callback = exit_callback
        room_exit_button.addEventListener("click", RoomExit)
    }


    function RoomExit(){
        // console.log(this.exit_callback)
        if(this.exit_callback != null){
            this.exit_callback()
            this.exit_callback = null
        }

        window.Play_Buttons_Inactive();
        ToggleLobby();
    }


    window.JoinGuest = (guest_id, Start_FriendlyGame) => {
        guest_viewer.innerText = guest_id

        let game_modes = ["constant", "liberty", "draft"]
        start_buttons.forEach((btn, index)=>{
            btn.style.background = "#3FC0AC"
            btn.style.pointerEvents = ""
            btn.style.userSelect = ""


            let game_mode_ = game_modes[index]

            btn.addEventListener("click", ()=>{
                Start_FriendlyGame(game_mode_)
            })
        })
    }


    dom.querySelector("#lobby-button-join").addEventListener("click", () => {
        let ret = GameStart("joinlobby", input_join_lobby_token.value, false)
        // ret.then(res => { console.log(res) })
    })


    function ToggleLobby(){
        // console.log("[[ Toggle Lobby ]]")

        room_number_display.value = ""
        master_viewer.innerText = ""
        guest_viewer.innerText = ""

        // window.Play_Buttons_Inactive()

        room_exit_button.removeEventListener("click", RoomExit)

        
        start_buttons.forEach((btn, index)=>{
            btn.style.background = "#888888"
            btn.style.pointerEvents = "none"
            btn.style.userSelect = "none"
        })


        window.LobbySelect.style.display = window.LobbySelect.style.display == "none" ? "" : "none"
        window.LobbyWaiting.style.display = window.LobbyWaiting.style.display == "none" ? "flex" : "none"

    }


    function ShowLobby(){
        // console.log("Show Lobby")

        window.LobbySelect.style.display = "none"
        window.LobbyWaiting.style.display = "flex"
    }


    function HideLobby(){
        // console.log("Hide Lobby")
        window.LobbySelect.style.display = ""
        window.LobbyWaiting.style.display = "none"
    }


    window.ShowLobby = ShowLobby
    window.HideLobby = HideLobby


})




    
axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/contact.html`)
.then((page) => {
    
    let dom = CreateElement(page.data, "view-contact")
    PageAdmin.SavePage("contact", dom)
    ButtonAdmin.RegisterCallback("contact", (pageName) => { PageAdmin.ConvertView(pageName) })


})

    
// axios.get(`${window.config["HTTP"]}://${window.config["game-client"]}/html/profile.html`)
// .then((page) => {
//     let dom = CreateElement(page.data, "view-profile")
//     PageAdmin.SavePage("profile", dom)
//     ButtonAdmin.RegisterCallback("profile", (pageName) => { PageAdmin.ConvertView(pageName) })
// })



// setTimeout(() => {
//     // ButtonAdmin 에게 htmlDOM을 전송한다
// }, 3000)



function CreateElement(html, className) {
    var nElement = document.createElement('div');
    nElement.classList.add(className)
    nElement.innerHTML = html.trim()
    // let dom = nElement.firstChild;
    // tmpElement.remove()

    return nElement;
}


function GameStart(req, game_mode, isRank) {
    window.rankgame = isRank
    // console.log(Auth)

    let res_ = undefined
    let promise_ = new Promise((res) => { res_ = res })

    Auth.GameStart(req, game_mode)
        .then((resolve) => {
            // resolve.token
            let matchmaking_token = resolve.data


            // console.log(matchmaking_token)
            if (matchmaking_token != null) {
                Auth.SetMatchAuthToken(matchmaking_token)
                Connect_SocketServer(matchmaking_token, req)
            }
            else {

            }
            res_(matchmaking_token)
        })

    return promise_
}




function Connect_SocketServer(matchmaking_token, req) {
    let socket_ = new Socket(matchmaking_token, (event) => { 
        if(window.HideLobby){
            window.HideLobby()
        }
        SocketDisconnect_OnWaiting = null
    }, req)
    SocketDisconnect_OnWaiting = () => { socket_.Disconnect_OnWaiting() }


}







let match_alert = document.getElementById("match-alert")
document.addEventListener("keydown", (e) => {
    if (e.key == 'c') {
        match_alert.classList.add("visible")
    }

    if (e.key == 'v') {
        match_alert.classList.remove("visible")
    }

})






let loading_mark = document.getElementsByClassName("lds-dual-ring")[0]
let currentTime = Date.now()
let deg = 0

tick()
function tick() {
    let delta = Date.now() - currentTime
    currentTime = Date.now()

    deg += delta * 0.3;
    if (deg > 360)
        deg -= 360
    loading_mark.style.transform = `rotate(${deg}deg)`;

    window.requestAnimationFrame(() => {
        tick()
    })
}


// axios.get("https://storage.orlog.io/helloworld.txt").then(res=>console.log(res))
// axios.delete("https://storage.orlog.io/helloworld.txt", {
//     headers: {"Access-Control-Allow-Origin": "*"}
// })


// const bodyParameters = {}

// axios.post(
//     "https://storage.orlog.io",
//     bodyParameters,
//     // config_
// )


// axios({
//     method: 'delete',
//     url: 'https://storage.orlog.io/helloworld.txt',
//     headers: {"Access-Control-Allow-Origin": "*"}
//   });


  //C:\Users\gogow\Downloads