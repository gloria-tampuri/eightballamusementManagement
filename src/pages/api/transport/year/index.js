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
    if(req.method === 'GET'){
       try {
        const year = await transportCollection.distinct("year")
        res.status(200).json(year)
       } catch (error) {
        res.status(500).json({status: 500,message: 'An error occurred.'})
       }
    }
}