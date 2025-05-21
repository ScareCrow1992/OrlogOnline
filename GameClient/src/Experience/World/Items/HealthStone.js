import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';
import Model from './Model.js';

import FadeDisappear from '../../Shaders/Materials/FadeDisappear.js';
import ParticleSystem from '../../Particle/ParticleSystem.js';

export default class HealthStone {
    get mesh(){
        return this.model.mesh;
    }

    constructor(owner) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug
        this.avatarIndex
        this.eventEmitter
        this.originalColor = null
        this.owner = owner

        this.modelName = "health-stone"


        this.anim = gsap.timeline()
        this.uTime = { value: 0 };
        this.state = "fine" // "fine" or "destroy"


        this.next_stone = null


        this.setModel()
        // this.Highlighting_On()

    }


    InitialGame(){
        this.Hover_Off()
        this.Highlighting_Off()
        this.BloomEffectOff()
        this.CastShadow_On()
        this.Recovery()
    }

    Hover_On(){
        this.Highlighting_On()
    }

    Hover_Off(){
        this.Highlighting_Off()
    }


    Highlighting_On(){
        this.model.mesh.layers.enable(1)
        this.model.mesh.material.color.set(new THREE.Color( 1, 0.25, 0.05 ))

        if(this.next_stone != null && this.next_stone.state == "fine")
            this.next_stone.Highlighting_On()

    }


    Highlighting_Off(){
        this.model.mesh.layers.disable(1)
        // this.model.mesh.material.color.set(new THREE.Color(0x00ff11))
        this.model.mesh.material.color.copy(this.originalColor)

        
        if(this.next_stone != null && this.next_stone.state == "fine")
            this.next_stone.Highlighting_Off()
    }


    CastShadow_On(){
        this.model.mesh.castShadow = true
    }

    CastShadow_Off(){
        this.model.mesh.castShadow = false
    }


    SyncToState(){
        switch(this.state){
            case "fine":
                this.uTime.value = 0.0
                this.CastShadow_On()
                break;

            case "destroy":
                this.uTime.value = 1.0
                this.CastShadow_Off()
                break;
        }
    }


    Damaged(config = "default") {
        this.owner.DamageAnim()

        this.state = "destroy"

        if(config != "default")
            this.ChangeDamageEffect(config)

        let weapon_kind = weaponKind[`${config}`]

        
        if (weapon_kind == "axe") {
            this.experience.sound.Play_AxeDamage()
        }
        else if (weapon_kind == "arrow") {
            this.experience.sound.Play_ArrowDamage()
        }

        let timeline = gsap.timeline()

        timeline
            // .to(null, { onStart : ()=>{
            //     if(weapon_kind == "axe"){
            //         this.experience.sound.Play_AxeDamage()
            //     }
            //     else if (weapon_kind == "arrow"){
            //         this.experience.sound.Play_ArrowDamage()
            //     }
            // } })
            .to(this.uTime, {
            delay: 0.1, duration: 3.0, value: 1.0,
            onStart: () => {
                if (this.eventEmitter) {


                    this.eventEmitter.trigger(`${this.avatarIndex}-damage-${weapon_kind}-anim`, [this.GetPosition()]);

                    // this.eventEmitter.trigger(`${this.avatarIndex}-damage-anim`)

                }
                // console.log(`${this.avatarIndex}-damage-${weapon_kind}`)
                this.BloomEffectOn()
                this.CastShadow_Off()
            },
            onComplete: () => {
                this.BloomEffectOff()
                let pos = this.model.GetPosition().clone()
                // pos.y -= 10;
                this.model.SetPosition(pos)
                if (config != "default")
                    this.ChangeDamageEffect("default")
                this.SyncToState()
            }
        })


        // timeline.eventCallback("onStart", () => {
        //     if (weapon_kind == "axe") {
        //         this.experience.sound.Play_AxeDamage()
        //     }
        //     else if (weapon_kind == "arrow") {
        //         this.experience.sound.Play_ArrowDamage()
        //     }
        // })

        return timeline;
    }

    
    Recovery(animation_type){
        this.uTime.value = 0.0;
        this.state = "fine"
        this.SyncToState()
    }


    ChangeDamageEffect(config){
        this.ChangeEffectColor(config)
    }


    ChangeEffectColor(config){
        let damage_type = weaponDamageType[`${config}`]
        switch(damage_type){
            case "default":
                this.particle.material.uParticleColor.value.set(0.8, 0.8, 0.2)
                this.outline_material.uOutlineColor.value.set(0.8, 0.8, 0.2, 1.0)
                break;

            case "mjolnir":
                this.particle.material.uParticleColor.value.set(0.05, 0.6, 0.9)
                this.outline_material.uOutlineColor.value.set(0.05, 0.6, 0.9, 1.0)
                break;
        }
    }

    
    // yellow : 0.144444
    ChangeMaterialColor(hue_value){
        let material = this.model.mesh.material

        let tmp = {}
        material.color.getHSL(tmp, THREE.LinearSRGBColorSpace)

        let changed_color = new THREE.Color()

        changed_color.setHSL(hue_value, tmp.s, tmp.l)

        let tl_ = gsap.timeline()

        tl_.to(this, {ease: "none", duration : 0.6, onUpdate: ()=>{
            material.color.lerpColors(this.originalColor, changed_color, tl_.time() / 0.6)
        }})

    }



    ResetMaterialColor(){
        // this.model.mesh.material.color.copy(this.originalColor)
        let material = this.model.mesh.material

        let tmp = material.color.clone()

        let tl_ = gsap.timeline()

        tl_.to(this, {ease: "none", duration : 0.6, onUpdate: ()=>{
            material.color.lerpColors(tmp, this.originalColor, tl_.time() / 0.6)
        }})



    }


    Shine_On(){
        this.model.mesh.layers.enable(1)
    }

    
    Shine_Off(){
        this.model.mesh.layers.disable(1)
    }


    BloomEffectOn(){
        if (!this.outline_mesh.layers.isEnabled(1))
            this.outline_mesh.layers.enable(1)
    }

    BloomEffectOff(){
        if (this.outline_mesh.layers.isEnabled(1))
            this.outline_mesh.layers.disable(1)   
    }

    Extinguish(){

    }


    Action(target, avatar){
        return this.model.Action(target, avatar)
    }

    setModel(){
        this.model = new Model("health-stone")
        // this.model.mesh.layers.enable(1)

        let material = this.model.mesh.material
        let geometry = this.model.mesh.geometry
        // console.log(geometry.index__, geometry.team__)

        let tmp = {}
        material.color.getHSL(tmp, THREE.LinearSRGBColorSpace)
        // console.log(tmp)
        let unit__ = (geometry.index__ / 14)
        // let l_value = 0.15 + (1 - 0.3) * unit__
        let l_value = 0.05 + (1 - 0.3) * unit__
        // let l_value = 0.05 + (1 - 0.325) * unit__
        // let l_value = Math.tanh(unit__ - 1) 
        // l_value *= 1.1
        // l_value += 0.5


        let h_value = tmp.h
        if(geometry.team__ === "top"){
            h_value = 0.5
        }

        material.color.setHSL(h_value, tmp.s, l_value)

        this.originalColor = material.color.clone()

        this.mask_material
        this.outline_material

        let mask_material, outline_material

        [mask_material, outline_material] = FadeDisappear(material)
        this.mask_material = mask_material
        this.model.mesh.material = this.mask_material;


        this.outline_material = outline_material
        this.outline_mesh = new THREE.Mesh(geometry, this.outline_material);
        // this.scene.add(this.outline_mesh)
        // this.outline_mesh.layers.enable(1)
        // this.outline_mesh.layers.toggle(1)

        this.particle = new ParticleSystem(geometry);
        // this.particle.points.layers.toggle(1)

        this.model.mesh.add(this.outline_mesh)
        this.model.mesh.add(this.particle.points)
        
        this.model.mesh.material.uTime = this.uTime;
        this.outline_material.uTime = this.uTime;
        this.particle.material.uTime = this.uTime;



    }
    
    SetPosition(position){
        this.model.SetPosition(position)
    }

    SetOpacity(value){
        this.model.SetOpacity(value)
    }

    GetPosition(){
        return this.model.GetPosition()
    }

    Instantiate(){

    }


    AnimationDamage(){

    }

    AnimationRecovery(){
        
    }

    getID(){
        return this.model.getID()
    }


    AnimationAppearance(duration = 0.5){
        return this.model.AnimationAppearance(duration)
    }


    Blink(){
        return this.model.Blink()
    }



}


const weaponKind = {
    "arrow" : "arrow",
    "axe" : "axe",
    "mjolnir" : "godfavor"
}


const weaponDamageType = {
    "default" : "default",
    "arrow" : "default",
    "axe" : "default",
    "mjolnir" : "mjolnir"
}