import * as THREE from 'three'
import Experience from '../Experience.js'

export default class CurvedCube {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

  
        this.geometry = new THREE.BoxGeometry(1, 1, 1, 9, 9, 9)

        this.radius = 0.15

        this.vertexCnt = this.geometry.attributes.position.count

        let positionBuffer = this.geometry.attributes.position.array;
        let normalBuffer = this.geometry.attributes.normal.array;
        let uvBuffer = this.geometry.attributes.uv.array;

        let position = new THREE.Vector3();
        let newPosition = new THREE.Vector3();
        let normal = new THREE.Vector3();
        let signs = new THREE.Vector3();
        let benchMark = new THREE.Vector3();
        let newNormal = new THREE.Vector3();

        
        let uvProjection = [
            {u : new THREE.Vector3(0,0,-1), v : new THREE.Vector3(0,1,0)},
            {u : new THREE.Vector3(0,0,1), v : new THREE.Vector3(0,1,0)},
            {u : new THREE.Vector3(1,0,0), v : new THREE.Vector3(0,0,-1)},
            {u : new THREE.Vector3(1,0,0), v : new THREE.Vector3(0,0, 1)},
            {u : new THREE.Vector3(1,0,0), v : new THREE.Vector3(0, 1,0)},
            {u : new THREE.Vector3(-1,0,0), v : new THREE.Vector3(0, 1,0)},
        ]

        let uvProjection_ = { u : new THREE.Vector3(), v : new THREE.Vector3() };
        let uvProjection__ = { u : new THREE.Vector3(), v : new THREE.Vector3() };
        
        let uvAnchor = new THREE.Vector3();
        let uvMove = new THREE.Vector3(0, 0, 0);
        let newUV = new THREE.Vector2();
        let uvSigns = new THREE.Vector3();
        let zeroVector = new THREE.Vector3(0, 0, 0);
        let tmpBenchmark = new THREE.Vector3();

        for (let i = 0; i < this.vertexCnt; i++) {
            let faceIndex = Math.floor(i / (this.vertexCnt / 6));

            position.set(positionBuffer[3 * i], positionBuffer[3 * i + 1], positionBuffer[3 * i + 2])

            
            switch(faceIndex){
                case 0:
                    normal.set(1,0,0)
                    break;
                case 1:
                    normal.set(-1,0,0)
                    break;
                case 2:
                    normal.set(0,1,0)
                    break;
                case 3:
                    normal.set(0,-1,0)
                    break;
                case 4:
                    normal.set(0,0,1)
                    break;
                case 5:
                    normal.set(0,0,-1)
                    break;
            }
            

            normal.set(normalBuffer[3 * i], normalBuffer[3 * i + 1], normalBuffer[3 * i + 2])

            signs.x = positionBuffer[3 * i] > 0 ? 1 : -1
            signs.y = positionBuffer[3 * i + 1] > 0 ? 1 : -1
            signs.z = positionBuffer[3 * i + 2] > 0 ? 1 : -1

            benchMark.set(0.5 - this.radius, 0.5 - this.radius, 0.5 - this.radius)

            
            // recompute UV

            uvSigns.copy(signs);

            uvAnchor.copy(uvSigns.multiply(benchMark))
            uvProjection_.u.copy(uvProjection[faceIndex].u)
            uvProjection_.v.copy(uvProjection[faceIndex].v)


            uvMove.copy(position);
            uvMove.multiplyScalar(this.radius * 2)
            tmpBenchmark.copy(benchMark)

            uvProjection__.u.copy(uvProjection[faceIndex].u)
            uvProjection__.v.copy(uvProjection[faceIndex].v)


            newUV.set(uvProjection_.u.dot(uvAnchor) + uvProjection__.u.dot(uvMove) + 0.5,
            uvProjection_.v.dot(uvAnchor) + uvProjection__.v.dot(uvMove) + 0.5)

            uvBuffer[2 * i] = newUV.x
            uvBuffer[2 * i + 1] = newUV.y

            position.normalize();


            positionBuffer[3 * i] = signs.x * benchMark.x + position.x * this.radius;
            positionBuffer[3 * i + 1] = signs.y * benchMark.y + position.y * this.radius;
            positionBuffer[3 * i + 2] = signs.z * benchMark.z + position.z * this.radius;

            // recompute normal

            if(benchMark.distanceToSquared(position) < 0.108)
                newNormal.copy(normal)
            else
                newNormal.copy(position)


            normalBuffer[3 * i] = newNormal.x;
            normalBuffer[3 * i + 1] = newNormal.y;
            normalBuffer[3 * i + 2] = newNormal.z;
        

        }

        this.geometry.computeVertexNormals();

        // for (let i = 0; i < this.vertexCnt; i++) {
        //     position.set(positionBuffer[3 * i], positionBuffer[3 * i + 1], positionBuffer[3 * i + 2])
        //     normal.set(normalBuffer[3 * i], normalBuffer[3 * i + 1], normalBuffer[3 * i + 2])

        //     if (position.distanceToSquared(this.scene.position) > (this.radius * this.radius)) {
        //         positionBuffer[3 * i] = position.x;
        //         positionBuffer[3 * i + 1] = position.y;
        //         positionBuffer[3 * i + 2] = position.z;

        //         position.normalize();

        //         positionBuffer[3 * i] = position.x * this.radius;
        //         positionBuffer[3 * i + 1] = position.y * this.radius;
        //         positionBuffer[3 * i + 2] = position.z * this.radius;

        //         normalBuffer[3 * i] = position.x;
        //         normalBuffer[3 * i + 1] = position.y;
        //         normalBuffer[3 * i + 2] = position.z;
        //     }
        // }

    }




    createMesh(){


        this.textures = [];
        this.textures.push(this.resources.items.diceArrowTexture);
        this.textures.push(this.resources.items.diceAxeTexture);
        this.textures.push(this.resources.items.diceHelmetTexture);
        this.textures.push(this.resources.items.diceShieldTexture);
        this.textures.push(this.resources.items.diceGodFavorTexture);
        this.textures.push(this.resources.items.diceStealTexture);


        this.textures.forEach(texture_ => {
            texture_.encoding = THREE.sRGBEncoding;
        })


        this.materials = [
            new THREE.MeshStandardMaterial({ map: this.textures[0] }),
            new THREE.MeshStandardMaterial({ map: this.textures[1] }),
            new THREE.MeshStandardMaterial({ map: this.textures[2] }),
            new THREE.MeshStandardMaterial({ map: this.textures[3] }),
            new THREE.MeshStandardMaterial({ map: this.textures[4] }),
            new THREE.MeshStandardMaterial({ map: this.textures[5] }),
        ];


        this.materials.forEach(mat=>{
            // mat.wireframe = true;
            mat.flatShading = false
        })

        // this.mesh.material.wireframe = true;
        this.mesh = new THREE.Mesh(this.geometry, this.materials);
        this.mesh.position.y = 1.5;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
        this.mesh.material.flatShading = true
        this.mesh.geometry.computeVertexNormals()

    }


}