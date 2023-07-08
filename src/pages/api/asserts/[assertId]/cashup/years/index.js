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
    if(req.method === 'GET'){
        try {
            const assertsCollection = await connectToDatabase()
            const { assertId} = req.query;
            await assertsCollection.assertId.cashup.distinct('year')
        res.status(200).json(year)

        }
         catch (error) {
        res.status(500).json({status: 500,message: 'An error occurred.'})
            
        }
    }

}