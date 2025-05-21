import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';
import DiceFace from './DiceFace_deprecated.js'


export default class Dice {
    constructor(x, y, z, playerInfo, faceInfo) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.materialManager = this.experience.material
        // console.log(this.materialManager)

        // tray, chosen, wating
        this.state = 'tray';

        this.positionInTray = {};

        this.owner = playerInfo;


        // console.log(tmpMat.invert());

        // tmpMat.setFromMatrix4(this.mesh.matrix);

        this.weapon = ""
        this.isFavor = false;

        this.symbolsNormal = {
            "right": new THREE.Vector3(1, 0, 0),
            "left": new THREE.Vector3(-1, 0, 0),
            "top": new THREE.Vector3(0, 1, 0),
            "bottom": new THREE.Vector3(0, -1, 0),
            "front": new THREE.Vector3(0, 0, 1),
            "back": new THREE.Vector3(0, 0, -1),
        }

        this.diceFaces = {}
        // "right" : new DiceFace()

        this.upFaceRotation = {
            "right": new THREE.Vector3(0, -Math.PI / 2, Math.PI / 2),
            "left": new THREE.Vector3(Math.PI, Math.PI / 2, Math.PI / 2),
            "top": new THREE.Vector3(0, 0, 0),
            "bottom": new THREE.Vector3(Math.PI, 0, 0),
            "front": new THREE.Vector3(-Math.PI / 2, 0, 0),
            "back": new THREE.Vector3(Math.PI / 2, 0, Math.PI / 2),
        }

        this.upFaceQuaternion = {
            "right": new THREE.Quaternion(-0.5, -0.5, 0.5, 0.5),
            "left": new THREE.Quaternion(0.5, -0.5, 0.5, -0.5),
            "top": new THREE.Quaternion(0, 0, 0, 1),
            "bottom": new THREE.Quaternion(1, 0, 0, 0),
            "front": new THREE.Quaternion(-Math.sqrt(2) / 2, 0, 0, Math.sqrt(2) / 2),
            "back": new THREE.Quaternion(0.5, -0.5, 0.5, 0.5),
        }

        this.startPosition = new THREE.Vector3(x, y, z);
        this.upFace = "";
        this.upToken = false; //true or false

        this.godFavorWeaponMarks = []
        this.isGodFavorWeaponValid = false;

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setDiceFaces(faceInfo)
        this.setMesh(x, y, z)
        this.setDebug()

    }


    setGeometry() {
        this.geometry = this.experience.curvedCube.geometry;
    }

    setTextures() {
        this.textures = [];
        this.textures.push(this.resources.items.diceArrowTexture);
        this.textures.push(this.resources.items.diceAxeTexture);
        this.textures.push(this.resources.items.diceHelmetTexture);
        this.textures.push(this.resources.items.diceShieldTexture);
        this.textures.push(this.resources.items.diceGodFavorTexture);
        this.textures.push(this.resources.items.diceStealTexture);

        // console.log(this.textures);        
        this.textures.forEach(texture_ => {
            texture_.encoding = THREE.sRGBEncoding;
        })

        let textureName = ["textureArm", "textureDiffuse", "textureNormal"]
        this.textureDiffuse = this.resources.items.leather_white_diff
        this.textureArm = this.resources.items.leather_white_arm
        this.textureNormal = this.resources.items.leather_white_nor

        textureName.forEach(texture => {
            this[`${texture}`].encoding = THREE.sRGBEncoding;
            this[`${texture}`].repeat.set(0.1, 0.1);
            this[`${texture}`].wrapS = THREE.RepeatWrapping
            this[`${texture}`].wrapT = THREE.RepeatWrapping
            // this[`${texture}`].anisotropy = 16;

            // this.axemark.encoding = THREE.sRGBEncoding;


        })

    }

    setMaterial() {
        this.materials = [
            new THREE.MeshStandardMaterial({ map: this.textures[0] }),
            new THREE.MeshStandardMaterial({ map: this.textures[1] }),
            new THREE.MeshStandardMaterial({ map: this.textures[2] }),
            new THREE.MeshStandardMaterial({ map: this.textures[3] }),
            new THREE.MeshStandardMaterial({ map: this.textures[4] }),
            new THREE.MeshStandardMaterial({ map: this.textures[5] }),
        ];

        this.material = new THREE.MeshStandardMaterial({
            map: this.textureDiffuse,
            // normalMap: this.textureNormal,
            metalnessMap: this.textureArm,
            roughnessMap: this.textureArm,
            aoMap: this.textureArm,
            // wireframe : true
            // normalScale : new THREE.Vector2(0.3, 0.3)
        })

        this.material.flatshading = false;

    }


    /*
    faceInfo = {
      right : {weapon : "axe", token : true}
      ...
    }
    */
    setDiceFaces(faceInfo) {
        Object.keys(faceInfo).forEach(faceDir => {
            this.diceFaces[`${faceDir}`] = new DiceFace(faceInfo[`${faceDir}`], this.symbolsNormal[`${faceDir}`])

        })
        // console.log(this.diceFaces)
    }

    clicked() {
        this.experience.game.playerController[`${this.owner}`].diceClicked(this);
    }

    setMesh(x, y, z) {
        this.dice = new THREE.Mesh(this.geometry, this.material)

        // this.mesh.rotation.x = - Math.PI * 0.5
        this.dice.receiveShadow = true;
        this.dice.castShadow = true;

        this.mesh = new THREE.Group()
        this.mesh.add(this.dice)

        Object.keys(this.diceFaces).forEach(faceDir => {
            let face = this.diceFaces[`${faceDir}`]
            this.mesh.add(...face.weaponMeshes)
            if (face.isToken == true)
                this.mesh.add(face.tokenMesh)
        })


        this.scene.add(this.mesh)


        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;

    }


    active() {
        if (this.debug.active)
            this.debugFolder.show();
    }

    deactive() {
        if (this.debug.active)
            this.debugFolder.hide();
    }


    moveTo(height, pos) {
        let animationDuration = 0.8
        let animationDelay = 0.1

        gsap.to(this.mesh.position, { duration: animationDuration, ease: "none", delay: animationDelay, x: pos.x, z: pos.z })

        gsap.timeline({ defaults: { duration: animationDuration / 2.0 } })
            .to(this.mesh.position, { ease: "sine.out", delay: 0.1, y: height })
            .to(this.mesh.position, { ease: "sine.in", y: 0.5 })
    }

    retrieve() {
        // this.mesh.position.copy(this.startPosition)

        if (this.state !== "tray") {
            console.log(`error : ${this.state} 상태의 주사위를 되돌리려 함`)
            return false;
        }

        gsap.to(this.mesh.position, { duration: 0.3, delay: 0.2, y: this.startPosition.y, z: this.startPosition.z })

        return true;
    }


    roll(nPosition, nFace, nRotation) {
        if (this.state !== "tray") {
            console.log(`error : ${this.state} 상태의 주사위를 굴리려 함`)
            return false;
        }

        this.upFace = nFace

        this.weapon = this.diceFaces[`${this.upFace}`].weaponType
        this.upToken = this.diceFaces[`${this.upFace}`].isToken

        this.positionInTray.x = nPosition.x;
        this.positionInTray.y = nPosition.y;
        this.positionInTray.z = nPosition.z;

        this.setUpFace(nFace);
        this.mesh.rotateOnWorldAxis(this.scene.up, nRotation)

        this.mesh.position.x = nPosition.x;
        gsap.to(this.mesh.position, { duration: 0.1, ease: "none", delay: 0.2, x: nPosition.x, z: nPosition.z, y: nPosition.y, })

        let diffRotationY = this.mesh.rotation.y - 0.3;
        let diffRotationX = this.mesh.rotation.x - 0.3;
        let diffRotationZ = this.mesh.rotation.z - 0.3;

        gsap.from(this.mesh.rotation, { duration: 0.3, ease: "elastic.out(0.4, 0.4)", delay: 0.25, x: diffRotationX, y: diffRotationY, z: diffRotationZ })
        return true;
    }


    setCommonRotation() {
        let toQuaternion = new THREE.Quaternion();
        this.mesh.quaternion.copy(this.upFaceQuaternion[`${this.getCurrentUpFace()}`]);
    }

    choose(nPosition, chosenIndex) {
        if (this.state !== "tray") {
            console.log(`error : cannot retrieve the ${this.state} state dice!`)
            return false;
        }

        nPosition.x += Math.random() * 0.15;
        nPosition.z += Math.random() * 0.15;

        let toQuaternion = new THREE.Quaternion();
        toQuaternion.copy(this.upFaceQuaternion[`${this.getCurrentUpFace()}`]);

        let tmpObj = new THREE.Object3D;
        tmpObj.applyQuaternion(toQuaternion);
        let randomAngle = (Math.random() - 0.5) * (Math.PI / 4.5);
        // console.log(randomAngle);
        tmpObj.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), randomAngle);
        toQuaternion.copy(tmpObj.quaternion.clone());

        this.state = 'chosen'
        this.watingIndex = chosenIndex;

        let animationDuration = 0.3
        let animationDelay = 0.05
        gsap.to(this.mesh.position, { duration: animationDuration, ease: "none", delay: animationDelay, x: nPosition.x, z: nPosition.z })

        gsap.timeline({ defaults: { duration: animationDuration / 2.0 } })
            .to(this.mesh.position, { ease: "sine.out", delay: animationDelay, y: 4.0 })
            .to(this.mesh.position, { ease: "sine.in", y: nPosition.y + 0.5 })

        let quaternionTween = gsap.to(this.mesh.quaternion, { duration: animationDuration, ease: "none", delay: animationDelay })
        quaternionTween.eventCallback("onUpdate", () => this.mesh.quaternion.slerp(toQuaternion, quaternionTween.time() / animationDuration));

        return true;
    }

    // 우측 대기소의 주사위를 다시 tray로 옮긴다.
    cancle() {
        if (this.state !== "chosen") {
            console.log(`error : ${this.state} 상태의 주사위를 tray로 되돌리려 함`)
            return false;
        }

        this.state = "tray"

        let animationDuration = 0.4
        let animationDelay = 0.1

        gsap.to(this.mesh.position, { duration: animationDuration, ease: "none", delay: animationDelay, x: this.positionInTray.x, z: this.positionInTray.z })

        gsap.timeline({ defaults: { duration: animationDuration / 2.0 } })
            .to(this.mesh.position, { ease: "sine.out", delay: 0.1, y: 6.0 })
            .to(this.mesh.position, { ease: "sine.in", y: 0.5 })

        return true;
    }


    wait(anchor, waitingIndex) {
        if (this.state !== "chosen") {
            console.log(`error : ${this.state} 상태의 주사위를 전투 대기열로 보내려 함`)
            return false;
        }

        let nPosition = new THREE.Vector3();
        nPosition.copy(anchor);
        nPosition.x += (waitingIndex * 1.3);

        this.state = "wait"

        let animationDuration = 0.4
        let animationDelay = 0.1

        gsap.to(this.mesh.position, { duration: animationDuration, ease: "none", delay: animationDelay, x: nPosition.x, z: nPosition.z })

        gsap.timeline({ defaults: { duration: animationDuration / 2.0 } })
            .to(this.mesh.position, { ease: "sine.out", delay: 0.1, y: 6.0 })
            .to(this.mesh.position, { ease: "sine.in", y: 0.5 })

        return true;
    }

    setUpFace(key) {
        let newRotation = this.upFaceRotation[`${key}`];
        this.mesh.rotation.setFromVector3(newRotation, 'XYZ');
    }

    lightOnFaceWeaponMark() {
        // console.log(this.faceWeaponMarks)
        let currentWeaponMark = this.faceWeaponMarks[`${this.upFace}`]
        // console.log(currentWeaponMark)

        let anim = gsap.timeline({ defaults: { duration: 0.7 } })

        anim.eventCallback("onStart", this.MeshBloomToggle, [currentWeaponMark])
        anim.eventCallback("onComplete", this.MeshBloomToggle, [currentWeaponMark])

        anim.to(currentWeaponMark.material.color, { r: 1, g: 1, b: 0 })
        anim.to(currentWeaponMark.material.color, { delay: 0.7, r: 0, g: 0, b: 0 })
    }

    getTopFaceInstance() {
        let ret = []
        if (this.isGodFavorWeaponValid) {
            // ret.push(this.faceWeaponMarks[`${this.upFace}`])
            ret.push(...this.godFavorWeaponMarks)
            // console.log("this is god power!")

        }
        else {
            // ret.push(this.faceWeaponMarks[`${this.upFace}`])
            ret.push(...this.diceFaces[`${this.upFace}`].weaponMeshes)
        }

        return ret;
    }

    DebugsetUpFace() {
        this.setUpFace(this.upFace)
    }


    getCurrentUpFace() {
        let rotationMat = new THREE.Matrix3();
        rotationMat.setFromMatrix4(this.mesh.matrix);
        rotationMat.invert();
        let normalDir_World = new THREE.Vector3(0, 1, 0);
        let normalDir_Local = normalDir_World.applyMatrix3(rotationMat);
        // console.log(normalDir_Local);

        /*
        + x  (1, 0, 0) : arrow
        - x  (-1, 0, 0) : axe
        + y  (0, 1, 0) : helmet
        - y  (0, -1, 0) : shield
        + z  (0, 0, 1) : favor
        - z  (0, 0, -1) : steal
        */

        let minAngle = 9999;
        let topFace = "";
        Object.keys(this.symbolsNormal).forEach(key => {
            const cAngle = normalDir_Local.angleTo(this.symbolsNormal[`${key}`])
            if (cAngle < minAngle) {
                minAngle = cAngle;
                topFace = key;
            }

        })

        return topFace;

    }

    axisToggle() {
        this.axeHelper.visible = !this.axeHelper.visible;
    }


    debugPrintQuaternion() {
        console.log(this.mesh.quaternion);
    }

    // for debug
    testChoise() {
        this.experience.game.playerController[`${this.owner}`].chooseDice(this);
    }

    testCancle() {
        this.experience.game.playerController[`${this.owner}`].cancleDice(this);
    }

    _DEBUG_roundReset(anchor, index, sign) {
        this.state = "tray";

        let nPosition = new THREE.Vector3();
        nPosition.copy(anchor);

        nPosition.x += (index * 1.3 * sign);

        let animationDuration = 0.4
        let animationDelay = 0.1

        gsap.to(this.mesh.position, { duration: animationDuration, ease: "none", delay: animationDelay, x: nPosition.x, z: nPosition.z })

        gsap.timeline({ defaults: { duration: animationDuration / 2.0 } })
            .to(this.mesh.position, { ease: "sine.out", delay: 0.1, y: 6.0 })
            .to(this.mesh.position, { ease: "sine.in", y: 0.5 })


    }

    _DEBUG_printUpFace() {
        console.log(this.upFace)
    }

    _DBG_colorLightOn(color_) {
        // console.log(this.faceWeaponMarks[`${this.upFace}`])
        this.faceWeaponMarks[`${this.upFace}`].material.color.set(color_)
    }

    setDebug() {
        if (this.debug.active) {
            // console.log(this.mesh);
            this.axeHelper = new THREE.AxesHelper(3);
            this.mesh.add(this.axeHelper);
            this.axeHelper.visible = false;


            this.debugFolder = this.debug.ui.addFolder(`dice ${this.mesh.id}`);

            this.debugFolder
                .add(this, 'upFace', {
                    "+x : arrow": () => { this.setUpFace("arrow") },
                    "-x : axe": () => { this.setUpFace("axe") },
                    "+y : helmet": () => { this.setUpFace("helmet") },
                    "-y : shield": () => { this.setUpFace("shield") },
                    "+z : favor": () => { this.setUpFace("favor") },
                    "-z : steal": () => { this.setUpFace("steal") }
                })
                .onChange((func) => {
                    func();
                })

            this.debugFolder
                .add(this, "DebugsetUpFace");

            this.debugFolder
                .addColor(this.material, "color");


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

            this.debugFolder
                .add(this, "axisToggle");


            this.debugFolder
                .add(this, "getCurrentUpFace");

            this.debugFolder
                .add(this, "testChoise");

            this.debugFolder
                .add(this, "testCancle");

            this.debugFolder
                .add(this, "debugPrintQuaternion");

            this.debugFolder
                .add(this, "_DEBUG_printUpFace")

            this.debugFolder
                .add(this, "lightOnFaceWeaponMark")


            this.debugFolder.hide();

        }

    }



}