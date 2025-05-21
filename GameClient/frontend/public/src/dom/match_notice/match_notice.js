// let match_alert = document.getElementById("match-alert")


function SetDomElement(element){
    match_alert = element
}


function InitDomElement(){
    
}


function ShowMatchAlert(){
    match_alert.classList.add("visible")

}


function HideMatchAlert(){
    match_alert.classList.remove("visible")
}




export {ShowMatchAlert, HideMatchAlert}

