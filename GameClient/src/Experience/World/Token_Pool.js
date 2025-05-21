import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';



import FadeDisappear from '../Shaders/Materials/FadeDisappear.js';
// import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';

import Token_Effect from './Token_Effect_Pool.js';

const limit_cnt = 50
let mat4 = new THREE.Matrix4()
const color_ = new THREE.Color()
const hide_position = new THREE.Vector3(0, -2, 15)
// const original_color = new THREE.Color("#ffaa04")

function GetTokenPosition(user, index) {
    let sign_ = {
        "top" : -1,
        "bottom" : 1
    }

    const anchorSign = sign_[`${user}`]

    const tokenStackAnchor = new THREE.Vector3(4 * anchorSign, 0, 4 * anchorSign)


    let newTokenSite = new THREE.Vector3(0, 0, 0)
    let cnt = index

    let unit_length = 1.3

    let origin = tokenStackAnchor
    if(anchorSign < 0){
        origin.z += anchorSign * unit_length * 0.5
        origin.x += anchorSign * unit_length * 4
    }

    newTokenSite.z = (unit_length * Math.floor(cnt / 25)) + origin.z

    cnt = Math.floor(cnt % 25)
    newTokenSite.x = unit_length * Math.floor(cnt / 5) + origin.x

    newTokenSite.y = 0.2 + 0.3 * Math.floor(cnt % 5) + origin.y

    return newTokenSite;
}




export default class Token{

    constructor(anchor){

        this.experience = new Experience()
        this.world = this.experience.world
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.geometryManager = this.experience.geometry
        this.materialManager = this.experience.material
        this.debug = this.experience.debug

        this.user = null

        this.Initialize(anchor)


    }

    
    get instance() {return this.mesh}

    get id() { return this.instance.id }



    Initialize(anchor){
        if(anchor > 0)
            this.user = "bottom"
        else
            this.user = "top"


        let alpha_ = new Float32Array(limit_cnt);
        let time_ = new Float32Array(limit_cnt);
        let offset_ = new Float32Array(limit_cnt * 2)

        let index_arr = Array.from(Array(limit_cnt).keys())
        index_arr.reverse()

        // this.index_queue = {
        //     "top" : index_arr.slice(0, 50), // 99 ~ 50
        //     "bottom" : index_arr            // 49 ~ 0
        // }

        this.index_queue = 0

        // this.index_queue.reverse()

        this.token_infos = []
        for (let i = 0; i < limit_cnt; i++) {
            alpha_[i] = 0.0
            time_[i] = 0.0

            offset_[2 * i] = Math.random()  
            offset_[2 * i + 2] = Math.random()
            
            this.token_infos.push(new TokenInfo(this.user, i, () => { this.DisplaySync(i) }))
        }


        this.geometry = this.geometryManager.items.token.clone();
        this.geometry.setAttribute("alpha", new THREE.InstancedBufferAttribute(alpha_, 1, true, 1))
        // this.geometry.setAttribute("effect", new THREE.InstancedBufferAttribute(effect_, 1, true, 1))
        // this.geometry.setAttribute("outline", new THREE.InstancedBufferAttribute(outline_, 1, true, 1))
        this.geometry.setAttribute("time", new THREE.InstancedBufferAttribute(time_, 1, true, 1))
        this.geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offset_, 2, true, 1))

        
        this.material_front = this.experience.material.referenceMaterial("token_material")
        this.material_side =  this.experience.material.referenceMaterial("token_material_side")


        this.material_front.opacity = 1
        this.material_side.opacity = 1


        this.materials = [
            this.material_side, this.material_side,
            this.material_front, this.material_side, this.material_side, this.material_side
        ]

        this.mesh = new THREE.InstancedMesh(this.geometry, this.materials, limit_cnt);
        this.mesh.castShadow = true
        // this.mesh.scale.set(-1,1,1)


        let tmp_color = new THREE.Color("#ffffff")

        for (let token_index = 0; token_index < 50; token_index++) {

            // let pos = GetTokenPosition(this.user, token_index)
            mat4.setPosition(hide_position)

            // tmp_matrix.setPosition(new Vector3(0,0,25))
            this.mesh.setMatrixAt(token_index, mat4)

            // pos.setY(pos.y + 0.005)
            // tmp_matrix.setPosition(pos)
            // this.effect_mesh.setMatrixAt(instance_index, tmp_matrix)

            this.mesh.setColorAt(token_index, tmp_color)
        }
        
        this.mesh.instanceMatrix.needsUpdate = true
        this.scene.add(this.mesh)
        this.experience.world.Add_AnimationObject(this.mesh.id, this)
    }

    GameOver(){
        this.Clear()

    }

    Clear(){
        this.token_infos.forEach((info, index) => {
            this.Hide(index)
        })

        this.index_queue = 0
    }


    NewToken(pos){
        let token_info = this.GetToken()
        token_info.Set_Begin_Position_Effect(pos)

        token_info.Initialize()

        return token_info
    }

    GetToken(){
        let token_index = this.Active()
        return this.token_infos[token_index]
    }


    ReturnToken(){
        this.Inactive()
    }


    Active(){
        let index = this.index_queue
        this.index_queue++

        return index
    }


    Inactive(){
        this.index_queue--
    }


    Show(index){
        let position_ = GetTokenPosition(this.user, index)

        let info = this.token_infos[index]
        info.position.x = position_.x
        info.position.y = position_.y
        info.position.z = position_.z

        info.opacity.color = 1.0

        info.time.value = 0.0

        // this.instance.setMatrixAt(index, mat4)
        // this.instance.instanceMatrix.needsUpdate = true

        // this.SetOpacityAt_Color(index, 1.0)
    }


    Hide(index){
        let position_ = new THREE.Vector3(0,-3, 15)
        mat4.setPosition(position_)

        let info = this.token_infos[index]
        info.position.x = 0
        info.position.y = -3
        info.position.z = 15

        info.opacity.color = 0.0

        info.time.value = 0.0

        // this.instance.setMatrixAt(index, mat4)
        // this.instance.instanceMatrix.needsUpdate = true
        
        // this.SetOpacityAt_Color(index, 0.0)

    }



    DisplaySync(index){
        if(index < this.index_queue){
            // display
            this.Show(index)
        }
        else{
            // hide
            this.Hide(index)
        }
    }



    SetMatrixAt(index, matrix){
        this.mesh.setMatrixAt(index, matrix)
        this.mesh.instanceMatrix.needsUpdate = true
    }


    SetOpacityAt_Color(index, value){
        this.mesh.geometry.attributes.alpha.array[index] = value
        this.mesh.geometry.attributes.alpha.needsUpdate = true

    }


    SetOpacityAt_Time(index, value){
        this.mesh.geometry.attributes.time.array[index] = value
        this.mesh.geometry.attributes.time.needsUpdate = true

    }

    // SetOpacityAt_Outline(index, value){
    //     this.mesh.geometry.attributes.outline.array[index] = value
    //     this.mesh.geometry.attributes.outline.needsUpdate = true
    // }



    Update(){
        for (let i = 0; i < limit_cnt; i++) {
            let instance_index = i
            let token_info = this.token_infos[instance_index]

            let opacity_value = null
            let time_value = null


            if (TokenInfo.needsUpdate[`${this.user}`][instance_index] == true) {
                let mat_ = token_info.matrix
                this.SetMatrixAt(instance_index, mat_)
                TokenInfo.needsUpdate[`${this.user}`][instance_index] = false
            }

            if (TokenInfo.needsColorUpdate[`${this.user}`][instance_index] == true) {
                opacity_value = token_info.opacity.color
                this.SetOpacityAt_Color(instance_index, opacity_value)
                TokenInfo.needsColorUpdate[`${this.user}`][instance_index] = false
            }



            if (TokenInfo.needsTimeUpdate[`${this.user}`][instance_index] == true) {
                time_value = token_info.time.value
                this.SetOpacityAt_Time(instance_index, time_value)
                TokenInfo.needsTimeUpdate[`${this.user}`][instance_index] = false
            }

        }
    }

}



class TokenInfo {
    static needsUpdate = {
        "bottom": new Array(limit_cnt).fill(false),
        "top": new Array(limit_cnt).fill(false)
    }
    static needsColorUpdate = {
        "bottom": new Array(limit_cnt).fill(false),
        "top": new Array(limit_cnt).fill(false)
    }
    static needsTimeUpdate = {
        "bottom": new Array(limit_cnt).fill(false),
        "top": new Array(limit_cnt).fill(false)
    }


    constructor(user, index, DisplaySync) {
        this.user = user
        this.index = index
        this.DisplaySync = DisplaySync
        this.effect_begin_position = new THREE.Vector3()

        this.origin_position = GetTokenPosition(this.user, this.index)

        this.owner = null
        this.filter = {
            color : false
        }

        
        this.position = {
            vec : new THREE.Vector3(0, 5, 0),
            get x() { return this.vec.x; },
            get y() { return this.vec.y; },
            get z() { return this.vec.z; },
            set x(value) { this.vec.setX(value); TokenInfo.needsUpdate[`${this.user}`][this.index] = true; },
            set y(value) { this.vec.setY(value); TokenInfo.needsUpdate[`${this.user}`][this.index] = true; },
            set z(value) { this.vec.setZ(value); TokenInfo.needsUpdate[`${this.user}`][this.index] = true; }
        }
        this.position.index = index
        this.position.user = user


        this.opacity = {
            color_ : 0,

            get color() { return this.color_ },
            
            set color(value) { 
                this.color_ = value;
                TokenInfo.needsColorUpdate[`${this.user}`][this.index] = true; 
            }
        }
        this.opacity.index = index
        this.opacity.user = user
        
        this.time = {
            value_ : 0,
            set value(rhs) { this.value_ = rhs; TokenInfo.needsTimeUpdate[`${this.user}`][this.index] = true; },

            get value() { return this.value_ }
        }
        this.time.index = index
        this.time.user = user


        this.animation_cnt = 0

    }

    get matrix(){
        mat4.setPosition(this.position.vec)
        return mat4
    }


    Initialize(){
        this.time.value = 0
    }


    Set_Begin_Position_Effect(position_){
        this.effect_begin_position.copy(position_)
    }


    SetOpacity_Hide(){
        this.opacity.color = 0
    }


    SetOpacity_Origin(){
        this.opacity.color = 1


    }


    SetPosition_Hide(){
        // console.log(pos)
        this.position.x = 0
        this.position.y = -3
        this.position.z = 15
    }

    SetPosition_Origin(){
        this.position.x = this.origin_position.x
        this.position.y = this.origin_position.y
        this.position.z = this.origin_position.z
    }


    AnimationEnd(){
        this.animation_cnt--
        if(this.animation_cnt == 0){
            // pool 인스턴스의 sync 함수 호출
            this.DisplaySync()
        }
    }


    Disappear() {
        this.animation_cnt++

        this.SetPosition_Origin()
        this.SetOpacity_Origin()

        gsap.timeline()
            // .to(this.time, { duration: 1.5, ease: "Power4.easeIn", value: 1.0 })
            .to(this.opacity, {
                ease: "none", color: 0.0, duration: 0.5,
                onComplete: () => { 
                    // this.destroy()
                    this.AnimationEnd()
                } })

    }

    Appear() {
        this.animation_cnt++

        let anim = gsap.timeline()
        this.SetOpacity_Hide()

        anim.to(this.opacity, {
            delay: 0.15, duration: 0.4, color: 1, ease: "none",
            onStart: () => {
                this.SetPosition_Origin()
                // this.Set_Begin_Position_Effect({ x: 0, y: -1, z: 15 })
            },
            onComplete: () => {
                // this.destroy()
                this.AnimationEnd()
            }
        })

        return anim
    }

    initialMove(goal, isImmediately = true) { 
        this.animation_cnt++

        this.SetOpacity_Hide()

        goal = this.GetPosition()

        // let from = this.position.vec.clone()
        // let from = GetTokenPosition(this.user, this.index)
        let from = this.effect_begin_position
        let anim = Token_Effect.instance.initialMove(from, goal, isImmediately)

        anim.to(this.opacity, {
            duration: 0.4, ease: "none", color: 1, 
            onStart: () => { this.SetPosition_Origin() },
            onComplete: () => { this.AnimationEnd() }
        }, "lightoff")

        return anim
    }


    // 논리적 inactive = 바로 실행
    // 애니메이션 inactive = 애니메이션이 끝난 이후
    slideMove(goal) { 
        this.animation_cnt++

        let fromPosition = this.GetPosition()
        // this.Set_Begin_Position_Effect(fromPosition)
        this.SetPosition_Origin()
        this.SetOpacity_Origin()

        let anim = Token_Effect.instance.slideMove(fromPosition, goal)
        anim.to(this.opacity, {
            duration: 0.4, ease: "none", color: 0, onStart: () => { this.SetPosition_Origin() }, onComplete: () => { this.AnimationEnd() }
        }, "lighton")

        // anim.then(()=>{this.AnimationEnd()})

        return anim
    }


    GetPosition() {
        return this.origin_position
    }


    Spend() {
        this.animation_cnt++
        // this.destroy_logical()

        let token_position = this.origin_position
        // this.Set_Begin_Position_Effect(token_position)

        
        let anim = Token_Effect.instance.Spend(token_position)
        anim.to(this.opacity, {
            duration: 0.5, ease: "none", color: 0, onComplete: () => {
                this.AnimationEnd()
            }
        }, "lightoff")

        // let anim = gsap.timeline()
        //     .to(this.opacity, { duration: 0.5, ease: "none", effect: 1 })
        //     .to(this.opacity, {
        //         duration: 0.5, ease: "none", color: 0, onComplete: () => {
        //             this.SetPosition({ x: 0, y: -1, z: 15 })
        //         }
        //     })
        //     .to(this.opacity, { delay: 0.5, duration: 0.5, ease: "none", effect: 0, onComplete: () => { this.DisplaySync() } })

        return anim
    }


    destroy(){/* dummy function */}



}

