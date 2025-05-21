import chalk from "chalk";

let data_format = {
    "agent_table": function (datas) {
        // const table_header = ["index", "state", "start_time", "play_time"]
        const table_header = this.table_head


        datas.unshift(table_header)

        // console.log(datas)

        for (let row_index = 1; row_index < datas.length; row_index++) {
            // this.agents_data[row_index + 1] = data[row_index]

            let row_cursor = datas[row_index]

            // console.log(row_cursor)

            // let color_format = "{gray-bg}"
            switch (row_cursor[1]) {
                case "idle":
                    // 0xffffff
                    row_cursor[1] = chalk.bgWhite.black(row_cursor[1])
                    break;


                // 매칭서버 등록 중
                case "requested":
                    row_cursor[1] = chalk.bgHex("#888800").black(row_cursor[1])
                    break;

                // 매칭서버 등록 완료
                case "waiting":
                    // 0xffff00
                    row_cursor[1] = chalk.bgYellow.black(row_cursor[1])
                    break;

                // 게임 중
                case "playing":
                    row_cursor[1] = chalk.bgHex("#00ff00").black(row_cursor[1])
                    // 0x00ff00
                    break;

                case "prepared":
                    row_cursor[1] = chalk.bgHex("#bbffbb").black(row_cursor[1])
                    break;
            }



            switch (row_cursor[2]) {
                case "constant":
                    row_cursor[2] = chalk.bgHex("#00ffff").black(row_cursor[2])

                    break;

                case "liberty":
                    row_cursor[2] = chalk.bgHex("#00ff88").black(row_cursor[2])
                    break;

                case "draft":
                    row_cursor[2] = chalk.bgHex("#8888ff").black(row_cursor[2])
                    break;
            }




            let minute = parseInt(row_cursor[4].split('m')[0])

            if (minute > 8 && minute <= 11) {
                row_cursor[4] = chalk.bgHex("#ff8800").black(row_cursor[4])
            }
            else if (minute > 11) {
                // 0xff0000
                row_cursor[4] = chalk.bgRed.black(row_cursor[4])
            }

            datas[row_index] = row_cursor
        }

        return datas
    },
    "launcher_table": function(datas){
        const table_header = this.table_head


        datas.unshift(table_header)
        return datas
    }
}


function DataFormat(type) {
    return data_format[`${type}`]


}


export { DataFormat }