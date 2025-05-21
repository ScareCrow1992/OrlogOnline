import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'

import gsap from 'gsap';

// controller
export default class Stamp {
    constructor(position_ = new THREE.Vector3(0,0,0)) {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.material_manager = this.experience.material

        this.state = "tray" // "tray" "chosen" "waiting"

        this.Initialize(position_)

    }


    Initialize(position_){
        // this.material = this.materialMa

        this.material = this.material_manager.getMaterial("banSign").clone()
        this.geometry = new THREE.PlaneGeometry(1.5, 1.5)
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotateX(-Math.PI/2)
        this.mesh.position.copy(position_)

        this.scene.add(this.mesh)
    }


    Destroy() {
        gsap.to(this.material, {
            duration: 0.5, opacity: 0, onComplete: () => {
                this.material.dispose()
                this.scene.remove(this.mesh)
            }
        })
    }
}