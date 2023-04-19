import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;

  //connect to mongo db and get data
  const client = new MongoClient(
    "mongodb://lab_user:lab_passwd@localhost:27017/lab_db"
  );
  const db = client.db();
  const collection = db.collection("laptops");

  switch (method) {
    case "GET": {
      const laptops = await collection.find().toArray();

      // console.log(laptops);
      client.close();
      return res.status(200).json({
        laptops,
        count: laptops.length,
      });
    }
    case "PUT": {
      const laptopsJson = JSON.parse(body);
      // console.log(laptopsJson);

      await collection.deleteMany({});
      await collection.insertMany(laptopsJson);
      const laptops = await collection.find().toArray();

      client.close();

      return res.status(200).json({
        laptops,
      });
    }
  }

  client.close();

  return res.status(404);
}
