import * as THREE from 'three'
import Experience from '../Experience.js'
// import Weapon from './Items/Weapon.js'
import gsap from 'gsap'
import ShootingStar from './ShootingStar.js'
import HealingBall from "./HealingBall.js"
import FireWorks from './FireWorks.js'
import PoisonNeedles from './PoisonNeedles.js'
// import {LoopSubdivision} from "../Geometries/LoopSubdivision.js"

const gameover_pos = new THREE.Vector3(0, -2, 15)


export default class GodFavor {
    constructor(name, position, godFavorInfo, godFavorAction) {
        this.name = name
        this.info = godFavorInfo
        
        let info = godFavorInfo
        Object.keys(info).forEach(key => {
            this[`${key}`] = godFavorInfo[`${key}`]
        })
        
        this.power = godFavorAction.power
        this.extraPower = godFavorAction.extraPower
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.opponent = this.owner == "top" ? "bottom" : "top";
        // console.log(this.owner)

        this.isPlaying = false;
        this.state = "tray"

        
        this.soundManager = this.experience.sound
        // this.sounds_set = {
            // "landing" : {},
            // "take" : {},
            // "throw" : {},
        // }
        // this.soundManager.AddSoundBuffer("card_sound_landing", this.sounds_set["landing"])
        // this.soundManager.AddSoundBuffer("card_sound_take", this.sounds_set["take"])
        // this.soundManager.AddSoundBuffer("card_sound_throw", this.sounds_set["throw"], 0.25)
        


        this.setTextures(name)
        this.setGeometry(name)
        this.setMaterial()
        // this.setSprite()
        this.setMesh(position);
        this.setEffect(name)

        // window.addEventListener("keydown", event=>{
        //     if(event.key == "q")
        //         this.Highlight_On()

        //     if(event.key == "w")
        //         this.Highlight_Off()
        // })

        
        if(this.name === "Odin")
            this.setDebug()

    }


    GameOver(){
        this.Playing_Off()
        this.RemoveScene()
        this.setPosition(gameover_pos)

        this.Highlight_Off()
        this.Ban_Off()

        this.state = "tray"


    }


    Playing_On(){
        this.isPlaying = true
    }


    Playing_Off(){
        this.isPlaying = false
    }

    Hover_On(){
        this.mesh.layers.enable(1)
    }

    Hover_Off(){
        this.mesh.layers.disable(1)
        
    }

    setTextures(name) {
        // color texture
        this.texture = this.resources.items[`god${name}Texture`];
        this.texture.encoding = THREE.sRGBEncoding;

        this.imageAspect = this.texture.image.width / this.texture.image.height;
        // console.log(`${name} = width : ${this.texture.image.width} , height : ${this.texture.image.height} `)
        // this.textures.push(this.resources.items.diceArrowTexture);


        // normal map
        this.normalmap = this.resources.items[`god${name}NormalmapTexture`];
        this.normalmap.encoding = THREE.sRGBEncoding;
    }


    setGeometry(name) {
        // this.geometry = new THREE.PlaneGeometry(this.imageAspect * 1.25, 1.25, 8, 8);
        // this.geometry = new THREE.BoxGeometry(1,1,1,20,20,20)



        let extrudeSettings = {
            steps: 1,
            depth: 25,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 5,
            bevelSize: 7,
            bevelOffset: 2,
            bevelSegments: 4
        }

        this.geometry = new THREE.ExtrudeGeometry(this.resources.items[`${name}SVG`], extrudeSettings)


        
        let U_min_value = 200000000
        let U_max_value = -200000000

        let V_min_value = 200000000
        let V_max_value = -200000000


        let uv_arr = this.geometry.attributes.position.array
        for (let i = 0; i < uv_arr.length; i += 3) {
            
            let U_value = uv_arr[i]
            U_min_value = Math.min(U_min_value, U_value)
            U_max_value = Math.max(U_max_value, U_value)

            
            let V_value = uv_arr[i + 1]
            V_min_value = Math.min(V_min_value, V_value)
            V_max_value = Math.max(V_max_value, V_value)

        }

        let offset_X = (U_max_value - U_min_value) * 0.95
        let offset_Y = (V_max_value - V_min_value) * 0.95


        
        // console.log(this.name, U_min_value, U_max_value, V_min_value, V_max_value)
        // console.log(this.name, offset_X, offset_Y)
        

        
        // if(this.name === "Frigg"){
        //     offset_X *= 1.075
        // }

        // if(this.name === "Thor"){
        //     offset_X *= 1.2
        // }


        
        // if(this.name === "Brunhild"){
        //     offset_Y *= 1.025
        // }


        // console.log(this.geometry.attributes)

        
        for (let i = 0; i < uv_arr.length; i += 2) {
            this.geometry.attributes.uv.array[i] = (this.geometry.attributes.uv.array[i] + (offset_X / 2)) / offset_X
            this.geometry.attributes.uv.array[i + 1] = (this.geometry.attributes.uv.array[i + 1] + (offset_Y / 2)) / offset_Y


            // if(this.name === "Thor"){
            //     this.geometry.attributes.uv.array[i] += (0.025 * this.geometry.attributes.uv.array[i])
            // }


            // his.geometry.attributes.uv.array[i] *= 0.01
            // his.geometry.attributes.uv.array[i + 1] *= 0.01
        }



        let scale_weight = 0.009

        // if(this.name === "Thor"){
        //     scale_weight = 0.0085
        // }

        // if(this.name === "Skuld"){
        //     scale_weight = 0.0095
        // }
        
        let position_arr = this.geometry.attributes.position.array
        for (let i = 0; i < position_arr.length; i += 3) {
            this.geometry.attributes.position.array[i] *= scale_weight;
            this.geometry.attributes.position.array[i + 1] *= scale_weight;
            this.geometry.attributes.position.array[i + 2] *= scale_weight;
        }


        // this.geometry.computeVertexNormals()

    }



    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture,
            normalMap: this.normalmap,
            // roughnessMap: this.normalmap,
            side: THREE.DoubleSide,
            metalness: 0.75,
            roughness: 0.75,
            aoMapIntensity: 0.28,
            envMapIntensity: 8,
            // wireframe : true
            normalScale : new THREE.Vector2(1, 1)
        })

        // if(this.name === "Odin"){
        //     let aoMap_ = this.resources.items["godOdinAO"]
        //     aoMap_.encoding = THREE.sRGBEncoding
        //     this.material.aoMap = aoMap_

        // }

        // let cColor = this.material.color
        // let nColor = cColor.offsetHSL(0, 0.3, 0)
        
        // this.material.color.setHSL(0.05, 0.3, 0.7)
        
        // this.material.color.setHSL(0.05, 0.7, 0.7)
        this.material.color.set(new THREE.Color(0xab7e49))
        // this.material.color.set(new THREE.Color(0xcfb596))


        this.org_color = this.material.color.clone()

        this.material_arr = [
            this.material,
            new THREE.MeshStandardMaterial({
                // color : "red",
                map: this.resources.items["wood_table_worn_diff"],
                side: THREE.DoubleSide,
            }),
        ];
        // this.material.transparent = true;
        // this.material.wireframe=true;

        // this.material.onBeforeCompile = shader => {
        //     shader.uniforms.depth = { value: 100.0 };
        //     shader.uniforms.radius = { value: 130.0 };
        //     shader.vertexShader = `
        //     uniform float depth;
        //     uniform float radius;
        //     ` + shader.vertexShader;
        //     shader.vertexShader = shader.vertexShader.replace(
        //         `#include <begin_vertex>`,
        //         `#include <begin_vertex>
        //         // float offsetX = transformed.x;
        //         // float offsetY = sqrt(5184.0 - (offsetX * offsetX)) / 72.0;
        //         // transformed.z += (offsetY * 5.0);

        //         // transformed.z += vUv.x;
        //         transformed.z -= 2.0 * (transformed.x * transformed.x);

        //         // float gradient = 2 * transformed.x;
        //         // float n = 1.0 / gradient;

        //         objectNormal = normalize(vec3(transformed.x, 0.0, -1.0 / (2.0 * transformed.x)));

        //       `
        //     );
        //     shader.fragmentShader = `
        //         vec3 rgb2hsv(vec3 c) {
        //             vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        //             vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        //             vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        //             float d = q.x - min(q.w, q.y);
        //             float e = 1.0e-10;
        //             return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        //         }

        //         vec3 hsv2rgb(vec3 c) {
        //             vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        //             vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        //             return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        //         }

        //         `
        //         + shader.fragmentShader;

        //     shader.fragmentShader = shader.fragmentShader.replace(`#include <color_fragment>`,
        //         `
        //         #include <color_fragment>
        //         // diffuseColor.rgb = vec3(1.0, 0.0, 0.0);

                
        //         // float value = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b));
        //         // float satuation;

        //         vec3 hsvColor = rgb2hsv(vec3(diffuseColor.r, diffuseColor.g, diffuseColor.b));
        //         hsvColor.x = 0.05;
        //         hsvColor.y = min(0.99, hsvColor.y + 0.3);
        //         diffuseColor.rgb = hsv2rgb(hsvColor);
                

        //         // diffuseColor.r = vUv.x;
        //         // diffuseColor.g = vUv.y;

        //     `);
        // };

        // color_fragment
    }

    // setSprite()
    // {
    //     this.sprite = new THREE.Sprite(this.material);
    //     this.scene.add(this.sprite);

    // }



    Highlight_On_Pick(){
        let anim_ = gsap.timeline()
        anim_.to(this.effectMesh.material, { ease: "none", duration: 0.15, opacity: 0.0 })
        anim_.to(this.effectMesh.material, { ease: "none", duration: 0.7, opacity: 0.3 })
        
        return anim_
    }




    Highlight_On(){
        return gsap.to(this.effectMesh.material, { ease: "none", duration: 0.2, opacity: 0.3 })

    }



    Highlight_Off(){
        gsap.to(this.effectMesh.material, { ease: "none", duration: 0.2, opacity: 0 })


    }


    Ban_On(){
        // this.mesh.material.color.set(new THREE.Color(0x333333))
        let color_ = this.mesh.material[0].color
        return gsap.to(color_, { ease: "none", duration: 0.2, r: 0.125, g: 0.125, b: 0.125 })

    }

    Ban_Off() {
        let color_ = this.mesh.material[0].color
        gsap.to(color_, { ease: "none", duration: 0.2, r: this.org_color.r, g: this.org_color.g, b: this.org_color.b })
        
        // this.material.color.setHSL(0.05, 0.7, 0.7)
    }



    Blink() {
        let blink_ = gsap.timeline()
        blink_.to(this.effectMesh.material, { ease: "none", duration: 0.15, opacity: 0.0 })
        blink_.to(this.effectMesh.material, { ease: "none", duration: 0.7, opacity: 0.4 })
        blink_.to(this.effectMesh.material, { delay : 1.0, ease: "none", duration: 0.7, opacity: 0 })
        // for (let i = 0; i < 3; i++) {
        //     blink_.to(this.effectMesh.material, { ease: "none", duration: 0.2, opacity: 0.4 })
        //     blink_.to(this.effectMesh.material, { ease: "none", duration: 0.2, opacity: 0 })
        // }
    

        let prom_ = new Promise((res) => { setTimeout(() => { res(true) }, 1200) })

        return prom_
    }



    FilterScene() {
        if (this.isPlaying == true) {
            this.AddScene()
        }
        else if (this.isPlaying == false) {
            this.RemoveScene()
        }
    }


    AddScene(){
        // this.scene.attach(this.mesh)
        this.mesh.visible = true
    }


    RemoveScene(){
        // this.scene.remove(this.mesh)
        this.mesh.visible = false
    }


    setMesh(position) {
        this.mesh = new THREE.Mesh(this.geometry, this.material_arr);
        // this.mesh.receiveShadow = true;
        this.mesh.position.copy(position)
        this.mesh.rotateX(-Math.PI / 2)
        this.mesh.castShadow = true;
        // this.mesh.scale.set(0.009, 0.009, 0.009)
        // this.mesh.scale.x *= 2;
        // this.mesh.scale.y *= 2;

        // this.mesh.castShadow = true;
        this.scene.add(this.mesh);



        // effect
        // this.effectMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.7, 0.1), new THREE.MeshStandardMaterial({color : this.color, transparent : true, opacity : 1}));
        // // this.effectMesh.position.copy(this.mesh.position)
        // // this.effectMesh.position.z += 1.5;
        
        // // this.effectMesh.position.x = 1;
        // this.effectMesh.position.z = 1.5;
        // // this.effectMesh.position.z = 1;
        // this.effectMesh.layers.enable(1);
        // this.effectMesh.material.opacity=0;
        // this.mesh.add(this.effectMesh)
    }


    setEffect(name){
        let effect_path = this.resources.items[`god${name}Effect`]
        if(!effect_path)
            return;
        const shape_geometry = new THREE.ShapeGeometry( effect_path );

        // console.log(geometry)

        let U_min_value = 200000000
        let U_max_value = -200000000

        let V_min_value = 200000000
        let V_max_value = -200000000


        

        let scale_weight = 0.009

        // if(this.name === "Thor"){
        //     scale_weight = 0.0085
        // }

        // if(this.name === "Skuld"){
        //     scale_weight = 0.0095
        // }
        


        let position_arr = shape_geometry.attributes.position.array
        for (let i = 0; i < position_arr.length; i += 3) {
            shape_geometry.attributes.position.array[i] *= scale_weight;
            shape_geometry.attributes.position.array[i + 1] *= scale_weight;
            shape_geometry.attributes.position.array[i + 2] *= scale_weight;
        }



        const effect_material = new THREE.MeshBasicMaterial( {
            color: "#ffff44",
            depthWrite: false,
            transparent : true,
            opacity : 0.0,
            // metalness : 0.9,
            // roughness : 1.0
        } );


        this.effectMesh = new THREE.Mesh(shape_geometry, effect_material)
        this.effectMesh.position.z += 0.3
        // this.effectMesh.scale.set(1.1, 1.1, 1.1)
        this.effectMesh.layers.enable(1)
        // this.scene.add(effect_mesh)
        this.mesh.add(this.effectMesh)

        // window.addEventListener("keydown", event=>{
        //     if(event.key == "q")
        //         this.effectMesh.position.z -= 0.05
        //     if(event.key == "w")
        //         this.effectMesh.position.z += 0.05
        //     if(event.key == "a")
        //         this.effectMesh.material.opacity += 0.02
        //     if(event.key == "s")
        //         this.effectMesh.material.opacity -= 0.05
        //     if(event.key == "d"){
        //         console.log("scale : ", this.effectMesh.material.opacity)
        //     }

        // })


    }


    // GetInfo(){
    //     return this.info
    // }


    CheckCanUse(level, tokenCnt){
        return this.cost[level] >= tokenCnt
    }

    // argu : level, myAvatar, opponentAvatar


    getID(){
        return this.mesh.id
    }

    getPosition(){
        return this.mesh.position.clone()
    }


    PoisonNeedles_Fire(from, to){
        new PoisonNeedles(from, to)
    }


    FireWorks_Fire(transforms, start_point = null){
        let from = undefined
        if (start_point != null)
            from = start_point
        else
            from = this.getPosition()

        let fire_works_animations = []

        transforms.forEach(transform => {
            let fire_works = new FireWorks()
            let anim_ = fire_works.Move(from, transform, 1.0)
            fire_works_animations.push(anim_)
        })

        return Promise.all(fire_works_animations)

    }



    HealingBall_Fire(transforms, start_point = null) {
        let from = undefined
        if (start_point != null)
            from = start_point
        else
            from = this.getPosition()

        let healing_ball_animations = []

        transforms.forEach(transform => {
            let shooting_star = new HealingBall()
            let anim_ = shooting_star.Move(from, transform, 0.7)
            healing_ball_animations.push(anim_)
        })

        return Promise.all(healing_ball_animations)


    }


    ShootingStar_Fire(transforms, start_point = null){
        let from = undefined
        if (start_point != null)
            from = start_point
        else
            from = this.getPosition()

        let shooting_star_animations = []

        transforms.forEach(transform => {
            let shooting_star = new ShootingStar()
            let anim_ = shooting_star.Move(from, transform, 0.7)
            shooting_star_animations.push(anim_)
        })

        return Promise.all(shooting_star_animations)
    }


    setPosition(pos){
        this.mesh.position.copy(pos)
    }



    moveSlide(sign){
        let x = this.mesh.position.x + 5 * sign
        return gsap.to(this.mesh.position, { duration: 0.5, ease: "Power2.easeOut", x: x})
    }


    moveTo(pos, delay = 0) {
        return gsap.timeline()
            .to(this.mesh.position, {
                duration: 1, delay: delay, ease: "Power2.easeOut", x: pos.x, y: pos.y, z: pos.z,
                // onStart: () => {
                //     this.sounds_set["throw"].sound_play()
                // }
            })
            .to(this.mesh.position, {
                duration: 0.2, ease: "none", y: 0.1,
                // onComplete: () => {
                //     this.sounds_set["landing"].sound_play()
                // }
            })
    }


    active() {
        if (this.debug.active)
            this.debugFolder.show();
    }

    deactive() {
        if (this.debug.active)
            this.debugFolder.hide();

    }


    __dbg_action(){
        this.power( 0, this.experience.world.avatars.bottom, this.experience.world.avatars.top)

        // this.experience.controller._GodFavorAction({user : 1, level : 2, cost_ : 0})

        // console.log(this.power)
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`god favor ${this.mesh.id}`);

            
            this.debugFolder
                .addColor(this.material, 'color')
                .name("body_color")


            this.debugFolder
                .add(this.material.normalScale, 'x')
                .min(0)
                .max(1)
                .step(0.001)
                .name("normal_x")


            this.debugFolder
                .add(this.material.normalScale, 'y')
                .min(0)
                .max(1)
                .step(0.001)
                .name("normal_y")

            

            this.debugFolder
                .add(this.material, 'aoMapIntensity')
                .min(0)
                .max(1)
                .step(0.001)
                .name("aoMapIntensity")

            this.debugFolder
                .add(this.material, 'roughness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("roughness")


            this.debugFolder
                .add(this.material, 'metalness')
                .min(0)
                .max(1)
                .step(0.001)
                .name("metalness")



                this.debugFolder
                .add(this.material, 'envMapIntensity')
                .min(0)
                .max(10)
                .step(0.001)
                .name("envMapIntensity")



            
            // this.debugFolder
            //     .add(this, "__dbg_action")
            //     .name("!!! POWER !!!")

            // this.debugFolder
            //     .add(this.mesh.position, 'x')
            //     .name('position X')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'y')
            //     .name('position Y')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.position, 'z')
            //     .name('position Z')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'x')
            //     .name('rotation X')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'y')
            //     .name('rotation Y')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder
            //     .add(this.mesh.rotation, 'z')
            //     .name('rotation Z')
            //     .min(- 10)
            //     .max(10)
            //     .step(0.001)
            //     .listen()

            // this.debugFolder.hide();

        }
    }





    canUseThePower(level){
        // return this.info.cost[level] <= this.experience.game.playerController[`${this.owner}`]
    }



    Power___(level, anim){
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1})
        // .to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0})
        // .to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1})
        // .to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0})
        // .to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1})
        // .to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0})
        switch(this.name){


            case "Thor" : 
                this.ThorPower(level, anim)
                break;

            case "Idun" : 
                this.IdunPower(level, anim)
                break;
                
            case "Odin" : 
                this.OdinPower(level, anim)
                break;
                
        }  
    }


    ThorPower(level, anim){
        let dmg = this.info.effectValue[level]
        let cost = this.info.cost[level]


        
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1}, "start")
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0}, "start")
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1}, "start")
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0}, "start")
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 1}, "start")
        // anim.to(this.effectMesh.material, {duration : 0.333, ease:"none", opacity : 0}, "start")



        // failed
        // if(this.playerCtrl.stackedTokenSite.length < cost){
        //     return false;
        // }

        
        let enemyCtrl = this.experience.game.playerController[`${this.opponent}`]



        // action
        let hammerCnt = 0;
        while(true){
            if(hammerCnt == dmg || enemyCtrl.health == 0)
                break;

            let attWeapon = new Weapon("mjolnir", this.mesh.position)
            attWeapon.appear();
            // console.log(enemyCtrl)
            // console.log(enemyCtrl.getLastHealthStone())
            attWeapon.setTarget(enemyCtrl.getLastHealthStone())
            enemyCtrl.health--;

            // 상대에게 데미지를 입힌다.
            anim.add(attWeapon.anim, "start")
            hammerCnt++;
        }





    }


    IdunPower(game,level){



    }


    OdinPower(game, level){

    }



}