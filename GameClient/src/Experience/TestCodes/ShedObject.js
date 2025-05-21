import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';
import TokenEffect from './TokenEffect.js'



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

        this.mesh = new THREE.Mesh(
            
        )


    }
}