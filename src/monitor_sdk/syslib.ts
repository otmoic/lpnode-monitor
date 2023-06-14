import { logger } from "./logger";
import { DatabaseDict, SyslibInterface } from "./syslib_interface";
import * as mongodb from "mongodb";
import * as _ from "lodash";

const { MongoClient } = require("mongodb");
const mongoHost = _.get(process.env, "MONGODB_HOST", undefined);
const mongoPass = _.get(process.env, "MONGODB_ROOT_PASSWORD", undefined);
const uri = `mongodb://root:${mongoPass}@${mongoHost}:27017`;
logger.debug("mongodb uri", uri);
const client = new MongoClient(uri);
import { SyslibRedis } from "./syslib_redis";
import * as ioredisLib from "ioredis";
import request, { AxiosStatic } from "axios";

const syslibRedis = new SyslibRedis();
const dbCache: Map<string, mongodb.Db> = new Map();

class Syslib implements SyslibInterface {
  public dbclient(): mongodb.MongoClient {
    return client;
  }

  public async database(databaseIndex: DatabaseDict): Promise<mongodb.Db> {
    let database: any = dbCache.get(databaseIndex);
    if (database) {
      logger.debug(`get from cache`);
      return database;
    }
    if (!database) {
      database = client.db(databaseIndex);
    }
    return database;
  }

  public fetch: AxiosStatic = request;

  public async redis(redisIndex: number): Promise<ioredisLib.Redis> {
    return await syslibRedis.getRedis(redisIndex);
  }

  get logger() {
    return logger;
  }
}

export { Syslib };
