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
        const { _id, update } = req.body; // Assuming your request body contains the _id of the document and the update object
        const transportCollection = await connectToDatabase();

        const result = await transportCollection.updateOne(
            { _id: new ObjectId(_id) }, // Filter by _id
            { $set: update } // Update the document with the fields/values in the update object
        );

        if (result.matchedCount === 1) {
            res.status(200).json({ message: "Transport updated successfully" });
        } else {
            res.status(404).json({ message: "Transport not found" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};




const deleteTransportController = async (req, res) => {
    try {
        const { transport } = req.query;
        const transportCollection = await connectToDatabase();

        const result = await transportCollection.deleteOne({ _id: new ObjectId(transport) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Transport deleted successfully" });
        } else {
            res.status(404).json({ message: "Transport not found" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const patchWeekPaidController = async (req, res) => {
    try {
      const { week } = req.query;
      const { paid } = req.body;
      const transportCollection = await connectToDatabase();
  
      // Update all documents in the specified week to set their 'paid' field to the provided value
      await transportCollection.updateMany({ week: week }, {
        $set: { paid: paid },
      });
  
      res.status(200).json({ message: "Week updated successfully" });
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
        return deleteTransportController(req, res);
    }
    if (req.method === 'PATCH' && req.query.week) { // Add this condition for handling PATCH request for updating week paid status
        return patchWeekPaidController(req, res);
      }
}
// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//       return getTransportController(req, res);
//     } else if (req.method === 'PATCH' && req.query.week) { // Check if it's a PATCH request and the 'week' query parameter is present
//       return patchWeekPaidController(req, res); // Route to the patchWeekPaidController function
//     } else if (req.method === 'PATCH') { // Handle the PATCH request for individual transport update
//       return patchTransportController(req, res);
//     } else if (req.method === 'DELETE') {
//       return deleteTransportController(req, res);
//     } else {
//       res.status(405).json({ message: 'Method Not Allowed' }); // Return 405 Method Not Allowed for unsupported methods
//     }
//   }
  