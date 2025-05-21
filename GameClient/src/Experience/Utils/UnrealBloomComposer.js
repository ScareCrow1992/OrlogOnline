import * as THREE from 'three'
import Experience from '../Experience.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { AfterimagePass } from "three/addons/postprocessing/AfterimagePass.js";
// import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'


const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

const params = {
    exposure: 1,
    bloomStrength: 2.1,
    bloomThreshold: 0,
    bloomRadius: 0.5,
    scene: 'Scene with Glow'
};

export default class UnrealBloomComposer {

    constructor(rtv) {
        // console.log(rtv);
        this.experience = new Experience();

        this.sizes = this.experience.sizes
        this.scene = this.experience.scene;
        this.debug = this.experience.debug


        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        this.materials = {};

        this.renderer = this.experience.renderer;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.renderScene = new RenderPass(this.scene, this.camera.instance);

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = params.bloomThreshold;
        this.bloomPass.strength = params.bloomStrength;
        this.bloomPass.radius = params.bloomRadius;

        // console.log(this.bloomPass);


        this.bloomComposer = new EffectComposer(this.renderer.instance);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(this.renderScene);
        this.bloomComposer.addPass(this.bloomPass);

        
        // const afterImagePass = new AfterimagePass();
        // afterImagePass.uniforms["damp"].value = 0.975;
        // this.bloomComposer.addPass(afterImagePass)

        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    originalTexture: { value: rtv.texture },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader:
                    `varying vec2 vUv;

                void main() {
                
                    vUv = uv;
                
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                
                }`,
                fragmentShader:
                    `
                uniform sampler2D originalTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {

                    gl_FragColor = ( texture2D( originalTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

                }`
                ,
                defines: {}
            }), 'baseTexture'
        );
        // this.finalPass.needsSwap = true;




        this.finalComposer = new EffectComposer(this.renderer.instance);
        this.finalComposer.renderToScreen = true;
        // 기존의 postProcessor 렌더링 결과를 final Pass에 넘겨야 한다.
        this.finalComposer.addPass(this.finalPass);
        // this.finalComposer.addPass(this.gammaPass);

        
        // const gammaPass = new ShaderPass(GammaCorrectionShader)
        // this.finalComposer.addPass(gammaPass)


        this.setDebug()

    }

    setDebug() {

        if (this.debug.active) {

            this.gui = this.experience.debug;
            this.debugFolder = this.debug.ui.addFolder("bloom");


            // 함수 호출 방식만 바뀐건데 이건 this.renderer를 못찾는다 ㄷㄷㄷ
            // this.debugFolder.add(params, 'exposure', 0.1, 2).onChange(function (value) {

            //     this.renderer.instance.toneMappingExposure = Math.pow(value, 4.0);
            // });

            this.debugFolder.add(params, 'exposure', 0.1, 2).onChange((value) => {

                this.renderer.instance.toneMappingExposure = Math.pow(value, 5.0);
            });

            this.debugFolder.add(params, 'bloomThreshold', 0.0, 1.0).onChange((value) => {
                this.bloomPass.threshold = Number(value);
                // this.render();
            });

            this.debugFolder.add(params, 'bloomStrength', 0.0, 10.0).onChange((value) => {
                this.bloomPass.strength = Number(value);
            });

            this.debugFolder.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange((value) => {
                this.bloomPass.radius = Number(value);
            });

        }

    }


    renderBloom() {
        this.scene.traverse((obj) => { this.darkenNonBloomed(obj) });
        this.bloomComposer.render();
        this.scene.traverse((obj) => { this.restoreMaterial(obj) });

    }

    darkenNonBloomed(obj) {
        // console.log(experience.unrealBloomComposer);
        // console.log(obj)

        let materials = this.materials;
        if (obj.name == "symbol") {
            // console.log(bloomLayer.test(obj.layers))

        }
        // console.log(obj);
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
            // console.log(obj);
            materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;

        }

    }

    restoreMaterial(obj) {
        let materials = this.materials;
        if (materials[obj.uuid]) {

            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];

        }

    }

    render() {

        // render scene with bloom
        this.renderBloom();

        // render the entire scene, then render bloom scene on top
        this.finalComposer.render();

    }

}

