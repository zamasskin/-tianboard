import _ from "lodash";
import fs from "fs-extra";
import path from "path";
import { Constant, Inject, Injectable } from "@tsed/di";
import { ConnectionStringParser } from "connection-string-parser";
import { MikroOrmRegistry, Orm } from "@tsed/mikro-orm";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import {
  ConnectionApplyParams,
  ConnectionCreateParams,
} from "src/interfaces/ConnectionParams";
import { PrismaService } from "./PrismaService";
import {
  ConnectionsModel,
  ConnectionsModelByFile,
  ConnectionsModelByUrl,
} from "src/models/ConnectionsModel";
import {
  getConnections,
  getConfigurations,
  configPath,
  getConnectionList,
} from "src/config/databases";
import { Options, MikroORM } from "@mikro-orm/core";
import { User } from "src/entities/default/User";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { rootDir } from "src/config";

@Injectable()
export class ConnectionService {
  @Inject()
  prisma: PrismaService;

  @Constant("env")
  production: boolean;

  @Inject()
  registry: MikroOrmRegistry;

  // Выполнение запроса
  async apply(contextName: string, { query, params }: ConnectionApplyParams) {
    const orm = this.registry.get(contextName);
    if (!orm?.em) {
      throw new Error("connection not found");
    }
    return orm.em.getConnection().execute(query);
  }

  // Парсинг параметров для подключения
  getConnectionUrlByParams(config: ConnectionCreateParams) {
    if (!config.provider) {
      throw new Error("provider not defined");
    }

    let connectionUrl: string;
    if (config.url) {
      connectionUrl = config.url;
    } else if (config.params) {
      const connectionStringParser = new ConnectionStringParser({
        scheme: config.provider,
        hosts: [],
      });
      connectionUrl = connectionStringParser.format(config.params);
    } else {
      throw new Error("params not found");
    }
    return connectionUrl;
  }

  get connectionSects() {
    return {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      provider: true,
    };
  }

  // Получение всех подключений
  findMany() {
    return getConnectionList();
  }

  // Создание нового подключения
  create(config: ConnectionsModel) {
    return this.saveConnections(config);
  }

  createByFile(config: ConnectionsModelByFile) {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    const fileName = `${randomName}.db`;
    const filePath = `file://./` + fileName;
    return this.saveConnections({
      clientUrl: filePath,
      ...config,
    });
  }

  createByUrl(config: ConnectionsModelByUrl) {
    return this.saveConnections(config);
  }

  async saveConnections(config: ConnectionsModel | ConnectionsModelByUrl) {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    const connections = getConnections();
    const contextName = connections.length === 0 ? "default" : randomName;
    if (connections.length === 0) {
      await this.createSchema(config);
    }
    const updateConnections = [
      ...connections,
      {
        ...config,
        contextName,
        entities: [`./src/entities/${contextName}/*.ts`],
        ...(connections.length > 0
          ? { discovery: { warnWhenNoEntities: false } }
          : {}),
      },
    ];

    const updateConfig = _.merge(getConfigurations(), {
      connections: updateConnections,
    });
    const result = await fs.writeJSON(configPath, updateConfig, { spaces: 2 });
    return { result: true };
  }

  async createSchema(config: ConnectionsModel | ConnectionsModelByUrl) {
    const orm = await MikroORM.init({
      ...(config as Options),
      entities: [`./src/entities/default/*.ts`],
    });
    const generator = orm.getSchemaGenerator();

    const dropDump = await generator.getDropSchemaSQL();
    console.log(dropDump);

    const createDump = await generator.getCreateSchemaSQL();
    console.log(createDump);

    const updateDump = await generator.getUpdateSchemaSQL();
    console.log(updateDump);

    // there is also `generate()` method that returns drop + create queries
    const dropAndCreateDump = await generator.generate();
    console.log(dropAndCreateDump);

    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();
    //https://github.com/tsedio/tsed/blob/production/packages/orm/mikro-orm/src/decorators/orm.ts
  }

  // Изменение текущего подключения по ид
  update(id: string, config: ConnectionCreateParams) {}

  async delete(id: string) {
    if (id === "default") {
      throw new Forbidden("This connection cannot be deleted.");
    }

    const configurations = getConfigurations();
    const connections = _.get(configurations, "connections");
    const deleteConnection = connections.find(
      ({ contextName }: { contextName: string }) => contextName === id
    );
    if (!deleteConnection) {
      throw new NotFound("connection not found");
    }

    if (
      deleteConnection.clientUrl &&
      deleteConnection.clientUrl.substr(0, 7) === "file://"
    ) {
      const search = deleteConnection.clientUrl.match(/\/((\w|\.)+)$/);
      if (search && search.length > 1) {
        fs.rmSync(path.join(rootDir, "../", search[1]));
      }
    }

    const updateConnections = connections.filter(
      ({ contextName }: { contextName: string }) => contextName !== id
    );

    const updateConfig = { ...configurations, connections: updateConnections };

    console.log(updateConfig);

    await fs.writeJSON(configPath, updateConfig, { spaces: 2 });
    return { result: true };
  }

  async isBootstrap() {
    let userInstalled = false;
    let connectionInstalled = getConnectionList().length > 0;
    if (connectionInstalled) {
      const orm = await this.registry.get("default");
      if (orm?.em) {
        const count = await orm.em.fork({}).count(User);
        userInstalled = count > 0;
      }
    }
    return {
      connectionInstalled,
      userInstalled,
    };
  }
}
