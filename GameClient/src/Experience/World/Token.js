import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';
import TokenEffect from './TokenEffect.js'

import FadeDisappear from '../Shaders/Materials/FadeDisappear.js';

export default class Token {
    constructor(pos, playerInfo) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug


        this.setTexture()
        this.setGeometry()
        this.setMaterial()
        this.setMesh(pos)
        // this.setDebug()
    }




    setGeometry() {
        this.geometry = this.geometryManager.items.token;
    }


    setTexture() {

    }


    setMaterial() {
        this.material_front = this.experience.material.getMaterial("token_material")
        this.material_side =  this.experience.material.getMaterial("token_material_side")

        let zero_material = this.experience.material.getMaterial("zero")

        this.materials = [
            this.material_side,this.material_side,
            this.material_front,
            this.material_side,this.material_side,this.material_side,
        ]

        // this.outline_materials = [
        //     zero_material,zero_material,
        //     this.material_front,
        //     zero_material,zero_material,zero_material
        // ]

    }

    setMesh(pos) {
        // let [mask_material, outline_material] = FadeDisappear(this.material_front)

        // let offset_X = Math.random()
        // let offset_Y = Math.random()

        // mask_material.uOffset.value.set(offset_X, offset_Y)
        // outline_material.uOffset.value.set(offset_X, offset_Y)

        // mask_material.uTime.value = 0.0;
        // mask_material.uThreshold.value = 0.0;
        // this.materials[2] = mask_material

        // this.mesh = new THREE.Mesh(this.geometry, this.materials);

        // outline_material.depthWrite= false
        // outline_material.depthTest= false
        // outline_material.uTime.value = 0.0;
        // outline_material.uThreshold.value = 0.48;
        // outline_material.uOutlineColor.value.set(0.3, 0.3, 1.0, 1.0)
        // outline_material.uThickness_In.value = 0.53;
        // outline_material.uThickness_Out.value = 0.86;
        
        // this.outline_materials[2] = outline_material
        // this.outline_mesh = new THREE.Mesh(this.geometry, this.outline_materials);
        // this.outline_mesh.renderOrder = 5
        // this.outline_mesh.layers.enable(1)
        // this.mesh.add(this.outline_mesh)

        this.mesh = new THREE.Mesh(this.geometry, this.materials)


        this.mesh.position.copy(pos);
        this.mesh.geometry.computeVertexNormals()
        this.scene.add(this.mesh)
        this.effect = new TokenEffect(this.mesh.position)
        this.mesh.attach(this.effect.mesh)

    }

    Disappear() {
        gsap.timeline({ defaults: { duration: 0.7 } })
            .to(this.material_front.color, { ease: "none", r: 0, g: 0, b: 0 })
            .to(this.material_side.color, { ease: "none", r: 0, g: 0, b: 0 }, "<")
            .to(this.material_front, { ease: "none", opacity : 0 })
            .to(this.material_side, { ease: "none", opacity : 0, onComplete:()=>{this.destroy()} }, "<")
        // gsap.timeline({ defaults: { duration: 1.5 } })
        //     .to(this.mesh.material[2].uTime, { ease: "Power4.easeIn", value: 1.0 })
        //     .to(this.outline_mesh.material[2].uTime, { ease: "Power4.easeIn", value: 1.0 }, "<")
        //     .to(this.material_side, { ease: "none", opacity: 0, onComplete:()=>{this.destroy()} }, "<")
    }



    Appear(){
        gsap.to(this.mesh.material[2].uTime,{ease:"none", value : 0.0, duration : 1})
        gsap.to(this.outline_mesh.material[2].uTime,{ease:"none", value : 0.0, duration : 1})

    }


    
    initialMove(goal, isImmediately = true){

        let anim = gsap.timeline()
        let fromPosition = this.mesh.position.clone()
        let fromHeight = undefined


        if (isImmediately == true) {
            fromHeight = fromPosition.y + 1.0
        }
        else {
            fromHeight = goal.y + 1.0
        }


        anim.to(this.effect.material, {duration : 0.4, ease:"none", opacity : 1, onStart : ()=>{this.effect.ToggleLight(); this.mesh.castShadow = false;}})
        anim.to(this.mesh.position, {duration : 0.55, ease: "none", y : fromHeight}, "<")

        if(isImmediately == true){
            anim.to(this.mesh.position, {duration : 0.55, ease: "none", x : goal.x, y : goal.y, z : goal.z})
        }
        else{
            anim.from(this.mesh.position, {duration : 0.55, ease: "none", x : goal.x, y : fromHeight, z : goal.z})
        }

        anim.to(this.mesh.material, {duration : 0.3, ease: "none", opacity : 1})
        anim.to(this.effect.material, {duration : 0.8, ease: "none", opacity : 0, onComplete:()=>{this.effect.ToggleLight(); this.mesh.castShadow = true;}})
    
        // anim.then(()=>{console.log("move end")})
        return anim;
    }




    slideMove(goal){
        let anim = gsap.timeline()
        anim.to(this.effect.material, {delay : 0.2, duration : 0.4, ease: "none", opacity:1, onStart : ()=>{this.effect.ToggleLight(); this.mesh.castShadow = false;}})
        anim.to(this.mesh.position, {delay : 0.15, duration : 0.4, ease: "none", x : goal.x, y : goal.y, z : goal.z})
        anim.to(this.effect.material, {delay: 0.15, duration: 0.4, ease: "none", opacity:0, onComplete : ()=>{this.effect.ToggleLight(); this.mesh.castShadow = true;}})

        return anim
    }



    GetPosition(){
        return this.mesh.position
    }


    Spend(){
        let anim = gsap.timeline()
        .to(this.effect, {onStart : ()=>{this.effect.ToggleLight(); this.mesh.castShadow = false}})
        .to(this.effect.material, {duration: 0.5, ease:"none", opacity : 1})
        .to(this.effect.material, {delay : 1.0 ,duration: 0.5, ease:"none", opacity : 0})
        .to(this.mesh.material, {duration: 0.5, ease:"none", opacity : 0}, "<")
        .to(this.effect, {onComplete : ()=>{this.effect.ToggleLight()}})
        .then(()=>{this.destroy()})

        return anim
    }


    destroy(){
        this.materials.forEach(mat => {
            mat.dispose()
        })

        // this.materials[2].dispose()
        // this.outline_materials[2].dispose()

        this.effect.destroy()

        // console.log(window.experience)

        this.mesh.remove(this.outline_mesh)

        this.scene.remove(this.mesh)
    }


    battleEnd(){
        console.log("stealed!")

        // 상대 팀 쪽의 스택에 넣은 후, 가야할 장소를 알아낸다.
    }


    ChangeColor(r,g,b){
        this.materials.forEach(mat=>{
            mat.color.setRGB(r,g,b)
        })
    }


    setDebug(){
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`Token`);

            

            this.debugFolder
                .add(this.mesh.material[2].uTime, 'value')
                .name('mesh-utime')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.outline_mesh.material[2].uTime, 'value')
                .name('outline-utime')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()



            this.debugFolder
                .add(this.mesh.material[2].uThreshold, 'value')
                .name('mesh-uThreshold')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.outline_mesh.material[2].uThreshold, 'value')
                .name('outline-uThreshold')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()



            this.debugFolder
                .add(this.outline_mesh.material[2].uThickness_In, 'value')
                .name('mesh-uThickness_In')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.outline_mesh.material[2].uThickness_Out, 'value')
                .name('outline-uThickness_Out')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()




            this.debugFolder
                .addColor(this.materials[2], "color")

            this.debugFolder
                .addColor(this.materials[2], "emissive")

            this.debugFolder
                .add(this.materials[2], 'displacementScale')
                .name('symbol displacement Scale')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2], 'displacementBias')
                .name('symbol displacement Bias')
                .min(-2)
                .max(2)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2], 'aoMapIntensity')
                .name('aoMapIntensity')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2].normalScale, 'x')
                .name('normal Scale X')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2].normalScale, 'y')
                .name('normal Scale Y')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2], 'metalness')
                .name('metalness')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.materials[2], 'roughness')
                .name('roughness')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()


            this.debugFolder
                .add(this.mesh.position, 'x')
                .name('position X')
                .min(-10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'y')
                .name('position Y')
                .min(-1)
                .max(5)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'z')
                .name('position Z')
                .min(-10)
                .max(10)
                .step(0.001)
                .listen()

        }

    }

}

