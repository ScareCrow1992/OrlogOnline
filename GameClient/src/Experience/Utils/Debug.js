// import GUI from 'lil-gui'
var GUI = lil.GUI;

export default class Debug
{
    constructor()
    {
        this.active

        window.location.hash.split("&").forEach(hash =>{
            if(hash === "#debug")
                this.active = true
        })



        if(this.active)
        {
            this.ui = new GUI()
        }
    }
}