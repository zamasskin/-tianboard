import _ from "lodash";
import fs from "fs-extra";
import path from "path";
import { Constant, Inject, Injectable } from "@tsed/di";
import { ConnectionStringParser } from "connection-string-parser";
import { MikroOrmRegistry, Orm } from "@tsed/mikro-orm";
import { getConnections } from "src/config/yaml";

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
import { Options, MikroORM } from "@mikro-orm/core";
import { User } from "src/entities/default/User";
import { Forbidden, NotFound } from "@tsed/exceptions";
import { rootDir } from "src/config";
import { ConfigService } from "./ConfigService";
import { ConnectionDto } from "src/dto/ConnectionDto";
import { $log } from "@tsed/common";

@Injectable()
export class ConnectionService {
  @Inject()
  prisma: PrismaService;

  @Constant("env")
  production: boolean;

  @Inject()
  registry: MikroOrmRegistry;

  @Inject()
  configService: ConfigService;

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
    const connections = this.configService.loadConfigDb();
    return _.map(
      connections,
      (value, contextName) => new ConnectionDto({ ...value, contextName })
    );
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

  findOne(contextName: string) {
    const connections = this.configService.loadConfigDb();
    if (!_.has(connections, contextName)) {
      throw new NotFound("connection not found");
    }
    return new ConnectionDto({ ...connections[contextName], contextName });
  }

  createByUrl(config: ConnectionsModelByUrl) {
    return this.saveConnections(config);
  }

  async saveConnections(config: ConnectionsModel | ConnectionsModelByUrl) {
    const connections = this.configService.loadConfigDb();
    if (_.keys(connections).length === 0) {
      await this.generateTables(config);
    }
    this.configService.insertConfigDb(config);
  }

  async generateTables(config: ConnectionsModel | ConnectionsModelByUrl) {
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

    orm.close();
  }

  async getOrm() {
    const connections = getConnections();
    const config = connections.find((conn) => conn.contextName === "default");
    if (!config) {
      throw new NotFound("connection not found");
    }

    const orm = await MikroORM.init({
      ...(config as Options),
      entities: [`./src/entities/default/*.ts`],
    });
    return orm;
  }

  async createSchema() {
    const orm = await this.getOrm();
    const generator = await orm.getSchemaGenerator();
    await generator.updateSchema();
    orm.close();
  }

  async updateSchema() {
    const orm = await this.getOrm();
    const generator = await orm.getSchemaGenerator();
    await generator.updateSchema();
    orm.close();
  }

  async dropSchema() {
    const orm = await this.getOrm();
    const generator = await orm.getSchemaGenerator();
    await generator.dropSchema();
    orm.close();
  }

  async generateSchema() {
    const orm = await this.getOrm();
    const generator = await orm.getSchemaGenerator();
    await generator.generate();
    orm.close();
  }

  update(
    contextName: string,
    config: ConnectionsModelByUrl | ConnectionsModel
  ) {
    if (contextName === "default") {
      throw new Forbidden("This connection cannot be deleted.");
    }

    const connections = this.configService.loadConfigDb();
    if (!_.has(connections, contextName)) {
      throw new NotFound("connection not found");
    }

    let connection = connections[contextName];

    const isFile =
      config instanceof ConnectionsModelByUrl &&
      config.clientUrl.substr(0, 7) === "file://";
    connections[contextName] = isFile
      ? {
          ...connection,
          connectionName: config.connectionName,
        }
      : {
          ...config,
          entities: connection.entities,
        };

    this.configService.saveYaml(
      this.configService.configDbFileName,
      connections
    );
  }

  delete(contextName: string) {
    const connections = this.configService.loadConfigDb();
    if (!_.has(connections, contextName)) {
      throw new NotFound("connection not found");
    }
    this.configService.saveYaml(
      this.configService.configDbFileName,
      _.omit(connections, contextName)
    );
  }

  async isBootstrap() {
    let userInstalled = false;
    const connections = this.configService.loadConfigDb();
    let connectionInstalled = _.keys(connections).length > 0;
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
