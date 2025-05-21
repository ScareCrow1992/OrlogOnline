import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'

// controller
export default class TokenDice {
    constructor(type) {

        this.type = type    // "normal" or "hidden"
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene

        


        this.positionForUndo = new THREE.Vector3();
        this.state = "tray" // "tray" "chosen" "waiting"

        this.Init(type)

    }



    Init(type){
        let geometry = new THREE.DodecahedronGeometry(0.7, 0)
        let material = new THREE.MeshStandardMaterial({ color: type == "normal" ? "white" : "black" })

        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
    }

    setPosition(pos){
        this.mesh.position.copy(pos)
    }


}