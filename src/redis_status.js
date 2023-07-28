//read LP application status from Redis, which includes the status of amm, market-price, evm-client, etc.
const sdk = require("../dist/monitor_sdk").default;
async function main(system_data) {
  const redis_db = await sdk.redis(0);
  const redis_ret = await redis_db.get("amm-status-report-amm-01"); // get the status of the amm program
  console.log("redis_ret:", redis_ret);
  // do anything here
  const status = JSON.parse(redis_ret);
  if (status["status"] == "runing") {
    console.log("all ok");
  }
  return "done"; // this result will be recorded in the database
}
process.on("message", async (systemData) => {
  const result = await main(systemData); // default timeout: 5 seconds
  process.send(result);
  process.exit();
});
