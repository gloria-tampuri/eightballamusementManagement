import clientPromise from "library/mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const assertsCollection = db.collection('Asserts');
    return assertsCollection;
};
/*------------------------------END-----------------------------*/

const getAssertsController = async (req, res) => {

    const assertCollection = await connectToDatabase()

    try {
        const asserts = await assertCollection.find().sort({ timestampField: -1 }).toArray();
        res.status(200).json({ status: 200, asserts })

    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}



const postAssertController = async (req, res) => {
    const AssertData = req.body

    const assertsCollection = await connectToDatabase()
    try {

     const insertedAssert = await assertsCollection.insertOne({...AssertData, createdAt: new Date()})

     res.status(201).json({
        status: 201,
        message:`Assert with ${insertedAssert.insertedId} added`
     })

    } catch (error) {
        console.log(error);
    }
}

export {
    getAssertsController,
    postAssertController
}