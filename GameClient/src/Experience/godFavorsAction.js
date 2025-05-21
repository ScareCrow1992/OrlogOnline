// for only client
import * as THREE from 'three'
import Weapon from './World/Items/Weapon.js'
import gsap from 'gsap'


function blink(material) {
    let blink_ = gsap.timeline()
    for (let i = 0; i < 3; i++) {
        blink_.to(material, { ease: "none", duration: 0.2, opacity: 1 })
        blink_.to(material, { ease: "none", duration: 0.2, opacity: 0 })
    }

    return blink_
}



function GetIncreasedMarksTransform(cnt) {
    const gap = 0.1
    let transforms = []
    const center = (cnt - 1) * gap / 2
    for (let index = 0; index < cnt; index++) {
        let dummy = new THREE.Object3D()
        let pos = -center + index * gap
        // console.log(pos)
        // dummy.position.set(pos, -pos, 0.05)
        dummy.translateX(pos)
        dummy.translateY(-pos)
        dummy.updateMatrix()
        transforms.push(dummy.matrix.clone())
        // console.log(dummy.position)
    }
    // console.log(transforms)
    return transforms
}


let godFavorsAction = {
    "Baldr": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            

            let dices_index = godFavorInfo.dices_index
            let marks_cnt = godFavorInfo.marks_cnt
            // let weapon_types = godFavorInfo.weapon_types


            

            let dices_position = myAvatar.GetDices_Top_Position_By_Indexes(dices_index)
            await this.ShootingStar_Fire(dices_position);



            let transforms__ = []

            for (let i = 0; i < dices_index.length; i++) {
                transforms__.push(GetIncreasedMarksTransform(marks_cnt[i]))
            }

            

            let promises = [], callbacks = []
            
            for (let i = 0; i < dices_index.length; i++) {
                let [promises_, callbacks_] = myAvatar.ConvertDiceMark(null, this.color, [dices_index[i]], [marks_cnt[i]], transforms__[i])

                promises.push(...promises_)
                callbacks.push(...callbacks_)
            }




            await Promise.all(promises)


            return [callbacks, []]



            // let helmetDicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "helmet"})

            // // console.log(dicesIndex)

            // let addedArmor = this.effectValue[level] + 1
            // let helmetChangedValue = Array(helmetDicesIndex.length).fill(addedArmor)


            // let cnt = addedArmor
            // const gap = 0.1
            // let transforms = []
            // const center = (cnt - 1) * gap / 2
            // for (let index = 0; index < cnt; index++) {
            //     let dummy = new THREE.Object3D()
            //     let pos = -center + index * gap
            //     // console.log(pos)
            //     // dummy.position.set(pos, -pos, 0.05)
            //     dummy.translateX(pos)
            //     dummy.translateY(-pos)
            //     dummy.updateMatrix()
            //     transforms.push(dummy.matrix.clone())
            //     // console.log(dummy.position)
            // }
            // // console.log(transforms)




            // let shieldDicesIndex = myAvatar.GetDicesIndexsOnCondition((dice) => { return dice.getWeapon() == "shield" })

            // let shieldChangedValue = Array(shieldDicesIndex.length).fill(addedArmor)


            // cnt = addedArmor
            // let transforms_ = []
            // const center_ = (cnt - 1) * gap / 2
            // for (let index = 0; index < cnt; index++) {
            //     let dummy = new THREE.Object3D()
            //     let pos = -center_ + index * gap
            //     // console.log(pos)
            //     // dummy.position.set(pos, -pos, 0.05)
            //     dummy.translateX(pos)
            //     dummy.translateY(-pos)
            //     dummy.updateMatrix()
            //     transforms_.push(dummy.matrix.clone())
            //     // console.log(dummy.position)
            // }
            // // console.log(transforms)


            // let helmet_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(helmetDicesIndex)
            // let shield_dices_position= myAvatar.GetDices_Top_Position_By_Indexes(shieldDicesIndex)

            // await this.ShootingStar_Fire([...helmet_dices_position, ...shield_dices_position]);

            // // let promises, callbacks, promises_, callbacks_
            // let [promises, callbacks] = myAvatar.ConvertDiceMark("helmet", this.color, helmetDicesIndex, helmetChangedValue, transforms)

            // let [promises_, callbacks_] = myAvatar.ConvertDiceMark("shield", this.color, shieldDicesIndex, shieldChangedValue, transforms_)


            // await Promise.all([...promises, ...promises_])

            // return [[...callbacks, ...callbacks_], []]
        }
    },
    "Bragi": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)
            
            let tokenCnt = this.effectValue[level]

            let dicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "steal"})

            
            let steal_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(dicesIndex)
            await this.ShootingStar_Fire(steal_dices_position);

            let promises = []
            dicesIndex.forEach(index => {
                for (let i = 0; i < tokenCnt; i++){
                    let dicePosition = myAvatar.dices[index].getPosition().clone()
                    dicePosition.y += i * 0.5
                    promises.push(myAvatar.CreateNewToken(dicePosition))
                }
            })

            await Promise.all(promises)
        }
    },
    "Brunhild": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            let dicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "axe"})

            // console.log(dicesIndex)

            let markCnt = dicesIndex.length
            let multipliyValue = this.effectValue[level]
            let multipliedCnt = Math.ceil(markCnt * multipliyValue)
            let quotient = Math.floor(multipliedCnt / markCnt)
            let remainder = multipliedCnt % markCnt

            let changedValue = Array(markCnt).fill(quotient)
            for(let i=0; i<remainder; i++)
                changedValue[i]++

            let axe_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(dicesIndex)
            await this.ShootingStar_Fire(axe_dices_position);
            
            let cnt = markCnt
            const gap = 0.1
            let transforms = []
            const center = (cnt - 1) * gap / 2
            let promises = [], callbacks = []
            for (let index = 0; index < cnt; index++) {
                let dummy

                switch(changedValue[index]){
                    case 1:
                        dummy = new THREE.Object3D()
                        transforms.push(dummy.matrix.clone())
                        break;
                    case 2:
                        dummy = new THREE.Object3D()
                        dummy.rotateZ(-0.1)
                        dummy.translateX(0.05)
                        dummy.updateMatrix()
                        transforms.push(dummy.matrix.clone())
                        
                        dummy = new THREE.Object3D()
                        dummy.rotateZ(0.1)
                        dummy.translateX(-0.05)
                        dummy.scale.set(-1,1,1)
                        dummy.updateMatrix()
                        transforms.push(dummy.matrix.clone())
                        break;

                    case 3:
                        for(let i =0 ; i < 3; i++){
                            dummy = new THREE.Object3D()
                            dummy.rotateZ( i *  2 * Math.PI / 3 + Math.PI / 6)
                            dummy.scale.set(0.85, 0.85, 0.85)
                            dummy.translateX(0.07)
                            dummy.translateY(0.07)
                            dummy.updateMatrix()
                            transforms.push(dummy.matrix.clone())
                        }
                        break;
                }

                let [tmpPromises, tmpCallbacks] = myAvatar.ConvertDiceMark(this.weaponName, this.color, [dicesIndex[index]], [changedValue[index]], transforms)

                promises.push(...tmpPromises)
                callbacks.push(...tmpCallbacks)

            }
            await Promise.all(promises)
            return [callbacks, []]
        }
    },
    "Freyja": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            
            let cnt = level + 1
            let trayPosition = new THREE.Vector3(0,0, 5.5 * myAvatar.anchorSign)
            let gap = 1.3
            let anchor = -1 * (cnt - 1) * gap / 2
            let positions_ = []
            for(let i = 0; i < cnt; i++){
                trayPosition.x = anchor + i * gap
                trayPosition.y = 0.5
                positions_.push(trayPosition.clone())
            }

            await this.ShootingStar_Fire(positions_);

            


            // console.log(godFavorInfo.nDiceIndexes)

            function CallLater(){
                // avatar.dices 내에 쓰레기값으로 있는 주사위들을 제거
                // console.log("garbage dice is deleted")
                myAvatar.ReduceDices(level + 1)
            }


            function CallImmediately(){
                let newDices = []
                let gap = 1.3
                let cnt = level + 1
                let anchor = -1 * (cnt - 1) * gap / 2
                let trayPosition = new THREE.Vector3(0,0, 5.5 * myAvatar.anchorSign)
                for(let i = 0; i < cnt; i++){
                    let nDice = this.CreateItem("dice", godFavorInfo.nDiceIndexes[i])
                    trayPosition.x = anchor + i * gap
                    trayPosition.y = 0.5
                    nDice.state = "waiting"
                    nDice.setPosition(trayPosition)
                    newDices.push(nDice)
                }

                myAvatar.AddDices(newDices)
                // myAvatar.AddDice(level)
            }

            return [[CallLater], [CallImmediately]]
        }
    },
    "Freyr": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            await this.Blink(this.effectMesh.material)

            // godFavorInfo.increasedWeapon
            // godFavorInfo.weaponIndexes
            // godFavorInfo.increasedValue

            let weapon = godFavorInfo.increasedWeapon
            let cnt = godFavorInfo.weaponIndexes.length
            // console.log(cnt)

            let promises = []
            let callbacks =[]


            // let forged_dices_positions = []
            // for(let i=0; i<cnt; i++){
            //     let indexes_ = godFavorInfo.weaponIndexes[i]

            //     let positions_ = myAvatar.GetDices_Top_Position_By_Indexes(indexes_)
            //     forged_dices_positions.push(...positions_)
            // }

            // console.log(forged_dices_positions)

            // await this.ShootingStar_Fire(forged_dices_positions);


            
            let dicesIndex = myAvatar.GetDicesIndexsOnCondition((dice) => { return dice.getWeapon() == weapon })

            let positions_ = myAvatar.GetDices_Top_Position_By_Indexes(dicesIndex)
            await this.ShootingStar_Fire(positions_);

            // console.log("weapon : ", weapon)
            // console.log("cnt : ", cnt)
            // console.log(godFavorInfo.weaponIndexes)

            for(let i=0; i<cnt; i++){
                let index = godFavorInfo.weaponIndexes[i]
                let value = godFavorInfo.increasedValue[i]

                let transforms = GetIncreasedMarksTransform(value)

                let dicesIndex = godFavorInfo.weaponIndexes[i]
                let changedValue = godFavorInfo.increasedValue[i]
                

                // console.log(dicesIndex)
                // console.log(changedValue)
                // console.log(myAvatar)

                // transforms = JSON.parse(JSON.stringify(transforms))

                let [tmpPromises, tmpCallbacks] = myAvatar.ConvertDiceMark(weapon, this.color, [dicesIndex], [changedValue], transforms)


                promises.push(...tmpPromises)
                callbacks.push(...tmpCallbacks)
            }

            await Promise.all(promises)
            return [callbacks, []]

        }
    },
    "Frigg": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            // console.log(godFavorInfo.nDiceIndexes)
            let rerollDiceCnt = this.effectValue[level]
            this.extraPickedDiceCnt = rerollDiceCnt

            function CallImmediately(){
                // console.log(avatarsIndex)
                // console.log("Loki power")
                this.extraPickedDiceCnt = rerollDiceCnt
                let avatarsIndex = this.GetAvatarsIndex()

                this.EnableExtraInputDice({
                    trigger : "Resolution",
                    user : avatarsIndex[godFavorInfo.user],
                    godfavor : "Frigg"
                })
                // myAvatar.AddDice(level)
            }

            // return [null, [CallImmediately]]
        },
        extraPower: async function (level, myAvatar, opponentAvatar, godFavorInfo, param) {
            // await blink(this.effectMesh.material)
            
            // console.log(param)
            let avatar = param.avatar
            let dices_index = param.dices_index
            // console.log(dices_index)

            let target_avatar = undefined
            if(avatar === "bottom")
                target_avatar = myAvatar
            else
                target_avatar = opponentAvatar

            // let avatarsIndex = this.experience.controller.GetAvatarsIndex()
            // console.log(avatarsIndex, avatar)
            // console.log(avatarsIndex[avatar])

            // let target_avatar = undefined
            // if (avatarsIndex[avatar] === "top")
            //     target_avatar = opponentAvatar
            // else
            //     target_avatar = myAvatar

            let positions = target_avatar.GetDicesPosition_By_Indexes(dices_index)
            await this.ShootingStar_Fire(positions)
        }
    },
    "Heimdall": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)


            
            let helmet_indexes = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "helmet"})
            let shield_indexes = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "shield"})


            
            let helmet_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(helmet_indexes)
            let shield_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(shield_indexes)

            await Promise.all([this.ShootingStar_Fire(helmet_dices_position), this.ShootingStar_Fire(shield_dices_position)])


            await myAvatar.Highlighting_Marks(this.color, [...helmet_indexes, ...shield_indexes], 1.0)

            
            let healValue = this.effectValue[level]

            myAvatar.eventEmitter.on(`${myAvatar.index}-block-axe`, () => {
                for (let i = 0; i < healValue; i++){
                    myAvatar.Heal()
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-block-arrow`, () => {
                for (let i = 0; i < healValue; i++){
                    myAvatar.Heal()
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-block-axe-anim`, (damaged_position) => {
                for (let i = 0; i < healValue; i++){
                    myAvatar.HealingBall_Animation(damaged_position)
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-block-arrow-anim`, (damaged_position) => {
                for (let i = 0; i < healValue; i++){
                    myAvatar.HealingBall_Animation(damaged_position)
                }
            })

        }
    },
    "Hel": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            // 트리거 등록
            let healValue = this.effectValue[level]

            for (let i = 0; i < healValue; i++){

            }

            myAvatar.eventEmitter.on(`${opponentAvatar.index}-damage-axe`, () => {
                for (let i = 0; i < healValue; i++)
                    myAvatar.Heal()
            })

            myAvatar.eventEmitter.on(`${opponentAvatar.index}-damage-axe-anim`, (damaged_position) => {
                for (let i = 0; i < healValue; i++){
                    myAvatar.HealingBall_Animation(damaged_position, null)

                }
            })


            // 마크 변경
            let dicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "axe"})

            let axe_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(dicesIndex)
            await this.ShootingStar_Fire(axe_dices_position);
            
            let changedValue = Array(dicesIndex.length).fill(1)


            let cnt = 1
            const gap = 0.1
            let transforms = []
            const center = (cnt - 1) * gap / 2
            for (let index = 0; index < cnt; index++) {
                let dummy = new THREE.Object3D()
                let pos = -center + index * gap
                // console.log(pos)
                // dummy.position.set(pos, -pos, 0.05)
                dummy.translateX(pos)
                dummy.translateY(-pos)
                dummy.updateMatrix()
                transforms.push(dummy.matrix.clone())
                // console.log(dummy.position)
            }
            // console.log(transforms)

            let [promises, callbacks] = myAvatar.ConvertDiceMark(this.weaponName, this.color, dicesIndex, changedValue, transforms)

            await Promise.all(promises)

            return [callbacks, []]
        }
    },
    "Idun": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)


            let healValue = this.effectValue[level]

            
            let positions_ = myAvatar.Get_Need_Heal_Positions(healValue)
            let healingball_promise = this.HealingBall_Fire(positions_)
            await healingball_promise



            let promises = []
            for (let i = 0; i < healValue; i++)
                promises.push(myAvatar.Heal())

            // return Promise.all(promise)
            await Promise.all(promises)

            promises.length = 0
            for (let i = 0; i < healValue; i++)
                promises.push(myAvatar.HealAnimation())

            await Promise.all(promises)
        }
    },
    "Loki": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            // await blink(this.effectMesh.material)

            // console.log(godFavorInfo.nDiceIndexes)
            let banDiceCnt = this.effectValue[level]
            this.extraPickedDiceCnt = banDiceCnt

            function CallImmediately(){
                // console.log(avatarsIndex)
                // console.log("Loki power")
                this.extraPickedDiceCnt = banDiceCnt
                let avatarsIndex = this.GetAvatarsIndex()

                this.EnableExtraInputDice({
                    trigger : "Resolution",
                    user : avatarsIndex[godFavorInfo.user],
                    godfavor : "Loki"
                })
                // myAvatar.AddDice(level)
            }

            // return [null, [CallImmediately]]
        }
        ,extraPower: async function (level, myAvatar, opponentAvatar, godFavorInfo, param) {
            await this.Blink(this.effectMesh.material)
            
            // let avatar = param.avatar
            let dices_index = param.dices_index

            let positions = opponentAvatar.GetDicesPosition_By_Indexes(dices_index)
            await this.ShootingStar_Fire(positions)
        }
    },
    "Mimir": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            let health_stone_area_center = myAvatar.Get_FireWorks_Position()
            health_stone_area_center.setY(3.5)

            await this.FireWorks_Fire([health_stone_area_center])


            await new Promise(res => { setTimeout(() => { res(true) }, 500) })

            // await this.ShootingStar_Fire([health_stone_area_center])

            // let stones_position = myAvatar.Get_Damage_Stones_Positions(15)
            // await this.ShootingStar_Fire(stones_position, health_stone_area_center)

            myAvatar.HealthStones_Change_Color(0.144444)
            await new Promise(res => { setTimeout(() => { res(true) }, 400) })
            // myAvatar.HealthStones_ShineOn()
            
            let tokenCnt = this.effectValue[level] 
            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-axe`, ()=>{
                for(let i = 0; i< tokenCnt; i++){
                    myAvatar.Token_Create_Immediately()
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-arrow`, ()=>{
                for(let i = 0; i< tokenCnt; i++){
                    myAvatar.Token_Create_Immediately()
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-godfavor`, ()=>{
                for(let i = 0; i< tokenCnt; i++){
                    myAvatar.Token_Create_Immediately()
                }
            })



            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-axe-anim`, (position)=>{
                for(let i = 0; i< tokenCnt; i++){
                    let newPosition = position.clone()
                    newPosition.y += i * 0.3
                    myAvatar.Token_Initial_Animation(newPosition)
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-arrow-anim`, (position)=>{
                for(let i = 0; i< tokenCnt; i++){
                    let newPosition = position.clone()
                    newPosition.y += i * 0.3
                    myAvatar.Token_Initial_Animation(newPosition)
                }
            })

            myAvatar.eventEmitter.on(`${myAvatar.index}-damage-godfavor-anim`, (position)=>{
                for(let i = 0; i< tokenCnt; i++){
                    let newPosition = position.clone()
                    newPosition.y += i * 0.3
                    myAvatar.Token_Initial_Animation(newPosition)
                }
            })


            let callback_ = ()=>{
                myAvatar.HealthStones_Reset_Color()
                // myAvatar.HealthStones_ShineOff()
            }

            return [[callback_],[]]
        }
    },
    "Odin": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            // await blink(this.effectMesh.material)

            // let consumedHealth = 4
            // let newTokenCnt = this.effectValue[level]

            // let promises = []
            // for (let healthCnt = 0; healthCnt < consumedHealth; healthCnt++) {
            //     let healthStonePosition = myAvatar.GetTargetHealthStone(null)
            //     for (let tokenCnt = 0; tokenCnt < newTokenCnt; tokenCnt++) {
            //         let healthStonePosition_ = healthStonePosition.clone()
            //         healthStonePosition_.y += 0.25 * tokenCnt
            //         promises.push(myAvatar.CreateNewToken(healthStonePosition_))
            //     }
            // }
            // await Promise.all(promises)

            function CallImmediately(){
                // console.log(avatarsIndex)
                // console.log("Loki power")
                let avatarsIndex = this.GetAvatarsIndex()

                this.EnableExtraInputDice({
                    trigger : "Resolution",
                    user : avatarsIndex[godFavorInfo.user],
                    godfavor : "Odin"
                })
                // myAvatar.AddDice(level)
            }


            // return [null, [CallImmediately]]
        },
        extraPower: async function (level, myAvatar, opponentAvatar, godFavorInfo, param) {
            let damage = param.damage
            let coefficient = param.coefficient

            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            
            let positions = myAvatar.Get_Damage_Stones_Positions(damage)
            await this.ShootingStar_Fire(positions)

            let prom = [];
            for (let index = 0; index < damage; index++) {
                let pos = myAvatar.GetTargetHealthStone()

                if(pos == null)
                    break;

                for (let j = 0; j < coefficient; j++) {
                    let pos_ = pos.clone()
                    pos_.y = 0.2 * (j + 1)
                    prom.push(myAvatar.CreateNewToken(pos_))
                }
            }
            

            return Promise.all(prom)
        }
    },
    "Skadi": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            let dicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "arrow"})

            // console.log(dicesIndex)

            let addedArrow = this.effectValue[level] + 1
            let changedValue = Array(dicesIndex.length).fill(addedArrow)

            let arrow_dices_position = myAvatar.GetDices_Top_Position_By_Indexes(dicesIndex)
            await this.ShootingStar_Fire(arrow_dices_position);
            


            let cnt = addedArrow
            const gap = 0.1
            let transforms = []
            const center = (cnt - 1) * gap / 2
            for (let index = 0; index < cnt; index++) {
                let dummy = new THREE.Object3D()
                let pos = -center + index * gap
                // console.log(pos)
                // dummy.position.set(pos, -pos, 0.05)
                dummy.translateX(pos)
                dummy.translateY(-pos)
                dummy.updateMatrix()
                transforms.push(dummy.matrix.clone())
                // console.log(dummy.position)
            }
            // console.log(transforms)

            let [promises, callbacks] = myAvatar.ConvertDiceMark(this.weaponName, this.color, dicesIndex, changedValue, transforms)

            await Promise.all(promises)

            return [callbacks, []]
        }
    },
    "Skuld": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)
            
            let tokenBrokenCoefficient = this.effectValue[level]
            let arrowDicesIndex = myAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "arrow"})
            let arrowCnt = arrowDicesIndex.length


            
            let dices_position = myAvatar.GetDices_Top_Position_By_Indexes(arrowDicesIndex)

            await this.ShootingStar_Fire(dices_position);
            
            await myAvatar.Highlighting_Marks(this.color, arrowDicesIndex, 1.0)

            

            let [poison_needle_target_from, poison_needle_target_to] = opponentAvatar.Get_Tokens_Area_Position()

            let lerp_alpha = 1 / (dices_position.length + 1)
            let current_alpha = lerp_alpha


            dices_position.forEach(pos=>{
                let target_ = new THREE.Vector3()
                target_.lerpVectors(poison_needle_target_from, poison_needle_target_to, current_alpha)
                // console.log(current_alpha)

                current_alpha += lerp_alpha

                this.PoisonNeedles_Fire(pos, target_)
            })


            // await new Promise(res => { setTimeout(() => { res(true) }, 400) })
            // await opponentAvatar.SpendToken(tokenBrokenCoefficient * arrowCnt)

            let lost_token_cnt = opponentAvatar.Token_Destroy_Immediately(tokenBrokenCoefficient * arrowCnt)


            if(lost_token_cnt > 0){
                // let sleep_time = lost_token_cnt * 150
    
                opponentAvatar.Token_Destroy_Animation()
    
                // await new Promise(res => { setTimeout(() => { res(true) }, sleep_time) })

            }

            await new Promise(res => { setTimeout(() => { res(true) }, 2500) })


        }
    },
    "Thor": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            this.experience.sound.Play_SoundThor()

            // let anim = gsap.timeline()

            // if(!this.CheckCanUse(args.level))
            //     return null
            let promises = []
            // console.log("hammer time")
            for (let index = 0; index < this.effectValue[level]; index++) {
                if(opponentAvatar.health <= 0)
                    break;

                let muzzle = this.getPosition()
                let weapon = new Weapon("mjolnir")
                weapon.SetPosition(muzzle)

                let target = weapon.GetTarget(opponentAvatar)
                if (target != null) {
                    promises.push(weapon.Action(target, opponentAvatar))
                }
            }

            let disappear_animations = []
            await Promise.all(promises).then((resolves) => { resolves.forEach(callback => { disappear_animations.push(callback()) }) })

            await Promise.all(disappear_animations)

            // return anim
        }
    },
    "Thrymr": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

        }
    },
    "Tyr": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            // await blink(this.effectMesh.material)
            function CallImmediately(){
                let avatarsIndex = this.GetAvatarsIndex()

                this.EnableExtraInputDice({
                    trigger : "Resolution",
                    user : avatarsIndex[godFavorInfo.user],
                    godfavor : "Tyr"
                })
                // myAvatar.AddDice(level)
            }

            // return [null, [CallImmediately]]
        },
        extraPower: async function (level, myAvatar, opponentAvatar, godFavorInfo, param) {
            let damage = param.damage
            let coefficient = param.coefficient

            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            let positions = myAvatar.Get_Damage_Stones_Positions(damage)
            await this.ShootingStar_Fire(positions)


            let prom = [];
            for (let index = 0; index < damage; index++) {
                let pos = myAvatar.GetTargetHealthStone()
                
                if(pos == null)
                    break;

                prom.push(opponentAvatar.SpendToken(coefficient))
            }

            await Promise.all(prom)
        }
    },
    "Ullr": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)
        }

    },
    "Var": {
        power: async function (level, myAvatar, opponentAvatar) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            let healCoefficient = this.effectValue[level]
            myAvatar.eventEmitter.on(`${opponentAvatar.index}-use-token`, (tokenCnt) => {
                let healValue = healCoefficient * tokenCnt
                for (let i = 0; i < healValue; i++) {
                    myAvatar.Heal()
                }
            })


            myAvatar.eventEmitter.on(`${opponentAvatar.index}-use-token-anim`, (token_position) => {
                let healValue = healCoefficient
                for (let i = 0; i < healValue; i++) {
                    myAvatar.HealingBall_Animation(token_position)
                }
            })

        }
    },
    "Vidar": {
        power: async function (level, myAvatar, opponentAvatar, godFavorInfo) {
            // myAvatar.SpendToken(this.cost[level])
            await this.Blink(this.effectMesh.material)

            // let helmetDicesIndex = opponentAvatar.GetDicesIndexsOnCondition((dice)=>{return dice.getWeapon() == "helmet"})

            let removedDicesIndex = godFavorInfo.removedDicesIndex
            let removedCnt = godFavorInfo.removedCnt


            let dices_position = opponentAvatar.GetDices_Top_Position_By_Indexes(removedDicesIndex)
            await this.ShootingStar_Fire(dices_position);


            let [promises, callbacks] = opponentAvatar.DecreaseDiceMark(this.color, removedDicesIndex, removedCnt)


            

            await Promise.all(promises)

            return [callbacks, []]


            // let promises = [], callbacks = []





            // for(let i=0; i<helmetDicesIndex.length; i++){

            //     let transforms = GetIncreasedMarksTransform(helmetDicesCnt[i])
            
            //     let [tmp_promises, tmp_callbacks] = opponentAvatar.ConvertDiceMark("helmet", this.color, [helmetDicesIndex[i]], [helmetDicesCnt[i]], transforms)

            //     promises.push(...tmp_promises)
            //     callbacks.push(...tmp_callbacks)
            // }


            // await Promise.all(promises)

            // return [callbacks, []]





            // let dices_decrease = new Array(opponentAvatar.dices.length).fill(0)
            // godFavorInfo.removedDicesIndex.forEach(index => {
            //     // opponentAvatar.dices[index].WeaponDecrease()
            //     dices_decrease[index]++
            // })

            // let helmetChangedValue = []
            // dices_decrease.forEach((decrease_value) => {
            //     if (decrease_value != 0)
            //         helmetChangedValue.push(decrease_value)
            // })

            // let promises = [], callbacks = []


            // for(let i=0; i<helmetDicesIndex.length; i++){

            //     let transforms = GetIncreasedMarksTransform(helmetChangedValue[i])
            
            //     let [tmp_promises, tmp_callbacks] = opponentAvatar.ConvertDiceMark("helmet", this.color, [helmetDicesIndex[i]], [helmetChangedValue[i]], transforms)

            //     promises.push(...tmp_promises)
            //     callbacks.push(...tmp_callbacks)

            // }


            // await Promise.all(promises)

            // return [callbacks, []]

        }
    }


}


// let godFavorsExtraAction = {
//     "Odin" : {
//         async function (level, myAvatar, opponentAvatar, godFavorInfo) {
//             // myAvatar.SpendToken(this.cost[level])
//             await blink(this.effectMesh.material)
            

//         }
//     }
// }



export {godFavorsAction}