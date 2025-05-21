import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
// import DisappearMaterial from '../Shaders/Materials/DisappearMaterial.js'

export default class Material extends EventEmitter {
    constructor(playertype) {
        super()

        // {top, bottom}
        this.playerType = playertype;

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.materialColor = {
            value: "#feb2b2"
        }

        // this.setDebug()


        // ,
        // envMap : this.experience.world.environment.environmentMap

        this.resources.on('ready', () => {


            let diceMarks = ["ArrowMark", "AxeMark", "HelmetMark", "ShieldMark", "StealMark"]
            diceMarks.forEach(diceMark => {
                this.resources.items[`${diceMark}`].encoding = THREE.sRGBEncoding;
                this.resources.items[`${diceMark}`].repeat = new THREE.Vector2(0.85, 0.85)
                this.resources.items[`${diceMark}`].offset = new THREE.Vector2((1 - 0.85) / 2, (1 - 0.85) / 2)
            })

            let tokenMarks = ["OneMark", "TwoMark", "ThreeMark", "FourMark"]
            tokenMarks.forEach(tokenMark => {
                this.resources.items[`${tokenMark}`].encoding = THREE.sRGBEncoding;
                this.resources.items[`${tokenMark}`].repeat = new THREE.Vector2(1.25, 1.25)
                this.resources.items[`${tokenMark}`].offset = new THREE.Vector2((1 - 1.25) / 2, (1 - 1.25) / 2)
            })


            this.resources.items.godsymbolDisp.encoding = THREE.sRGBEncoding


            this.resources.items.ArrowMark.encoding = THREE.sRGBEncoding;
            this.resources.items.AxeMark.encoding = THREE.sRGBEncoding;
            this.resources.items.HelmetMark.encoding = THREE.sRGBEncoding;
            this.resources.items.ShieldMark.encoding = THREE.sRGBEncoding;
            this.resources.items.TokenMark.encoding = THREE.sRGBEncoding;
            this.resources.items.StealMark.encoding = THREE.sRGBEncoding;


            this.resources.items.godsymbolAO2.encoding = THREE.sRGBEncoding
            this.resources.items.token_normal.encoding = THREE.sRGBEncoding
            // this.resources.items.token_normal.center.set(0.5, 0.5)
            // this.resources.items.token_normal.flipY = true



            this.resources.items.textures_godsymbol_colormap.encoding = THREE.sRGBEncoding


            let color_map = this.resources.items["ragnarok_map"]
            let normal_map = this.resources.items["ragnarok_normal"]

            color_map.encoding = THREE.sRGBEncoding
            normal_map.encoding = THREE.sRGBEncoding


            color_map.repeat.set(1.15, 1);
            color_map.wrapS = THREE.RepeatWrapping
            color_map.wrapT = THREE.RepeatWrapping
            color_map.offset.set(0.95, 0.0)


            normal_map.repeat.set(1.1, 1);
            normal_map.wrapS = THREE.RepeatWrapping
            normal_map.wrapT = THREE.RepeatWrapping
            normal_map.offset.set(0.95, 0.0)


            let projectile_tex = this.resources.items["particle_muzzle_01"]
            projectile_tex.encoding = THREE.sRGBEncoding
            let noise_texture = this.resources.items["perlin_noise"].clone()
            noise_texture.encoding = THREE.sRGBEncoding
            noise_texture.wrapS = THREE.RepeatWrapping;
            noise_texture.wrapT = THREE.RepeatWrapping;


            // console.log("hello");
            this.items = {
                "zero": new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0
                }),
                "token_effect": new THREE.MeshStandardMaterial({
                    map: this.resources.items.godsymbolDisp, color: "#ff6622",
                    transparent: true,
                    opacity: 1,
                    blending : THREE.NormalBlending,
                    
                    depthWrite: false,
                    depthTest: false

                }),
                "token_material_side": new THREE.MeshStandardMaterial({
                    // color: "#bf7c00",
                    color: "#ffaa04",
                    transparent: true,
                    flatShading: true,
                    opacity: 1,
                    blending : THREE.NormalBlending ,
            
                    // depthWrite: false,
                    // depthTest: false
                }),
                "token_material": new THREE.MeshStandardMaterial({
                    // color: "#ee9922",
                    color: "#ffaa04",
                    map: this.resources.items.textures_godsymbol_colormap,
                    aoMap: this.resources.items.godsymbolAO2,
                    normalMap: this.resources.items.token_normal,
                    envMapIntensity: 6,
                    metalness: 0.775,
                    roughness: 0.225,
                    // normalScale : new THREE.Vector2(1.0, 0.25),
                    flatShading: true,
                    transparent: true,
                    opacity: 1,
                    blending : THREE.NormalBlending,
                    
                    // depthWrite: false,
                    // depthTest: false
                }),
                "ragnarok_effect": new THREE.MeshStandardMaterial({
                    map: this.resources.items["ragnarok_map"],
                    color: "#4499ff",
                    transparent: true,
                    opacity: 1,
                    blending : THREE.NormalBlending,
                    
                    depthWrite: false,
                    depthTest: false

                }),
                "ragnarok_material": new THREE.MeshStandardMaterial({
                    color: "#0d2896",
                    map: this.resources.items.ragnarok_map,
                    normalMap: this.resources.items.ragnarok_normal,
                    envMapIntensity: 6,
                    metalness: 0.45,
                    roughness: 0.55,
                    flatShading: true,
                    transparent: true,
                    opacity: 1,
                    depthWrite: false,
                    depthTest: false
                }),
                "normal-weapon": new THREE.MeshStandardMaterial({
                    transparent: true,
                    color: "#feb2b2",
                    envMapIntensity: 3
                }),
                "hel-weapon": new THREE.MeshStandardMaterial({
                    transparent: true,
                    color: "#38761d",
                    envMapIntensity: 3
                }),
                "steal": new THREE.SpriteMaterial({ map: this.resources.items.StealMark, color: 0x737373, transparent: true, depthTest: false, rotation: Math.PI / 2 }),

                "health-stone": new THREE.MeshStandardMaterial({
                    color: 0x00ff11,
                    bumpScale: 0,
                    roughness: 0.375,
                    transparent: true,
                    map: this.resources.items.diceArrowTexture,
                    envMapIntensity: 2.5
                }),
                "mjolnir": new THREE.MeshStandardMaterial({
                    transparent: true, color: "#00ffff",
                }),
                arrowMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.ArrowMark,
                    transparent: true,
                    color: "black",
                    opacity: 1
                }),
                axeMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.AxeMark,
                    transparent: true,
                    color: "black",
                    opacity: 1
                }),
                helmetMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.HelmetMark,
                    transparent: true,
                    color: "black",
                    opacity: 1
                }),
                shieldMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.ShieldMark,
                    transparent: true,
                    color: "black",
                    opacity: 1
                }),
                // zeroMark: new THREE.MeshStandardMaterial({
                //     transparent: true,
                //     opacity: 0
                // }),
                // oneMark: new THREE.MeshStandardMaterial({
                //     map: this.resources.items.OneMark,
                //     transparent: true,
                //     color: "#ddaa00",
                //     opacity: 1
                // }),
                // twoMark: new THREE.MeshStandardMaterial({
                //     map: this.resources.items.TwoMark,
                //     transparent: true,
                //     color: "#ddaa00",
                //     opacity: 1
                // }),
                // threeMark: new THREE.MeshStandardMaterial({
                //     map: this.resources.items.ThreeMark,
                //     transparent: true,
                //     color: "#ddaa00",
                //     opacity: 1
                // }),
                // fourMark: new THREE.MeshStandardMaterial({
                //     map: this.resources.items.FourMark,
                //     transparent: true,
                //     color: "#ddaa00",
                //     opacity: 1
                // }),
                tokenMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.TokenMark,
                    transparent: true,
                    opacity: 1,
                    // color: "#ffffff",
                    // metalness : 0.25,
                    // roughness : 0.75,
                    envMapIntensity: 4
                }),
                stealMark: new THREE.MeshStandardMaterial({
                    map: this.resources.items.StealMark,
                    transparent: true,
                    color: "black",
                    opacity: 1
                }),
                // disappearMaterial : ()=>{return new DisappearMaterial()},
                // stamp : new THREE.MeshStandardMaterial({
                //     map : this.resources.items.stamp_map,
                //     normalMap : this.resources.items.stamp_normal,
                //     roughnessMap : this.resources.items.stamp_roughness,
                //     aoMap : this.resources.items.stamp_ao
                // })
                banSign: new THREE.MeshBasicMaterial({
                    map: this.resources.items["ban_sign"],
                    transparent: true,
                    color: 0x800000,
                    // blending : THREE.AdditiveBlending
                }),
                shootingStar: new THREE.MeshBasicMaterial({
                    map: projectile_tex,
                    transparent: true,
                    // color: "#ff5500"
                    color: "orange",
                    depthWrite: false,
                    depthTest: false
                }),
                healingBall: new THREE.MeshBasicMaterial({
                    map: projectile_tex,
                    transparent: true,
                    color: "#88ff00",
                    depthWrite: false,
                    depthTest: false
                }),
                "shootingStar-particle": new THREE.MeshBasicMaterial({
                    transparent: true,
                    depthWrite: false,
                    depthTest: false,
                    // blending: THREE.AdditiveBlending
                    onBeforeCompile: (shader) => {

                        shader.vertexShader = shader.vertexShader.replace(
                            "#include <common>",
                            `#include <common>
                        
                            attribute float alpha;
                            varying float vAlpha;`
                        )

                        shader.vertexShader = shader.vertexShader.replace(
                            "#include <begin_vertex>",
                            `#include <begin_vertex>
                        
                            vAlpha = alpha;`
                        )

                        shader.fragmentShader = shader.fragmentShader.replace(
                            "#include <common>",
                            `#include <common>
                            varying float vAlpha;`
                        )

                        shader.fragmentShader = shader.fragmentShader.replace(
                            "#include <color_fragment>",
                            `#include <color_fragment>
                            diffuseColor.w = vAlpha;`
                        )
                    }
                })
            }

            this.items["ragnarok_effect"].onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `
                    #include <common>
                    attribute float alpha;
                    varying float vAlpha;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `
                    #include <begin_vertex>
                    vAlpha = alpha;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `#include <common>
                    varying float vAlpha;
                    `
                )
                
                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <color_fragment>",
                    `
                    #include <color_fragment>

                    float mixf = step(0.15, diffuseColor.x);

                    diffuseColor.x *= mixf;
                    diffuseColor.y *= mixf;
                    diffuseColor.z *= mixf;
                    diffuseColor.w = vAlpha * mixf;
                    `
                )
            }

            this.items["ragnarok_material"].onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `
                    #include <common>
                    attribute float alpha;
                    varying float vAlpha;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `
                    #include <begin_vertex>
                    vAlpha = alpha;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `#include <common>
                    varying float vAlpha;
                    `
                )
                
                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <color_fragment>",
                    `
                    #include <color_fragment>
                    diffuseColor.x *= vAlpha;
                    diffuseColor.y *= vAlpha;
                    diffuseColor.z *= vAlpha;
                    diffuseColor.w *= vAlpha;
                    `
                )
            }


            this.items["token_effect"].onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `
                    #include <common>
                    attribute float alpha;
                    varying float vAlpha;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `
                    #include <begin_vertex>
                    vAlpha = alpha;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `#include <common>
                    varying float vAlpha;
                    `
                )
                
                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <color_fragment>",
                    `
                    #include <color_fragment>

                    float mixf = step(0.5, diffuseColor.x);
                    diffuseColor.w = vAlpha * mixf;
                    `
                )
            }


            this.items["token_material_side"].onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `
                    #include <common>
                    attribute float alpha;
                    varying float vAlpha;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `
                    #include <begin_vertex>
                    vAlpha = alpha;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `#include <common>
                    varying float vAlpha;
                    `
                )
                
                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <color_fragment>",
                    `
                    #include <color_fragment>
                    diffuseColor.x *= vAlpha;
                    diffuseColor.y *= vAlpha;
                    diffuseColor.z *= vAlpha;
                    diffuseColor.w *= vAlpha;
                    `
                )
            }

            


            this.items["token_material"].uThreshold = { value: 0.48 }
            this.items["token_material"].uMixTexture = { value: noise_texture }
            this.items["token_material"].uOutlineColor = { value: new THREE.Vector4(0.3, 0.3, 1.0, 1.0) }
            this.items["token_material"].uThickness_In = { value: 0.53 }
            this.items["token_material"].uThickness_Out = { value: 0.86 }
            this.items["token_material"].onBeforeCompile = (shader) => {
                let mat_ = this.items["healingBall"]
                shader.uniforms.uThreshold = mat_.uThreshold;
                shader.uniforms.uMixTexture = mat_.uMixTexture;
                shader.uniforms.uOutlineColor = mat_.uOutlineColor;

                shader.uniforms.uThickness_In = mat_.uThickness_In;
                shader.uniforms.uThickness_Out = mat_.uThickness_Out;

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `#include <common>
                    
                
                    attribute float time;
                    attribute float alpha;
                    attribute vec2 offset;

                    varying float vTime;
                    varying float vAlpha;
                    varying vec2 vOffset;
                    `
                )

                shader.vertexShader = shader.vertexShader.replace(
                    "#include <begin_vertex>",
                    `#include <begin_vertex>
                
                    vTime = time;
                    vAlpha = alpha;
                    vOffset = offset;
                    `
                )


                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `
                    #include <common>

                    varying float vTime;
                    varying float vAlpha;
                    varying vec2 vOffset;
                    
                    uniform sampler2D uMixTexture;
                    uniform float uThreshold;
                    uniform float uThickness_Out;
                    uniform float uThickness_In;
                    uniform vec4 uOutlineColor;
                    `

                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <color_fragment>",
                    `#include <color_fragment>


                    float mixRatio = vTime;

                    vec2 uv;
                    uv.x = vUv.x + vOffset.x;
                    uv.y = vUv.y + vOffset.y;

                    vec4 material_ = diffuseColor;
                    vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
                    vec4 transitionTexel = texture2D(uMixTexture, uv);
            
                    float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
                    float mixf = clamp((transitionTexel.x  - r)*(1.0/uThreshold), 0.0, 1.0);
        
                    vec4 tmp_color;
                    tmp_color.x = 0.1;
                    tmp_color.y = 0.1;
                    tmp_color.z = 0.4;
                    tmp_color.w = 1.0;
        
                    mixf = step(0.5, mixf);
                    // vec4 mainColor = mix( empty, material_, mixf );
                    // diffuseColor = mix( empty, material_, mixf );
                    diffuseColor = mix( tmp_color, material_, mixf );
                    diffuseColor.x *= vAlpha;
                    diffuseColor.y *= vAlpha;
                    diffuseColor.z *= vAlpha;
                    diffuseColor.w *= vAlpha;
                    `
                )
            }

            // this.items["token_material"].needsUpdate = true



            this.items["shootingStar"].uTime = { value: 0.0 }
            this.items["shootingStar"].uThreshold = { value: 0.85 }
            this.items["shootingStar"].uMixTexture = { value: noise_texture }
            this.items["shootingStar"].onBeforeCompile = (shader) => {
                let mat_ = this.items["shootingStar"]
                shader.uniforms.uTime = mat_.uTime;
                shader.uniforms.uThreshold = mat_.uThreshold;
                shader.uniforms.uMixTexture = mat_.uMixTexture;

                shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <common>`,
                    `#include <common>
        
                    uniform float uTime;
                    uniform float uThreshold;
                    uniform sampler2D uMixTexture;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <color_fragment>`,
                    `
                    #include <color_fragment>
            
                    float mixRatio = 0.2;
        
                    vec2 uv;
                    uv.x = vUv.x;
                    uv.y = vUv.y;
    
                    vec2 uv_noise;
                    uv_noise.x = vUv.x + 0.25;
                    uv_noise.y = vUv.y - uTime;
    
                                    
                    vec4 transitionTexel = texture(uMixTexture, uv_noise);
                    vec4 material = diffuseColor;
                    material.x *= (1.0 - vUv.y);
                    material.y *= (1.0 - vUv.y);
                    material.z *= (1.0 - vUv.y);
                    material.w *= (1.0 - vUv.y);
                    vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
    
                    float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
    
                    float mixf=clamp((transitionTexel.r - r)*(1.0/uThreshold), 0.0, 1.0);
    
                    diffuseColor = mix( empty, material, mixf );
                    `
                )
            }

            this.items["healingBall"].uTime = { value: 0.0 }
            this.items["healingBall"].uThreshold = { value: 0.85 }
            this.items["healingBall"].uMixTexture = { value: noise_texture }
            this.items["healingBall"].onBeforeCompile = (shader) => {
                let mat_ = this.items["healingBall"]
                shader.uniforms.uTime = mat_.uTime;
                shader.uniforms.uThreshold = mat_.uThreshold;
                shader.uniforms.uMixTexture = mat_.uMixTexture;

                shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <common>`,
                    `#include <common>
        
                    uniform float uTime;
                    uniform float uThreshold;
                    uniform sampler2D uMixTexture;
                    `
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <color_fragment>`,
                    `
                    #include <color_fragment>
            
                    float mixRatio = 0.2;
        
                    vec2 uv;
                    uv.x = vUv.x;
                    uv.y = vUv.y;
    
                    vec2 uv_noise;
                    uv_noise.x = vUv.x + 0.25;
                    uv_noise.y = vUv.y - uTime;
    
                                    
                    vec4 transitionTexel = texture(uMixTexture, uv_noise);
                    vec4 material = diffuseColor;
                    material.x *= (1.0 - vUv.y);
                    material.y *= (1.0 - vUv.y);
                    material.z *= (1.0 - vUv.y);
                    material.w *= (1.0 - vUv.y);
                    vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
    
                    float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
    
                    float mixf=clamp((transitionTexel.r - r)*(1.0/uThreshold), 0.0, 1.0);
    
                    diffuseColor = mix( empty, material, mixf );
                    `
                )
            }



            // console.log(this.items.arrowMark)
            // console.log(this.items.arrowMark)
            // console.log(this.items["arrowMark"])
            // console.log(this.items["arrowMark"])



        })

    }

    referenceMaterial(name) {
        return this.items[`${name}`]
    }

    getMaterial(name) {
        return this.items[`${name}`].clone()
    }



    setDebug() {
        if (this.debug.active) {

            this.folder = this.debug.ui.addFolder("Material");

            this.folder.addColor(this.materialColor, 'value')
                .onChange((event) => { this.items["normal-weapon"].color.set(event) })


        }

    }



    Update(deltaTime) {
        this.items["shootingStar"].uTime.value += (1 / (15 * deltaTime))
        if (this.items["shootingStar"].uTime.value > 10.0) {
            this.items["shootingStar"].uTime.value -= 10.0
        }



        this.items["healingBall"].uTime.value += (1 / (15 * deltaTime))
        if (this.items["healingBall"].uTime.value > 10.0) {
            this.items["healingBall"].uTime.value -= 10.0
        }
    }


}