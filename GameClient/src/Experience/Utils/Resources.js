import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


// import { MaterialXLoader } from 'three/examples/jsm/loaders/MaterialXLoader.js';
// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';

function Set_Loaders_Header(loader) {
    // loader.crossOrigin = "https://orlog.io"
    // loader.crossOrigin = "http://localhost:3000"
    loader.crossOrigin = "anonymous"

    // let header_property = { "Access-Control-Allow-Origin" : "https://orlog.io"}
    // loader.setRequestHeader(header_property)
}


export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.loadingBarElement = document.getElementsByClassName('loading-bar')[0]

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.svgLoader = new SVGLoader()
        this.loaders.soundLoader = new THREE.AudioLoader();
        this.loaders.fontLoader = new FontLoader()

        // this.loaders.fontLoader.load("https://fonts.googleapis.com/css2?family=Tektur&display=swap")


        // this.loaders.materialXLoader = new MaterialXLoader()
        // this.loaders.materialXLoader.setPath('https://raw.githubusercontent.com/materialx/MaterialX/main/resources/Materials/Examples/StandardSurface/')

        let loader_keys = Object.keys(this.loaders)
        loader_keys.forEach(key => {
            let loader = this.loaders[`${key}`]
            Set_Loaders_Header(loader)
        })

        // console.log(this.loaders.textureLoader)

        this.r2_url = "http://localhost:3000/resources"

    }

    async startLoading() {
        // Load each source
        for (const source of this.sources) {

            await new Promise(res => { setTimeout(() => { res(true) }, 25) })
            // console.log(`download : ${source.path}`)

            // console.log(this.r2_url + source.path)

            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    this.r2_url + source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    this.r2_url + source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                let paths = new Array(6).fill(this.r2_url)
                paths = paths.map((path, index) => { return path + source.path[index] })
                // console.log(paths)
                this.loaders.cubeTextureLoader.load(
                    paths,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'svg') {
                this.loaders.svgLoader.load(
                    this.r2_url + source.path,
                    (file) => {
                        // console.log(file.paths[0])

                        let shape = undefined
                        if (file.paths.length == 1) {
                            shape = SVGLoader.createShapes(file.paths[0])
                        }
                        else {
                            shape = []
                            file.paths.forEach(path => {
                                shape.push(SVGLoader.createShapes(path))
                            })
                        }


                        this.sourceLoaded(source, shape)
                    }
                )
            }
            else if (source.type === 'sound') {
                this.loaders.soundLoader.load(
                    this.r2_url + source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
                // this.items[`${source.name}`] = new Audio(source.path)
            }
            else if (source.type === 'font') {
                this.loaders.fontLoader.load(
                    this.r2_url + source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }

        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        // console.log(file);
        this.loaded++

        this.loadingBarElement.style.transform = `scaleX(${(this.loaded + 1) / this.toLoad})`

        if (this.loaded === this.toLoad) {
            // console.log(this.items["pebblesModel"])

            // noise_texture.encoding = THREE.sRGBEncoding
            this.items["perlin_noise"].encoding = THREE.sRGBEncoding
            this.items["perlin_noise"].wrapS = THREE.RepeatWrapping;
            this.items["perlin_noise"].wrapT = THREE.RepeatWrapping;

            window.BlackOff()

            this.trigger('ready')
        }
    }
}