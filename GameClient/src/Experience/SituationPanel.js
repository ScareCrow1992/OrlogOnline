
const TOP = 0, BOTTOM = 1


const rolldice_html = 
`<div class="items-set">
    <div class="dice-opportunity-frame"></div>
    <div class="dice-opportunity-inner"></div>
</div>`


export default class SituationPanel{
    constructor(){
        this.panels = [
            document.getElementById("top-panel"),
            document.getElementById("bottom-panel"),
        ]

        this.timer_panel = document.getElementById("situation-panel-timer")
        // console.log(this.timer_panel.offsetTop)

        this.rolldice_panels = [[], []]

        
        this.cPanel = this.rolldice_panels

        // let nElements = []
        let nElement
        for(let i=0; i<6; i++){
            nElement = document.createElement('div')
            nElement.innerHTML = rolldice_html

            if(i<3){
                nElement.firstChild.getElementsByClassName("dice-opportunity-inner")[0].classList.add("inner-sky")
                this.rolldice_panels[TOP].push(nElement.firstChild)
            }
            else{
                nElement.firstChild.getElementsByClassName("dice-opportunity-inner")[0].classList.add("inner-green")
                this.rolldice_panels[BOTTOM].push(nElement.firstChild)

            }



        }
        // rollphase panel
        this.panels[TOP].appendChild(this.rolldice_panels[TOP][0])
        this.panels[TOP].appendChild(this.rolldice_panels[TOP][1])
        this.panels[TOP].appendChild(this.rolldice_panels[TOP][2])
    
        this.panels[BOTTOM].appendChild(this.rolldice_panels[BOTTOM][2])
        this.panels[BOTTOM].appendChild(this.rolldice_panels[BOTTOM][1])
        this.panels[BOTTOM].appendChild(this.rolldice_panels[BOTTOM][0])

        setTimeout(()=>{this.Fold()}, 1500)
        // this.Fold()

        // setTimeout(() => { this.Fold() }, 1500)
        // setTimeout(() => { this.Unfold() }, 4000)

        // window.addEventListener("keydown",event=>{
            // if(event.key == "d"){
            //     // fold
            //     this.Fold()
            // }
            // else if(event.key == "e"){
            //     this.Unfold()
            // }
            // else if(event.key == " "){
            //     // console.log("SPACE")
            //     this.LightReset()
            // }
            // else{
            //     let index = Number.parseInt(event.key)
            //     if(index >= 0 && index <= 5){
            //         this.LightOff(Math.floor(index / 3), index % 3)
            //     }
            // }
        // })

    }


    AddExtraTime(seconds){
        
    }


    DisplayPanel(nPhase){
        // 1. fold
        // 2. 교체
        // 3. unfold
        this.rolldice_panels
    }


    LightOff(player, index){
        console.log(player, index)
        let element = this.rolldice_panels[player][index].getElementsByClassName("dice-opportunity-inner")[0]
        // this.rolldice_panels[player][index].getElementsByClassName("dice-opportunity-inner")[0].style.

        element.classList.add("inner-empty")

    }


    LightReset(){
        // 
        this.rolldice_panels.forEach(panels => {
            panels.forEach((panel, index) => {
                let element = panel.getElementsByClassName("dice-opportunity-inner")[0]
                element.classList.remove("inner-empty")

            })
            

        })
    }


    OriginDistance(element){
        return (this.timer_panel.offsetTop + this.timer_panel.offsetHeight / 2) - (element.offsetTop + element.offsetHeight / 2)
        // return this.timer_panel.offsetTop - element.offsetTop + element.offsetHeight
    }



    Fold() {
        this.cPanel.forEach(panels => {
            panels.forEach((panel, index) => {
                panel.style["transition-duration"] = `750ms`
                panel.style.transform = `translate(0, ${this.OriginDistance(panel)}px)`
            })
            // panels.forEach((panel, index) => {
            //     setTimeout(() => {
            //         panel.style["transition-duration"] = ` ${(500 * (index + 6)) / panels.length}ms`
            //         panel.style.transform = `translate(0, ${this.TimerDistance(panel)}px)`
            //     }, index * 250)
            // })
        })
    }


    Unfold(){
        this.cPanel.forEach(panels => {
            panels.forEach((panel, index) => {
                panel.style["transition-duration"] = `750ms`
                panel.style.transform = `translate(0, 0)`

            })
        })

    }

}