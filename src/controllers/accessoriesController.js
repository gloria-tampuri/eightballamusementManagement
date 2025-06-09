import clientPromise from "library/mongodb";
import { ObjectId } from "mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db();
  const accessoriesCollection = db.collection("Accessories");
  return accessoriesCollection;
};
/*------------------------------END-----------------------------*/

const getAccessoriesController = async (req, res) => {
  const accessoriesCollection = await connectToDatabase();

  try {
    const accessory = await accessoriesCollection.find().toArray();
    res.status(200).json({ status: 200, accessory });
  } catch (error) {
    res.status(500).json({ status: 500, message: error });
  }
};

const postAccessoryController = async (req, res) => {
  const accessoryData = req.body;

  const accessoriesCollection = await connectToDatabase();
  try {
    const insertedAccessories = await accessoriesCollection.insertOne({
      ...accessoryData,
      createdAt: new Date(),
    });

    res.status(201).json({
      status: 201,
      message: `Accessory with ${insertedAccessories.insertedId} added`,
    });
  } catch (error) {}
};

const patchAccessoryController = async (req, res) => {
  try {
    const accessoryId = req.params.id; // Get the ID from URL params
    const { quantity, issues } = req.body; // Get other data from request body

    console.log("Received accessoryId:", accessoryId);
    console.log("Received data:", { quantity, issues });

    const accessoriesCollection = await connectToDatabase();
    console.log("Connected to database");

    let updateOperation = {};

    if (quantity !== undefined) {
      updateOperation.$set = { quantity };
    }

    if (Array.isArray(issues) && issues.length > 0) {
      updateOperation.$push = { issues: { $each: issues } };
    }

    console.log("Update operation:", updateOperation);

    if (Object.keys(updateOperation).length === 0) {
      return res.status(400).json({ message: "No valid update data provided" });
    }

    const result = await accessoriesCollection.updateOne(
      { _id: new ObjectId(accessoryId) },
      updateOperation
    );
    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.status(200).json({ message: "Accessory updated successfully" });
  } catch (error) {
    console.error("Error in patchAccessoryController:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

export {
  getAccessoriesController,
  postAccessoryController,
  patchAccessoryController,
};
