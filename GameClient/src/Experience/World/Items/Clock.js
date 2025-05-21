import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'

import gsap from 'gsap';

// controller
export default class Clock {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.material_manager = this.experience.material

        this.canvas = document.createElement("canvas")
        this.canvas.width = 480;
        this.canvas.height = 270;

        this.ctx = this.canvas.getContext('2d')

        this.mode_ = null // "toggle" or "button"
        this.view_ = null // "isometric" or "top"

        this.user_ = "bottom"// "top" or "bottom" or null

        this.anchor = new THREE.Vector3(12.5, 0, 0)
        this.anchor_setup = this.anchor.clone()
        this.anchor_setup.x -= 2

        this.dbg_view = true

        // window.addEventListener("keydown", (event) => {
        //     if (event.key == "z") {
        //         this.dbg_view = !this.dbg_view
        //     }
        // })

        this.Initialize(this.canvas)

        this.setDebug()
    }


    Initialize(canvas){
        // this.material = this.materialMa

        this.instance = this.resources.items["ChessClock"].scene

        // console.log(this.instance.children)

        this.body_ = this.instance.children[0]
        this.screen_ = this.instance.children[1]
        this.switch_toggle = this.instance.children[2]
        this.loop_A = this.instance.children[3]
        this.loop_B = this.instance.children[4]
        this.switch_button = this.instance.children[5]
        this.switch_button_red = this.switch_button.children[0]


        let black_material = new THREE.MeshStandardMaterial({
            "color" : "black",
            "metalness" : 0.4,
            "roughness" : 0.6,
            "envMapIntensity" : 2.5
        })

        this.switch_toggle.material.dispose()
        this.switch_toggle.material = black_material

        this.toggle_txt = this.switch_toggle.children[0]
        this.toggle_highlight = {
            "bottom" : this.switch_toggle.children[1],
            "tom" : this.switch_toggle.children[0]
        }
        this.toggle_highlight["bottom"] = this.switch_toggle.children[1]
        this.toggle_highlight["top"] = this.switch_toggle.children[2]

        this.toggle_highlight["top"].material.dispose()
        this.toggle_highlight["bottom"].material.dispose()


        this.toggle_color = {
            "top" : {"active" : new THREE.Color("#1fffff"), "inactive" : new THREE.Color("#003f3f")},
            "bottom" : {"active" : new THREE.Color("#1fff11"), "inactive" : new THREE.Color("#003f04")}
        }

        this.switch_button.material.dispose()
        this.switch_button.material = black_material

        this.switch_button_red.material.dispose()
        this.switch_button_red.material = new THREE.MeshStandardMaterial({
            color : "#ff0707",
            "metalness" : 0.05,
            "roughness" : 0.35,
            "envMapIntensity" : 1.5,
            transparent : true,
            opacity : 0.7,
            flatShading : true
        })


        this.switch_button_red.geometry.computeVertexNormals()

        
        this.toggle_highlight["top"].material = new THREE.MeshStandardMaterial({color : this.toggle_color["top"]["inactive"]})
        this.toggle_highlight["bottom"].material = new THREE.MeshStandardMaterial({color : this.toggle_color["bottom"]["inactive"]})



        // this.switch_button.visible = false


        let map_ = this.resources.items["wood08_map"]
        let normal_ = this.resources.items["wood08_normal"]
        let roughness_ = this.resources.items["wood08_roughness"]

        map_.encoding = THREE.sRGBEncoding
        normal_.encoding = THREE.sRGBEncoding
        roughness_.encoding = THREE.sRGBEncoding

        let wood_mat = new THREE.MeshStandardMaterial({
            map : map_,
            // normalMap : normal_,
            roughnessMap : roughness_,
            // color : "#23435E",
            metalness : 0.1,
            roughness : 0.9,
            envMapIntensity : 2.5
        })

        this.body_.material.dispose()
        this.loop_A.material.dispose()
        this.loop_B.material.dispose()

        this.body_.material = wood_mat
        this.loop_A.material = wood_mat
        this.loop_B.material = wood_mat

        this.loop_A.scale.set(1,1,1)
        this.loop_B.scale.set(1,1,1)


        this.canvas_texture = new THREE.CanvasTexture(canvas);
        this.canvas_texture.encoding = THREE.sRGBEncoding

        let display_material = new THREE.MeshBasicMaterial({map : this.canvas_texture})

        this.screen_.material.dispose()
        this.screen_.material = display_material
        // this.screen_.layers.enable(1)

        this.scene.add(this.instance)

        this.switch_toggle.orgY = this.switch_toggle.position.y
        this.switch_button.orgY = this.switch_button.position.y

        
        this.instance.rotateY(-Math.PI / 2)
        this.instance.position.copy(this.anchor)
        this.instance.children[0].castShadow = true
        // this.instance.scale.set(1.0, 0.75, 0.75)


        this.ButtonMode()

    }


    SetUser(user){
        this.user = user
    }



    Highlight_On() {
        // if(this.mode == "toggle"){
        this.ToggleHighlight_Enable(this.user)
        // }

    }



    Highlight_Off() {
        // if(this.mode == "toggle"){
        this.ToggleHighlight_Disable(this.user)

        // }

    }


    // SetTransform(matrix){
    //     // console.log(matrix)
    //     this.instance.matrix.copy(matrix)
    //     // this.instance.position.copy(pos)
    //     // this.instance.quaternion.copy(quat)
    //     // this.instance.
    // }


    async ModeSet_Toggle(){
        if(this.mode_ == "toggle")
            return

        this.mode_ = "toggle"


        await this.Open_Loop(0.6)
        await this.Hide_Button()
        await this.Close_Loop()
        await this.Sleep(150)
        this.switch_button.visible = false
        this.switch_toggle.visible = true
        await this.Open_Loop(0.0)
        await this.Show_Toggle()
        // await this.Close_Loop()




        // this.switch_button.visible = false
        // this.switch_toggle.visible = true

    }




    async ModeSet_Button(){
        if(this.mode_ == "button")
            return

        this.mode_ = "button"

        
        // await this.Open_Loop()
        await this.Hide_Toggle()
        await this.Close_Loop()
        await this.Sleep(150)
        this.switch_toggle.visible = false
        this.switch_button.visible = true
        await this.Open_Loop(0.6)
        await this.Show_Button()
        await this.Close_Loop()

        // this.switch_button.visible = true
        // this.switch_toggle.visible = false

    }


    Sleep(time_){
        return new Promise((res) => { setTimeout(() => { res(true) }, time_) })
    }

    
    Open_Loop(scale){
        let tl_ = gsap.timeline()
        tl_.to(this.loop_A.scale, {duration : 0.2, x : scale})
        tl_.to(this.loop_B.scale, {duration : 0.2, x : scale}, "<")

        return tl_
    }


    Close_Loop(){
        let tl_ = gsap.timeline()
        tl_.to(this.loop_A.scale, {duration : 0.2, x : 1})
        tl_.to(this.loop_B.scale, {duration : 0.2, x : 1}, "<")

        return tl_
    }


    Hide_Toggle() {
        let tl_ = gsap.timeline()

        tl_.to(this.switch_toggle.position, { ease: "Power1.easeOut", duration: 0.35, y: this.switch_toggle.orgY - 2 })

        return tl_
    }


    Show_Toggle() {
        let tl_ = gsap.timeline()

        tl_.to(this.switch_toggle.position, { ease: "Power1.easeOut", duration: 0.35, y: this.switch_toggle.orgY })

        return tl_


    }


    Hide_Button() {
        let tl_ = gsap.timeline()

        tl_.to(this.switch_button.position, { ease: "Power1.easeOut", duration: 0.35, y: this.switch_button.orgY - 2 })

        return tl_


    }

    Show_Button() {
        let tl_ = gsap.timeline()

        tl_.to(this.switch_button.position, { ease: "Power1.easeOut", duration: 0.35, y: this.switch_button.orgY })

        return tl_

    }


    ToggleHighlight_Enable(user){
        this.toggle_highlight[`${user}`].layers.enable(1)
        this.toggle_highlight[`${user}`].material.color = this.toggle_color[`${user}`]["active"]
    }  

    ToggleHighlight_Disable(user){
        this.toggle_highlight[`${user}`].layers.disable(1)
        this.toggle_highlight[`${user}`].material.color = this.toggle_color[`${user}`]["inactive"]
    }



    Highlight_Toggle(user){


    }



    Invert_Toggle(){
        if(this.user === null)
            return

        let opponent = this.user == "top" ? "bottom" : "top"

        this.Turn_Toggle(opponent)
    }




    Turn_Toggle(user){
        if(this.user === user)
            return

        this.SetUser(user)
        let angle
        this.ToggleHighlight_Disable("top")
        this.ToggleHighlight_Disable("bottom")
        if (user == "top") {
            angle = -0.1637119
            // this.ToggleHighlight_Enable("top")
            // this.ToggleHighlight_Disable("bottom")
        }
        else if (user == "bottom") {
            angle = 0.1637119
            // this.ToggleHighlight_Enable("bottom")
            // this.ToggleHighlight_Disable("top")
        }
        else {
            angle = 0
            // this.ToggleHighlight_Disable("bottom")
            // this.ToggleHighlight_Disable("top")
        }

        gsap.to(this.switch_toggle.rotation, {ease : "none", duration : 0.05, z : angle})

    }


    // Convert_Player(user){
    //     this.Push_Toggle(user)

    //     // this.mode_
    // }


    FillText(txt_, color_ = "#ffffff"){
        this.ctx.save()

        let txt = txt_.toString()

        // let theta = 10 * (Math.PI / 180)


        this.ctx.fillStyle = "#060A0F"
        this.ctx.fillRect(120, 0, 240, 270)
        // this.ctx.lineWidth = 5
        // this.ctx.rotate(theta)
        this.ctx.font = '11rem Tektur'
        this.ctx.textAlign = "left"
        this.ctx.strokeStyle = color_
        this.ctx.fillStyle = color_

        let textWidth = this.ctx.measureText(txt).width;
        let textHeight = this.ctx.measureText(txt).actualBoundingBoxAscent + this.ctx.measureText(txt).actualBoundingBoxDescent;



        let theta = null
        if (this.view_ == "top")
            theta = -Math.PI / 2
        else {
            theta = -Math.PI * 3 / 7
            // if (this.dbg_view)
            //     theta = 0
            // else
            //     theta = -Math.PI * 3 / 7
        }

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
        this.ctx.rotate(theta)
        this.ctx.fillText(txt, -textWidth / 2, textHeight / 2);

        this.canvas_texture.needsUpdate = true;

        this.ctx.restore()
    }


    DrawCircle(cx, cy, width, strokeStyle, fillStyle){
        this.ctx.save()

        this.ctx.lineWidth = width
        this.ctx.strokeStyle = strokeStyle
        this.ctx.fillStyle = fillStyle

        this.ctx.beginPath()
        this.ctx.arc(cx, cy, 30, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.ctx.fill()
        this.ctx.closePath()

        this.ctx.restore()
    }


    Light_Off_All(){
        let users = ["top", "bottom"]
        users.forEach(usr => {
            for (let index = 0; index < 3; index++) {
                this.Light(usr, index, false)
            }
        })

    }


    Light_On_All(){
        let users = ["top", "bottom"]
        users.forEach(usr => {
            for (let index = 0; index < 3; index++) {
                this.Light(usr, index, true)
            }
        })

    }

    Light(user, index, power) {
        // console.log(arguments)

        let width = 10;
        let strokeStyle, fillStyle;
        let cx, cy

        if (user == "top") {
            strokeStyle = "#00ffff"

            if (power == true)
                fillStyle = "#00ffff"
            else
                fillStyle = "#004545"

            cx = 60

        }
        else if (user == "bottom") {
            strokeStyle = "#00ff00"


            if (power == true)
                fillStyle = "#00ff00"
            else
                fillStyle = "#004500"

            cx = 420
        }

        cy = 50 + 85 * index

        // console.log(cx, cy, width, strokeStyle, fillStyle)

        this.DrawCircle(cx, cy, width, strokeStyle, fillStyle)


    }

    DisplayNumber(txt){
        this.view_ = "isometric"
        this.FillText(txt, "#ffffff")
    }


    DisplayFavor(){
        this.view_ = "top"
        this.FillText("⌘", "#ffaa04")
    }


    DisplayFrost(){
        this.view_ = "top"
        this.FillText("❄", "#4499ff")
    }


    ButtonMode(){
        this.view_ = "isometric"
        this.ModeSet_Toggle()

    }



    ToggleMode(){
        this.view_ = "top"
        this.ModeSet_Button()

    }


    RoundEnd(){
        this.Light_On_All()
    }


    
    MoveTo(goal){
        gsap.to(this.instance.position, {duration : 0.15, ease : "none", x : goal.x})
    }


    Setup(){
        this.MoveTo(this.anchor_setup)
    }


    Organize(){
        this.MoveTo(this.anchor)
    }


    GameStart(){
        this.view_ = "top"
    }

    GameOver(){
        // this.ButtonMode()
        this.view_ = "isometric"
        this.Turn_Toggle(null)
        this.DisplayFavor()
        this.Light_Off_All()
        this.Organize()
    }




    setDebug(){
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('clock')

            this.debugFolder
                .addColor(this.body_.material, 'color')
                .name("body_color")


            this.debugFolder
                .add(this.body_.material, 'metalness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("body_metalness")

            this.debugFolder
                .add(this.body_.material, 'roughness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("body_roughness")

            
            this.debugFolder
                .add(this.body_.material, 'envMapIntensity')
                .min(0)
                .max(6)
                .step(0.001)
                .name("body_envMapIntensity")



            this.debugFolder
                .addColor(this.switch_button_red.material, 'color')
                .name("body_color")



            this.debugFolder
                .add(this.switch_button_red.material, 'metalness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("body_metalness")

            this.debugFolder
                .add(this.switch_button_red.material, 'roughness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("body_roughness")


            this.debugFolder
                .add(this.switch_button_red.material, 'envMapIntensity')
                .min(0)
                .max(6)
                .step(0.001)
                .name("body_envMapIntensity")



//this.switch_toggle.material
        }
    }


}