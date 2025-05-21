import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap';

export default class FlipCoin {
    constructor(anchors) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.isSwap = 0

        const uv_map = this.experience.resources.items["uv_checker"]
        uv_map.encoding = THREE.sRGBEncoding


        let coin_green = this.experience.resources.items["coin_green"]
        let coin_green_normal = this.experience.resources.items["coin_green_normal"]

        coin_green.encoding = THREE.sRGBEncoding
        coin_green_normal.encoding = THREE.sRGBEncoding

        coin_green.center = new THREE.Vector2(0.5, 0.5)
        coin_green.rotation = -(Math.PI / 2 + Math.PI / 15.5)
        
        coin_green_normal.center = new THREE.Vector2(0.5, 0.5)
        coin_green_normal.rotation = -(Math.PI / 2 + Math.PI / 15.5)


        
        let coin_blue = this.experience.resources.items["coin_blue"]
        let coin_blue_normal = this.experience.resources.items["coin_blue_normal"]

        coin_blue.encoding = THREE.sRGBEncoding
        coin_blue_normal.encoding = THREE.sRGBEncoding

        
        coin_blue.center = new THREE.Vector2(0.5, 0.5)
        coin_blue.rotation = Math.PI - Math.PI / 8
        
        coin_blue_normal.center = new THREE.Vector2(0.5, 0.5)
        coin_blue_normal.rotation = Math.PI - Math.PI / 8

        let coinGeo = new THREE.CylinderGeometry( 1.25, 1.25, 0.15, 32 );
        let coinMat = [
            new THREE.MeshStandardMaterial({ color: "black", metalness: 0.4, roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ 
                // color : "blue",
                map : coin_blue, 
                normalMap : coin_blue_normal,
                metalness: 0.45, 
                roughness: 0.55 }),
            new THREE.MeshStandardMaterial({ 
                // color : "green",
                map: coin_green, 
                normalMap : coin_green_normal,
                metalness: 0.5, 
                roughness: 0.5 })
        ]
        this.coinMesh = new THREE.Mesh(coinGeo, coinMat)
        this.coinMesh.castShadow = true
        // this.coinMesh.rotateX(Math.PI)
        this.scene.add(this.coinMesh)

        this.anchors = anchors
        this.turn_player_index = 0

    }



    SetPositionOrigin(){
        this.coinMesh.position.set(0, 0.15 / 2, 0)
    }



    GameOver(){
        this.isSwap = 0
        this.turn_player_index = 0
        this.SetPositionOrigin()
    }



    PlayerSwap(){
        this.isSwap = 1
    }


    SetFirstPlayer(user){
        this.turn_player_index = user
    }


    GetCoinFaceDirection(player){
        return (player + this.isSwap) * Math.PI
    }

    GetCoinPosition(player){
        let index_ = (player + this.isSwap) % 2
        return this.anchors[index_] 
    }

    
    FlyToNextAnchor(){
        let rotation_ = this.GetCoinFaceDirection(this.turn_player_index)
        let position_ = this.GetCoinPosition(this.turn_player_index)

        this.turn_player_index = (this.turn_player_index + 1 ) % 2


        // this.coinMesh.rotation.x = rotation_
        // this.coinMesh.position.copy(position_)

        // gsap.timeline({ defaults: { duration: 0.5 } })
        //     .to(this.coinMesh.position, { ease: "sine.out", delay: 0.5, y: 2.5 })
        //     .to(this.coinMesh.position, { ease: "sine.in", y: 0.15 / 2 })



        gsap.timeline({ defaults: { duration: 0.15 } })
            .to(this.coinMesh.position, { ease: "sine.out", delay: 0.5, y: 3.5 })
            .to(this.coinMesh.position, { ease: "sine.in", y: 0.15 / 2 })


        gsap.to(this.coinMesh.position, {
            delay: 0.5, duration : 0.3, ease: "none", x : position_.x, z : position_.z
        })

        gsap.to(this.coinMesh.rotation, {
            delay: 0.6, duration: 0.2, ease: "none", x: rotation_
        })


    }


    Flip(firstPlayer, delay_){
        this.coinMesh.position.y = 0.15 / 2
        let rotation = this.GetCoinFaceDirection(firstPlayer)
        this.coinMesh.rotation.x = rotation

        let anim = gsap.timeline()
            .from(this.coinMesh.position,
                { delay: delay_, duration: 0.7, ease: "Power1.easeIn", y: 7,
                onStart: ()=>{ this.experience.sound.Play_FlipCoin() }
            })
            .from(this.coinMesh.position,
                { duration: 0.7, ease: "Power2.easeOut", z: 11.5 }, "<")
            .from(this.coinMesh.rotation,
                { duration: 0.7, ease: "none", x: Math.PI * 6 }, "<")

        gsap.to(this.coinMesh.position, { duration: 1, delay: 1.2 + delay_, onComplete: () => { this.FlyToNextAnchor() } })

        return anim
    }
}