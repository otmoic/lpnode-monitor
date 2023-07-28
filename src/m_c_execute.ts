import sys_lib, { DatabaseDict } from "./monitor_sdk";
import * as _ from "lodash";
const child_process = require("node:child_process");
const argv = require("yargs-parser")(process.argv.slice(2));
(async () => {
  let stdout = "";
  let execResult;
  let stderr = "";
  let execError;
  const userScriptName = _.get(argv, "script", undefined);
  const debugFlag = _.get(argv, "debug", undefined);
  const container = async () => {
    const executeMode = _.get(argv, "module", undefined);
    console.log("userScriptName", userScriptName);
    console.log("executeMode", executeMode);
    if (!userScriptName) {
      throw new Error(`user script not found`);
    }
    return new Promise((resolve, reject) => {
      let basePath = `/user-script/run-script/`;
      if (debugFlag == "true") {
        basePath = __dirname;
      }
      const scriptFullPath = `${basePath}${userScriptName}`;
      console.log("execute user script fullpath:", scriptFullPath);
      const subProcess = child_process.fork(scriptFullPath, [], {
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
        reject(err);
      });
      // console.log("subProcess.send", { system_data: { env: process.env } });
      subProcess.send({ system_data: { env: process.env } });
      subProcess.on("close", () => {
        if (typeof execResult === "string") {
          resolve(execResult);
          console.log("sub process close");
          return;
        }
        if (typeof execResult === "object") {
          resolve(JSON.stringify(execResult));
          console.log("sub process close");
          return;
        }
        if (typeof execResult === "undefined") {
          resolve("undefined");
          console.log("sub process close");
          return;
        }
        resolve("unknown result type");
        console.log("sub process close");
        return;
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
      scriptName: userScriptName,
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
