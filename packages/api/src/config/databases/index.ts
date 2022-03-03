import _ from "lodash";
import path from "path";

import configurations from "./configurations.json";

export function getConnections() {
  const connections = _.get(configurations, "connections");
  if (!_.isArray(connections)) {
    return [];
  }

  return connections.map((connection) => _.omit(connection, "connectionName"));
}

export function getConnectionList() {
  const connections = _.get(configurations, "connections");
  if (!_.isArray(connections)) {
    return [];
  }

  return connections.map((connection) =>
    _.pick(connection, ["connectionName", "type", "contextName"])
  );
}

export function getConfigurations() {
  return configurations || {};
}

export const configPath = path.join(__dirname, "./configurations.json");
