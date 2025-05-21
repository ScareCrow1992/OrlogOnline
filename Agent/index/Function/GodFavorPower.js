// 서버, 클라이언트 공유 데이터
import { Random } from "random-js";
const random = new Random();

let weapons = ["axe", "arrow", "helmet", "shield", "steal"]

const UNIT_WEAPON = 1 / 6
const UNIT_TOKEN = 1 / 50
const UNIT_HP = 1 / 15

export default {
    "Baldr": {
        cost: [3, 6, 9],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]

            avatar.dices.helmet += this.effectValue[level]
            avatar.dices.shield += this.effectValue[level]
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Bragi": {
        cost: [4, 8, 12],
        afterDecision: false,
        effectValue: [2, 3, 4],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            avatar.token += this.effectValue[level] * avatar.dices.steal
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Brunhild": {
        cost: [6, 10, 18],
        afterDecision: false,
        effectValue: [1.5, 2, 3],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            avatar.axe += this.effectValue[level] * avatar.dices.axe
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Freyja": {
        cost: [2, 4, 6],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 2,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            avatar.dices.empty += this.effectValue[level]
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Freyr": {
        cost: [4, 6, 8],
        afterDecision: false,
        effectValue: [2, 3, 4],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            random.shuffle(weapons)

            let largest_weapon = weapons[0]
            let largest_cnt = avatar.dices[`${largest_weapon}`]

            for (let index = 1; index < 5; index++) {
                let tmp_weapon = weapons[index]
                let tmp_cnt = avatar[`${tmp_weapon}`]
                if (largest_cnt < tmp_cnt) {
                    largest_cnt = tmp_cnt
                    largest_weapon = tmp_weapon
                }
            }

            avatar.dices[`${largest_weapon}`] += this.effectValue[level]

        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Frigg": {
        cost: [2, 3, 4],
        afterDecision: false,
        effectValue: [2, 3, 4],
        priority: 2,
        power: function (avatar, opponent, level, situation, input, index) {
            avatar.token -= this.cost[level] * UNIT_TOKEN

            let opponent_index = 1 - index

            let avatar_info = situation.player[index]
            let opponent_info = situation.player[opponent_index]

            // input : dices index
            input[0].forEach(dice_index=>{
                let tmp_dice = avatar_info.dices[dice_index]
                let tmp_weapon = tmp_dice.weapon
                let tmp_mark = tmp_dice.token

                if(tmp_mark == true)
                    avatar.mark--

                avatar[`${tmp_weapon}`]--
            })

            let length_ = input[0].length
            let effect_ = this.effectValue[level] * UNIT_WEAPON / 6

            avatar.axe += effect_ * 2
            avatar.arrow += effect_
            avatar.shield += effect_
            avatar.helmet += effect_
            avatar.steal += effect_
            avatar.mark += effect_

            input[1].forEach(dice_index=>{
                let tmp_dice = opponent_info.dices[dice_index]
                let tmp_weapon = tmp_dice.weapon
                let tmp_mark = tmp_dice.token

                if(tmp_mark == true)
                    opponent.mark--

                opponent[`${tmp_weapon}`]--
            })
            
            length_ = input[1].length
            effect_ = this.effectValue[level] * UNIT_WEAPON / 6

            opponent.axe += effect_ * 2
            opponent.arrow += effect_
            opponent.shield += effect_
            opponent.helmet += effect_
            opponent.steal += effect_
            opponent.mark += effect_

        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Heimdall": {
        cost: [4, 7, 10],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 4,
        power : function (avatar, opponent, level){
            avatar.token -= this.cost[level]
            let blocked_cnt_helmet = Math.min(avatar.dices.helmet, opponent.dices.axe)
            let blocked_cnt_shield = Math.min(avatar.dices.shield, opponent.dices.arrow)
            // avatar.health += this.effectValue[level] * (blocked_cnt_helmet + blocked_cnt_shield)
            // avatar.health = Math.max(0, avatar.health)

            avatar.heal = this.effectValue[level] * (blocked_cnt_helmet + blocked_cnt_shield)

        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Hel": {
        cost: [6, 12, 18],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 4,
        power : function(avatar, opponent, level){
            avatar.token -= this.cost[level]

            // let blocked_cnt = Math.min(avatar.dices.axe, opponent.dices.helmet)

            let damage_cnt = avatar.dices.axe - opponent.dices.helmet
            damage_cnt = Math.max(0, damage_cnt)

            // avatar.health += this.effectValue[level] * damage_cnt
            // avatar.health = Math.max(0, avatar.health)

            avatar.heal = this.effectValue[level] * damage_cnt

        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

        // weaponName : "hel-axe",
    },
    "Idun": {
        cost: [4, 7, 10],
        afterDecision: true,
        effectValue: [2, 4, 6],
        priority: 7,
        power : function (avatar, opponent, level){
            avatar.token -= this.cost[level]
            // avatar.health += this.effectValue[level]
            // avatar.health = Math.min(15, avatar.health)
            avatar.heal = this.effectValue[level]
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Loki": {
        title: {
            en: "Loki's Trick",
            kr: "로키의 계략"
        },
        description: {
            en: "Ban opponent's dice for the Round.",
            kr: "상대의 주사위를 골라<br>이번 라운드에서 배제합니다."
        },
        spec_en: function (level) { return `Ban ${this.effectValue[level]} dice` },
        spec_kr: function (level) { return `주사위 ${this.effectValue[level]} 개 배제` },
        cost: [3, 6, 9],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 2,
        extraInput: {
            trigger: "Resolution",
            user: "bottom",
            godfavor: "Loki"
        },
        color: 0x999999
    },
    "Mimir": {
        cost: [3, 5, 7],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 4,
        power : function (avatar, opponent, level){
            avatar.token -= this.cost[level]

            let axe_dmg = Math.max(0, opponent.dices.axe - avatar.dices.helmet)
            let arrow_dmg = Math.max(0, opponent.dices.arrow - avatar.dices.shield)

            // avatar.health += this.effectValue[level] * (axe_dmg + arrow_dmg)
            // avatar.health = Math.min(15, avatar.health)
            avatar.heal = this.effectValue[level] * (axe_dmg + arrow_dmg)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Odin": {
        cost: [6, 8, 10],
        afterDecision: true,
        effectValue: [3, 4, 5],
        priority: 7,
        power : function (avatar, opponent, level, input){
            avatar.token -= this.cost[level]

            let sacrificed_hp = input

            avatar.damage = sacrificed_hp

            // avatar.health -= sacrificed_hp
            avatar.token += sacrificed_hp * this.effectValue[level]

            // avatar.health = Math.max(0, avatar.health)
            avatar.token = Math.min(50, avatar.token)
        },
        effect : function (avatar, opponent, level){
            let rets = []
            let inputs_ = []

            let limit_sacrifice = Math.min(10, avatar.health)

            for (let sacrificed_hp_ = 1; sacrificed_hp_ < limit_sacrifice; sacrificed_hp_++){
                let avatar_tmp = JSON.parse(JSON.stringify(avatar))
                let opponent_tmp = JSON.parse(JSON.stringify(opponent))

                this.power(avatar_tmp, opponent, level, sacrificed_hp_)
                rets.push({avatar : avatar_tmp, opponent : opponent_tmp})
                inputs_.push(sacrificed_hp_)
            }

            return [rets, inputs_]
        }
    },
    "Skadi": {
        cost: [6, 10, 14],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            avatar.arrow += (this.effectValue[level] + 1) * avatar.dices.arrow
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }
    },
    "Skuld": {
        cost: [4, 6, 8],
        afterDecision: false,
        effectValue: [2, 3, 4],
        priority: 3,
        power: function (avatar, opponent, level) {
            // console.log("before : ", opponent.token)
            avatar.token -= this.cost[level]
            opponent.token -= this.effectValue[level] * avatar.dices.arrow

            opponent.token = Math.max(0, opponent.token)
            // console.log("after : " , opponent.token)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }
        // weaponName : "SkadiArrow"
    },
    "Thor": {
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost: [4, 8, 12],
        afterDecision: true,
        effectValue: [2, 5, 8],
        priority: 6,
        power : function (avatar, opponent, level){
            avatar.token -= this.cost[level]
            // opponent.health -= this.effectValue[level]
            // opponent.health = Math.max(0, opponent.health)
            opponent.damage = this.effectValue[level]
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return {avatar, opponent}
        }
    },
    "Thrymr": {
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost: [3, 6, 9],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 1,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            opponent.token -= this.effectValue[level] * 4
            opponent.token = Math.max(0, opponent.token)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }
    },
    "Tyr": {
        cost: [4, 6, 8],
        afterDecision: false,
        effectValue: [2, 3, 4],
        priority: 3,
        extraInput: {
            trigger: "Resolution",
            user: "bottom",
            godfavor: "Tyr"
        },
        power : function (avatar, opponent, level, input){
            avatar.token -= this.cost[level]

            let sacrificed_hp = input

            // avatar.health -= sacrificed_hp
            avatar.damage = sacrificed_hp
            opponent.token -= sacrificed_hp * this.effectValue[level]

            // avatar.health = Math.max(0, avatar.health)
            opponent.token = Math.max(0, opponent.token)
        },
        effect : function (avatar, opponent, level){
            let rets = []
            let inputs_ = []

            let limit_sacrifice = Math.min(10, avatar.health)

            for (let sacrificed_hp_ = 1; sacrificed_hp_ < limit_sacrifice; sacrificed_hp_++){
                let avatar_tmp = JSON.parse(JSON.stringify(avatar))
                let opponent_tmp = JSON.parse(JSON.stringify(opponent))

                this.power(avatar_tmp, opponent, level, sacrificed_hp_)
                rets.push({avatar : avatar_tmp, opponent : opponent_tmp})
                inputs_.push(sacrificed_hp_)
            }

            return [rets, inputs_]
        }
    },
    "Ullr": {
        cost: [2, 3, 4],
        afterDecision: false,
        effectValue: [2, 3, 6],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            opponent.dices.shield -= this.effectValue[level]
            opponent.dices.shield = Math.max(0, opponent.dices.shield)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }
    },
    "Var": {
        cost: [10, 14, 18],
        afterDecision: false,
        effectValue: [1, 2, 3],
        priority: 1,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            // avatar.health += 10
            // avatar.heal = 10

            // avatar.health = Math.min(15, avatar.health)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }

    },
    "Vidar": {
        cost: [2, 4, 6],
        afterDecision: false,
        effectValue: [2, 4, 6],
        priority: 4,
        power: function (avatar, opponent, level) {
            avatar.token -= this.cost[level]
            opponent.dices.helmet -= this.effectValue[level]
            opponent.dices.helmet = Math.max(0, opponent.dices.helmet)
        },
        effect : function (avatar, opponent, level){
            this.power(avatar, opponent, level)
            return { avatar, opponent }
        }
    }


}



const dice_face = ["right", "left", "top", "bottom", "front", "back"]


const diceFaceInfo = [{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "arrow", token: true },
    "back": { weapon: "steal", token: true }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "steal", token: true },
    "front": { weapon: "arrow", token: false },
    "back": { weapon: "helmet", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "arrow", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "shield", token: false }
},

{
    "right": { weapon: "arrow", token: false },
    "left": { weapon: "shield", token: false },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: true },
    "front": { weapon: "steal", token: true },
    "back": { weapon: "axe", token: false }
},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "helmet", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "arrow", token: true }

},

{
    "right": { weapon: "axe", token: false },
    "left": { weapon: "shield", token: true },
    "top": { weapon: "axe", token: false },
    "bottom": { weapon: "arrow", token: false },
    "front": { weapon: "steal", token: false },
    "back": { weapon: "helmet", token: true }

}]