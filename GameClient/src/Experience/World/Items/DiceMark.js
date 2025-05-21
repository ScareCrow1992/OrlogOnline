import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';
import Weapon from './Weapon.js';


// 주인이 누구인지, 자신이 god favor 능력 연관인지, 어느 면에 있는지 등은 전혀 관여하지 않는다.
/*
faceInfo = {
    right : {weapon : "axe", token : true}
    ...
    }
*/
export default class DiceMark {
    constructor(weaponName, color = 0xffff00, godfavor_Weapon) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.materialManager = this.experience.material
        // console.log(this.materialManager)
        this.godfavor_Weapon = godfavor_Weapon

        this.weaponName = weaponName
        this.color = new THREE.Color(color)

        this.weaponMark
        this.setMark(weaponName)

        this.weapon = null

    }

    GameOver(){
        
    }


    setMark(weapon){
        this.weaponMark = new THREE.Mesh(new THREE.PlaneGeometry(), this.materialManager.items[`${weapon}Mark`].clone())
        // this.weaponMark.lookAt(dir)
        // this.weaponMark.position.copy(dir)
        // newMark.scale.set(1.4, 1.4, 1.4);
        // this.weaponMark.position.multiplyScalar(0.5)

        // this.weaponMark.material.color.r = 1
        // this.weaponMark.material.color.g = 1
        
        this.weaponMark.layers.enable(1)
        this.weaponMark.layers.toggle(1)

    }

    InstantiateWeapon(){
        // if(this.weapon != null)
        //     this.weapon.Destroy()
        
        // console.log(this.weaponName)
        if(this.godfavor_Weapon)
            this.weapon = new Weapon(this.godfavor_Weapon)
        else
            this.weapon = new Weapon(this.weaponName)
        this.weapon.SetOpacity(0)
        // this.weapon.position.copy(this.weaponMark.position)
        let position = new THREE.Vector3()
        this.weaponMark.getWorldPosition(position)
        position.y += 0.5
        this.weapon.SetPosition(position)

        return this.weapon
    }


    TurnOnLight(){
        // console.log("Turn On Light")
        gsap.timeline()
            .to(this.weaponMark.material.color, {duration : 0.4, r: this.color.r, g: this.color.g, b:this.color.b, onStart : ()=>{
                this.weaponMark.renderOrder = 3
                this.weaponMark.material.depthTest = false;
                this.weaponMark.layers.toggle(1)
            }})
            .to(this.weaponMark.material.color, {delay : 0.4, duration : 0.4, r:0, g:0, b:0, onComplete : ()=>{
                this.weaponMark.renderOrder = 0
                this.weaponMark.material.depthTest = true;
                this.weaponMark.layers.toggle(1)
            }})
    }


    Highlighting_Mark(color, duration){
        let anim = gsap.timeline()

        let tmp_color = new THREE.Color(color)

        this.weaponMark.layers.toggle(1)

        anim.to(this.weaponMark.material.color, { duration: duration / 2, r: tmp_color.r, g: tmp_color.g, b: tmp_color.b, ease: "none" })
            .to(this.weaponMark.material.color, { duration: duration / 2, r: 0, g: 0, b: 0, ease: "none", onComplete: () => { this.weaponMark.layers.toggle(1) } })

        return anim
    }


    DisappearAnimation(color, duration){
        let anim = gsap.timeline()
        this.weaponMark.layers.toggle(1)

        anim.to(this.weaponMark.material.color, { duration: duration * 2 / 3 , r: color.r, g: color.g, b: color.b, ease: "none" })
            .to(this.weaponMark.material, { duration: duration / 3, opacity: 0, ease: "none", onComplete: () => { this.weaponMark.layers.disable(1); this.SetPosition(0, 0, -0.5) } })

        return anim
    }


    EngravedAnimation(){
        let anim = gsap.timeline()

        // this.SetPosition(0,0,2)
        this.SetOpacity(0)
        this.SetColor(this.color)
        this.weaponMark.layers.toggle(1)

        // anim.from(this.weaponMark.position, {duration: 1.0, z : 3.5, ease : "Power2.easeIn"})
        //     .to(this.weaponMark.material, {duration: 1.0, opacity : 1, ease : "none"}, "<")
        //     .to(this.weaponMark.material.color, {duration : 1.0, r:0, g:0, b:0, ease : "none", onComplete: ()=>{this.weaponMark.layers.toggle(1)}})



        anim.to(this.weaponMark.material, { duration: 0.5, opacity: 1, ease: "none" })
            .to(this.weaponMark.material.color, { duration: 0.5, r: 0, g: 0, b: 0, ease: "none", onComplete: () => { this.weaponMark.layers.toggle(1) } })


        return anim
    }


    SetPosition(x,y,z){
        this.weaponMark.position.set(x,y,z)
    }

    SetOpacity(value){
        this.weaponMark.material.opacity = value
    }

    SetColor(color){
        this.weaponMark.material.color.copy(color)
    }

    Reset(){
        this.SetPosition(0, 0, 0.02)
        this.weaponMark.material.color.set(0, 0, 0)
        this.weaponMark.material.opacity = 1.0
    }


    destroy(){
        this.weaponMark.material.dispose()
    }


}