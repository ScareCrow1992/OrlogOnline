import * as THREE from 'three'
import Experience from '../../Experience.js'
import gsap from 'gsap';
import DiceMark from './DiceMark.js'


// 주인이 누구인지, 자신이 god favor 능력 연관인지, 어느 면에 있는지 등은 전혀 관여하지 않는다.
/*
faceInfo = {
    right : {weapon : "axe", token : true}
    ...
    }
*/

    
// let uOffset = {value : 0.46}
// let uWeight = {value : 1.41}
// let uRed = {value : 0.23}


        
// window.addEventListener("keydown", (event)=>{
//     if(event.key === "q"){
//         uRed.value -= 0.01
//     }
//     if(event.key === "w"){
//         uRed.value += 0.01
//     }
    
//     if(event.key === "a"){
//         uWeight.value -= 0.01
//     }
//     if(event.key === "s"){
//         uWeight.value += 0.01
//     }

//     if(event.key === "e"){
//         console.log(uRed.value, uWeight. value)
//     }
// })





function GetIncreasedMarksTransform(cnt) {
    const gap = 0.1
    let transforms = []
    const center = (cnt - 1) * gap / 2
    for (let index = 0; index < cnt; index++) {
        let dummy = new THREE.Object3D()
        let pos = -center + index * gap
        // console.log(pos)
        // dummy.position.set(pos, -pos, 0.05)
        dummy.translateX(pos)
        dummy.translateY(-pos)
        dummy.updateMatrix()
        transforms.push(dummy.matrix.clone())
        // console.log(dummy.position)
    }
    // console.log(transforms)
    return transforms
}



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

        this.itemPrefab;    // new Weapon()
        // instance of this.weaponPrefab
        this.weaponType = faceInfo.weapon;    // "arrow", "axe", "shield", "steal", "token" ...
        // this.isToken;   // true, false

        this.isToken = faceInfo.token;

        this.weaponMeshes = []
        this.tokenMesh = null
        this.faceDir = faceDir

        this.setDiceMark(faceInfo, faceDir)
        if (this.isToken == true)
            this.setTokenMesh()


        this.diceMark;
        this.godFavorDiceMarks = []
        this.isGodFavorOn = false
    }

    get position(){
        return this.obj.position
    }

    GameOver(){
        this.TokenMark_Hightlight_Off()
        this.diceMark.GameOver()
    }

    setDiceMark(faceInfo, faceDir) {
        this.obj = new THREE.Object3D()
        this.obj.lookAt(this.faceDir)
        this.obj.position.copy(this.faceDir)
        this.obj.position.multiplyScalar(0.5)

        this.diceMark = new DiceMark(faceInfo.weapon);
        this.obj.add(this.diceMark.weaponMark)
        


        // let newMark = new THREE.Mesh(new THREE.PlaneGeometry(), this.materialManager.items[`${this.weaponType}Mark`].clone())
        // newMark.lookAt(this.faceDir)
        // newMark.position.copy(this.faceDir)
        // // newMark.scale.set(1.4, 1.4, 1.4);
        // newMark.position.multiplyScalar(0.5)

        // this.weaponMeshes.push(newMark)
    }


    setTokenMesh() {
        let newToken;
        newToken = new THREE.Mesh(new THREE.PlaneGeometry(), this.materialManager.items[`tokenMark`].clone())



        newToken.material.onBeforeCompile = (shader) => {
            // shader.uniforms.uOffset = uOffset
            // shader.uniforms.uWeight = uWeight
            // shader.uniforms.uRed = uRed

            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `
                #include <common>
                varying vec4 vPoint;
                float uOffset = 0.46;
                float uWeight = 1.41;
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `
                #include <begin_vertex>
                vPoint = modelViewMatrix * vec4(position, 1.0);
                vPoint.x -= modelViewMatrix[3][0];
                vPoint.y -= modelViewMatrix[3][1];
                vPoint.z -= modelViewMatrix[3][2];

                vPoint.x *= uWeight;
                vPoint.y *= uWeight;
                vPoint.z *= uWeight;

                vPoint.x += uOffset;
                vPoint.y += uOffset;
                vPoint.z += uOffset;
                `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <common>",
                `#include <common>
                varying vec4 vPoint;

                vec3 yellow_ = vec3(0.9, 0.4, 0.0156);
                vec3 black_ = vec3(0.24, 0.05, 0.000);
                `
            )
            
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <color_fragment>",
                `
                #include <color_fragment>

                float mixf = vPoint.y;
                diffuseColor.xyz = mix(black_, yellow_, mixf);
                `
            )
        }

        newToken.lookAt(this.faceDir)
        newToken.position.copy(this.faceDir)
        newToken.position.multiplyScalar(0.501)
        newToken.scale.set(.90, .90, .90);
        this.tokenMesh = newToken

        // this.tokenMesh.layers.enable(1)
    }

    TokenMark_Hightlight_On(){
        if(this.isToken == true)
            this.tokenMesh.layers.enable(1)

    }


    TokenMark_Hightlight_Off(){
        if(this.isToken == true)
            this.tokenMesh.layers.disable(1)

    }


    getMarks() {
        if (this.isGodFavorOn)
            return this.godFavorDiceMarks
        else
            return [this.diceMark]
    }


    // WeaponDecrease(cnt){
    //     let current_power = undefined


    //     if(this.isGodFavorOn){
    //         current_power = this.godFavorDiceMarks.length - cnt
    //     }
    //     else
    //         current_power = 1

    //     this.ConvertToGodfavorMarks(current_power, this.weaponType, )

    //     // let mark_ = this.getMarks().pop()
    //     // mark_[0].EngravedAnimation()
    // }

    
    Highlighting_Mark(color, duration){
        return this.diceMark.Highlighting_Mark(color, duration)
    }

    DecreaseDiceMark(decreasd_cnt, color){
        console.log(arguments)

        let prom
        if(this.isGodFavorOn == false){
            prom = this.diceMark.DisappearAnimation(color, 1.0)
            this.isGodFavorOn = true
            this.godFavorDiceMarks = []

            return [prom, () => { this.ResetDiceMark() }]
        }
        else{
            let left_cnt = this.godFavorDiceMarks.length - decreasd_cnt

            let transforms_ = GetIncreasedMarksTransform(left_cnt)

            return this.ConvertToGodfavorMarks(
                left_cnt, this.weaponType, color, transforms_
            )
        }

    }


    ConvertToGodfavorMarks(cnt, weaponName, color, transforms){
        if(this.isGodFavorOn == true){
            this.ResetDiceMark()
        }

        this.diceMark.SetPosition(0,0,-0.5)
        
        if(weaponName === null)
            weaponName = this.weaponType


        this.isGodFavorOn = true
        // console.log(cnt)
        // console.log(weaponName)


        // 색상, 무기 모델명
        this.godFavorDiceMarks = []
        let promises = []

        for(let index = 0; index < cnt; index++){
            let godFavorDiceMark = new DiceMark(this.weaponType, color, weaponName);
            this.godFavorDiceMarks.push(godFavorDiceMark)
            this.obj.add(godFavorDiceMark.weaponMark)

            console.log(index, transforms[index])
            godFavorDiceMark.weaponMark.applyMatrix4(transforms[index])

            godFavorDiceMark.weaponMark.material.depthTest = false
            // godFavorDiceMark.weaponMark.layers.toggle(1)
            godFavorDiceMark.weaponMark.renderOrder = 4


            let prom = godFavorDiceMark.EngravedAnimation()
            promises.push(prom)
            // godFavorDiceMark.weaponMark.material.color.set(color)
            // console.log(godFavorDiceMark.weaponMark)

            
        }
        

        let allPromise = Promise.all(promises)

        // let promise = this.diceMark.EngravedAnimation()
        return [allPromise, ()=>{this.ResetDiceMark()}]
        // round reset시 상태를 되돌리는 callback 함수를 반환
    }


    ResetDiceMark(){
        this.isGodFavorOn = false

        this.godFavorDiceMarks.forEach(diceMark=>{
            diceMark.destroy()
            this.obj.remove(diceMark.weaponMark)
        })

        this.diceMark.Reset()


        
        this.godFavorDiceMarks = []
    }


    Disappear(){
        this.ResetDiceMark()
        this.diceMark.destroy();
        this.obj.remove(this.diceMark.weaponMark)
        if(this.tokenMesh != null){
            this.tokenMesh.material.dispose()
            this.obj.remove(this.tokenMesh)
        }
    }


    // summonWeapon(){

    // }

    // attackTo(target){
        
    // }


    // getWeaponType() {
    //     return this.weaponType;
    // }

    // getItem() {

    // }


    _DBG_setFaceColor(color){
        this.diceMark.weaponMark.material.color.copy(color)
        // console.log(color)
        // this.weaponMeshes.forEach(mesh=>{
        //     console.log(color)
        //     mesh.material.color.copy(color)
        // })
    }

}