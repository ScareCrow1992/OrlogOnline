import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';

export default class Weapon {
    constructor(weaponType, pos) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug
        this.weaponType = weaponType

        this.setGeometry(weaponType)
        this.setMaterial(weaponType)
        this.setMesh(weaponType, pos)
        // this.setDebug()


        this.anim = gsap.timeline()
    }

    setGeometry(weaponType) {
        if (weaponType != "steal"){
            this.geometry = this.geometryManager.items[`${weaponType}`].clone()
        }
    }

    setMaterial(weaponType) {
        if (weaponType == "steal") {
            this.material = new THREE.SpriteMaterial({ map: this.resources.items.StealMark, color: 0x737373 })
            this.material.transparent = true;
            this.material.depthTest = false;
            this.material.rotation = Math.PI / 2;
        }
        else if(weaponType == "mjolnir"){
            this.material = new THREE.MeshStandardMaterial({ transparent: true, color: 0x00ffff })
        }
        else
            this.material = new THREE.MeshStandardMaterial({ transparent: true, color: 0xffe98a });
        this.material.opacity = 0;
    }

    setMesh(weaponType, pos) {
        if (weaponType == "steal") {
            this.mesh = new THREE.Sprite(this.material);
            // this.mesh.layers.toggle(1)
            // this.mesh.layers.disable(1);
            this.mesh.renderOrder = 5;
            this.mesh.position.copy(pos)
        }
        else{
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.copy(pos)
            this.mesh.position.y -= 0.5;
            this.mesh.layers.enable(1)
        }
        
        // this.mesh.scale.multiplyScalar(0.1)

        // switch(weaponType){
        //     case "axe":
        //         this.mesh.scale.multiplyScalar(0.1)
        // }


        this.scene.add(this.mesh);
    }

    destroy() {
        // console.log("destory")
        if (this.weaponType != "steal")
            this.geometry.dispose();

        this.material.dispose();
        this.scene.remove(this.mesh)
    }

    appear() {
        this.anim.to(this.mesh.position, { duration: 0.3, ease: "none", y: 2 });
        this.anim.to(this.mesh.material, { duration: 0.3, ease: "none", opacity: 1, onComplete: () => { this.action();  } }, "<")
    }


    disappear() {
        // console.log("disappear")

        if (this.weaponType != "steal") {
            let endheight = this.mesh.position.y - 1.5;
            gsap.to(this.mesh.position, { delay: 0.6, duration: 0.7, ease: "none", y: endheight })
            gsap.to(this.mesh.material, { duration: 0.7, ease: "none", opacity: 0, onComplete: () => { this.destroy() } }, "<")
        }
        else if(this.weaponType == 'steal'){
            gsap.to(this.mesh.material, { delay: 0.1, duration: 0.25, ease: "none", opacity: 0, onComplete: () => { this.destroy() } })    
        }


    }

    // target : Weapon Instance
    setTarget(target_) {
        this.target = target_;
        // console.log(target_);
        this.mesh.lookAt(this.target.mesh.position);
    }


    action() {
        if (this.weaponType == "arrow" || this.weaponType == "axe" || this.weaponType == "steal" || this.weaponType == "mjolnir")
            this.shoot()


    }

    battleEnd() {
        this.disappear();
    }

    shoot() {

        // this.mesh.lookAt(this.target.x, this.target.y, this.target.z);

        let targetPosition = this.target.mesh.position.clone();
        let startPosition = this.mesh.position.clone();

        startPosition.set(
            startPosition.x - targetPosition.x,
            startPosition.y - targetPosition.y,
            startPosition.z - targetPosition.z)

        startPosition.normalize();
        // startPosition.multiplyScalar(0.5);


        if (this.weaponType == "arrow") {
            // console.log("arrow fire!")
            this.anim.to(this.mesh.position, { duration: 0.15, ease: "none", x: targetPosition.x + startPosition.x * .5, y: targetPosition.y, z: targetPosition.z + startPosition.z * .5 });
        }
        else if (this.weaponType == "steal") {
            this.anim.to(this.mesh.position, { duration: 0.3, ease: "none", x: targetPosition.x, y: targetPosition.y, z: targetPosition.z });
        }
        else if (this.weaponType == "axe" || this.weaponType == "mjolnir") {
            // console.log("throw axe!")
            this.anim.to(this.mesh.position, {
                duration: 0.2, ease: "none", x: targetPosition.x + startPosition.x * 0.7, y: targetPosition.y, z: targetPosition.z + startPosition.z * 0.7, onUpdate: () => { this.mesh.rotateX(0.61) }, onComplete: () => {

                    let dummy = new THREE.Object3D();
                    dummy.position.copy(this.mesh.position)
                    // console.log(dummy);
                    dummy.lookAt(targetPosition);
                    // dummy.position.copy(this.mesh.postion);
                    dummy.rotateX(Math.PI / 4);

                    // // this.mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/4);

                    this.mesh.rotation.copy(dummy.rotation);
                }
            });
        }
        this.anim.eventCallback("onComplete", () => { this.target.battleEnd(); this.battleEnd(); })

    }


    debug_reset() {
        this.mesh.position.x = -4;
        this.mesh.position.z = 1;
    }


    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`${this.weaponType}`);

            // this.debugFolder
            //     .addColor(this.mesh.material, "color")

            // this.debugFolder
            //     .addColor(this.mesh.material, "emissive")

            this.debugFolder
                .add(this, "appear")

            this.debugFolder
                .add(this, "disappear")

            this.debugFolder
                .add(this, "shoot")

            this.debugFolder
                .add(this, "debug_reset")



            // this.debugFolder
            //     .add(this.mesh.material, "metalness")
            //     .name("metalness")
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.material, "roughness")
            //     .name("roughness")
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()


            // this.debugFolder.onChange((event) => {
            //     // event.object     // object that was modified
            //     // event.property   // string, name of property
            //     // event.value      // new value of controller
            //     // event.controller // controller that was modified
            //     // console.log(event);
            //     if (event.property === "roughness") {
            //         event.object.color.alpha = 1 - event.value
            //     }
            //     else if (event.property === "color") {
            //         // event.object.roughness = 1 - event.value;
            //     }
            // })


            // this.debugFolder
            //     .add(this.mesh.position, 'x')
            //     .name('position X')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'y')
            //     .name('position Y')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'z')
            //     .name('position Z')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'x')
            //     .name('rotation X')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'y')
            //     .name('rotation Y')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'z')
            //     .name('rotation Z')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()


        }
    }

}

