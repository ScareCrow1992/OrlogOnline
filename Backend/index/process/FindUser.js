import { FindUser } from "#db_connector/databases.js"


export default function(id){
    return FindUser(id)
}
