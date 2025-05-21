import * as THREE from 'three'
import Experience from './Experience.js'
// import * as PP from 'cannon'
import DiceMesh from './World/Items/DiceMesh.js'

// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';

console.log(PP)

export default class PhysicsTest {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        // this.debug = this.experience.debug

        this.hitSound = new Audio('/sounds/dice/rolling-dice-2-102706.mp3')



        this.physicsWorld = new CANNON.World()
        this.setPhysicsWorld()



        this.setDebug()
        this.frameCnt = 0;
        this.elapsedTime = -9999;

        this.play = true
        this.diceAnimationLog = []
        this.replay = false;
        this.replayIndex = 0;
        /*
        {
            elapsedTime : 500
            [{position, quaternion}, ....]
        }
        */

        this.anchor = 1;
    }


    playHitSound() {
        this.hitSound.play()
    }



    setPhysicsWorld() {

        let diceFaceInfo = [{
            "right": { weapon: "axe", token: false },
            "left": { weapon: "shield", token: false },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "helmet", token: false },
            "front": { weapon: "arrow", token: true },
            "back": { weapon: "steal", token: true }
        },

        {
            "right": { weapon: "axe", token: false },
            "left": { weapon: "shield", token: true },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "steal", token: true },
            "front": { weapon: "arrow", token: false },
            "back": { weapon: "helmet", token: false }
        },

        {
            "right": { weapon: "axe", token: false },
            "left": { weapon: "arrow", token: true },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "helmet", token: true },
            "front": { weapon: "steal", token: false },
            "back": { weapon: "shield", token: false }
        },

        {
            "right": { weapon: "arrow", token: false },
            "left": { weapon: "shield", token: false },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "helmet", token: true },
            "front": { weapon: "steal", token: true },
            "back": { weapon: "axe", token: false }
        },

        {
            "right": { weapon: "axe", token: false },
            "left": { weapon: "shield", token: true },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "helmet", token: false },
            "front": { weapon: "steal", token: false },
            "back": { weapon: "arrow", token: true }

        },

        {
            "right": { weapon: "axe", token: false },
            "left": { weapon: "shield", token: true },
            "top": { weapon: "axe", token: false },
            "bottom": { weapon: "arrow", token: false },
            "front": { weapon: "steal", token: false },
            "back": { weapon: "helmet", token: true }

        }
        ]


        this.diceStates = []    //"red" , "yellow", "white"

        // let diceMesh = new DiceMesh(diceFaceInfo[0])



        this.guival = {
            spawn_height: 11,
            force: 310,
            radius: 1,
            torque: 80,
            tray_radius: 2.7,
            tray_height: 0
        }

        this.normalFaces = {
            0: "top",
            1: "top",
            2: "top",
            3: "top",
            4: "top",
            5: "top"
        }


        const defaultMaterial = new CANNON.Material('default')
        const wallMaterial = new CANNON.Material('wall')
        const floorMaterial = new CANNON.Material('floor')
        const defaultContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.0,
                restitution: 0.0
            }
        )

        const wallContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            wallMaterial,
            {
                friction: 0.0,
                restitution: 0.0
            }
        )

        const floorContactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            floorMaterial,
            {
                friction: 0.1,
                restitution: 0.2
            }
        )






        this.physicsWorld.addContactMaterial(defaultContactMaterial)
        this.physicsWorld.addContactMaterial(wallContactMaterial)
        this.physicsWorld.addContactMaterial(floorContactMaterial)

        this.physicsWorld.defaultContactMaterial = defaultContactMaterial

        this.physicsWorld.gravity.set(0, - 9.82, 0)



        this.objectsToUpdate = []


        // Create box
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        const boxMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMapIntensity: 0.5
        })
        const createBox = (width, height, depth, position) => {
            // Three.js mesh
            const mesh = new THREE.Mesh(boxGeometry, boxMaterial.clone())
            mesh.scale.set(width, height, depth)
            mesh.castShadow = true
            mesh.position.copy(position)
            this.scene.add(mesh)

            // Cannon.js body
            const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 3, 0),
                shape: shape,
                material: defaultMaterial
            })
            body.position.copy(position)
            this.physicsWorld.addBody(body)

            this.objectsToUpdate.push({
                mesh: mesh,
                body: body,
                state: "red"
            })

            // Save in objects
            // this.objectsToUpdate.push({ mesh, body })
        }

        // let sphereGeometry = new THREE.SphereGeometry(0.5,16,16)
        let sphereGeometry = new THREE.BoxGeometry(0.8, 3, 0.8)
        let spherematerial = new THREE.MeshStandardMaterial({ color: "skyblue", transparent: true, opacity: 0.0 })
        this.spheresToUpdate = [];
        this.spheresMesh = [];
        const createSphere = () => {
            const mesh = new THREE.Mesh(sphereGeometry, spherematerial)
            this.scene.add(mesh)

            // const shape = new CANNON.Sphere(0.5)
            const shape = new CANNON.Box(new CANNON.Vec3(0.4, 1.5, 0.4))
            const body = new CANNON.Body({
                mass: 0,
                position: new CANNON.Vec3(0, 3, 0),
                shape: shape,
                material: defaultMaterial
            })

            this.physicsWorld.addBody(body)
            this.spheresToUpdate.push(body)
            this.spheresMesh.push(mesh)

        }

        // createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

        // createBox(1, 1, 1, {x:1, y:1, z:1})

        // let diceMesh = new DiceMesh(diceFaceInfo[0])

        let dirStr = ["right", "left", "top", "bottom", "front", "back"]

        for (let index = 0; index < 6; index++) {
            let mesh = new DiceMesh(diceFaceInfo[index])

            for (let dir = 0; dir < 6; dir++) {
                let hue = dir / 6
                let color = new THREE.Color();
                color.setHSL(hue, 1, 0.5)
                mesh.diceFaces[`${dirStr[dir]}`].weaponMeshes[0].material.color.copy(color)
            }


            const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))


            let position = new CANNON.Vec3(
                ((index % 3) - 1) * 1.7,
                5,
                (10.5 + (index % 2) * 2.5)
            )

            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 3, 0),
                shape: shape,
                material: defaultMaterial
            })
            body.position.copy(position)
            this.physicsWorld.addBody(body)

            // Save in objects
            this.objectsToUpdate.push({ mesh, body })


            createSphere()
        }





        this.fieldPowerTime = 9999;



        // 굴리기
        window.addEventListener("keydown", (event) => {
            if (event.key == "a") {
                this.anchor *= -1
            
            }
            
            if (event.key == "e") {
                this.replay = true;
                this.replayIndex = 0;
                this.rotationMatrixes = [];

                let index = 0;
                for (const object of this.objectsToUpdate) {
                    // 

                    // index 번째 주사위의 this.normalFaces[index] 면이 up 이 되도록 회전행렬을 구한다.
                    let upVector = new THREE.Vector3(0, 1, 0)

                    let supposedDir = this.normalFaces[`${index}`]
                    // console.log(supposedDir)
                    // console.log(faceDir)

                    let supposedDirVector = new THREE.Vector3()
                    supposedDirVector.copy(object.mesh.faceNormals[`${supposedDir}`])
                    // console.log(supposedDirVector)
                    let objectRotMat = new THREE.Matrix3();
                    objectRotMat.setFromMatrix4(object.mesh.mesh.matrix)
                    // console.log(object.mesh.mesh.matrix)
                    // console.log(objectRotMat)
                    let supposedDirGlobalVector = supposedDirVector.applyMatrix3(objectRotMat)
                    // console.log(supposedDirGlobalVector)

                    let angleBetween = supposedDirGlobalVector.angleTo(upVector)

                    let rotationAxis = supposedDirGlobalVector.clone()
                    rotationAxis.cross(upVector)
                    rotationAxis.normalize()

                    // objectRotMat.invert()
                    // let localRotationAxis = rotationAxis.applyMatrix3(objectRotMat)

                    let rotationMatrix = new THREE.Matrix4()
                    // console.log(localRotationAxis, angleBetween)
                    rotationMatrix.makeRotationAxis(rotationAxis, angleBetween)

                    // rotationMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)

                    // let positionMatrix = new THREE.Matrix4()
                    // positionMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)

                    // let positionMatrixInverse = positionMatrix.clone()

                    // positionMatrixInverse.invert()

                    // positionMatrix.multiply(rotationMatrix)
                    // positionMatrix.multiply(positionMatrixInverse)


                    this.rotationMatrixes.push(rotationMatrix)
                    // object.mesh.mesh.applyMatrix4(positionMatrix)

                    index++;

                }

            }


            if (event.key == "c") {
                this.play = !this.play
            }

            if (event.key == "q") {
                this.frameCnt = 0;
                this.elapsedTime = 0;
                this.diceAnimationLog = []



                this.playHitSound()
                this.fieldPowerTime = 0;
                let index = 0;


                for (const object of this.objectsToUpdate) {
                    // Position
                    object.body.position.setZero();
                    object.body.previousPosition.setZero();
                    object.body.interpolatedPosition.setZero();
                    object.body.initPosition.setZero();

                    // orientation
                    object.body.quaternion.set(0, 0, 0, 1);
                    object.body.initQuaternion.set(0, 0, 0, 1);
                    // object.body.previousQuaternion.set(0,0,0,1);
                    object.body.interpolatedQuaternion.set(0, 0, 0, 1);

                    // Velocity
                    object.body.velocity.setZero();
                    object.body.initVelocity.setZero();
                    object.body.angularVelocity.setZero();
                    object.body.initAngularVelocity.setZero();

                    // Force
                    object.body.force.setZero();
                    object.body.torque.setZero();

                    // Sleep state reset
                    object.body.sleepState = 0;
                    object.body.timeLastSleepy = 0;
                    object.body._wakeUpAfterNarrowphase = false;




                    object.body.position.copy({
                        x: ((index % 3) - 1) * 1.65,
                        y: this.guival.spawn_height,
                        z: (10.5 + (index % 2) * 1.65)
                    })

                    object.body.applyForce(new CANNON.Vec3(0, 0, -1 * this.guival.force), object.body.position)

                    let theta = Math.random() * 2 * Math.PI


                    object.body.applyForce(
                        new CANNON.Vec3(0, 0, this.guival.torque),
                        new CANNON.Vec3(
                            this.guival.radius * Math.cos(theta) + object.body.position.x,
                            this.guival.radius * Math.sin(theta) + object.body.position.y,
                            object.body.position.z
                        ))

                    index++;


                }

            }


            if (event.key == "r") {
                this.frameCnt = 0;
                this.elapsedTime = 0;
                this.diceAnimationLog = []



                this.playHitSound()
                this.fieldPowerTime = 0;
                let index = 0;


                for (const object of this.objectsToUpdate) {
                    // Position
                    object.body.position.setZero();
                    object.body.previousPosition.setZero();
                    object.body.interpolatedPosition.setZero();
                    object.body.initPosition.setZero();

                    // orientation
                    object.body.quaternion.set(0, 0, 0, 1);
                    object.body.initQuaternion.set(0, 0, 0, 1);
                    // object.body.previousQuaternion.set(0,0,0,1);
                    object.body.interpolatedQuaternion.set(0, 0, 0, 1);

                    // Velocity
                    object.body.velocity.setZero();
                    object.body.initVelocity.setZero();
                    object.body.angularVelocity.setZero();
                    object.body.initAngularVelocity.setZero();

                    // Force
                    object.body.force.setZero();
                    object.body.torque.setZero();

                    // Sleep state reset
                    object.body.sleepState = 0;
                    object.body.timeLastSleepy = 0;
                    object.body._wakeUpAfterNarrowphase = false;




                    object.body.position.copy({
                        x: ((index % 3) - 1) * 1.65,
                        y: this.guival.spawn_height,
                        z: (10.5 + (index % 2) * 1.65) * this.anchor
                    })

                    object.body.applyForce(new CANNON.Vec3(0, 0, -1 * this.anchor * this.guival.force), object.body.position)

                    let theta = Math.random() * 2 * Math.PI


                    object.body.applyForce(
                        new CANNON.Vec3(0, 0, this.anchor *  this.guival.torque),
                        new CANNON.Vec3(
                            this.guival.radius * Math.cos(theta) + object.body.position.x,
                            this.guival.radius * Math.sin(theta) + object.body.position.y,
                            object.body.position.z
                        ))

                    index++;
                }




                let trayPosition = new CANNON.Vec3(0, 0, 5.5);

                this.diceAnimationLog = []

                this.physicsWorld.gravity.set(0, -9.82 ,0)

                for (let frameCnt = 0; frameCnt < 300; frameCnt++) {
                    if(frameCnt > 300 * 0.8)
                        this.physicsWorld.gravity.set(0, -9.82 * (1 + 6* Math.exp(60 * (frameCnt / 300 - 1))), 0)
                    this.physicsWorld.step(1/60)


                    index = 0;
                    let frameLog = { elapsedTime: this.elapsedTime, dices: [] }
                    for (const object of this.objectsToUpdate) {
                        // object.mesh.mesh.position.copy(object.body.position)
                        // object.mesh.mesh.quaternion.copy(object.body.quaternion)

                        // if (object.body.position.distanceSquared(trayPosition) > 2.55 * 2.55) {
                        //     object.mesh.dice.material.color.set(0xff0000)
                        //     this.objectsToUpdate[index].state = "red"
                        // }
                        // else if (object.body.position.y > 1.1) {
                        //     object.mesh.dice.material.color.set(0xffff00)
                        //     this.objectsToUpdate[index].state = "yellow"
                        // }
                        // else {
                        //     object.mesh.dice.material.color.set(0xffffff)
                        //     this.objectsToUpdate[index].state = "white"
                        // }

                        // this.spheresToUpdate[index].position.copy(object.body.quaternion)
                        this.spheresToUpdate[index].position.set(
                            object.body.position.x,
                            object.body.position.y + 2.7,
                            object.body.position.z
                        )

                        // this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)
                        this.spheresMesh[index].position.set(
                            this.spheresToUpdate[index].position.x,
                            this.spheresToUpdate[index].position.y,
                            this.spheresToUpdate[index].position.z
                        )

                        // this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)

                        // this.spheresMesh[index].quaternion.copy(this.spheresToUpdate[index].quaternion)

                        frameLog.dices[index] = {}
                        frameLog.dices[index].position = object.body.position.clone()
                        frameLog.dices[index].quaternion = object.body.quaternion.clone()

                        index++;

                    }
                    this.diceAnimationLog.push(frameLog)

                }


                let isRed = false
                let isYellow = false

                // for (const object of this.objectsToUpdate) {
    
                //     if (object.body.position.distanceSquared(trayPosition) > 2.55 * 2.55) {
                //         console.log(`[dice roll fail - RED] ${object} dice is out of tray!!!`)
                //         return;
                //     }
                //     else if (object.body.position.y > 1.1) {
                //         console.log(`[dice roll fail - YELLOW] ${object} dice is hanging!!!`)
                //         return;
                //     }
                // }    

                // console.log("hello~")


                index = 0;
                for (const object of this.objectsToUpdate) {
                    object.mesh.mesh.position.copy(object.body.position)
                    object.mesh.mesh.quaternion.copy(object.body.quaternion)
                    object.mesh.mesh.updateMatrix()

                    // object.mesh.mesh.position.copy(this.diceAnimationLog[1499].dices[index].position)
                    // object.mesh.mesh.quaternion.copy(this.diceAnimationLog[1499].dices[index].quaternion)

                    index++;
                }


                // deltaTime *= 5000;

                // this.sphereMesh.position.copy(this.sphereBody.position)

                // console.log(this.diceAnimationLog)


                // for (const object of this.objectsToUpdate) {
                //     object.mesh.mesh.position.copy(object.body.position)
                //     object.mesh.mesh.quaternion.copy(object.body.quaternion)
                // }


                this.replay = true;
                this.replayIndex = 0;
                this.rotationMatrixes = [];

                index = 0;
                for (const object of this.objectsToUpdate) {
                    // 

                    // console.log(object.mesh.getUpDir())

                    // index 번째 주사위의 this.normalFaces[index] 면이 up 이 되도록 회전행렬을 구한다.
                    let upVector = new THREE.Vector3(0, 1, 0)

                    let supposedDir = this.normalFaces[`${index}`]
                    // console.log(supposedDir)
                    // console.log(faceDir)

                    let supposedDirVector = new THREE.Vector3()
                    supposedDirVector.copy(object.mesh.faceNormals[`${supposedDir}`])
                    // console.log(supposedDirVector)
                    let objectRotMat = new THREE.Matrix3();
                    objectRotMat.setFromMatrix4(object.mesh.mesh.matrix)
                    // console.log(object.mesh.mesh.matrix)
                    // console.log(objectRotMat)
                    let supposedDirGlobalVector = supposedDirVector.applyMatrix3(objectRotMat)
                    // console.log(supposedDirGlobalVector)

                    let angleBetween = supposedDirGlobalVector.angleTo(upVector)

                    let rotationAxis = supposedDirGlobalVector.clone()
                    rotationAxis.cross(upVector)
                    rotationAxis.normalize()

                    // objectRotMat.invert()
                    // let localRotationAxis = rotationAxis.applyMatrix3(objectRotMat)

                    let rotationMatrix = new THREE.Matrix4()
                    // console.log(localRotationAxis, angleBetween)
                    rotationMatrix.makeRotationAxis(rotationAxis, angleBetween)

                    // rotationMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)

                    let positionMatrix = new THREE.Matrix4()
                    positionMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)
                    let positionMatrixInverse = positionMatrix.clone()
                    positionMatrixInverse.invert()
                    positionMatrix.multiply(rotationMatrix)
                    positionMatrix.multiply(positionMatrixInverse)
                    object.mesh.mesh.applyMatrix4(positionMatrix)


                    this.rotationMatrixes.push(rotationMatrix)

                    index++;

                }




                

            }



            if (event.key == "t") {

                // this.replay = true;
                this.replayIndex = 0;
                this.rotationMatrixes = [];

                let index = 0;
                for (const object of this.objectsToUpdate) {
                    // 

                    // index 번째 주사위의 this.normalFaces[index] 면이 up 이 되도록 회전행렬을 구한다.
                    let upVector = new THREE.Vector3(0, 1, 0)

                    let supposedDir = this.normalFaces[`${index}`]
                    // console.log(supposedDir)
                    // console.log(faceDir)

                    let supposedDirVector = new THREE.Vector3()
                    supposedDirVector.copy(object.mesh.faceNormals[`${supposedDir}`])
                    // console.log(supposedDirVector)
                    let objectRotMat = new THREE.Matrix3();
                    objectRotMat.setFromMatrix4(object.mesh.mesh.matrix)
                    // console.log(object.mesh.mesh.matrix)
                    // console.log(objectRotMat)
                    let supposedDirGlobalVector = supposedDirVector.applyMatrix3(objectRotMat)
                    // console.log(supposedDirGlobalVector)

                    let angleBetween = supposedDirGlobalVector.angleTo(upVector)

                    let rotationAxis = supposedDirGlobalVector.clone()
                    rotationAxis.cross(upVector)
                    rotationAxis.normalize()

                    // objectRotMat.invert()
                    // let localRotationAxis = rotationAxis.applyMatrix3(objectRotMat)

                    let rotationMatrix = new THREE.Matrix4()
                    // console.log(localRotationAxis, angleBetween)
                    rotationMatrix.makeRotationAxis(rotationAxis, angleBetween)

                    // rotationMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)

                    let positionMatrix = new THREE.Matrix4()
                    positionMatrix.setPosition(object.mesh.mesh.position.x, object.mesh.mesh.position.y, object.mesh.mesh.position.z)
                    let positionMatrixInverse = positionMatrix.clone()
                    positionMatrixInverse.invert()
                    positionMatrix.multiply(rotationMatrix)
                    positionMatrix.multiply(positionMatrixInverse)
                    object.mesh.mesh.applyMatrix4(positionMatrix)


                    this.rotationMatrixes.push(rotationMatrix)

                    index++;

                }


            }

        })


        // 안정화
        // 흰색 주사위들을 안정화 시킨다
        window.addEventListener("keydown", (event) => {
            if (event.key == "w") {
                let ret = ""
                for (const object of this.objectsToUpdate) {
                    if (object.state === "white" || true) {
                        let normalDir = object.mesh.getUpDir()
                        let normalMark = object.mesh.diceFaces[`${normalDir}`].weaponType
                        let normalLocalVector = object.mesh.faceNormals[`${normalDir}`].clone()


                        let rotationMat = new THREE.Matrix3();
                        rotationMat.setFromMatrix4(object.mesh.mesh.matrix)

                        let normalGlobalVector = normalLocalVector.applyMatrix3(rotationMat)    //
                        console.log(normalGlobalVector)
                        normalGlobalVector.normalize()

                        let globalUpVector = new THREE.Vector3(0, 1, 0)
                        let angleBetween = normalGlobalVector.angleTo(globalUpVector)
                        console.log(angleBetween)

                        let rotationAxis = normalGlobalVector.clone()
                        rotationAxis.cross(globalUpVector)
                        rotationAxis.normalize()

                        rotationMat.invert()
                        let localRotationAxis = rotationAxis.applyMatrix3(rotationMat)

                        object.mesh.mesh.rotateOnAxis(localRotationAxis, angleBetween)
                        object.body.quaternion.copy(object.mesh.mesh.quaternion)

                    }
                }
            }
        })



        window.addEventListener("keydown", (event) => {
            if (event.key == "g") {
                for (let i = 0; i < this.objectsToUpdate.length; i++) {
                    for (let j = 1; j < this.objectsToUpdate.length; j++) {
                        let objA, objB;
                        objA = this.objectsToUpdate[i].body
                        objB = this.objectsToUpdate[j].body

                        let distanceSqrd = objA.position.distanceSquared(objB.position)
                        if (distanceSqrd <= 1.2) {
                            let weight = 10 * ((1 / distanceSqrd) - 1.2)
                            let fieldForceA = new CANNON.Vec3(
                                weight * (objB.position.x - objA.position.x),
                                weight * (objB.position.y - objA.position.y),
                                weight * (objB.position.z - objA.position.z))
                            objA.applyForce(fieldForceA, objA.position)

                            let fieldForceB = new CANNON.Vec3(
                                weight * (objA.position.x - objB.position.x),
                                weight * (objA.position.y - objB.position.y),
                                weight * (objA.position.z - objB.position.z))
                            objB.applyForce(fieldForceB, objB.position)
                        }
                    }
                }
            }
        })


        /*
        
        

        */




        const floorShape = new CANNON.Plane()
        const floorBody = new CANNON.Body()
        floorBody.material = floorMaterial
        floorBody.mass = 0
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        floorBody.addShape(floorShape)
        this.physicsWorld.addBody(floorBody)


        // fence
        this.fences = []
        let anchor = 1
        for(let avatar = 0; avatar< 2; avatar++){
            for (let index = 0; index < 32; index++) {

                let theta = index * (Math.PI / 16)
                let pos = {
                    x: this.guival.tray_radius * Math.cos(theta),
                    y: this.guival.tray_height + 0.1 + Math.cos(theta + anchor * Math.PI / 2),
                    z: this.guival.tray_radius * Math.sin(theta) + 5.5 * anchor
                }
                const mesh = new THREE.Mesh(boxGeometry, boxMaterial.clone())
                // mesh.rotateY(-theta)
                // mesh.castShadow = true
                this.scene.add(mesh)



                const shape = new CANNON.Box(new CANNON.Vec3(0.1, 1.5, 0.2))
                const body = new CANNON.Body({
                    mass: 0,
                    position: new CANNON.Vec3(0, 0, 0),
                    shape: shape,
                    material: wallMaterial
                })
                body.position.copy(pos)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -theta)
                this.physicsWorld.addBody(body)

                mesh.position.copy(body.position)
                mesh.quaternion.copy(body.quaternion)
                mesh.scale.set(0.2, 3, 0.4)

                this.fences.push({ mesh, body })


                // let theta = index * (Math.PI / 16)
                // let pos = {
                //     x : this.guival.tray_radius * Math.cos(theta),
                //     y : this.guival.tray_height + 0.3 + Math.cos(theta + Math.PI / 2),
                //     z : this.guival.tray_radius * Math.sin(theta) + 5.5
                // }

                // const mesh = new THREE.Mesh(boxGeometry, boxMaterial.clone())
                // mesh.rotateY(-theta)
                // mesh.scale.set(0.2, 2, 0.5)
                // // mesh.castShadow = true
                // mesh.position.copy(pos)
                // this.scene.add(mesh)

                // const shape = new CANNON.Box(new CANNON.Vec3(0.2, 1., 0.2))
                // const body = new CANNON.Body({
                //     mass: 0,
                //     position: new CANNON.Vec3(0, 0, 0),
                //     shape: shape,
                //     material: wallMaterial
                // })
                // body.position.copy(pos)
                // this.physicsWorld.addBody(body)
            }
            anchor *= -1;
        }






        window.addEventListener("keydown", (event) => {
            if (event.key == "K")
                createBox(
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    {
                        x: (Math.random() - 0.5) * 3,
                        y: 1,
                        z: (Math.random() - 0.5) * 3
                    }
                )
        })



        // playHitSound()




        this.clock = new THREE.Clock()
        this.oldElapsedTime = -9999;





        // const createSphere = (radius, position) => {
        //     // Three.js mesh
        //     const mesh = new THREE.Mesh(
        //         new THREE.SphereGeometry(radius, 20, 20),
        //         new THREE.MeshStandardMaterial({
        //             metalness: 0.3,
        //             roughness: 0.4,
        //             envMapIntensity: 0.5
        //         })
        //     )
        //     mesh.castShadow = true
        //     mesh.position.copy(position)
        //     this.scene.add(mesh)

        //     const shape = new CANNON.Sphere(radius)

        //     const body = new CANNON.Body({
        //         mass: 1,
        //         position: new CANNON.Vec3(0, 20, 0),
        //         shape: shape,
        //         material: defaultMaterial
        //     })
        //     body.position.copy(position)
        //     this.physicsWorld.addBody(body)


        //     // Save in objects to update
        //     this.objectsToUpdate.push({
        //         mesh: mesh,
        //         body: body
        //     })

        // }


        // createSphere(0.5, { x: 0, y: 20, z: 0 })



        // window.addEventListener("keydown", (event) => {
        //     if (event.key == "E")
        //     createSphere(
        //         (0.5 + Math.random()) * 0.5,
        //         {
        //             x: (Math.random() - 0.5) * 3,
        //             y: 10,
        //             z: (Math.random() - 0.5) * 3
        //         }
        //     )         
        // });




        // const defaultMaterial = new CANNON.Material('default')
        // const defaultContactMaterial = new CANNON.ContactMaterial(
        //     defaultMaterial,
        //     defaultMaterial,
        //     {
        //         friction: 0.1,
        //         restitution: 0.7
        //     }
        // )

        // this.physicsWorld.addContactMaterial(defaultContactMaterial)
        // this.physicsWorld.defaultContactMaterial = defaultContactMaterial

        // this.physicsWorld.gravity.set(0, - 9.82, 0)
        // const sphereShape = new CANNON.Sphere(0.5)
        // this.sphereBody = new CANNON.Body({
        //     mass: 1,
        //     position: new CANNON.Vec3(0, 20, 0),
        //     shape: sphereShape,
        //     material: defaultMaterial
        // })

        // this.physicsWorld.addBody(this.sphereBody)


        // window.addEventListener("keydown", (event) => {
        //     if (event.key == "E")
        //         this.sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
        // });


        // const floorShape = new CANNON.Plane()
        // const floorBody = new CANNON.Body()
        // floorBody.material = defaultMaterial
        // floorBody.mass = 0
        // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        // floorBody.addShape(floorShape)
        // this.physicsWorld.addBody(floorBody)





        // let sphereGeo = new THREE.SphereGeometry(0.5);
        // let sphereMat = new THREE.MeshStandardMaterial({ color: "gray", metal: 0.9, roughness: 0.1 });

        // this.sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
        // this.scene.add(this.sphereMesh)

    }



    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("physics Test");



            this.debugFolder.add(this.guival, 'spawn_height', 0, 15, 0.05);
            this.debugFolder.add(this.guival, 'force', 100, 1000, 5);
            this.debugFolder.add(this.guival, 'radius', 0, 10, 0.1);
            this.debugFolder.add(this.guival, 'torque', 0, 200, 1);
            this.debugFolder.add(this.guival, 'tray_radius', 0, 5, 0.05);
            this.debugFolder.add(this.guival, 'tray_height', 0, 5, 0.05);


            this.debugFolder.add(this.normalFaces, "0", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.normalFaces, "1", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.normalFaces, "2", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.normalFaces, "3", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.normalFaces, "4", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.normalFaces, "5", ["right", "left", "top", "bottom", "front", "back"])


            //spawn_height

        }
    }







    update(dt) {
        if (this.replay) {

            // console.log("hello")
            let log = this.diceAnimationLog[this.replayIndex]
            // console.log(log.elapsedTime + log.dices)

            log.dices.forEach((dice, index) => {
                this.objectsToUpdate[index].mesh.mesh.position.copy(dice.position)
                this.objectsToUpdate[index].mesh.mesh.quaternion.copy(dice.quaternion)
                // dice.mesh.mesh.applyMatrix4(this.rotationMatrixes[index])


                let positionMatrix = new THREE.Matrix4()
                let positionMatrixInverse = new THREE.Matrix4()
                let pos = new THREE.Vector3()
                pos.copy(dice.position)

                positionMatrix.setPosition(pos)
                positionMatrixInverse.setPosition(pos)
                positionMatrixInverse.invert()

                positionMatrix.multiply(this.rotationMatrixes[index])
                positionMatrix.multiply(positionMatrixInverse);

                this.objectsToUpdate[index].mesh.mesh.applyMatrix4(positionMatrix)



                this.spheresToUpdate[index].position.set(
                    dice.position.x,
                    dice.position.y + 2.7,
                    dice.position.z
                )

                this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)




            })

            this.replayIndex++
            // console.log(`${this.replayIndex} / ${this.diceAnimationLog.length}`)
            if (this.replayIndex === this.diceAnimationLog.length)
                this.replay = false;

        }


        if (this.elapsedTime >= 1500 && false) {

            for (const object of this.objectsToUpdate) {
                let normalDir = object.mesh.getUpDir()
                let normalMark = object.mesh.diceFaces[`${normalDir}`].weaponType
                let normalLocalVector = object.mesh.faceNormals[`${normalDir}`].clone()


                let rotationMat = new THREE.Matrix3();
                rotationMat.setFromMatrix4(object.mesh.mesh.matrix)

                let normalGlobalVector = normalLocalVector.applyMatrix3(rotationMat)    //
                console.log(normalGlobalVector)
                normalGlobalVector.normalize()

                let globalUpVector = new THREE.Vector3(0, 1, 0)
                let angleBetween = normalGlobalVector.angleTo(globalUpVector)
                console.log(angleBetween)

                let rotationAxis = normalGlobalVector.clone()
                rotationAxis.cross(globalUpVector)
                rotationAxis.normalize()

                rotationMat.invert()
                let localRotationAxis = rotationAxis.applyMatrix3(rotationMat)

                object.mesh.mesh.rotateOnAxis(localRotationAxis, angleBetween)
                object.body.quaternion.copy(object.mesh.mesh.quaternion)

            }

            this.elapsedTime += dt;


            let frameLog = { elapsedTime: this.elapsedTime, dices: [] }


            // deltaTime *= 5000;

            // this.sphereMesh.position.copy(this.sphereBody.position)

            let index = 0;
            let trayPosition = new CANNON.Vec3(0, 0, 5.5);
            for (const object of this.objectsToUpdate) {
                object.mesh.mesh.position.copy(object.body.position)
                object.mesh.mesh.quaternion.copy(object.body.quaternion)

                if (object.body.position.distanceSquared(trayPosition) > 2.55 * 2.55) {
                    object.mesh.dice.material.color.set(0xff0000)
                    this.objectsToUpdate[index].state = "red"
                }
                else if (object.body.position.y > 1.1) {
                    object.mesh.dice.material.color.set(0xffff00)
                    this.objectsToUpdate[index].state = "yellow"
                }
                else {
                    object.mesh.dice.material.color.set(0xffffff)
                    this.objectsToUpdate[index].state = "white"
                }

                // this.spheresToUpdate[index].position.copy(object.body.quaternion)
                this.spheresToUpdate[index].position.set(
                    object.body.position.x,
                    object.body.position.y + 2.7,
                    object.body.position.z
                )

                // this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)
                this.spheresMesh[index].position.set(
                    this.spheresToUpdate[index].position.x,
                    this.spheresToUpdate[index].position.y,
                    this.spheresToUpdate[index].position.z
                )

                this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)

                this.spheresMesh[index].quaternion.copy(this.spheresToUpdate[index].quaternion)

                frameLog.dices[index] = {}
                frameLog.dices[index].position = object.body.position.clone()
                frameLog.dices[index].quaternion = object.body.quaternion.clone()

                index++;

            }

            this.diceAnimationLog.push(frameLog)


            console.log(this.diceAnimationLog)



            this.elapsedTime = -1000
        }


        if (this.play && this.elapsedTime < 1500 && this.elapsedTime >= 0 && false) {
            this.frameCnt++

            if (this.oldElapsedTime < 0) {
                this.oldElapsedTime = this.clock.getElapsedTime()
                return;
            }


            this.elapsedTime += dt;

            const elapsedTime = this.clock.getElapsedTime()
            const deltaTime = elapsedTime - this.oldElapsedTime;
            this.oldElapsedTime = elapsedTime

            // console.log(`${dt}, ${deltaTime}`)

            // console.log(elapsedTime)

            // this.physicsWorld.step(1 / 60)
            this.physicsWorld.step(1 / 60, deltaTime * 3, 3)

            // this.diceAnimationLog


            let frameLog = { elapsedTime: this.elapsedTime, dices: [] }



            // deltaTime *= 5000;

            // this.sphereMesh.position.copy(this.sphereBody.position)

            let index = 0;
            let trayPosition = new CANNON.Vec3(0, 0, 5.5);
            for (const object of this.objectsToUpdate) {
                object.mesh.mesh.position.copy(object.body.position)
                object.mesh.mesh.quaternion.copy(object.body.quaternion)

                if (object.body.position.distanceSquared(trayPosition) > 2.55 * 2.55) {
                    object.mesh.dice.material.color.set(0xff0000)
                    this.objectsToUpdate[index].state = "red"
                }
                else if (object.body.position.y > 1.1) {
                    object.mesh.dice.material.color.set(0xffff00)
                    this.objectsToUpdate[index].state = "yellow"
                }
                else {
                    object.mesh.dice.material.color.set(0xffffff)
                    this.objectsToUpdate[index].state = "white"
                }

                // this.spheresToUpdate[index].position.copy(object.body.quaternion)
                this.spheresToUpdate[index].position.set(
                    object.body.position.x,
                    object.body.position.y + 2.7,
                    object.body.position.z
                )

                // this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)
                this.spheresMesh[index].position.set(
                    this.spheresToUpdate[index].position.x,
                    this.spheresToUpdate[index].position.y,
                    this.spheresToUpdate[index].position.z
                )

                this.spheresMesh[index].position.copy(this.spheresToUpdate[index].position)

                this.spheresMesh[index].quaternion.copy(this.spheresToUpdate[index].quaternion)

                frameLog.dices[index] = {}
                frameLog.dices[index].position = object.body.position.clone()
                frameLog.dices[index].quaternion = object.body.quaternion.clone()

                index++;

            }

            this.diceAnimationLog.push(frameLog)


            // for (const object of this.fences) {
            //     object.mesh.position.copy(object.body.position)
            //     object.mesh.quaternion.copy(object.body.quaternion)
            // }



            if (false) {
                this.fieldPowerTime += deltaTime

                for (let i = 0; i < this.objectsToUpdate.length; i++) {
                    for (let j = 1; j < this.objectsToUpdate.length; j++) {
                        let objA, objB;
                        objA = this.objectsToUpdate[i].body
                        objB = this.objectsToUpdate[j].body

                        let distanceSqrd = objA.position.distanceSquared(objB.position)
                        if (distanceSqrd <= 2.7) {
                            let weight = 40 * ((1 / distanceSqrd) - 2.7 * 2.7)
                            let fieldForceA = new CANNON.Vec3(
                                weight * (objB.position.x - objA.position.x),
                                weight * (objB.position.y - objA.position.y),
                                weight * (objB.position.z - objA.position.z))
                            objA.applyForce(fieldForceA, objA.position)

                            let fieldForceB = new CANNON.Vec3(
                                weight * (objA.position.x - objB.position.x),
                                weight * (objA.position.y - objB.position.y),
                                weight * (objA.position.z - objB.position.z))
                            objB.applyForce(fieldForceB, objB.position)
                        }
                    }
                }
            }
        }

    }

}
