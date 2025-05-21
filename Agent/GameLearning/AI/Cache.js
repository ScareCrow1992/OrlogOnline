function createNDimArray(dimensions) {
    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        var newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
    } else {
        return undefined;
    }
}

export default class Cache{
    constructor(){
        let length_ = 210 * 210 * 20 * 20;

        this.instance = createNDimArray([15, 50, 15, 50, 2])
        // { win, lose }
    }


    /*
        key = [
            {
                godFavors : [0, 6, 13],
                health : 0,
                token : 0,
                heal: 0,
                damage : 0,
                dices : {
                    axe : 0,
                    arrow : 0,
                    helmet : 0,
                    shield : 0,
                    steal : 0,
                    empty : 0,
                    mark : 0
                }

            }    
        ]
    */
    Get(key_){
        let num = 999
        let string_key = num.toString()





    }





    Get_DiceCase(left_cnt, index){
        


    }




    

}


