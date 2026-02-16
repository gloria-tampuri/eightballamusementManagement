import clientPromise from "../../../../library/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const client = await clientPromise;
    const db = client.db();

    // Parse the question to determine what kind of analysis is needed
    const analysis = await analyzeQuestion(question, db);

    res.status(200).json({ answer: analysis });
  } catch (error) {
    console.error("Error processing question:", error);
    res
      .status(500)
      .json({ message: "Error processing your question: " + error.message });
  }
}

async function analyzeQuestion(question, db) {
  try {
    const lowerQuestion = question.toLowerCase();

    // Handle questions about best performing assets
    if (
      lowerQuestion.includes("best performing") ||
      lowerQuestion.includes("top performing")
    ) {
      const timeFrame = getTimeFrame(lowerQuestion);
      const assets = await getBestPerformingAssets(db, timeFrame);
      return formatAssetPerformanceResponse(assets, timeFrame);
    }

    // Handle questions about unpaid transport
    if (
      lowerQuestion.includes("unpaid transport") ||
      lowerQuestion.includes("transport unpaid")
    ) {
      const unpaidTransport = await getUnpaidTransport(db);
      return formatUnpaidTransportResponse(unpaidTransport);
    }

    return "I understand questions about:\n- Best performing assets\n- Unpaid transport\n\nTry asking something like:\n- 'Which assets are best performing in the last month?'\n- 'How much is all unpaid transport?'";
  } catch (error) {
    console.error("Error in analyzeQuestion:", error);
    throw error;
  }
}

function getTimeFrame(question) {
  const monthNumbers = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
  };

  // Check for specific time periods
  if (question.includes("last month") || question.includes("past month")) {
    return { months: 1 };
  }

  if (question.includes("this year") || question.includes("current year")) {
    return { months: 12 };
  }

  if (question.includes("last quarter") || question.includes("past quarter")) {
    return { months: 3 };
  }

  // Default to last month if no time frame is specified
  return { months: 1 };
}

async function getBestPerformingAssets(db, timeFrame) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - timeFrame.months);

    console.log("Querying assets from", startDate, "to", endDate); // Debug log

    // First, let's check if we have any asserts
    const assertsCount = await db.collection("Asserts").countDocuments();
    console.log("Total number of asserts:", assertsCount);

    // Let's also check if we have any cashups
    const cashupsCount = await db.collection("Cashups").countDocuments();
    console.log("Total number of cashups:", cashupsCount);

    // Get a sample assert to check its structure
    const sampleAssert = await db.collection("Asserts").findOne({});
    console.log(
      "Sample assert structure:",
      JSON.stringify(sampleAssert, null, 2)
    );

    // Get a sample cashup to check its structure
    const sampleCashup = await db.collection("Cashups").findOne({});
    console.log(
      "Sample cashup structure:",
      JSON.stringify(sampleCashup, null, 2)
    );

    // Now let's perform the actual query with the correct field names
    const performanceData = await db
      .collection("Asserts")
      .aggregate([
        {
          $lookup: {
            from: "Cashups",
            let: { assertId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$assertId", "$$assertId"] },
                      { $gte: ["$cashupDate", startDate] },
                      { $lte: ["$cashupDate", endDate] },
                    ],
                  },
                },
              },
            ],
            as: "cashups",
          },
        },
        {
          $project: {
            assertId: 1,
            name: 1,
            location: { $arrayElemAt: ["$location", -1] },
            totalRevenue: {
              $sum: "$cashups.amount",
            },
          },
        },
        {
          $match: {
            totalRevenue: { $gt: 0 },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();

    console.log("Query results:", JSON.stringify(performanceData, null, 2));
    return performanceData;

    const assets = await db
      .collection("Asserts")
      .aggregate([
        {
          $lookup: {
            from: "Cashups",
            localField: "_id",
            foreignField: "assertId",
            as: "cashups",
          },
        },
        {
          $project: {
            assertId: 1,
            location: { $arrayElemAt: ["$location", -1] }, // Get the most recent location
            totalRevenue: {
              $reduce: {
                input: {
                  $filter: {
                    input: "$cashups",
                    as: "cashup",
                    cond: {
                      $and: [
                        { $gte: ["$$cashup.cashupDate", startDate] },
                        { $lte: ["$$cashup.cashupDate", endDate] },
                      ],
                    },
                  },
                },
                initialValue: 0,
                in: { $add: ["$$value", { $ifNull: ["$$this.amount", 0] }] },
              },
            },
          },
        },
        { $match: { totalRevenue: { $gt: 0 } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    console.log("Assets found:", JSON.stringify(assets, null, 2)); // Debug log
    return assets;
  } catch (error) {
    console.error("Error in getBestPerformingAssets:", error);
    throw error;
  }
}

function formatAssetPerformanceResponse(assets, timeFrame) {
  if (!assets || assets.length === 0) {
    return "No asset performance data found for the specified time period.";
  }

  const timeDescription =
    timeFrame.months === 1
      ? "the last month"
      : `the last ${timeFrame.months} months`;

  let response = `Based on the data from ${timeDescription}, here are the top performing assets:\n\n`;

  assets.forEach((asset, index) => {
    const locationName = asset.location
      ? asset.location.locationName || "Unknown Location"
      : "Unknown Location";
    response += `${index + 1}. Asset ${
      asset.assertId || "Unknown"
    } (${locationName}): $${asset.totalRevenue.toFixed(2)}\n`;
  });

  response +=
    "\nThis analysis is based on total revenue generated by each asset.";
  return response;
}

async function getUnpaidTransport(db) {
  try {
    const unpaidTransport = await db
      .collection("Transport")
      .aggregate([
        {
          $match: {
            status: "unpaid",
          },
        },
        {
          $group: {
            _id: null,
            totalUnpaid: { $sum: "$amount" },
            unpaidRecords: { $push: "$$ROOT" },
          },
        },
      ])
      .toArray();

    return unpaidTransport[0] || { totalUnpaid: 0, unpaidRecords: [] };
  } catch (error) {
    console.error("Error getting unpaid transport:", error);
    throw error;
  }
}

function formatUnpaidTransportResponse(data) {
  if (data.totalUnpaid === 0) {
    return "There are currently no unpaid transport records.";
  }

  let response = `Total unpaid transport amount: $${data.totalUnpaid.toFixed(
    2
  )}\n\n`;
  response += "Breakdown of unpaid transport:\n";

  data.unpaidRecords.forEach((record, index) => {
    response += `${index + 1}. Amount: $${record.amount.toFixed(
      2
    )} - Date: ${new Date(record.date).toLocaleDateString()}\n`;
  });

  return response;
}
