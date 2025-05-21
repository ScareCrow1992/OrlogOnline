import * as THREE from "three"
import Experience from '../../Experience.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { gsap } from "gsap"

export default class DoubleCube {
    constructor() {
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.owner = null   // top or bottom
        this.doubling_index = 0
        this.proposed_cnt = 0


        this.anchor = new THREE.Vector3(-12, -50, 0)
        this.anchor_setup = this.anchor.clone()
        this.anchor_setup.x -= 3.5

        this.Initialize()

        this.rotations=[
            new THREE.Quaternion(0, 0, 0, 1),
            new THREE.Quaternion(-0.707, 0, 0, 0.707),
            new THREE.Quaternion(0, 0, 0.707, 0.707),
            new THREE.Quaternion(0, 0, -0.707, 0.707),
            new THREE.Quaternion(1, 0, 0, 0),
            // new THREE.Quaternion(0.707, 0, 0, 0.707)
        ]
    }


    GetInstance(){
        return this.instance
    }



    
    MoveTo(goal){
        gsap.to(this.instance.position, {duration : 0.15, ease : "none", x : goal.x})
    }


    Setup(){
        this.MoveTo(this.anchor_setup)
    }


    Organize(){
        this.MoveTo(this.anchor)
    }




    GameOver(){
        this.owner = null
        this.doubling_index = 0
        this.proposed_cnt = 0

        
        let position_ = this.anchor
        let quaternion_ = this.rotations[0]

        this.Animation_Transform(position_, quaternion_)
        // this.StartResolutionPhase()

        
        let index_length = this.rotations.length
        for(let i=0 ; i<index_length; i++){
            this.text_mesh[i].layers.disable(1)
            this.text_mesh[i].material.color.setRGB(0.15, 0.15, 0.15)
        }

        
        this.text_mesh[0].material.color.setRGB(1, 1, 1)


        // 중앙으로 이동
    }


    getID(){
        return this.instance.id
    }


    CreateTextGeometry(text){
        let font_ = this.resources.items["font_tektur"]
        const text_geometry = new TextGeometry( text, {
            font: font_,
            size: 1.25,
            height: 0.05,
            curveSegments: 1,
            bevelEnabled: false,
            // bevelThickness: 0.1,
            // bevelSize: 0.1,
            // bevelOffset: 0,
            // bevelSegments: 3
        } );

        let position_arr = text_geometry.attributes.position.array
        let uv_arr = text_geometry.attributes.uv.array
        
        let X_min_value = 200000000
        let X_max_value = -200000000

        let Y_min_value = 200000000
        let Y_max_value = -200000000

        
        let Z_min_value = 200000000
        let Z_max_value = -200000000
        let j = 0
        for (let i = 0; i < position_arr.length; i += 3, j += 2) {
            X_min_value = Math.min(X_min_value, position_arr[i])
            X_max_value = Math.max(X_max_value, position_arr[i])
            
            Y_min_value = Math.min(Y_min_value, position_arr[i + 1])
            Y_max_value = Math.max(Y_max_value, position_arr[i + 1])

            Z_min_value = Math.min(Z_min_value, position_arr[i + 2])
            Z_max_value = Math.max(Z_max_value, position_arr[i + 2])

            uv_arr[j] = position_arr[i]
            uv_arr[j + 1] = position_arr[i + 1]
        }

        let x_offset = (X_max_value - X_min_value) / 2
        let y_offset = (Y_max_value - Y_min_value) / 2
        let z_offset = (Z_max_value - Z_min_value) / 2
        
        j = 0
        for (let i = 0; i < position_arr.length; i += 3, j += 2) {
            position_arr[i] -= x_offset
            position_arr[i + 1] -= y_offset
            position_arr[i + 2] -= z_offset

            position_arr[i] *= 1.25

            uv_arr[j] /= (X_max_value)
            uv_arr[j + 1] /= (Y_max_value)

        }

        return text_geometry
    }


    Hover_On(){}


    Hover_Off(){}

    // 중앙으로 이동
    DoubleGame(owner, double_index){
        this.proposed_cnt++
        this.text_mesh[double_index - 1].material.color.setRGB(0.15, 0.15, 0.15)
        this.text_mesh[double_index - 1].layers.disable(1)

        if(this.proposed_cnt == 1)
            this.text_mesh[double_index].material.color.setRGB(1, 1, 1)
        else if(this.proposed_cnt == 2)
            this.text_mesh[double_index].material.color.setRGB(1, 0.05, 0.05)


        this.text_mesh[double_index].layers.enable(1)

        this.owner = owner
        this.doubling_index = double_index

        let position_ = this.experience.controller.avatars[`${owner}`].doubleCubeAnchor

        
        if(double_index == this.rotations.length - 1){
            position_ = position_.clone()
            position_.z = 0
        }


        let quaternion_ = this.rotations[double_index]

        this.Animation_Transform(position_, quaternion_)
    }


    StartResolutionPhase(){
        this.text_mesh[this.doubling_index].layers.disable(1)
        this.text_mesh[this.doubling_index].material.color.setRGB(1, 1, 1)
    }


    // 소유자의 anchor로 이동
    Move_To_Anchor(){



    }


    ResetRound(){
        this.proposed_cnt = 0
    }




    Animation_Transform(position, quaternion){
        // this.GetInstance().position.copy(position)
        // this.GetInstance().quaternion.copy(quaternion)

        let instance_ = this.GetInstance()

        let tween_ = gsap.to(instance_.position, { duration: 0.4, ease: "none", x: position.x, z: position.z })
           
        gsap.timeline()
            .to(instance_.position, { duration: 0.2, ease: "sine.out", y: 3.5 })
            .to(instance_.position, { duration: 0.2, ease: "sine.in", y: position.y })

        tween_.eventCallback("onUpdate", () => instance_.quaternion.slerp(quaternion, tween_.time() / 0.4))
        tween_.eventCallback("onComplete", () => instance_.quaternion.copy(quaternion))

    }


    Initialize(){
        let curved_cube = new THREE.BoxGeometry(2,2,2,32,32,32)
        let curved_cube_rardius = 2 * (2 / 3)
        let vertex_arr = curved_cube.attributes.position.array
        let normal_arr = curved_cube.attributes.normal.array
        for (let i = 0; i < vertex_arr.length; i += 3) {
            let position_ = new THREE.Vector3()
            position_.set(vertex_arr[i], vertex_arr[i + 1], vertex_arr[i + 2])

            if(position_.distanceToSquared(this.scene.position) > (curved_cube_rardius * curved_cube_rardius)){
                position_.normalize();

                vertex_arr[i] = position_.x * curved_cube_rardius
                vertex_arr[i + 1] = position_.y * curved_cube_rardius
                vertex_arr[i + 2] = position_.z * curved_cube_rardius   

                normal_arr[i] = position_.x
                normal_arr[i + 1] = position_.y
                normal_arr[i + 2] = position_.z
            }
        }

        curved_cube.computeVertexNormals()


        let map_ = this.resources.items["doublecube_map"]
        // let map_ = this.resources.items["uv_checker"]

        map_.encoding = THREE.sRGBEncoding
        // map_.repeat.set(1,1)
        // map_.wrapS = THREE.RepeatWrapping
        // map_.wrapT = THREE.RepeatWrapping

        let curved_cube_mat = new THREE.MeshStandardMaterial({ 
            // color : "white",
            envMapIntensity : 2.5, 
            map : map_,
            metalness : 0.4,
            roughness : 0.6
        })
        this.instance = new THREE.Mesh(curved_cube, curved_cube_mat)
        this.instance.position.copy(this.anchor)

        this.scene.add(this.instance)

        this.instance.castShadow = true;

        let text_map = this.resources.items["doublecube_number_map"]
        text_map.encoding = THREE.sRGBEncoding
        // text_map.repeat.set(0.15, 0.15)
        // text_map.offset.set(0.15, 0.15)
        
        let text_material = new THREE.MeshStandardMaterial({ map : text_map })

        let text_geometry = [
            this.CreateTextGeometry("1"),
            this.CreateTextGeometry("2"),
            this.CreateTextGeometry("4"),
            this.CreateTextGeometry("6"),
            this.CreateTextGeometry("8"),
            this.CreateTextGeometry("X")
        ]
        
        this.text_mesh = [
            new THREE.Mesh(text_geometry[0], text_material.clone()),
            new THREE.Mesh(text_geometry[1], text_material.clone()),
            new THREE.Mesh(text_geometry[2], text_material.clone()),
            new THREE.Mesh(text_geometry[3], text_material.clone()),
            new THREE.Mesh(text_geometry[4], text_material.clone()),
            new THREE.Mesh(text_geometry[5], text_material.clone())
        ]

        this.text_mesh[0].position.set(0, 1, 0)
        this.text_mesh[0].rotateX(-Math.PI / 2)
        this.scene.add(this.text_mesh[0])

        this.text_mesh[1].position.set(0, 0, 1)
        this.scene.add(this.text_mesh[1])

        this.text_mesh[2].position.set(1, 0, 0)
        this.text_mesh[2].rotateX(-Math.PI / 2)
        this.text_mesh[2].rotateY(Math.PI / 2)
        this.scene.add(this.text_mesh[2])

        this.text_mesh[3].position.set(-1, 0, 0)
        this.text_mesh[3].rotateX(-Math.PI / 2)
        this.text_mesh[3].rotateY(-Math.PI / 2)
        this.scene.add(this.text_mesh[3])


        this.text_mesh[4].position.set(0, -1, 0)
        this.text_mesh[4].rotateX(Math.PI / 2)
        this.scene.add(this.text_mesh[4])

        
        this.text_mesh[5].position.set(0, 0, -1)
        this.text_mesh[5].rotateX(Math.PI)
        this.scene.add(this.text_mesh[5])

        
        this.text_mesh.forEach(text_mesh_=>{
            text_mesh_.material.color.setRGB(0.15, 0.15, 0.15)
            this.instance.add(text_mesh_)
        })

        
        this.text_mesh[0].material.color.setRGB(1, 1, 1)



        // this.instance.rotateX(Math.PI / 2)
        // console.log(this.instance.rotation)
        // this.instance.rotation.set(-Math.PI / 2, 0, 0)
        // console.log(this.instance.quaternion)


        // 2 : (-Math.PI / 2, 0, 0)
        // 4 : (0, 0, 0)
        // 8 : (0, 0, Math.PI / 2)
        
    }
    

}