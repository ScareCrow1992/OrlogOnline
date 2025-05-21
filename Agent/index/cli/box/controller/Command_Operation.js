import minimist from "minimist"



function INT(data){
    // data = parseInt(data)
    if(Number.isInteger(data))
        return true
    else
        return false

}


const game_modes = ["constant", "liberty", "draft"]

export default class Command_Operation{
    
    constructor(screen, command_console, cli){
        this.screen = screen
        this.command_console = command_console
        this.cli = cli

        // this.act_list = ["clear", "create"]
    }

    Filter(cmd, args, option) {
        switch (cmd) {
            case "auto":
                // auto <total> <interval> -f <from> -c <cnt>

                if (!option["f"])
                    option["f"] = 0

                if (!option["c"])
                    option["c"] = 9999999

                if (!INT(option["f"]) || !INT(option["c"]))
                    return false


                if (args.length == 0) {
                    args.push(5000)
                    args.push(500)
                    return true
                }
                else if (args.length == 2) {
                    return INT(args[0]) && INT(args[1])
                }
                else
                    return false



                break;

            case "release":
                return true


                break;

            case "clear":
                return true
                break;
            case "create":
                return INT(args[0])
                // args = [cnt]
                // let ret =  INT(args[0])
                // console.log(ret)
                // return ret
                break;

            case "show":
                // args = [from]clear
                return INT(args[0])
                return 

            // case "info":
            //     return true

            case "cancle":
                // 등록 취소
                // state가 "waiting" 일 때만 유효

                return true

            case "run":
                // run : 현재 페이지만
                // run <index> <cnt> : <index> 부터 <cnt> 만큼
                // run * : 모든 더미

                if(!option["m"])
                    option["m"] = "constant"

                if(!game_modes.includes(option["m"]))
                    return false



                if (args.length == 0) {
                    args.push(-1)
                    args.push(-1)
                    return true
                }
                else if (args.length == 1) {
                    if (args[0] == "*") {
                        args[0] = 0
                        args.push(99999999)
                    }
                    else
                        args.push(-1)
                    return INT(args[0])
                }
                else if (args.length == 2) {
                    return INT(args[0]) && INT(args[1])
                }
                else
                    return false

                break;

                // // run * : 모든 더미 등록
                // if(args[0] === "*"){
                //     args[0] = 0
                //     args[1] = 
                // }

            case "ai_auto":
                return true


            case "ai_ping":           
                return true

            case "ai_info":
                return true
                
            case "ai_savelogs":
                return true

            case "ai_creategame":
                return INT(args[0])

            case "ai_createstream":
                return INT(args[0])

            case "ai_savemodel":
                if(args.length !== 1)
                    return false
                else
                    return true
                return true

            case "ai_loadmodel":
                return INT(args[0])

            case "ai_setmode":
                return true

            case "ai_loadmodel_new":
                return INT(args[0])

            case "ai_training":
                return INT(args[0]) && INT(args[1])

            case "ai_compare":
                return true

            default:
                return false
                break;
        }
        return false
    }



    Command(cmd) {
        cmd = cmd.split(" ")
        cmd = minimist(cmd)

        let act = cmd["_"][0]
        let args = cmd["_"].slice(1)

        delete cmd["_"]
        let option = cmd
        // let args = ret.slice(1)

        if (this.Filter(act, args, option) == false) {
            let txt = "{red-fg}{bold}== wrong data =={/bold}{/red-fg}"
            this.command_console.Print(txt)
        }
        else if (this.cli[`${act}_`]) {
            this.cli[`${act}_`](...args, option)
        }
        else {
            let txt = `{red-fg}{bold}${act}{/bold}{/red-fg} not founded`
            this.command_console.Print(txt)
        }

        // return args
    }

}