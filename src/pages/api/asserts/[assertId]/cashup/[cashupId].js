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
/*------------------------------END-----------------------------*/

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {
            const assertsCollection = await connectToDatabase()
            const { assertId, cashupId } = req.query;
            await assertsCollection.updateOne({
                _id:new ObjectId(assertId)
            }, {
                $pull: {
                    cashup: {
                        cashupId: cashupId
                    }
                }
            });
           res.status(200).json({ message: "assert updated successfully" })
        
        } catch (error) {
            res.status(500).json({ status: 500, message: "Something went wrong" })
        }
    }
}

//api/asserts/[cropId]/cashup/[cashupId]