import * as THREE from 'three'
import Experience from '../Experience.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export default class GodPiece {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug


        // const paths = data.paths;
        const data = this.resources.items.godThorSVG;
        // console.log(data);
		const paths = data.paths
        const group = new THREE.Group();

		for ( let i = 0; i < paths.length; i ++ ) {

			const path = paths[ i ];

			const material = new THREE.MeshBasicMaterial( {
				color: path.color,
				side: THREE.DoubleSide,
				depthWrite: false
			} );

			const shapes = SVGLoader.createShapes( path );

			for ( let j = 0; j < shapes.length; j ++ ) {

				const shape = shapes[ j ];
				const geometry = new THREE.ShapeGeometry( shape );
				const mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );
                mesh.scale.x = 0.01;
                mesh.scale.y = 0.01;
                mesh.scale.z = 0.01;
                mesh.position.x = 0;
                mesh.position.y = 0;
                mesh.position.z = 0;
                
			}

		}

		this.scene.add( group );


        group.position.x = -15;
        group.position.y = 0;
        group.position.z = 0;

        // this.setTextures()
        // this.setGeometry()
        // this.setMaterial()
        // this.setMesh();
        // this.setDebug()
    }

    setTextures(name) {
    }


    setGeometry() {
    }


    setMaterial() {

        // color_fragment
    }

    // setSprite()
    // {
    //     this.sprite = new THREE.Sprite(this.material);
    //     this.scene.add(this.sprite);

    // }

    setMesh() {
    }



}