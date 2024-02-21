import clientPromise from "library/mongodb";
import { ObjectId } from 'mongodb';

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const transportCollection = db.collection('transport');
    return transportCollection;
};
/*------------------------------END-----------------------------*/

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        try {
            const transportCollection = await connectToDatabase()
            const { assertId, locationId } = req.query;
            await transportCollection.updateOne({
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
        const transportCollection = await connectToDatabase()
        const { assertId, locationId } = req.query;
        try{
            await transportCollection.updateOne({
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

//api/transport/[year]/[transport]/