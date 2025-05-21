import * as THREE from 'three'
import Experience from '../../Experience.js'
import MjolnirEffects from '../MjolnirEffects.js'



function setUnrealBloom(mesh) { mesh.layers.enable(1) }

function AxeThrowing(obj, target, anim, sound){
    // console.log(sound)
    let from = new THREE.Vector3(0, 1.5, -1.5)
    obj.localToWorld(from)
    let to = target.clone()

    let revDir = from.clone().sub(to).normalize().multiplyScalar(0.6)
    to.add(revDir)

    revDir.normalize()
    let ready = { value: 0 }

    anim.to(obj.position, { duration: 0.3, ease: "Power2.easeOut", x: from.x, y: from.y, z: from.z })
        .to(ready, {
            duration: 0.3, ease: "Power2.easeOut", value: 1, onUpdate: () => {
                obj.rotateX((1 - ready.value) * -0.05)
            }
        }, "<")
        .to(obj.position, {
            duration: 0.35, ease: "none", x: to.x, y: to.y, z: to.z,
            onStart: () => { sound.Play_AxeThrow() },
            onUpdate: () => { obj.rotateX(0.35) },
            onComplete: () => { obj.lookAt(target); obj.rotateX(Math.PI / 4) }
        })

    return anim
}


function ArrowShooting(obj, target, anim, sound){
    // console.log(sound)
    let from = new THREE.Vector3(0, 0.5, -0.5)
    obj.localToWorld(from)
    let to = target.clone()

    let revDir = from.clone().sub(to).normalize().multiplyScalar(0.5)
    to.add(revDir)

    return anim.to(obj.position, { duration: 0.3, ease: "Power2.easeOut", x: from.x, y: from.y, z: from.z })
        .to(obj.position, {
            duration: 0.25, ease: "Power3.easeIn", x: to.x, y: to.y, z: to.z,
            onStart: () => { sound.Play_ArrowThrow() },
        })
    // return anim.to(obj.position, {duration : duration, ease: "none", x : target.x, y: target.y, z : target.z})
}


const dictionary = {
    "axe": {
        material: "normal-weapon", geometry: "axe",
        setMesh: (mesh) => {
            mesh.rotateX(Math.PI / 2)
            setUnrealBloom(mesh)
        },
        "Action": (caller, target) => { return caller.Throw(target) },
        "GetTarget": (targetAvatar) => { return targetAvatar.GetTargetHealthStone("axe", true) },
        "AnimationShooting": AxeThrowing
    },

    "arrow": {
        material: "normal-weapon", geometry: "arrow", setMesh: (mesh) => { setUnrealBloom(mesh) },
        "Action": (caller, target) => { return caller.Throw(target) },
        "GetTarget": (targetAvatar) => { return targetAvatar.GetTargetHealthStone("arrow", true) },
        "AnimationShooting": ArrowShooting
    },
    "mjolnir": {
        material: "mjolnir", geometry: "mjolnir", setMesh: (mesh) => { setUnrealBloom(mesh) },
        "Action": (caller, target) => { return caller.Throw(target) },
        "GetTarget": (targetAvatar) => { return targetAvatar.GetTargetHealthStone("godfavor", true)},
        "AnimationShooting": (obj, target, anim, sound) => {
            // console.log(sound)
            let from = new THREE.Vector3(0, 0.5, -0.5)
            obj.localToWorld(from)
            let to = target.clone()

            let revDir = from.clone().sub(to).normalize().multiplyScalar(0.5)
            to.add(revDir)

            return anim.to(obj.position, { duration: 0.65, ease: "none", x: to.x, y: to.y, z: to.z })
            // return anim.to(obj.position, {duration : duration, ease: "none", x : target.x, y: target.y, z : target.z})
        },
        "effects": function (parent) { return new MjolnirEffects(parent) }
    },

    "helmet": {
        material: "normal-weapon", geometry: "helmet", setMesh: (mesh) => { setUnrealBloom(mesh) },
        "Action": (caller, target, avatar) => {
            avatar.eventEmitter.trigger(`${avatar.index}-block-axe`)
            return caller.AnimationAppearance()
        },
        "Action_End": (caller, avatar, sound) => {
            // console.log(sound)
            sound.Play_AxeBlock()
            avatar.eventEmitter.trigger(`${avatar.index}-block-axe-anim`, [caller.GetPosition()])
        }
    },

    "shield": {
        material: "normal-weapon", geometry: "shield", setMesh: (mesh) => { setUnrealBloom(mesh) },
        "Action": (caller, target, avatar) => {
            avatar.eventEmitter.trigger(`${avatar.index}-block-arrow`)
            return caller.AnimationAppearance()
        },
        "Action_End": (caller, avatar, sound) => {
            // console.log(sound)
            sound.Play_ArrowBlock()
            avatar.eventEmitter.trigger(`${avatar.index}-block-arrow-anim`, [caller.GetPosition()])
        }
    },

    "steal": {
        material: "steal", geometry: "steal", setMesh: () => { },
        "Action": (caller, target, avatar) => {
            let obj = caller.mesh
            let newPosition = avatar.GetNextTokenPosition()

            let anim = caller.AnimationAppearance()
            caller.AnimationShooting(obj, target, anim)
            anim.add(caller.AnimationDisappearance(0.45, 0))
            anim.add(target.slideMove(newPosition), "<")
            anim.addLabel("moveend", "-=0.6")


            let withdrawed_token = avatar.AddOtherToken(target)
            anim.add(withdrawed_token.Appear(newPosition), "moveend")

            return anim
        },
        "GetTarget": (targetAvatar, ownerAvatar) => {
            // console.log(ownerAvatar)
            if (ownerAvatar.Check_Token_FreeSpace())
                return targetAvatar.GetTargetToken()
            else
                return null
        },
        "AnimationShooting": (obj, target, anim, sound) => {
            // console.log(sound)
            let to = target.GetPosition().clone()
            return anim.to(obj.position, {
                duration: 0.4, ease: "none", x: to.x, y: to.y, z: to.z,
                // onStart: () => { sound.Play_StealToken() }
            })
        }
    },

    "health-stone": {
        material: "health-stone", geometry: "health-stone",
        setMesh: (mesh) => {
            // mesh.scale.y = 0.5; mesh.scale.x = 0.85, mesh.scale.z = 1.2;
            let random_theta = (Math.random() - 0.5)
            mesh.rotateY(random_theta)
        },
        "Action": (caller) => {
            // let pos = new THREE.Vector3(0, -2, 0)
            // caller.mesh.localToWorld(pos)
            // return caller.MoveTo(pos)
        }
    }
}




export default class ModelDictionary {
    constructor() {
        this.experience = new Experience()
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.scene = this.experience.scene

    }

    CreateModel(modelName) {
        let geometry = this.geometryManager.getGeometry(dictionary[`${modelName}`].geometry)
        let material = this.materialManager.getMaterial(dictionary[`${modelName}`].material)
        let model = null

        // if(modelName == "health-stone")
        //     console.log(geometry)

        switch (modelName) {
            case "steal":
                model = new THREE.Sprite(material)
                model.renderOrder = 5;
                break;

            default:
                model = new THREE.Mesh(geometry, material)
                break;
        }

        dictionary[`${modelName}`].setMesh(model)
        this.scene.add(model)

        model.AnimationShooting = dictionary[`${modelName}`]["AnimationShooting"]
        model.GetTarget = dictionary[`${modelName}`]["GetTarget"]
        model.Action = dictionary[`${modelName}`]["Action"]
        model.Action_End = dictionary[`${modelName}`]["Action_End"]
        model.active_ = true

        if(dictionary[`${modelName}`]["effects"]){
            model.effects = dictionary[`${modelName}`]["effects"].call(this, model)
        }

        return model;
    }
}



