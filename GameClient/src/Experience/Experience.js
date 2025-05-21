
import * as THREE from 'three'


import Physics from './Physics.js'

import Debug from './Utils/Debug.js'
import Online from './Utils/Online.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'


import sources from './sources.js'
import godFavorsInfo from './godFavorsInfo.js'
import {godFavorsAction} from './godFavorsAction.js'
import godFavorsNotice from './godFavorsNotice.js'

import MouseManager from './Utils/MouseManager.js'
import InputAdmin from './InputAdmin.js'
import PostProcessor from './Utils/PostProcessor.js'
import Material from './Utils/Material.js'
import Geometry from './Utils/Geometry.js'
import Sound from './Utils/Sound.js'

// import Game from './Utils/Game.js'
// import Game from './Game/Game.js'


import UI from './UI.js'

import CurvedCube from './Geometries/CurvedCube.js'
import ModelDictionary from './World/Items/ModelDictionary.js'
import Controller from './World/Controller.js'
import Socket from './Socket.js'

// import {superVisor, RollPhase, GodFavorPhase, ResolutionPhase} from './Game/OfflineToolKit.js'

import Bluebird from './Bluebird.js'
import Redbird from './Redbird.js'
import LocalSocket from './LocalSocket.js'

// import Stats from 'three/addons/libs/stats.module.js';

import { gsap } from 'gsap'

import ClientDebugUI from './ClientDebugUI.js'

// import WebSocket from 'ws'

// import GetOutlineShape from './Factory/OutlineShapeCreator.js'

// GetOutlineShape("/textures/godfavor/ACV_Orlog_Odin.webp");

let instance = null
// let stats = new Stats();




export default class Experience {
    constructor(_canvas) {


        // document.body.appendChild(stats.dom)
        
        // gsap.ticker.lagSmoothing(false);
        // gsap.ticker.useRAF(false)

        // Singleton
        if (instance) {
            // console.log(instance)
            return instance
        }

        instance = this

        // Global access
        // window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.scene = new THREE.Scene()
        this.physics = new Physics()
        this.resources = new Resources(sources)
        this.godFavorsInfo = godFavorsInfo;
        this.godFavorsAction = godFavorsAction;
        this.godFavorsNotice = godFavorsNotice;
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.geometry = new Geometry()
        this.material = new Material()
        this.sound = new Sound()
        this.modelDictionary = new ModelDictionary()
        // console.log(this.material)
        this.controller = new Controller();
        this.world = new World()
        this.time = new Time()
        this.mouseManager = new MouseManager()
        this.postProcessor = new PostProcessor(this.renderer.instance)
        this.inputAdmin = new InputAdmin()
        this.controller.inputAdmin = this.inputAdmin
        
        this.redbird = new Redbird()

        this.curvedCube = new CurvedCube();

        // this.isScreenOn = false;

        window.OnlineMode = (socket_) => { this.OnlineMode(socket_) }

        this.resources.on('ready', () => {
            
            // setTimeout(() => {
            //     console.log(this.renderer.instance.info)
            // }, 5000);
            // this.renderer.instance.info.autoReset = false; 



            this.RegisterEventsOfGame()
            this.dbg_ui = new ClientDebugUI()
        })

        // this.resources.on('ready',()=>{
        //     // console.log("game instance is now created")
        //     this.online = new Online()
        //     if(this.online.active){
        //         this.online.webSocket.onerror = (event) =>{
        //             // console.log(event)
        //             this.OfflineMode()
        //         }
                
        //         this.online.webSocket.onopen = (event) =>{
        //             // console.log(event)
        //             // this.webSocket.send("Here's some text that the server is urgently awaiting!");
        //             console.log("socket connect is success!")
        //             this.OnlineMode()

        //         }

        //     }
        //     else {
        //         this.OfflineMode()
        //     }
        // })


        this.ui = new UI()
        this.controller.ui = this.ui

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', (deltaTime) => {
            // console.log(deltaTime)
            
            this.update(deltaTime)
        })

        this.mouseManager.on('hover_on', (mesh_obj, mesh_objID) => {
            // console.log('hover_on');
            // console.log(obj);
            // console.log(objID);
            // obj.Hovered()
            // console.log(obj)
            // obj.Hover_On()
            let hovered_instance = this.controller.__FindFromDictionary(mesh_objID)
            // console.log(hovered_instance)
            if (hovered_instance != null)
                hovered_instance.Hover_On()
            this.postProcessor.hover_on(mesh_obj);
            this.ui.hover_on(mesh_objID);
        })

        this.mouseManager.on('hover_off', (mesh_obj) => {
            // console.log('hover_off');

            if (mesh_obj) {
                let mesh_objID = mesh_obj.id
                let hovered_instance = this.controller.__FindFromDictionary(mesh_objID)
                if (hovered_instance != null)
                    hovered_instance.Hover_Off()
            }


            this.postProcessor.hover_off();
            this.ui.hover_off();
        })

        // this.mouseManager.on("deactive_objects", () => {
        //     // console.log("click on empty")
        //     // this.world.dices.forEach((dice)=>{
        //     //     // console.log(dice);
        //     //     dice.deactive();
        //     // })

        //     // this.world.gameObjects.deactive();
        //     // Object.values(this.world.gameObjects).forEach(gameObj => {
        //     //     gameObj.deactive();
        //     // })

        // })


        // this.mouseManager.on("active_object", (clickedObject) => {
        //     // 이전에 활성화된 오브젝트는 비활성화 해야한다.
        //     // this.mouseManager.trigger("deactive_objects");
        //     // console.log(clickedObject);

        //     this.world.gameObjects[clickedObject].active();
        // })


        this.mouseManager.on("empty", (clickedObject) => {
            this.ui.emptyclick();
        })



        // window.addEventListener("keydown", (event) => {
        //     if (event.key == "j") {


        //         this.redbird.MessageEnqueue(
        //             "BellPushed",
        //             ["client",
        //                 { user: "client", godfavors: [0, 1, 2] }, "roll",
        //                 [
        //                     {
        //                         "dicesState": null,
        //                         health: 15,
        //                         token: 5
        //                     }, {
        //                         "dicesState": null,
        //                         health: 15,
        //                         token: 10
        //                     }
        //                 ]])
        //     }

        // })

    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
        this.postProcessor.resize();
        this.ui.resize();
    }

    update(deltaTime) {
        // console.log(this.unrealBloomComposer.materials)
        // this.world.update(deltaTime)
        this.ui.update();
        // this.renderer.update()
        // console.log(window.screen_mode)
        
        if (document.visibilityState == "visible")
            this.postProcessor.update()
        // console.log(this.unrealBloomComposer.materials)
        // this.unrealBloomComposer.render();

        // this.physicsWorld.update();
        // this.physics.update();
        // this.game.update()
        this.controller.update()
        // stats.update()

        this.mouseManager.update(deltaTime)


        this.material.Update(deltaTime)

    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')
        this.mouseManager.off('hover_on')
        this.mouseManager.off('hover_off')
        this.mouseManager.off('deactive_objects')
        this.mouseManager.off('active_object')


        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }


    GameOver(){
        this.time.GameOver()
        setTimeout(()=>{
            // this.socket.SetState("waiting")
            this.redSocket.SetState("waiting")
            window.BlackOn()
            .then(()=>{
                // console.log("screen off")
                window.GameScreenOff()
                window.BlackOff()
                // this.isScreenOn = false
            })
        }, 7000)
    }


    Surrender(){
        this.redbird.MessageEnqueue("Surrender", [])
    }


    OfflineMode(){

        // console.log("offline mode")


        this.redbird = new Redbird()
        this.bluebird = new Bluebird()

        this.redSocket = new LocalSocket()
        this.blueSocket = new LocalSocket()
        
        this.redSocket.othersocket = this.blueSocket
        this.redSocket.partnerbird = this.redbird

        this.blueSocket.othersocket = this.redSocket
        this.blueSocket.partnerbird = this.bluebird

        this.redbird.socket = this.redSocket
        this.bluebird.socket = this.blueSocket
        
        this.redbird.controller = this.controller
        // this.game = new Game(this.bluebird, this.debug);
        this.bluebird.game = this.game

        this.RegisterEventsOfGame()



        this.orangebird = new Redbird()


    }


    OnlineMode(socket_) {
        
        this.online = {
            active : true
        }

        this.redSocket = socket_

        this.redbird.socket = this.redSocket
        this.redSocket.partnerbird = this.redbird
        this.redbird.controller = this.controller


        window.BlackOn()
        setTimeout(() => {
            // console.log("screen on")
            // this.isScreenOn = true
            window.GameScreenOn()
            window.BlackOff()
            setTimeout(() => { this.controller.state = true; }, 1500)

        }, 2500)



        // this.online = new Online()
        // this.online.Connect_SocketServer(url)
        //     .addEventListener("open", (event) => {
        //         this.redbird = new Redbird()
        //         this.redSocket = new Socket(this.online)


        //         // let promise = window.BlackOn()
        //         // promise.then(() => {
        //         //     window.GameScreenOn()
        //         //     window.BlackOff().then(() => { this.controller.state = true; })
        //         // })

        //         window.BlackOn()
        //         setTimeout(() => {
        //             console.log("screen on")
        //             // this.isScreenOn = true
        //             window.GameScreenOn()
        //             window.BlackOff()
        //             setTimeout(() => { this.controller.state = true; }, 1500)

        //         }, 2500)


        //         this.redbird.socket = this.redSocket
        //         this.redSocket.partnerbird = this.redbird

        //         this.redbird.controller = this.controller

        //         // this.game = new Game(this.bluebird, this.debug);


        //     })
    }


    // OnlineMode_() {

    //     // console.log("online mode")
    //     this.redbird = new Redbird()
    //     this.socket = new Socket(this.online)
    //     this.redbird.socket = this.socket

    //     // console.log(this.game)
    //     this.RegisterEventsOfGame()
    // }


    ProposeDoubleGame(){
        this.inputAdmin.ProposeDoubleGame()
    }


    BellPush(user, param) {

        let phase = this.controller.GetPhase()
        if (phase == "godfavor") {
            this.controller.avatars["bottom"].HealthStonesInteractOff()
            this.ui.showDescription("Waiting for opponent")
        }

        // this.inputAdmin.TurnOnAmbigious()
        this.inputAdmin.BellPush(user, param)
        // this.redbird.MessageEnqueue("BellPushed", [user, param, this.controller.GetPhase(), this.controller.GetAvatarsInfo()])
    }

    SendCheck(){
        this.redbird.MessageEnqueue("CheckReady", []);
    }

    BellPush_Liberty(player, forced){
        let chosenCardsIndex = []

        let user = this.controller.avatars.bottom.index
        this.controller.godFavorCardsState.forEach((state, cardIndex) => {
            if (state == "chosen")
                chosenCardsIndex.push(cardIndex)
        })

        if (forced) {
            this.BellPush(player, { user: user, godfavors: chosenCardsIndex })
            return
        }


        if (player == this.controller.avatars.bottom.index) {
            this.BellPush(player, { user: player, godfavors: chosenCardsIndex })
        }
        else if (player == "client") {
            // chosenCardsIndex = [0, 15.5, 16]
            if (chosenCardsIndex.length == 3){
                this.BellPush(player, { user: user, godfavors: chosenCardsIndex })
                this.ui.showDescription("Waiting opponent's choice")
            }
            else
                this.ui.showAlertDuration("Select not completed.", 2)

        }
        else
            this.BellPush(player, { user: player, godfavors: [player * 3, player * 3 + 1, player * 3 + 2] })
    }


    BellPush_Draft(forced) {
        // console.log("[[ bell pushed ]]")
        // console.log(forced)
        let picked_card = this.controller.picked_card
        let banned_card = this.controller.banned_card

        let pick_ = picked_card.authorization ? picked_card.index : null
        let ban_ = banned_card.authorization ? banned_card.index : null

        if(forced){
            this.BellPush("client", { pick: pick_, ban: ban_ })
            picked_card.authorization = false
            banned_card.authorization = false

            return;
        }

        // console.log(picked_card)
        // console.log(banned_card)

        if ((picked_card.authorization && picked_card.index == -1)
            || (banned_card.authorization && banned_card.index == -1)) {
            // this.inputAdmin.Trigger({
            //     trigger: "Draft",
            //     user: "bottom"
            // })

            this.ui.showAlertDuration("Ban & pick not completed.", 2)
        }
        else{
            this.BellPush("client", { pick: pick_, ban: ban_ })
            picked_card.authorization = false
            banned_card.authorization = false
        }


    }



    ClickHealthStone(avatar, index, objinfo){

        objinfo.index = this.controller.avatars[avatar].health - index

        this.BellPush(avatar, objinfo)
        this.controller.avatars[avatar].HealthStonesInteractOff()

    }


    // ClickDoubleCube(){
    //     // let double_cube = this.controller.double_cube
    //     // console.log(double_cube)

    // }



    RegisterEventsOfGame() {
        this.mouseManager.on("button-push", (player, forced) => {
            // console.log(player)
            let phase = this.controller.GetPhase()
            switch (phase) {
                case "cardselect":
                    let game_mode = this.controller.game_mode

                    if(game_mode === "liberty")
                        this.BellPush_Liberty(player, forced)
                    else if(game_mode === "draft")
                        this.BellPush_Draft(forced)
                    break;


                default:

                    this.BellPush(player, null)
                    break;

            }

        })

        this.mouseManager.on("select", (clickedObject) => {
            let obj = this.world.gameObjects[`${clickedObject}`]
            let ret = this.inputAdmin.ObjectSelected(obj, false)
            // console.log(ret)
            if(ret){
                switch(ret.type){
                    case "healthstone":
                        this.ClickHealthStone(ret.avatar, ret.index, ret)
                        break;

                    case "doublecube":
                        // this.ClickDoubleCube()
                        break;
                }
            }

            // console.log(selection)
        })


        this.mouseManager.on("contextmenu", (clickedObject)=>{
            let obj = this.world.gameObjects[`${clickedObject}`]
            this.inputAdmin.ObjectSelected(obj, true)

        })


        this.ui.on("god_favor_action", (godFavorIndex, level, avatar, info)=>{
            // extrainput이 없을 경우

            this.controller.avatars["bottom"].godFavors[godFavorIndex].Highlight_On()
            this.ui.emptyclick()
            this.ui.hideDescription()

            if(info.extraInput){
                // console.log("this power need godfavor info")
                // console.log(info)

                new Promise(res=>{
                    setTimeout(()=>{res(true)},700)
                }).then(()=>{
                    this.controller.SetExtraPickedDiceCnt(info.effectValue[level])
                    this.inputAdmin.TmpStorageInputInfo(godFavorIndex, level)
                    this.controller.EnableExtraInputDice(info.extraInput)
                })

            }
            else{
                this.BellPush(avatar, {godFavorIndex : godFavorIndex, level: level})
                // this.ui.GodFavorPowerUI_Deactivate()
                this.ui.emptyclick()
    

            }




            // extrainput이 있을 경우

        })

        // this.game.on("GodFavorPhaseOn", ()=>{

        //     this.ui.godFavorPhaseOn("GodFavor")
        // })

        // // this.world.turnEndButton.on("turnEnd", (turn) => {
        // //     // this.game.changeTurn(turn);
        // //     console.log(turn);
        // // })

        // this.game.on("initial-game", (text, duration, first)=>{
        //     this.world.flipCoin.Flip(first)
        //     setTimeout(()=>{this.ui.viewDescriptionDuration(text, duration)}, 1000) 
            
        // })

        // this.game.on("old-phase-end", (phase)=>{
        //     this.ui.phaseEnd(phase)
        // })

        // this.game.on("new-phase-start", (phase)=>{
        //     this.ui.phaseStart(phase)
        // })
        
        
        // this.mouseManager.on("button-push", player => {
        //     this.socket.BellPushed(player)
            
        // })

        // this.mouseManager.on("select", (clickedObject) => {
        //     let obj = this.world.gameObjects[`${clickedObject}`]
        //     if(obj != null && obj != undefined){
        //         this.socket.objectSelected(obj)
        //     }
        // })



        // this.socket.on("GodFavorPhaseOn", ()=>{
        //     console.log("GodFavorPhaseOn - triggered")
        // })
        

        // this.socket.on("initial-game", (text, duration, first)=>{            
        //     console.log("initial-game - triggered" + ` [${text} ${duration} ${forst}]`)

        // })


        // this.socket.on("old-phase-end", (phase)=>{
        //     console.log("old-phase-end - triggered" + `[${phase}]`)
        // })

        // this.socket.on("new-phase-start", (phase)=>{
        //     console.log("initial-game - triggered" + `[${phase}]`)
        // })


    }


}