import * as THREE from 'three'
import Experience from '../../Experience.js'
// import DiceFace from './DiceFace.js'

import gsap from 'gsap';


function GeometryResize(geometry){

    let U_min_value = 200000000
    let U_max_value = -200000000

    let V_min_value = 200000000
    let V_max_value = -200000000


    let position_arr = geometry.attributes.position.array
    for (let i = 0; i < position_arr.length; i += 3) {
        geometry.attributes.position.array[i] *= 0.003;
        geometry.attributes.position.array[i + 1] *= 0.003;
        geometry.attributes.position.array[i + 2] *= 0.003;
    }


    let uv_arr = geometry.attributes.uv.array
    for (let i = 0; i < uv_arr.length; i += 2) {
        
        let U_value = uv_arr[i]
        U_min_value = Math.min(U_min_value, U_value)
        U_max_value = Math.max(U_max_value, U_value)

        
        let V_value = uv_arr[i + 1]
        V_min_value = Math.min(V_min_value, V_value)
        V_max_value = Math.max(V_max_value, V_value)

    }

    let offset_X = U_max_value
    let offset_Y = V_max_value * 2

    
    for (let i = 0; i < uv_arr.length; i += 2) {
        geometry.attributes.uv.array[i] = (geometry.attributes.uv.array[i] + offset_X/ 2) / offset_X
        geometry.attributes.uv.array[i + 1] = (geometry.attributes.uv.array[i + 1] + offset_Y / 2) / offset_Y
    }


    geometry.computeVertexNormals()
}



// ragnarok_token
export default class Ragnarok {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.debug = this.experience.debug
        this.scene = this.experience.scene


        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setDebug()
    }






    setGeometry(){

        let extrudeSettings = {
            steps: 1,
            depth: 64,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 1
        }


        console.log(this.resources.items["ragnarok_token"])
        
        this.geometry = [
            new THREE.ExtrudeGeometry(this.resources.items["ragnarok_token"][0], extrudeSettings),
            new THREE.ExtrudeGeometry(this.resources.items["ragnarok_token"][1], extrudeSettings),
            new THREE.ExtrudeGeometry(this.resources.items["ragnarok_token"][2], extrudeSettings)

        ]
        
        this.geometry.forEach(GeometryResize)

        // GeometryResize(this.geometry[0])
        // GeometryResize(this.geometry[1])

    
        // let U_min_value = 200000000
        // let U_max_value = -200000000

        // let V_min_value = 200000000
        // let V_max_value = -200000000


        // let position_arr = this.geometry.attributes.position.array
        // for (let i = 0; i < position_arr.length; i += 3) {
        //     this.geometry.attributes.position.array[i] *= 0.008;
        //     this.geometry.attributes.position.array[i + 1] *= 0.008;
        //     this.geometry.attributes.position.array[i + 2] *= 0.008;
        // }


        // let uv_arr = this.geometry.attributes.uv.array
        // for (let i = 0; i < uv_arr.length; i += 2) {
            
        //     let U_value = uv_arr[i]
        //     U_min_value = Math.min(U_min_value, U_value)
        //     U_max_value = Math.max(U_max_value, U_value)

            
        //     let V_value = uv_arr[i + 1]
        //     V_min_value = Math.min(V_min_value, V_value)
        //     V_max_value = Math.max(V_max_value, V_value)

        // }

        // let offset_X = U_max_value
        // let offset_Y = V_max_value * 2

        
        // for (let i = 0; i < uv_arr.length; i += 2) {
        //     this.geometry.attributes.uv.array[i] = (this.geometry.attributes.uv.array[i] + offset_X/ 2) / offset_X
        //     this.geometry.attributes.uv.array[i + 1] = (this.geometry.attributes.uv.array[i + 1] + offset_Y / 2) / offset_Y
        // }

    }


    setMaterial(){
        this.material = [
            new THREE.MeshStandardMaterial({
                color : "#07064c",
                metalness : 0.9,
                roughness : 0.1
            }),
            new THREE.MeshStandardMaterial({
                color : "#2848e6",
                metalness : 0.9,
                roughness : 0.1
            })
        ]

    }



    setMesh(){
        this.mesh = [
            new THREE.Mesh(this.geometry[0], this.material[0]),
            new THREE.Mesh(this.geometry[1], this.material[1]),
            new THREE.Mesh(this.geometry[2], this.material[1])
        ] 

        this.mesh[0].rotateX(-Math.PI / 2)
        this.mesh[1].rotateX(-Math.PI / 2)
        this.mesh[2].rotateX(-Math.PI / 2)

        
        // this.mesh[0].geometry.computeVertexNormal()
        // this.mesh[1].geometry.computeVertexNormal()


        this.mesh[0].position.set(0, 1, 0)
        this.mesh[0].scale.set(0.975, 0.975, 0.8)
        this.mesh[1].position.set(0, 1, 0)
        this.mesh[2].position.set(0, 1, 0)

        this.scene.add(this.mesh[0])
        this.scene.add(this.mesh[1])
        this.scene.add(this.mesh[2])


    }



    

    setDebug(){
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('clock')

            this.debugFolder
                .addColor(this.material[0], 'color')
                .name("body_color")


            this.debugFolder
                .addColor(this.material[1], 'color')
                .name("body_color")





//this.switch_toggle.material
        }
    }

}

