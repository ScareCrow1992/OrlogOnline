export default class Node{
    constructor(parent_){

        this.parent = parent_


    }



    get grand_father(){
        if(this.parent == null)
            return null

        return this.parent.parent
    }

}