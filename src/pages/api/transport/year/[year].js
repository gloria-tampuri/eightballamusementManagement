import clientPromise from "library/mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db();
  const transportCollection = db.collection("transport");
  return transportCollection;
};
/*------------------------------END-----------------------------*/

export default async function handler(req, res) {
  const transportCollection = await connectToDatabase();
  const { year, operator } = req.query;
  if (req.method === "GET") {
    try {
      const query = { year };
      if (operator) {
        query.operator = operator;
      }
      const data = await transportCollection.find(query).toArray();
      res.status(200).json({ status: 200, transport: data });
    } catch (error) {
      res.status(500).json({ status: 500, message: error });
    }
  }
}
