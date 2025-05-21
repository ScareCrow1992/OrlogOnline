import * as THREE from 'three'
import Experience from '../Experience.js'
import EffectComponent from '../Particle/EffectComponent.js'
// import Weapon from './Items/Weapon.js'
import gsap from 'gsap'


let cylinder_ = new THREE.CylinderGeometry(1, 1, 1)
// console.log(cylinder_)
cylinder_.rotateX(Math.PI / 2)

// let cylinder_positions_arr = cylinder_.attributes.position.array
// let cylinder_positions_cnt = cylinder_.attributes.position.count
// for (let i = 0; i < cylinder_positions_cnt; i += 3) {
//     cylinder_positions_arr[3 * i] *= 0.01;
//     cylinder_positions_arr[3 * i + 1] *= 0.01;
//     cylinder_positions_arr[3 * i + 2] *= 0.01;
// }


export default class HealingBall {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.material_manager = this.experience.material

        this.Init()
    }


    get instance() {return this.effect_obj.instance}

    get id() { return this.effect_obj.instance.id }



    Init() {

        this.particle_params = [
            {
                fire_type : "stream",    // "burst" or "stream".
                burst_cnt : null,
                particle_geometry: new THREE.TorusGeometry(0.125 / 3, 0.075 / 3, 5, 16),
                particle_material : this.material_manager.referenceMaterial("shootingStar-particle"),
                particle_texture : "none",
                mainbody_lifetime: null,
                colors: [
                    new THREE.Color("#88ff00"),
                    new THREE.Color("#88ff00"),
                    // new THREE.Color("#88ff00"),
                    // new THREE.Color("#ffffff")
                ],
                origin_position: new THREE.Vector3(0, 0, -0.5),
                direction_heritaged: false,
                direction_theta: Math.PI / 2,
                regen_area_type: false,
                regen_area: cylinder_,
                create_interval_time: 10,
                create_interval_time_random: 0,
                // rotation_angle : Math.PI / 6,
                rotation_angle_random : Math.PI / 6,
                particle_life_time: 400,
                particle_life_time_random: 20,
                speed: 4,
                speed_end : 0,
                speed_random: 0.1
            },
            {
                fire_type : "burst",    // "burst" or "stream".
                burst_cnt : 80,
                // particle_geometry : new THREE.TorusGeometry(0.125 * 0.666, 0.075 * 0.666, 5, 16),
                particle_geometry : new THREE.BoxGeometry(0.1, 0.1, 0.1),
                particle_material : this.material_manager.referenceMaterial("shootingStar-particle"),
                particle_texture : "none",
                mainbody_lifetime: null,
                colors: [
                    new THREE.Color("#88dd22"),
                    new THREE.Color("#88dd88"),
                ],
                origin_position: new THREE.Vector3(0, 0, 0),
                direction_heritaged: true,
                direction_theta: null,
                regen_area_type: false,
                regen_area: new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
                create_interval_time: null,
                create_interval_time_random: null,
                rotation_angle_random : Math.PI / 6,
                particle_life_time: 600,
                particle_life_time_random: 0,
                speed: 6,
                speed_end : 0,
                speed_random: 4
            }
        ]

        this.effect_obj = new EffectComponent(this.particle_params, [{ name: "healingBall" }])

        this.world.Add_AnimationObject(this.id, this)
    }



    Move(from, to, duration) {
        let peak_height = 4


        let tl_ = gsap.timeline()
        this.instance.position.copy(from)
        this.instance.position.setComponent(1, to.y)

        let tmp_obj_from = new THREE.Object3D()
        tmp_obj_from.position.copy(this.instance.position)

        let tmp_obj_peak = new THREE.Object3D()
        tmp_obj_peak.position.addVectors(this.instance.position, to)
        tmp_obj_peak.position.multiplyScalar(0.5)
        tmp_obj_peak.position.setComponent(1, to.y + peak_height)

        tmp_obj_from.lookAt(tmp_obj_peak.position)
        tmp_obj_from.rotateX(-Math.PI / 6)


        tmp_obj_peak.lookAt(to)
        tmp_obj_peak.rotateX(Math.PI / 6)


        let from_quaternion = tmp_obj_from.quaternion
        let to_quaternion = tmp_obj_peak.quaternion


        this.instance.quaternion.copy(from_quaternion)
        tl_.to(this.instance.position, { ease: "none", x: to.x, z: to.z, duration: duration, onComplete: () => { this.Explode(); this.Inactive(); this.Destroy() },
        onUpdate : ()=>{
            this.instance.quaternion.slerpQuaternions(from_quaternion, to_quaternion, tl_.time() / duration)
        } })


        gsap.timeline()
            .to(this.instance.position, { ease: "Power1.easeOut", y: to.y + peak_height, duration: duration / 2 })
            .to(this.instance.position, { ease: "Power1.easeIn", y: to.y, duration: duration / 2 })

        return tl_
    }



    Fire(){

    }


    Inactive(){
        this.effect_obj.Inactive("particle", 0)
        this.effect_obj.Inactive("trail", 0)
    }


    SetUpdateFilter(channel, value){
        // channel : string
        // value : bool
        
        this.effect_obj.SetUpdateFilter(channel, value)
    }


    Explode(){
        this.effect_obj.Burst(1)
        this.Destroy()
    }


    Destroy(){
        let left_time = this.effect_obj.Get_Max_Life()
        // console.log("left time : ", left_time)

        setTimeout(()=>{
            this.world.Remove_AnimationObject(this.id)
            this.effect_obj.Destroy()

        }, left_time)

    }


    Update(deltaTime){
        this.effect_obj.Update(deltaTime)

        // this.instance.translateZ(0.05)
        // this.instance.rotateOnWorldAxis(this.scene.up, 0.0075)

    }


}