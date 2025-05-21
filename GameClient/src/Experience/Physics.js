import * as THREE from 'three'
import Experience from './Experience.js'
import * as pp from 'cannon'
import DiceMesh from './World/Items/DiceMesh.js'

// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';

// console.log(CANNON)

function shuffle_(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// console.log(THREE)


// Box Body (Dice, Pillar, Fence)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const boxMaterial = new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMapIntensity: 0.5
// })
const boxMaterial = [
    new THREE.MeshStandardMaterial({ color: "red" }),
    new THREE.MeshStandardMaterial({ color: "yellow" }),
    new THREE.MeshStandardMaterial({ color: "blue" }),
    new THREE.MeshStandardMaterial({ color: "green" }),
    new THREE.MeshStandardMaterial({ color: "purple" }),
    new THREE.MeshStandardMaterial({ color: "white" }),
]


const defaultMaterial = new CANNON.Material('default')
const wallMaterial = new CANNON.Material('wall')
const floorMaterial = new CANNON.Material('floor')

// const d12Material_dode = new CANNON.Material('d12_dode')
// const d12Material_sphere = new CANNON.Material('d12_sphere')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.0,
        restitution: 0.0
    }
)

const floorContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    floorMaterial,
    {
        friction: 0.05,
        restitution: 0.2
    }
)


// let dice_rolling_sound_frames = []

const createBoxBody = (width, height, depth, mass = 1) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: mass,
        position: new CANNON.Vec3(0, 5, 0),
        shape: shape,
        material: defaultMaterial
    })

    // body.addEventListener("collide", (collision)=>{
        // console.log(, body.animation_frame)
        // if(collision.contact.getImpactVelocityAlongNormal() > 2.0 && body.isCollision == false){
        //     // dice_rolling_sound_frames.push(body.animation_frame)
        //     // console.log(collision)
        //     // console.log(` [ event listener ] ${body.animation_frame}, ${collision.body.world.time}`)
        //     body.isCollision = true
        // }
    // })

    mesh.position.copy(body.position)
    // Save in objects
    // this.objectsToUpdate.push({ mesh, body })
    return { mesh, body }
}



const gen_polyhedron = (geometry) => {
    // console.log()

    let geo_vertex = geometry.getAttribute("position").array

    var vertices = [],
        faces = [],
        i = 0,
        v = null,
        f = null;

    for (i = 0; i < geo_vertex.length; i = i + 9) {
        for (let j = 0; j < 3; j++) {
            let vertex_index = i + j * 3
            let x = geo_vertex[vertex_index]
            let y = geo_vertex[vertex_index + 1]
            let z = geo_vertex[vertex_index + 2]
            vertices[vertex_index / 3] = new CANNON.Vec3(x, y, z)

        }
        faces.push([(i / 3), (i / 3) + 1, (i / 3) + 2])

    }

    console.log(vertices)
    console.log(faces)

    return new CANNON.ConvexPolyhedron(vertices, faces);
}



const CreateDodecahedron = (radius = 1,     color, tmp) => {

    let dode_geo = new THREE.DodecahedronGeometry(radius, 0)
    let dode_mat = new THREE.MeshStandardMaterial({ color: color })
    const mesh = new THREE.Mesh(dode_geo, dode_mat)

    // const shape = gen_polyhedron(mesh.geometry)
    const shape = new CANNON.Sphere(radius)
    console.log(shape)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(tmp, 1, 5),
        shape: shape,
        material: defaultMaterial
    })
    mesh.position.copy(body.position)

    return { mesh, body }
}



export default class Physics {
    constructor() {
        this.experience = new Experience()
        this.physicsWorld = new CANNON.World()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        // this.time = this.experience.time


        this.diceBodies = []
        this.pillarBodies = []
        this.fenceBodies = []

        this.setPhysicsWorld()
        // this.setDebug()


        
        // this.d12_dices = [CreateDodecahedron(0.8, "white", -1.5), CreateDodecahedron(0.8, "black", 1.5)]

        // this.d12_dices.forEach(dice => {
        //     this.scene.add(dice.mesh)
        //     this.physicsWorld.addBody(dice.body)
        // })


    }

    setPhysicsWorld() {

        this.physicsConfig = {
            spawn_height: 11,
            spawn_distance: 13.8,
            force: 640,
            torque: 80,
            torque_radius: 1,
            magnet: 8.4,
            decay_weight: 2.7,
            gap : 1.225,
            normalFaces: {
                0: "top",
                1: "top",
                2: "top",
                3: "top",
                4: "top",
                5: "top"
            }
        }



        // Contact Material


        this.physicsWorld = new CANNON.World()
        this.physicsWorld.addContactMaterial(defaultContactMaterial)
        this.physicsWorld.addContactMaterial(floorContactMaterial)
        this.physicsWorld.defaultContactMaterial = defaultContactMaterial


        // Gravity
        this.physicsWorld.gravity.set(0, - 9.82, 0)



        // Plane (Floor)
        const floorShape = new CANNON.Plane()
        const floorBody = new CANNON.Body()
        floorBody.material = floorMaterial
        floorBody.mass = 0
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
        floorBody.addShape(floorShape)
        this.physicsWorld.addBody(floorBody)





        // Body for Dice and Pillar
        // 동시에 6개의 주사위를 시뮬레이션 가능
        for (let index = 0; index < 8; index++) {
            let diceBody = createBoxBody(1, 1, 1)
            this.diceBodies.push(diceBody)

            let pillarBody = createBoxBody(0.8, 3, 0.8, 0)
            pillarBody.body.position.set(
                diceBody.body.position.x,
                diceBody.body.position.y + 2.7,
                diceBody.body.position.z
            )
            this.pillarBodies.push(pillarBody)

            // this.physicsWorld.addBody(diceBody.body)
            // this.physicsWorld.addBody(pillarBody.body)
        }


        // Body for Fence
        let anchor = 1
        for (let avatar = 0; avatar < 2; avatar++) {
            for (let index = 0; index < 32; index++) {

                let theta = index * (Math.PI / 16)
                let pos = {
                    x: 2.8 * Math.cos(theta),
                    y: 0.25 + 1.5 * Math.cos(theta + anchor * Math.PI / 2),
                    z: 2.8 * Math.sin(theta) + 6 * anchor
                }

                let fence = createBoxBody(0.2, 4.5, 0.4, 0)
                this.fenceBodies.push(fence)
                fence.body.position.copy(pos)
                fence.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -theta)
                this.physicsWorld.addBody(fence.body)

                fence.mesh.position.copy(fence.body.position)
                fence.mesh.quaternion.copy(fence.body.quaternion)
            }

            anchor *= -1;
        }

    }


    SimulationUpdate(cnt, anchor) {
        this.physicsWorld.step(1 / 60)
        let logs = []

        let contacts = this.physicsWorld.contacts
        // console.log(contacts)
        contacts.forEach(contact => {
            // console.log(contact.bi.force, contact.bj.force)
            // console.log(contact.getImpactVelocityAlongNormal() )
            let impact_value = contact.getImpactVelocityAlongNormal()
            impact_value = Math.abs(impact_value)

            if (impact_value > 0.5) {
                // console.log(contact)
                contact.bi.impact_ = impact_value
                contact.bj.impact_ = impact_value
                // contact.bi.isCollision = true
                // contact.bj.isCollision = true
            }
        })

        for (let index = 0; index < cnt; index++) {
            let dice_body = this.diceBodies[index].body

            let log = this.BodyUpdate(dice_body, anchor)
            logs.push(log)


            let pillar = this.pillarBodies[index]
            pillar.body.position.set(
                dice_body.position.x,
                dice_body.position.y + 2.7,
                dice_body.position.z
            )
            pillar.mesh.position.copy(pillar.body.position)
        }


        // this.d12_dices.forEach(dice => {
        //     let dice_body = dice.body
        //     this.BodyUpdate(dice_body, anchor)
        // })


        return logs
    }


    BodyUpdate(body, anchor) {
        let log = {}
        if (body.position.y > 2)
            body.applyForce(new CANNON.Vec3(0, 0, anchor * this.physicsConfig.magnet), body.position)

        // body.animation_frame++

        log.position = body.position.clone()
        log.quaternion = body.quaternion.clone()
        log.impact = body.impact_
        body.impact_ = 0
        // if(body.isCollision == true){
        //     log.collision = true
        //     body.isCollision = false

            
        //     // console.log(` [ static code ] ${body.animation_frame - 1}, ${this.physicsWorld.time}`)

        // }

        return log
    }


    // 6, 350
    GetDiceLog(cnt, simulationLength, anchor) {
        let historyLogs = new Array(cnt)
        for (let i = 0; i < cnt; i++)
            historyLogs[i] = []

        const GRAVITY = - 9.82
        this.physicsWorld.gravity.set(0, GRAVITY, 0)
        for (let frame = 0; frame < simulationLength; frame++) {
            // y=1\ +\ 3e^{40\left(x-1\right)}

            // this.physicsWorld.gravity.set(0, GRAVITY * (1 + 0.05 * Math.exp(40 * (frame / simulationLength) - 1)), 0)

            if (frame > simulationLength * 0.8)
                this.physicsWorld.gravity.set(0, GRAVITY * (1 + 30 * Math.exp(80 * (frame / simulationLength - 1))), 0)


            // let deltaTime = this.time.delta

            // console.log("update")

            // let logs = []
            let logs = this.SimulationUpdate(cnt, anchor)
            logs.forEach((log, index) => {
                historyLogs[index].push(log)
            })

            // historyLogs.push(logs)
        }

        // console.log(historyLogs)

        return historyLogs
    }


    _SetPhysicsWorld(cnt) {
        for (let index = 0; index < cnt; index++) {
            this.physicsWorld.addBody(this.diceBodies[index].body)
            // this.physicsWorld.addBody(this.pillarBodies[index].body)
        }
    }


    _ResetPhysicsWorld(cnt) {
        for (let index = 0; index < cnt; index++) {
            this.physicsWorld.removeBody(this.diceBodies[index].body)
            // this.physicsWorld.removeBody(this.pillarBodies[index].body)
        }
    }

    _PrepareSimulation(cnt, anchor) {
        let positions = []
        // let theta = 

        // let pos_ = new CANNON.Vec3(
        //     0, this.physicsConfig.spawn_height, this.physicsConfig.spawn_distance * anchor
        // )

        // positions.push(pos_)

        let theta_ = Math.PI * 2 * Math.random()
        // let theta_ = 0
        for (let index = 0; index < 6; index++) {
            // let pos = new CANNON.Vec3(
            //     ((index % 3) - 1) * 1.65,
            //     this.physicsConfig.spawn_height, //+ Math.random() * 4 - 2,
            //     (this.physicsConfig.spawn_distance + Math.floor(index / 3) * 1.65) * anchor
            // )


            let pos = new CANNON.Vec3(
                (Math.cos(theta_) + Math.sin(theta_)) * this.physicsConfig.gap,
                this.physicsConfig.spawn_height, //+ Math.random() * 4 - 2,
                (-Math.sin(theta_) + Math.cos(theta_)) * this.physicsConfig.gap + ((this.physicsConfig.spawn_distance - 1.65 / 2) * anchor)
            )

            // if(cnt > 5){
            //     pos.z -= (anchor * 1.65 / 2)
            // }

            // if(index > 5){
            //     pos.x += (1.65 / 2)
            //     // pos.y += 5
            // }
            // else
            //     pos.y += (Math.random() * 2 - 1)


            positions.push(pos)

            theta_ += (Math.PI / 3)
        }


        // for (let index = 0; index < 2; index++) {
        //     let pos = new CANNON.Vec3(
        //         (index - 0.5) * 2.5,
        //         this.physicsConfig.spawn_height,
        //         (this.physicsConfig.spawn_distance +  2 * 1.65) * anchor
        //     )
        //     positions.push(pos)
        // }
        // console.log(cnt)

        // console.log(positions)
        positions = shuffle_(positions)
        // console.log(positions)
        // positions.splice(-(6 - cnt), 6 - cnt)
        // console.log(positions)


        let pos_index = 0


        for (let index = 0; index < cnt; index++) {
            let diceBody = this.diceBodies[index].body
            // let pos = new CANNON.Vec3(
            //     ((index % 3) - 1) * 1.65,
            //     this.physicsConfig.spawn_height,
            //     (this.physicsConfig.spawn_distance + (index % 2) * 1.65) * anchor
            // )

            this._InitializeBody(diceBody, positions[pos_index++])
        }

        // this.d12_dices.forEach((dice, index) => {
        //     let sphereBody = dice.body
        //     let pos = new CANNON.Vec3(
        //         // ((index % 3) - 1) * 1.65,
        //         (index - 0.5) * 2.5,
        //         this.physicsConfig.spawn_height,
        //         (this.physicsConfig.spawn_distance +  2 * 1.65) * anchor
        //     )

        //     this._InitializeBody(sphereBody, positions[pos_index++])
        // })
        
    }

    
    _InitializeBody(body, pos) {
        // Position
        body.position.setZero();
        body.previousPosition.setZero();
        body.interpolatedPosition.setZero();
        body.initPosition.setZero();

        // orientation
        body.quaternion.set(0, 0, 0, 1);
        body.initQuaternion.set(0, 0, 0, 1);
        // object.body.previousQuaternion.set(0,0,0,1);
        body.interpolatedQuaternion.set(0, 0, 0, 1);

        // Velocity
        body.velocity.setZero();
        body.initVelocity.setZero();
        body.angularVelocity.setZero();
        body.initAngularVelocity.setZero();

        // Force
        body.force.setZero();
        body.torque.setZero();

        // Sleep state reset
        body.sleepState = 0;
        body.timeLastSleepy = 0;
        body._wakeUpAfterNarrowphase = false;

        // position setting
        body.position.copy(pos)

        // body.animation_frame = 0
        body.isCollision = false

    }


    _ApplyForce(cnt, anchor) {
        for (let index = 0; index < cnt; index++) {
            let diceBody = this.diceBodies[index].body
            this._ApplyForce_Body(diceBody, anchor)
        }


        // this.d12_dices.forEach((dice, index) => {
        //     let sphereBody = dice.body
        //     this._ApplyForce_Body(sphereBody, anchor)

        // })
    }


    _ApplyForce_Body(body, anchor) {
        // console.log(diceBody)

        

        // force
        body.applyForce(new CANNON.Vec3(0, 0, -1 * anchor * this.physicsConfig.force), body.position)

        let theta = Math.random() * 2 * Math.PI

        // torque
        body.applyForce(
            new CANNON.Vec3(0, -this.physicsConfig.torque, 0),
            new CANNON.Vec3(
                this.physicsConfig.torque_radius * Math.cos(theta) + body.position.x,
                body.position.y,
                this.physicsConfig.torque_radius * Math.sin(theta) + body.position.z
            ))
    }


    // anchor 방향으로 cnt 갯수의 주사위를 굴린다
    _DiceRollSimulation(cnt, anchor) {
        // console.log(this.diceBodies)

        this._SetPhysicsWorld(cnt)
        this._PrepareSimulation(cnt, anchor)
        this._ApplyForce(cnt, anchor)
        let ret = this.GetDiceLog(cnt, 270, anchor)

        this._ResetPhysicsWorld(cnt)



        return ret
    }



    CheckRollResult(cnt, anchor) {

        for (let index = 0; index < cnt; index++) {
            let bodyPosition = this.diceBodies[index].body.position
            let trayPosition = new CANNON.Vec3(0, 0, anchor * 6)
            if (bodyPosition.distanceSquared(trayPosition) > (2.55 * 2.55)) {
                // console.log(`[dice roll fail - RED] dice is bounced out from the tray!`)
                return false
            }

            if (bodyPosition.y > 0.5) {
                // console.log(`[dice roll fail - YELLOW] dice is hanged!`)
                return false;
            }

        }

        // console.log(this.diceBodies[0].body.position.y )
        return true;
    }


    DiceRollSimulation(cnt, anchor) {
        let prom = new Promise((res) => {
            while (true) {
                // dice_rolling_sound_frames.length = 0
                let ret = this._DiceRollSimulation(cnt, anchor)
                if (this.CheckRollResult(cnt, anchor))
                    return res(ret)
                // return ret
            }

        })

        return prom
    }



    _DBG_RollDices() {
        this._SetPhysicsWorld(6)
        this._PrepareSimulation(6, 1)
        this._ApplyForce(6, 1)

        this.dbg_update = true
        setTimeout(() => {
            this.dbg_update = false
            this._ResetPhysicsWorld(6)
        }, 1700)

        // console.log("hello world")
    }




    setDebug() {
        if (this.debug.active) {
            // this.d12_dice = CreateDodecahedron(0.8, "white", -2.5)
            // this.scene.add(this.d12_dice.mesh)
            // this.physicsWorld.addBody(this.d12_dice.body)



            this.diceBodies.forEach(diceBody => {
                this.scene.add(diceBody.mesh)
            })

            // console.log(this.pillarBodies)
            // this.pillarBodies.forEach(pillarBody => {
            //     this.scene.add(pillarBody.mesh)
            // })

            this.fenceBodies.forEach(fenceBody => {
                this.scene.add(fenceBody.mesh)
            })

            this.debugFolder = this.debug.ui.addFolder("physics");
            // this.debugFolder.add(this, "_DBG_DiceRoll_Top")
            // this.debugFolder.add(this, "_DBG_DiceRoll_Bottom")

            this.debugFolder.add(this.physicsConfig.normalFaces, "0", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.physicsConfig.normalFaces, "1", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.physicsConfig.normalFaces, "2", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.physicsConfig.normalFaces, "3", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.physicsConfig.normalFaces, "4", ["right", "left", "top", "bottom", "front", "back"])
            this.debugFolder.add(this.physicsConfig.normalFaces, "5", ["right", "left", "top", "bottom", "front", "back"])

            this.debugFolder.add(this, "_DBG_RollDices")


            this.debugFolder.add(this.physicsConfig, 'spawn_height', 0, 15, 0.05);
            this.debugFolder.add(this.physicsConfig, 'spawn_distance', 0, 15, 0.05);
            this.debugFolder.add(this.physicsConfig, 'force', 100, 1000, 5);
            this.debugFolder.add(this.physicsConfig, 'torque', 0, 200, 1);
            this.debugFolder.add(this.physicsConfig, 'torque_radius', 0, 10, 0.1);
            this.debugFolder.add(this.physicsConfig, 'magnet', 0, 10, 0.001);
            this.debugFolder.add(this.physicsConfig, 'decay_weight', 0, 100, 0.1);
            this.debugFolder.add(this.physicsConfig, 'gap', 0, 5, 0.001);


            // magnet
            // this.debugFolder.add(this.physicsConfig, 'tray_radius', 0, 5, 0.05);
            // this.debugFolder.add(this.physicsConfig, 'tray_height', 0, 5, 0.05);


            // this.debugFolder.add(this.normalFaces, "0", ["right", "left", "top", "bottom", "front", "back"])
            // this.debugFolder.add(this.normalFaces, "1", ["right", "left", "top", "bottom", "front", "back"])
            // this.debugFolder.add(this.normalFaces, "2", ["right", "left", "top", "bottom", "front", "back"])
            // this.debugFolder.add(this.normalFaces, "3", ["right", "left", "top", "bottom", "front", "back"])
            // this.debugFolder.add(this.normalFaces, "4", ["right", "left", "top", "bottom", "front", "back"])
            // this.debugFolder.add(this.normalFaces, "5", ["right", "left", "top", "bottom", "front", "back"])


            //spawn_height

        }
    }


    update() {

        if(this.debug.active){
            // this.d12_dices.forEach(dice => {
            //     dice.mesh.position.copy(dice.body.position)
            //     dice.mesh.quaternion.copy(dice.body.quaternion)

            // })   
        }

        if (this.isPlay && false) {
            console.log(`${this.videoIndex} / ${this.videoLength}`)
            for (let index = 0; index < 6; index++) {

                this.diceBodies[index].mesh.position.copy(this._DBG_VIDEO[this.videoIndex][index].position)
                this.diceBodies[index].mesh.quaternion.copy(this._DBG_VIDEO[this.videoIndex][index].quaternion)



            }



            this.videoIndex++;
            if (this.videoIndex == this.videoLength) {
                this.isPlay = false;
            }


        }

        if (false || this.dbg_update) {
            // this.physicsWorld.step(1 / 60)
            // console.log("update")


            this.SimulationUpdate(6, 1)

            this.diceBodies.forEach((dice, index) => {
                // dice.body.applyForce(new CANNON.Vec3(0, 0, anchor * this.physicsConfig.magnet), dice.body.position)

                dice.mesh.position.copy(dice.body.position)
                dice.mesh.quaternion.copy(dice.body.quaternion)

                let pillar = this.pillarBodies[index]
                pillar.body.position.set(
                    dice.body.position.x,
                    dice.body.position.y + 2.7,
                    dice.body.position.z
                )
                pillar.mesh.position.copy(pillar.body.position)

            })
            
            // this.d12_dices.forEach(dice => {
            //     dice.mesh.position.copy(dice.body.position)
            //     dice.mesh.quaternion.copy(dice.body.quaternion)

            // })   
            

        }

    }

}