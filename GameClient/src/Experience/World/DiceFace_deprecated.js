import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';



// 주인이 누구인지, 자신이 god favor 능력 연관인지, 어느 면에 있는지 등은 전혀 관여하지 않는다.
/*
faceInfo = {
    right : {weapon : "axe", token : true}
    ...
    }
*/
export default class DiceFace {
    constructor(faceInfo, faceDir) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.materialManager = this.experience.material
        // console.log(this.materialManager)

        // Material
        //"tokenMark"
        //"axeMark"
        //"arrowMark"

        // Geometry
        // 




        this.itemPrefab;    // new Weapon()
        // instance of this.weaponPrefab
        this.weaponType = faceInfo.weapon;    // "arrow", "axe", "shield", "steal", "token" ...
        // this.isToken;   // true, false

        this.isToken = faceInfo.token;

        this.weaponMeshes = []
        this.tokenMesh = null
        this.faceDir = faceDir

        this.setWeaponMesh()
        if (this.isToken == true)
            this.setTokenMesh()

    }


    setWeaponMesh() {
        let newMark = new THREE.Mesh(new THREE.PlaneGeometry(), this.materialManager.items[`${this.weaponType}Mark`].clone())
        newMark.lookAt(this.faceDir)
        newMark.position.copy(this.faceDir)
        // newMark.scale.set(1.4, 1.4, 1.4);
        newMark.position.multiplyScalar(0.5)

        this.weaponMeshes.push(newMark)
    }


    setTokenMesh() {
        let newToken;
        newToken = new THREE.Mesh(new THREE.PlaneGeometry(), this.materialManager.items[`tokenMark`].clone())
        newToken.lookAt(this.faceDir)
        newToken.position.copy(this.faceDir)
        newToken.position.multiplyScalar(0.502)
        newToken.scale.set(.90, .90, .90);
        this.tokenMesh = newToken
    }


    action() {

    }

    getWeaponType() {
        return this.weaponType;
    }

    getItem() {

    }

}