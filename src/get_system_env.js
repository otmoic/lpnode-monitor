// retrieve container environment variables passed by the system
const sdk = require("../dist/monitor_sdk").default;
async function main(system_data) {
  console.log(system_data);
  return "done"; // this result will be recorded in the database
}
process.on("message", async (systemData) => {
  const result = await main(systemData); // default timeout: 5 seconds
  process.send(result);
  process.exit();
});
