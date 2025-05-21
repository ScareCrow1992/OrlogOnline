import * as THREE from 'three'
import Experience from '../../Experience.js'


export default class DisappearMaterial {


    constructor(from, to, newToken) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug

        this.customUniforms = {
            uTime: { value: 0.5 },
            uDisappear: { value: 1.05 }
        }


        this.setTexture()
        this.setMaterial()



        // this.setDebug()


    }

    setTexture() {
        this.texture = this.resources.items.diceArrowTexture
        this.texture.encoding = THREE.sRGBEncoding
    }

    setMaterial() {

        this.material = new THREE.MeshStandardMaterial({
            map: this.texture, color: "#00ff11", bumpScale: 0, metalness: 0.164, roughness: 0.164, transparent: true
        });

        // this.material.color = 0x00ffaa

        this.texture.offset.x = 0.25
        this.texture.offset.y = 0.25

        this.material.transparent = true;
        this.material.opacity = 1.0;
        this.material.side = THREE.DoubleSide

        this.material.onBeforeCompile = shader => {
            shader.uniforms.uTime = this.customUniforms.uTime;
            shader.uniforms.uDisappear = this.customUniforms.uDisappear;
            shader.fragmentShader = shader.fragmentShader.replace(`#include <common>`, `
        #include <common>
        uniform float uTime;
        uniform float uDisappear;

        vec4 permute(vec4 x)
        {
            return mod(((x*34.0)+1.0)*x, 289.0);
        }


        vec4 taylorInvSqrt(vec4 r)
        {
            return 1.79284291400159 - 0.85373472095314 * r;
        }
        vec3 fade(vec3 t)
        {
            return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        float cnoise(vec3 P)
        {
            vec3 Pi0 = floor(P); // Integer part for indexing
            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P); // Fractional part for interpolation
            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
            return 2.2 * n_xyz;   // 2.2 => 흰색 선명도
        }
        `);


            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <color_fragment>`,

                `
    #include <color_fragment>

    vec2 uv;
    uv.x = vUv.x;
    uv.y = vUv.y;

    uv.x = mod(uv.x * 2.0, 1.0);
    uv.y = mod(uv.y * 2.0, 1.0);

    uv.x = 2.0 * abs(uv.x - 0.5);
    uv.y = 2.0 * abs(uv.y - 0.5);
    
    // p : animation time
    float p = uDisappear;
    float t = 0.628; // 0 ~ 1 (start ~ end)
    
    
    vec2 p1,p2,p3;
    
    
    p1.x = (2.0 * p - 1.0) * step(0.5, p);
    p1.y = (2.0 * p) - (2.0*p - 1.0) * step(0.5, p);
    
    p2.x = (2.0 * p) * (1.0 - step(0.25, p)) + 0.5 * ((step(0.25, p) - step(0.75, p))) + (0.5 + 2.0 * (p - 0.75)) * (step(0.75, p));
    p2.y = p2.x;
    
    p3.x = (2.0 * p) - (2.0 * p - 1.0) * step(0.5, p);
    p3.y = (2.0 * p - 1.0) * step(0.5, p);
    
    float p1_dot = 1.0 - step(0.025, distance(p1, uv));
    float p2_dot = 1.0 - step(0.025, distance(p2, uv));
    float p3_dot = 1.0 - step(0.025, distance(p3, uv));
    
    
    // object destroy : 1 -> 0
    float radius = 0.05;
    float time_weight = 1.5;
    float noise_wave = 20.0;
    float noise_height = 0.05;
    float noise_radius;
    
    float step_constant = .02;
    
    float inner_thickness = 0.2;
    float outer_thickness = 0.02;
    
    float inner_radius;
    float outer_radius;
    
    
    
    float width, height;
    width = (1.0 - uv.y) * step(0.5, p) + (uv.x) * (1.0 - step(0.5, p));
    height = (1.0 - uv.x) * step(0.5, p) + (uv.y) * (1.0 - step(0.5, p));
    
    float theta = atan(width / height);
    // float theta = atan(uv.y / uv.x);
    t = theta / (PI / 2.0);
    t = min(1.0, t);
    t = max(0.0, t);
    
    
    
    vec2 pos = (1.0 - t) * (1.0 - t) * p1 + 2.0 * (1.0 - t) * t * p2 + t * t * p3;
   float line = 1.0 - step(0.05, distance(uv, pos));
    
    
    
    
    float outlineNoise = cnoise(vec3(uv * noise_wave, uTime * time_weight));
    vec2 org = vec2(0.0, 0.0);
    noise_radius = distance(uv, pos) - (radius + outlineNoise * noise_height);
    
    float mask = 1.0 - smoothstep(step_constant, step_constant + outer_thickness, noise_radius) * step(0.0,(distance(org, uv) - distance(org, pos)));
    float outline = 1.0
        - step(0.0,(distance(org, uv) - distance(org, pos))) * (smoothstep(step_constant, step_constant + outer_thickness, noise_radius))
         - step(0.0,(distance(org, pos) - distance(org, uv))) * (smoothstep(step_constant, step_constant + inner_thickness, noise_radius));
    
    
    
    // vec4 outlineColor = vec4(mix(vec3(0.0, 0., 0.7), vec3(0.0, 1.0, 1.0), outline ), mask);
    vec4 outlineColor = vec4(mix(vec3(0.5, 0., 0.), vec3(.9, 0.9, .0), outline ), 1.0 - mask);
    
    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); // org material
    // gl_FragColor = max(gl_FragColor, mask);
    // gl_FragColor = mix(gl_FragColor, outlineColor, outline);
    



    // diffuseColor = vec4(strength);
    // diffuseColor = mix(diffuseColor, vec4(0.5, 0.5, 0.5, 0.5), 0.5)
    diffuseColor.a = mask;
    diffuseColor.r = mix(diffuseColor.r, outlineColor.x, outline);
    diffuseColor.g = mix(diffuseColor.g, outlineColor.y, outline);
    diffuseColor.b = mix(diffuseColor.b, outlineColor.z, outline);
    // diffuseColor.a = mix(diffuseColor.a, outlineColor.w, outline);

            `
            );
        }

    }



    setDebug() {
        // console.log(this.material.uniforms)

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(`disappear Material`);



            this.debugFolder
                .add(this.customUniforms.uTime, "value")
                .name("uTime")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.customUniforms.uDisappear, "value")
                .name("uDisappear")
                .min(-0.2)
                .max(1.2)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.texture.offset, "x")
                .name("x")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()

            this.debugFolder
                .add(this.texture.offset, "y")
                .name("y")
                .min(0)
                .max(1)
                .step(0.001)
                .listen()



        }
    }


}