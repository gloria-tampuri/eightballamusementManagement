import clientPromise from "library/mongodb";

/*Connect to the database
-------------------------------START----------------------------*/
const connectToDatabase = async () => {
    const client = await clientPromise;
    const db = client.db();
    const expenditureCollection = db.collection('expenditure');
    return expenditureCollection;
};
/*------------------------------END-----------------------------*/

const getExpenditureController = async (req, res) => {

    const expenditureCollection = await connectToDatabase()

    try {
        const expenditure = await expenditureCollection.find().toArray();
        res.status(200).json({ status: 200, expenditure })

    } catch (error) {
        res.status(500).json({ status: 500, message: error })
    }
}



const postExpenditureController = async (req, res) => {
    const ExpenditureData = req.body

    const expenditureCollection = await connectToDatabase()
    try {

     const insertedExpenditure = await expenditureCollection.insertOne({...ExpenditureData, createdAt: new Date()})

     res.status(201).json({
        status: 201,
        message:`Expenditure with ${insertedExpenditure.insertedId} added`
     })

    } catch (error) {
    }
}

export {
    getExpenditureController,
    postExpenditureController
}