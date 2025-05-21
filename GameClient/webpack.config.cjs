// import path from 'path';
const path = require('path');
// html 플러그인을 불러오고

module.exports = (env) => {
    // console.log(env)
    console.log(path.resolve(__dirname, `frontend/public/src/js/util/${env.MODE}_config.js`))

    return {
        // mode: "development",
        mode : "production",
        entry: {
            index: "./frontend/public/src/js/index.js",
            subindex: "./src/script.js"
        },
        experiments: {
            outputModule: true,
        },
        // exclude: {
        //     test: [
        //         /\.html$/,
        //         /\.(js|jsx)$/,
        //         /\.css$/,
        //         /\.json$/,
        //         /\.bmp$/,
        //         /\.gif$/,
        //         /\.jpe?g$/,
        //         /\.png$/,
        //     ],
        //     exclude: ["js/util/config.js"]
        // },
        externalsType: 'module',
        externals: {
            three: "three",
            "three/addons/*": "three/addons/*",
            "three/addons/controls/OrbitControls.js": "three/addons/controls/OrbitControls.js",
            "three/addons/libs/stats.module.js": "three/addons/libs/stats.module.js",
            "three/addons/postprocessing/EffectComposer.js": "three/addons/postprocessing/EffectComposer.js",
            "three/addons/postprocessing/RenderPass.js": "three/addons/postprocessing/RenderPass.js",
            "three/addons/postprocessing/ShaderPass.js": "three/addons/postprocessing/ShaderPass.js",
            "three/addons/postprocessing/OutlinePass.js": "three/addons/postprocessing/OutlinePass.js",
            // "three/addons/objects/Water2.js": "three/addons/objects/Water2.js",
            "three/addons/shaders/FXAAShader.js": "three/addons/shaders/FXAAShader.js",
            // "three/addons/objects/ShadowMesh.js": "three/addons/objects/ShadowMesh.js",
            "three/addons/shaders/GammaCorrectionShader.js": "three/addons/shaders/GammaCorrectionShader.js",
            'three/addons/curves/CurveExtras.js' : 'three/addons/curves/CurveExtras.js',
            "three/addons/loaders/GLTFLoader.js": "three/addons/loaders/GLTFLoader.js",
            "three/addons/loaders/SVGLoader.js": "three/addons/loaders/SVGLoader.js",
            "three/addons/postprocessing/RenderPass.js": "three/addons/postprocessing/RenderPass.js",
            "three/addons/postprocessing/ShaderPass.js": "three/addons/postprocessing/ShaderPass.js",
            "three/addons/postprocessing/UnrealBloomPass.js": "three/addons/postprocessing/UnrealBloomPass.js",
            "three/addons/postprocessing/AfterimagePass.js": "three/addons/postprocessing/AfterimagePass.js",
            "three/addons/loaders/SVGLoader.js": "three/addons/loaders/SVGLoader.js",
            "three/addons/geometries/RoundedBoxGeometry.js": "three/addons/geometries/RoundedBoxGeometry.js",
            'three/addons/geometries/TextGeometry.js':'three/addons/geometries/TextGeometry.js',
            // 'three/addons/geometries/LightningStrike.js':'three/addons/geometries/LightningStrike.js',
            "lil-gui": "lil-gui",
            "gsap": "gsap",
            "cannon": "cannon",
            'three/addons/loaders/FontLoader.js':'three/addons/loaders/FontLoader.js'
        },
        // module: {
        //     // noParse: "three",
        //     rules: [
        //         {
        //             test: [
        //                 /\.js$/,
        //             ],
        //             // use: [
        //                 // 'style-loader',
        //                 // 'css-loader',
        //                 // 'resolve-url-loader'

        //             // ],
        //             exclude: [path.resolve(__dirname, "frontend/public/src/js/util/")],
        //             // exclude : ["/node_modules/"]
        //             // exclude : ["/js/util/config.js"] 
        //             // exclude:[
        //             //     "three", "gsap", "cannon", "lil-gui"
        //             // ]
        //             // exclude: ["./frontend/public/src/js/util/config.js"]

        //             // options: {
        //             //     esModule: false,
        //             // },
        //         }
        //     ]
        // },
        resolve: {
            // fallback: { three: false, gsap : false, cannon: false, "lil-gui" : false },
            alias: {
                '/js': path.resolve(__dirname, 'frontend/public/src/js'),
                // "config": path.resolve(__dirname, `frontend/public/src/js/util/${env.MODE}_config.js`)
                "config": path.resolve(__dirname, `../ENV/browser/${env.MODE}_config.js`)
            }

        },
        output: {
            path: path.resolve(__dirname, "frontend/entry"),
            // path: "./public",
            filename: '[name]_bundle.js'
        }
    }
}