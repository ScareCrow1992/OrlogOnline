import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';



export default class HealthStone {
    constructor(x, y, z, color, playerController) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.materialManager = this.experience.material;

        this.playerController = playerController

        this.alpha = 0.0;
        this.gamma = 0.0;

        this.isAlive = true // true or false;
        
        // this.diffuseColor = new THREE.Color().setHSL( this.alpha, 0.5, this.gamma * 0.5 + 0.1 );


        // bumpScale: bumpScale,
        // color: diffuseColor,
        // metalness: beta,
        // roughness: 1.0 - alpha,

        this.setGeometry()
        this.setMaterial(color)
        this.setMesh(x, y, z)
        this.setDebug()

        
    }

    setGeometry() {
        this.geometry = new THREE.IcosahedronGeometry(0.5, 5)
    }

    setMaterial(color) {
        // this.material = new THREE.MeshStandardMaterial({ color: "#00ff11", bumpScale : 0, metalness : 0.164, roughness:0.164, transparent : true});
        this.matObject = this.materialManager.items.disappearMaterial(); 
        this.material = this.matObject.material;
        this.material.color.set(color);
    }

    setMesh(x, y, z) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.scale.y = 0.85
        this.mesh.scale.x = 0.5
        this.mesh.scale.z = 1.2
        this.mesh.rotation.z += Math.PI / 2 

        this.mesh.position.set(x, 0.25, z)
        this.mesh.castShadow = true;
        
        this.scene.add(this.mesh);
        // this.mesh.layers.enable(1);
    }


    active() {
        if (this.debug.active)
            this.debugFolder.show();
    }

    deactive() {
        if (this.debug.active)
            this.debugFolder.hide();

    }


    appear(){
        if(this.isAlive === true)
            return false;
        
        this.isAlive = true;
        let anim = gsap.timeline()
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", x : 0.5})
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", y : 0.85})
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", z : 1.2})
        anim.to(this.matObject.customUniforms.uDisappear, { duration: 0.7, ease: "none", value: 1.0, onComplete: () => { this.mesh.castShadow = true } });
        // this.playerController.takeHeal();
        
        return true;
    }


    disappear(){
        if(this.isAlive === false)
            return false;
        
        this.isAlive = false;

        let anim = gsap.timeline()
        anim.to(this.matObject.customUniforms.uDisappear, { delay: 0.3, duration: 0.7, ease: "none", value: 0.0, onComplete: () => { this.mesh.castShadow = false } })
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", x : 0.0})
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", y : 0.0})
        anim.to(this.mesh.scale, {duration: 0.01, ease:"none", z : 0.0});
        // this.playerController.takeDamage();
        
        return true;
    }

    battleEnd(){
        this.disappear()

        
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`helathStone ${this.mesh.id}`);

            this.debugFolder
                .addColor(this.material, "color")

            this.debugFolder
                .add(this.material, "metalness")
                .name("metalness")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material, "roughness")
                .name("roughness")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

                // this.debugFolder
                // .add(this.material.metalness, "metalness")
                // .name("metalness")
                // .min(0)
                // .max(1)
                // .step(0.001)
                // .listen()

            this.debugFolder.onChange((event)=>{
                // event.object     // object that was modified
                // event.property   // string, name of property
                // event.value      // new value of controller
                // event.controller // controller that was modified
                // console.log(event);
                if(event.property === "roughness"){
                    event.object.color.alpha = 1- event.value
                }
                else if(event.property === "color"){
                    // event.object.roughness = 1 - event.value;
                }
            })

            this.debugFolder
                .add(this.matObject.customUniforms.uTime, "value")
                .name("uTime")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()
            
            this.debugFolder
                .add(this.matObject.customUniforms.uDisappear, "value")
                .name("uDisappear")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()


            this.debugFolder.hide();

        }

        

    }



}