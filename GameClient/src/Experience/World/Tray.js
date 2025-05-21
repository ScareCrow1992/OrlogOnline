import * as THREE from 'three'
import Experience from '../Experience.js'
import { gsap } from 'gsap'


export default class Tray {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.original_position = null

        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh();
        // this.setDebug()
    }



    setGeometry() {

        let radius = 2.8
        let thickness = 0.1
        this.height_ = 1.35

        this.outerWallGeometry = new THREE.CylinderGeometry(radius + thickness, radius + thickness, this.height_, 32, 4, true);
        // this.outerWallGeometry.openEnded = true;
        this.innerWallGeometry = new THREE.CylinderGeometry(radius - thickness, radius - thickness, this.height_, 32, 4, true);
        // this.innerWallGeometry.openEnded = true;
        this.thicknessGeometry = new THREE.RingGeometry(radius - thickness, radius + thickness, 32, 1)
        this.flatGeometry = new THREE.CylinderGeometry(radius - thickness, radius - thickness, thickness, 32, 3);

        //RingGeometry


        // CylinderGeometry





        // this.flatGeometry = new THREE.CylinderGeometry(2.6, 2.6, 0.1, 32, 3);

        // const points = [];
        // const radius = 25;
        // const strength = 10;

        // points.push(new THREE.Vector2(radius / strength, 0));
        // points.push(new THREE.Vector2(radius / strength, 3 / strength));
        // points.push(new THREE.Vector2(radius / strength, 6 / strength));
        // points.push(new THREE.Vector2(radius / strength, 9 / strength));
        // points.push(new THREE.Vector2(radius / strength, 12 / strength));

        // points.push(new THREE.Vector2((radius + 2) / strength, 12 / strength));
        // points.push(new THREE.Vector2((radius + 2) / strength, 9 / strength));
        // points.push(new THREE.Vector2((radius + 2) / strength, 6 / strength));
        // points.push(new THREE.Vector2((radius + 2) / strength, 3 / strength));
        // points.push(new THREE.Vector2((radius + 2) / strength, 0));

        // this.wallGeometry = new THREE.LatheGeometry(points, 32, Math.PI);
        // this.wallGeometry.computeVertexNormals()

        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        // const cylinder = new THREE.Mesh( geometry, material );


        // this.geometry = new THREE.BoxGeometry(3, 3, 3);
        // this.geometry = new THREE.BoxGeometry(1,1,1,20,20,20)
    }


    setTexture() {
        let textureName = ["textureDiffuse", "textureNormal", "textureRoughness"]

        // this.textureAO = this.resources.items.wood_table_001_ao
        // this.textureArm = this.resources.items.wood_table_001_arm
        this.textureDiffuse = this.resources.items.tray_map
        this.textureNormal = this.resources.items.tray_normal
        this.textureRoughness = this.resources.items.tray_roughness

        textureName.forEach(texture => {
            this[`${texture}`].encoding = THREE.sRGBEncoding;
            this[`${texture}`].repeat.set(1, 1);
            this[`${texture}`].wrapS = THREE.RepeatWrapping
            this[`${texture}`].wrapT = THREE.RepeatWrapping
            this[`${texture}`].anisotropy = 16;
        })

        // const uv_map = this.experience.resources.items["uv_checker"]
        // uv_map.encoding = THREE.sRGBEncoding

        // let textureName = ["textureArm", "textureDiffuse", "textureNormal"]
        // // this.textureDiffuse = this.resources.items.wood_table_worn_diff
        // this.textureDiffuse = uv_map
        // this.textureArm = this.resources.items.wood_table_worn_arm
        // this.textureNormal = this.resources.items.wood_table_worn_nor

        // textureName.forEach(texture => {
        //     this[`${texture}`].encoding = THREE.sRGBEncoding;
        //     this[`${texture}`].repeat.set(1, 1);
        //     this[`${texture}`].wrapS = THREE.RepeatWrapping
        //     this[`${texture}`].wrapT = THREE.RepeatWrapping
        //     this[`${texture}`].anisotropy = 16;
        // })


    }

    /*
    const material = new THREE.MeshStandardMaterial( {
        map: imgTexture,
        bumpMap: imgTexture,
        bumpScale: bumpScale,
        color: diffuseColor,
        metalness: beta,
        roughness: 1.0 - alpha,
        envMap: index % 2 === 0 ? null : texture
    } );
    */


    setMaterial() {
        // const gamma = 0.9;
        // const alpha = 0.2;
        // const diffuseColor = new THREE.Color().setHSL( alpha, 0.2, gamma );
        // this.material = new THREE.MeshStandardMaterial({
        //     map: this.texture,
        //     bumpMap: this.texture,
        //     bumpScale: 1.0,
        //     color: diffuseColor,
        //     metalness: 0.1,
        //     roughness: 1.0 - alpha,
        //     normalMap: this.normalMap,
        //     opacity : alpha
        // });
        // // this.material.opacity = alpha;
        // this.material.side = THREE.DoubleSide;
        // this.material.flatshading = false;

        this.material = new THREE.MeshStandardMaterial({
            map: this.textureDiffuse,
            normalMap: this.textureNormal,
            // metalnessMap: this.textureArm,
            // roughnessMap: this.textureRoughness,
            // aoMap: this.textureArm,
            envMapIntensity : 1.75,
            metalness : 0.15,
            roughness : 0.85
        })

        this.material.flatshading = false;
        this.material.side = THREE.DoubleSide;




        this.resources.items["traywall_map"].repeat.set(1.5, 1);
        this.resources.items["traywall_map"].encoding = THREE.sRGBEncoding
        this.resources.items["traywall_map"].wrapS = THREE.RepeatWrapping
        this.resources.items["traywall_map"].wrapT = THREE.RepeatWrapping

        
        this.resources.items["traywall_normal"].repeat.set(1.5, 1);
        this.resources.items["traywall_normal"].encoding = THREE.sRGBEncoding
        this.resources.items["traywall_normal"].wrapS = THREE.RepeatWrapping
        this.resources.items["traywall_normal"].wrapT = THREE.RepeatWrapping

        
        this.resources.items["traywall_roughness"].repeat.set(1.5, 1);
        this.resources.items["traywall_roughness"].encoding = THREE.sRGBEncoding
        this.resources.items["traywall_roughness"].wrapS = THREE.RepeatWrapping
        this.resources.items["traywall_roughness"].wrapT = THREE.RepeatWrapping


        this.wall_material = new THREE.MeshStandardMaterial({
            map : this.resources.items["traywall_map"],
            normalMap : this.resources.items["traywall_normal"],
            // roughnessMap : this.resources.items["traywall_roughness"],
            metalness : 0.15,
            roughness : 0.85,
            envMapIntensity : 2.5

        })
        this.wall_material.flatshading = false;
        this.wall_material.side = THREE.DoubleSide;


        
        // this.resources.items["uv_band"].repeat.set(3, 1);
        // this.resources.items["uv_band"].wrapS = THREE.RepeatWrapping
        // this.resources.items["uv_band"].wrapT = THREE.RepeatWrapping


        // this.wall_material = new THREE.MeshStandardMaterial({
        //     map : this.resources.items["uv_band"],
        //     envMapIntensity : 1.25

        // })
        // this.wall_material.flatshading = false;
        // this.wall_material.side = THREE.DoubleSide;


    }


    setMesh() {        
        this.outerWallMesh = new THREE.Mesh(this.outerWallGeometry, this.wall_material)
        this.innerWallMesh = new THREE.Mesh(this.innerWallGeometry, this.wall_material)
        this.thicknessMesh = new THREE.Mesh(this.thicknessGeometry, this.material)
        this.thicknessMesh.rotation.x -= Math.PI/2;
        this.flatMesh = new THREE.Mesh(this.flatGeometry, this.material)

        this.outerWallMesh.position.y = this.height_ / 2
        this.innerWallMesh.position.y = this.height_ / 2
        this.thicknessMesh.position.y = this.height_

        this.outerWallMesh.rotateY(Math.PI)
        // this.flatMesh.rotateY(Math.PI / 2)


        
        // let height_bias = this.height_ * (1/2 - (1/6) * (1/2))

        // this.outerWallMesh.position.y -= height_bias
        // this.innerWallMesh.position.y -= height_bias
        // this.thicknessMesh.position.y -= height_bias

        
        this.mesh = new THREE.Group();
        this.mesh.add(this.outerWallMesh)
        this.mesh.add(this.innerWallMesh)
        this.mesh.add(this.thicknessMesh)
        this.mesh.add(this.flatMesh)

        // this.outerWallMesh.receiveShadow = true;

        this.flatMesh.receiveShadow = true

        this.outerWallMesh.castShadow = true;

        this.innerWallMesh.receiveShadow = true;
        this.innerWallMesh.castShadow = true;


        // let height_bias = this.height_ / 2

        // this.thicknessMesh.receiveShadow = true;
        // this.thicknessMesh.castShadow = true;

        // this.flatGeometry.receiveShadow = true;
        // this.flatGeometry.castShadow = true;

        this.scene.add(this.mesh)




        // this.flatMesh = new THREE.Mesh(this.flatGeometry, this.material);
        // this.wallMesh = new THREE.Mesh(this.wallGeometry, this.material);

        // this.flatMesh.receiveShadow = true;
        // this.flatMesh.castShadow = true;

        // this.wallMesh.receiveShadow = true;
        // this.wallMesh.castShadow = true;

        // this.mesh = new THREE.Group();
        // this.mesh.add(this.flatMesh);
        // this.mesh.add(this.wallMesh);
        // this.scene.add(this.mesh);

    }


    Move(pos){
        return gsap.to(this.mesh.position, {duration : 0.3, ease:"none", z : pos.z})
    }


    Set_Original_Position(){
        this.original_position = this.mesh.position.clone()
    }

    Reset_Position(){
        this.Move(this.original_position)
    }

    setDebug() {
        if (this.debug.active) {
            
            this.debugFolder = this.debug.ui.addFolder(`Tray`);


            this.debugFolder
                .addColor(this.material, "color")

            this.debugFolder
                .addColor(this.material, "emissive")

            this.debugFolder
                .add(this.material, 'displacementScale')
                .name('symbol displacement Scale')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material, 'displacementBias')
                .name('symbol displacement Bias')
                .min(-2)
                .max(2)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material, 'aoMapIntensity')
                .name('aoMapIntensity')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material.normalScale, 'x')
                .name('normal Scale X')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material.normalScale, 'y')
                .name('normal Scale Y')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material, 'metalness')
                .name('metalness')
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.material, 'roughness')
                .name('roughness')
                .min(-1)
                .max(2)
                .step(0.001)
                .listen()


            this.debugFolder
                .add(this.mesh.position, 'x')
                .name('position X')
                .min(-10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'y')
                .name('position Y')
                .min(-1)
                .max(5)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.mesh.position, 'z')
                .name('position Z')
                .min(-10)
                .max(10)
                .step(0.001)
                .listen()



        }

    }



}