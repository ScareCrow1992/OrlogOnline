import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'
import BanSign from "./BanSign.js"
import gsap from 'gsap';

// controller
export default class Stamp {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.banSigns = []

        this.prepare_rotation

        this.state = "tray" // "tray" "chosen" "waiting"

        this.org_position = new THREE.Vector3(5,3,-12)

        this.Initialize()

    }


    Initialize(){

        this.mesh = this.resources.items.stampModel.scenes[0].children[0]
        // this.mesh.material.depthTest = false;
        // this.mesh.renderOrder = 1;

        this.scene.add(this.mesh)

        this.mesh.rotateX(-Math.PI / 6)
        this.mesh.castShadow = true
        this.prepare_rotation = this.mesh.rotation.clone()

        this.mesh.position.y += 1
        this.mesh.position.z -= 1



        // document.addEventListener("keydown", (e)=>{
        //     if(e.key == "c"){
        //         let x = (Math.random() - 0.5) * 10
        //         let z = (Math.random() - 0.25) * 5


        //         let pos = new THREE.Vector3(x,0,z)
        //         this.Stamp(pos)
        //     }
        // })

    }


    Stamp(position_){
        position_.y = 0
        this.mesh.setRotationFromEuler(this.prepare_rotation)


        let anim = gsap.timeline()
        anim.to(this.mesh.position, { duration: 0.4, x: position_.x, y: position_.y + 2, z: position_.z - 1.5, ease: "Power3.easeOut" })
            .to(this.mesh.position, { delay: 0.1, duration: 0.3, z : position_.z - 1.9, ease : "Power2.easeOut" })
            .to(this.mesh.rotation, { duration: 0.3, x: (Math.PI / 2) - (Math.PI / 5), ease : "Power2.easeOut" },"<")
            .to(this.mesh.rotation, { delay: 0.1, duration: 0.1, x: Math.PI / 2 })
            .to(this.mesh.position, { duration: 0.1, y: 0.5, ease: "Sine.easeIn" }, "<")
            .to(this.mesh.position, { duration: 0.1, z: position_.z, ease: "Sine.easeOut", onComplete : ()=>{this.CreateBanSign(position_.clone())} }, "<")
            .to(this.mesh.position, {delay : 0.15, duration : 0.3, y : 3, ease : "Power1.easeIn"})
            .to(this.mesh.position, {duration : 0.5, x : this.org_position.x, z : this.org_position.z})

        return anim
    }


    CreateBanSign(position_){
        position_.y += 0.7
        let new_ban_sign = new BanSign(position_)
        this.banSigns.push(new_ban_sign)

    }



    PositionToOrigin(){
        this.mesh.position.copy(this.org_position)
    }


    ClearBanSign(){
        this.banSigns.forEach(ban_sign=>{
            ban_sign.Destroy()
        })
    }


}