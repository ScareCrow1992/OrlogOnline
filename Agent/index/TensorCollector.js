export default class TensorCollector{
    constructor(){

        this.garbages = []


    }


    push(tensor_){

        this.garbages.push(tensor_)

    }


    gc(){
        let garbages_ = this.garbages

        this.garbages = []

        garbages_.forEach(garbage_=>{
            garbage_.dispose()
        })



    }

}