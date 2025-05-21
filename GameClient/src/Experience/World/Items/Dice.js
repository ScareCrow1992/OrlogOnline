import * as THREE from 'three'
import Experience from '../../Experience.js'
import DiceMesh from './DiceMesh.js'
// import DiceFace from './DiceFace.js'

// controller
export default class Dice {
    constructor(faceInfo, diceType = "weapon") {
        this.experience = new Experience()
        this.diceType = diceType
        this.mesh = new DiceMesh(faceInfo, diceType)
        this.debug = this.experience.debug

        
        this.setDebug()
        this.isReadyToAction = false;


        this.positionForUndo = new THREE.Vector3();
        this.state = "tray" // "tray" "chosen" "waiting"

    }


    GameOver(){
        this.mesh.GameOver()
    }

    
    InitialGame(){
        this.state = 'tray';

    }


    Hover_On(){
        this.experience.sound.Play_DiceHover()

    }

    Hover_Off(){

    }

    ResetRound(){
        this.isReadyToAction = false;
        this.state = "tray"
    }

    // MoveSound(){
    //     this.experience.sound.Play_DiceMove()
    // }

    MoveToAction(pos, height){
        // this.MoveSound()

        let promise
        if(this.isReadyToAction)
            promise =  this.mesh.fly(pos, 0.5, 0.5, 0.5)
        else
            promise =  this.mesh.fly(pos, 0.7, 3 + 0.7 * height, 0.5)

        this.isReadyToAction = true
        return promise
    }


    DiceToActionEnd(pos){
        // this.MoveSound()
        
        return this.mesh.fly(pos, 0.4, 4, 0.3)

    }

    DiceToWaiting(pos){
        // this.MoveSound()
        
        this.state = "waiting"
        return this.mesh.fly(pos, 0.4, 3, 0.2)
        
    }

    clicked(){
        this.Choise()
    }


    GetDiceState(){
        return this.state
    }


    WeaponDecrease(cnt) {
        this.mesh.WeaponDecrease(cnt)
    }


    ChooseDice(pos, phase) {
        // console.log(phase)
        this.positionForUndo.copy(this.mesh.getPosition())
        switch (phase) {
            case "roll":
                // this.MoveSound()
                this.state = "chosen"
                return this.mesh.fly(pos, 0.3, 3)
                break;

            case "godfavor":
                // this.MoveSound()
                this.state = "levitation"
                return this.mesh.fly(pos, 0.3, 3)
                break;

        }

    }

    CancleDice(phase) {
        switch (phase) {
            case "roll":
                this.state = "tray"
                break;

            case "godfavor":
                this.state = "waiting"
                break;

        }
        // this.MoveSound()
        return this.mesh.fly(this.positionForUndo, 0.3, 3)
    }


    Withdraw(diceStartAnchor){
        this.mesh.Withdraw(diceStartAnchor)
    }


    Roll(dir, transformLog, diceStartAnchor){
        this.isReadyToAction = false
        this.positionForUndo.copy(transformLog[transformLog.length - 1].position)
        return this.mesh.Roll(dir,transformLog, diceStartAnchor)
        // prom.then((resolve)=>{console.log(resolve)})
    }

    // Roll(position, dir, rotation, anchor){
    //     this.positionForUndo.copy(position)
    //     this.mesh.Roll(position, dir, rotation, anchor)
    //     // this.Retrieve(anchor)
    //     // this.Throw(position, dir, rotation)
    // }


    TokenMark_Hightlight_On(){
        this.mesh.TokenMark_Hightlight_On()
    }

    TokenMark_Hightlight_Off(){
        this.mesh.TokenMark_Hightlight_Off()
    }

    PhysicsRoll(){
        this.mesh.PhysicsRoll()
    }

    active() {
        if (this.debug.active)
            this.debugFolder.show();
    }

    deactive() {
        if (this.debug.active)
            this.debugFolder.hide();
    }

    Highlighting_Mark(color, duration){
        return this.mesh.Highlighting_Mark(color, duration)
    }

    ConvertDiceMark(cnt, weaponName, color, transforms){
        return this.mesh.ConvertDiceMark(cnt, weaponName, color, transforms)
    }


    DecreaseDiceMark(cnt, color){
        return this.mesh.DecreaseDiceMark(cnt, color)

    }

    setRotationForUp(dir){
        this.mesh.setRotationForUp(dir)
    }


    Organize(sign){
        let pos_ = this.mesh.getPosition().clone()
        pos_.z = 13.25 * sign

        this.setPosition(pos_)

    }


    Setup(sign){
        let pos_ = this.mesh.getPosition().clone()
        pos_.z = 9.25 * sign

        this.setPosition(pos_)
    }



    setPosition(pos){
        this.mesh.setPosition(pos)
    }

    getWeapon(){
        return this.mesh.getWeapon()
    }

    getPosition(){
        return this.mesh.getPosition()
    }

    getMarks(){
        return [...this.mesh.getMarks()]
    }

    getUpFace(){
        return this.mesh.getUpFace()
    }

    getUpDir(){
        return this.mesh.getUpVector()
    }

    getFaces(){
        return this.mesh.getFaces()
    }

    isToken(){
        return this.mesh.isToken()
    }

    getID(){
        return this.mesh.getID()
    }

    _DBG_setFaceColor(){
        this.mesh._DBG_setFaceColor()
    }

    _DBG_resetFaceColor(){
        this.mesh._DBG_resetFaceColor()
    }

    setDiceMaterialColor(color){
        this.mesh.setDiceMaterialColor(color)
    }

    resetDiceMaterialColor(){
        this.mesh.resetDiceMaterialColor()
    }


    setDebug(){
        if (this.debug.active){

            this.dummy = 5;

            this.debugFolder = this.debug.ui.addFolder(`dice ${this.mesh.id}`);

            this.debugFolder.add(this, "dummy",{
                "+x : " :()=>{this.setRotationForUp("right")},
                "-x : " :()=>{this.setRotationForUp("left")},
                "+y : " :()=>{this.setRotationForUp("top")},
                "-y : " :()=>{this.setRotationForUp("bottom")},
                "+z : " :()=>{this.setRotationForUp("front")},
                "-z : " :()=>{this.setRotationForUp("back")}
            })
            .onChange((func)=>{func()})


            

            
            this.debugFolder.hide();
        }

    }


    Disappear(){
        this.mesh.Disappear()
    }


    update(deltaTime){
        this.mesh.update(deltaTime)
    }

}