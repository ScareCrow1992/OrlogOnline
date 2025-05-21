import { AddUser } from "#db_connector/databases.js"


export default function(id, email){
    return AddUser(id, email)
}
