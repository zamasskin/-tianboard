import _ from "lodash";

import configurations from "./configurations.json";

export function getConnections(docRoot: string) {
  if (_.isArray(configurations)) {
    return [];
  }

  return _.chain(configurations)
    .map((config) => {
      return config;
    })
    .value();
}
