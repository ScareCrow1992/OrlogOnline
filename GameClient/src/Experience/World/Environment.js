import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()

        // setTimeout(()=>{this.setEnvironmentMap()}, 5000)
        this.setEnvironmentMap()
    }

    setSunLight() {

        // this.pointLight = new THREE.PointLight(0xffffff, 0, 800);
        // this.pointLight.position.y = 8.6;
        // this.scene.add(this.pointLight)

        // if (this.debug.active) {
        //     this.debugFolder
        //         .addColor(this.pointLight, 'color')
        //         .name("point light color")

        //     this.debugFolder
        //         .add(this.pointLight, 'intensity')
        //         .name("point light intensity")
        //         .min(0)
        //         .max(1000)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.pointLight, 'decay')
        //         .name("decay")
        //         .min(0)
        //         .max(4)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.pointLight, 'distance')
        //         .name("point light distance")
        //         .min(0)
        //         .max(800)
        //         .step(0.001)

        //     this.debugFolder
        //         .add(this.pointLight.position, 'y')
        //         .name("point light position")
        //         .min(0)
        //         .max(20)
        //         .step(0.001)

        // }

        this.sunLight = new THREE.DirectionalLight('#ffffff', 2)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 30
        this.sunLight.shadow.camera.top = 20;
        this.sunLight.shadow.camera.bottom = -20;
        this.sunLight.shadow.camera.right = 20;
        this.sunLight.shadow.camera.left = -20;
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.89, 7.96, -3.23)
        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .addColor(this.sunLight, 'color')

            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(-10)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(-10)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(-10)
                .max(10)
                .step(0.001)
        }
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 1
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
                else if (child instanceof THREE.Mesh && Array.isArray(child.material)) {
                    // console.log(child.material)
                    child.material.forEach(mat => {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.envMap = this.environmentMap.texture
                            mat.envMapIntensity = this.environmentMap.intensity
                            mat.needsUpdate = true
                        }
                    })
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}