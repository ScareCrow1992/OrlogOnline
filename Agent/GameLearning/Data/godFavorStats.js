
export default {
    "Baldr": {
        title : "Baldr's Invulnerability",
        description : "Add {HELMET} for each die that rolled {HELMET}.<br>Add {SHIELD} for each die that rolled {SHIELD}.",
        // spec : function(level){return `+${this.effectValue[level]} {HELMET} & {SHIELD} per die`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff9900,
        weaponName : "BrunhildAxe",
        extra_input : false
    },
    "Bragi": {
        title : "Bragi's Verve",
        description : "Gain ⌘ for each die that rolled a {STEAL}.",
        // spec : function(level){return `Gain ${this.effectValue[level]} ⌘ per die`},
        cost : [4, 8, 12],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xa47c00,
        weaponName : "BrunhildAxe",
        extra_input : false
    },
    "Brunhild": {
        title : "Brunhild's Fury",
        description : "Multiply each {AXE} die.<br>Round up to a whole number.",
        // spec : function(level){return `x${this.effectValue[level]} {AXE}`},
        cost : [6, 10, 18],
        afterDecision : false,
        effectValue : [1.5, 2, 3],
        priority : 4,
        color : 0x1155cc,
        weaponName : "BrunhildAxe",
        extra_input : false
    },
    "Freyja": {
        title : "Freyja's Plenty",
        description : "Roll additional dice this round.",
        // spec : function(level){return `+${this.effectValue[level]} dice`},
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [1,2,3],
        priority : 2,
        color : 0xff00ff,
        modelName : "FreyjaDice",
        extra_input : false
    },
    "Freyr": {
        title : "Freyr's Gift",
        description : "Add to the total of whichever die face is in majority.",
        // spec : function(level){return `+${this.effectValue[level]}`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 4,
        color : 0xff93ff,
        extra_input : false
    },
    "Frigg": {
        title : "Frigg's Sight",
        description : "Re-roll any of your, or your opponent's, dice.",
        // spec : function(level){return `Re-roll ${this.effectValue[level]} dice`},
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 2,
        color : 0xd9d9d9,
        extra_input : true
    },
    "Heimdall": {
        title : "Heimdall's Watch",
        description : "Gain health tokens for each attack you block.",
        // spec : function(level){return `+ ${this.effectValue[level]} HP per Block`},
        cost : [4, 7, 10],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0x674ea7,
        extra_input : false
    },
    "Hel": {
        title : "Hel's Grip",
        description : "Each {AXE} damage dealt to the opponent heals you.",
        // spec : function(level){return `+ ${this.effectValue[level]} HP per damage`},
        cost : [6, 12, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0x38761d,
        extra_input : false
    },
    "Idun": {
        title : "Idun's Rejuvenation",
        description : "Gain health tokenss.",
        // spec : function(level){return `Heal ${this.effectValue[level]} HP`},
        cost : [4, 7, 10],
        afterDecision : true,
        effectValue : [2, 4, 6],
        priority : 7,
        color : 0xffff00,
        extra_input : false
    },
    "Loki": {
        title : "Loki's Trick",
        description : "Ban opponent's dice for the Round.",
        // spec : function(level){return `Ban ${this.effectValue[level]} dice`},
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 2,
        color : 0x999999,
        extra_input : true
    },
    "Mimir": {
        title : "Mimir's Wisdom",
        description : "Gain ⌘ for each attack dealt to you causing damage.",
        // spec : function(level){return `+ ${this.effectValue[level]} ⌘ per damage`},
        cost : [3, 5, 7],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xfcd048,
        extra_input : false
    },
    "Odin": {
        title : "Odin's Sacrifice",
        description : "Sacrifice any number of your health tokens and gain ⌘ per health token sacrificed.",
        // spec : function(level){return `Gain ${this.effectValue[level]} ⌘ per health token`},
        cost : [6, 8, 10],
        afterDecision : true,
        effectValue : [3, 4, 5],
        priority : 7,
        color : 0xffffff,
        extra_input : true
    },
    "Skadi": {
        title : "Skadi's Hunt",
        description : "Add {ARROW} for each die that rolled {ARROW}",
        // spec : function(level){return `+${this.effectValue[level]} {ARROW} per die`},
        cost : [6, 8, 10],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 4,
        color : 0xff0000,
        extra_input : false
    },
    "Skuld": {
        title : "Skuld's Claim",
        description : "Destroy apponent's ⌘ for each die that rolled {ARROW}",
        // spec : function(level){return `-${this.effectValue[level]} ⌘ per die`},
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x3da5ad,
        weaponName : "SkadiArrow",
        extra_input : false
    },
    "Thor": {
        title : "Thor's Strike",
        description : "Deal damage to the opponent.",
        // spec : function(level){return `-${this.effectValue[level]} HP`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [4, 8, 12],
        afterDecision : true,
        effectValue : [2, 5, 8],
        priority : 6,
        color : 0x00ffff,
        extra_input : false
    },
    "Thrymr": {
        title : "Thrymr's Theft",
        description : "Reduce the effect level of the God Favor invoked by opponent this turn.",
        // spec : function(level){return `Reduce ${this.effectValue[level]} level`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [3, 6, 9],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x000000,
        extra_input : false
    },
    "Tyr": {
        title : "Tyr's Pledge",
        description : "Sacrifice any number of your health tokens to destroy opponent's ⌘",
        // spec : function(level){return `Destroy ${this.effectValue[level]} ⌘ per HP`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [4, 6, 8],
        afterDecision : false,
        effectValue : [2, 3, 4],
        priority : 3,
        color : 0x9900ff,
        extra_input : true
    },
    "Ullr": {
        title : "Ullr's Aim",
        description : "Your {ARROW} bypasses the opponent's {SHIELD}",
        // spec : function(level){return `${this.effectValue[level]} {ARROW} bypasses {SHIELD}`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [2, 3, 4],
        afterDecision : false,
        effectValue : [2, 3, 6],
        priority : 4,
        color : 0x93c47d,
        extra_input : false
    },
    "Var": {
        title : "Var's Bond",
        description : "Each ⌘ spent by your opponent heals you.",
        // spec : function(level){return `+${this.effectValue[level]} HP per ⌘`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [10, 14, 18],
        afterDecision : false,
        effectValue : [1, 2, 3],
        priority : 1,
        color : 0x00ff00,
        extra_input : false
    },
    "Vidar": {
        title : "Vidar's Might",
        description : "Remove rolled {HELMET} dice from opponent.",
        // spec : function(level){return `-${this.effectValue[level]} {HELMET}`},
        // spec : "Deal -${level * 3 + 2} HP",
        cost : [2, 4, 6],
        afterDecision : false,
        effectValue : [2, 4, 6],
        priority : 4,
        color : 0xcc4125,
        extra_input : false
    }


}



