import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.is_resized = true
        this.Check_Resized()

        // Resize event
        window.addEventListener('resize', () =>{
            this.is_resized = true
        })

        // window.dispatchEvent(new Event('resize'));


        setInterval(() => { this.Check_Resized() }, 5000)

    }



    Check_Resized(){
        if(this.is_resized == true){
            this.is_resized = false

            this.width = window.innerWidth
            this.height = window.innerHeight
            this.window_ratio = this.width / this.height

            this.pixelRatio = Math.min(window.devicePixelRatio, 1.5)

            if(window.innerWidth < 1000)
                this.pixelRatio = 0.8

            
            this.trigger('resize')

        }
    }

}