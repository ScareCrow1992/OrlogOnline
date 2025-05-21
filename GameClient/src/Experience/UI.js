import * as THREE from 'three'
import Experience from './Experience.js'
import Dice from './World/Items/Dice.js'
import GodFavor from './World/GodFavor.js'
import EventEmitter from './Utils/EventEmitter.js'
// import {gsap} from "gsap"

// import SituationPanel from "./SituationPanel.js"

// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';


const r2_url = "https://storage.orlog.io"

let axe_ = `<img class="img-inside-text" src="${r2_url}/textures/dice/Axe.png">`
let arrow_ = `<img class="img-inside-text" src="${r2_url}/textures/dice/Arrow.png">`
let helmet_ = `<img class="img-inside-text" src="${r2_url}/textures/dice/Helmet.png">`
let shield_ = `<img class="img-inside-text" src="${r2_url}/textures/dice/Shield.png">`
let steal_ = `<img class="img-inside-text" src="${r2_url}/textures/dice/Steal.png">`
let token_ = `<span class="token-text">⌘</span>`

axe_ = `<span class = "img-inside-text-wrapper">` + axe_ + `</span>`
arrow_ = `<span class = "img-inside-text-wrapper">` + arrow_ + `</span>`
helmet_ = `<span class = "img-inside-text-wrapper">` + helmet_ + `</span>`
shield_ = `<span class = "img-inside-text-wrapper">` + shield_ + `</span>`
steal_ = `<span class = "img-inside-text-wrapper">` + steal_ + `</span>`





const i18n_ = {
    "axe" : {
        "en" : `Deal 1 ${axe_} damage`,
        "kr" : `${axe_} 피해를 1 입힙니다.`
    },
    "arrow" : {
        "en" : `Deal 1 ${arrow_} damage`,
        "kr" : `${arrow_} 피해를 1 입힙니다.`
    },
    "helmet" : {
        "en" : `Block 1 ${axe_} damage`,
        "kr" : `${axe_} 를 1 차단합니다.`
    },
    "shield" : {
        "en" : `Block 1 ${arrow_} damage`,
        "kr" : `${arrow_} 를 1 차단합니다.`
    },
    "steal" : {
        "en" : `Steal 1 ${token_} from the opponent`,
        "kr" : `${token_} 를 1개 훔칩니다.`
    },
}



export default class UI extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes;
        this.phase = "Roll"
        this.godFavorActivation = null
        this.godFavorActivation_level = null

        this.sound_manager = this.experience.sound

        // console.log(window)


        this.notice_opacity = 1
        this.alert_opacity = 0
        this.description_opacity = 0
        // this.situationPanel = new SituationPanel()

        // this.setInstance()
        this.infoUIdom = document.getElementsByClassName("info-ui")[0];
        this.infoUItextdom = document.getElementsByClassName("info-ui-txt")[0];
        
        this.topGodFavorUIDom = document.getElementById("top-player");
        this.topGodFavorUItextDom = document.getElementById("top-player").children[0];
        // this.topGodFavorUItextDom.classList.add("visible")

        this.bottomGodFavorUIDom = document.getElementById("bottom-player");
        this.bottomGodFavorUItextDom = document.getElementById("bottom-player").children[0];

        this.scoreUIcontainer = document.getElementById("score-ui")
        this.scoreUItxt = document.getElementById("score-ui-txt")
        this.scoreUIchange = document.getElementById("score-ui-change-txt")
        this.scoreUIchange_wrapper = document.getElementById("score-ui-change")
        this.scoreUIchange_sign = document.getElementById("score-ui-change-sign")


        window.addEventListener("keydown", event=>{
            if(event.key == "ArrowDown"){

                this.ScoreChange(-17)

            }
            else if(event.key == "ArrowUp"){
                this.ScoreChange(+8)

            }
        })


        this.topGodFavorUIButton = []
        this.bottomGodFavorUIButton = []

        for(let i=0; i<3; i++){
            let dom_bottom = this.bottomGodFavorUItextDom.children[3].children[i]
            this.bottomGodFavorUIButton.push(dom_bottom)

            
            let dom_top = this.topGodFavorUItextDom.children[3].children[i]
            this.topGodFavorUIButton.push(dom_top)
        }

        this.r2_url = "https://storage.orlog.io"

        var dice_blue_print_cells = this.infoUIdom.children[0].children[2]
        var dice_tokenmark_dom = document.createElement('img')
        dice_tokenmark_dom.classList.add("img-token")
        dice_tokenmark_dom.src = `${this.r2_url}/textures/dice/Token.png`
        dice_tokenmark_dom.setAttribute("crossorigin", "anonymous")

        dice_blue_print_cells.children[1].appendChild(dice_tokenmark_dom.cloneNode())
        dice_blue_print_cells.children[3].appendChild(dice_tokenmark_dom.cloneNode())
        dice_blue_print_cells.children[4].appendChild(dice_tokenmark_dom.cloneNode())
        dice_blue_print_cells.children[5].appendChild(dice_tokenmark_dom.cloneNode())
        dice_blue_print_cells.children[7].appendChild(dice_tokenmark_dom.cloneNode())
        dice_blue_print_cells.children[10].appendChild(dice_tokenmark_dom.cloneNode())

        // console.log(dice_blue_print_cells)
        // 1,3,4,5,7,10,

        // console.log(this.bottomGodFavorUItextDom)

        this.noticeUIDom = document.getElementById("notice-ui-txt")
        this.noticeUIShowKeyframe = [
            {opacity : 0},
            {opacity : 1, offset : 0.15},
            {opacity : 1, offset : 0.85},
            {opacity : 0}]

        this.descriptionUIDom = document.getElementById("description-ui-txt")
        this.descriptionText = {
            "godfavor" : "Select a God Favor, or Skip"
        }
        
        this.alertUIDom = document.getElementById("alert-ui-txt")

        this.selectedGodFavor = null;
        this.godFavorInfo = null
        this.activated_godFavor_level = null

        

        // this.infoGodFavorUITextdom = document.getElementById


        this.infoUIanchor = new THREE.Vector3(5, 0, 0);


        this.experience.resources.on('ready', () => {
            // console.log(this.infoUIdom)
            // console.log(this.infoUItextdom)
            // console.log(this.infoUItextdom.children[2].children);

            // console.log(this.infoUItextdom.children)

            let top_tag = document.getElementById("top-tag")
            let bottom_tag = document.getElementById("bottom-tag")

            this.tags = {
                top : {
                    name : top_tag.children[0].children[1],
                    score : top_tag.children[1]
                },
                bottom : {
                    name : bottom_tag.children[0].children[1],
                    score : bottom_tag.children[1]
                }
            }

            // console.log(this.tags)

            
            this.clock = this.experience.world.clock

            this.diceDescriptionCellDom = this.infoUItextdom.children[0].children[0]
            this.diceTokenDescriptioncellDom = this.infoUItextdom.children[0].children[1]
            

            // console.log(diceDescriptionCell)
            let diceBluePrintCells = this.infoUItextdom.children[2].children
            let indexes = [1,3,4,5,7,10];
            let faces = ["top", "left", "front", "right", "bottom", "back"]
            this.diceBlueprintCellDoms = {};

            for (let i = 0; i < 6; i++) {
                let index = indexes[i]
                let face = faces[i]
                this.diceBlueprintCellDoms[`${face}`] = {}
                let cellDom = this.diceBlueprintCellDoms[`${face}`]

                cellDom.weapon = diceBluePrintCells[index]
                cellDom.token = diceBluePrintCells[index].children[0]
            }


            for(let level=0; level<3; level++){
                let godFavorButton = this.bottomGodFavorUItextDom.children[3].children[level]

                godFavorButton.addEventListener("click", ()=>{
                    // console.log("[[ selectedGodFavor ]]")
                    // console.log(this.selectedGodFavor)

                    // console.log("[[ godFavorInfo ]]")
                    // console.log(this.godFavorInfo)

                    // console.log(this.godFavorInfo)
                    // console.log(level)

                    let objInfo = this.experience.controller.ObjectSelected(this.selectedGodFavor)

                    // let godFavorIndex = this.godFavorInfo.index
                    // let avatarIndex = this.godFavorInfo.avatar
                    // let info = this.godFavorInfo.info

                    
                    let godFavorIndex = objInfo.index
                    let avatarIndex = objInfo.avatar
                    let info = objInfo.info

                    this.activated_godFavor_level = level

                    // if (avatarIndex == 1)
                    this.trigger("god_favor_action", [godFavorIndex, level, avatarIndex, info])
                })
            }


            this.Setup_Guide()

        })

        this.surrender_box = document.getElementById("notice-block")

        this.ui_button_surrender = document.getElementById("surrender-button")
        this.ui_button_bgm = document.getElementById("bgm-button")
        this.ui_button_sfx = document.getElementById("sfx-button")


        let surrender_buttons = document.getElementById("notice-buttons")
        this.surrender_yes = surrender_buttons.children[0]
        this.surrender_no = surrender_buttons.children[1]

        
        this.ui_button_surrender.children[0].addEventListener("click", ()=>{
            this.Surrender_On()
        })

        
        this.surrender_yes.addEventListener("click", ()=>{
            this.experience.controller.Surrender()
            this.Surrender_Off()
        })
        
        this.surrender_no.addEventListener("click", ()=>{
            this.Surrender_Off()
        })



        this.ui_button_bgm.children[0].addEventListener("click", ()=>{
            
            let ret = this.sound_manager.BGM_Toggle()

            if(ret == true){
                this.ui_button_bgm.classList.remove("on")
                this.ui_button_bgm.classList.add("off")
            }
            else{
                this.ui_button_bgm.classList.remove("off")
                this.ui_button_bgm.classList.add("on")
            }

        })

        this.ui_button_bgm.children[1].addEventListener("input", (event)=>{
            this.sound_manager.BGM_Set(event.target.value)
        })


        this.ui_button_sfx.children[0].addEventListener("click", ()=>{
            let ret = this.sound_manager.SFX_Toggle()
            
            if(ret == true){
                this.ui_button_sfx.classList.remove("on")
                this.ui_button_sfx.classList.add("off")
            }
            else{
                this.ui_button_sfx.classList.remove("off")
                this.ui_button_sfx.classList.add("on")
            }
        })

        this.ui_button_sfx.children[1].addEventListener("input", (event)=>{
            this.sound_manager.SFX_Set(event.target.value)
        })

    }

    get ui_scale_weight(){
        return 0.85 * this.camera.ui_scale_weight
    }



    update(){

        // ui가 object3d를 따라가게 만들기

        // var screenPosition = this.infoUIanchor.clone();
        // screenPosition.project(this.camera.instance);
        // // // console.log(screenPosition);
        
        // const translateX = screenPosition.x * this.sizes.width * 0.5
        // const translateY = - screenPosition.y * this.sizes.height * 0.5
        // this.infoUIdom.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`


    }



    resize(){
        // let standard_ratio = this.camera.standard_ratio
        // let window_ratio = this.sizes.window_ratio
        // let standard_scale = 0.85

        // if(standard_ratio > window_ratio){

        //     let ratio = this.sizes.window_ratio / this.camera.standard_ratio
        //     let new_scale = standard_scale * ratio
    
        //     this.godfavorui_visible[0].style.transform = `scale(${new_scale}, ${new_scale})`
        //     this.godfavorui_visible[1].style.transform = `scale(${new_scale}, ${new_scale})`
        // }
        // else{
        //     this.godfavorui_visible[0].style.transform = `scale(0.85, 0.85)`
        //     this.godfavorui_visible[1].style.transform = `scale(0.85, 0.85)`
        // }
        
    }



    Score_Show(){
        this.scoreUIcontainer.style.display = "flex"

        let keyframe = [
            {opacity : 0},
            {opacity : 1}
        ]

        this.scoreUIcontainer.animate(keyframe, { duration: 800 })
    }



    Score_Hide(){
        let keyframe = [
            {opacity : 1},
            {opacity : 0}
        ]

        this.scoreUIcontainer.animate(keyframe, { duration: 800 }).finished.then(() => { this.scoreUIcontainer.style.display = "none" })
    }


    ScoreViewSet(score, gap_value){

        let abs_gap_value = Math.abs(gap_value)

        this.scoreUItxt.innerText = score
        this.scoreUIchange.innerText = abs_gap_value
        
        let sign_ = Math.sign(gap_value)
        if(sign_ > 0){
            this.scoreUIchange_wrapper.style.color = "#00ff00"
            this.scoreUIchange_sign.innerText = "+"
        }
        else if(sign_ < 0){
            this.scoreUIchange_wrapper.style.color = "#ff0000"
            this.scoreUIchange_sign.innerText = "-"
        }

    }


    ScoreChange(gap_value){        
        // this.noticeUIShowKeyframe = [
        //     {opacity : 0},
        //     {opacity : 1, offset : 0.15},
        //     {opacity : 1, offset : 0.85},
        //     {opacity : 0}]

        // this.noticeUIDom.animate(this.noticeUIShowKeyframe, {delay : 200, duration : 2200})



        let score_ = this.scoreUItxt.innerText
        score_ = parseInt(score_)


        let changed_ = this.scoreUIchange.innerText
        changed_ = parseInt(changed_)


        let keyframe = [,
            // { transform : "translateY(0px)"},
            { transform : "translateY(-3px)" },
            { transform : "translateY(0px)"}
        ]

        let animation_cnt = Math.abs(gap_value)

        this.scoreUIchange.innerText = animation_cnt

        let sign_ = Math.sign(gap_value)
        if(sign_ > 0){
            this.scoreUIchange_wrapper.style.color = "#00ff00"
            this.scoreUIchange_sign.innerText = "+"
        }
        else if(sign_ < 0){
            this.scoreUIchange_wrapper.style.color = "#ff0000"
            this.scoreUIchange_sign.innerText = "-"
        }

        let interval_time = 1500 / animation_cnt

        // console.log(interval_time, animation_cnt)

        for(let i = 1; i < animation_cnt + 1; i++){
            
            if((score_ + i * sign_ < 100) && (sign_ < 0))
                break;

            setTimeout(()=>{
                this.scoreUItxt.innerText = score_ + i * sign_
                this.scoreUIchange.innerText = animation_cnt - i
                this.scoreUItxt.animate(keyframe, { duration: 80, iterations: 1 })
            }, interval_time * i)


        }


    }


    Surrender_On() {
        if (this.experience.controller.surrender == false)
            this.surrender_box.classList.add("visible")

    }


    Surrender_Off(){

        this.surrender_box.classList.remove("visible")
    }



    RollDice(player, index){
        if(this.phase !== "roll")
            return;

        // this.situationPanel.LightOff(player, index)
        this.clock.Light(player, index, false)
    }



    GodFavorPowerUI_Deactivate() {
        if (this.godFavorActivation != null) {
            // this.topGodFavorUItextDom.classList.remove("visible")
            this.topGodFavorUItextDom.style.transform = "scale(0.0)"
            if (this.godFavorActivation_level >= 0)
                this.topGodFavorUIButton[this.godFavorActivation_level].classList.remove("highlight")
        }

        this.godFavorActivation = null
        this.godFavorActivation_level = null
    }

    GodFavorPowerUI_Activate(godFavor, level) {
        if (this.godFavorActivation != null) {
            // 기존에 활성화된 ui 정보 삭제
            this.GodFavorPowerUI_Deactivate()
        }

        this.godFavorActivation = godFavor
        this.godFavorActivation_level = level

        this.godFavorHovered(godFavor, this.topGodFavorUItextDom, false)
        // this.topGodFavorUItextDom.classList.add("visible")
        this.topGodFavorUItextDom.style.transform = `scale(${this.ui_scale_weight})`
        if (this.godFavorActivation_level >= 0)
            this.topGodFavorUIButton[this.godFavorActivation_level].classList.add("highlight")
    }


    click(obj, objInfo){
        // let obj = this.experience.world.gameObjects[`${objID}`]
            
        
        // if(obj instanceof Dice){
        //     this.hover_off()
        // }
        
        if(obj instanceof GodFavor && this.phase == "godfavor"){
            // console.log(obj)

            this.selectedGodFavor = obj;
            this.godFavorInfo = objInfo
            // console.log(objInfo)
    
            // if(obj.avatar == 0)
            //     this.topGodFavorUItextDom.classList.add("unfold")
            // if(objInfo.isBottom)
            this.bottomGodFavorUItextDom.classList.add("unfold")
            this.bottomGodFavorUItextDom.style.transform = `scale(${this.ui_scale_weight})`


        }
    }

    emptyclick(){
        this.bottomGodFavorUItextDom.classList.remove("unfold")
        this.bottomGodFavorUItextDom.style.transform = "scale(0.0)"
        // this.topGodFavorUItextDom.classList.remove("unfold")
        this.selectedGodFavor = null;

    }


    GameOver(txt, current_score, gap_value){
        this.noticeUIDom.innerHTML = txt
        this.noticeUIDom.animate(this.noticeUIShowKeyframe, {delay : 200, duration : 7447})
        this.hideDescription()

        this.ScoreViewSet(current_score, gap_value)
        setTimeout(()=>{this.Score_Show()}, 1500)
        setTimeout(()=>{this.ScoreChange(gap_value)}, 3000)
        setTimeout(()=>{this.Score_Hide()}, 6500)
        
        // setTimeout(()=>{this.GameOver_Post()}, 3000)
    }


    // GameOver_Post(){
    //     this.hideDescription()
    // }


    viewDescriptionDuration(text, duration){
        this.showDescription(text)
        setTimeout(()=>{this.hideDescription()}, duration * 1000 + 500)
    }


    phaseEnd(phase){
        switch(phase){
        case "godfavor":
            this.hideDescription()
            break;

            
        case "resolution":
            this.activated_godFavor_level = null
            this.godFavorInfo = null
            break;

        }

    }


    phaseStart(phase){                
        this.showNotice(phase)
        this.phase = phase
        // console.log(phase)
        switch(phase){
            case "godfavor":
                // this.situationPanel.Fold()
                this.showPhaseChangeDescription(phase)

            break;

            case "roll":
                this.clock.RoundEnd()
                this.selectedGodFavor = null
                // this.situationPanel.LightReset()
                // this.situationPanel.Unfold()

                break;
        }

    }


    WriteOnNotice(text){
        this.noticeUIDom.innerHTML = text
        this.noticeUIDom.animate(this.noticeUIShowKeyframe, {delay : 200, duration : 2200})

        return setTimeout(()=>{}, 2200)
    }

    showNotice(phase){
        let firstChar = phase.charAt(0);
        let others = phase.slice(1);

        let description = firstChar.toUpperCase() + others + " phase";

        this.noticeUIDom.innerHTML = description
        this.noticeUIDom.animate(this.noticeUIShowKeyframe, {delay : 200, duration : 2200})
    }

    showDescription(text){
        this.descriptionUIDom.innerText = text
        this.descriptionUIDom.animate([{opacity : this.description_opacity},{opacity : 1}], {fill: "forwards", duration : 500})
        this.description_opacity = 1
    }

    showPhaseChangeDescription(phase){
        this.descriptionUIDom.innerText = this.descriptionText[`${phase}`]
        this.descriptionUIDom.animate([{opacity : 0},{opacity : 1}], {fill: "forwards", delay : 2200, duration : 500})
        this.description_opacity = 1
    }

    showAlert(text){
        this.alertUIDom.innerText = text
        this.alertUIDom.animate([{opacity : this.alert_opacity},{opacity : 1}], {fill: "forwards", duration : 500})
        this.alert_opacity = 1
    }

    hideAlert(){
        this.alertUIDom.animate([{opacity : this.alert_opacity},{opacity : 0}], {fill: "forwards", duration : 500})
        this.alert_opacity = 0
    }

    showAlertDuration(text, duration){
        this.showAlert(text)
        setTimeout(()=>{this.hideAlert()}, duration * 1000 + 500)

    }

    hideDescription(){

        this.descriptionUIDom.animate([{opacity : this.description_opacity},{opacity : 0}], {fill: "forwards", duration : 500})    
        this.description_opacity = 0
    }

    hover_on(objID){
        // console.log(this.infoUItextdom);
        // this.infoUItextdom.innerHTML = `hovered intem : ID (${objID})`;
        // ${this.experience.world.gameObjects[`${objID}`]}
    
        let obj = this.experience.world.gameObjects[`${objID}`]
        if(obj == null || obj == undefined)
            return;

        if(obj instanceof Dice){
            if(obj.diceType === "weapon"){
                this.diceHovered(obj)
                this.infoUItextdom.classList.add("visible");

            }
        }
        else if (obj instanceof GodFavor) {
            if (this.godFavorActivation_level != null && this.godFavorActivation_level >= 0)
                this.bottomGodFavorUIButton[this.godFavorActivation_level].classList.remove("highlight")

            if(this.selectedGodFavor != null)
                this.selectedGodFavor = obj

            this.godFavorHovered(obj, this.bottomGodFavorUItextDom, true)
            // this.bottomGodFavorUItextDom.classList.add("visible")
            this.bottomGodFavorUItextDom.style.transform = `scale(${this.ui_scale_weight})`
        }
    }

    hover_off(){
        this.infoUItextdom.classList.remove("visible");
        // this.bottomGodFavorUItextDom.classList.remove("visible")
        if(this.bottomGodFavorUItextDom.classList.contains("unfold") == false)
            this.bottomGodFavorUItextDom.style.transform = "scale(0.0)"

    }


    godFavorPhaseOn(){
        // console.log("God Favor Phase is Start")
        this.phase = "GodFavor"
    }


    godFavorPhaseOff(){
        // bottom 플레이어가 스킬을 안쓰는 경우
        // this.bottomGodFavorUItextDom.classList.remove("unfold")
     
    
        this.hover_off()
    }


    diceHovered(dice){

        // console.log(dice)
        
        // let weapons = ["Axe", "Shield", "Arrow", "Axe", "Helmet", "StealFavor"]
        // let token = [false, false, true, false, false, true]
        

        // this.diceDescriptionCellDom.innerHTML = `Block 1<img class="img-inside-text" src="/textures/dice/Axe.png">damage`

        // console.log(this.diceDescriptionCellDom)
        // console.log(upFace)


        // description
        // this.diceDescriptionCellDom

        this.diceDescriptionCellDom.innerHTML = i18n_[`${dice.getWeapon()}`][`${window.lang_}`]

        // switch(dice.getWeapon()){
        //     case "arrow" :
        //         this.diceDescriptionCellDom.innerHTML = `Deal 1 ${arrow_} damage`
        //     break;

        //     case "axe" :
        //         this.diceDescriptionCellDom.innerHTML = `Deal 1 ${axe_} damage`
        //         break;
                
        //     case "shield" :
        //         this.diceDescriptionCellDom.innerHTML = `Block 1 ${arrow_} damage`
        //         break;
                
        //     case "helmet" :
        //         this.diceDescriptionCellDom.innerHTML = `Block 1 ${axe_} damage`
        //         break;
                
        //     case "steal" :
        //         this.diceDescriptionCellDom.innerHTML = `Steal 1 ${token_} from the opponent.`
        //         break;       
        // }

        if(dice.isToken())
            this.diceTokenDescriptioncellDom.style.display = "block"
        else
            this.diceTokenDescriptioncellDom.style.display = "none"



        // console.log(this.diceDescriptionCellDom)




        // blueprint

        let weaponFiles = { axe : "Axe", shield : "Shield", arrow: "Arrow", helmet : "Helmet", steal : "StealFavor"}

        // console.log(this.diceBlueprintCellDoms)

        let faces = dice.getFaces()

        Object.keys(faces).forEach(dir =>{
            let face = faces[`${dir}`]
            
            let weaponFile = face.weaponType
            // console.log(weaponFile)
            let weaponFilesName = weaponFiles[`${weaponFile}`]


            let cellDom = this.diceBlueprintCellDoms[`${dir}`]
            // console.log(`url("/textures/dice/ACV-"${weaponFilesName}"Orlog.webp")`)
            cellDom.weapon.style.backgroundImage = `url("${this.r2_url}/textures/dice/ACV-${weaponFilesName}Orlog.webp")`
            // "url(\"/textures/dice/ACV-" + `${weaponFilesName}` + "Orlog.webp\")"

            cellDom.weapon.style.overflow = "hidden"

            // 상단면만 밝은색으로
            
            if(dice.getUpDir() == dir)
                cellDom.weapon.style.filter = "brightness(100%)"
            else
                cellDom.weapon.style.filter = "brightness(30%)"
            



            if(face.isToken)
                cellDom.token.style.visibility = "visible"
            else
                cellDom.token.style.visibility = "hidden"
        })


        // for(let i=0; i<6; i++){
        //     let weapon = dice.diceFaces[i]
        //     let face = faces[i];

        //     let index = indexes[i]
        //     // let face = faces[i]
            
        //     let cellDom = this.diceBlueprintCellDoms[`${face}`]
        //     cellDom.weapon.style.backgroundImage = `url("/textures/dice/ACV-${weapons[i]}Orlog.webp")`

        //     cellDom.weapon.style.overflow = "hidden"
        //     cellDom.weapon.style.filter = "brightness(100%)"

        //     if(token[i])
        //         cellDom.token.style.visibility = "visible"
        //     else
        //         cellDom.token.style.visibility = "hidden"

        // }


    }


    godFavorHovered(godFavor, dom, isBottom){
        // console.log(godFavor)
        // console.log(this.bottomGodFavorUItextDom)

        // console.log(godFavor.info.spec(1));

        let title = dom.children[0]
        
        let description = dom.children[1].children[0]
        let invoke = dom.children[1].children[1].children[0]
        let priority = dom.children[1].children[1].children[1]

        let additional_input = dom.children[1].children[2]
        // console.log(additional_input)

        //let cost = dom.children[3][0~2][0]
        //let effect = dom.children[3][0~2][1]

        let power = []

        for(let index=0; index<3; index++){
            var obj = {};
            obj.cost = dom.children[3].children[index].children[0].children[0]
            obj.effect = dom.children[3].children[index].children[0].children[1]

            if (isBottom === true)
                dom.children[3].children[index].classList.remove("highlight")
            power.push(obj)
        }

        title.innerText = godFavor.info.title[`${window.lang_}`];
        // description.innerHTML = godFavor.info.description;
        let str = godFavor.info.description[`${window.lang_}`]
        // str = str.replace("{ARROW}", `<span class = "img-inside-text-wrapper"><img class="img-inside-text" src="/textures/dice/Arrow.png"></span>`)
        str = this.TextConvertToIcon(str, false)
        description.innerHTML = str

        if(window.lang_ == "en"){
            invoke.innerText = "Invoke : " + `${godFavor.info.afterDecision ? "After ⚠️" : "Before"}`
            priority.innerText = "Priority : " + godFavor.info.priority

        }
        else{
            invoke.innerText = "발동 : " + `${godFavor.info.afterDecision ? "After ⚠️" : "Before"}`
            priority.innerText = "우선순위 : " + godFavor.info.priority

        }


        if(godFavor.info.extraInput != undefined)
            additional_input.style.display = "block"
        else
            additional_input.style.display = "none"



        
        for (let index = 0; index < 3; index++) {
            power[index].cost.innerHTML = godFavor.info.cost[index] + ` <span class="token-text-small">⌘</span>`
            let str = godFavor.info[`spec_${window.lang_}`](index)
            str = this.TextConvertToIcon(str, true)
            power[index].effect.innerHTML = str


        }



        // this.activated_godFavor_level = null
        // this.godFavorInfo = null
        // console.log(this.godFavorInfo)
        // console.log(godFavor)

        
        if (isBottom == true
            &&
            this.godFavorInfo != null
            &&
            this.godFavorInfo.avatar === godFavor.avatar
            &&
            this.godFavorInfo.info == godFavor.info) {

            if (Number.isInteger(this.activated_godFavor_level) === true && this.activated_godFavor_level >= 0 && this.activated_godFavor_level <= 2) {
                dom.children[3].children[this.activated_godFavor_level].classList.add("highlight")
            }
        }
    }



    TextConvertToIcon(txt, small = true){
        let formats = ["ARROW", "AXE", "HELMET", "SHIELD", "STEAL"]
        let links = ["Arrow", "Axe", "Helmet", "Shield", "Steal"]
        let size = ""
        if(small)
            size = "-small"
        for(let index= 0; index < 5; index++){
            txt = txt.replaceAll(`{${formats[index]}}`, `<span class = "img-inside-text-wrapper${size}"><img class="img-inside-text${size}" src="${this.r2_url}/textures/dice/${links[index]}.png"></span>`)
        }


        txt = txt.replaceAll("⌘", `<span class="token-text${size}">⌘</span>`)

        return txt
    }


    Setup_Guide(){
        let guide_godfavor_cards_dom = window.guide_page_dom.querySelector(".guide-godfavor-cards")

        let guide_godfavor_info_dom = window.guide_page_dom.querySelector("#guide-godfavor-info")
    
        // console.log(guide_godfavor_info_dom.children[0])
        let godfavors_info = this.experience.godFavorsInfo

        // console.log(window.guide_page_dom)
        // console.log(guide_godfavor_cards_dom)

        const names_ = Object.keys(godfavors_info)

        for(let i=0; i<20; i++){
            let card_icon_element = document.createElement('div')

            let inner_html = guide_cell_template.replace("{NAME}", names_[i])


            // console.log(inner_html)

            card_icon_element.classList.add("guide-godfavor-cards-cell-wrapper")
            card_icon_element.innerHTML = inner_html

            
            const info_ ={ info : godfavors_info[`${names_[i]}`]}

            card_icon_element.childNodes[0].addEventListener("mouseover", (event) => {
                // console.log("mouseover")
                // console.log(names_[i])
                guide_godfavor_info_dom.children[0].style.transform = "scale(1.0) translateX(-100%)"
                this.godFavorHovered(info_, guide_godfavor_info_dom.children[0], false)

            })

            
            card_icon_element.childNodes[0].addEventListener("mouseout", (event) => {
                // console.log("mouseout")
                // console.log(names_[i])
                guide_godfavor_info_dom.children[0].style.transform = "scale(0.0) translateX(-100%)"
                // this.bottomGodFavorUItextDom.style.transform
            })

            card_icon_element.childNodes[0].card_name_ = names_[i]

            // console.log(card_icon_element)
            guide_godfavor_cards_dom.appendChild(card_icon_element)
            
        }   
    }

    Set_Tag(top_user, bottom_user){
        // console.log(this.tags)
        // console.log(arguments)
        this.tags.top.name.innerText = top_user.name
        this.tags.top.score.innerText = top_user.score

        this.tags.bottom.name.innerText = bottom_user.name
        this.tags.bottom.score.innerText = bottom_user.score
    
    }
}


// <span class="token-text">⌘</span>



const guide_cell_template = `<img src="${r2_url}/textures/godfavor/map/ACV_Orlog_{NAME}.webp">`

// const r2_url = "https://storage.orlog.io"