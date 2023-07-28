import Redis from "ioredis";
import * as ioredisLib from "ioredis";
import * as _ from "lodash";
import { logger } from "./logger";

const host = _.get(process.env, "RedisHost", undefined);
const pass = _.get(process.env, "RedisPass", undefined);
const port = Number(_.get(process.env, "RedisPort", 6379));

class SyslibRedis {
  public async getRedis(indexNumber: number): Promise<ioredisLib.Redis> {
    if (indexNumber > 0) {
      throw new Error("redis index number must be 0");
    }
    const redisClient = new Redis({
      host,
      port,
      password: pass,
      db: indexNumber,
      retryStrategy: (times) => {
        logger.error(
          `redis Host:${host},port:${port} reconnect number ${times}`
        );
        const delay = Math.min(times * 50, 1000 * 10);
        return delay;
      },
    });
    setInterval(() => {
      redisClient.ping();
    }, 5000);
    return redisClient;
  }
}

export { SyslibRedis };
