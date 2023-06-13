import { http_server } from "./http_server";
import { report } from "./repot";
import { logger } from "./sys_lib/logger";

async function main() {
  report.init();
  http_server.start();
}
main()
  .then(() => {
    logger.debug("The program started successfully");
  })
  .catch((e) => {
    logger.error(e);
  });
logger.debug("000000");
