import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';
import TokenEffect from './TokenEffect.js'

import FadeDisappear from '../Shaders/Materials/FadeDisappear.js';
// import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';


const limit_cnt = 50
let instance = null
let mat4 = new THREE.Matrix4()
const color_ = new THREE.Color()
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

    newTokenSite.y = 0.2 + 0.25 * Math.floor(cnt % 5) + origin.y

    return newTokenSite;
}




export default class Token{

    constructor(pos, anchor){
        if(instance != null){
            // tokenInfo를 반환한다.
            let token_info = instance.GetToken()
            token_info.SetPosition(pos)


            return instance
        }

        instance = this

        
        this.experience = new Experience()
        this.world = this.experience.world
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.geometryManager = this.experience.geometry
        this.materialManager = this.experience.material
        this.debug = this.experience.debug

        this.Initialize(anchor)

    }

    
    get instance() {return this.mesh}

    get id() { return this.instance.id }



    Initialize(anchor){
        let alpha_ = new Float32Array(limit_cnt);
        let effect_ = new Float32Array(limit_cnt);
        let outline_ = new Float32Array(limit_cnt);
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
            
            this.token_infos.push(new TokenInfo(i, () => { this.Inactive_Token_Logical(i) }, () => { this.Inactive_Token_Animation(i) }, () => { return this.StealedToken(i) }))
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



        // this.outline_materials = [, , outline_material, , , ,]
        // this.outline_mesh = new THREE.InstancedMesh(this.geometry, this.outline_materials)
        // this.outline_mesh.layers.enable(1)


        let effect_alpha_ = new Float32Array(limit_cnt);
        for (let i = 0; i < limit_cnt; i++) {
            effect_alpha_[i] = 0.0
        }

        this.effect_geometry = this.geometryManager.items.token.clone();
        this.effect_geometry.setAttribute("alpha", new THREE.InstancedBufferAttribute(effect_alpha_, 1, true, 1))


        this.effect_materials = [,,this.materialManager.referenceMaterial("token_effect"),,,,];
        this.effect_mesh = new THREE.InstancedMesh(this.effect_geometry, this.effect_materials, limit_cnt);
        this.effect_mesh.layers.enable(1)

        let tmp_color = new THREE.Color("#ffffff")

        let tmp_matrix = new THREE.Matrix4()


        let users = ["bottom", "top"]

        // this.mesh.material.needsUpdate = true

        // for(let token_index = 0; token_index < limit_cnt; token_index++){

        //     tmp_matrix.setPosition(new THREE.Vector3(0, -3, 0))
        //     this.mesh.setMatrixAt(token_index, tmp_matrix)
        //     this.effect_mesh.setMatrixAt(token_index, tmp_matrix)
        //     this.mesh.setColorAt(token_index, tmp_color)
        //     // this.effect_mesh.setColorAt(token_index, tmp_color)
        // }

        let usr = null
        if(anchor > 0)
            usr = "bottom"
        else
            usr = "top"

        for (let token_index = 0; token_index < 50; token_index++) {
            let instance_index = token_index

            let tmp_matrix = new THREE.Matrix4()
            let pos = GetTokenPosition(usr, token_index)
            tmp_matrix.setPosition(pos)

            // tmp_matrix.setPosition(new Vector3(0,0,25))
            this.mesh.setMatrixAt(instance_index, tmp_matrix)

            pos.setY(pos.y + 0.005)
            tmp_matrix.setPosition(pos)
            this.effect_mesh.setMatrixAt(instance_index, tmp_matrix)

            this.mesh.setColorAt(instance_index, tmp_color)
        }

        // this.mesh.renderOrder = -2
        this.effect_mesh.renderOrder = 1
        
        this.mesh.instanceMatrix.needsUpdate = true
        this.effect_mesh.instanceMatrix.needsUpdate = true



        this.scene.add(this.mesh)
        this.scene.add(this.effect_mesh)

        this.experience.world.Add_AnimationObject(this.mesh.id, this)
        
        this.acc_time = 0
    }


    // 생성
    Appear(goal){
        let index = this.index_queue
        this.index_queue--


        return // gsap timeline
    }



    initialMove(goal, isImmediately = true){
        let index = this.index_queue
        this.index_queue--

        
        return // gsap timeline
    }


    // 소멸
    slideMove(goal){
        let index = this.index_queue
        this.index_queue++


        return // gsap timeline
    }


    Spend(){
        let index = this.index_queue
        this.index_queue++


        return // gsap timeline
    }

    
    Disappear(){
        let index = this.index_queue
        this.index_queue++


        return // gsap timeline
    }


    Taken(){
        return // gsap timeline
    }

    DisplaySync(index){
        if(index < this.index_queue){
            // display
        }
        else{
            // hide
        }


    }



    GetToken(){
        let info_ = this.Active_Token()
        return info_
    }


    StealedToken(){
        let stealed_token_info = this.token_infos[stealed_token_index]
        stealed_token_info.destroy_logical()
        // this.index_queue[`${victim}`].push(stealed_token_index)

        let new_token_info = this.token_infos[this.index_queue]
        this.index_queue++


        return new_token_info
    }


    Inactive_Token_Logical(index_) {
        let info_ = this.token_infos[index_]

        if (info_.active == false)
            return;


        let user = null
        if (index_ < 50)
            user = "bottom"
        else
            user = "top"


        info_.InActivate()
        this.index_queue--
        // this.index_queue[`${user}`].push(index_)

    }


    Inactive_Token_Animation(index_){
        let info_ = this.token_infos[index_]

        if(info_.active == true)
            return;


        let matrix_ = info_.matrix
        // this.mesh.setMatrixAt(index_, matrix_)
        // this.mesh.instanceMatrix.needsUpdate = true


        let effect_matrix_ = info_.effect_matrix
        this.effect_mesh.setMatrixAt(index_, effect_matrix_)
        this.effect_mesh.instanceMatrix.needsUpdate = true

        
        this.SetOpacityAt_Color(index_, info_.opacity.color)
        this.SetOpacityAt_Effect(index_, info_.opacity.effect)

    }

    Active_Token() {
        let index_ = null
        if (this.index_queue < 50) {
            index_ = this.index_queue
            this.index_queue++
        }


        if (index_ == null)
            return null
        else {
            let info_ = this.token_infos[index_]
            info_.Activate()

            // let position_ = GetTokenPosition(user, index_ % 50)
            // info_.SetPosition(position_)

            return info_
        }

    }


    SetPositionAt() {

    }


    SetOpacityAt_Color(index, value){
        this.mesh.geometry.attributes.alpha.array[index] = value
        this.mesh.geometry.attributes.alpha.needsUpdate = true

    }

    SetOpacityAt_Effect(index, value){
        this.effect_mesh.geometry.attributes.alpha.array[index] = value
        this.effect_mesh.geometry.attributes.alpha.needsUpdate = true
    }


    SetTimeAt(index, value){
        // this.mesh.geometry.attributes.time.array[index] = value
        // this.mesh.geometry.attributes.time.needsUpdate = true

        color_.setRGB(1 - value, 1 - value, 1 - value)
        this.mesh.setColorAt(index, color_)

        this.mesh.instanceColor.needsUpdate = true
    }

    // SetOpacityAt_Outline(index, value){
    //     this.mesh.geometry.attributes.outline.array[index] = value
    //     this.mesh.geometry.attributes.outline.needsUpdate = true
    // }



    Update(deltaTime){
        this.acc_time += deltaTime

        let need_update = false
        // let instance_index = 4
        for (let i = 0; i < limit_cnt; i++) {
            let instance_index = i
            let token_info = this.token_infos[instance_index]
            if (TokenInfo.needsUpdate[instance_index] == true) {
                let matrix_ = token_info.matrix
                // this.mesh.setMatrixAt(instance_index, matrix_)

                let effect_matrix = token_info.effect_matrix
                this.effect_mesh.setMatrixAt(instance_index, effect_matrix)

                TokenInfo.needsUpdate[i] = false
                need_update = true

            }

            let need_color_update = false
            let opacity_value = null
            if (TokenInfo.needsColorUpdate[instance_index] == true) {
                opacity_value = token_info.opacity.color
                this.SetOpacityAt_Color(instance_index, opacity_value)
                // this.SetOpacityAt_Color(149, 0.7)
                TokenInfo.needsColorUpdate[instance_index] = false
                need_color_update = true


                // if (this.mesh.instanceColor != null) {
                //     this.mesh.instanceColor.needsUpdate = true
                //     // console.log(instance_index, opacity_value)

                // }

            }


            if (TokenInfo.needsEffectUpdate[instance_index] == true) {
                opacity_value = token_info.opacity.effect
                this.SetOpacityAt_Effect(instance_index, opacity_value)
                TokenInfo.needsEffectUpdate[instance_index] = false
            }


            if (TokenInfo.needsOutlineUpdate[instance_index] == true) {
                opacity_value = token_info.opacity.outline
                this.SetOpacityAt_Outline(instance_index, opacity_value)
                TokenInfo.needsOutlineUpdate[instance_index] = false
            }


            if (TokenInfo.needsTimeUpdate[instance_index] == true) {
                opacity_value = token_info.time.value
                this.SetTimeAt(instance_index, opacity_value)
                TokenInfo.needsTimeUpdate[instance_index] = false
            }

        }

        // need_update = true

        // for debug
        // this.token_infos[4].position.z = this.acc_time / 1000

        if (need_update == true) {
            this.mesh.instanceMatrix.needsUpdate = true
            this.effect_mesh.instanceMatrix.needsUpdate = true

        }

    }

}



class TokenInfo{
    static needsUpdate = new Array(limit_cnt).fill(false)
    static needsColorUpdate = new Array(limit_cnt).fill(false)
    static needsEffectUpdate = new Array(limit_cnt).fill(false)
    static needsOutlineUpdate = new Array(limit_cnt).fill(false)
    static needsTimeUpdate = new Array(limit_cnt).fill(false)

    constructor(index, inactive_logical_callback, inactive_animation_callback, steal_callback) {
        // this.index = index
        this.index = index
        this.inactive_logical_callback = inactive_logical_callback
        this.inactive_animation_callback = inactive_animation_callback
        this.steal_callback = steal_callback
        this.active = false  // 
        this.owner = null
        this.filter = {
            color : false,
            effect : false,
            outline : false
        }
        this.position_ = {
            vec : new THREE.Vector3(0, 5, 0),
            get x() { return this.vec.x; },
            get y() { return this.vec.y; },
            get z() { return this.vec.z; },
            set x(value) { this.vec.setX(value); TokenInfo.needsUpdate[this.index] = true; },
            set y(value) { this.vec.setY(value); TokenInfo.needsUpdate[this.index] = true; },
            set z(value) { this.vec.setZ(value); TokenInfo.needsUpdate[this.index] = true; }
        }
        this.position_.index = index

        
        this.position_effect = {
            vec: new THREE.Vector3(0, 5, 0),
            get x() { return this.vec.x; },
            get y() { return this.vec.y; },
            get z() { return this.vec.z; },
            set x(value) { this.vec.setX(value); TokenInfo.needsUpdate[this.index] = true; },
            set y(value) { this.vec.setY(value); TokenInfo.needsUpdate[this.index] = true; },
            set z(value) { this.vec.setZ(value); TokenInfo.needsUpdate[this.index] = true; }
        }
        this.position_effect.index = index

        this.opacity = {
            color_ : 0,
            effect_ : 0,
            outline_ : 0,

            get color() { return this.color_ },
            get effect() { return this.effect_ },
            get outline() { return this.outline_ },
            
            set color(value) { this.color_ = value; TokenInfo.needsColorUpdate[this.index] = true; },
            set effect(value) { this.effect_ = value; TokenInfo.needsEffectUpdate[this.index] = true; },
            set outline(value) { this.outline_ = value; TokenInfo.needsOutlineUpdate[this.index] = true; },
        }
        this.opacity.index = index
        
        this.time_ = {
            value_ : 0,
            set value(rhs) { this.value_ = rhs; TokenInfo.needsTimeUpdate[this.index] = true; },

            get value() { return this.value_ }
        }
        this.time_.index = index

        this.need_update_matrix = false

        this.animation_cnt = 0

    }

    set position(value) {}
    get position() { return this.position_ }

    get time() { return this.time_ }

    // set time(value) { this.time_ = value; TokenInfo.needsTimeUpdate[this.index] = true; }
    // get time() { return this.time_ }


    // set position_(){

    // }


    // set opacity_(){

    // }

    get matrix(){
        let mat4_ = new THREE.Matrix4()
        // mat4_.makeRotationY(Math.PI)
        mat4_.setPosition(this.position.vec)
        // mat4_.scale(new THREE.Vector3(-1, 1, 1))
        return mat4_
    }

    get effect_matrix() {
        let pos = this.position_effect.vec.clone()
        
        mat4.setPosition(pos)
        return mat4
    }
    


    Activate(){
        // this.position_ = 

        this.time.value = 0


        this.active = true
    }


    InActivate(){
        this.active = false
    }
    

    SetPosition(pos){
        // console.log(pos)
        this.position.x = pos.x
        this.position.y = pos.y
        this.position.z = pos.z
    }

    
    SetPosition_Effect(pos){
        // console.log(pos)
        this.position_effect.x = pos.x
        this.position_effect.y = pos.y
        this.position_effect.z = pos.z
    }

    SyncDisplay(){
        this.animation_cnt--
        if(this.animation_cnt == 0){
            // pool 인스턴스의 sync 함수 호출
        }
    }


    Disappear() {
        this.animation_cnt++

        gsap.timeline({ defaults: { duration: 0.65 } })
            .to(this.time, { ease: "none", value: 1.0 })
            .to(this.opacity, {
                ease: "none", color: 0.0,
                onComplete: () => { 
                    // this.destroy()
                    this.SyncDisplay()
                } })

    }

    Appear(goal) {
        this.animation_cnt++

        let anim = gsap.timeline()


        
        this.opacity.color = 0
        this.opacity.effect = 0

        anim.to(this.opacity, {
            delay: 0.15, duration: 0.4, color: 1, ease: "none",
            onStart: () => {
                this.SetPosition(goal)
                this.SetPosition_Effect({ x: 0, y: -1, z: 15 })
            },
            onComplete: () => {
                // this.destroy()
                this.SyncDisplay()
            }
        })

        return anim
    }

    initialMove(goal, isImmediately = true) { 
        this.animation_cnt++

        let anim = gsap.timeline()
        let fromPosition = this.position.vec.clone()
        let fromHeight = undefined

        if (isImmediately == true) {
            fromHeight = fromPosition.y + 1.0
        }
        else {
            fromHeight = goal.y + 1.0
        }

        this.SetPosition({ x: 0, y: -1, z: 15 })
        this.SetPosition_Effect(fromPosition)


        this.opacity.color = 0
        this.opacity.effect = 0

        anim.to(this.opacity, { duration: 0.6, ease: "none", effect: 1 })
        anim.to(this.position_effect, { duration: 0.6, ease: "none", y: fromHeight }, "<")

        if(isImmediately == true){
            anim.to(this.position_effect, {duration : 0.55, ease: "none", x : goal.x, y : goal.y, z : goal.z})
        }
        else{
            anim.from(this.position_effect, {duration : 0.55, ease: "none", x : goal.x, y : fromHeight, z : goal.z})
        }


        anim.to(this.opacity, {
            duration: 0.3, ease: "none", color: 1, onStart: () => {
                this.SetPosition(goal)
            }
        })
        // anim.to(this.opacity, { duration: 0.3, ease: "none", effect: 1 }, "<")
        anim.to(this.opacity, {
            duration: 0.4, ease: "none", effect: 0,
            onComplete: () => {
                // this.destroy()
                this.SyncDisplay()
            }
        })

        return anim
    }


    // 논리적 inactive = 바로 실행
    // 애니메이션 inactive = 애니메이션이 끝난 이후
    slideMove(goal) { 
        this.animation_cnt++
        // this.destroy_logical()


        let fromPosition = this.position.vec.clone()
        this.SetPosition_Effect(fromPosition)

        let anim = gsap.timeline()
        anim.to(this.opacity, { delay: 0.2, duration: 0.4, ease: "none", effect: 1 })
        anim.to(this.opacity, {
            duration: 0.4, ease: "none", color: 0, onComplete: () => {
                this.SetPosition({ x: 0, y: -1, z: 15 })
            }
        }, "<")
        anim.to(this.position_effect, { delay: 0.15, duration: 0.6, ease: "none", x: goal.x, y: goal.y, z: goal.z })
        // anim.to(this.opacity, { delay: 0.15, duration: 0.3, effect: 1, ease: "none" })
        anim.to(this.opacity, { delay: 0.15, duration: 0.4, effect: 0, ease: "none", onComplete: () => { this.SyncDisplay() } })

        return anim
    }


    GetPosition() {
        return this.position.vec
    }


    // 논리적 inactive = 바로 실행
    // 애니메이션 inactive = 애니메이션이 끝난 이후
    Spend() {
        this.animation_cnt++
        // this.destroy_logical()

        let token_position = this.GetPosition()
        this.SetPosition_Effect(token_position)

        let anim = gsap.timeline()
            .to(this.opacity, { duration: 0.5, ease: "none", effect: 1 })
            .to(this.opacity, {
                duration: 0.5, ease: "none", color: 0, onComplete: () => {
                    this.SetPosition({ x: 0, y: -1, z: 15 })
                }
            })
            .to(this.opacity, { delay: 0.5, duration: 0.5, ease: "none", effect: 0, onComplete: () => { this.DisplaySync() } })

        return anim
    }


    destroy_logical(){
        this.inactive_logical_callback()

    }


    destroy_animation(){
        this.opacity.color = 0
        this.opacity.effect = 0

        this.SetPosition({ x: 0, y: -3, z: 0 })
        this.SetPosition_Effect({ x: 0, y: -3, z: 15 })

        this.inactive_animation_callback()

    }


    destroy() {
        // 모든 opacity를 0으로 설정,
        // (0, -1, 0) 으로 이동
        // console.log("destroy~")

        // // this.opacity.outline = 0

        // this.inactive_callback()


        this.destroy_logical()
        this.destroy_animation()

    }
    

    battleEnd() {/* dummy function */ }


}

