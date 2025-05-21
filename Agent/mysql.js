// require('dotenv').config()
// const mysql = require('mysql2')

// import 'dotenv/config'

import dotenv from 'dotenv'

dotenv.config();

import mysql from 'mysql2/promise'

// let url = 'mysql://evoxx4hdbs9yf4oh2phm:pscale_pw_IDjWEhiAUQZBzhmvn8o4Pg7dEB5wsOXeZmX5MruOv7g@aws.connect.psdb.cloud/orlog-online?ssl={"rejectUnauthorized":true}'

let url = 'mysql://127.0.0.1:3306'

// console.log(process.env)

// const connection = mysql.createConnection(url)

let mysql_pool

function Init(){
    mysql_pool = mysql.createPool({
        user: 'root',
        password: 'root1234',
        database: 'orlog',
        host: '127.0.0.1',
        port: '3306',
        waitForConnections: true,
        idleTimeout: 60000,
        connectionLimit: 50,
        queueLimit : 0,
        // idleTimeout: 2000

    })

    return mysql_pool
}

// const connection = mysql.createConnection(process.env.DATABASE_URL)
// console.log('Connected to PlanetScale!')

// let mySQL_user = "evoxx4hdbs9yf4oh2phm"
// let mySQL_pw = "pscale_pw_IDjWEhiAUQZBzhmvn8o4Pg7dEB5wsOXeZmX5MruOv7g"


// let mySQL_user = "evoxx4hdbs9yf4oh2phm"
// let mySQL_pw = "pscale_pw_IDjWEhiAUQZBzhmvn8o4Pg7dEB5wsOXeZmX5MruOv7g"


function AddUser(id, email) {

    let mysql_connection = mysql_pool.getConnection()
    mysql_connection.then((conn, err) => {

        let prom_0 = conn.query(
            `select exists (select * from user_game_record where id = "${id}") as "ret"`
        )

        prom_0.then((results, fields) => {
            // console.log(results[0][0]["ret"])
            if (results[0][0]["ret"] == 0) {
                conn.query(`insert into user_game_record(id, mode) VALUES ("${id}", 0);`)
                conn.query(`insert into user_game_record(id, mode) VALUES ("${id}", 1);`)
                conn.query(`insert into user_game_record(id, mode) VALUES ("${id}", 2);`)
                // console.log("hello")
            }
        })


        let prom_1 = conn.query(
            `select exists (select * from user where id = "${id}") as "ret"`
        )

        prom_1.then((results, fields)=>{
            if (results[0][0]["ret"] == 0) {
                conn.query(`insert into user(id, email) VALUES ("${id}", "${email}");`)
            }
        })
        mysql_pool.releaseConnection(conn)

    })


}


function AddResult(winner, loser, game_mode) {
    let mysql_connection = mysql_pool.getConnection()
    // game_mode = {"constant" : 0, "liberty" : 1, "draft" : 2}[`${game_mode}`]

    switch (game_mode) {
        case "constant":
            game_mode = 0
            break;

        case "liberty":
            game_mode = 1
            break;

        case "draft":
            game_mode = 2
            break;
    }

    // console.log(game_mode)
    mysql_connection.then((conn, err) => {
        // console.log(err)

        let prom_win = conn.query(`select exists (select * from user_game_record where id = "${winner}") as "ret"`)
        prom_win.then((results, fields) => {
            // console.log(`${results[0][0]["ret"]} == ${game_mode}`)
            if (results[0][0]["ret"] == 1) {
                conn.query(`update user_game_record set win = win + 1 where id = "${winner}" and mode = ${game_mode};`)
            }
        })


        let prom_lose = conn.query(`select exists (select * from user_game_record where id = "${loser}") as "ret"`)
        prom_lose.then((results, fields) => {
            // console.log(results[0][0]["ret"])
            if (results[0][0]["ret"] == 1) {
                conn.query(`update user_game_record set lose = lose + 1 where id = "${loser}" and mode = ${game_mode};`)
                
                // console.log(mysql_connection)
                // mysql_connection.release()
                // console.log("[[ Add result ]]")
            }
        })
        mysql_pool.releaseConnection(conn)
    })


    // let mysql_promise = new mysql_pool.Promise()

    // mysql_promise.query(
    //     `select exists (select * from user_game_record where id = "${winner}") as "ret"`,
    //     (err, results, fields)=>{
    //         if (results[0]["ret"] == 1) {
    //             mysql_promise.query(
    //                 `update user_game_record set win = win + 1 where id = "${winner}" and mode = ${game_mode};`,
    //                 (err, results, fields) => {}
    //             )
    //         }
    //     }
    // )

    
    // mysql_promise.query(
    //     `select exists (select * from user_game_record where id = "${loser}") as "ret"`,
    //     (err, results, fields)=>{
    //         if (results[0]["ret"] == 1) {
    //             mysql_promise.query(
    //                 `update user_game_record set lose = lose + 1 where id = "${loser}" and mode = ${game_mode};`,
    //                 (err, results, fields) => {}
    //             )
    //         }
    //     }
    // )
}

function _DBG_Truncate(){
    let mysql_connection = mysql_pool.getConnection()
    mysql_connection.then(conn=>{
        conn.query(`truncate user;`)
        conn.query(`truncate user_game_record;`)
    })

}


export { Init, AddUser, AddResult, _DBG_Truncate }
