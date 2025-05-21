import * as THREE from 'three'
import Experience from '../Experience.js'
import PointShred from '../Shaders/Materials/PointShred.js'

// import DiceFace from './DiceFace.js'

// controller
export default class ParticleSystem {
    constructor(geometry_) {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        
        const geometry = CopyGeometryBuffer(geometry_)

        const material_ = new THREE.PointsMaterial({
            map: this.resources.items["particle_star_06"],
            size: 0.6,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })

        this.material = PointShred(material_)
        material_.dispose()

        this.points = new THREE.Points(geometry, this.material)
        this.points.layers.enable(1)

    }

}

function CopyGeometryBuffer(geometry_){
    // console.log(geometry_)
    const cnt = geometry_.attributes.position.count

    // console.log(Object.keys(geometry_.attributes))
    let keys = Object.keys(geometry_.attributes)
    
    // const normal = new Float32Array(cnt * 3)
    // const position = new Float32Array(cnt * 3)
    // const uv = new Float32Array(cnt * 2)
    // const color = new Float32Array(cnt * 3)

    let attributes = geometry_.attributes;
    let geometry = new THREE.BufferGeometry()
    keys.forEach(key=>{
        let attribute = attributes[`${key}`]
        geometry.setAttribute(key, attribute.clone())
    })

    
    const colors = new Float32Array(cnt * 3)
    const aControl0 = new Float32Array(cnt * 3)
    const aControl1 = new Float32Array(cnt * 3)
    const aEndPosition = new Float32Array(cnt * 3)

    for(let index = 0; index < cnt; index++){
        let x = attributes.position.array[3 * index + 0]
        let y = attributes.position.array[3 * index + 1]
        let z = attributes.position.array[3 * index + 2]

        colors[3 * index + 0] = 0.0
        colors[3 * index + 1] = 0.0
        colors[3 * index + 2] = 0.0

        aControl0[3 * index + 0] = x + THREE.MathUtils.randFloat(0.75, 2.0);
        aControl0[3 * index + 1] = y + 1.5 * THREE.MathUtils.randFloat(0.0, 3.0);
        aControl0[3 * index + 2] = z + THREE.MathUtils.randFloatSpread(1.5);

        aControl1[3 * index + 0] = x - THREE.MathUtils.randFloat(2, 3);
        aControl1[3 * index + 1] = y + 1.5 * THREE.MathUtils.randFloat(1.0, 4.5);
        aControl1[3 * index + 2] = z + THREE.MathUtils.randFloatSpread(2);

        aEndPosition[3 * index + 0] = x + THREE.MathUtils.randFloatSpread(1);
        aEndPosition[3 * index + 1] = y + 1.5 * THREE.MathUtils.randFloat(1.5, 7.0);
        aEndPosition[3 * index + 2] = z + THREE.MathUtils.randFloat(-0.5, 0.5);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aControl0', new THREE.BufferAttribute(aControl0, 3))
    geometry.setAttribute('aControl1', new THREE.BufferAttribute(aControl1, 3))
    geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3))

    return geometry;
}
