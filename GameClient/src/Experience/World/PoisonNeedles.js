import * as THREE from 'three'
import Experience from '../Experience.js'
import EffectComponent from '../Particle/EffectComponent.js'
// import Weapon from './Items/Weapon.js'
import gsap from 'gsap'


let cylinder_ = new THREE.CylinderGeometry(0.01, 0.05, 1, 16)
// console.log(cylinder_)
cylinder_.rotateX(Math.PI / 2)

// let cylinder_positions_arr = cylinder_.attributes.position.array
// let cylinder_positions_cnt = cylinder_.attributes.position.count
// for (let i = 0; i < cylinder_positions_cnt; i += 3) {
//     cylinder_positions_arr[3 * i] *= 0.01;
//     cylinder_positions_arr[3 * i + 1] *= 0.01;
//     cylinder_positions_arr[3 * i + 2] *= 0.01;
// }


export default class PoisonNeedles {
    constructor(from, to) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.material_manager = this.experience.material

        this.Init(from, to)
    }


    get instance() {return this.effect_obj.instance}

    get id() { return this.effect_obj.instance.id }



    Init(from, to) {

        let distance_ = from.distanceTo(to) * 1.3
        let velocity_ = distance_ / 0.2



        this.particle_params = [
            {
                fire_type : "stream",    // "burst" or "stream".
                burst_cnt : null,
                particle_geometry: cylinder_.clone(),
                particle_material : this.material_manager.referenceMaterial("shootingStar-particle"),
                particle_texture : "none",
                mainbody_lifetime: 200,
                colors: [
                    new THREE.Color("#0000ff"),
                    new THREE.Color("#0033ff")
                ],
                origin_position: new THREE.Vector3(0, 0, -0.5),
                direction_heritaged: true,
                direction_theta: Math.PI / 8,
                direction_scale: new THREE.Vector3(1.0, 0.2, 1.0),
                regen_area_type: false,
                regen_area: cylinder_,
                create_interval_time: 10,
                create_interval_time_random: 0,
                // rotation_angle : Math.PI / 6,
                rotation_angle_random : 0,
                particle_life_time: 200,
                particle_life_time_random: 0,
                speed: velocity_,
                speed_end : velocity_,
                speed_random: 0.0,
                opacity_interpolation : "None"
            },
        ]

        this.effect_obj = new EffectComponent(this.particle_params, [])
        this.effect_obj.instance.position.copy(from)
        this.effect_obj.instance.lookAt(to)

        // this.effect_obj.instance.position.setX(Math.random() * 30 - 15)
        // this.effect_obj.instance.rotateY(Math.random() * Math.PI * 2)

        // this.effect_obj = new EffectComponent([], [{}])
        // this.effect_obj.instance.position.set(0, 3.5, 8)
        // this.effect_obj.instance.rotateY(Math.PI / 2)

        
        // this.time.on('tick', (deltaTime) => {
        //     // console.log(deltaTime)
            
        //     this.Update(deltaTime)
        // })

        this.world.Add_AnimationObject(this.id, this)

        // setInterval(()=>{this.Explode()}, 1750)


        setTimeout(() => { this.Destroy() }, this.particle_params[0].mainbody_lifetime * 4)

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