

async function GetOutlineShape(dir){
    const tmpCanvas = document.createElement('canvas');
    const ctx = tmpCanvas.getContext('2d');

    const img = new Image();
    img.src = dir;

    
    img.addEventListener('load',() => {
        // img.width, img.height
        tmpCanvas.width = img.width;
        tmpCanvas.height = img.height;

        ctx.fillStyle = "green";
        ctx.fillRect(0,0,tmpCanvas.width, tmpCanvas.height);

        ctx.drawImage(img, 0, 0);


        document.querySelector("body").appendChild(tmpCanvas);

    })

}


export default GetOutlineShape;

