// import { Random } from "random-js";
// const random = new Random();

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




function DataParse(avatars_info, avatar_index){

    let roll__ = undefined
    if (avatars_info.Round < 2)
        roll__ = 1
    else
        roll__ = 0

    let opponent_index, agent_index;

    if (avatars_info.First == avatar_index) {
        // console.log("agent is first")
        agent_index = 0
        opponent_index = 1
    }
    else {
        // console.log("agent is second")
        agent_index = 1
        opponent_index = 0
    }


    // let opponent_index = 1 - avatar_index

    let tmp_info = {
        godFavors : null,
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

    let agent_info = JSON.parse(JSON.stringify(tmp_info))
    let opponent_info = JSON.parse(JSON.stringify(tmp_info))

    let situation_info = {
        order : agent_index,
        roll : roll__
    }

    let index_ = agent_index
    agent_info.health = avatars_info[`HP-${index_}`]
    agent_info.token = avatars_info[`Token-${index_}`]
    agent_info.dices.mark = avatars_info[`Mark-${index_}`]
    agent_info.dices.axe = avatars_info[`Weapon-${index_}`][0]
    agent_info.dices.arrow = avatars_info[`Weapon-${index_}`][1]
    agent_info.dices.helmet = avatars_info[`Weapon-${index_}`][2]
    agent_info.dices.shield = avatars_info[`Weapon-${index_}`][3]
    agent_info.dices.steal = avatars_info[`Weapon-${index_}`][4]
    agent_info.dices.empty = 6 - (agent_info.dices.axe + agent_info.dices.arrow + agent_info.dices.helmet + agent_info.dices.shield + agent_info.dices.steal)
    agent_info.godFavors = avatars_info[`Card-${index_}`]


    // console.log(agent_info.dices.empty)

    index_ = opponent_index
    opponent_info.health = avatars_info[`HP-${index_}`]
    opponent_info.token = avatars_info[`Token-${index_}`]
    opponent_info.dices.mark = avatars_info[`Mark-${index_}`]
    opponent_info.dices.axe = avatars_info[`Weapon-${index_}`][0]
    opponent_info.dices.arrow = avatars_info[`Weapon-${index_}`][1]
    opponent_info.dices.helmet = avatars_info[`Weapon-${index_}`][2]
    opponent_info.dices.shield = avatars_info[`Weapon-${index_}`][3]
    opponent_info.dices.steal = avatars_info[`Weapon-${index_}`][4]
    opponent_info.dices.empty = 6 - (opponent_info.dices.axe + opponent_info.dices.arrow + opponent_info.dices.helmet + opponent_info.dices.shield + opponent_info.dices.steal)
    opponent_info.godFavors = avatars_info[`Card-${index_}`]




    // console.log(agent_info)
    // console.log(opponent_info)

    return [agent_info, opponent_info, situation_info]

}



function Get_Candidate_Info(avatar_info, dices_dir, dices_cnt, select_mask){
    let new_info = JSON.parse(JSON.stringify(avatar_info))

    select_mask.forEach((select_bit, index)=>{
        if(select_bit == true){
            let dir_ = dices_dir[index]
            let weapon_ = diceFaceInfo[index][`${dir_}`].weapon
            
            new_info.dices[`${weapon_}`]++
            new_info.dices["empty"]--

            let token_ = diceFaceInfo[index][`${dir_}`].token
            if(token_ == true)
                new_info.dices["mark"]++
        }
    })



    return new_info
}


function Get_Candidate_Info_Multiple(avatar_info, opponent_info, situation_info, dices_dir, dices_cnt){
    let ret = []
    let limit_ = Math.pow(2, dices_cnt)

    let bit_mask_arr = []


    for(let mask_ = 0; mask_ < limit_; mask_++){
        let bit_mask_partly = mask_.toString(2)
        bit_mask_partly = bit_mask_partly.padStart(dices_cnt, "0")

        let bit_mask = new Array(6).fill(false)

        let index_partly = 0
        for (let i = 0; i < 6; i++) {
            if(dices_dir[i] != null){
                bit_mask[i] = bit_mask_partly[index_partly] == "1" ? true : false 
                index_partly++
            }
        }

        // console.log("dices dir : ", dices_dir)
        // console.log("bit mask : ", bit_mask)
        // console.log("empty cnt : ", avatar_info.dices.empty)
        // console.log(avatar_info.dices)


        let new_info = Get_Candidate_Info(avatar_info, dices_dir, dices_cnt, bit_mask)
        let new_info_opponent = JSON.parse(JSON.stringify(opponent_info))
        let new_info_situation = JSON.parse(JSON.stringify(situation_info))

        ret.push({avatar : new_info, opponent : new_info_opponent, situation : new_info_situation})

        bit_mask_arr.push(bit_mask)

    }

    return [ret, bit_mask_arr]
}




// dices_dir = [ 'back', 'left', null, 'left', null, 'bottom' ]
// dices_cnt = 4
export default function(avatars_info, avatar_index, dices_dir, dices_cnt, depth){
    let [avatar, opponent, situation] = DataParse(avatars_info, avatar_index)
    let [cmds, bit_mask_arr] = Get_Candidate_Info_Multiple(avatar, opponent, situation, dices_dir, dices_cnt)

    let [array_data, index_]= global.TensorModel.Predict(cmds, "roll", depth)

    return [array_data, bit_mask_arr, index_]

    
}