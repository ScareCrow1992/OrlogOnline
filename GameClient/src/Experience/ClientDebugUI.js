import Experience from './Experience.js'


export default class ClientDebugUI {
    constructor() {
        // super()
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.controller = this.experience.controller;

        // this.physics = physics
        // this.game = game

        this.setDebug()
    }



    setDebug() {
        if (this.debug.active) {
            this.situationViewerDom = document.getElementById("situation-viewer")
            this.situationViewerHeader = document.getElementById("situation-header")
            this.situationViewerTop = document.getElementById("situation-top")
            this.situationViewerBottom = document.getElementById("situation-bottom")

            let dummy = 0;

            // this.mainfolder = this.debug.ui.addFolder("Game");
            // this.mainfolder.add(this, "_DBG_ConsoleReset")
            //     .name("[Console] Refresh")
            // this.mainfolder.add(this, "_DBG_ConsoleFold")
            //     .name("[Console] Fold")
            // this.mainfolder.add(this, "_DBG_ConsoleUnfold")
            //     .name("[Console] Unfold")
            // this.mainfolder.add(this, "GetToken")
            //     .name("[Game] GetToken")


            let avatars = ["top", "bottom"]

            this.info = {
                top: {
                    // rollDices: () => { this.RollDices("top") },
                    // PhysicsRollDices: () => { this.PhysicsRollDices("top") },
                    // bellPushed: () => { this.BellPushed("top") },
                    // dice: 0,
                    // chooseDice: () => { superVisor.DEV_ChooseDice("top", this.info["top"].dice, this.controller) },
                    // cancleDice: () => { superVisor.DEV_CancleDice("top", this.info["top"].dice, this.controller) },
                    turnOndiceColor: () => { this._DBG_TurnOnDiceColor("top") },
                    turnOffdiceColor: () => { this._DBG_TurnOffDiceColor("top") },
                    turnOnFaceColor: () => { this._DBG_TurnOnFaceColor("top") },
                    turnOffFaceColor: () => { this._DBG_TurnOffFaceColor("top") }
                },
                bottom: {
                    // rollDices: () => { this.RollDices("bottom") },
                    // PhysicsRollDices: () => { this.PhysicsRollDices("bottom") },
                    // bellPushed: () => { this.BellPushed("bottom") },
                    // dice: 0,
                    // chooseDice: () => { superVisor.DEV_ChooseDice("bottom", this.info["bottom"].dice, this.controller) },
                    // cancleDice: () => { superVisor.DEV_CancleDice("bottom", this.info["bottom"].dice, this.controller) },
                    turnOndiceColor: () => { this._DBG_TurnOnDiceColor("bottom") },
                    turnOffdiceColor: () => { this._DBG_TurnOffDiceColor("bottom") },
                    turnOnFaceColor: () => { this._DBG_TurnOnFaceColor("bottom") },
                    turnOffFaceColor: () => { this._DBG_TurnOffFaceColor("bottom") }
                }
            }

            avatars.forEach(avatar => {
                this.debugFolder = this.debug.ui.addFolder(`${avatar}`);

                // this.debugFolder.add(this.info[`${avatar}`], "rollDices").name("[Avatar] Roll Dices")
                // // this.debugFolder.add(this.info[`${avatar}`], "physicsRollDices").name("[Avatar] Physics Roll Dices")
                // this.debugFolder.add(this.info[`${avatar}`], "bellPushed").name("[Avatar] Bell Pushed")

                this.debugFolder.add(this.info[`${avatar}`], "turnOndiceColor").name("[Visual] Turn On Dice Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOffdiceColor").name("[Visual] Turn Off Dice Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOnFaceColor").name("[Visual] Turn On Face Color")
                this.debugFolder.add(this.info[`${avatar}`], "turnOffFaceColor").name("[Visual] Turn Off Face Color")


                // this.debugFolder.add(this.info[`${avatar}`], "dice", { "red": 0, "yellow": 1, "green": 2, "sky": 3, "blue": 4, "purple": 5 })
                //     .name("[Dice] Select")

                // this.debugFolder.add(this.info[`${avatar}`], "chooseDice").name("[Dice] Choose")
                // this.debugFolder.add(this.info[`${avatar}`], "cancleDice").name("[Dice] Cancle")

            })
        }
    }


    printSituation(obj, head) {
        let ret = ""
        if (typeof obj === "object") {
            for (const [key, value] of Object.entries(obj)) {
                // Object.keys(obj).forEach(key => {
                ret += `\n${head}${key} : `
                ret += this.printSituation(value, head + "　　")
                ret += ` `
            }
        }
        else if (Array.isArray(obj)) {
            obj.forEach(value => {
                ret += this.printSituation(value, head + ", ")
            })
        }
        else if (typeof obj === "function") {
        }
        else {
            return obj;
        }

        return ret;
    }



    _DBG_ConsoleReset() {
        this.situationViewerHeader.innerText = `
            phase : ${superVisor.Situation.phase}
            turnNum : ${superVisor.Situation.turnNum}
            order : ${superVisor.Situation.order}
        `
        this.situationViewerTop.innerText = this.printSituation(superVisor.Situation.player.top, "")
        this.situationViewerBottom.innerText = this.printSituation(superVisor.Situation.player.bottom, "")

    }

    _DBG_ConsoleFold() {
        this.situationViewerDom.classList.remove("visible")
    }

    _DBG_ConsoleUnfold() {
        this.situationViewerDom.classList.add("visible")
    }



    _DBG_TurnOnDiceColor(avatar_) {
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()) {
            let hue = index / avatar.dices.length
            avatar.SetDiceMaterialColor(index, [hue, 1, 0.75]);
        }

    }


    _DBG_TurnOffDiceColor(avatar_) {
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()) {
            avatar.ResetDiceMaterialColor(index);
        }

    }


    _DBG_TurnOnFaceColor(avatar_) {
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()) {
            avatar._DBG_SetDiceFaceColor(index)
        }
    }


    _DBG_TurnOffFaceColor(avatar_) {
        let avatar = this.controller.avatars[`${avatar_}`]

        for (const index of Array(avatar.dices.length).keys()) {
            avatar._DBG_ResetDiceFaceColor(index)
        }
    }
}