// default sample program
const { DatabaseDict } = require("../dist/monitor_sdk");
const sdk = require("../dist/monitor_sdk").default;
async function main(system_data) {
  const db = await sdk.database(DatabaseDict.Lp);
  const col = db.collection("bridges");
  const result = await col.find({}).toArray();
  console.log("db_result:", result);
  console.log("system_data:", system_data);
  const redis_db = await sdk.redis(0);
  const redis_ret = await redis_db.get("config_id_amm-01"); // get the status of the amm program
  console.log("redis_ret:", redis_ret);
  // do anything here
  return "exec ok";
}
process.on("message", async (systemData) => {
  const result = await main(systemData);
  process.send(result);
  process.exit();
});
