import monitor_sdk, { DatabaseDict, _ } from "./monitor_sdk";

const fs = require("fs");

async function main() {
  try {
    const content = fs.readFileSync("/user-script/a.txt", {
      encoding: "utf-8",
    });
    console.log("file content", content);
  } catch (e) {
    console.error("read file error", e);
  }

  const httpResult = await monitor_sdk.fetch.request({
    url: "https://docs.lafyun.com/",
  });
  console.log(httpResult.data);
  const db = await monitor_sdk.database(DatabaseDict.Lp);
  const docList = await db.collection("chainList").find({}).toArray();
  console.log(docList);
  const redis = await monitor_sdk.redis(0);
  const result = await redis.get("config_id_amm02");
  console.log(result);
  alert({ user: "weihongjie" });
}

async function alert(data: any) {
  const tplStr = `hello <%= user %>!`;
  const compiled = _.template(tplStr);
  const msg = compiled(data);
  console.log(msg);
}
setTimeout(() => {
  process.exit();
}, 5000);
main()
  .then(async () => {
    monitor_sdk.logger.debug("The main function is finished");
    process.exit(0);
  })
  .catch((e) => {
    monitor_sdk.logger.error(e);
    process.exit(1);
  });
