import clientPromise from "library/mongodb";
import { ObjectId } from "mongodb";

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
    try {
        const { transport } = req.query; 

        
        if (!transport) {
            return res.status(400).json({ status: 400, message: "Missing transportId parameter" });
        }

        const transportCollection = await connectToDatabase();
        const transportFound = await transportCollection.findOne({ _id: new ObjectId(transport) });

        if (!transportFound) {
            return res.status(404).json({ status: 404, message: "Transport not found" });
        }

        res.status(200).json({ status: 200, transportFound });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

const patchTransportController = async (req, res) => {
    try {
        const { transportId } = req.query;
        const transport = req.body;
        const transportCollection = await connectToDatabase();

        await transportCollection.updateOne({ _id: new ObjectId(transportId) }, {
            $set: { ...transport },
        });
        res.status(200).json({ message: "Transport updated successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
};

const deleteTransportController = async (req, res) => {
    try {
        const { transport } = req.query;
        const transportCollection = await connectToDatabase();

        const result = await transportCollection.deleteOne({ _id: new ObjectId(transportsh) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Transport deleted successfully" });
        } else {
            res.status(404).json({ message: "Transport not found" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
};


export default async function handler(req, res) {
    if (req.method === 'GET') {
        return getTransportController(req, res);
    }
    if (req.method === 'PATCH') {
        return patchTransportController(req, res);
    }
    if (req.method === 'DELETE') {
        // Invoke the deleteTransportController function
        return deleteTransportController(req, res);
    }
}
