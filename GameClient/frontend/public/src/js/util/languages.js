import i18n from "./i18n.json"

export default function (lang_){
    let keys = Object.keys(i18n)
    keys.forEach(key_=>{
        // console.log(document.getElementById(key_))
        let dom_ = document.getElementById(key_)
        if(dom_){
            dom_.innerHTML = i18n[`${key_}`][`${lang_}`]


        }


    })


}