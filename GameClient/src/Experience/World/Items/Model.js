// import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';
// import ModelDictionary from './ModelDictionary.js';
import EventEmitter from '../../Utils/EventEmitter.js';

export default class Model {
    constructor(modelname) {
        this.experience = new Experience()
        this.world = this.experience.world
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug
        this.modelDictionary = this.experience.modelDictionary

        this.setMesh(modelname)
        this.target = null

        this.modelname = modelname
        // this.setDebug()


    }

    // setGeometry(modelname){
    //     let geometryName = ModelDictionary[`${modelname}`].geometry
    //     this.geometry = this.geometryManager.getGeometry(geometryName)
    // }

    // setMaterial(modelname){
    //     let materialName = ModelDictionary[`${modelname}`].material
    //     this.material = this.materialManager.getMaterial(materialName)
    // }

    // setMesh(modelname){
    //     this.mesh = new THREE.Mesh(this.geometry, this.material)
    //     ModelDictionary[`${modelname}`].setMesh(this.mesh)
    //     this.scene.add(this.mesh)
    // }
    
    setMesh(modelname){
        this.mesh = this.modelDictionary.CreateModel(modelname)
    }

    SetPosition(position){
        this.mesh.position.copy(position)
    }

    GetPosition(){
        return this.mesh.position
    }

    SetOpacity(value) {
        this.mesh.material.opacity = value
    }


    Action(target, avatar) {
        let anim = this.mesh.Action(this, target, avatar)

        let eventEmitter = new EventEmitter()
        let promise = new Promise((resolve) => {
            eventEmitter.on("trigger", () => {
                resolve(() => {
                    if (this.target != null)
                        this.target.Damaged(this.modelname);

                    if(this.mesh.effects)
                        this.mesh.effects.Explode()

                    if(this.mesh.Action_End)
                        this.mesh.Action_End(this, avatar, this.experience.sound)


                    return this.AnimationDisappearance()
                })
            })
        })
        anim.then(() => { eventEmitter.trigger("trigger"); })


        return promise
    }



    Throw(target){
        let anim = gsap.timeline()
        this.mesh.lookAt(target)
        // this.mesh.rotateX(-Math.PI/4)
        // this.mesh.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/4)
        this.AnimationAppearance(0.5, anim)
        this.mesh.AnimationShooting(this.mesh, target, anim, this.experience.sound)
        // console.log(anim)


        return anim
    }

    GetTarget(target_avatar, owner_avatar){
        if(this.modelname == "axe" || this.modelname == "arrow" || this.modelname == "mjolnir")
            this.target = target_avatar.GetLastHealthStone()
        else
            this.target = null

        return this.mesh.GetTarget(target_avatar, owner_avatar)
    }



    AnimationAppearance(duration = 0.5, anim = gsap.timeline(), depth = 0.5){
        let height = this.mesh.position.y - depth
        return anim.from(this.mesh.position, {
            delay : 0.2, duration : duration, ease:"none", y : height,
            onStart : ()=>{
                if(this.modelname == "steal")
                    this.experience.sound.Play_StealToken()
            }
        })
                .to(this.mesh.material, {duration : duration, ease:"none", opacity: 1}, "<")
    }

    AnimationShooting(duration = 0.3, target, anim = gsap.timeline()){
        return this.mesh.AnimationShooting(this.mesh, target, anim, this.experience.sound)
        // return anim.to(this.mesh.position, {duration : duration, ease: "none", x : target.x, y: target.y, z : target.z})
    }

    AnimationDisappearance(duration = 0.45){
        // console.log("anim end")

        this.mesh.active_ = false
        if (this.mesh.effects) {
            this.mesh.effects.Destroy()
        }

        let height = this.mesh.position.y - 10.0
        // setTimeout(()=>{this.mesh.layers.toggle(1)}, duration * 700)
        return gsap.timeline()
            .to(this.mesh.material, {duration : duration, ease:"none", opacity: 0})
            .to(this.mesh.position, {delay : 0.0, duration : 0 , ease:"none", y : height})
    }


    Destroy(){
        // console.log(this.mesh.material)
        if (this.mesh.material != null)
            this.mesh.material.dispose();

        this.scene.remove(this.mesh)

    }



    Blink(){
        let anim = gsap.timeline()
        this.mesh.material.opacity = 0
        anim.to(this.mesh, {duration : 0.05, onStart : ()=>{this.mesh.layers.enable(1)}})
        for (let i = 0; i < 3; i++) {
            anim.to(this.mesh.material, { ease: "none", duration: 0.2, opacity: 1 })
            anim.to(this.mesh.material, { ease: "none", duration: 0.2, opacity: 0 })
        }
        anim.to(this.mesh.material, { ease: "none", duration: 0.2, opacity: 1 })
        anim.to(this.mesh, {duration : 0.05, onStart : ()=>{this.mesh.layers.disable(1)}})
        return anim;
    }


    MoveTo(pos){
        return gsap.to(this.mesh.position, {duration : 0.5, ease:"none", x : pos.x, y:pos.y, z:pos.z})
    }
    
    getID(){
        return this.mesh.id
    }

}