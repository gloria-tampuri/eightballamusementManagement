import clientPromise from "library/mongodb";
import { ObjectId } from "mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const todoListCollection = db.collection('todoList');
    return todoListCollection;
};
/*------------------------------END-----------------------------*/

// Function to get a task by ID
const getTaskController = async (req, res) => {
    try {

        // Check if the task parameter is missing
        if (!req.query.task) {
            return res.status(400).json({ status: 400, message: "Missing task parameter" });
        }

        const todoListCollection = await connectToDatabase();

        // Convert the task parameter to an ObjectId
        const taskObjectId = new ObjectId(req.query.task);

        // Find the task in the database
        const task = await todoListCollection.findOne({ _id: taskObjectId });

        if (!task) {
            return res.status(404).json({ status: 404, message: "Task not found" });
        }

        res.status(200).json({ status: 200, task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

// Function to delete a task by ID
const deleteTaskController = async (req, res) => {
    try {
        
        const todoListCollection = await connectToDatabase();

        const result = await todoListCollection.deleteOne({ _id: new ObjectId(req.query.task) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
};


// Main handler function to route requests
export default async function handler(req, res){
    if (req.method === 'GET') {
        return getTaskController(req, res);
    }  if (req.method === 'DELETE') {
        return deleteTaskController(req, res);
    } else {
        res.status(405).json({ status: 405, message: "Method Not Allowed" });
    }
}
