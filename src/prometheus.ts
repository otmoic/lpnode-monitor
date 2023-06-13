import { logger } from "./sys_lib/logger";
const md5 = require("md5");
import _ from "lodash";
const client = require("prom-client");
const indicators_lists: Map<string, { lastUpdate: number; ref: any }> =
  new Map();
class Prometheus {
  public init() {
    this.checkOverdueIndicators();
  }
  public async on_metric_collect() {
    return await client.register.metrics();
  }
  public async set_label_gauge(data: any) {
    const metric_type = _.get(data, "metric_type", "gauge");
    const metric_name = _.get(data, "metric_name", undefined);
    const labels = _.get(data, "label_names", []);
    const indicators_ref = this.get_indicators(
      metric_name,
      metric_type,
      labels
    );
    this.set_label_gauge_value(indicators_ref, data);
    return "Prometheus";
  }
  private set_label_gauge_value(indicators_ref: any, data: any) {
    const labelBox = {};
    // eslint-disable-next-line array-callback-return
    _.keys(_.get(data, "payload.labels", {})).map((label_key) => {
      _.set(
        labelBox,
        `${label_key}`,
        _.get(data, `payload.labels.${label_key}`)
      );
    });
    indicators_ref.set(labelBox, _.get(data, "payload.value", 0));
    logger.debug("📀:", labelBox);
  }
  private get_indicators(
    metric_name: string,
    metric_type: string,
    labels: string[]
  ) {
    const map_key = `${metric_name}_${metric_type}_${md5(labels.join(""))}`;
    logger.debug("map key is:", map_key);
    const indicators_item: any = indicators_lists.get(map_key);
    if (indicators_item) {
      return indicators_item.ref;
    }
    let indicators_ref;
    if (!indicators_item) {
      indicators_ref = new client.Gauge({
        name: metric_name,
        help: "metric_help",
        labelNames: labels,
      });
      indicators_ref._metric_type = metric_type;
      indicators_lists.set(map_key, {
        lastUpdate: new Date().getTime(),
        ref: indicators_ref,
      });
      return indicators_ref;
    }
  }
  protected checkOverdueIndicators() {
    indicators_lists.forEach((item, key) => {
      if (new Date().getTime() - item.lastUpdate > 1000 * 60 * 60 * 2) {
        logger.warn(`remove timeout indicator`, key);
        indicators_lists.delete(key);
      }
    });
  }
}
const prometheus: Prometheus = new Prometheus();
export { prometheus };
