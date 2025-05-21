
let config = {
    socket_limit : 1000,
    animation_time : {},
    limited_time : {},
    need_sync_cmds : [],
    need_timer_cmds : [],
    dice_face_info : [{
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
}

global.config = config

export default config