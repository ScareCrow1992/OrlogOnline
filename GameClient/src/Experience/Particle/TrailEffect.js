import * as THREE from 'three'
import Experience from '../Experience.js'


export default class TrailEffect{
    constructor(param, parent){
        this.experience =new Experience()
        this.param = param
        this.parent = parent
        this.time_remaing = 0

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.material_manager = this.experience.material

        // window.addEventListener("keydown", (event) => {
        //     if (event.key === "s") {
        //         // console.log("material compiled")
        //         this.sprite_mesh.material.needsUpdate = true
        //     }
        // })

        this.Init()
    }

    get instance() { return this.sprite_mesh }



    Init(){
        let projectile_tex =  this.resources.items["particle_muzzle_01"]
        projectile_tex.encoding = THREE.sRGBEncoding
        let noise_texture = this.resources.items["perlin_noise"]
        // let noise_texture = this.resources.items["perlin_noise"].clone()
        // noise_texture.encoding = THREE.sRGBEncoding
        // noise_texture.wrapS = THREE.RepeatWrapping;
        // noise_texture.wrapT = THREE.RepeatWrapping;
        // noise_texture.repeat.set(4, 4)
        

        let projectile_mat = this.material_manager.referenceMaterial(this.param.name)


        // let projectile_geo = new THREE.PlaneGeometry(1, 1.5, 7, 7)
        let projectile_geo = new THREE.PlaneGeometry(1.5, 2.25, 7, 7)

        this.sprite_mesh = new THREE.Mesh(projectile_geo, projectile_mat)
        
        // this.sprite_mesh.position.set(-3,5,3)
        this.sprite_mesh.rotateX(-Math.PI / 2)
        this.sprite_mesh.translateY(1)
        // this.sprite_mesh.rotateZ(-Math.PI / 2)
        this.sprite_mesh.updateMatrix()
        // this.projectile_sprite.layers.enable(1)
        this.sprite_mesh.layers.enable(1)

        // console.log(this.sprite_mesh.matrix)

        let geo_arr = this.sprite_mesh.geometry.attributes.position.array
        let geo_size = this.sprite_mesh.geometry.attributes.position.count
        let width_ = 1 / 7
        for (let i = 0; i < geo_size; i += 8) {

            geo_arr[3 * i] *= width_
            geo_arr[3 * (i + 1)] *= width_
            geo_arr[3 * (i + 2)] *= width_
            geo_arr[3 * (i + 3)] *= width_
            geo_arr[3 * (i + 4)] *= width_
            geo_arr[3 * (i + 5)] *= width_
            geo_arr[3 * (i + 6)] *= width_
            geo_arr[3 * (i + 7)] *= width_

            width_ += (1 / 7)

        }

        // this.scene.add(this.sprite_mesh)

        // this.sprite_mesh.material.needsUpdate = true
        this.Update()
        
    }


    Destroy(){

    }

    Inactive(){
        this.parent.remove(this.instance)
    }


    Update(deltaTime) {
        // this.sprite_mesh.material.uTime.value += 0.01

        const projectile_matrix = this.parent.matrix.elements
        const basisX = new THREE.Vector3(
            projectile_matrix[0], projectile_matrix[1], projectile_matrix[2])

        const basisZ = new THREE.Vector3(
            projectile_matrix[4], projectile_matrix[5], projectile_matrix[6])

        const basisY = new THREE.Vector3(
            -projectile_matrix[8], -projectile_matrix[9], -projectile_matrix[10])

        // console.log(basisX)

        const projectile_position = this.parent.position.clone()


        const world_normal = new THREE.Vector3(0, 1, 0)

        const projected_side = this.experience.camera.instance.position.clone()
        projected_side.sub(projectile_position)
        projected_side.projectOnVector(basisX)
        // camera_position.add(projectile_position)

        // basisY.multiplyScalar(-1)
        const projected_normal = this.experience.camera.instance.position.clone()
        projected_normal.sub(projectile_position)
        projected_normal.projectOnVector(basisZ)


        let look_target = projected_side.clone()
        look_target.add(projected_normal)
        look_target.add(projectile_position)


        this.sprite_mesh.up = basisY
        // this.projectile_sprite.rotateZ(0.005)
        // this.projectile_sprite.updateMatrix()
        // this.projectile_sprite.translateY(0.005)
        this.sprite_mesh.lookAt(look_target)
        // this.projectile_sprite.rotateOnWorldAxis(this.scene.up, 0.01)



    }

}