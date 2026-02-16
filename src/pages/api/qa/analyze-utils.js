async function getUnpaidTransport(db) {
  try {
    const unpaidTransport = await db
      .collection("transport")
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
    return { totalUnpaid: 0, unpaidRecords: [] };
  }
}

async function getTotalExpenditure(db, timeFrame) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - timeFrame.months);

  try {
    const expenditure = await db
      .collection("expenditure")
      .aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return {
      timeFrame,
      categories: expenditure,
      total: expenditure.reduce((sum, cat) => sum + cat.total, 0),
    };
  } catch (error) {
    console.error("Error getting expenditure:", error);
    return { timeFrame, categories: [], total: 0 };
  }
}

async function getMaintenanceStats(db, timeFrame) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - timeFrame.months);

  try {
    const maintenance = await db
      .collection("expenditure")
      .aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            category: "maintenance",
          },
        },
        {
          $group: {
            _id: "$assetId",
            totalCost: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "assets",
            localField: "_id",
            foreignField: "_id",
            as: "asset",
          },
        },
        {
          $unwind: "$asset",
        },
        {
          $sort: { totalCost: -1 },
        },
      ])
      .toArray();

    return {
      timeFrame,
      maintenance,
      total: maintenance.reduce((sum, record) => sum + record.totalCost, 0),
    };
  } catch (error) {
    console.error("Error getting maintenance stats:", error);
    return { timeFrame, maintenance: [], total: 0 };
  }
}

async function getLocationPerformance(db, timeFrame) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - timeFrame.months);

  try {
    const locations = await db
      .collection("assets")
      .aggregate([
        {
          $lookup: {
            from: "cashups",
            localField: "_id",
            foreignField: "assetId",
            as: "cashups",
          },
        },
        {
          $unwind: "$location",
        },
        {
          $group: {
            _id: "$location.locationName",
            totalRevenue: {
              $sum: {
                $reduce: {
                  input: {
                    $filter: {
                      input: "$cashups",
                      as: "cashup",
                      cond: {
                        $and: [
                          { $gte: ["$$cashup.date", startDate] },
                          { $lte: ["$$cashup.date", endDate] },
                        ],
                      },
                    },
                  },
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.amount"] },
                },
              },
            },
            assetCount: { $sum: 1 },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ])
      .toArray();

    return {
      timeFrame,
      locations,
      total: locations.reduce((sum, loc) => sum + loc.totalRevenue, 0),
    };
  } catch (error) {
    console.error("Error getting location performance:", error);
    return { timeFrame, locations: [], total: 0 };
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

function formatExpenditureResponse(data, timeFrame) {
  const timeDescription =
    timeFrame.months === 1
      ? "the last month"
      : `the last ${timeFrame.months} months`;

  let response = `Total expenditure for ${timeDescription}: $${data.total.toFixed(
    2
  )}\n\n`;
  response += "Breakdown by category:\n";

  data.categories.forEach((category) => {
    response += `${category._id}: $${category.total.toFixed(2)} (${
      category.count
    } transactions)\n`;
  });

  return response;
}

function formatMaintenanceResponse(data, timeFrame) {
  const timeDescription =
    timeFrame.months === 1
      ? "the last month"
      : `the last ${timeFrame.months} months`;

  let response = `Total maintenance costs for ${timeDescription}: $${data.total.toFixed(
    2
  )}\n\n`;
  response += "Breakdown by asset:\n";

  data.maintenance.forEach((record, index) => {
    response += `${index + 1}. ${
      record.asset.name
    }: $${record.totalCost.toFixed(2)} (${record.count} maintenance events)\n`;
  });

  return response;
}

function formatLocationResponse(data, timeFrame) {
  const timeDescription =
    timeFrame.months === 1
      ? "the last month"
      : `the last ${timeFrame.months} months`;

  let response = `Location performance analysis for ${timeDescription}\n`;
  response += `Total revenue across all locations: $${data.total.toFixed(
    2
  )}\n\n`;
  response += "Performance by location:\n";

  data.locations.forEach((location, index) => {
    const averagePerAsset = location.totalRevenue / location.assetCount;
    response += `${index + 1}. ${location._id}:\n`;
    response += `   Revenue: $${location.totalRevenue.toFixed(2)}\n`;
    response += `   Assets: ${location.assetCount}\n`;
    response += `   Average per asset: $${averagePerAsset.toFixed(2)}\n`;
  });

  return response;
}
