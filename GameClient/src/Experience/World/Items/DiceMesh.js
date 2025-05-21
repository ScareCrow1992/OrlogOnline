import * as THREE from 'three'
import Experience from '../../Experience.js'
import DiceFace from './DiceFace.js'
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
// import CANNON from 'cannon'


export default class DiceMesh {
    constructor(faceInfo, diceType) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry

        this.soundManager = this.experience.sound
        // this.sounds_set = {
            // "light" : {},
            // "medium" : {},
            // "heavy" : {},
        // }
        // this.soundManager.AddSoundBuffer_Dice("dice_roll", this.sounds_set["light"], 0.2)
        // this.soundManager.AddSoundBuffer_Dice("dice_roll", this.sounds_set["medium"], 0.4)
        // this.soundManager.AddSoundBuffer_Dice("dice_roll", this.sounds_set["heavy"], 1.0)
        
        this.diceType = diceType    // "weapon" or "token"

        this.setData();
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setDiceFaces(faceInfo)
        this.setMesh();

        this.up = this.getUpVector();

        // this.anim = gsap.timeline()
        this.org_color = new THREE.Color(0xffffff)

        if(this.diceType === "token")
            this.org_color.setRGB(0.02, 0.02, 0.02)
    

        this.resetDiceMaterialColor()



        this.canPlayAnimation = false;
        this.transformLog;
        this.rollAnimationFrame;
        this.rollAccumulatedTime
        this.rotationMatrix = null;

        this.landing = false


        let vecA = new THREE.Vector3(1,0,0)
        let vecB = new THREE.Vector3(-1,0,0)
        vecA.cross(vecB)
        // console.log(vecA)
        // console.log(vecA.length())

        
        // window.addEventListener("keydown", (event) =>{
        //     if(event.key == 'f'){

        //         this.CalculateRotationMatrix("right", this.transformLog)
        //         this.mesh.applyMatrix4(this.rotMat)

        //     }
        // })

    }


    GameOver(){
        Object.keys(this.diceFaces).forEach(key =>{
            this.diceFaces[key].GameOver()
        })
    }


    setData(){
        this.state = "tray" //"tray", "chosen", "wating"

        this.positionInTray = {}    // Vector3 (for undo)

        this.directories = ["right", "left", "top", "bottom", "front", "back"]

        this.faceNormals = {
            "right": new THREE.Vector3(1, 0, 0),
            "left": new THREE.Vector3(-1, 0, 0),
            "top": new THREE.Vector3(0, 1, 0),
            "bottom": new THREE.Vector3(0, -1, 0),
            "front": new THREE.Vector3(0, 0, 1),
            "back": new THREE.Vector3(0, 0, -1),
        }


        // 윗면을 바르게 보기 위한 rotation 회전값
        this.upFaceRotation = {
            "right": new THREE.Euler(0, -Math.PI / 2, Math.PI / 2, 'XYZ'),
            "left": new THREE.Euler(Math.PI, Math.PI / 2, Math.PI / 2, 'XYZ'),
            "top": new THREE.Euler(0, 0, 0, 'XYZ'),
            "bottom": new THREE.Euler(Math.PI, 0, 0, 'XYZ'),
            "front": new THREE.Euler(-Math.PI / 2, 0, 0, 'XYZ'),
            "back": new THREE.Euler(Math.PI / 2, 0, Math.PI / 2, 'XYZ'),
        }


        // 특정 face를 윗면으로 만들기 위한 quaternion
        this.faceQuaternion={
            "right": new THREE.Quaternion(-0.5, -0.5, 0.5, 0.5),
            "left": new THREE.Quaternion(0.5, -0.5, 0.5, -0.5),
            "top": new THREE.Quaternion(0, 0, 0, 1),
            "bottom": new THREE.Quaternion(1, 0, 0, 0),
            "front": new THREE.Quaternion(-Math.sqrt(2) / 2, 0, 0, Math.sqrt(2) / 2),
            "back": new THREE.Quaternion(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0),
        }

        this.diceFaces={} //{ right : new DiceFace() ...}

    }
    
    setGeometry() {
        // this.diceType = "token"
        switch(this.diceType){
            case "weapon":
                this.geometry = new RoundedBoxGeometry( 0.99, 0.99, 0.99, 16, 0.15 );
                break;

            case "token":
                // this.geometry = new 
                this.geometry = this.geometryManager.getGeometry("spheredCube")
                break;
        }

        // console.log(this.geometryManager.getGeometry("spheredCube"))

        // this.geometry = this.experience.curvedCube.geometry;
        // this.geometry = new RoundedBoxGeometry( 0.99, 0.99, 0.99, 16, 0.15 );
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
        })
    }



    setMaterial() {
        // this.materials = [
        //     new THREE.MeshStandardMaterial({ map: this.textures[0] }),
        //     new THREE.MeshStandardMaterial({ map: this.textures[1] }),
        //     new THREE.MeshStandardMaterial({ map: this.textures[2] }),
        //     new THREE.MeshStandardMaterial({ map: this.textures[3] }),
        //     new THREE.MeshStandardMaterial({ map: this.textures[4] }),
        //     new THREE.MeshStandardMaterial({ map: this.textures[5] }),
        // ];

        this.material = new THREE.MeshStandardMaterial({
            map: this.textureDiffuse,
            // normalMap: this.textureNormal,
            metalnessMap: this.textureArm,
            roughnessMap: this.textureArm,
            aoMap: this.textureArm,
            envMapIntensity : 1.5,
            roughness : 0.3,
            metalness : 0.7
            // wireframe : true
            // normalScale : new THREE.Vector2(0.3, 0.3)
        })

        this.material.flatshading = false;


    }


    setDiceFaces(faceInfo) {
        // console.log(faceInfo)
        Object.keys(faceInfo).forEach(faceDir => {
            this.diceFaces[`${faceDir}`] = new DiceFace(faceInfo[`${faceDir}`], this.faceNormals[`${faceDir}`])

        })
        // console.log(this.diceFaces)
    }



    setMesh() {
        this.dice = new THREE.Mesh(this.geometry, this.material)

        // this.mesh.rotation.x = - Math.PI * 0.5
        this.dice.receiveShadow = true;
        this.dice.castShadow = true;


        this.mesh = new THREE.Group()
        this.mesh.add(this.dice)

        Object.keys(this.diceFaces).forEach(faceDir => {
            let face = this.diceFaces[`${faceDir}`]
            this.mesh.add(face.obj)
            if (face.isToken == true)
                this.mesh.add(face.tokenMesh)
        })


        
        this.scene.add(this.mesh)
    }

    getMarks(){
        return [...this.diceFaces[`${this.up}`].getMarks()]
    }

    getObjectUpDir(obj){
        let rotationMat = new THREE.Matrix3();
        rotationMat.setFromMatrix4(obj.matrix);
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
        Object.keys(this.faceNormals).forEach(key => {
            const cAngle = normalDir_Local.angleTo(this.faceNormals[`${key}`])
            if (cAngle < minAngle) {
                minAngle = cAngle;
                topFace = key;
            }

        })

        console.log(topFace)
        return topFace;


    }




    setPosition(pos){
        this.mesh.position.copy(pos)
    }


    setPositionX(x){
        this.mesh.position.x = x
    }


    // dir이 윗면이 되도록 회전
    // dir = "top", "bottom", "left" ...
    setRotationForUp(dir){
        // this.up = dir;
        // console.log(`${this.getCurrentUpFace()}`)
        // this.mesh.quaternion.copy(this.faceQuaternion[`${this.getCurrentUpFace()}`]);

        this.up = dir;
        
        let newQuaternion = this.faceQuaternion[`${dir}`];
        this.mesh.quaternion.copy(newQuaternion);
        // console.log(`${this.getCurrentUpFace()}`)

    }


    rotateOnWorldAxis(axis, rotation){
        this.mesh.rotateOnWorldAxis(axis, rotation);

    }


    getUpFace(){
        // 현재 mesh 회전 상태에서 윗면 방향을 알아낸다.
        // 별로 안 쓸 예정
        return this.diceFaces[`${this.up}`]

    }

    getWeapon(){
        return this.diceFaces[`${this.up}`].weaponType
    }

    getPosition(){
        return this.mesh.position
    }

    getFaces(){
        return this.diceFaces
    }

    getUpFace(){
        return this.diceFaces[`${this.up}`]
    }

    Highlighting_Mark(color, duration){
        return this.getUpFace().Highlighting_Mark(color, duration)
    }

    ConvertDiceMark(cnt, weaponName, color, transforms){
        // console.log(this.getUpFace())
        return this.getUpFace().ConvertToGodfavorMarks(cnt, weaponName, color, transforms)
    }


    DecreaseDiceMark(cnt, color) {
        return this.getUpFace().DecreaseDiceMark(cnt, color)
    }


    WeaponDecrease(cnt){
        this.getUpFace().WeaponDecrease(cnt)
    }

    getUpVector() {
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
        Object.keys(this.faceNormals).forEach(key => {
            const cAngle = normalDir_Local.angleTo(this.faceNormals[`${key}`])
            if (cAngle < minAngle) {
                minAngle = cAngle;
                topFace = key;
            }

        })

        // console.log(topFace)
        return topFace;

    }

    
    TokenMark_Hightlight_On(){
        this.getUpFace().TokenMark_Hightlight_On()

    }


    
    TokenMark_Hightlight_Off(){
        this.getUpFace().TokenMark_Hightlight_Off()
    }




    getUpDir(){
        return this.up
    }

    isToken(){
        return this.diceFaces[`${this.up}`].isToken
    }

    getID(){
        return this.dice.id
    }


    _DBG_setFaceColor(){
        // console.log(this.getUpFace())
        
        this.directories.forEach((dir, index) => {
            let diceFace = this.diceFaces[`${dir}`]
            let hue = index / 6
            let color = new THREE.Color()
            color.setHSL(hue, 1, 0.5)
            diceFace._DBG_setFaceColor(color)
        })

    }

    _DBG_resetFaceColor(){
        this.directories.forEach((dir, index) => {
            let diceFace = this.diceFaces[`${dir}`]
            // console.log(diceFace)
            let color = new THREE.Color()
            color.setHSL(0, 0, 0)
            diceFace._DBG_setFaceColor(color)
        })
        
    }


    StopAnimation(){
        this.canPlayAnimation = false;
    }

    setDiceMaterialColor(color){
        this.dice.material.color.copy(color)
    }

    resetDiceMaterialColor(){
        this.dice.material.color.copy(this.org_color)
    }
    

    fly(pos, duration,height, delay = 0){
        this.StopAnimation()
        // this.anim.add(
        //     gsap.to(this.mesh.position, {duration: duration, ease:"Power1.easeInOut", x : pos.x, z:pos.z}))

        let anim = gsap.timeline()

        anim.add(
            gsap.to(this.mesh.position, {
                delay: delay, duration: duration, ease: "none", x: pos.x, y: pos.y, z: pos.z,
                onStart: () => { this.experience.sound.Play_DiceMove() }
            }))

        anim.add(
            gsap.timeline({ defaults: { duration: duration / 2.0 } })
                .to(this.mesh.position, { ease: "sine.out", y: height })
                .to(this.mesh.position, { ease: "sine.in", y: pos.y }), "<")

        let normalQuaternion = this.faceQuaternion[`${this.up}`]
        let dummy = new THREE.Object3D()
        dummy.quaternion.copy(normalQuaternion);
        dummy.rotateOnWorldAxis(new THREE.Vector3(0,1,0), (Math.random() - 0.5) * (2/3));
        // console.log(dummy.quaternion)
        anim.add(gsap.timeline({ defaults: { duration: duration } })
            .to(this.mesh.rotation, { ease: "none", x: dummy.rotation.x, y: dummy.rotation.y, z: dummy.rotation.z }), "<")

        return anim
    }


    Move(pos, duration){
        this.StopAnimation()
        let delay = Math.random() / 3.5
        gsap.to(this.mesh.position, {duration: duration, delay: delay, ease: "none", x : this.mesh.position.x, y : pos.y, z : pos.z})

    }


    // transformLog의 마지막 프레임을 안정화 시킨다
    StableTheLastFrame(dir, transformLog){

    }


    CalculateRotationMatrix(dir, transformLog){
        let body = transformLog[transformLog.length - 1]

        let supposedDir = this.faceNormals[`${dir}`].clone()

        // let dummy = new THREE.Object3D()
        // dummy.quaternion.copy(body.quaternion)
        // dummy.position.copy(body.position)
        // dummy.updateMatrix()


        this.mesh.quaternion.copy(body.quaternion)
        this.mesh.position.copy(body.position)
        this.mesh.updateMatrix()

        let objectRotMat = new THREE.Matrix3();
        objectRotMat.setFromMatrix4(this.mesh.matrix)

        let upVector = new THREE.Vector3(0,1,0)
        // upVector.copy(upVectorLocal)
        // upVector.applyMatrix3(objectRotMat)
        // upVector.normalize()
        // upVector.set(0, 1, 0)
        
        // console.log(upVector)

        let supposedDirGlobal = supposedDir.applyMatrix3(objectRotMat)
        this.angleBetween = supposedDirGlobal.angleTo(upVector)

        this.rotationAxisGlobal = supposedDirGlobal.clone()
        this.rotationAxisGlobal.cross(upVector)
        this.rotationAxisGlobal.normalize()

        let rotationMatrix = new THREE.Matrix4()
        rotationMatrix.makeRotationAxis(this.rotationAxisGlobal, this.angleBetween)
        return rotationMatrix;

        // let positionMatrix = new THREE.Matrix4()
        // positionMatrix.setPosition(body.position.x, body.position.y, body.position.z)

        // let positionMatrixInverse = positionMatrix.clone()
        // positionMatrixInverse.invert()

        // positionMatrix.multiply(rotationMatrix)
        // positionMatrix.multiply(positionMatrixInverse)

        // this.rotMat = positionMatrix;

    }




    GetLastUpDir(transformLog){
        let body = transformLog[transformLog.length - 1]

        this.mesh.quaternion.copy(body.quaternion)
        this.mesh.position.copy(body.position)
        this.mesh.updateMatrix()

        return this.getUpVector()

    }



    Withdraw(diceStartAnchor){
        this.experience.sound.Play_DiceTake()
        this.Move(diceStartAnchor, 0.3)
    }


    Roll(dir, transformLog, diceStartAnchor) {
        let duration = 0.3
        let anim = gsap.timeline()
            .to(this, { duration: duration * 2.2, onStart: () => { this.Withdraw(diceStartAnchor) } })
            .to(this, { onStart: () => { this.Roll_(dir, transformLog) } })

        let ret = gsap.timeline()
        ret.add(gsap.to(this, { duration: duration * 2.2 + 1.2 }))

        this.landing = false

        // this.anim.then((resolve)=>{console.log(resolve)})
        return ret
    }


    Roll_(dir, transformLog){
        // dir = "right"

        this.up = dir;
        this.fromDir = this.faceNormals[`${dir}`].clone()
        this.toDir = this.faceNormals[`${this.GetLastUpDir(transformLog)}`].clone()
        // this.toDir = GetLastUpDir(transformLog)
        
        this.transformLog = transformLog

        // console.log(this.transformLog)
        // this.rotationMatrix = this.CalculateRotationMatrix(dir, transformLog)

        this.canPlayAnimation = true;

        this.rollAnimationFrame = 0;
        this.rollAccumulatedTime = 0;
    }





    // roll animation이 끝난 후의 마지막 상태를 안정화 시킨다.
    SetStableAfterRoll(){


        let up = new THREE.Vector3(0,1,0)
        let dir = this.faceNormals[`${this.up}`].clone()
        // console.log(dir)
        
        
        let rotation = new THREE.Matrix3()
        this.mesh.updateMatrix()
        rotation.setFromMatrix4(this.mesh.matrix)
        dir.applyMatrix3(rotation)

        if(dir.y > 0.9)
            return;

        let angle = dir.angleTo(up)
        dir.cross(up)
        // console.log(angle)

        let dummy = new THREE.Object3D()
        dummy.position.copy(this.mesh.position)
        dummy.quaternion.copy(this.mesh.quaternion)
        dummy.rotateOnWorldAxis(dir, angle)

        // this.anim.add()
        gsap.to(this, {duration: 0.15, ease:"none", onUpdate: ()=>{
            this.mesh.quaternion.slerp(dummy.quaternion, 0.25)
        }})
        gsap.to(this.mesh.position, {duration: 0.15, ease:"none", y : 0.499999})



    }



    // animMove(pos, duration = 0, delay = 0){
    //     this.anim.to(this.mesh.position, {duration : duration, delay : delay, x : pos.x, y : pos.y, z : pos.z});

    //     let normalRotation = this.upFaceRotation[`${this.up}`]
    //     this.mesh.rotation.copy(normalRotation)

    // }

    Disappear(){
        this.isDisappeared = true
        Object.keys(this.diceFaces).forEach(faceDir => {
            let face = this.diceFaces[`${faceDir}`]
            face.Disappear()
            this.mesh.remove(face.obj)
        })

        // this.materials.forEach(material=>{
        //     material.dispose()
        // })

        this.scene.remove(this.mesh)
    }



    update(deltaTime){
        if(this.canPlayAnimation == true){
            
            let current_frame = Math.floor(this.rollAccumulatedTime / 7)
            let transformInfo = this.transformLog[current_frame]


            this.mesh.position.copy(transformInfo.position)
            this.mesh.quaternion.copy(transformInfo.quaternion)
            this.mesh.updateMatrix()

            // if(current_frame + 15 < this.transformLog.length){
            //     let impact_ = this.transformLog[current_frame + 15].impact
            //     if(impact_ > 5.0){
            //         this.sounds_set["heavy"].sound_play()
            //     }
            //     else if(impact_ > 3.0){
            //         this.sounds_set["medium"].sound_play()
            //     }
            //     else if(impact_ > 0.5){
            //         this.sounds_set["light"].sound_play()
            //     }

            // }

            let fromDir = this.fromDir.clone()
            let toDir = this.toDir.clone()
            
            let rotationMatrix = new THREE.Matrix3()
            rotationMatrix.setFromMatrix4(this.mesh.matrix)


            let fromDirGlobal = fromDir.clone()
            let toDirGlobal = toDir.clone()

            fromDirGlobal.applyMatrix3(rotationMatrix)
            toDirGlobal.applyMatrix3(rotationMatrix)

            let angleBetween = fromDirGlobal.angleTo(toDirGlobal)
            let rotationAxis = fromDirGlobal.cross(toDirGlobal)

            
            if(rotationAxis.length() < 0.001){
                let fromDir_ = new THREE.Vector3()
                fromDir_.set(toDir.y, toDir.z, toDir.x)
                let fromDirGlobal_ = fromDir_.clone()
                fromDirGlobal_.applyMatrix3(rotationMatrix)

                rotationAxis = fromDirGlobal_.cross(toDirGlobal)

            }

            if(current_frame > 78 && current_frame < 120){
                this.experience.sound.Play_GroupRoll()
                
            }


            // if(this.mesh.position.y < 0.5 && this.landing == false){
            //     console.log(current_frame)
            //     this.landing = true
            //     console.log("landing!")
            //     if(current_frame > 190)
            //         this.sounds_set["light"].sound_play()
            // }


            // if(angleBetween > 3.14){
            //     console.log(rotationAxis)
            //     console.log(rotationAxis.length())
            //     console.log(fromDir)
            //     console.log(toDir)
            // }

            // if(rotationAxis.length() < 0.001){
            //     console.log("zero~~")
            // }

            this.mesh.rotateOnWorldAxis(rotationAxis, angleBetween)






            // let pos = new THREE.Vector3()
            // pos.copy(transfromInfo.position)

            // let positionMatrix = new THREE.Matrix4()
            // positionMatrix.setPosition(this.mesh.position)

            // let positionMatrixInverse = new THREE.Matrix4()
            // positionMatrixInverse.setPosition(this.mesh.position)
            // positionMatrixInverse.invert()

            // positionMatrix.multiply(this.rotationMatrix)
            // positionMatrix.multiply(positionMatrixInverse)

            // // this.mesh.applyMatrix4(positionMatrix)
            // // this.mesh.updateMatrix()
            // this.mesh.rotateOnWorldAxis(this.rotationAxisGlobal, this.angleBetween)


            
            this.rollAccumulatedTime += deltaTime;
            this.rollAnimationFrame = Math.floor(this.rollAccumulatedTime / 7);
            this.rollAnimationFrame = Math.min(this.rollAnimationFrame, 268)

            if(this.rollAnimationFrame >= this.transformLog.length - 5){
                this.canPlayAnimation = false;
                // this.SetStableAfterRoll()
            }
        }

    }

}