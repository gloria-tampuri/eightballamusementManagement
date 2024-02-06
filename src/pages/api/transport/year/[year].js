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

export default async function handler(req, res) {
    const transportCollection = await connectToDatabase()
    const {year} = req.query
    if (req.method === 'GET') {
        try {
           const data = await transportCollection.find({year: year}).toArray()
           res.status(200).json({status: 200, transport: data})
        } catch (error) {
            res.status(500).json({ status: 500, message: error })
        }
    }

}