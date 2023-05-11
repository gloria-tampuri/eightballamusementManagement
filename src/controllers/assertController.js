import clientPromise from "library/mongodb";
import { ObjectId } from "mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const assertsCollection = db.collection('Asserts');
    return assertsCollection;
};
/*------------------------------END-----------------------------*/

const getAssertController = async (req, res) => {

    const {assertId} =  req.query

    const assertsCollection = await connectToDatabase()

    try {
        const assert = await assertsCollection.findOne({_id: new ObjectId(assertId)});
        res.status(200).json({ status: 200, assert })

    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}

const patchAssertController= async(req,res)=>{
   
    try {
        const {assertId} =  req.query
        const assert =req.body
        const assertsCollection = await connectToDatabase()
        
        await assertsCollection.updateOne({_id:ObjectId(assertId)},{
            $set:{...assert, updatedAt: new Date()},  
        })
        res.status(200).json({ message: "assert updated successfully" })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
}

export {
    getAssertController,
    patchAssertController
}