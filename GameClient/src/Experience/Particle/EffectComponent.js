import * as THREE from 'three'
import Experience from '../Experience.js'
import ParticleScatter from './ParticleScatter.js'
import TrailEffect from "./TrailEffect.js"


export default class EffectComponent{
    constructor(particle_params, trail_params){
        this.instance = new THREE.Object3D()
        this.instance.renderOrder = 10
        this.attached_item = null


        this.experience = new Experience()

        this.particle_scatters = []

        particle_params.forEach(param => {
            let ret = new ParticleScatter(param, this.instance)
            this.particle_scatters.push(ret)
            this.instance.attach(ret.instance)
        })


        this.trail_effects = []
        trail_params.forEach(param => {
            let ret = new TrailEffect(param, this.instance)
            this.trail_effects.push(ret)
            this.instance.attach(ret.instance)
        })


        this.update_Filter = {
            "particle" : new Array(particle_params.length).fill(true),
            "trail" : new Array(trail_params.length).fill(true)
        }



        this.experience.scene.add(this.instance)

    }


    get position() { return this.instance.position }



    Destroy(){
        this.particle_scatters.forEach(obj => {
            obj.Destroy()
        })


        this.trail_effects.forEach(obj => {
            obj.Destroy()
        })


        this.instance.clear()
        this.experience.scene.remove(this.instance)
    }



    Aim_Fire(index, targets){
        this.particle_scatters[index].Aim_Fire(targets)

    }


    Burst(index) {
        this.particle_scatters[index].Burst()
    }
    


    Update(deltaTime) {
        // this.accTime += (deltaTime)
        // this.instance.translateZ(0.01)
        // this.instance.rotateY(0.005)
        // this.instance.position.set(0, 4 + 3 * Math.sin(this.accTime / 300) ,0)
        this.instance.updateMatrix()
        this.particle_scatters.forEach((obj, index) => {
            // if (this.update_Filter["particle"][index] == true)
            obj.Update(deltaTime)
        })


        this.trail_effects.forEach((obj, index) => {
            // if (this.update_Filter["trail"][index] == true)
            obj.Update(deltaTime)
        })
    }



    SetUpdateFilter(channel, flag) {
        this.update_Filter[`${channel}`] = flag
    }



    Inactive(channel, index){
        if(channel == "particle")
            this.particle_scatters[index].Inactive()
        else if(channel == "trail")
            this.trail_effects[index].Inactive()
    }


    Get_Max_Life() {
        let left_time = -200000000

        this.particle_scatters.forEach(scatter => {
            let nValue = scatter.Get_Max_Life()
            left_time = Math.max(left_time, nValue)
        })

        return left_time
    }

}