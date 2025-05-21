import * as THREE from 'three'
import Experience from '../Experience.js'



const lerps = {
    Lerp : function (from, to, alpha){
        let diff = alpha * (to - from)
        return from + diff
    },
    CircLerp : function (from, to, alpha){
        let diff = (to - from) * ( Math.sqrt(alpha) )
        return from + diff
    },
    Cos : function(from, to, alpha){
        let unit = to - from

        return Math.cos(unit * alpha * (Math.PI / 2))
    },
    None : function(from, to, alpha){
        return to
    }
}





// const zero_vector = new THREE.Vector3(0, 0, 0)
const tmp_obj = new THREE.Object3D()

export default class ParticleScatter {
    constructor(param, parent) {
        this.experience = new Experience()
        this.parent = parent
        this.param = param
        this.time_remaing = 0
        this.bursted = false
        this.active_ = true
        this.age = 0

        this.Init()
    }

    get instance(){ return this.particle_mesh}
    get world_matrix(){
        let parent_matrix = this.parent.matrix.clone()
        let child_matrix = this.particle_mesh.matrix.clone()

        // parent_matrix.invert()
        // child_matrix.invert()

        parent_matrix.multiply(child_matrix)
        return parent_matrix

    }

    Init() {

        let life_time_max = this.param.particle_life_time + this.param.particle_life_time_random
        let create_interval_time_min =
            this.param.create_interval_time - this.param.create_interval_time_random

        if (this.param.fire_type == "burst")
            this.param.count_limit = this.param.burst_cnt
        else if (this.param.fire_type == "stream")
            this.param.count_limit = Math.ceil(life_time_max / create_interval_time_min)
        else
            this.param.count_limit = 0

        let alpha_ = new Float32Array(this.param.count_limit);
        for (let i = 0; i < this.param.count_limit; i++) {
            alpha_[i] = 0.0
        }

        this.param.particle_geometry.setAttribute('alpha', new THREE.InstancedBufferAttribute(alpha_, 1, true, 1));
        

        this.particle_mesh = new THREE.InstancedMesh(this.param.particle_geometry, this.param.particle_material, this.param.count_limit)


        this.particle_mesh.position.copy(this.param.origin_position)
        this.particle_mesh.layers.enable(1)
        this.particle_mesh.material.needsUpdate = true

        
        for(let i=0; i<this.param.count_limit; i++)
            this.particle_mesh.setColorAt(i, this.param.colors[0])


        this.particles_matrix = new Array(this.param.count_limit).fill(this.world_matrix)
        this.particles_info = new Array(this.param.count_limit)
        for (let index = 0; index < this.param.count_limit; index++) {
            this.particles_info[index] = new ParticleInfo(this.param)
        }


        this.particle_queue = Array.from(Array(this.param.count_limit).keys())
        // this.experience.scene.add(this.particle_mesh)

        // window.addEventListener("keydown", event=>{
        //     if(event.key == "g")
        //         this.Burst()
        // })


    }


    Burst(){
        if(this.param.fire_type === "stream")
            return;

        for(let i=0; i<this.param.count_limit; i++){
            this.Begin_Particle()
        }
        this.bursted = true
        // this.particle_mesh.material.needsUpdate = true

    }


    Inactive(){
        this.active_ = false
    }

    Begin_Particle() {
        if (this.active_ == false)
            return

        if(this.param.mainbody_lifetime != null && this.age > this.param.mainbody_lifetime){
            return
        }

        let cIndex = this.particle_queue.pop()
        if(cIndex === undefined)
            return;

        let cInfo = this.particles_info[cIndex]
        cInfo.begin_(this.world_matrix)

        // this.particle_mesh.setColorAt(cIndex, this.param.begin_color)

    }


    End_Particle(index){
        let cInfo = this.particles_info[index]
        cInfo.end_()
        
        this.particle_queue.push(index)
        // this.particle_mesh.setColorAt(index, zero_color)

    }


    Init_Trail(){



    }


    Get_Max_Life(){
        return this.param.particle_life_time + this.param.particle_life_time_random
    }



    setLifeAt(index, life){
        // const life_attribute = this.particle_mesh.geometry.getAttribute("life").array
        const alpha_attribute = this.particle_mesh.geometry.attributes.alpha.array
        // alpha_attribute[index] = Math.cos(life * (Math.PI / 2))


        const interpolation = this.param.opacity_interpolation

        if(interpolation)
            alpha_attribute[index] = lerps[`${interpolation}`](0, 1, life)
        else
            alpha_attribute[index] = lerps["Cos"](0, 1, life)
    }


    Update(deltaTime){
        this.age += deltaTime

        // this.particle_mesh.rotateY(0.005)
        // this.particle_mesh.translateY(0.005)
        
        this.instance.updateMatrix()


        if (this.param.fire_type === "stream") {
            this.time_remaing -= deltaTime
            if (this.time_remaing <= 0) {
                this.time_remaing =
                    this.param.create_interval_time +
                    Math.random() * this.param.create_interval_time_random

                // console.log(this.time_remaing)

                this.Begin_Particle()
            }
        }
 

        if (this.param.fire_type === "stream" || (this.param.fire_type === "burst" && this.bursted == true)) {
            for (let index = 0; index < this.param.count_limit; index++) {
                let cInfo = this.particles_info[index]
                if (cInfo.alive == true) {
                    if(this.param.gravity){
                        this.param.gravity_ = this.param.gravity.clone()
                        this.param.gravity_.multiplyScalar(deltaTime / 1000)
                    }
                    let ret = cInfo.update_(deltaTime)
                    if (ret == false) {
                        this.End_Particle(index)

                    }
                    else {
                        let matrix_ = cInfo.matrix_
                        let color_ = cInfo.color_
                        let life_ = cInfo.life_


                        // this.particle_mesh.setMatrixAt(index, matrix_)
                        this.particle_mesh.setColorAt(index, color_)
                        this.setLifeAt(index, life_)


                        // 좌표 고정                    
                        let scatter_matrix_ = this.world_matrix
                        scatter_matrix_.invert()
                        scatter_matrix_.multiply(matrix_)
                        this.particle_mesh.setMatrixAt(index, scatter_matrix_)
                    }

                    // console.log(matrix_)


                }

            }


            this.particle_mesh.instanceMatrix.needsUpdate = true
            // console.log(this.particle_mesh.instanceColor)
            // this.particle_mesh.instanceColor.needsUpdate = true
            if (this.particle_mesh.instanceColor != null)
                this.particle_mesh.instanceColor.needsUpdate = true
            else {
                // console.log("instanceColor is null")
                // this.particle_mesh.material.needsUpdate = true
                // console.log(this.particle_mesh)
            }


            this.particle_mesh.geometry.attributes.alpha.needsUpdate = true

        }



    }


    Destroy(){
        // this.param.particle_material.dispose()
        this.particle_mesh.dispose()

    }

}


class ParticleInfo {
    constructor(param) {
        this.param = param
        this.org_life_time
        this.life_time = 0
        this.replay_cnt = 0
        this.origin_matrix = new THREE.Matrix4()
        this.direction = new THREE.Vector3()
        this.speed = 0
        this.alive = false
        this.position = new THREE.Vector3()
        this.quaternion = new THREE.Quaternion()
        this.scale = new THREE.Vector3()
        this.color = new THREE.Color()
    }


    get life_(){
        return (this.org_life_time - this.life_time) / this.org_life_time
    }

    
    get matrix_(){
        let ret = new THREE.Matrix4()
        // ret.setPosition(this.position)
        ret.compose(this.position, this.quaternion, this.scale)
        return ret
    }

    get color_(){
        let unit_ = this.life_

        let unit_length = 1 / (this.param.colors.length - 1)
        let color_index = Math.floor(unit_ / unit_length)

        let ramainder_ = (unit_ - color_index * unit_length )* (this.param.colors.length - 1) 

        this.color.lerpColors(this.param.colors[color_index], this.param.colors[color_index + 1], ramainder_)

        return this.color
    }



    update_(deltaTime_) {

        if(this.alive === false)
            return null


        const interpolation = this.param.speed_interpolation
        if(interpolation)
            this.speed = lerps[`${interpolation}`](this.param.speed, this.param.speed_end, this.life_)
        else
            this.speed = lerps["CircLerp"](this.param.speed, this.param.speed_end, this.life_)

        

        let delta_vector = this.direction.clone()
        delta_vector.multiplyScalar(this.speed * (deltaTime_ / 1000))
        
        if(this.param.gravity){
            delta_vector.add(this.param.gravity_)
        }
        

        this.position.add(delta_vector)

        this.life_time -= deltaTime_



        if (this.life_time <= 0){
            return false
        }
        else{
            return true
        }
    }


    begin_(origin_matrix) {

        this.particle_life_time =
            this.param.particle_life_time + (this.param.create_interval_time_random * Math.random())

        this.org_life_time =
            this.param.particle_life_time + (this.param.particle_life_time_random * Math.random())

        this.life_time = this.org_life_time

        this.replay_cnt++
        this.origin_matrix.copy(origin_matrix)

        this.speed = this.param.speed + (this.param.speed_random * Math.random())
        this.alive = true

        origin_matrix.decompose(this.position, this.quaternion, this.scale)

        
        // this.direction.randomDirection()
        this.direction.set(0, 0, 1)
        this.direction.applyQuaternion(this.quaternion)

        let random_direction = new THREE.Vector3()
        random_direction.randomDirection()

        if(this.param.direction_scale){
            random_direction.multiply(this.param.direction_scale)
            random_direction.normalize()
        }

        if(this.param.direction_theta == null){
            this.direction.copy(random_direction)
        }
        else{
            const lerp_alpha = this.param.direction_theta / (Math.PI)
            this.direction.lerp(random_direction, lerp_alpha)
        }



        if(this.param.direction_heritaged == false){
            // 파티클이 이동 방향을 봐라봄
            tmp_obj.lookAt(this.direction)
            this.quaternion.copy(tmp_obj.quaternion)
        }


        // rotation_angle_random 만큼 각도 조절
        random_direction.randomDirection()
        const angle_alpha = this.param.rotation_angle_random / (Math.PI)
        random_direction.lerp(this.direction, 1 - angle_alpha)
        tmp_obj.lookAt(random_direction)
        this.quaternion.copy(tmp_obj.quaternion)


        if (this.param.regen_area_type == true)
            this.position.copy(this.Get_Regen_Position())

        
    }

    end_() {
        this.alive = false
    }


    Get_Regen_Position(){
        const regen_area = this.param.regen_area
        const position_buffer = regen_area.attributes.position.array
        const index_buffer = regen_area.index


        const vertex_cnt = regen_area.attributes.position.count
        const randomIndex = Math.floor(Math.random() * vertex_cnt) * 3;

        // console.log(randomIndex)

        const positions = [
            new THREE.Vector3(position_buffer[randomIndex], position_buffer[randomIndex + 1], position_buffer[randomIndex + 2]),

            new THREE.Vector3(position_buffer[randomIndex + 3], position_buffer[randomIndex + 4], position_buffer[randomIndex + 5]),

            new THREE.Vector3(position_buffer[randomIndex + 6], position_buffer[randomIndex + 7], position_buffer[randomIndex + 8])
        ]


        let plane_org = new THREE.Vector3(
            (positions[0].x + positions[1].x + positions[2].x) / 3,
            (positions[0].y + positions[1].y + positions[2].y) / 3,
            (positions[0].z + positions[1].z + positions[2].z) / 3,
        )

        const random_direction = new THREE.Vector3()
        random_direction.randomDirection()


        positions[0].sub(plane_org)
        positions[1].sub(plane_org)
        positions[2].sub(plane_org)

        const projected = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
        projected[0].copy(random_direction)
        projected[1].copy(random_direction)
        projected[2].copy(random_direction)


        projected[0].projectOnVector(positions[0])
        projected[1].projectOnVector(positions[1])
        projected[2].projectOnVector(positions[2])

    
        const regen_position = new THREE.Vector3()
        regen_position.set(
            projected[0].x + projected[1].x + projected[2].x,
            projected[0].y + projected[1].y + projected[2].y,
            projected[0].z + projected[1].z + projected[2].z,
        )

        regen_position.multiplyScalar(0.1)
        regen_position.add(plane_org)

        let regen_matrix = new THREE.Matrix4()
        regen_matrix.copy(this.origin_matrix)
        regen_matrix.multiply(new THREE.Matrix4().setPosition(regen_position))


        regen_position.set(
            regen_matrix.elements[12],regen_matrix.elements[13], regen_matrix.elements[14]
        )


        return regen_position
    }


}

