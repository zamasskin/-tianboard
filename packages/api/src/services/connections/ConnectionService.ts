import _ from "lodash";
import fs from "fs-extra";
import { Constant, Inject, Injectable } from "@tsed/di";
import { ConnectionStringParser } from "connection-string-parser";
import { MikroOrmRegistry, Orm } from "@tsed/mikro-orm";
import path from "path";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { Knex } from "knex";

import {
  ConnectionApplyParams,
  ConnectionCreateParams,
} from "src/interfaces/ConnectionParams";
import { PrismaService } from "../PrismaService";
import { ConnectionsRepository } from "./ConnectionsRepository";
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
import { rootDir } from "src/config";
import { Options, MikroORM } from "@mikro-orm/core";

// При подключении новых провайдеров типы заводятся тут(например для провайдера mongoDb)
type provider = Knex;

@Injectable()
export class ConnectionService {
  @Inject()
  protected connectionService: ConnectionsRepository;

  @Orm("default")
  private readonly orm!: MikroORM;

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
  update(id: number, config: ConnectionCreateParams) {
    let connectionUrl: string | undefined = undefined;
    if (config.url || config.params) {
      connectionUrl = this.getConnectionUrlByParams(config);
    }

    return this.connectionService.update({
      where: { id },
      select: this.connectionSects,
      data: {
        name: config.name,
        provider: config.provider,
        connectionUrl,
        updatedAt: new Date(),
      },
    });
  }

  delete(id: number) {
    return this.connectionService.delete({
      where: { id },
      select: this.connectionSects,
    });
  }
}
