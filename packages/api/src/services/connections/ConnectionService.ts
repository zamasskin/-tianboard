import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import { Constant, Inject, Injectable } from "@tsed/di";
import { ConnectionStringParser } from "connection-string-parser";
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
import ConnectionAbstract from "src/abstract/ConnectionAbstract";
import { ConnectionsRepository } from "./ConnectionsRepository";
import KnexConnection, {
  PROVIDERS,
} from "../../libs/connections/KnexConnection";
import {
  ConnectionsModel,
  ConnectionsModelByFile,
  ConnectionsModelByUrl,
} from "src/models/ConnectionsModel";
import {
  getConnections,
  getConfigurations,
  configPath,
} from "src/config/databases";

// При подключении новых провайдеров типы заводятся тут(например для провайдера mongoDb)
type provider = Knex;

@Injectable()
export class ConnectionService {
  @Inject()
  protected connectionService: ConnectionsRepository;

  @Inject()
  prisma: PrismaService;

  @Constant("env")
  production: boolean;

  // Создание коннектора для запросов
  connect(
    provider: string,
    connectionUrl: string
  ): ConnectionAbstract<provider> {
    if (PROVIDERS.includes(provider)) {
      return new KnexConnection(provider, connectionUrl);
    }

    throw new Error("connection not found");
  }

  // Выполнение запроса
  async apply(connectionId: number, { query, params }: ConnectionApplyParams) {
    if (!connectionId) {
      return this.prisma.$queryRawUnsafe(query);
    }

    const connectionParams = await this.connectionService.findUnique({
      where: { id: connectionId },
    });
    if (connectionParams) {
      const connection = this.connect(
        connectionParams.provider,
        connectionParams.connectionUrl
      );
      return connection.apply({ query, params });
    }
    throw new Error("connection not found");
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
    return this.connectionService.findMany({
      select: this.connectionSects,
    });
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
    const filePath = path.join("../data/", fileName);
    return this.saveConnections({
      clientUrl: filePath,
      ...config,
    });
  }

  createByUrl(config: ConnectionsModelByUrl) {
    return this.saveConnections(config);
  }

  async saveConnections(config: ConnectionsModel | ConnectionsModelByUrl) {
    const connections = getConnections();
    console.log(connections);
    const id = connections.length === 0 ? "default" : uuidv4();
    const updateConnections = [...connections, { ...config, id }];
    const updateConfig = _.merge(getConfigurations(), {
      connections: updateConnections,
    });
    const result = await fs.writeJSON(configPath, updateConfig, { spaces: 2 });
    return { result: true };
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
