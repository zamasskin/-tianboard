import _ from "lodash";
import path from "path";

import configurations from "./configurations.json";

export function getConnections() {
  const connections = _.get(configurations, "connections");
  if (!_.isArray(connections)) {
    return [];
  }

  return _.chain(connections)
    .map((config) => {
      return config;
    })
    .value();
}

export function getConfigurations() {
  return configurations || {};
}

export const configPath = path.join(__dirname, "./configurations.json");
