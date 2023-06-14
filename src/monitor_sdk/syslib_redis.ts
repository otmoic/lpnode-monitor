import Redis from "ioredis";
import * as ioredisLib from "ioredis";
import * as _ from "lodash";
import { logger } from "./logger";

const host = _.get(process.env, "OBRIDGE_LPNODE_DB_REDIS_MASTER_SERVICE_HOST");
const pass = _.get(process.env, "REDIS_PASSWORD", undefined);
const port = (() => {
  const port = _.get(process.env, "OBRIDGE_LPNODE_DB_REDIS_MASTER_SERVICE_PORT", 6379);
  return Number(port);
})();

class SyslibRedis {
  public async getRedis(indexNumber: number): Promise<ioredisLib.Redis> {
    const redisClient = new Redis({
      host, port, password: pass, db: indexNumber, retryStrategy: (times) => {
        logger.error(
          `redis Host:${host},port:${port} reconnect number ${times}`
        );
        const delay = Math.min(times * 50, 1000 * 10);
        return delay;
      }
    });
    return redisClient;
  }
}

export { SyslibRedis };
