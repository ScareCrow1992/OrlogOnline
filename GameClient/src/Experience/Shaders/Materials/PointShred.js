import * as THREE from "three"
import Experience from "../../Experience.js";


function GetMaterial(material_){
    let noise_texture = new Experience().resources.items["perlin_noise"]
    let material = material_.clone()

    material.transparent = true;
    material.opacity = 1.0;
    
    // custom uniforms
    material.uTime = { value: 0.1 }
    material.uDelay = { value : 0.1 }
    material.uThreshold = { value: 0.75 }
    material.uMixTexture = { value: noise_texture }
    material.uParticleColor = { value: new THREE.Vector3(0.8, 0.8, 0.2) }
    // material.uParticleColor = { value: new THREE.Vector3(0.05, 0.6, 0.9) }

    

    material.onBeforeCompile = shader => {
        shader.uniforms.uTime = material.uTime;
        shader.uniforms.uDelay = material.uDelay;
        shader.uniforms.uThreshold = material.uThreshold;
        shader.uniforms.uMixTexture = material.uMixTexture;
        shader.uniforms.uParticleColor = material.uParticleColor;

    
        shader.vertexShader = shader.vertexShader.replace(
            `#include <common>`,
            `#include <common>

            uniform float uTime;
            uniform float uDelay;
            uniform float uThreshold;
            uniform sampler2D uMixTexture;
            uniform vec3 uParticleColor;

            attribute vec3 aControl0;
            attribute vec3 aControl1;
            attribute vec3 aEndPosition;

            varying vec2 vUv;

            vec3 bezier(vec3 A, vec3 B, vec3 C, vec3 D, float t) {
                vec3 E = mix(A, B, t);
                vec3 F = mix(B, C, t);
                vec3 G = mix(C, D, t);
              
                vec3 H = mix(E, F, t);
                vec3 I = mix(F, G, t);
              
                vec3 P = mix(H, I, t);
              
                return P;
              }
            `
        )
    
    
        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
    
            float mixRatio = uTime - uDelay;
            
            vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 transitionTexel = texture2D(uMixTexture, uv);
    
            float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
            float mixf = clamp((transitionTexel.x  - r)*(1.0/uThreshold), 0.0, 1.0);


            // transformed.y += aEndPosition.y * mixf;
            transformed = bezier(transformed, aControl0, aControl1, aEndPosition, 1.0 - mixf);

            vColor.x = uParticleColor.x;
            vColor.y = uParticleColor.y;
            vColor.z = uParticleColor.z;
            // size.x = 0.1;
            // size.y = 0.1;
            // size.z = 0.1;
            vUv = uv;
            `
        )


        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `#include <common>

            uniform float uTime;
            uniform float uDelay;
            uniform float uThreshold;
            uniform sampler2D uMixTexture;
            varying vec2 vUv;
            `
        )


        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <color_fragment>`,
            `
            #include <color_fragment>
    
            float mixRatio = uTime - uDelay;

            
            vec4 material_ = diffuseColor;
            vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 transitionTexel = texture2D(uMixTexture, vUv);
    
            float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
            float mixf = clamp((transitionTexel.x  - r)*(1.0/uThreshold), 0.0, 1.0);


            float a = step(0.001, mixf);
            float b = 1.0 - step(0.999, mixf);

            diffuseColor = mix( empty, material_, a * b * mixf );
            `
        )

    }

    return material;
}



export default function (material) {
    // console.log(noise_texture)
    
    // return GetMaskMaterial(material)
    return GetMaterial(material)
 
}


