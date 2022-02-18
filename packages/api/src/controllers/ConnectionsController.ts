import { BodyParams, PathParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post, Put, Delete } from "@tsed/schema";
import {
  ConnectionCreateParams,
  ConnectionApplyParams,
} from "src/interfaces/ConnectionParams";
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
  create(@BodyParams() config: ConnectionCreateParams) {
    return this.connectionService.create(config);
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
