import { BodyParams } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { ContentType, Get, Post } from "@tsed/schema";

import { PublicFsService } from "src/services/PublicFsService";

@Controller("/public-fs")
export class PublicFsController {
  @Inject()
  protected service: PublicFsService;

  @Get("/")
  get() {
    return "hello";
  }

  @Post("/file-list")
  @ContentType("application/json")
  files(@BodyParams() { path }: { path: string }) {
    return this.service.files(path);
  }
}
