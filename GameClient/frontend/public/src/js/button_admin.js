let buttonDoms = {}








export default {
    SaveDom: (key, dom) => {
        // console.log(buttonDoms);
        buttonDoms[`${key}`] = dom },
    LoadDom: (key) => { return buttonDoms[`${key}`] },
    RegisterCallback: (key, callback)=>{
        buttonDoms[`${key}`].addEventListener("click", (event)=>{
            callback(key)})
    }
}