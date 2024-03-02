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

const getTransportController = async (req, res) => {

    const transportCollection = await connectToDatabase()

    try {
        const transport = await transportCollection.find().toArray();
        res.status(200).json({ status: 200, transport })

    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}



const postTransportController = async (req, res) => {
    const transportData = req.body

    const TransportCollection = await connectToDatabase()
    try {

     const insertedTransport = await TransportCollection.insertOne({...transportData, createdAt: new Date()})

     res.status(201).json({
        status: 201,
        message:`Transport with ${insertedTransport.insertedId} added`
     })

    } catch (error) {
    }
}

const deleteTransportController=async(req,res)=>{
    const transportId =req.params.id;
    const transportCollection = await connectToDatabase()
    try{
        const result = await transportCollection.deleteOne({_id:ObjectId(transportId)});
        if(result.deletedCount === 1){
            res.status(200).json({
                status:200,
                message: `Transport with id ${transportId} deleted`,
            })
        }else{
            res.status(404).json({
                status: 404,
                message: `Transport with id ${transportId} not found`,
              });
        }
    }catch(error){
        res.status(500).json({status:500, message:error})
    }
}







export {
    getTransportController,
    postTransportController,
    deleteTransportController
}