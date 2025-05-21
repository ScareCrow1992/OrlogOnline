// import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';
import Model from './Model.js';

export default class Weapon {
    constructor(weaponName) {
        // gsap.ticker.lagSmoothing(false);
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug
        this.weaponName = weaponName

        this.anim = gsap.timeline()

        this.setModel(weaponName)

    }

    setModel(weaponName){
        this.model = new Model(weaponName)
    }
    
    SetPosition(position){
        this.model.SetPosition(position)
    }

    GetPosition(){
        return this.model.GetPosition()
    }

    SetOpacity(value){
        this.model.SetOpacity(value)
    }

    Instantiate(){

    }


    Action(target, avatar){
        // console.log(avatar)
        return this.model.Action(target, avatar)
    }

    GetTarget(target_avatar, owner_avatar){
        return this.model.GetTarget(target_avatar, owner_avatar)
    }


    

    AnimationDisappearance(){
        this.model.AnimationDisappearance()
    }


    AnimationShooting(duration = 0.5, target){

    }

    Destroy(){
        this.model.Destroy()
    }

}