import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Shield {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.meshManager = this.experience.mesh
        // this.debug = this.experience.debug

        this.setModel()
        // this.setDebug()
    }

    setModel() {
        // console.log(this.resources.items.shieldModel)
        this.mesh = this.meshManager.items.shield
        // console.log(this.mesh)

        this.mesh.scale.multiplyScalar(2)
        this.mesh.position.y += 2
        this.mesh.position.x += 2
        this.mesh.material = new THREE.MeshStandardMaterial({ color: '#fff58a' })
        this.scene.add(this.mesh)


    }

    
    setTextures(name) {
    }


    setGeometry() {
    }


    setMaterial() {

        // color_fragment
    }

    // setSprite()
    // {
    //     this.sprite = new THREE.Sprite(this.material);
    //     this.scene.add(this.sprite);

    // }


    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`shield`);

            this.debugFolder
                .addColor(this.mesh.material, "color")

            this.debugFolder
                .addColor(this.mesh.material, "emissive")




            this.debugFolder
                .add(this.mesh.material, "metalness")
                .name("metalness")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.material, "roughness")
                .name("roughness")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()


            this.debugFolder.onChange((event) => {
                // event.object     // object that was modified
                // event.property   // string, name of property
                // event.value      // new value of controller
                // event.controller // controller that was modified
                // console.log(event);
                if (event.property === "roughness") {
                    event.object.color.alpha = 1 - event.value
                }
                else if (event.property === "color") {
                    // event.object.roughness = 1 - event.value;
                }
            })


            this.debugFolder
                .add(this.mesh.position, 'x')
                .name('position X')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'y')
                .name('position Y')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'z')
                .name('position Z')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.rotation, 'x')
                .name('rotation X')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.rotation, 'y')
                .name('rotation Y')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.rotation, 'z')
                .name('rotation Z')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()


        }
    }

}

