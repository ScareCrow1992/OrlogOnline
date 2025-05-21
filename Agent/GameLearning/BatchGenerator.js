

export default class BatchGenerator{

    constructor(roll_model, godfavor_model){

        this.roll_model = roll_model
        this.godfavor_model = godfavor_model


        setTimeout(()=>{ this.Predict_Roll() }, 250)

        setTimeout(() => { this.Predict_Godfavor() }, 250)


        this.roll_predict_resolves = []
        this.godfavor_predict_resolves = []


        
        this.roll_predict_args = {
            "state" : [],
            "mask" : []
        }

        this.godfavor_predict_args = {
            "state" : [],
            "mask" : []
        }


    }



    async AI_Request_Predict_Roll(state, mask){
        let res_ = null
        let promise_ = new Promise(res => {
            res_ = res
        })

        this.roll_predict_resolves.push(res_)
        this.roll_predict_args.state.push(state)
        this.roll_predict_args.mask.push(mask)

        // if(this.roll_predict_resolves.length > 60){
        //     // console.log("Roll Pop")
        //     this.Predict_Roll()
        // }

        return promise_
    }



    async AI_Request_Predict_Godfavor(state, mask){
        let res_ = null
        let promise_ = new Promise(res => {
            res_ = res
        })

        this.godfavor_predict_resolves.push(res_)
        this.godfavor_predict_args.state.push(state)
        this.godfavor_predict_args.mask.push(mask)

        
        // if(this.godfavor_predict_resolves.length > 60){
        //     // console.log("Godfavor Pop")
        //     this.Predict_Godfavor()
        // }


        return promise_

    }



    async Predict_Roll(){
        if(this.roll_predict_resolves.length == 0){        
            // this.Predict_Roll() 
            setTimeout(()=>{ this.Predict_Roll() }, 10)
            return
        }

        // console.log("roll : ", this.roll_predict_resolves.length)
        
        let resolves = this.roll_predict_resolves
        this.roll_predict_resolves = []

        let states = this.roll_predict_args["state"]
        this.roll_predict_args["state"] = []

        let masks = this.roll_predict_args["mask"]
        this.roll_predict_args["mask"] = []

        // let msg = await global.Redis_Adapter.AI_Request_Predict(states, masks, 0)
        // console.log(msg)
        // let action_arr = msg.data[0]
        // let value_arr = msg.data[1]

        let msg_ = await this.roll_model.Predict(states, masks)
        let action_arr = msg_[0]
        let value_arr = msg_[1]
        
        let length_ = resolves.length

        if(resolves.length != action_arr.length){
            console.log("warning!!! - Roll")
        }

        for (let i = 0; i < length_; i++) {
            let actions_ = action_arr[i]
            let value_ = value_arr[i][0]

            let res_ = resolves[i]

            res_([actions_, value_])

        }

        this.Predict_Roll() 
        // setTimeout(()=>{ this.Predict_Roll() }, 10)

    }


    async Predict_Godfavor(){
        if(this.godfavor_predict_resolves.length == 0){
            setTimeout(() => { this.Predict_Godfavor() }, 10)
            // this.Predict_Godfavor()
            return
        }

        // console.log("godfavor : " ,this.godfavor_predict_resolves.length)

        let resolves = this.godfavor_predict_resolves
        this.godfavor_predict_resolves = []

        let states = this.godfavor_predict_args["state"]
        this.godfavor_predict_args["state"] = []

        let masks = this.godfavor_predict_args["mask"]
        this.godfavor_predict_args["mask"] = []


        // let msg = await global.Redis_Adapter.AI_Request_Predict(states, masks, 1)
        // let action_arr = msg.data[0]
        // let value_arr = msg.data[1]

        let msg_ = await this.godfavor_model.Predict(states, masks)
        let action_arr = msg_[0]
        let value_arr = msg_[1]

        if(resolves.length != action_arr.length){
            console.log("warning!!! - Godfavor")
        }
        
        let length_ = resolves.length
        for (let i = 0; i < length_; i++) {
            let actions_ = action_arr[i]
            let value_ = value_arr[i][0]

            let res_ = resolves[i]

            res_([actions_, value_])

        }

        this.Predict_Godfavor()
        // setTimeout(() => { this.Predict_Godfavor() }, 10)
    }

}