import clientPromise from "library/mongodb";

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

export {
    getTransportController,
    postTransportController
}