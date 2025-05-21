import * as THREE from 'three'
// import PhysicsTest from '../PhysicsTest.js'

import Experience from '../Experience.js'
import Environment from './Environment.js'
// import Floor from './Floor.js'
// import Fox from './Fox.js'
// import Dice from './Dice.js'
import Dice from './Items/Dice.js'
// import TokenDice from './Items/TokenDice.js'

import GodFavor from './GodFavor.js'
// import GodPiece from './GodPiece.js'
import Tray from './Tray.js'
import Towel from './Towel.js'
// import HealthStone from './HealthStone.js'
import HealthStone from './Items/HealthStone.js'
// import TurnEndButton from './TurnEndButton.js'
// import TurnEndButtonDBG from './TurnEndButtonDBG.js'
// import Weapon from './Model/Weapon.js'
// import Weapon from "./Items/Weapon.js"

// import Model from './Items/Model.js'
import FlipCoin from './FlipCoin.js'

import Avatar from './Avatar.js'
// import {godFavorsAction, godFavorsExtraAction} from '../godFavorsAction.js'

// import FadeDisappear from '../Shaders/Materials/FadeDisappear.js'
// import ParticleSystem from '../Particle/ParticleSystem.js'
// import EnergyMaterial from '../Shaders/Materials/EnergyMaterial.js'

import Stamp from './Items/Stamp.js'

import gsap from 'gsap'

import DoubleCube from "./Items/DoubleCube.js"
// import ParticleScatter from '../Particle/ParticleScatter.js'
// import EffectComponent from '../Particle/EffectComponent.js'
// import ShootingStar from './ShootingStar.js'
// import HealingBall from './HealingBall.js'
// import FireWorks from './FireWorks.js'
// import PoisonNeedles from './PoisonNeedles.js'

// import Token from './Token_Pool.js'
import Token_Effect from './Token_Effect_Pool.js'
import Clock from './Items/Clock.js'

import Ragnarok from './Items/Ragnarok.js'
import Ragnarok_Effect from './Items/Ragnarok_Effect.js'

// import { LoopSubdivision } from '../Geometries/LoopSubdivision.js'

// import { Water } from 'three/addons/objects/Water2.js';
// import { LightningStrike } from 'three/addons/geometries/LightningStrike.js' 

// import { LightningStorm } from 'three/addons/objects/LightningStorm.js';



// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'


let sphere_material, mask_material, outline_material, energy_material

const diceFaceInfo = [
    {
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

    },

    // {
    //     "right": { weapon: "zero", token: false },
    //     "left": { weapon: "zero", token: false },
    //     "top": { weapon: "one", token: false },
    //     "bottom": { weapon: "one", token: false },
    //     "front": { weapon: "two", token: false },
    //     "back": { weapon: "three", token: false }

    // },
    // {
    //     "right": { weapon: "zero", token: false },
    //     "left": { weapon: "zero", token: false },
    //     "top": { weapon: "one", token: false },
    //     "bottom": { weapon: "one", token: false },
    //     "front": { weapon: "two", token: false },
    //     "back": { weapon: "three", token: false }

    // }
]


            
let players=["top", "bottom"]
        
const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.gameObjects = {}   // "mesh id" : "object"

        this.playerInteractableObjects = [];

        this.top_card_pick_ancnor = new THREE.Vector3(-3.75, 0, -4.25 + 0.5)
        this.bottom_card_pick_anchor = new THREE.Vector3(2.25, 0, 5.0 + 0.5)
        // gsap.ticker.lagSmoothing(false);


        this.itemsDictionary = new Map()


        this.animation_objects = new Map()


        // document.addEventListener("visibilitychange", function() {
        //     if (document.hidden){
        //         console.log("hidden")
        //     } else {
        //         console.log("display")
        //         gsap.ticker.lagSmoothing(200, 33);
        //     }
        // });

        // let r2_url = "https://pub-0256486a954c46a6b1aa910ba51cca8f.r2.dev"
        // let r2_obj = "ban_.png"

        
        // let r2_url = "https://threejs.org/examples/textures"
        // let r2_obj = "uv_grid_opengl.jpg"

        // let textureLoader = new THREE.TextureLoader()

        // textureLoader.load(
        //     `${r2_url}/${r2_obj}`,
        //     (file) => { console.log(file) }
        // )


        // Wait for resources
        this.resources.on('ready', () => {
            
            this.environment = new Environment()

            this.double_cube = new DoubleCube()
            this.experience.controller.double_cube = this.double_cube

            // this.AddItem(this.double_cube)
            // this.gameObjects[`${this.double_cube.getID()}`] = this.double_cube;
            // this.playerInteractableObjects.push(this.double_cube.GetInstance())


            new Ragnarok_Effect()
            new Token_Effect()

            this.ragnarok = new Ragnarok()


            // let sphered_cube = this.resources.items["spheredCube"].scene
            // console.log(sphered_cube)

            // this.scene.add(sphered_cube)
            // sphered_cube.position.y += 3

            // console.log(sphered_cube.children[0].children[0])
            // console.log(sphered_cube.children[0].children[1])

            // sphered_cube.children[0].children[0].position.x += 2
            // sphered_cube.children[0].children[1].position.x += 4


            // window.addEventListener("keydown", event=>{
            //     if (event.key === "a") {
            //         let star0 = new ShootingStar()

            //         star0.Move(
            //             new THREE.Vector3(8, 3, 8),
            //             new THREE.Vector3(Math.floor(Math.random() * 7) * 2.5 - 7.5, 1, -1),
            //             1.0
            //         )

            //     }


            //     if (event.key === "s") {
            //         this.Take_FrostBite("bottom", 4)

            //     }
            //     // if(event.key === "z"){
            //     //     let weapon = new Weapon("steal")
            //     //     weapon.SetPosition(new THREE.Vector3(0, 1, -5))

            //     //     let target = weapon.GetTarget(this.avatars["bottom"], this.avatars["top"])
            //     //     if(target != null){
            //     //         weapon.Action(target, this.avatars["top"])
            //     //             .then((res) => { res() })
            //     //     }


            //     // }

            //     // if(event.key === "x"){
            //     //     let weapon = new Weapon("steal")
            //     //     weapon.SetPosition(new THREE.Vector3(0, 1, -5))

            //     //     let target = weapon.GetTarget(this.avatars["top"], this.avatars["bottom"])
            //     //     if(target != null){
            //     //         weapon.Action(target, this.avatars["bottom"])
            //     //             .then((res) => { res() })
            //     //     }
            //     // }


            //     if (event.key === "d") {
            //         this.Take_FrostBite("top", 4)
            //     }
                
            //     if (event.key === "f") {
            //     }
            // })

            // let obj_ = new THREE.Object3D()
            // obj_.position.set(12.5, 0, 0)
            // obj_.rotateY(-Math.PI / 2)
            // obj_.scale.set(1, 0.75, 0.75)
            // obj_.updateMatrix()
        
            this.clock = new Clock()

            this.clock.Light("top", 0, false)
            this.clock.Light("top", 1, false)
            this.clock.Light("top", 2, false)

            this.clock.Light("bottom", 0, false)
            this.clock.Light("bottom", 1, false)
            this.clock.Light("bottom", 2, false)


            // setTimeout(() => {
            //     this.clock.Light("top", 1, false)
            // }, 6000)



            // this.clock.FillText("❄", "#4499ff")
            this.clock.DisplayFavor()


            // let time_ = 0
            // setInterval(() => {
            //     this.clock.FillText(time_)
            //     time_++
            //     if (time_ == 99)
            //         time_ = 0
            // }, 1000)







            // console.log(this.resources.items["ChessClock"])
            // this.clock = this.resources.items["ChessClock"].scene

            // this.scene.add(this.clock)
            // this.clock.rotateY(-Math.PI / 2)
            // this.clock.position.set(12.5, 0, 0)
            // this.clock.children[0].castShadow = true
            // this.clock.scale.set(1.0, 0.75, 0.75)

            // let clock_display_canvas = document.createElement("canvas")

            // // clock_display_canvas.style["z-index"] = 500
            // // clock_display_canvas.style["position"] = "absolute"
            // // document.getElementById("game-canvas").appendChild(clock_display_canvas)


            // const ctx = clock_display_canvas.getContext('2d');
            // clock_display_canvas.width = 480;
            // clock_display_canvas.height = 270;

                
            // ctx.fillStyle = '#000000';
            // ctx.fillRect(0, 0, clock_display_canvas.width, clock_display_canvas.height);


            // const canvas_texture = new THREE.CanvasTexture(clock_display_canvas);
            // canvas_texture.needsUpdate = true;

            // let display_material = new THREE.MeshBasicMaterial({map : canvas_texture})
            // this.clock.children[1].material.dispose()
            // this.clock.children[1].material = display_material

            // let ekekek = 0

            
            // function DrawCircle(cx, cy, stroke_color, fill_color) {
            //     ctx.save()

            //     ctx.lineWidth = 6;
            //     ctx.strokeStyle = stroke_color
            //     ctx.fillStyle = fill_color

            //     ctx.beginPath()
            //     ctx.arc(cx, cy, 30, 0, 2 * Math.PI)
            //     ctx.stroke()
            //     ctx.fill()
            //     ctx.closePath()


            //     ctx.restore()

            // }


            // DrawCircle(60, 50, "#00ffff", "#000f0f")
            // DrawCircle(60, 135, "#00ffff", "#00ffff")
            // DrawCircle(60, 220, "#00ffff", "#00ffff")
            
            // DrawCircle(420, 50, "#00ff00", "#000f00")
            // DrawCircle(420, 135, "#00ff00", "#000f00")
            // DrawCircle(420, 220, "#00ff00", "#00ff00")



            // setInterval(() => {
            //     let value = ekekek;
            //     let txt = value.toString()
            //     // ctx.clearRect(120, 0, 240, 270);

            //     ctx.save()

            //     ctx.fillStyle = "rgb(0,0,0)"
            //     ctx.fillRect(120, 0, 240, 270)


            //     ctx.lineWidth = 3;
            //     ctx.font = '11rem Tektur'
            //     ctx.textAlign = 'left'
            //     ctx.strokeStyle = "rgba(255, 255, 255)"
            //     ctx.fillStyle = "rgba(255, 255, 255)"


            //     let textWidth = ctx.measureText(txt).width;
            //     let textHeight = ctx.measureText(txt).actualBoundingBoxAscent + ctx.measureText(txt).actualBoundingBoxDescent;

            //     let cX = clock_display_canvas.width / 2 - (textWidth / 2);
            //     let cY = clock_display_canvas.height / 2 + (textHeight / 2);

            //     ctx.fillText(txt, cX, cY);

            //     ctx.restore()
            //     canvas_texture.needsUpdate = true;
            //     ekekek++;
            // }, 1000)




            // setTimeout(() => { 
            //     let star0 = new ShootingStar() 
            //     star0.instance.position.set(0, 3.5, 7)
            //     star0.instance.rotateY(Math.PI / 2)
                
            //     // let star1 = new ShootingStar() 
            //     // star1.instance.position.set(0, 3.5, -7)
            //     // star1.instance.rotateY(-Math.PI / 2)


            //     // setTimeout(()=>{
            //     //     star0.Destroy()
            //     //     // star1.Destroy()
            //     // }, 5000)

            // }, 3500)
            

            // const water_normal = this.resources.items["waternormals"]
            // water_normal.encoding = THREE.sRGBEncoding
            // water_normal.wrapS = THREE.RepeatWrapping
            // water_normal.wrapT = THREE.RepeatWrapping

            // const waterGeometry = new THREE.PlaneGeometry( 4, 4 );
            // this.water = new Water(
            //     waterGeometry,
            //     {
            //         scale:2,
            //         textureWidth: 512,
            //         textureHeight: 512,
            //         waterNormals: water_normal
            //     }
            // );

            // this.water.position.set(0,3,0)
            // this.water.rotation.x = - Math.PI / 2;

            // this.scene.add(this.water);


            // let tmp_plane = new THREE.Mesh(
            //     new THREE.PlaneGeometry(3,6,1,1),
            //     new THREE.MeshBasicMaterial({ wireframe: true })
            // )
            // tmp_plane.position.set(0, 4, 0)
            // this.scene.add(tmp_plane)


            // console.log(tmp_plane.geometry.attributes.position)
            // for (let i = 0; i < tmp_plane.geometry.attributes.position.count; i += 2) {
            //     tmp_plane.geometry.attributes.position.array[i * 3] *= 0.5
            //     tmp_plane.geometry.attributes.position.array[(i + 1) * 3] *= 0.5
            // }

            // tmp_plane.rotateX(-Math.PI / 2)



            // projectile_tex.center.set(0.5, 0.5)
            // projectile_tex.rotation = Math.PI / 2


            // geo_arr[3 * i] *= (geo_size - i) / geo_size
            // geo_arr[3 * (i + 1)] *= (geo_size - i) / geo_size


            // let particle_params = [
            //     {
            //         fire_type : "burst",    // "burst" or "stream".
            //         burst_cnt : 20,
            //         particle_geometry : new THREE.TorusGeometry(0.25, 0.125, 5, 16),
            //         particle_material : new THREE.MeshBasicMaterial({
            //             transparent: true,
            //             depthWrite: false,
            //             // blending: THREE.AdditiveBlending
            //         }),
            //         particle_texture : "none",
            //         mainbody_lifetime: 3000,
            //         colors: [
            //             new THREE.Color("#0000ff"),
            //             new THREE.Color("#0000ff"),
            //             new THREE.Color("#0000ff"),
            //             new THREE.Color("#0033ff"),
            //             // new THREE.Color("#00ffff")
            //         ],
            //         direction_heritaged: true,
            //         direction_theta: null,
            //         regen_area_type: false,
            //         regen_area: new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
            //         create_interval_time: null,
            //         create_interval_time_random: null,
            //         // rotation_angle : Math.PI / 6,
            //         rotation_angle_random : Math.PI / 6,
            //         particle_life_time: 250,
            //         particle_life_time_random: 0,
            //         speed: 6.0,
            //         speed_random: 0.5
            //     },
            //     {
            //         fire_type : "stream",    // "burst" or "stream".
            //         burst_cnt : null,
            //         particle_geometry : new THREE.TorusGeometry(0.25, 0.125, 5, 16),
            //         particle_material : new THREE.MeshBasicMaterial({
            //             transparent: true,
            //             depthWrite: false,
            //             // blending: THREE.AdditiveBlending
            //         }),
            //         particle_texture : "none",
            //         mainbody_lifetime: 3000,
            //         colors: [
            //             new THREE.Color("#ff0000"),
            //             new THREE.Color("#ff0000"),
            //             new THREE.Color("#ff3300"),
            //             new THREE.Color("#ffff00")
            //         ],
            //         direction_heritaged: false,
            //         direction_theta: Math.PI / 4,
            //         regen_area_type: false,
            //         regen_area: new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
            //         create_interval_time: 20,
            //         create_interval_time_random: 5,
            //         // rotation_angle : Math.PI / 6,
            //         rotation_angle_random : Math.PI / 6,
            //         particle_life_time: 250,
            //         particle_life_time_random: 20,
            //         speed: -2.5,
            //         speed_random: 0.1
            //     }
            // ]



            // this.tmp_trail_object = new EffectComponent(particle_params, [{}])
            // this.tmp_trail_object.instance.position.set(0, 3.5, 8)
            // this.tmp_trail_object.instance.rotateY(Math.PI / 2)

            
            // this.tmp_trail_object0 = new EffectComponent(particle_params, [{}])
            // this.tmp_trail_object0.instance.position.set(0, 3.5, -8)
            // this.tmp_trail_object0.instance.rotateY(-Math.PI / 2)

            
            // this.tmp_particle_object = new EffectComponent(particle_params, [])


            // const rayParams = {
            //     sourceOffset: new THREE.Vector3(0, 10, 0),
            //     destOffset: new THREE.Vector3(0, 0, 0),
            //     radius0: 0.05,
            //     radius1: 0.05,
            //     minRadius: 2.5,
            //     maxIterations: 7,
            //     isEternal: true,

            //     timeScale: 0.7,

            //     propagationTimeFactor: 0.05,
            //     vanishingTimeFactor: 0.95,
            //     subrayPeriod: 2.5,
            //     subrayDutyCycle: 0.3,
            //     maxSubrayRecursion: 3,
            //     ramification: 7,
            //     recursionProbability: 0.6,

            //     roughness: 0.85,
            //     straightness: 0.68
            // }


            // let lightningStrike
            

            // lightningStrike = new LightningStrike(rayParams);
            // this.lightningStrikeMesh = new THREE.Mesh(lightningStrike, new THREE.MeshBasicMaterial({ color: "red", wireframe: true }));

            // this.lightningStrikeMesh.acc_time = 0



            // this.scene.add(this.lightningStrikeMesh);



            // console.log(this.playerInteractableObjects)
            
            // let colorMap = this.resources.items.textures_godsymbol_colormap
            // colorMap.encoding = THREE.sRGBEncoding

                
            // let normalMap = this.resources.items.token_normal
            // normalMap.encoding = THREE.sRGBEncoding

            // let tmp_mat = new THREE.MeshStandardMaterial({
            //     map : colorMap,
            //     normalMap : normalMap,
            //     color: "#bf7c00",
            //     envMapIntensity : 6,
            //     metalness: 0.9,
            //     roughness: 0.1
            // })

            // let tmp_box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,1,1,1), tmp_mat)
            // this.scene.add(tmp_box)
            // tmp_box.position.set(7,1,4.8)


            // let token_geo = new RoundedBoxGeometry(1,1,1,16,0.15);
            // console.log(token_geo)

            // let token_path = this.resources.items["token_svg"]

            // let extrudeSettings = {
            //     steps: 1,
            //     depth: 3,
            //     curveSegments:2,
            //     bevelEnabled: false
            // }
            // console.log(token_path)
            // let token_mark_geo = new THREE.ExtrudeGeometry(token_path, extrudeSettings)
            // console.log(token_mark_geo)
            // let position_arr = token_mark_geo.attributes.position.array
            // // let maxX = -20000000
            // for (let i = 0; i < position_arr.length; i += 3) {
            //     // maxX = Math.max(maxX, token_mark_geo.attributes.position.array[i])
            //     token_mark_geo.attributes.position.array[i] /= (76.7288 * 1.05);
            //     token_mark_geo.attributes.position.array[i + 1] /= (76.7288 * 1.05);
            //     token_mark_geo.attributes.position.array[i + 2] /= (76.7288 * 1.05);
            // }
            // // console.log(maxX)

            // console.log(position_arr.length)

            // let token_mark_mat = new THREE.MeshStandardMaterial({color : "yellow"})
            // let token_mark_mesh = new THREE.Mesh(token_mark_geo, token_mark_mat)
            // token_mark_mesh.rotateX(-Math.PI / 2)
            // token_mark_mesh.position.set(8,0.12,5)

            // this.scene.add(token_mark_mesh)


            // let token_plane_geo = new THREE.BoxGeometry(1,0.03,1,1,1,1)
            // let token_plane_mat = new THREE.MeshStandardMaterial({color : "#888800"})

            // let token_plane_mesh = new THREE.Mesh(token_plane_geo,token_plane_mat)

            // token_plane_mesh.position.set(8,0.1,5)
            // this.scene.add(token_plane_mesh)






            // let pebble0 = this.resources.items["pebblesModel"].scenes[0].children[0].geometry
            // let pebble1 = this.resources.items["pebblesModel"].scenes[0].children[1].geometry
            // let pebble2 = this.resources.items["pebblesModel"].scenes[0].children[2].geometry


            // // console.log(pebble0)
            // let pebble_mat = new THREE.MeshStandardMaterial({color : "green"})
            
            // let pebble_mesh = [
            //     new THREE.Mesh(pebble0, pebble_mat),
            //     new THREE.Mesh(pebble1, pebble_mat),
            //     new THREE.Mesh(pebble2, pebble_mat)
            // ]

            // pebble_mesh[0].position.y = 1
            // pebble_mesh[0].position.x = -5

            // pebble0.position.y = 0.5
            // pebble0.position.x = -7
            // pebble0.position.z = 2

            // pebble1.position.y = 0.5
            // pebble1.position.x = -5
            // pebble1.position.z = 2

            // pebble2.position.y = 0.5
            // pebble2.position.x = -3
            // pebble2.position.z = 2

            // pebble_mesh[0].position.y = 0.5
            // pebble_mesh[0].position.x = -3
            // pebble_mesh[0].position.z = 2

            // this.scene.add(pebble_mesh[0])

            // let ban_mat = new THREE.MeshBasicMaterial({map : this.resources.items["ban_sign"], transparent : true, color : "red"})
            // let ban_geo = new THREE.PlaneGeometry()
            // let ban_mesh = new THREE.Mesh(ban_geo, ban_mat)
            // ban_mesh.position.y += 1
            // ban_mesh.scale.set(2,2,2)
            // ban_mesh.rotateX(-Math.PI/2)
            // this.scene.add(ban_mesh)

            this.stamp = new Stamp()
            this.stamp.PositionToOrigin()


            // let stamp = this.resources.items.stampModel2.scenes[0].children[0]
            // this.scene.add(stamp)

            // let stamp = this.resources.items.stampModel3.scenes[0].children[0]
            // this.scene.add(stamp)



            // let camera = this.experience.camera.instance
            // let renderer = this.experience.renderer.instance


            // let geo_ = new THREE.BoxGeometry(1,1,1)
            // let mat_ = new THREE.MeshStandardMaterial({color : new THREE.Color("sienna")})

            // let box_mesh_0 = new THREE.Mesh(geo_, mat_)
            // box_mesh_0.position.set(-3.75, 0, -4.25 + 0.5)

            // let control_0 = new TransformControls( camera, renderer.domElement );
            // control_0.attach(box_mesh_0)

            // let box_mesh_1 = new THREE.Mesh(geo_, mat_)
            // box_mesh_1.position.set(2.25, 0, 5.0 + 0.5)
            // let control_1 = new TransformControls( camera, renderer.domElement );
            // control_1.attach(box_mesh_1)
            
            

            // this.scene.add(box_mesh_0)
            // this.scene.add(box_mesh_1)

            // this.scene.add(control_0)
            // this.scene.add(control_1)

            // window.addEventListener("keydown", e=>{
            //     if(e.key == "c"){
            //         console.log(box_mesh_0.position)
            //         console.log(box_mesh_1.position)
            //     }
            // })







            // dark aura


            // const sphere_geometry = new THREE.IcosahedronGeometry(0.5, 3);
            
            // sphere_material = new THREE.MeshStandardMaterial({
            //     map: this.resources.items.diceArrowTexture,
            //     color: 0x00cc22
            // });

            // energy_material = EnergyMaterial(sphere_material)
            // console.log(energy_material)
            // sphere_material.dispose();

            // const sphere_mesh = new THREE.Mesh( sphere_geometry, energy_material );
            // sphere_mesh.layers.enable(1)

            // sphere_mesh.position.x += 6;
            // sphere_mesh.position.y += 2;
            
            // this.scene.add(sphere_mesh)


            // Particle
            // const sphere_geometry = new THREE.IcosahedronGeometry(0.5, 3);
            // sphere_material = new THREE.MeshStandardMaterial({
            //     map : this.resources.items.diceArrowTexture
            //     , color: 0x00cc22 });
            // [mask_material, outline_material] = FadeDisappear(sphere_material)
            // sphere_material.dispose();

            // const sphere_mesh = new THREE.Mesh( sphere_geometry, mask_material );
            // const sphere_effect = new THREE.Mesh( sphere_geometry, outline_material );
            // sphere_effect.layers.enable(1)

            
            // this.particle = new ParticleSystem(sphere_geometry);

            // const sphere_group = new THREE.Group()
            // sphere_group.add(sphere_mesh)
            // sphere_group.add(sphere_effect)
            // sphere_group.add(this.particle.points)


            // this.scene.add( sphere_group );
            // sphere_group.position.y += 2;
            // sphere_group.position.x += 6;





            // let sprite_map = this.resources.items["circle01"]
            // let sprite_material = new THREE.SpriteMaterial( { map: sprite_map } );
            // sprite_material.color = new THREE.Color( 'skyblue' );
            // sprite_material.depthTest = false;
            // let sprite = new THREE.Sprite(sprite_material)
            // sprite.renderOrder = 5
            // sprite.scale.set(8, 8, 8)
            // sprite.position.x += 5;
            // this.scene.add(sprite)




            /*
            let circle_material = new THREE.MeshBasicMaterial({ map: this.resources.items["circle01"] })
            circle_material.transparent = true;
            circle_material.color = new THREE.Color(0x00ffff)
            let circle_plane = new THREE.Mesh(new THREE.PlaneGeometry(), circle_material)

            circle_plane.scale.set(8,8,8)
            circle_plane.position.x += 5;
            circle_plane.position.y += 4;
            circle_plane.position.z += 2;
            circle_plane.rotateX(-Math.PI / 4);
            circle_plane.layers.enable(1)

            this.scene.add(circle_plane)
            console.log(circle_plane)
            */



            // let table = this.resources.items["tableModel"]
            // console.log(table)
            // this.scene.add(table.scene)
            

            // this.scene.add(table.scenes[0])
            // this.scene.add(table.scenes[1])
            // this.scene.add(table.scenes[2])
            // this.scene.add(table.scenes[3])
            // table.scene.position.y -= 2.5
            // table.scene.rotation.y += Math.PI/2



            // let pjw = this.resources.items.pjw2.scene.children[0]
            // console.log(pjw)
            // this.scene.add(pjw)
            // pjw.scale.set(20,10,10)
            // console.log(pjw.material)
            // pjw.material.map.encoding = THREE.sRGBEncoding;
            // pjw.material.map.wrapS = THREE.RepeatWrapping
            // pjw.material.map.wrapT = THREE.RepeatWrapping
            // pjw.material.map.repeat.set(2, 2);
            // pjw.material.map.anisotropy = 16;


            // pjw.scene.children[0].position.y += 2


            // this.resources.items.diceArrowTexture.encoding = THREE.sRGBEncoding

            // let coinGeo = new THREE.CylinderGeometry(1, 1, 0.15, 32);
            // let coinMat = [
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceArrowTexture, roughness: 0.05 }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceArrowTexture, roughness: 0.05 }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceArrowTexture, roughness: 0.05 })
            // ]

            // let coinMesh = new THREE.Mesh(coinGeo, coinMat)
            // coinMesh.position.x = -5
            // coinMesh.position.y = 0.15 / 2
            // coinMesh.rotation.x = Math.PI

            // this.scene.add(coinMesh)

            // this.resources.items.diceArrowTexture.encoding = THREE.sRGBEncoding



            // let boxGeo = new THREE.BoxGeometry(1, 1, 1)
            // let boxMat = [
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceArrowTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceAxeTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceStealTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceShieldTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceHelmetTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm }),
            //     new THREE.MeshStandardMaterial({ map: this.resources.items.diceArrowTexture, metalnessMap: this.resources.items.leather_white_arm, roughnessMap: this.resources.items.leather_white_arm, aoMap: this.resources.items.leather_white_arm })
            // ]

            // let boxMat = new THREE.MeshStandardMaterial({ 
            //     map: this.resources.items.diceArrowTexture, 
            //     metalnessMap: this.resources.items.leather_white_arm, 
            //     roughnessMap: this.resources.items.leather_white_arm, 
            //     aoMap: this.resources.items.leather_white_arm, 
            //     envMap : this.resources.items.environmentMapTexture,
            //     roughness : 0.05 })
            

            // let boxMesh = new THREE.Mesh(boxGeo, boxMat)
            // boxMesh.position.z = 5
            // boxMesh.position.y = 5
            // this.scene.add(boxMesh)



            // let zzz = new FlipCoin()
            // zzz.coinMesh.position.x = 5


            // let modelName = ["axe", "arrow", "helmet", "shield"]
            // modelName.forEach((name, index)=>{
            //     let model = new Model(name)
            //     model.mesh.position.x = index
            //     model.mesh.position.y = 1
            // })


            
            
            // let mjolnir2 = this.resources.items["mjolnir2Model"].scene.children[0]
            // console.log(this.resources.items["mjolnir2Model"].scene.children[0])
            // mjolnir2.scale.set(1,1,1)
            // mjolnir2.position.y +=4
            // mjolnir2.position.x +=4
            // mjolnir2.rotateX(-Math.PI)       
            // mjolnir2.layers.enable(1)
            // mjolnir2.material = new THREE.MeshStandardMaterial
            // ({transparent: true, color: "#00ffff", })
            // this.scene.add(mjolnir2)


            // let mjolnir = new Model("mjolnir")
            // this.scene.add(mjolnir)
            // mjolnir.SetPosition(new THREE.Vector3(0,4,0))
            // mjolnir.mesh.rotateX(Math.PI)

            
            // this.physics = new PhysicsTest();



            
            this.avatars = {
                top : new Avatar(-1),
                bottom : new Avatar(1)
            }

            this.experience.controller.avatars.top = this.avatars.top;
            // this.avatars.top.eventEmitter = this.experience.controller.eventEmitter

            this.experience.controller.avatars.bottom = this.avatars.bottom;
            // this.avatars.bottom.eventEmitter = this.experience.controller.eventEmitter


            
            this.flipCoin = new FlipCoin([this.avatars.top.coinAnchor, this.avatars.bottom.coinAnchor])
            this.experience.controller.flipCoin = this.flipCoin


            /*
            let vec = new THREE.Vector3(0,1,0);
            let hammer = new Weapon("mjolnir", vec);
            hammer.mesh.position.x += 3;
            hammer.mesh.position.y += 3;
            hammer.mesh.position.z += 3;
            hammer.mesh.scale.set(1, 1, 1);
            hammer.material.opacity = 1;
            */

            // let axe = new Weapon("axe")
            // axe.SetPosition(new THREE.Vector3(0, 1.5, 0))

            // let helmet = new Weapon("helmet")
            // helmet.SetPosition(new THREE.Vector3(1, 1.5, 0))

            // let arrow = new Weapon("arrow")
            // arrow.SetPosition(new THREE.Vector3(2, 1.5, 0))

            // let shield = new Weapon("shield")
            // shield.SetPosition(new THREE.Vector3(-1, 1.5,0))

            // let bow = new Weapon("bow", new THREE.Vector3(-2, 1.5,0))
            
            this.towel = new Towel()

            // this.fox = new Fox()
            // this.fox.model.position.x -= 5;
            // this.fox.model.position.z -= 5;


            let sign = {
                top: -1,
                bottom: 1
            }

            let nTray = new Tray()
            nTray.mesh.position.z = sign["bottom"] * 6;
            nTray.Set_Original_Position()
            this.avatars.bottom.tray.copy(nTray.mesh.position);
            this.avatars.bottom.bowl = nTray

            nTray = new Tray()
            nTray.mesh.position.z = sign["top"] * 6;
            nTray.Set_Original_Position()
            this.avatars.top.tray.copy(nTray.mesh.position);
            this.avatars.top.bowl = nTray



            let dice_action_end_anchor = null
            dice_action_end_anchor = this.avatars.bottom.actionEndAnchor.clone()
            this.dices = []
            this.token_dices = []
            diceFaceInfo.forEach((faceInfo, index)=>{
                let dice_type
                if(index > 5)
                    dice_type = "token"
                else
                    dice_type = "weapon"

                let dice = new Dice(faceInfo, dice_type)
                
                if(index > 5){
                    this.token_dices.push(dice)
                    this.avatars.bottom.tokenDiceDictionary[`${dice.getID()}`] = {obj : dice, index : index - 6};
                    this.avatars.bottom.token_dices.push(dice);
                }
                else{
                    this.dices.push(dice)
                    this.avatars.bottom.diceDictionary[`${dice.getID()}`] = {obj : dice, index : index};
                    this.avatars.bottom.dices.push(dice);
                }
                this.gameObjects[`${dice.getID()}`] = dice;
                this.playerInteractableObjects.push(dice.mesh.mesh);

                // let nPosition = new THREE.Vector3(
                //     ((index % 3) - 1) * 1.5,
                //     5,
                //     (11.5 + (index % 2) * 1.5))
                let nPosition = dice_action_end_anchor

                dice.setPosition(nPosition)
                

                nPosition.setX(nPosition.x + 1.3)
            })


            dice_action_end_anchor = this.avatars.top.actionEndAnchor.clone()
            diceFaceInfo.forEach((faceInfo, index)=>{
                let dice_type
                if(index > 5)
                    dice_type = "token"
                else
                    dice_type = "weapon"

                let dice = new Dice(faceInfo, dice_type)

                if(index > 5){
                    this.token_dices.push(dice)
                    this.avatars.top.tokenDiceDictionary[`${dice.getID()}`] = {obj : dice, index : index - 6};
                    this.avatars.top.token_dices.push(dice);
    
                }
                else{
                    this.dices.push(dice)
                    this.avatars.top.diceDictionary[`${dice.getID()}`] = {obj : dice, index : index};
                    this.avatars.top.dices.push(dice);
    
                }

                this.gameObjects[`${dice.getID()}`] = dice;
                this.playerInteractableObjects.push(dice.mesh.mesh);
                let nPosition = dice_action_end_anchor

                dice.setPosition(nPosition)
                

                nPosition.setX(nPosition.x - 1.3)
            })



            this.godFavors = {}
            
            players.forEach((player, player_index) => {
                this.godFavors[`${player}`] = {}
                let avatar = this.avatars[`${player}`]
                
                avatar.godFavorDictionary = {}
                godFavorNames.forEach((godFavorName, godFavorIndex) => {
                    let pos = new THREE.Vector3(-30 + 3 * godFavorIndex, 0.1, 20 + player_index * 4)

                    const godfavor = new GodFavor(
                        godFavorName,
                        pos,
                        this.experience.godFavorsInfo[`${godFavorName}`],
                        this.experience.godFavorsAction[`${godFavorName}`]
                    );

                    avatar.godFavorDictionary[`${godfavor.getID()}`] = { obj: godfavor, index: godFavorIndex }
                    this.playerInteractableObjects.push(godfavor.mesh);
                    this.gameObjects[godfavor.mesh.id] = godfavor;

                    this.godFavors[`${player}`][`${godFavorName}`] = godfavor
                    godfavor.RemoveScene()
                })
                // }
            })
            

            players.forEach(playerType=>{
                let avatar = this.avatars[`${playerType}`]
                let stonePosInterval = {};
                stonePosInterval.x = 1.4;
                stonePosInterval.z = 1.5;
                let stoneAnchor = {}
                stoneAnchor.x = (1 + avatar.anchorSign) * stonePosInterval.x * -2 + avatar.healthStoneAnchor.x;
                stoneAnchor.y = avatar.healthStoneAnchor.y;
                stoneAnchor.z = avatar.healthStoneAnchor.z

                // console.log(avatar.eventEmitter)

                // console.log(stoneAnchor);
    
                for (let i = 0; i < 15; i++) {
                    let x = Math.floor(i % 5) * stonePosInterval.x + stoneAnchor.x;
                    let y = stoneAnchor.y
                    let z = (Math.floor(i / 5) - 1) * stonePosInterval.z + stoneAnchor.z;
    
                    // var stoneColor = {
                    //     top: 0x00e1ff,
                    //     bottom: 0x00ff11
                    // }
    
                    let position = new THREE.Vector3(x,y,z)
                    let healthStone = new HealthStone(avatar)
                    healthStone.SetPosition(position)
                    healthStone.model.mesh.castShadow = true

                    // let healthStone = new HealthStone(x, y, z, stoneColor[`${playerType}`], playerController);
                    avatar.healthStones.push(healthStone)



                    // this.gameObjects[`${healthStone.getID()}`] = healthStone;
                    this.playerInteractableObjects.push(healthStone.model.mesh);
                    avatar.healthStoneDictionary[`${healthStone.getID()}`] = {obj : healthStone, index : i};

                    if(i > 0)
                        avatar.healthStones[i - 1].next_stone = healthStone

                }
            })


            
            // this.resources.items["tray_map"].repeat.set(1, 1);
            this.resources.items["tray_map"].encoding = THREE.sRGBEncoding
            this.resources.items["tray_map"].anisotropy = 16
            // this.resources.items["tray_map"].wrapS = THREE.RepeatWrapping
            // this.resources.items["tray_map"].wrapT = THREE.RepeatWrapping


            // this.resources.items["tray_normal"].repeat.set(1, 1);
            this.resources.items["tray_normal"].encoding = THREE.sRGBEncoding
            this.resources.items["tray_normal"].anisotropy = 16
            // this.resources.items["tray_normal"].wrapS = THREE.RepeatWrapping
            // this.resources.items["tray_normal"].wrapT = THREE.RepeatWrapping

        
            let bowl_material = new THREE.MeshStandardMaterial({
                map : this.resources.items["tray_map"],
                normalMap : this.resources.items["tray_normal"],
                // roughnessMap : this.resources.items["tray_roughness"],

                metalness: 0.25,
                roughness: 0.75,
                envMapIntensity: 2
            })
            // bowl_material.flatshading = false;
            // bowl_material.side = THREE.DoubleSide;
            
            // let bowl_material = [
            //     new THREE.MeshStandardMaterial({color : "blue"}),
            //     new THREE.MeshStandardMaterial({color : "green"})
            // ]


            

            
            // let bowl_geo = this.resources.items["bowlModel"].scene.children[0].geometry
            // bowl_geo.computeVertexNormals()


            // let bowl_top = new THREE.Mesh(bowl_geo, bowl_material)
            // bowl_top.position.set(0, 0, -6)
            // bowl_top.castShadow = true
            // bowl_top.receiveShadow = true
            // // this.scene.add(bowl_top)


            // let bowl_bottom = new THREE.Mesh(bowl_geo, bowl_material)
            // bowl_bottom.position.set(0, 0, 6)
            // bowl_bottom.castShadow = true
            // bowl_bottom.receiveShadow = true
            // this.scene.add(bowl_bottom)


            // const tmp_token = new Token()


            // let extrudeSettings = {
            //     steps: 2,
            //     depth: 12,
            //     bevelEnabled: true,
            //     bevelThickness: 4,
            //     bevelSize: 3,
            //     bevelOffset: 0,
            //     bevelSegments: 6
            // }
            // let svg_geo = new THREE.ExtrudeGeometry(this.resources.items["BrunhildSVG"], extrudeSettings)
            // let svg_mat = 
            //     [
            //         new THREE.MeshStandardMaterial({
            //             // color : "red",
            //             map: this.resources.items["godBrunhildTexture"],
            //             side: THREE.DoubleSide,
            //             normalMap: this.resources.items["godBrunhildNormalmapTexture"]
            //         }),
            //         new THREE.MeshStandardMaterial({
            //             // color : "red",
            //             map: this.resources.items["wood_table_worn_diff"],
            //             side: THREE.DoubleSide,
            //         }),
            // ]
            // console.log(svg_geo)

            // let U_min_value = 200000000
            // let U_max_value = -200000000

            // let V_min_value = 200000000
            // let V_max_value = -200000000

            // let geo_arr = svg_geo.attributes.uv.array
            // for (let i = 0; i < geo_arr.length; i += 2) {
                
            //     let U_value = geo_arr[i]
            //     U_min_value = Math.min(U_min_value, U_value)
            //     U_max_value = Math.max(U_max_value, U_value)

                
            //     let V_value = geo_arr[i + 1]
            //     V_min_value = Math.min(V_min_value, V_value)
            //     V_max_value = Math.max(V_max_value, V_value)

            // }

            // let offset_X = U_max_value
            // let offset_Y = V_max_value * 2
            
            // for (let i = 0; i < geo_arr.length; i += 2) {
            //     svg_geo.attributes.uv.array[i] = (svg_geo.attributes.uv.array[i] + offset_X/ 2) / offset_X
            //     svg_geo.attributes.uv.array[i + 1] = (svg_geo.attributes.uv.array[i + 1] + offset_Y / 2) / offset_Y
            // }

            
            // for(let i=0; i<geo_arr.length; i++){
            //     svg_geo.attributes.uv.array[i] /= 300
            // }

            // let min_value = 200000000
            // let max_value = -200000000
            // geo_arr.forEach(value=>{
            //     min_value = Math.min(min_value, value)
            //     max_value = Math.max(max_value, value)
            // })

            // console.log(min_value, max_value)

            // const svg_mesh = new THREE.Mesh( svg_geo, svg_mat );
            // svg_mesh.scale.set(0.01, 0.01, 0.01)
            // svg_mesh.rotateX(-Math.PI / 2)
            // svg_mesh.position.x = 2
            // svg_mesh.position.y = 0.5
            // // svg_mesh.position.z = -0.5
            // this.scene.add(svg_mesh)

            //attributes.uv.array



            // this.gameObjects[`${nDice.dice.id}`] = nDice;
            
            // this.playerInteractableObjects.push(this.turnEndButton.mesh);




            // var stoneColor = {
            //     top : 0x00e1ff,
            //     bottom : 0x00ff11
            // }

            // this.turnEndButton = new TurnEndButton()
            // this.gameObjects[`${this.turnEndButton.mesh.id}`] = this.turnEndButton;
            // this.playerInteractableObjects.push(this.turnEndButton.mesh);



            // this.TurnEndButtonDBG = new TurnEndButtonDBG()
            // this.TurnEndButtonDBG.mesh.position.x += 4;
            // this.TurnEndButtonDBG.mesh.position.z -= 8;
            
            // this.gameObjects[`${this.TurnEndButtonDBG.mesh.id}`] = this.TurnEndButtonDBG;
            // this.playerInteractableObjects.push(this.TurnEndButtonDBG.mesh);




            // let playerTypes = ["top", "bottom"]
            // playerTypes.forEach(playerType => {
            //     let playerController = this.experience.game.playerController[`${playerType}`]

            //     let diceFaceInfo = [{
            //             "right" : {weapon : "axe", token : false},
            //             "left" : {weapon : "shield", token : false},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "helmet", token : false},
            //             "front" : {weapon : "arrow", token : true},
            //             "back" : {weapon : "steal", token : true}},
                    
            //         {
            //             "right" : {weapon : "axe", token : false},
            //             "left" : {weapon : "shield", token : true},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "steal", token : true},
            //             "front" : {weapon : "arrow", token : false},
            //             "back" : {weapon : "helmet", token : false}
            //         },
                    
            //         {
            //             "right" : {weapon : "axe", token : false},
            //             "left" : {weapon : "arrow", token : true},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "helmet", token : true},
            //             "front" : {weapon : "steal", token : false},
            //             "back" : {weapon : "shield", token : false}
            //         },
                    
            //         {
            //             "right" : {weapon : "arrow", token : false},
            //             "left" : {weapon : "shield", token : false},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "helmet", token : true},
            //             "front" : {weapon : "steal", token : true},
            //             "back" : {weapon : "axe", token : false}
            //         },
                    
            //         {
            //             "right" : {weapon : "axe", token : false},
            //             "left" : {weapon : "shield", token : true},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "helmet", token : false},
            //             "front" : {weapon : "steal", token : false},
            //             "back" : {weapon : "arrow", token : true}

            //         },
                    
            //         {
            //             "right" : {weapon : "axe", token : false},
            //             "left" : {weapon : "shield", token : true},
            //             "top" : {weapon : "axe", token : false},
            //             "bottom" : {weapon : "arrow", token : false},
            //             "front" : {weapon : "steal", token : false},
            //             "back" : {weapon : "helmet", token : true}

            //         }
            //     ]

            //     for (let i = 0; i < 6; i++) {
            //         let nDice = new Dice(((i % 3) - 1) * (1.5), 5, sign[`${playerType}`] * ((10.5) + ((i % 2) * (1.5))), playerType, diceFaceInfo[i])
            //         this.gameObjects[`${nDice.dice.id}`] = nDice;
            //         playerController.dices.push(nDice);
            //         this.playerInteractableObjects.push(nDice.mesh);
            //     }



            //     const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];

            //     // godFavorNames.forEach((godFavorName, index) => {
            //     //     const newGodFavor = new GodFavor(godFavorName, playerType);
            //     //     newGodFavor.mesh.position.x = sign[`${playerType}`] * (4 + (1.2 * (index % 7)));
            //     //     newGodFavor.mesh.position.z = sign[`${playerType}`] * (3.5 + (2 * Math.floor(index / 7)));
            //     //     this.experience.game.playerController[`${playerType}`].godFavors.push(newGodFavor);
            //     //     this.playerInteractableObjects.push(newGodFavor.mesh);
            //     //     this.gameObjects[newGodFavor.mesh.id] = newGodFavor;
            //     // })

            //     const godfavor_for_beginner = ["Thor", "Idun", "Odin"]

            //     for (let index = 0; index < 3; index++) {
            //         let godFavorName = godfavor_for_beginner[index];
            //         let newPosition = playerController.godFavorAhchor.clone()
            //         newPosition.x += 1.3 * index * playerController.anchorSign
            //         const newGodFavor = new GodFavor(godFavorName, newPosition, playerType, this.experience.godFavorsInfo[`${godFavorName}`]);
            //         playerController.godFavors.push(newGodFavor);
            //         this.playerInteractableObjects.push(newGodFavor.mesh);
            //         this.gameObjects[newGodFavor.mesh.id] = newGodFavor;

            //     }



            //     let nTray = new Tray(playerType)
            //     nTray.mesh.position.z = sign[`${playerType}`] * 5.5;

            //     playerController.tray = nTray;



            //     let stonePosInterval = {};
            //     stonePosInterval.x = 1.4;
            //     stonePosInterval.z = 1.5;
            //     let stoneAnchor = {}
            //     stoneAnchor.x = (1 + playerController.anchorSign) * stonePosInterval.x * -2 + playerController.healthStoneAnchor.x;
            //     stoneAnchor.y = 0.5;
            //     stoneAnchor.z = playerController.healthStoneAnchor.z
            //     // console.log(stoneAnchor);

            //     for (let i = 0; i < 15; i++) {
            //         let x = Math.floor(i % 5) * stonePosInterval.x + stoneAnchor.x;
            //         let y = stoneAnchor.y
            //         let z = (Math.floor(i / 5) - 1) * stonePosInterval.z + stoneAnchor.z;

            //         var stoneColor = {
            //             top: 0x00e1ff,
            //             bottom: 0x00ff11
            //         }

            //         let healthStone = new HealthStone(x, y, z, stoneColor[`${playerType}`], playerController);
            //         this.playerInteractableObjects.push(healthStone.mesh);
            //         this.gameObjects[`${healthStone.mesh.id}`] = healthStone;

            //         playerController.healthStoneSite.push(healthStone);



            //     }

            //     // console.log(playerController.healthStoneSite);


            // })


            // // let stoneanchor = { x: -9.5, y: 3, z: 4 }
            // // for (let i = 0; i < 15; i++) {
            // //     let x = Math.floor(i % 5) * 1.4 + stoneanchor.x;
            // //     let y = stoneanchor.y
            // //     let z = Math.floor(i / 5) * 1.5 + stoneanchor.z;
            // //     let healthStone = new HealthStone(x, 0.5, z);
            // //     this.playerInteractableObjects.push(healthStone.mesh);
            // //     this.gameObjects[`${healthStone.mesh.id}`] = healthStone;
            // // }



            // this.svg = new GodPiece()

            // // this.godSymbol = new TokenEffect();
            // // this.godSymbol.mesh.position.x = 0;
            // // this.godSymbol.mesh.position.y = 1;
            // // this.godSymbol.mesh.position.z = 0;
            // // // this.godSymbol.mesh.rotation.x -= Math.PI / 2;
            // // // console.log(this.godSymbol);

            // // this.godSymbol = new TokenEffect();
            // // this.godSymbol.mesh.position.x = -2;
            // // this.godSymbol.mesh.position.y = 1;
            // // this.godSymbol.mesh.position.z = 0;
            // // // this.godSymbol.mesh.rotation.x -= Math.PI / 2;


            // // this.godSymbol = new TokenEffect();
            // // this.godSymbol.mesh.position.x = 2;
            // // this.godSymbol.mesh.position.y = 1;
            // // this.godSymbol.mesh.position.z = 0;
            // // // this.godSymbol.mesh.rotation.x -= Math.PI / 2;

            // // this.godSymbol = new Token();
            // // this.godSymbol.mesh.position.y = 0.5;
            // // this.godSymbol.mesh.position.z = 1.5;

            // this.experience.game.gameStart()


            // console.log(this.scene.getObjectById(123))

        })


    }



    GameStart(){
        this.clock.GameStart()
        this.FilterGodfavors()

    }


    GameOver(){
        this.flipCoin.GameOver()
        this.double_cube.GameOver()
        this.clock.GameOver()
        this.stamp.ClearBanSign()


        godFavorNames.forEach((godFavorName, card_index) => {
            let godFavor_bottom = this.godFavors["bottom"][`${godFavorName}`]
            let godFavor_top = this.godFavors["top"][`${godFavorName}`]

            godFavor_bottom.GameOver()
            godFavor_top.GameOver()

        })
    }


    // const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];

    // const godfavor_for_beginner = ["Thor", "Skadi", "Odin"]


    Add_AnimationObject(id, obj){
        this.animation_objects.set(id, obj)
    }

    Remove_AnimationObject(id){
        this.animation_objects.delete(id)
    }


    AddThing(avatar, playerInformation, avatardir) {
        // console.log(avatar)
        // console.log(playerInformation)
        // console.log(this.godFavors)

        // console.log(playerInformation)

        let godfavors = playerInformation.godFavors
        avatar.godFavors = []
        for (let index = 0; index < 3; index++) {
            let godFavorName = godFavorNames[godfavors[index]];
            let newPosition = avatar.godFavorAnchor.clone()
            newPosition.x += 1.8 * index * avatar.anchorSign
            
            let godfavor = this.godFavors[`${avatardir}`][`${godFavorName}`]
            godfavor.setPosition(newPosition)
            godfavor.Playing_On()

            // console.log(godfavor)
            // console.log(avatar.index)
            // console.log(godFavorName)


            avatar.godFavors.push(godfavor);
            // console.log(avatar.godFavorDictionary)

            // console.log(avatar.godFavorDictionary)
            // console.log(godfavor.getID())
            
            avatar.godFavorDictionary[`${godfavor.getID()}`].index = index;



            // let godFavorName = godFavorNames[godfavors[index]];
            // let newPosition = avatar.godFavorAnchor.clone()
            // newPosition.x += 1.3 * index * avatar.anchorSign
            // const godfavor = new GodFavor(godFavorName, newPosition, this.experience.godFavorsInfo[`${godFavorName}`], this.experience.godFavorsAction[`${godFavorName}`]);
            // avatar.godFavors = []
            // avatar.godFavors.push(godfavor);

            // avatar.godFavorDictionary = {}
            // this.playerInteractableObjects.push(godfavor.mesh);
            // this.gameObjects[godfavor.mesh.id] = godfavor;

        }

    }



    FilterGodfavors(){
        
        godFavorNames.forEach((godFavorName, card_index) =>{
            let godFavor_bottom = this.godFavors["bottom"][`${godFavorName}`]
            let godFavor_top = this.godFavors["top"][`${godFavorName}`]

            godFavor_bottom.FilterScene()
            godFavor_top.FilterScene()
        })
    }


    CardBanMove(avatar_dir, card_index){
        let godFavorName = godFavorNames[card_index]
        let godFavor = this.godFavors["bottom"][`${godFavorName}`]

        godFavor.state = "banned_sign"
        godFavor.Ban_On()

        // if(avatar_dir != "bottom"){
        // godFavor.Ban_On()
        // }
            
        return this.stamp.Stamp(godFavor.getPosition().clone())
    }

    /*
        user : < "bottom" or "top" >
    */
    CardPickMove(avatar_dir, card_index, acc_cnt){
        // let card_width = 1.7
        // let card_height = 2.2

        let card_width = 1.8
        let card_height = 3.25


        let bias = 0

        let godFavorName = godFavorNames[card_index]
        let godFavor = this.godFavors["bottom"][`${godFavorName}`]

        godFavor.state = "waiting"

        let anim = godFavor.Highlight_On_Pick()
        // let anim = gsap.timeline()
        // if(avatar_dir != "bottom"){
        //     anim = godFavor.Blink()
        // }

        let anchor = this.avatars[`${avatar_dir}`].godFavorAnchor.clone()



        // if (avatar_dir == "bottom"){
        //     anchor = new THREE.Vector3(card_width * 2, 0, card_height * 2.25 + bias)
        // }
        // else{
        //     anchor = new THREE.Vector3(card_width * -3, 0, card_height * -1.75 + bias)
        // }

        anchor.x += acc_cnt * 1.8 * this.avatars[`${avatar_dir}`].anchorSign // card_width * 1.25
        anchor.y = 1.5

        return new Promise((res)=>{
            anim.then(()=>{
                gsap.to(godFavor.mesh.position, {duration : 0.3, y : 1.5, ease : "Power2.easeOut"})
                godFavor.moveTo(anchor, 0.3).then(()=>{res(1)})
            })
        })

        
        // anim.then(()=>{console.log("hello world")})
        
    }

    PrintAnchor(){

    }


    ArrangeCards(game_mode){
        
        let ready_position = new THREE.Vector3(0, 1.5, -11)
        // console.log(this.experience.controller.avatars.bottom)

        // let card_width = 1.875
        // let card_height = 2.75

        let card_width = 2
        let card_height = 3.25

        let setup_anchor
        let height_cnt, width_cnt

        let bias = 0.25

        this.clock.Setup()
        this.double_cube.Setup()

        if(game_mode == "liberty"){
            height_cnt = 4
            setup_anchor = new THREE.Vector3(
                // -4 * card_width, 0.5, -5 * card_height
                -card_width * 5 - 2, 0.15, (bias - (height_cnt - 1) / 2) * card_height
            )
        }
        else {
            // game_mode == "draft"
            card_width = 2.2
            height_cnt = 3
            setup_anchor = new THREE.Vector3(
                // -4 * card_width, 0.5, -5 * card_height
                -card_width * 5, 0.15, (bias - (height_cnt - 1) / 2) * card_height
            )
        }
        //(0.5 - (height_cnt - 1) / 2)
        width_cnt = godFavorNames.length / height_cnt
        width_cnt = parseInt(Math.ceil(width_cnt))

        let proms = []


        // let cardID = this.godFavors["bottom"][`${godFavorName}`]
        let avatar = this.avatars.bottom
        let cardID

        godFavorNames.forEach((godFavorName, card_index) =>{
            // console.log(this.godFavors["bottom"])
            // console.log(godFavorName)

            // console.log(this.godFavors["bottom"])
            // console.log(avatar.godFavorDictionary)

            cardID = this.godFavors["bottom"][`${godFavorName}`].getID()
            // console.log(cardID)
            avatar.godFavorDictionary[`${cardID}`].index = card_index


            let godFavor = this.godFavors["bottom"][`${godFavorName}`]
            godFavor.AddScene()
            godFavor.Playing_Off()
            // console.log(godFavor)
            godFavor.index = card_index;
            godFavor.setPosition(ready_position)
            
            let x = setup_anchor.x + card_width * (card_index % width_cnt)
            let y = setup_anchor.y
            let z = setup_anchor.z + card_height * (Math.floor(card_index / width_cnt))

            proms.push(godFavor.moveTo(new THREE.Vector3(x,y,z), card_index / 10))
        })

        


        return Promise.all(proms)
    }



    // 카드를 치운다
    OrganizeCards(){
        this.stamp.ClearBanSign()

        let ready_position = new THREE.Vector3(0, 0.5, -12)
        let proms = []

        godFavorNames.forEach((godFavorName, card_index) =>{
            let godFavor = this.godFavors["bottom"][`${godFavorName}`]
            godFavor.Highlight_Off()
            godFavor.Ban_Off()
            
            if(godFavor.state !== "waiting")
                proms.push(godFavor.moveTo(ready_position, card_index / 30))
        })
        
        return Promise.all(proms)
    }


    
    OrganizeTable(){

        
        godFavorNames.forEach((godFavorName, card_index) =>{
            let godFavor = this.godFavors["bottom"][`${godFavorName}`]
            godFavor.GameOver()
        })



        this.clock.Organize()
        this.double_cube.Organize()


    }


    SetupTable(){
        this.clock.Setup()
        this.double_cube.Setup()



    }



    CreateDice(index){
        let newDice = new Dice(diceFaceInfo[index])

        
        // let dice = new Dice(faceInfo)
        this.dices.push(newDice)
        this.gameObjects[`${newDice.getID()}`] = newDice;
        this.playerInteractableObjects.push(newDice.mesh.mesh);


        // this.scene.add(newDice)
        return newDice
    }

    RemoveDice(dice){
        this.dices.pop()
        delete this.gameObjects[`${dice.getID()}`]
        this.playerInteractableObjects.pop()
        
    }


    TurnOnInteract(objs){
        // this.gameObjects[`${healthStone.getID()}`] = healthStone;
        objs.forEach(obj=>{
            this.gameObjects[`${obj.getID()}`] = obj
        })
    }


    TurnOffInteract(objs){
        objs.forEach(obj=>{
            delete this.gameObjects[`${obj.getID()}`]
        })
    }


    checkSelectedObject(obj){
        let ret = this.FindFromDictionary(obj.getID())
        if(ret){
            return { type: "doublecube" }
        }
        else
            return null
        
    }


    FindFromDictionary(objID){
        // console.log(objID)
        if(this.itemsDictionary.has(objID))
            return this.itemsDictionary.get(objID).obj
        else
            return null
    }


    AddItem(obj){
        this.itemsDictionary.set(obj.getID(), { obj : obj })
    }


    Take_FrostBite(user, cnt){
        let from = new THREE.Vector3()
        this.clock.screen_.getWorldPosition(from)

        let [to, damaged_stones] = this.avatars[`${user}`].Take_FrostBite(cnt)

        let proms = []
        to.forEach((pos, index) => {
            let rag = this.ragnarok.NewToken(from)
            let stone = damaged_stones[index]

            proms.push(rag.initialMove(pos, true, stone))
        })

        return Promise.all(proms)
    }


    update(deltaTime) {

        for(const item of this.animation_objects){
            let obj = item[1]
            obj.Update(deltaTime)
        }


        // this.clock.children[1].material.map.needsUpdate = true


        // if (this.fox)
        //     this.fox.update()

        // this.dices.forEach(dice=>{
        //     dice.update()
        // })

        
        // this.lightningStrikeMesh.acc_time += 4
        // this.lightningStrikeMesh.geometry.update(this.lightningStrikeMesh.acc_time)

        this.avatars.top.dices.forEach(dice=>{
            dice.update(deltaTime)
        })

        this.avatars.top.token_dices.forEach(dice=>{
            dice.update(deltaTime)
        })



        this.avatars.bottom.dices.forEach(dice=>{
            dice.update(deltaTime)
        })

        this.avatars.bottom.token_dices.forEach(dice=>{
            dice.update(deltaTime)
        })

        // this.coinMesh.rotation.x += 0.01;
        // this.coinMesh.rotation.y += 0.002;

        // if(this.physics)
        //     this.physics.update()




        // let uTime = Math.sin(this.experience.time.elapsed * 0.001) * 0.5 + 0.5;
        
        // uTime += deltaTime / 1000.0;
        // energy_material.uTime.value = uTime


        // mask_material.uTime.value = uTime
        // outline_material.uTime.value = uTime

        // let uTime_ = Math.sin(this.experience.time.elapsed * 0.001) * 0.5 + 0.5;


        // this.particle.material.uTime.value = uTime_;
    }
}

let uTime=0
