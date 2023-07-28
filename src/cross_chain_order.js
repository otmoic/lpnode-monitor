// query cross-chain orders from the database, allowing for retrieval of ongoing, hedging, or completed ones.
const { DatabaseDict } = require("../dist/monitor_sdk");
const sdk = require("../dist/monitor_sdk").default;

/**
 * available status
    EFlowStatus["Init"] = "Init";
    EFlowStatus["AnswerOffer"] = "AnswerOffer";
    EFlowStatus["Locked"] = "Locked";
    EFlowStatus["WaitHedge"] = "WaitHedge";
    EFlowStatus["HedgeCompletion"] = "HedgeCompletion";
    EFlowStatus["HedgeSubmitted"] = "HedgeSubmitted";
    EFlowStatus["HedgeFailure"] = "HedgeFailure";
    EFlowStatus["NoHedge"] = "NoHedge";
    EFlowStatus["HedgeAnalyzeCompletion"] = "HedgeAnalyzeCompletion";
 */
async function main(system_data) {
  const db = await sdk.database(DatabaseDict.Lp);
  const col = db.collection("ammContext_amm-01");
  // read unfinished orders
  const result = await col
    .find({
      flowStatus: {
        $in: ["Locked", "WaitHedge", "HedgeSubmitted", "AnswerOffer"],
      },
    })
    .toArray();
  // do anything here
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]._id);
  }
  return result; // this result will be recorded in the database
}

process.on("message", async (systemData) => {
  const result = await main(systemData); // default timeout: 5 seconds
  process.send(result);
  process.exit();
});
