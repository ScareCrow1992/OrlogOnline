import * as THREE from 'three'
import Experience from '../Experience.js'


// Time 인스턴스에 의해서만 조작됨
export default class Timer  {
    constructor(emitter) {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.emitter = emitter

        this.time = -1;
        // this.dom = document.getElementById("timer-viewer")
        // this.domTxt = document.getElementsByClassName("timer-inner")[0]
        this.state = false;

        this.last_time = -1

        // window.addEventListener("keydown", (e)=>{
        //     switch (e.key) {
        //         case "u":
        //             this.dom.classList.add("visible")
        //             break;

        //         case "i":
        //             this.dom.classList.remove("visible")
        //             break;


        //     }
        // })

    }


    SetTimer(value, isStart = true) {
        this.time = value

        if (isStart)
            this.StartTimer()

    }


    StartTimer(){
        this.state = true
        // this.domTxt.innerHTML = Math.ceil(this.time / 1000)
        // this.domTxt.classList.add("visible")
        // this.domTxt.style.color = "#ffffff"
    }

    StopTimer(){
        this.state = false;
        // this.domTxt.innerText = ""
        // this.domTxt.classList.remove("visible")
        // this.domTxt.style.color = "#00000000"
        this.experience.world.clock.DisplayNumber(" ")
        this.last_time = -1
    }


    AddExtraTime(seconds){
        this.time += seconds
    }


    update(delta){
        if(this.state){
            // this.domTxt.innerText = Math.ceil(this.time / 1000)
            this.time -= delta
            let time_integer = Math.ceil(this.time / 1000)
            
            if(this.last_time !== time_integer){
                this.last_time = time_integer
                this.experience.world.clock.DisplayNumber(this.last_time)
            }


            if(this.time <= 0){
                this.emitter.trigger("timeover")
                this.StopTimer()
            }
        }
    }
}