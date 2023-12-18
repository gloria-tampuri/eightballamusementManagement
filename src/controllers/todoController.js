import clientPromise from "library/mongodb";
import { ObjectId } from 'mongodb';


/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const todoCollection = db.collection('todoList');
    return todoCollection;
};
/*------------------------------END-----------------------------*/

const getTodoController = async (req, res) => {

    const todoCollection = await connectToDatabase()

    try {
        const todo = await todoCollection.find().toArray();
        res.status(200).json({ status: 200, todo })

    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}



const postTodoController = async (req, res) => {
    const todoData = req.body

    const todoCollection = await connectToDatabase()
    try {

     const insertedtodo = await todoCollection.insertOne({...todoData, createdAt: new Date()})

     res.status(201).json({
        status: 201,
        message:`todo with ${insertedtodo.insertedId} added`
     })

    } catch (error) {
        // console.log(error);
    }
}
const deleteTodoController = async (req, res) => {
    const todoId = req.params.id;
    const todoCollection = await connectToDatabase();
  
    try {
      const result = await todoCollection.deleteOne({ _id: ObjectId(todoId) });
  
      if (result.deletedCount === 1) {
        res.status(200).json({
          status: 200,
          message: `Todo with id ${todoId} deleted`,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: `Todo with id ${todoId} not found`,
        });
      }
    } catch (error) {
      res.status(500).json({ status: 500, message: error });
    }
  };
  
  export { getTodoController, postTodoController, deleteTodoController };
  
