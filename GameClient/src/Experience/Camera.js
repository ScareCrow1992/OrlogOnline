import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { gsap } from 'gsap'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.setInstance()
        this.setControls()
        this.setDebug()
        this.resetCamera();

        this.standard_ratio = 1920 / 1080
        // this.standard_ratio = 2560 / 1600

        this.standard_angle = 2 * Math.atan(1 / this.standard_ratio)
        this.standard_angle = this.standard_angle * (180 / Math.PI)


        this.resize()

        // window.addEventListener("keydown", e => {
        //     if (e.key == "[")
        //         this.IsometricView()
        //     else if (e.key == "]")
        //         this.Topview()
        //     else if (e.key == "p")
        //         this._DBG_WideView()
        // })


    }


    setInstance() {
        this.instance = new THREE.PerspectiveCamera(38, this.sizes.width / this.sizes.height, 0.1, 50)
        this.instance.position.set(0, 24.4, 14.6)
        this.length_ = Math.hypot(24.4, 14.6)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enabled = false
    }

    get ui_scale_weight() {
        return window.innerWidth / 1920
    }


    resize() {
        let standard_ratio = this.standard_ratio
        let window_ratio = this.sizes.window_ratio

        // this.ui_scale_weight = window.innerWidth / 1920

        // this.instance.fov = 34

        if (standard_ratio > window_ratio) {


            let fov = 2 * Math.atan(1 / window_ratio)
            fov = fov * (180 / Math.PI)
            // console.log(fov)
            // this.instance.fov = fov
            this.instance.fov = 39.5 + (fov - this.standard_angle) * 0.5
            // console.log(this.instance.fov)
        }
        else {
            this.instance.fov = 39.5
        }

        this.instance.aspect = window_ratio
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }


    resetCamera() {
        this.instance.position.set(0, 24.4, 14.6)
        this.length_ = Math.hypot(24.4, 14.6)
        this.controls.target = new THREE.Vector3(0, 0, 1);

    }

    IsometricView() {
        let pos = {}
        pos.x = 0
        pos.y = 24.4
        pos.z = 14.6
        // this.instance.position.set(0, 20.92, 12.64)
        return gsap.to(this.instance.position, { duration: 0.7, ease: "Power2.easeOut", x: pos.x, y: pos.y, z: pos.z })

    }


    Topview() {
        let pos = {}
        pos.x = 0.00
        pos.y = 26
        // pos.y = 27.5
        pos.z = 7
        this.length_ = Math.hypot(pos.y, pos.z)

        return gsap.timeline()
            .to(this.instance.position, { duration: 0.7, ease: "Power2.easeOut", x: pos.x, y: pos.y, z: pos.z })
        // .to(this.instance.position, { duration: 0.3, ease: "none", y : 15 })
        // this.instance.position.set(0, 20, 0.1)

    }


    _DBG_WideView() {
        let pos = {}
        pos.x = 0
        pos.y = 20.92 * 1.5
        pos.z = 12.64 * 1.5
        this.length_ = Math.hypot(pos.y, pos.z)

        return gsap.timeline()
            .to(this.instance.position, { duration: 0.7, ease: "Power2.easeOut", x: pos.x, y: pos.y, z: pos.z })
    }


    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera');



            this.debugFolder
                .add(this.instance, 'near')
                .name('near')
                .min(0)
                .max(10)
                .step(0.001)
                .listen()


            this.debugFolder
                .add(this.instance, 'far')
                .name('far')
                .min(0)
                .max(500)
                .step(0.001)
                .listen()



            this.debugFolder
                .add(this.instance.position, 'x')
                .name('camera X')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.instance.position, 'x')
                .name('camera X')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.instance.position, 'y')
                .name('camera Y')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.instance.position, 'z')
                .name('camera Z')
                .min(- 10)
                .max(10)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this, "resetCamera")
                .listen()

            // this.debugFolder.hide();

        }
    }
}