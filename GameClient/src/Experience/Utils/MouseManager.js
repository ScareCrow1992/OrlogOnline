import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class MouseManager extends EventEmitter {
    constructor() {
        super()
        this.deltaTime = 0;

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera
        this.selectedObject = []
        // console.log(this.camera.instance)

        this.mouse = { x: 0, y: 0 };
        this.raycaster = new THREE.Raycaster()

        this.playerInteractableObjects = this.experience.world.playerInteractableObjects;

        this.currentHoveredObject;

        this.lastHoverredGameObject = null;

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
            // console.log(this.sizes);
            // console.log(event);
            // console.log(this.mouse)
            this.mousemove()
        })


        this.canvas.addEventListener('contextmenu', (e) => {
            // console.log(this.playerInteractableObjects);

            // console.log(this.lastHoverredGameObject);
            if (this.lastHoverredGameObject != null) {
                // console.log(this.lastHoverredGameObject.id);
                this.trigger("active_object", [this.lastHoverredGameObject.id]);
                this.trigger("contextmenu", [this.lastHoverredGameObject.id])
            }
            else {
                // console.log("null")
                this.trigger("deactive_objects");
            }

            e.preventDefault()
            // return false;
        }, false)




        this.canvas.addEventListener('click', () => {
            // console.log(this.playerInteractableObjects);

            // console.log(this.lastHoverredGameObject);
            if (this.lastHoverredGameObject != null) {
                // console.log(this.lastHoverredGameObject.id);
                this.trigger("select", [this.lastHoverredGameObject.id]);
            }
            else{
                this.trigger("empty")
            }

        })


        window.addEventListener("keydown", (event) => {
            // console.log(event.key)
            switch(event.key){
            case 'q':
                // this.trigger("button-push", [0])
                // console.log("botton-push : top")
                break;
            
            case 'w':
                // this.trigger("button-push", [1])
                // console.log("botton-push : bottom")
                break;
            
                
            case ' ':
                this.BellPush()
                break;
    

            }

            

        })

        window.addEventListener('touchstart', (evt) => {this.handleTouchStart(evt)}, false);
        window.addEventListener('touchmove', (evt) => {this.handleTouchMove(evt)}, false);

        this.xDown = null;
        this.yDown = null;

    }


    update(deltaTimes){
        this.deltaTime += deltaTimes
        if(this.deltaTime >= 50){
            this.mousemove()
            this.deltaTime = 0
        }


    }


    BellPush(forced = false){
        this.trigger("button-push", ["client", forced])
    }


    // getTouches(evt) {
    //     return evt.touches             // browser API
    // }

    handleTouchStart(evt) {
        const firstTouch = evt.touches[0]
        // console.log(firstTouch)
        this.xDown = firstTouch.clientX;
        this.yDown = firstTouch.clientY;
    };

    handleTouchMove(evt) {
        // console.log(`${this.xDown}, ${this.yDown}`)
        if (!this.xDown || !this.yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;

        if(Math.abs(xDiff) + Math.abs(yDiff) > 250){
            // console.log("swiped")
            this.trigger("button-push", ["client"]) 
            this.xDown = null;
            this.yDown = null;
        }

    };



    mousemove() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance);

        const intersects = this.raycaster.intersectObjects(this.playerInteractableObjects)
        this.selectedObject = [];

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                let detectedObj = intersects[i];
                if (detectedObj.object.id in this.experience.world.gameObjects) {
                    this.selectedObject.push(intersects[i].object);
                    break;
                }
            }
        }

        this.currentHoveredObject = this.selectedObject[0];
        // console.log(this.currentHoveredObject )

        if (this.lastHoverredGameObject != this.currentHoveredObject) {
            this.trigger("hover_off", [this.lastHoverredGameObject]);
            this.lastHoverredGameObject = this.currentHoveredObject
            // console.log(this.currentHoveredObject);
            if (this.currentHoveredObject !== undefined) {
                // 주사위, 신의 은총등의 여부에 따라 UI반응이 달라저야함.
                // 일단 UI 매니저에게 hovered된 유닛을 보내기만 하면 됨
                // 여기서는 테스트 코드부터 적어보자

                this.trigger("hover_on", [this.selectedObject, this.currentHoveredObject.id]);
            }
        }
    }

}