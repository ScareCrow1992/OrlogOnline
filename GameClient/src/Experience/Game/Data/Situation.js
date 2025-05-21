

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


// const godFavorNames = ["Baldr", "Bragi", "Brunhild", "Freyja", "Freyr", "Frigg", "Heimdall", "Hel", "Idun", "Loki", "Mimir", "Odin", "Skadi", "Skuld", "Thor", "Thrymr", "Tyr", "Ullr", "Var", "Vidar"];


export default {
    round : 0,
    phase_: "roll",     // "roll" "godfavor" "resolution" "end"
    set phase(rValue){
        this.phase_ = rValue
        // console.log(rValue)
    },
    get phase(){
        return this.phase_
    },
    turnNum: 0,
    order: [0, 1],
    turnEnd : [false, false],
    preparedGodFavor : [
        {godfavorIndex : -1, level: -1, godfavorNameIndex: -1},
        {godfavorIndex : -1, level: -1, godfavorNameIndex: -1}
    ],
    // resolution = [ { cmd : godfavor, avatar : 0, index : 1 } ]
    resolutionCallbacks : [],
    resolutionCallIndex : 0,
    resolutionWaitInputForUser : -1,
    inputInfo : {},
    extraInput : {},
    winner : "none",
    orderSwap : function (){
        this.order[0] = this.order[1]
        this.order[1] = 1 - this.order[0]
    },
    player: [
        {
            godFavors : [12, 4, 14],
            health: 15,
            token: 0,
            dices:
                [{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[0][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[0][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[1][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[1][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[2][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[2][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[3][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[3][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[4][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[4][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[5][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[5][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                }]
                // [{
                //     dir: "top", weapon: function () { return diceFaceInfo[0][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[0][`${this.dir}`].token }, state: "tray"
                // }, {
                //     dir: "top", weapon: function () { return diceFaceInfo[1][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[1][`${this.dir}`].token }, state: "tray"
                // }, {
                //     dir: "top", weapon: function () { return diceFaceInfo[2][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[2][`${this.dir}`].token }, state: "tray"
                // }, {
                //     dir: "top", weapon: function () { return diceFaceInfo[3][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[3][`${this.dir}`].token }, state: "tray"
                // }, {
                //     dir: "top", weapon: function () { return diceFaceInfo[4][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[4][`${this.dir}`].token }, state: "tray"
                // }, {
                //     dir: "top", weapon: function () { return diceFaceInfo[5][`${this.dir}`].weapon },
                //     token: function () { return diceFaceInfo[5][`${this.dir}`].token }, state: "tray"
                // }]
            // state = "tray, chosen, waiting"
        },
        {
            godFavors : [2, 4, 14],
            health: 15,
            token: 0,
            dices:
                [{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[0][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[0][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[1][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[1][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[2][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[2][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[3][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[3][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[4][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[4][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                },{
                    dir : "top", 
                    get weapon() { return diceFaceInfo[5][`${this.dir}`].weapon },
                    get token(){ return diceFaceInfo[5][`${this.dir}`].token },
                    state : "tray",
                    power : 1
                }]
            // state = "tray, chosen, waiting"
        }
    ]
}



