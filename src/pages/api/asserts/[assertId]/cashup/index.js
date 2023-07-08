import clientPromise from "library/mongodb";
import { ObjectId } from 'mongodb';

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const assertsCollection = db.collection('Asserts');
    return assertsCollection;
};

export default async function handler(req, res) {
    const assertsCollection = await connectToDatabase()
    if (req.method === 'GET') {
        try {
            const { assertId } = req.query
            const assertsCollection = await connectToDatabase()
            const cash = await assertsCollection.findOne({ _id: new ObjectId(assertId)},{"cashup":1});
            const cashup=cash.cashup
            res.status(200).json({ status: 200, cashup })

        } catch (error) {
            res.status(500).json({ status: 500, message: error })
        }
    }
}