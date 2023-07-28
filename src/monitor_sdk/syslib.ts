import { logger } from "./logger";
import { DatabaseDict, SyslibInterface } from "./syslib_interface";
import * as mongodb from "mongodb";
import * as _ from "lodash";

const { MongoClient } = require("mongodb");
const mongoDbHost = _.get(process.env, "MongoDbHost", undefined);
const mongoDbPort = _.get(process.env, "MongoDbPort", 27017);
const MongoDbUser = _.get(process.env, "MongoDbUser", undefined);
const MongoDbPass = _.get(process.env, "MongoDbPass", undefined);
const MongoDbLpStore = _.get(process.env, "MongoDbLpStore", undefined);
const MongoDbBusiness = _.get(process.env, "MongoDbBusiness", undefined);

const mongoClientSet = new Map();
const storeUrl = `mongodb://${MongoDbUser}:${MongoDbPass}@${mongoDbHost}:${mongoDbPort}/${MongoDbLpStore}?authSource=${MongoDbLpStore}`;
const businessUrl = `mongodb://${MongoDbUser}:${MongoDbPass}@${mongoDbHost}:${mongoDbPort}/${MongoDbBusiness}?authSource=${MongoDbBusiness}`;

const storeClient = new MongoClient(storeUrl);
storeClient.connect();
const businessClient = new MongoClient(businessUrl);
businessClient.connect();
logger.info(`MongoDbLpStore: ${storeUrl}`);
mongoClientSet.set(DatabaseDict.Lp, storeClient);
logger.info(`MongoDbBusiness: ${businessUrl}`);
mongoClientSet.set(DatabaseDict.Business, businessClient);
import { SyslibRedis } from "./syslib_redis";
import * as ioredisLib from "ioredis";
import request, { AxiosStatic } from "axios";

const syslibRedis = new SyslibRedis();

class Syslib implements SyslibInterface {
  public async database(databaseIndex: DatabaseDict): Promise<mongodb.Db> {
    logger.info("databaseIndex: " + databaseIndex);
    const dbClient = mongoClientSet.get(databaseIndex);
    if (databaseIndex == DatabaseDict.Lp) {
      return dbClient.db(MongoDbLpStore);
    }
    if (databaseIndex == DatabaseDict.Business) {
      return dbClient.db(MongoDbBusiness);
    }
    throw new Error("databaseIndex is not supported");
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
