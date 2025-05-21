import * as THREE from 'three'
import Experience from '../Experience.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'
import UnrealBloomComposer from './UnrealBloomComposer.js'
import { AfterimagePass } from "three/addons/postprocessing/AfterimagePass.js";

// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';

export default class PostProcessor
{
    constructor(renderer)
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.renderer = renderer;
        this.composer = new EffectComposer(renderer);
        this.composer.renderToScreen = false;
        
        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        
        // this.composer.physicallyCorrectLights = true
        // this.composer.outputEncoding = THREE.sRGBEncoding
        // this.composer.toneMapping = THREE.CineonToneMapping
        // this.composer.toneMappingExposure = 1.75
        // this.composer.shadowMap.enabled = true
        // this.composer.shadowMap.type = THREE.PCFSoftShadowMap
        // this.composer.setClearColor('#211d20')

        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))


        // this.gammaComposer = new EffectComposer(renderer);
        // this.gammaComposer.setSize(this.sizes.width, this.sizes.height)
        // this.gammaComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.selectedObjects = [];

        this.passes = {};

        // composer = new EffectComposer( renderer );

        this.setInstance()
    }

    setInstance(){
        this.passes.renderPass = new RenderPass( this.experience.scene, this.experience.camera.instance );
		this.composer.addPass( this.passes.renderPass );

        
        // const afterImagePass = new AfterimagePass();
        // afterImagePass.uniforms["damp"].value = 0.975;
        // this.composer.addPass(afterImagePass)

        
        this.passes.gammaPass = new ShaderPass(GammaCorrectionShader)
        this.composer.addPass(this.passes.gammaPass)

        // this.finalGammaComposer = new EffectComposer(this.renderer)
        // this.finalGammaComposer.renderToScreen = false;
        // this.finalGammaComposer.readBuffer = this.unrealBloomComposer.finalComposer.renderTarget2;
        // this.passes.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        // this.finalGammaComposer.addPass(this.passes.gammaCorrectionPass)
     

        
        this.passes.effectFXAA = new ShaderPass( FXAAShader );
        this.pixelRatio = this.renderer.getPixelRatio();
        this.passes.effectFXAA.material.uniforms[ 'resolution' ].value.set( 1 / (this.sizes.width * this.sizes.pixelRatio), 1 / (this.sizes.height * this.sizes.pixelRatio) );
        this.composer.addPass( this.passes.effectFXAA );



        
        
        this.unrealBloomComposer = new UnrealBloomComposer(this.composer.renderTarget2)


        
        
        this.passes.outlinePass = new OutlinePass( new THREE.Vector2( this.sizes.width, this.sizes.height ), this.experience.scene, this.experience.camera.instance );
        // this.passes.outlinePass.selectedObjects = this.experience.mouseManager.selectedObject;

        this.passes.outlinePass.edgeStrength = 8.0;
        this.passes.outlinePass.edgeGlow = 1;
        this.passes.outlinePass.edgeThickness = 8;
        // this.passes.outlinePass.pulsePeriod = 2;
        this.passes.outlinePass.visibleEdgeColor.set('#ddaa22');
        this.passes.outlinePass.hiddenEdgeColor.set('#ddaa22');
        this.composer.addPass( this.passes.outlinePass );

        this.canvas_dom = document.getElementById("game-canvas")

    }

    resize()
    {
        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        
        this.pixelRatio = this.renderer.getPixelRatio();
        this.passes.effectFXAA.material.uniforms[ 'resolution' ].value.set( 1 / (this.sizes.width * this.sizes.pixelRatio), 1 / (this.sizes.height * this.sizes.pixelRatio) );
    }

    update()
    {

        if(this.canvas_dom.style.display !== "none"){
            // this.experience.camera.instance.layers.disable(1)
            this.composer.render();

            // this.experience.camera.instance.layers.enable(1)
            // this.experience.camera.instance.layers.disable(0)
            
            this.unrealBloomComposer.render();
            
            // this.experience.camera.instance.layers.enable(0)
        }

        // this.finalGammaComposer.render();

    }

    hover_on(obj){
        this.passes.outlinePass.selectedObjects = obj;
        // console.log("hover_on");
    }

    hover_off(){
        this.passes.outlinePass.selectedObjects = [];
    }

}