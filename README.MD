## Introduction
This is a daemon program written in Typescript, used to start user scripts and record the output results to the database.

## Main Functions
* Encapsulates access to MongoDB and Redis through the SDK, making it easy for users to perform database operations when writing scripts.
* A user-defined script can utilize the SDK functionality provided by this project in the following way:
```js
const { DatabaseDict } = require("/data/lp_node_monitor/dist/monitor_sdk");
const sdk = require("/data/lp_node_monitor/dist/monitor_sdk").default;

async function main(system_data) {
  const db = await sdk.database(DatabaseDict.Lp);
  const result = await db.collection("bridges").find({}).sort({_id:-1}).limit(1).toArray();
  console.log("db_result:", result);
  console.log("system_data:", system_data);
  return "exec ok";
}

process.on("message", async (systemData) => {
  const result = await main(systemData);
  process.send(result);
});
```
> Note: To upload user scripts, click on Monitoring->Create in the Otmoic Application menu.

* Start an execution container for the user script and pass system environment variables through system_data.
* Supports defining jobs using Linux Cron syntax;
* All results of job execution, including stdout and stderr, will be recorded in MongoDB. You can also query them using otmoic-lpnode-graphql.