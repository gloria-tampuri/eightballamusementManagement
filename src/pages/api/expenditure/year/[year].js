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

export default async function handler(req, res) {
    const expenditureCollection = await connectToDatabase()
    const {year} = req.query
    if (req.method === 'GET') {
        try {
           const data = await expenditureCollection.find({year: year}).toArray()
           res.status(200).json({status: 200, expenditure: data})
        } catch (error) {
            res.status(500).json({ status: 500, message: error })
        }
    }

}




