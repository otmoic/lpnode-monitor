import sys_lib, { DatabaseDict } from "./monitor_sdk";
import * as _ from "lodash";
const child_process = require("node:child_process");
const argv = require("yargs-parser")(process.argv.slice(2));
(async () => {
  let stdout = "";
  let execResult;
  let stderr = "";
  let execError;
  const container = async () => {
    let userScriptName = _.get(argv, "script", undefined);
    // if (!userScriptName) {
    //   throw new Error(`user script not found`);
    // }
    return new Promise((resolve, reject) => {
      userScriptName = "./src/user_script.js";
      const subProcess = child_process.fork(userScriptName, [], {
        timeout: 5000,
        stdio: ["overlapped", "overlapped", "overlapped", "ipc"],
      });
      // console.log(subProcess);
      subProcess.on("message", (msg: any) => {
        execResult = msg;
      });
      subProcess.stdout.on("data", (msg: any) => {
        stdout = stdout + msg.toString();
      });
      subProcess.stderr.on("data", (msg: any) => {
        stderr = stderr + msg.toString();
      });
      subProcess.on("error", (err: any) => {
        console.log(err);
      });
      subProcess.send({ system_data: { a: 1 } });
      subProcess.on("close", () => {
        resolve(execResult);
        console.log("sub process close");
      });
    });
  };

  try {
    execResult = await container();
  } catch (e: any) {
    stderr = e.toString();
    execError = e.toString();
  } finally {
    console.log("out:", stdout);
    console.log("err:", stderr);
    console.log("execResult:", execResult);
    console.log("execError", execError);
  }
  const db = await sys_lib.database(DatabaseDict.Lp);
  console.log("get A db");
  await db.collection("monitor_historys").insertMany([
    {
      execResult,
      stdout,
      stderr,
      execError,
      time: new Date(),
    },
  ]);
  console.log("insert ok");
  process.exit();
})();
