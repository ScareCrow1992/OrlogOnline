import step from "./steps/step.js"
import Edge from "./Edge.js"

const ROLL = 0
const GODFAVOR = 1



export default class Node{
    constructor(machine, edge_from){

        this.state = null
        this.edges = []

        this.edge_from = edge_from

        this.machine = machine
        this.value = 0
        this.value_acc = 0



        // this.N = 1  // 롤아웃 횟수
        // this.W = 0  // 승률
        

    }



    Get_Expected_Value(){

    }


    Backpropagation(){

    }




    async Play(){
        let [actions, value] = this.machine.Predict(this.state, this.type)

        let playout_cnt = 8
        let playout_counts = new Array(actions.length).fill(0)
        for (let i = 0; i < playout_cnt; i++) {
            let ret = this.PlayOut(actions);

            for(let j =0; j<actions.length; j++){
                playout_counts[j] += ret[j]
            }

        }
        


    }




    async PlayOut(){

    }



    Step(action){


    }



    CreateNode(state, action){

    }




}