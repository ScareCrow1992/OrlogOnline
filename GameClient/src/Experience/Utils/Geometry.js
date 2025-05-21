import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


export default class Geometry extends EventEmitter {
    constructor(playertype) {
        super()

        // {top, bottom}
        this.playerType = playertype;

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene



        this.resources.on('ready', () => {

            // console.log(this.resources.items["pebblesModel"].scenes[0].children.length)

            let stone_index0 = Array.from(Array(15).keys())
            shuffle(stone_index0)

            let stone_index1 = Array.from(Array(15).keys())
            shuffle(stone_index1)

            let stone_indexes = [...stone_index0, ...stone_index1]

            // console.log("hello");
            this.items = {
                resources : this.resources,
                axe: this.resources.items.axeModel.scenes[0].children[0],
                helmet: this.resources.items.helmetModel.scenes[0].children[0],
                arrow: this.resources.items.arrowModel.scenes[0].children[0],
                shield: this.resources.items.shieldModel.scenes[0].children[0],
                bow: this.resources.items.bowModel.scenes[0].children[0],
                steal : null,
                token: new THREE.BoxGeometry(1, 0.075, 1, 1, 1, 1),
                tokenEffect: new THREE.BoxGeometry(1, 0.075, 1, 4, 4, 4),
                mjolnir: this.resources.items.mjolnirModel.scenes[0].children[0],
                // mjolnir2: this.resources.items.mjolnir2Model.scene.children[0],
                // "health-stone" : new THREE.IcosahedronGeometry(0.5, 2),
                health_stone_index : 0,
                get "health-stone"() { 
                    // (++this.health_stone_index < 15 ? this.health_stone_index : this.health_stone_index = 0) 
                    let current_index = stone_indexes[this.health_stone_index++]
                    // console.log(this.health_stone_index)
                    // console.log(current_index)
                    this.resources.items["pebblesModel"].scenes[0].children[current_index].geometry.index__ = current_index % 15

                    this.resources.items["pebblesModel"].scenes[0].children[current_index].geometry.team__ = this.health_stone_index <= 15 ? "top" : "bottom"


                    return this.resources.items["pebblesModel"].scenes[0].children[current_index].geometry
                },
                // spheredCube : this.resources.items["spheredCube"].scene.children[0].geometry

                // get "health-stone"() { return (++this.stone_index < 15 ? this.stone_index : this.stone_index = 0) },

                // "health-stone" : this.resources.items["pebblesModel"].scenes[0].children[0].geometry
                // stamp : this.resources.items.stampModel.scenes[0].children[0].geometry
            }


            // console.log(this.items.arrow.material)

            


            this.setBow();

            // this.items.axe.scale.multiplyScalar(10)
            // this.items.helmet.scale.multiplyScalar(0.12)
            // this.items.arrow.scale.multiplyScalar(2.5)
            // this.items.arrow.scale.x *= 2.5
            // this.items.arrow.scale.y *= 2.5
            // this.items.shield.scale.multiplyScalar(2)
            // this.items.bow.scale.multiplyScalar(2)


            
            let weapons = ["axe", "helmet", "arrow", "shield", "bow", "mjolnir"];

            weapons.forEach(weapon => {
                if (weapon == "shield") {
                    //     this.items[`${weapon}`].children[0].updateMatrix();
                    //     this.items[`${weapon}`].children[1].updateMatrix();
                    // }
                    // else{
                    //     this.items[`${weapon}`].updateMatrix();
                    //     // console.log(this.items[`${weapon}`].matrix)
                    this.items[`${weapon}`].updateMatrix();
                }
            })


            weapons.forEach(weapon => {

                this.items[`${weapon}`].material.dispose()
                // this.items[`${weapon}`].material = new THREE.MeshStandardMaterial({transparent : true})

                this.items[`${weapon}`] = this.items[`${weapon}`].geometry

            })

        })
    }

    getGeometry(name){
        return this.items[`${name}`]
    }



    setBow() {
        // console.log(this.items.bow);
        let geometry = this.items.bow.geometry;
        let vertexCnt = geometry.attributes.position.count;
        let positionBuffer = geometry.attributes.position.array;

        let minX = 9999, maxX = -9999, minY = 9999, maxY = -9999, minZ = 9999, maxZ = -9999

        for (let i = 0; i < vertexCnt; i++) {
            // console.log(`x : ${positionBuffer[i]}, y : ${positionBuffer[i + 1]}, z : ${positionBuffer[i + 2]}`);

            minX = Math.min(positionBuffer[3 * i], minX);
            maxX = Math.max(positionBuffer[3 * i], maxX);

            minY = Math.min(positionBuffer[3 * i + 1], minY);
            maxY = Math.max(positionBuffer[3 * i + 1], maxY);

            minZ = Math.min(positionBuffer[3 * i + 2], minZ);
            maxZ = Math.max(positionBuffer[3 * i + 2], maxZ);

        }

        // console.log(minX)
        // console.log(maxX)
        // console.log(minY)
        // console.log(maxY)
        // console.log(minZ)
        // console.log(maxZ)

    }



}