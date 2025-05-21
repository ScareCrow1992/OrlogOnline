import * as THREE from 'three'
import Experience from '../Experience.js'

// Top 플레이어 버튼 역할을 대신수행
export default class TurnEndButtonDBG {
    constructor() {
        // super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()


        this.stoneColor = {
            top: 0x00e1ff,
            bottom: 0x00ff11
        }

    }

    setGeometry() {
        // this.geometry = new THREE.BoxGeometry(1.5, 0.5, 1);
        this.geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16, 3)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.1, color: "orange" })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y += 0.25
        // this.mesh.rotation.x = - Math.PI * 0.5
        // this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    clicked() {
        this.experience.game.changeTurnButtonDBGPushed()
    }




    active() {
        // if (this.debug.active)
        //   this.debugFolder.show();
    }

    deactive() {
        // if (this.debug.active)
        //   this.debugFolder.hide();
    }


}