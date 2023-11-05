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
            const { assertId, locationId } = req.query;
            await assertsCollection.updateOne({
                _id:new ObjectId(assertId)
            }, {
                $pull: {
                    location: {
                        locationId: locationId
                    }
                }
            });
           res.status(200).json({ message: "assert updated successfully" })
        
        } catch (error) {
            res.status(500).json({ status: 500, message: "Something went wrong" })
        }
    }

    if(req.method ==='PUT'){
        const updatedData =req.body
        const assertsCollection = await connectToDatabase()
        const { assertId, locationId } = req.query;
            // console.log(assertId,locationId);
        try{
            await assertsCollection.updateOne({
                _id:new ObjectId(assertId),"location.locationId":locationId
               
            },{
                $set:{
                   'location.$':updatedData
                }
            })
            res.status(200).json({ message: "assert updated successfully" })

        }
        catch{
            res.status(500).json({ status: 500, message: "Something went wrong" })
        }
    }
}

//api/asserts/[cropId]/location/[locationId]