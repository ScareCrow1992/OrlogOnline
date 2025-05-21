import * as THREE from 'three'
import Experience from './Experience.js'

// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()

        this.postProcessor = this.experience.postProcessor;

        this.debug = this.experience.debug


        this.setDebug()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
            // antialias : false
        })
        // this.instance.autoClear = false;
        // this.instance.capabilities.logarithmicDepthBuffer = true
        // this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.physicallyCorrectLights = true
        this.instance.toneMapping = THREE.CineonToneMapping
        // this.instance.toneMappingExposure = 1.75
        this.instance.toneMappingExposure = Math.pow(1,5)
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.shadowMap.type = THREE.BasicShadowMap
        this.instance.setClearColor('#000000')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1.5))


        // console.log(this.instance.capabilities.isWebGL2);

    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1.5))
        // 	renderer.setSize( container.offsetWidth, container.offsetHeight );
    }

    update() {
        // nodeFrame.update();
        // this.postProcessor.update();
        // if(document.visibilityState == "visible")
        this.instance.render(this.scene, this.camera.instance)
        // this.postProcessor.composer.render();
    }



    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("renderer");


            this.debugFolder
                .add(this.instance, 'toneMapping', {
                    No: THREE.NoToneMapping,
                    Linear: THREE.LinearToneMapping,
                    Reinhard: THREE.ReinhardToneMapping,
                    Cineon: THREE.CineonToneMapping,
                    ACESFilmic: THREE.ACESFilmicToneMapping
                })

            // this.debugFolder
            //     .add(this.instance, 'toneMappingExposure').min(0).max(10).step(0.001)
            
        }


    }

}