import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

import gsap from 'gsap';


export default class Sound extends EventEmitter {

    constructor() {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance

        this.dice_roll_index = 0
        this.dice_roll = []

        this.pingpong = undefined

        this.bgm_played = false

        // create a global audio source

        // listener.context.resume().then(()=>{console.log("hello")})
        // sound.context.resume().then(()=>{console.log("world")})

        this.bgm = {
            mute : false,
            volume : 1.0
        }

        this.sfx = {
            mute : false,
            volume : 1.0
        }
        


        this.resources.on('ready', () => {
            this.listener = new THREE.AudioListener();
            this.camera.add(this.listener);
            this.Background_Music = new THREE.Audio(this.listener);
            this.Background_Music.setBuffer(this.resources.items.bgm);

            this.pingpong = new THREE.Audio(this.listener)
            this.pingpong.setBuffer(this.resources.items["examples_sounds_ping_pong"])
            this.pingpong.setLoop(false)
            this.pingpong.setVolume(1.0)


            for (let i = 0; i < 6; i++) {
                let tmp_sound = new THREE.Audio(this.listener)
                tmp_sound.setBuffer(this.resources.items[`dice_roll_${i}`])
                tmp_sound.setLoop(false)
                tmp_sound.setVolume(1.0)
                this.dice_roll.push(tmp_sound)
            }


            this.flip_coin = new THREE.Audio(this.listener)
            this.flip_coin.setBuffer(this.resources.items["coinflip"])
            this.flip_coin.setLoop(false)
            // this.flip_coin.setVolume(1.0)
            // this.flip_coin.offset = 0.13

            // window.flip_coin = this.flip_coin


            this.token_effect = new THREE.Audio(this.listener)
            this.token_effect.setBuffer(this.resources.items["token_sound_effect"])
            this.token_effect.setLoop(false)


            this.axe_throw = new THREE.Audio(this.listener)
            this.axe_throw.setBuffer(this.resources.items["axe_throw"])
            this.axe_throw.setLoop(false)

            this.axe_damage =
                [new THREE.Audio(this.listener), new THREE.Audio(this.listener)]
            this.axe_damage[0].setBuffer(this.resources.items["axe_damage_0"])
            this.axe_damage[1].setBuffer(this.resources.items["axe_damage_1"])
            this.axe_damage.forEach(audio_ => {
                audio_.setLoop(false)
            })
            this.axe_damage.index__ = 0
            this.axe_damage.date__ = Date.now()


            this.axe_block = 
                [ new THREE.Audio(this.listener), new THREE.Audio(this.listener) ]
            this.axe_block[0].setBuffer(this.resources.items["axe_block_0"])
            this.axe_block[1].setBuffer(this.resources.items["axe_block_1"])
            this.axe_block.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.axe_block.index__ = 0
            this.axe_block.date__ = Date.now()
            
            this.arrow_shot = new THREE.Audio(this.listener)
            this.arrow_shot.setBuffer(this.resources.items["arrow_shot_0"])
            this.arrow_shot.setLoop(false)
            this.arrow_shot.offset = 0.04

            this.arrow_damage = new THREE.Audio(this.listener)
            this.arrow_damage.setBuffer(this.resources.items["arrow_damage"])
            this.arrow_damage.setLoop(false)

            this.arrow_block = new THREE.Audio(this.listener)
            this.arrow_block.setBuffer(this.resources.items["arrow_block_1"])
            this.arrow_block.setLoop(false)


            this.stone_shed = [ new THREE.Audio(this.listener), new THREE.Audio(this.listener) ]
            this.stone_shed[0].setBuffer(this.resources.items["stone_shed_2"])
            this.stone_shed[1].setBuffer(this.resources.items["stone_shed_3"])
            this.stone_shed.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.stone_shed.index__ = 0
            this.stone_shed.date__ = Date.now()


            this.create_token = new THREE.Audio(this.listener)
            this.create_token.setBuffer(this.resources.items["create_token"])
            this.create_token.setLoop(false)


            

            this.steal_token = [ new THREE.Audio(this.listener),  new THREE.Audio(this.listener) ]
            this.steal_token[0].setBuffer(this.resources.items["steal_token_0"])
            // this.steal_token[1].setBuffer(this.resources.items["steal_token_1"])
            this.steal_token[1].setBuffer(this.resources.items["steal_token_2"])
            this.steal_token.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.steal_token.index__ = 0
            this.steal_token.date__ = Date.now()


            this.dice_hover = [
                new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener)
            ]
            this.dice_hover[0].setBuffer(this.resources.items["dice_hover_0"])
            this.dice_hover[1].setBuffer(this.resources.items["dice_hover_1"])
            this.dice_hover[2].setBuffer(this.resources.items["dice_hover_2"])
            this.dice_hover[3].setBuffer(this.resources.items["dice_hover_3"])
            this.dice_hover[4].setBuffer(this.resources.items["dice_hover_4"])
            this.dice_hover[5].setBuffer(this.resources.items["dice_hover_5"])
            this.dice_hover.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.dice_hover.index__ = 0


            this.dice_move = [
                new THREE.Audio(this.listener), new THREE.Audio(this.listener)
            ]
            this.dice_move[0].setBuffer(this.resources.items["dice_move_0"])
            this.dice_move[1].setBuffer(this.resources.items["dice_move_1"])
            this.dice_move.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.dice_move.index__ = 0
            this.dice_move.data__ = Date.now()
            
            
            this.dice_take = [
                new THREE.Audio(this.listener), new THREE.Audio(this.listener)
            ]
            this.dice_take[0].setBuffer(this.resources.items["dice_take_0"])
            this.dice_take[1].setBuffer(this.resources.items["dice_take_1"])
            this.dice_take.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.dice_take.index__ = 0
            this.dice_take.date__ = Date.now()


            this.group_roll = [
                new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener), new THREE.Audio(this.listener)
            ]
            this.group_roll[0].setBuffer(this.resources.items["group_roll_0"])
            this.group_roll[1].setBuffer(this.resources.items["group_roll_1"])
            this.group_roll[2].setBuffer(this.resources.items["group_roll_2"])
            this.group_roll[3].setBuffer(this.resources.items["group_roll_3"])
            this.group_roll[4].setBuffer(this.resources.items["group_roll_4"])
            this.group_roll[5].setBuffer(this.resources.items["group_roll_5"])
            this.group_roll.forEach(audio_=>{
                audio_.setLoop(false)
            })
            this.group_roll.index__ = 0
            this.group_roll.date__ = Date.now()



            this.godfavor_power = [new THREE.Audio(this.listener), new THREE.Audio(this.listener)]
            this.godfavor_power.forEach(audio_=>{
                audio_.setBuffer(this.resources.items["godfavor_power"])
                audio_.setLoop(false)
            })
            this.godfavor_power.index__ = 0
            // this.godfavor_power.setBuffer(this.resources.items["godfavor_power"])
            // this.godfavor_power.setLoop(false)

            
            this.sound_thor = [new THREE.Audio(this.listener), new THREE.Audio(this.listener)]
            this.sound_thor.forEach(audio_ => {
                audio_.setBuffer(this.resources.items["sound_thor"])
                audio_.setLoop(false)
            })
            this.sound_thor.index__ = 0


            this.sound_victory = new THREE.Audio(this.listener)
            this.sound_victory.setBuffer(this.resources.items["Victory"])
            this.sound_victory.setLoop(false)



        
            this.card_landing = new THREE.Audio(this.listener)
            this.card_landing.setBuffer(this.resources.items["card_sound_landing"])
            this.card_landing.setLoop(false)

            this.card_take = new THREE.Audio(this.listener)
            this.card_take.setBuffer(this.resources.items["card_sound_take"])
            this.card_take.setLoop(false)

            this.card_throw = new THREE.Audio(this.listener)
            this.card_throw.setBuffer(this.resources.items["card_sound_throw"])
            this.card_throw.setLoop(false)



            

            // window.addEventListener("keydown", (event) => {
            //     if (event.key == "z") {
            //         this.axe_damage[0].offset -= 0.001
            //         console.log(this.axe_damage[0].offset)

            //         // this.Play_AxeThrow()
            //         // this.bgm.setVolume(0.5);
            //         // this.dice_roll.forEach(sound_=> sound_.setVolume(1.0))
            //         // this.dice_rolling.setVolume(0.5)
            //     }

            //     if(event.key == "x"){
            //         this.axe_damage[0].offset += 0.001
            //         console.log(this.axe_damage[0].offset)


            //         // this.Play_AxeBlock()
            //     }

            //     if(event.key === "c")
            //         this.Play_AxeDamage()

            //     if(event.key === "v")
            //         this.Play_SoundThor()

            //     if(event.key === "b")
            //         this.Play_GodfavorPower()


            //     if (event.key == "a")
            //         this.Play_ArrowThrow()

            //     if (event.key == "s")
            //         this.Play_ArrowBlock()

            //     if (event.key == "d")
            //         this.Play_ArrowDamage()

            //     if(event.key == "f")
            //         this.Play_StoneShed()

            //     if(event.key == "q")
            //         this.Play_CreateToken()

            //     if(event.key == "w")
            //         this.Play_StealToken()



            // })


            // window.addEventListener("keydown", (event)=>{
            //     if (event.key == "z") {
            //         this.PlayBGM()
            //         // this.bgm.setVolume(0.5);
            //         // this.dice_roll.forEach(sound_=> sound_.setVolume(1.0))
            //         // this.dice_rolling.setVolume(0.5)
            //     }


            // window.addEventListener("keydown", (event)=>{
            //     if (event.key == "z") {
            //         this.PlayBGM()
            //         // this.bgm.setVolume(0.5);
            //         // this.dice_roll.forEach(sound_=> sound_.setVolume(1.0))
            //         // this.dice_rolling.setVolume(0.5)
            //     }
            //     else if(event.key == 'x'){
            //         this.StopBGM()
            //         // this.bgm.setVolume(0.0);
            //         // this.dice_roll.forEach(sound_=> sound_.setVolume(0.0))
            //         // this.dice_rolling.setVolume(0.0)
            //     }
            //     else if (event.key == 'v'){
            //         // this.dice_roll[0].currentTime = 0.0
            //         this.pingpong.play(0.0)
            //         console.log(this.pingpong.context.baseLatency)
            //         console.log(this.pingpong.context.outputLatency)
            //         // this.dice_roll[0].play(0.0)
            //     }
            //     else if (event.key == "b"){
            //         this.Play_CardLanding()
            //         // this.flip_coin.currentTime = 0.25

            //         // this.dice_roll[0].currentTime = 0.15
            //         // this.dice_roll[0].play(0.0)
            //         // console.log(this.dice_roll[0].context.baseLatency)
            //         // console.log(this.dice_roll[0].context.outputLatency)

            //     }
            //     else if (event.key == "n"){
            //         this.Play_CardTake()

            //         // gsap.to(this.token_effect)


            //         // this.flip_coin.currentTime = 0.25

            //         // this.dice_roll[0].currentTime = 0.15
            //         // this.dice_roll[0].play(0.0)
            //         // console.log(this.dice_roll[0].context.baseLatency)
            //         // console.log(this.dice_roll[0].context.outputLatency)

            //     }
            //     else if (event.key == "m"){
            //         this.Play_CardThrow()

            //         // gsap.to(this.token_effect)


            //         // this.flip_coin.currentTime = 0.25

            //         // this.dice_roll[0].currentTime = 0.15
            //         // this.dice_roll[0].play(0.0)
            //         // console.log(this.dice_roll[0].context.baseLatency)
            //         // console.log(this.dice_roll[0].context.outputLatency)

            //     }
    
            // })

            // this.dice_rolling.play();
        })


        // this.resources.on('ready', () => {

        //     window.addEventListener("mouseup", () => {
        //         if (this.isOn == false) {
        //             this.isOn = true;
        //             bgm.autoplay = true;



        //             this.dice_rolling.setBuffer(this.resources.items["dice-rolling"])
        //             this.dice_rolling.setLoop(false);
        //             this.dice_rolling.setVolume(1.0);
        //             // this.dice_rolling.play();

        //         }
        //     })

        //     // sound.resume()

        // })
    }


    // property = { bgm, sfx }
    BGM_Toggle(){
        this.bgm.mute = !this.bgm.mute
        this.Background_Music.setVolume(this.Get_BGM_Volume());
        return this.bgm.mute
    }


    // property = { bgm, sfx }
    BGM_Set(value){
        this.bgm.volume = value / 100

        this.Background_Music.setVolume(this.Get_BGM_Volume());

    }


    

    // property = { bgm, sfx }
    SFX_Toggle(){
        this.sfx.mute = !this.sfx.mute
        return this.sfx.mute
    }


    // property = { bgm, sfx }
    SFX_Set(value){
        this.sfx.volume = value / 100

    }


    Get_BGM_Volume(){
        return (!this.bgm.mute) * this.bgm.volume * 0.75

    }

    Get_SFX_Volume(default_){
        let weight_ = 0
        if(window.screen_mode == "game")
            weight_ = 1
        else
            weight_ = 0

        return default_ * (!this.sfx.mute) * this.sfx.volume * 0.5 * weight_
    }



    Play_FlipCoin(){
        this.flip_coin.setVolume(this.Get_SFX_Volume(1.0))
        this.flip_coin.play(0.0)
    }


    Play_TokenEffect(){
        this.token_effect.setVolume(this.Get_SFX_Volume(0.4))
        this.token_effect.play(0.0)
    }


    Play_AxeThrow(){
        this.axe_throw.setVolume(this.Get_SFX_Volume(0.8))
        this.axe_throw.play(0.0)

    }

    Play_AxeDamage(){
        if(Date.now() - this.axe_damage.date__ < 500){
            return;
        }
        this.axe_damage.date__ = Date.now()
        
        let index__ = this.axe_damage.index__
        
        // if(index__ == 0){
        this.axe_damage[index__].offset = 0.1
        // }

        this.axe_damage[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.axe_damage[index__].play(0.0)

        this.axe_damage.index__++
        if(this.axe_damage.index__ == this.axe_damage.length){
            this.axe_damage.index__ = 0
        }

    }

    
    Play_AxeBlock(){
        if(Date.now() - this.axe_block.date__ < 500){
            return;
        }
        this.axe_block.date__ = Date.now()

        let index__ = this.axe_block.index__

        this.axe_block[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.axe_block[index__].play(0.0)

        this.axe_block.index__++
        if(this.axe_block.index__ == this.axe_block.length){
            this.axe_block.index__ = 0
        }

        // this.axe_block.index__ = 0

    }


    
    Play_ArrowThrow(){
        this.arrow_shot.setVolume(this.Get_SFX_Volume(1.0))
        this.arrow_shot.play(0.0)

    }

    Play_ArrowDamage(){
        this.arrow_damage.setVolume(this.Get_SFX_Volume(1.0))
        this.arrow_damage.play(0.0)

    }

    
    Play_ArrowBlock(){
        this.arrow_block.setVolume(this.Get_SFX_Volume(1.0))
        this.arrow_block.play(0.0)
    }


    Play_StoneShed(){
        if(Date.now() - this.stone_shed.date__ < 500){
            return;
        }
        this.stone_shed.date__ = Date.now()

        let index__ = this.stone_shed.index__

        this.stone_shed[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.stone_shed[index__].play(0.15)

        this.stone_shed.index__++
        if(this.stone_shed.index__ == this.stone_shed.length){
            this.stone_shed.index__ = 0
        }
    }


    Play_CreateToken(){
        this.create_token.setVolume(this.Get_SFX_Volume(1.0))
        this.create_token.play(0.0)

    }

    
    Play_StealToken(){
        if(Date.now() - this.steal_token.date__ < 500){
            return;
        }
        this.steal_token.date__ = Date.now()

        let index__ = this.steal_token.index__

        if(index__ == 0)
            this.steal_token[index__].setVolume(this.Get_SFX_Volume(0.85))
        else
            this.steal_token[index__].setVolume(this.Get_SFX_Volume(1.4))

        this.steal_token[index__].play(0.0)

        this.steal_token.index__++
        if(this.steal_token.index__ == this.steal_token.length){
            this.steal_token.index__ = 0
        }
    }


    Play_DiceHover(){
        let index__ = this.dice_hover.index__

        this.dice_hover[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.dice_hover[index__].play(0.0)

        this.dice_hover.index__++
        if(this.dice_hover.index__ == this.dice_hover.length){
            this.dice_hover.index__ = 0
        }
    }


    Play_DiceMove(){
        if(Date.now() - this.dice_move.date__ < 120){
            return;
        }
        this.dice_move.date__ = Date.now()

        let index__ = this.dice_move.index__

        this.dice_move[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.dice_move[index__].play(0.0)

        this.dice_move.index__++
        if(this.dice_move.index__ == this.dice_move.length){
            this.dice_move.index__ = 0
        }
    }



    Play_DiceTake(){
        // console.log("Play_DiceTake")
        // console.log(Date.now() - this.dice_take.date__)
        if(Date.now() - this.dice_take.date__ < 120){
            return;
        }
        this.dice_take.date__ = Date.now()

        let index__ = this.dice_take.index__

        this.dice_take[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.dice_take[index__].play(0.0)

        this.dice_take.index__++
        if(this.dice_take.index__ == this.dice_take.length){
            this.dice_take.index__ = 0
        }
    }


    Play_GroupRoll(){
        // group_roll
        
        if(Date.now() - this.group_roll.date__ < 1500){
            return;
        }
        this.group_roll.date__ = Date.now()

        let index__ = this.group_roll.index__

        this.group_roll[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.group_roll[index__].play(0.0)

        this.group_roll.index__++
        if(this.group_roll.index__ == this.group_roll.length){
            this.group_roll.index__ = 0
        }

    }


    Play_Victory(){
        this.sound_victory.setVolume(this.Get_SFX_Volume(1.0))
        this.sound_victory.play(0.0)
    }




    // Play_HelmetGuard(){
    //     this.helmet_guard.setVolume(this.Get_SFX_Volume(0.5))
    //     this.helmet_guard.play(0.0)
    // }



    // Play_ShieldGuard(){
    //     this.shield_guard.setVolume(this.Get_SFX_Volume(1.0))
    //     this.shield_guard.play(0.0)
    // }
    

    Play_CardLanding(){
        this.card_landing.setVolume(this.Get_SFX_Volume(1.0))
        this.card_landing.play(0.0)
    }

    
    Play_CardTake(){
        this.card_take.setVolume(this.Get_SFX_Volume(1.0))
        this.card_take.play(0.0)
    }

    
    Play_CardThrow(){
        this.card_throw.setVolume(this.Get_SFX_Volume(1.0))
        this.card_throw.play(0.0)
    }


    Play_GodfavorPower(){
        let index__ = this.godfavor_power.index__

        this.godfavor_power[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.godfavor_power[index__].play(0.0)

        this.godfavor_power.index__++
        if(this.godfavor_power.index__ == this.godfavor_power.length){
            this.godfavor_power.index__ = 0
        }
    }


    Play_SoundThor(){
        let index__ = this.sound_thor.index__

        this.sound_thor[index__].setVolume(this.Get_SFX_Volume(1.0))
        this.sound_thor[index__].play(0.0)

        this.sound_thor.index__++
        if(this.sound_thor.index__ == this.sound_thor.length){
            this.sound_thor.index__ = 0
        }
    }



    AddSoundBuffer_Dice(name, instance, volume_){
        let sound_ = new THREE.Audio(this.listener)

        
        // sound_.setBuffer(this.resources.items[`${name}`])
        sound_.setBuffer(this.resources.items["dice_roll_1"])
        sound_.setLoop(false)
        sound_.setVolume(1.0)

        instance.sound_play = () => {
            sound_.setVolume(volume_ * this.Get_SFX_Volume(1.0))
            sound_.play(0.0)
        }

    }


    AddSoundBuffer(name, instance, volume = 1.0){
        let sound_ = new THREE.Audio(this.listener)
        // sound_.setBuffer(this.resources.items[`examples_sounds_ping_pong`])
        sound_.setBuffer(this.resources.items[`${name}`])
        sound_.setLoop(false)
        sound_.setVolume(volume)

        instance.sound_play = () => {
            sound_.setVolume(this.Get_SFX_Volume(1.0))
            sound_.play(0.0)
        }
    }


    DeleteSoundBuffer(instance){
        // sound_.remove()

    }



    PlayBGM() {
        if (this.bgm_played == true)
            return

        this.bgm_played = true

        this.Background_Music.setLoop(true);
        // this.bgm.setVolume(0.5);

        this.Background_Music.setVolume(this.Get_BGM_Volume())

        this.Background_Music.play();

    }


    StopBGM() {
        if (this.bgm_played == false)
            return

        this.bgm_played = false

        let anim_ = gsap.timeline()

        anim_.to({}, {
            ease: "none", duration: 1.0
            , onUpdate: () => {
                this.Background_Music.setVolume((1 - anim_.time()) * this.Get_BGM_Volume())
            }
            , onComplete: () => {
                this.Background_Music.stop()
                this.Background_Music.offset = 0.0
            }
        })
    }


    DiceRolling() {
        // this.dice_rolling.play(0.8)
        let current_sound = this.dice_roll[this.dice_roll_index]
        // current_sound.currentTime = 0

        if (current_sound.isPlaying == true) {
            // current_sound.stop()
        }

        current_sound.currentTime = 0.15
        // current_sound.play(0.0)
        this.pingpong.play(0.0)

        this.dice_roll_index = (this.dice_roll_index + 1) % this.dice_roll.length
    }


    GameOver() {

    }

}