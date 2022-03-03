import { BodyParams, PathParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post, Put, Delete } from "@tsed/schema";
import {
  ConnectionCreateParams,
  ConnectionApplyParams,
} from "src/interfaces/ConnectionParams";
import {
  ConnectionsModel,
  ConnectionsModelByFile,
  ConnectionsModelByUrl,
} from "src/models/ConnectionsModel";
import { ConnectionService } from "src/services/connections/ConnectionService";

@Controller("/connections")
export class ConnectionController {
  @Inject()
  protected connectionService: ConnectionService;

  @Get("/")
  @ContentType("application/json")
  getAll() {
    return this.connectionService.findMany();
  }

  @Post("/create")
  create(@BodyParams(ConnectionsModel) config: ConnectionsModel) {
    return this.connectionService.create(config);
  }

  @Post("/create/by-file")
  createByFile(
    @BodyParams(ConnectionsModelByFile) config: ConnectionsModelByFile
  ) {
    return this.connectionService.createByFile(config);
  }

  @Post("/create/by-url")
  createByUrl(
    @BodyParams(ConnectionsModelByUrl) config: ConnectionsModelByUrl
  ) {
    return this.connectionService.createByUrl(config);
  }

  @Post("/:id")
  apply(
    @PathParams("id") id: number,
    @BodyParams() params: ConnectionApplyParams
  ) {
    return this.connectionService.apply(id, params);
  }

  @Put("/:id")
  update(
    @PathParams("id") id: number,
    @BodyParams() config: ConnectionCreateParams
  ) {
    return this.connectionService.update(id, config);
  }

  @Delete("/:id")
  delete(@PathParams("id") id: number) {
    return this.connectionService.delete(id);
  }
}
