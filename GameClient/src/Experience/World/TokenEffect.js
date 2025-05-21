import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';



export default class TokenEffect {
    constructor(pos) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.materialManager = this.experience.material
        this.geometryManager = this.experience.geometry
        this.debug = this.experience.debug


        this.setTexture()
        this.setGeometry()
        this.setMaterial()
        this.setMesh(pos)
        // this.setDebug()

        // this.animation(to, newToken)

    }

    setGeometry() {
        this.geometry = this.geometryManager.items.tokenEffect;
    }


    setTexture() {
        this.texture = this.resources.items.godsymbolDisp
        this.texture.encoding = THREE.sRGBEncoding
    }


    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({ map: this.texture, color: "yellow" });

        this.material.transparent = true;
        this.material.opacity = 0.0;

        this.material.onBeforeCompile = shader => {
            shader.fragmentShader = `

            
            float DrawCircle(vec2 position, float radius, float thickness, vec2 uv){
    
                float strength = 1.0 - step(radius + thickness, distance(uv, position));
               strength *= step(radius - thickness, distance(uv, position));    
                return strength;
            }
            
            
            float drawLine(vec2 p1, vec2 p2, float thickness, vec2 uv){
            
              float a = abs(distance(p1, uv));
              float b = abs(distance(p2, uv));
              float c = abs(distance(p1, p2));
            
              if ( a >= c || b >=  c ) return 0.0;
            
              float p = (a + b + c) * 0.5;
            
              // median to (p1, p2) vector
              float h = 2.0 / c * sqrt( p * ( p - a) * ( p - b) * ( p - c));
            
              // float distance = 2.0 * h / c;
                
              // return mix(1.0, 0.0, smoothstep(0.5 * Thickness, 1.5 * Thickness, h));
                return mix(1.0, 0.0, step(1.0 * thickness, h));
            }
            


            ` + shader.fragmentShader;

            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <color_fragment>`,

                `
            #include <color_fragment>

            // diffuseColor.r = vUv.x;
            // diffuseColor.g = vUv.y;

            float strength = 0.0;

    float x_time[4];
    x_time[0] = 1.0; x_time[1] = 1.0; x_time[2] = -1.0; x_time[3] = -1.0;
    float y_time[4];
    y_time[0] = 1.0; y_time[1] = -1.0; y_time[2] = -1.0; y_time[3] = 1.0;
    
    float margin = 0.02;
    
    float pattern_cnt = 6.0;
    float pattern_thickness = 0.07;
    float border_mask = 0.0;
    
    float pattern_border = 0.8;
    float sym_x = abs(vUv.x - 0.5);
    float sym_y = abs(vUv.y - 0.5);
    
    // border_mask = step(0.2, mod(sym_x * pattern_cnt, 1.0 ));
    // border_mask = step(1. - pattern_border, mod(sym_x * pattern_cnt + (1.0 - pattern_border) * .5, 1.0));
    // border_mask *= step(1. - pattern_border, mod(sym_y * pattern_cnt + (1.0 - pattern_border) * .5, 1.0));
    
    
   
    border_mask = 1.0 - step(pattern_thickness + margin, vUv.x) * step(pattern_thickness + margin, vUv.y);
    border_mask += (step(1.0 - pattern_thickness - margin, vUv.x) + step(1.0 - pattern_thickness - margin , vUv.y));
     
//     border_mask *= step(margin, vUv.x) * step(margin, vUv.y);
//     border_mask *= (1.0 - (step(1.0 - margin, vUv.x))) * (1.0 - step(1.0 - margin, vUv.y));

    border_mask *= step(1. - pattern_border, mod(sym_x * pattern_cnt + (1.0 - pattern_border) * .5, 1.0));
    border_mask *= step(1. - pattern_border, mod(sym_y * pattern_cnt + (1.0 - pattern_border) * .5, 1.0));
    
    strength = border_mask;
    
//     strength += border_mask;
  
//     float pattern_border = 0.1;
//     float pattern_offset = 10.0 * (1.0 - (2.0 * margin))/(pattern_cnt);
    
//     float pattern_mask = step(pattern_border, mod(vUv.x * pattern_cnt - margin, 1.0 - margin));
//     pattern_mask *= step(pattern_border, mod(vUv.y * pattern_cnt - margin, 1.0 - margin));
    
    
//     strength *= pattern_mask;

    float radius = 0.1;
    float thickness = 0.035;
    float position = 0.17;
    
    for(int i=0; i<4; i++){
        strength += DrawCircle(vec2(0.5 + position * x_time[i], 0.5 + position * y_time[i]), radius, thickness, vUv);
    }
    // strength *= DrawCircle(vec2(0.35, 0.35), 0.15, 0.02);

   float mask = 0.0;
    mask = 1.0 - step(0.5 - position, vUv.x) * step(0.5 - position, vUv.y);
    mask += (step(0.5 + position, vUv.x) + step(0.5 + position , vUv.y));
    
    float error = 0.01;
    strength *= mask;
    
    strength += drawLine(vec2(0.5 - position - error, 0.5 + position - radius), vec2(0.5 + position + error, 0.5 + position - radius), thickness, vUv);
    strength += drawLine(vec2(0.5 + position - radius, 0.5 + position + error), vec2(0.5 + position - radius , 0.5 - position - error), thickness, vUv);
    strength += drawLine(vec2(0.5 - position - error, 0.5 - position + radius), vec2(0.5 + position + error, 0.5 - position + radius), thickness, vUv);
    strength += drawLine(vec2(0.5 - position + radius, 0.5 - position - error), vec2(0.5 - position + radius , 0.5 + position + error), thickness, vUv);

    strength = step(0.2, strength);

    // diffuseColor = vec4(strength);
    diffuseColor.w *= strength;

            `
            );
        }


        this.materials = [
            ,
            ,
            this.material,
            ,
            ,
            ,
        ];

    }

    setMesh(pos) {
        this.mesh = new THREE.Mesh(this.geometry, this.materials);
        this.mesh.layers.enable(1)
        this.mesh.layers.toggle(1)
        this.mesh.name = "symbol";
        this.mesh.position.copy(pos);
        this.mesh.position.y += 0.06;
        // this.scene.add(this.mesh);
        // console.log(this.mesh)
    }


    animation(goal, newToken){
        console.log("warning")
        let anim = gsap.timeline()

        anim.to(this.mesh.material, {duration : 0.4, ease:"none", opacity : 1})
        anim.to(this.mesh.position, {duration : 0.6, ease: "none", y : 1.3}, "<")

        anim.to(this.mesh.position, {duration : 0.6, ease: "none", x : goal.x, y : goal.y + 0.02, z : goal.z})

        anim.to(newToken.mesh.material, {duration : 0.3, ease: "none", opacity : 1})
        anim.to(this.mesh.material, {duration : 0.8, ease: "none", opacity : 0, onComplete: this.destroy, onCompleteParams : [this.material]})
        

        // anim.to(this.mesh.material, {duration : 0.3, ease: "none", opacity : 0})
        // anim.to(newToken.mesh.material, {duration : 0.3, ease: "none", opacity : 1, onComplete: this.destroy, onCompleteParams : [this.material]}, "<")

        // console.log(this.material)
    }

    destroy(){
        this.material.dispose()
        this.scene.remove(this.mesh)
        
        // for(let i = 0; i < arguments.length; i++)
        //     arguments[i].dispose()

        // window.experience.scene.remove(this.mesh)

    }

    ToggleLight(){
        this.mesh.layers.toggle(1)
    }

    lightOn(){

    }

    lightOff(){

    }

}