import _ from "lodash";
import { ConfigService } from "src/services/ConfigService";
import { Options } from "@mikro-orm/core";

export function getConnections(): Options[] {
  const service = new ConfigService();
  const connections = service.loadConfigDb();
  return _.map(connections, (value, contextName) => ({
    ..._.omit(value, "connectionName"),
    contextName,
    allowGlobalContext: true,
    ...(contextName === "default"
      ? {}
      : { discovery: { warnWhenNoEntities: false } }),
  })) as Options[];
}
