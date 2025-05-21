import * as THREE from 'three'
import Experience from '../Experience.js'
import * as Curves from 'three/addons/curves/CurveExtras.js';


export default class Towel {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()


        let carpetborder_top = this.createCarpetBorder()
        carpetborder_top.position.y = -0.325
        carpetborder_top.position.z = -10
        this.scene.add(carpetborder_top)

        let wood_table = this.createWoodTable()
        wood_table.position.z = -15
        wood_table.position.y = -0.5
        this.scene.add(wood_table)

        // let carpetborder_bottom = this.createCarpetBorder()
        // carpetborder_bottom.position.y = -0.4
        // carpetborder_bottom.position.z = 10.125
        // this.scene.add(carpetborder_bottom)

        this.setDebug()


    }


    createCarpetBorder(){
        // const pipeSpline = new THREE.CatmullRomCurve3([
        //     new THREE.Vector3(-20, 0, 0),
        //     new THREE.Vector3(-10, 0, -0.5),
        //     new THREE.Vector3(0, 0, 0),
        //     new THREE.Vector3(10, 0, 0.5),
        //     new THREE.Vector3(20, 0, 0)
        // ])
        let points = []
        for(let x = -30; x <= 30; x += 6){
            points.push(new THREE.Vector3(x, 0, (Math.random() - 0.5) * 0.5))
        }


        const pipeSpline = new THREE.CatmullRomCurve3(points)

        // const points = pipeSpline.getPoints( 50 );
        // console.log(points)

        // let carpet_border_texture = this.resources.items["uv_band"]
        let carpet_border_texture = this.resources.items["carpet_border_O"]

        
        carpet_border_texture.repeat.set(5, 3);
        carpet_border_texture.encoding = THREE.sRGBEncoding;
        carpet_border_texture.wrapS = THREE.RepeatWrapping
        carpet_border_texture.wrapT = THREE.RepeatWrapping
        carpet_border_texture.anisotropy = 8;


        const pipe_geometry = new THREE.TubeGeometry( pipeSpline, 64, 0.75, 3, false );
        const pipe_material = new THREE.MeshStandardMaterial({ 
            // color : "white",
            map: carpet_border_texture,
            bumpScale: 0.0005,
            // metalness : 0.0,
            roughness : 0.95,
            envMapIntensity : 3
        })
        const pipe_mesh = new THREE.Mesh(pipe_geometry, pipe_material)
        
        // pipe_mesh.position.y = -0.4
        // pipe_mesh.position.z = -10
        pipe_mesh.rotateZ(Math.PI)


        return pipe_mesh

    }

    createWoodTable(){
        let color_map = this.resources.items["wood02_map"]
        let normal_map = this.resources.items["wood02_normal"]
        let roughness_map = this.resources.items["wood02_roughness"]

        color_map.encoding = THREE.sRGBEncoding
        normal_map.encoding = THREE.sRGBEncoding
        roughness_map.encoding = THREE.sRGBEncoding

        
        color_map.repeat.set(4,4)
        normal_map.repeat.set(4,4)
        roughness_map.repeat.set(4,4)

        color_map.wrapS = THREE.RepeatWrapping
        color_map.wrapT = THREE.RepeatWrapping

        normal_map.wrapS = THREE.RepeatWrapping
        normal_map.wrapT = THREE.RepeatWrapping
        
        roughness_map.wrapS = THREE.RepeatWrapping
        roughness_map.wrapT = THREE.RepeatWrapping

        // let test_map = this.resources.items["uv_band"]
        // test_map.repeat.set(1, 2)
        // test_map.wrapS = THREE.RepeatWrapping
        // test_map.wrapT = THREE.RepeatWrapping

        let geo = new THREE.PlaneGeometry(60, 15, 64, 16)
        this.wood_mat = new THREE.MeshStandardMaterial({
            // map : test_map
            map : color_map,
            normalMap : normal_map,
            roughnessMap : roughness_map,
            metalness : 0.3,
            roughness : 0.7
        })

        let mesh = new THREE.Mesh(geo, this.wood_mat)
        mesh.rotation.x = - Math.PI * 0.5


        return mesh
    }


    setGeometry() {
        this.geometry = new THREE.PlaneGeometry( 60, 40, 64, 64 );
    }

    setTextures() {
        this.textures = {}

        // this.textures.color = this.resources.items.towelTexture
        // this.textures.color.encoding = THREE.sRGBEncoding
        // this.textures.color.repeat.set(5, 5)
        // this.textures.color.wrapS = THREE.RepeatWrapping
        // this.textures.color.wrapT = THREE.RepeatWrapping

        // let textureName = ["textureAO", "textureArm", "textureDiffuse", "textureNormal", "textureRoughness"]
        
        // this.textureAO = this.resources.items.denmin_fabric_02_ao
        // this.textureArm = this.resources.items.denmin_fabric_02_arm
        // this.textureDiffuse = this.resources.items.denmin_fabric_02_diff
        // this.textureNormal = this.resources.items.denmin_fabric_02_nor
        // this.textureRoughness = this.resources.items.denmin_fabric_02_rough

        let textureName = ["textureArm", "textureNormal", "textureDiffuse"]

        this.textureArm = this.resources.items.book_pattern_arm
        this.textureDiffuse = this.resources.items.book_pattern_diff_I
        this.textureNormal = this.resources.items.book_pattern_nor

        // this.textureArm = this.resources.items.fabric_pattern_05_arm
        // this.textureDiffuse = this.resources.items.fabric_pattern_05_col_01
        // this.textureNormal = this.resources.items.fabric_pattern_nor



        textureName.forEach(texture => {
            this[`${texture}`].encoding = THREE.sRGBEncoding;
            this[`${texture}`].repeat.set(4.5 / 2, 1.5);
            this[`${texture}`].wrapS = THREE.RepeatWrapping
            this[`${texture}`].wrapT = THREE.RepeatWrapping
            this[`${texture}`].anisotropy = 8;
            // this[`${texture}`].rotation = Math.PI / 2
        })


    }

    setMaterial() {
        // this.material = new THREE.MeshStandardMaterial({
        //     map: this.textures.color
        // })

        // this.material = new THREE.MeshStandardMaterial({
        //     map : this.textureDiffuse,
        //     normalMap : this.textureNormal,
        //     aoMap : this.textureAO,
        //     roughnessMap : this.textureRoughness,
        //     bumpScale: 0.0005
        // })

        this.material = new THREE.MeshStandardMaterial({
            map : this.textureDiffuse,
            normalMap : this.textureNormal,
            normalScale : new THREE.Vector2(0.5, 0.5),
            aoMap : this.textureArm,
            roughnessMap : this.textureArm,
            bumpScale: 0.0005,
            metalness : 0.2,
            roughness : 0.8,
            
            // metalness : 0.8,
            // roughness : 0.2

        })

    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.position.z = 10
        // this.mesh.rotation.z = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }


    setDebug(){
        if (this.debug.active) {
            
            this.debugFolder = this.debug.ui.addFolder(`Table`);

            this.debugFolder
                .addColor(this.wood_mat, "color")

            // this.debugFolder
            //     .addColor(this.material, "color")

            // this.debugFolder
            //     .addColor(this.material, "emissive")
                
            // this.debugFolder
            // .add(this.material, "emissiveIntensity")
            // .name('emissiveIntensity')
            // .min(0)
            // .max(1)
            // .step(0.001)
            // .listen()

            // this.debugFolder
            //     .add(this.material, 'displacementScale')
            //     .name('symbol displacement Scale')
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material, 'displacementBias')
            //     .name('symbol displacement Bias')
            //     .min(-2)
            //     .max(2)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material, 'aoMapIntensity')
            //     .name('aoMapIntensity')
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material.normalScale, 'x')
            //     .name('normal Scale X')
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material.normalScale, 'y')
            //     .name('normal Scale Y')
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material, 'metalness')
            //     .name('metalness')
            //     .min(0)
            //     .max(1)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.material, 'roughness')
            //     .name('roughness')
            //     .min(0)
            //     .max(3)
            //     .step(0.001)
            //     .listen()


            // this.debugFolder
            //     .add(this.mesh.position, 'x')
            //     .name('position X')
            //     .min(-10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'y')
            //     .name('position Y')
            //     .min(-1)
            //     .max(5)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'z')
            //     .name('position Z')
            //     .min(-10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()



        }

    }

}