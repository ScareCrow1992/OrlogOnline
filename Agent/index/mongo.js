



// import {MongoClient} from "mongodb"


// async function run(){
//     const client = new MongoClient("mongodb://localhost:27017/", { compressors: ["snappy"] });

//     await client.connect()

//     // 연결 확인을 위한 ping 전송
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!")
    
//     // DB 목록 출력
//     let lists = await client.db().admin().listDatabases();
//     lists.databases.forEach(db=>{console.log(` - ${db.name}`)})


//     let matchDB = client.db("match_making")
//     let matchColl = matchDB.collection("match")

//     const doc = { name: "Neapolitan pizza", shape: "round" };
//     const result = await matchColl.insertOne(doc);
//     console.log(
//         `A document was inserted with the _id: ${result.insertedId}`,
//     );

// }

// run();


// export {run as mongo}