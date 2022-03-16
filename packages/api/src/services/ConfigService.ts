import { Injectable } from "@tsed/di";
import fs from "fs";
import path from "path";
import _ from "lodash";
import YAML from "yaml";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import {
  ConnectionsModel,
  ConnectionsModelByUrl,
} from "src/models/ConnectionsModel";
import { rootDir } from "src/config";

type connectionsType = (ConnectionsModel | ConnectionsModelByUrl) & {
  entities: string[];
};

@Injectable()
export class ConfigService {
  configPath(fileName: string) {
    return path.join(rootDir, "./config", fileName);
  }

  save(fileName: string, content: string) {
    const filePath = this.configPath(fileName);
    return fs.writeFileSync(filePath, content, { encoding: "utf8" });
  }

  load(fileName: string) {
    const filePath = this.configPath(fileName);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
    }
    return false;
  }

  yamlPath(fileName: string) {
    return path.join("./yaml", fileName);
  }

  loadYaml(fileName: string) {
    const filePath = this.yamlPath(fileName);
    const fileContent = this.load(filePath);
    if (fileContent) {
      return YAML.parse(fileContent);
    }
    return false;
  }

  saveYaml(fileName: string, content: any) {
    const filePath = this.yamlPath(fileName);
    const strContent = YAML.stringify(content);
    return this.save(filePath, strContent);
  }

  get configDbFileName() {
    return "database.yaml";
  }

  insertConfigDb(config: ConnectionsModel | ConnectionsModelByUrl) {
    const connections = this.loadConfigDb();

    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const contextName =
      _.keys(connections).length === 0 ? "default" : randomName;

    connections[contextName] = {
      ...config,
      entities: [`./src/entities/${contextName}/*.ts`],
    };

    return this.saveYaml(this.configDbFileName, connections);
  }

  loadConfigDb() {
    const connections: { [key: string]: connectionsType } =
      this.loadYaml(this.configDbFileName) || {};

    return connections;
  }

  loadConfigMail() {
    return this.loadYaml("mail.yaml");
  }
}
