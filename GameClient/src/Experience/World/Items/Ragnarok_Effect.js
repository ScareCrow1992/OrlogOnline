import * as THREE from 'three'
// import Experience from '../Experience.js'
import Experience from '../../Experience.js';
import gsap from 'gsap';


const limit_cnt = 15

let mat4 = new THREE.Matrix4()

export default class Ragnarok_Effect{
    static instance = null
    constructor(){
        if(Ragnarok_Effect.instance != null){
            return;
        }

        Ragnarok_Effect.instance = this

        
        this.experience = new Experience()
        this.world = this.experience.world
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.geometryManager = this.experience.geometry
        this.materialManager = this.experience.material
        this.debug = this.experience.debug


        this.Initialize()

    }


    get instance() { return this.effect_mesh }


    Initialize(){


        let effect_alpha_ = new Float32Array(limit_cnt);
        for (let i = 0; i < limit_cnt; i++) {
            effect_alpha_[i] = 0.0
        }

        this.effect_geometry = this.geometryManager.items.token.clone();
        this.effect_geometry.setAttribute("alpha", new THREE.InstancedBufferAttribute(effect_alpha_, 1, true, 1))


        this.effect_materials = [,,this.materialManager.referenceMaterial("ragnarok_effect"),,,,];
        this.effect_mesh = new THREE.InstancedMesh(this.effect_geometry, this.effect_materials, limit_cnt);
        this.effect_mesh.layers.enable(1)


        this.index_queue = Array.from(Array(limit_cnt).keys())
        this.particle_infos = []

        // let pos = new THREE.Vector3(0, -3, 20)
        // let pos = new THREE.Vector3(5, 2, 2)

        
        for (let index = 0; index < limit_cnt; index++) {
            let tmp_matrix = new THREE.Matrix4()
            tmp_matrix.setPosition(new THREE.Vector3(0, -1, 20))

            // tmp_matrix.setPosition(new THREE.Vector3((index - 7) * 1.5 , 0.2, 3))
            // tmp_matrix.makeRotationY(Math.PI / 3)

            this.effect_mesh.setMatrixAt(index, tmp_matrix)

            this.particle_infos.push(new ParticleInfo(index))
        }


        this.effect_mesh.renderOrder = 2
        this.effect_mesh.instanceMatrix.needsUpdate = true

        this.scene.add(this.effect_mesh)

        
        this.world.Add_AnimationObject(this.instance.id, this)

    }

    GetParticle(){
        let index = this.index_queue.pop()
        if(index == undefined)
            return null

        return this.particle_infos[index]
    }


    ReturnParticle(index){
        this.index_queue.push(index)

    }


    initialMove(from, to, isImmediately){
        let info = this.GetParticle()

        return info.initialMove(from, to, isImmediately)
    }


    Spend(position){
        let info = this.GetParticle()

        return info.Spend(position)

    }


    slideMove(from, to){
        let info = this.GetParticle()

        return info.slideMove(from, to)
    }


    SetMatrixAt(index, mat){
        this.instance.setMatrixAt(index, mat)
        this.instance.instanceMatrix.needsUpdate = true
    }


    SetOpacityAt(index, value){
        this.effect_mesh.geometry.attributes.alpha.array[index] = value
        this.effect_mesh.geometry.attributes.alpha.needsUpdate = true
    }


    Update(){
        for (let i = 0; i < limit_cnt; i++) {
            let instance_index = i
            let particle_info = this.particle_infos[instance_index]

            let mat, opacity_value
            if(ParticleInfo.needsUpdate[instance_index] == true){
                mat = particle_info.effect_matrix
                this.SetMatrixAt(instance_index, mat)
                ParticleInfo.needsUpdate[instance_index] = false
            }


            if(ParticleInfo.needsEffectUpdate[instance_index] == true){
                opacity_value = particle_info.opacity.effect
                this.SetOpacityAt(instance_index, opacity_value)
            }
        }
    }
}



class ParticleInfo{
    static needsUpdate = new Array(limit_cnt).fill(false)
    static needsEffectUpdate = new Array(limit_cnt).fill(false)

    static quat_ = new THREE.Quaternion(0, 0.258819, 0, 0.965925)
    static scale_ = new THREE.Vector3(1.3, 1, 1.3)

    constructor(index){
        this.index = index


        this.position = {
            vec: new THREE.Vector3(0, -3, 20),
            get x() { return this.vec.x; },
            get y() { return this.vec.y; },
            get z() { return this.vec.z; },
            set x(value) { this.vec.setX(value); ParticleInfo.needsUpdate[this.index] = true; },
            set y(value) { this.vec.setY(value); ParticleInfo.needsUpdate[this.index] = true; },
            set z(value) { this.vec.setZ(value); ParticleInfo.needsUpdate[this.index] = true; }
        }
        this.position.index = index

        this.opacity = {
            effect_ : 0,

            get effect() { return this.effect_ },
            
            set effect(value) { this.effect_ = value; ParticleInfo.needsEffectUpdate[this.index] = true; }
        }
        this.opacity.index = index


    }


    get effect_matrix() {
        let pos = this.position.vec.clone()
        pos.setY(pos.y + 0.05)
        
        mat4.compose(pos, ParticleInfo.quat_, ParticleInfo.scale_)

        return mat4
    }


    AnimationEnd(){
        this.position.x = 0
        this.position.y = -2
        this.position.z = 20

        Ragnarok_Effect.instance.ReturnParticle(this.index)
    }


    setPosition(position){
        this.position.x = position.x
        this.position.y = position.y
        this.position.z = position.z
    }


    initialMove(from, goal, isImmediately){
        let anim = gsap.timeline()


        this.setPosition(from)
        
        let fromHeight = undefined

        if (isImmediately == true) {
            fromHeight = this.position.y
        }
        else {
            fromHeight = goal.y
        }

        anim.to(this.opacity, { duration: 0.6, ease: "none", effect: 1 })
        anim.to(this.position, { duration: 0.6, ease: "none", y: fromHeight }, "<")



        if(isImmediately == true){
            anim.to(this.position, {duration : 0.55, ease: "none", x : goal.x, y : 0.2 + 0.05, z : goal.z})
        }
        else{
            anim.from(this.position, {duration : 0.55, ease: "none", x : goal.x, y : fromHeight, z : goal.z})
        }

        anim.addLabel("lightoff", ">")

        anim.to(this.opacity, {
            duration: 0.4, ease: "none", effect: 0,
            onComplete: () => { this.AnimationEnd() }
        })

        return anim
    }


    Spend(position){
        let anim = gsap.timeline()

        this.setPosition(position)


        anim.to(this.opacity, { duration: 0.5, ease: "none", effect: 1 })
        
        anim.addLabel("lightoff", ">")
        
        anim.to(this.opacity, { delay: 0.5, duration: 0.5, ease: "none", effect: 0, onComplete: () => { this.AnimationEnd() } })

        return anim
    }


    slideMove(from, goal){
        let anim = gsap.timeline()

        this.setPosition(from)
        anim.to(this.opacity, { delay: 0.2, duration: 0.4, ease: "none", effect: 1 })
        anim.addLabel("lighton", "<")

        anim.to(this.position, { delay: 0.15, duration: 0.4, ease: "none", x: goal.x, y: goal.y, z: goal.z })
        anim.to(this.opacity, { delay: 0.15, duration: 0.4, effect: 0, ease: "none", onComplete: () => { this.AnimationEnd() } })

        return anim

    }


}

