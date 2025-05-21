// 서버, 클라이언트 공유 데이터
export default {
    "Baldr": {
        title : {
            en : "Baldr's Invulnerability",
            kr : "발드르의 무적"
        },
        description: { 
            en: "Add {HELMET} for each die that rolled {HELMET}.<br>Add {SHIELD} for each die that rolled {SHIELD}." ,
            kr: "{HELMET} 주사위마다 {HELMET}을 추가합니다.<br>{SHIELD} 주사위마다 {SHIELD}를 추가합니다."
        },
        spec_en : function(level){return `+${this.effectValue[level]} {HELMET} & {SHIELD} per die`},
        spec_kr : function(level){return `{HELMET} & {SHIELD} 1개당 +${this.effectValue[level]}`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff9900,
        // weaponName : "BrunhildAxe"
    },
    "Bragi": {
        title : {
            en : "Bragi's Verve",
            kr : "브라기의 활력"
        },
        description : {
            en : "Gain ⌘ for each die that rolled a {STEAL}.",
            kr : "{STEAL} 주사위마다 ⌘ 을 획득합니다."
        },
        spec_en : function(level){return `Gain ${this.effectValue[level]} ⌘ per die`},
        spec_kr : function(level){return `주사위 1개당 ⌘ ${this.effectValue[level]} 개 획득`},
        cost : [4, 8, 12],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xa47c00,
        // weaponName : "BrunhildAxe"
    },
    "Brunhild": {
        title: {
            en : "Brunhild's Fury",
            kr : "브룬힐드의 분노"
        },
        description: {
            en: "Multiply each {AXE} die.<br>Round up to a whole number.",
            kr: "{AXE} 개수에 곱하기를 합니다. <br>소수점 아래는 올림합니다."
        },
        spec_en : function(level){return `x${this.effectValue[level]} {AXE}`},
        spec_kr : function(level){return `{AXE} x${this.effectValue[level]}`},
        cost : [6, 10, 18],
        afterDecision : false,
        effectValue : [1.5, 2, 3],
        priority : 4,
        color : 0x1155cc,
        // weaponName : "BrunhildAxe"
    },
    "Freyja": {
        title : {
            en : "Freyja's Plenty",
            kr : "프레이야의 풍요"
        },
        description : {
            en: "Roll additional dice this round.",
            kr: "이번 라운드에서 주사위를 추가로 굴립니다."
        },
        spec_en : function(level){return `+${this.effectValue[level]} dice`},
        spec_kr : function(level){return `+${this.effectValue[level]} 주사위`},
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [1,2,3],
        priority : 2,
        color : 0xff00ff,
        modelName : "FreyjaDice"
    },
    "Freyr": {
        title : {
            en : "Freyr's Gift",
            kr : "프레이의 선물"
        },
        description : {
            en: "Add to the total of whichever die face is in majority.",
            kr: "가장 많이 나온 주사위 면 개수를 증가시킵니다. (동률이면 그중 임의의 주사위 면)"
        },
        spec_en : function(level){return `+${this.effectValue[level]}`},
        spec_kr : function(level){return `+${this.effectValue[level]}`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xff93ff
    },
    "Frigg": {
        title : {
            en : "Frigg's Sight",
            kr : "프리그의 시야"
        },
        description : {
            en: "Re-roll any of your, or your opponent's, dice.",
            kr: "자신 또는 상대의 주사위를 다시 굴립니다."
        },
        spec_en : function(level){return `Re-roll ${this.effectValue[level]} dice`},
        spec_kr : function(level){return `주사위 ${this.effectValue[level]} 개를 다시 굴립니다.`},
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 2,
        extraInput : {
            trigger : "Resolution",
            user : "bottom",
            godfavor : "Frigg"
        },
        color : 0xd9d9d9
    },
    "Heimdall": {
        title : {
            en : "Heimdall's Watch",
            kr : "헤임달의 경계"
        },
        description : {
            en: "Gain health tokens for each attack you block.",
            kr: "상대의 공격을 방어할 때마다<br>체력을 회복합니다."
        },
        spec_en : function(level){return `+ ${this.effectValue[level]} HP per Block`},
        spec_kr : function(level){return `방어 1회 당 HP +${this.effectValue[level]} `},
        cost : [4, 7, 10],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0x674ea7
    },
    "Hel": {
        title : {
            en : "Hel's Grip",
            kr : "헬의 손아귀"
        },
        description : {
            en: "Each {AXE} damage dealt to the opponent heals you.",
            kr: "상대에게 입힌 {AXE} 피해마다<br>자신의 체력을 회복합니다."
        },
        spec_en : function(level){return `+ ${this.effectValue[level]} HP per damage`},
        spec_kr : function(level){return `피해 1 당 HP +${this.effectValue[level]}`},
        cost : [6, 12, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        // weaponName : "hel-axe",
        color : 0x38761d
    },
    "Idun": {
        title : {
            en : "Idun's Rejuvenation",
            kr : "이둔의 회춘"
        },
        description : {
            en: "Gain health tokens.",
            kr: "체력을 회복합니다."
        },
        spec_en : function(level){return `Heal ${this.effectValue[level]} HP`},
        spec_kr : function(level){return `체력 ${this.effectValue[level]} 회복`},
        cost : [4, 7, 10],
        afterDecision : true,
        effectValue : [2, 4, 6],
        priority : 7,
        color : 0xffff00
    },
    "Loki": {
        title : {
            en : "Loki's Trick",
            kr : "로키의 계략"
        },
        description : {
            en: "Ban opponent's dice for the Round.",
            kr: "상대의 주사위를 골라<br>이번 라운드에서 배제합니다."
        },
        spec_en : function(level){return `Ban ${this.effectValue[level]} dice`},
        spec_kr : function(level){return `주사위 ${this.effectValue[level]} 개 배제`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 2,
        extraInput : {
            trigger : "Resolution",
            user : "bottom",
            godfavor : "Loki"
        },
        color : 0x999999
    },
    "Mimir": {
        title : {
            en : "Mimir's Wisdom",
            kr : "미미르의 지혜"
        },
        description: {
            en: "Gain ⌘ for each attack dealt to you causing damage.",
            kr: "자신에게 피해를 입힌 공격마다<br>⌘ 을 획득합니다."
        },
        spec_en : function(level){return `+ ${this.effectValue[level]} ⌘ per damage`},
        spec_kr : function(level){return `입은 피해 당 ⌘ ${this.effectValue[level]} 개 획득`},
        cost : [3, 5, 7],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xfcd048
    },
    "Odin": {
        title : {
            en : "Odin's Sacrifice",
            kr : "오딘의 희생"
        },
        description : {
            en: "Sacrifice any number of your health tokens and gain ⌘ per health token sacrificed.",
            kr: "자신의 체력을 원하는 만큼 희생하여<br>⌘ 을 획득합니다."
        },
        spec_en : function(level){return `Gain ${this.effectValue[level]} ⌘ per health token`},
        spec_kr : function(level){return `희생한 체력 1당 ⌘ ${this.effectValue[level]} 개 획득`},
        cost : [6, 8, 10],
        afterDecision : true,
        effectValue : [3, 4, 5],
        priority : 7,
        extraInput : {
            trigger : "Resolution",
            user : "bottom",
            godfavor : "Odin"
        },
        color : 0xffffff
    },
    "Skadi": {
        title : {
            en : "Skadi's Hunt",
            kr : "스칼디의 사냥"
        },
        description : {
            en: "Add {ARROW} for each die that rolled {ARROW}",
            kr: "{ARROW} 주사위마다 {ARROW} 을 추가합니다."
        },
        spec_en : function(level){return `+${this.effectValue[level]} {ARROW} per die`},
        spec_kr : function(level){return `{ARROW} ${this.effectValue[level]} 개 추가`},
        cost : [6, 10, 14],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff0000,
        // weaponName : "SkadiArrow"
    },
    "Skuld": {
        title : {
            en : "Skuld's Claim",
            kr : "스쿨드의 압수"
        },
        description : {
            en: "Destroy apponent's ⌘ for each die that rolled {ARROW}",
            kr: "자신의 {ARROW} 주사위마다<br>상대의 ⌘ 을 파괴합니다."
        },
        spec_en : function(level){return `-${this.effectValue[level]} ⌘ per die`},
        spec_kr : function(level){return `주사위 1개당 ⌘ ${this.effectValue[level]} 개 파괴`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x3da5ad,
        // weaponName : "SkadiArrow"
    },
    "Thor": {
        title : {
            en : "Thor's Strike",
            kr : "토르의 일격"
        },
        description : {
            en: "Deal damage to the opponent.",
            kr: "상대에게 피해를 입힙니다."
        },
        spec_en : function(level){return `-${this.effectValue[level]} HP`},
        spec_kr : function(level){return `${this.effectValue[level]} 피해`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [4, 8, 12],
        afterDecision : true,
        effectValue : [2, 5, 8],
        priority : 6,
        color : 0x00ffff,
    },
    "Thrymr": {
        title : {
            en : "Thrymr's Theft",
            kr : "스림의 도둑질"
        },
        description : {
            en: "Reduce the effect level of the God Favor invoked by opponent this turn.",
            kr: "상대가 이번 라운드에 불러낸<br>신의 축복 효과를 낮춥니다."
        },
        spec_en : function(level){return `Reduce ${this.effectValue[level]} level`},
        spec_kr : function(level){return `${this.effectValue[level]}단계 낮춥니다.`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x000000,
    },
    "Tyr": {
        title : {
            en : "Tyr's Pledge",
            kr : "티르의 맹세"
        },
        description: {
            en: "Sacrifice any number of your health tokens to destroy opponent's ⌘",
            kr: "자신의 체력을 원하는 만큼 희생하여 상대의 ⌘ 을 파괴합니다."
        },
        spec_en : function(level){return `Destroy ${this.effectValue[level]} ⌘ per HP`},
        spec_kr : function(level){return `희생한 체력 1 당 ⌘ ${this.effectValue[level]}개 파괴`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        extraInput : {
            trigger : "Resolution",
            user : "bottom",
            godfavor : "Tyr"
        },
        color : 0x9900ff,
    },
    "Ullr": {
        title : {
            en : "Ullr's Aim",
            kr : "울르의 조준"
        },
        description : {
            en: "Your {ARROW} bypasses the opponent's {SHIELD}",
            kr: "자신의 {ARROW} 이 상대의 {SHIELD} 를 무시합니다."
        },
        spec_en : function(level){return `${this.effectValue[level]} {ARROW} bypasses {SHIELD}`},
        spec_kr : function(level){return `{ARROW} ${this.effectValue[level]}개가 {SHIELD} 무시`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 6],
        priority : 4,
        color : 0x93c47d
    },
    "Var": {
        title : {
            en : "Var's Bond",
            kr : "바르의 결속"
        },
        description : {
            en: "Each ⌘ spent by your opponent heals you.",
            kr: "상대가 소비한 ⌘ 마다 자신의 체력을<br>회복합니다."
        },
        spec_en : function(level){return `+${this.effectValue[level]} HP per ⌘`},
        spec_kr : function(level){return `⌘ 1개당 HP +${this.effectValue[level]}`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [10, 14, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x00ff00
    },
    "Vidar": {
        title : {
            en : "Vidar's Might",
            kr : "비다르의 힘"
        },
        description : {
            en: "Remove rolled {HELMET} dice from opponent.",
            kr: "상대의 {HELMET}을 제거합니다."
        },
        spec_en : function(level){return `-${this.effectValue[level]} {HELMET}`},
        spec_kr : function(level){return `-${this.effectValue[level]} {HELMET}`},
        // spec_en : "Deal -${level * 3 + 2} HP",
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [2, 4, 6],
        priority : 4,
        color : 0xcc4125
    }


}