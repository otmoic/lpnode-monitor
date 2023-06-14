import * as ioredisLib from "ioredis";
import { AxiosStatic } from 'axios';
import * as _ from "lodash";

export enum DatabaseDict {
  "Lp" = "lp_store",
  "Business" = "businessHistory"
}

export interface monitor {
  monitor_id: string;
  code: string | null;
  endpoint: string;
}

import * as mongodb from 'mongodb';

export {
  _
};

export interface SyslibInterface {
  database(databaseIndex: DatabaseDict): Promise<mongodb.Db>;

  dbclient(): mongodb.MongoClient;
  fetch?: AxiosStatic;

  redis(redisIndex: number): Promise<ioredisLib.Redis>;
}
