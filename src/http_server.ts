const express = require("express");
const app = express();
app.use(express.json?.());
import { emitter } from "./emitter";
import { prometheus } from "./prometheus";
import { logger } from "./sys_lib/logger";
class HttpServer {
  private init_router() {
    app.get("/test", async (req: any, res: any) => {
      res.write("test");
      res.end();
    });
    app.get("/", async (req: any, res: any) => {
      const ret = await prometheus.on_metric_collect();
      res.write(ret);
      res.end();
    });
    app.get("/metrics", async (req: any, res: any) => {
      const ret = await prometheus.on_metric_collect();
      res.write(ret);
      res.end();
    });
    app.post("/set_label_gauge", async (req: any, res: any) => {
      await emitter.emit("set_label_gauge", req.body);

      res.write(
        JSON.stringify({
          code: 0,
          msg: "ok",
        })
      );
      res.end();
    });
  }
  public async start() {
    this.init_router();
    app.listen(9096, () => {
      logger.info("The http service has been started");
    });
  }
}

const http_server = new HttpServer();
export { http_server };
