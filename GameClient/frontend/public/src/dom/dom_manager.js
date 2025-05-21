


// 전달받은 html로 dom을 만든 후, 반환
function CreateElement(html, className){
    var nElement = document.createElement('div');
    nElement.classList.add(className)
    nElement.innerHTML = html.trim()
    // let dom = nElement.firstChild;
    // tmpElement.remove()

    return nElement;    
}





export {CreateElement}
