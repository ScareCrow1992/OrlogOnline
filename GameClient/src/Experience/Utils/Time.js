import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
import Timer from './Timer.js'

import { gsap } from 'gsap'


// async function aaa(){
//     let a = {val : 0}

//     let anim = []
//     for(let i=0 ;i<7; i++){
//         anim.push(gsap.to(a, {duration : i, onComplete : ()=>{console.log(`${i}`)}}))
//     }

//     await Promise.all(anim).then(() => {
//         let anim = gsap.timeline()
//         anim.to(a, { duration: 1, onComplete: () => { console.log(0) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(1) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(2) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(3) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(4) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(5) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(6) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(7) } })
//             .to(a, { duration: 1, onComplete: () => { console.log(8) } })
//     })

// }

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.experience = new Experience()
        this.world = this.experience.world
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        // this.renderder = this.experience.renderer.instance

        this.global_gsap_timeline = 0

        this.resources_on = false 

        // document.addEventListener("keydown", e => {
        //     if (e.key == "b")
        //         console.log(`global time : ${gsap.globalTimeline.time()}`)
        //         console.log(`end time : ${gsap.globalTimeline.endTime()}`)
        //         console.log(`progress : ${gsap.globalTimeline.progress()}`)

        // })
        

        // aaa()

        // let anim = gsap.timeline()
        // anim.to(a, { duration: 1, onComplete: () => { console.log(0) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(1) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(2) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(3) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(4) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(5) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(6) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(7) } })
        //     .to(a, { duration: 1, onComplete: () => { console.log(8) } })

        // anim.then(() => {
        //     console.log("end~")
        //     // alert("hello~")

        //     // console.log(gsap.globalTimeline.getChildren())

        //     let anim = gsap.timeline()
        //     anim.to(a, { duration: 1, onComplete: () => { console.log(0) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(1) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(2) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(3) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(4) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(5) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(6) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(7) } })
        //         .to(a, { duration: 1, onComplete: () => { console.log(8) } })

        //     // anim.play()
        //     console.log(gsap.globalTimeline.getChildren())
        //     // gsap.globalTimeline.play()

        //     console.log(gsap.globalTimeline.getChildren())
        // })


        document.addEventListener("visibilitychange", () => {
            switch (document.visibilityState) {
                case "visible":
                    clearInterval(this.blur_interval)
                    gsap.ticker.add(gsap.updateRoot)
                    // console.log(document.visibilityState)

                    let end_time = gsap.globalTimeline.endTime()
                    gsap.globalTimeline.time(end_time)
                    gsap.globalTimeline.progress(1)


                    // console.log(`global time : ${gsap.globalTimeline.time()}`)
                    // gsap.globalTimeline.play()

                    break;

                case "hidden":
                    // gsap.globalTimeline.pause()
                    gsap.ticker.remove(gsap.updateRoot)
                    this.global_gsap_timeline = gsap.globalTimeline.time()

                    this.blur_interval = setInterval(() => { this.tick_blur() }, 100);
                    // console.log(document.visibilityState)

                    // console.log(`global time : ${gsap.globalTimeline.time()}`)


                    break;
            }
        });


        this.emitter = new EventEmitter();
        this.timer = new Timer(this.emitter)

        this.resources.on('ready', () => {
            this.resources_on = true
            window.requestAnimationFrame(() =>{
                this.tick()
            })
            // gsap.ticker.add(() => {this.tick_blur()})
            
        })

        this.SetTimerTrigger()
    }


    // 길이가 duration인 타임라인에서 현재 progress 까지 재생되었을 때, deltaTime만큼 진행된 progress를 새로 반환한다. 
    GetProgressedValue(duration, progress, deltaTime){
        let tween_time = duration * progress
        let next_time = tween_time + deltaTime

        let new_progress = next_time / duration

        return new_progress
    }


    SetTimer(time_value, is_start = false){
        this.timer.SetTimer(time_value, is_start)
    }

    StartTimer(){
        this.timer.StartTimer()
    }

    StopTimer(){
        this.timer.StopTimer()
    }


    SetTimerTrigger(){
        this.emitter.on("timeover", ()=>{
            // this.timer.StopTimer()
            this.trigger("timeover")
        })
    }


    AddExtraTime(seconds){
        this.timer.AddExtraTime(seconds)
    }


    Frame() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.world.update(this.delta)
        this.camera.update()
        
        this.trigger('tick', [this.delta])
        this.timer.update(this.delta)
    }

    tick()
    {
        this.Frame()

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }


    tick_blur() {
        if(this.resources_on === false)
            return

        // console.log(Date.now())
        let deltaTime = (Date.now() - this.current) / 1000
        this.global_gsap_timeline += deltaTime
        // console.log(deltaTime)
        // console.log("Tick_Blur~~")
        // let cnt = 0
        // gsap.globalTimeline.getChildren().filter(tween => {

        //     if (tween.isActive()) {

        //         // this.TweenUpdate(tween, cnt)
        //         cnt++
        //     }
        // })


        // console.log(`active_cnt : ${cnt}`)
        // if(cnt > 0)
        gsap.updateRoot(this.global_gsap_timeline, deltaTime)


        this.Frame()
    }


    TweenUpdate(tween, cnt) {



        let deltaTime = Date.now() - this.current
        deltaTime /= 1000

        let new_progress = (tween.time() + deltaTime) / tween.duration()
        if (new_progress > 1)
            new_progress = 1

        if (cnt == 0) {
            // console.log("[[[]]]")
            // console.log(deltaTime)
            // console.log(tween.duration())
            // console.log(tween.time())
            // console.log(new_progress)
            // console.log(tween)
        }

        // tween.getChildren().filter(tween_ => {
        //     console.log(tween_)
        // })



        tween.progress(new_progress).play()

        // if (cnt == 0) {
        //     // console.log(new_progress)
        //     console.log(ret)
        // }


    }



    GameOver(){
        this.timer.StopTimer()


    }


}