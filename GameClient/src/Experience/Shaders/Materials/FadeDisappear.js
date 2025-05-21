import * as THREE from "three"
import Experience from "../../Experience.js";


function GetMaskMaterial(material_){
    let noise_texture = new Experience().resources.items["perlin_noise"]
    let material = material_.clone()

    material.transparent = true;
    material.opacity = 1.0;
    
    // custom uniforms
    material.uTime = { value: 0.4 }
    material.uOffset = { value: new THREE.Vector2(0.0, 0.0) }
    material.uThreshold = { value: 0.3 }
    material.uMixTexture = { value: noise_texture }
    

    material.onBeforeCompile = shader => {
        shader.uniforms.uTime = material.uTime;
        shader.uniforms.uThreshold = material.uThreshold;
        shader.uniforms.uMixTexture = material.uMixTexture;
        shader.uniforms.uOffset = material.uOffset;

    
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `#include <common>

            uniform float uTime;
            uniform float uThreshold;
            uniform sampler2D uMixTexture;
            uniform vec2 uOffset;
            `
        )
    
    
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <color_fragment>`,
            `
            #include <color_fragment>
    
            float mixRatio = uTime;

            vec2 uv;
            uv.x = vUv.x + uOffset.x;
            uv.y = vUv.y + uOffset.y;
            
            vec4 material_ = diffuseColor;
            vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 transitionTexel = texture2D(uMixTexture, uv);
    
            float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
            float mixf = clamp((transitionTexel.x  - r)*(1.0/uThreshold), 0.0, 1.0);


            mixf = step(0.5, mixf);
            
            diffuseColor = mix( empty, material_, mixf );
            `
        )
    }

    return material;
}



function GetOutlineMaterial(material_){
    let noise_texture = new Experience().resources.items["perlin_noise"]
    let material = material_.clone()

    material.transparent = true;
    material.opacity = 1.0;
    
    // custom uniforms
    material.uTime = { value: 0.4 }
    material.uThreshold = { value: 0.5 }
    material.uMixTexture = { value: noise_texture }
    material.uOutlineColor = {value : new THREE.Vector4(0.8, 0.8, 0.2, 1.0)}
    material.uThickness_In = {value : 0.25}
    material.uThickness_Out = {value : 0.75}
    
    material.uOffset = { value: new THREE.Vector2(0.0, 0.0) }
    

    material.onBeforeCompile = shader => {
        shader.uniforms.uTime = material.uTime;
        shader.uniforms.uOffset = material.uOffset;
        
        shader.uniforms.uThreshold = material.uThreshold;
        shader.uniforms.uMixTexture = material.uMixTexture;
        shader.uniforms.uOutlineColor = material.uOutlineColor;

        shader.uniforms.uThickness_In = material.uThickness_In;
        shader.uniforms.uThickness_Out = material.uThickness_Out;
        

    
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `#include <common>

            uniform float uTime;
            uniform float uThreshold;
            uniform sampler2D uMixTexture;
            uniform vec4 uOutlineColor;
            
            uniform float uThickness_In;
            uniform float uThickness_Out;
            
            uniform vec2 uOffset;
            `
        )
    
    
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <color_fragment>`,
            `
            #include <color_fragment>
    
            float mixRatio = uTime;

            vec2 uv;
            uv.x = vUv.x + uOffset.x;
            uv.y = vUv.y + uOffset.y;
            
            vec4 empty = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 transitionTexel = texture2D(uMixTexture, uv);
    
            float r = mixRatio * (1.0 + uThreshold * 2.0) - uThreshold;
            float mixf = clamp((transitionTexel.x  - r)*(1.0/uThreshold), 0.0, 1.0);

            float outline_A = step(uThickness_Out, mixf);
            float outline_B = step(uThickness_In, mixf);
            float outline_ = outline_B - outline_A;
            
            vec4 outline;
            outline.x = uOutlineColor.x;
            outline.y = uOutlineColor.y;
            outline.z = uOutlineColor.z;
            outline.w = uOutlineColor.w;

            mixf = step(0.5, mixf);
            
            diffuseColor = mix(empty, outline, outline_);
            `
        )
    }

    return material;

}

export default function (material) {
    // console.log(noise_texture)
    
    // return GetMaskMaterial(material)
    return [GetMaskMaterial(material), GetOutlineMaterial(material)]
    
}


