import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'

import gsap from 'gsap';



// ragnarok_token
export default class Ragnarok {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.material_manager = this.experience.material

        this.Initialize()


    }


    Initialize(){
        let geo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 6, 1, false, Math.PI / 6, Math.PI * 2)
        this.mat = this.material_manager.referenceMaterial("ragnarok_material")

        let mesh = new THREE.Mesh(geo, this.mat)
        mesh.castShadow = true
        this.scene.add(mesh)

        mesh.position.set(2,0.15,0)


    }

}

