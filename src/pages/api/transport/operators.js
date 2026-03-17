import clientPromise from "library/mongodb";

const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db();
  const transportCollection = db.collection("transport");
  return transportCollection;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const transportCollection = await connectToDatabase();
    const operators = await transportCollection.distinct("operator");

    // Filter out null/undefined and sort
    const validOperators = operators
      .filter((op) => op && typeof op === "string" && op.trim())
      .sort();

    res.status(200).json({
      status: 200,
      operators: validOperators,
    });
  } catch (error) {
    console.error("Error fetching operators:", error);
    res.status(500).json({
      status: 500,
      message: "Error fetching operators",
      error: error.message,
    });
  }
}
