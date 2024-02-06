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




// import clientPromise from "library/mongodb";

// /*Connect to the database
// -------------------------------START----------------------------*/
// const connectToDatabase = async () => {
//     const client = await clientPromise;
//     const db = client.db();
//     const transportCollection = db.collection('transport');
//     return transportCollection;
// };
// /*------------------------------END-----------------------------*/

// export default async function handler(req, res) {
//     const transportCollection = await connectToDatabase();
//     const { year, week } = req.query;

//     if (req.method === 'GET') {
//         try {
//             // Assuming you have a 'date' field in your documents representing the date of the expense
//             const aggregationPipeline = [
//                 {
//                     $match: {
//                         year: year,
//                         week: week
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             month: { $month: "$date" },
//                             week: { $week: "$date" }
//                         },
//                         totalExpenses: { $sum: "$expenseAmount" } // Adjust field accordingly
//                     }
//                 },
//                 {
//                     $sort: {
//                         "_id.month": 1,
//                         "_id.week": 1
//                     }
//                 }
//             ];

//             const data = await transportCollection.aggregate(aggregationPipeline).toArray();

//             res.status(200).json({ status: 200, transport: data });
//         } catch (error) {
//             res.status(500).json({ status: 500, message: error });
//         }
//     }
// }



// Assuming you are calling this code in a React component or another frontend framework

// async function fetchData(year, week) {
//     try {
//         const response = await fetch(`/api/your-endpoint?year=${year}&week=${week}`);
//         const data = await response.json();

//         if (response.ok) {
//             console.log(data.transport); // Use the data in your application
//             // Update your state or UI with the fetched data
//         } else {
//             console.error(`Error: ${data.message}`);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Call the function with your desired year and week
// fetchData(2024, 3);
