import { emitter } from "./emitter";
import * as _ from "lodash";
import { prometheus } from "./prometheus";
import { logger } from "./sys_lib/logger";
class Report {
  public init() {
    emitter.on("set_label_gauge", (data: any) => {
      const labels = _.get(data, "label_names", []);
      if (!_.isArray(labels) || labels.length <= 0) {
        logger.error(`label data is incorrect`, labels);
        return;
      }
      logger.debug("event execute.,...");
      prometheus.set_label_gauge(data);
      return "setOk";
    });
  }
}
const report: Report = new Report();
export { report };
