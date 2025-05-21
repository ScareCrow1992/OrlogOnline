import * as THREE from 'three'
import Experience from '../../Experience.js';
import gsap from 'gsap';

import Ragnarok_Effect from "./Ragnarok_Effect.js"

// import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';


const limit_cnt = 30
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

    newTokenSite.y = 0.2 + 0.25 * Math.floor(cnt % 5) + origin.y

    return newTokenSite;
}




export default class Token{

    constructor(anchor){

        this.experience = new Experience()
        this.world = this.experience.world
        this.scene = this.experience.scene
        this.resources = this.experience.resources
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
            alpha_[i] = 1.0
            
            this.token_infos.push(new TokenInfo(this.user, i, () => { this.DisplaySync(i) }))
        }


        this.geometry = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 6, 1, false, Math.PI / 6, Math.PI * 2)
        this.geometry.setAttribute("alpha", new THREE.InstancedBufferAttribute(alpha_, 1, true, 1))
        
        // this.material_front = this.experience.material.referenceMaterial("token_material")
        // this.material_side =  this.experience.material.referenceMaterial("token_material_side")


        // this.material_front.opacity = 1
        // this.material_side.opacity = 1


        // this.material = [
        //     this.material_side, this.material_side,
        //     this.material_front, this.material_side, this.material_side, this.material_side
        // ]

        this.material = this.materialManager.referenceMaterial("ragnarok_material")

        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, limit_cnt);
        this.mesh.castShadow = true
        // this.mesh.scale.set(-1,1,1)



        for (let token_index = 0; token_index < limit_cnt; token_index++) {

            // let pos = GetTokenPosition(this.user, token_index)
            mat4.setPosition(hide_position)


            // tmp_matrix.setPosition(new Vector3(0,0,25))
            this.mesh.setMatrixAt(token_index, mat4)

            // pos.setY(pos.y + 0.005)
            // tmp_matrix.setPosition(pos)
            // this.effect_mesh.setMatrixAt(instance_index, tmp_matrix)
        }
        
        
        // this.mesh.renderOrder = 2

        this.mesh.instanceMatrix.needsUpdate = true
        this.scene.add(this.mesh)
        this.experience.world.Add_AnimationObject(this.mesh.id, this)
    }


    NewToken(pos){
        let token_info = this.GetToken()
        token_info.Set_Begin_Position_Effect(pos)


        return token_info
    }

    GetToken(){
        let token_index = this.Active()
        return this.token_infos[token_index]
    }


    Active(){
        let index = this.index_queue
        this.index_queue++

        return index
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

    constructor(user, index, DisplaySync) {
        this.user = user
        this.index = index
        this.DisplaySync = DisplaySync
        this.effect_begin_position = new THREE.Vector3()

        // this.origin_position = GetTokenPosition(this.user, this.index)

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

        this.animation_cnt = 0

    }

    get matrix(){
        mat4.setPosition(this.position.vec)
        return mat4
    }


    SetPosition(pos){
        this.position.x = pos.x
        this.position.y = 0.2
        this.position.z = pos.z

    }


    Set_Begin_Position_Effect(position_){
        this.effect_begin_position.copy(position_)
    }



    initialMove(goal, isImmediately = true, healthStone) { 
        this.animation_cnt++

        // this.SetOpacity_Hide()

        // let from = this.position.vec.clone()
        // let from = GetTokenPosition(this.user, this.index)
        let from = this.effect_begin_position
        let anim = Ragnarok_Effect.instance.initialMove(from, goal, isImmediately)

        anim.to(this.opacity, {
            duration: 0.4, ease: "none", color: 1,
            onStart: () => {
                this.SetPosition(goal)

                if (healthStone)
                    healthStone.Damaged()

            }
        }, "lightoff")

        return anim
    }

    



    destroy(){/* dummy function */}



}

