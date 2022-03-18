import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put } from "@tsed/schema";
import { TaskActionsService } from "src/services/TaskActionsService";
import { TasksService } from "src/services/TasksService";

@Controller("/tasks")
export class TasksController {
  @Inject()
  protected taskService: TasksService;

  @Inject()
  protected taskActionService: TaskActionsService;

  @Get("/")
  get() {
    return "hello";
  }

  @Get("/actions")
  getActions() {
    return this.taskActionService.list();
  }

  @Get("/action-task")
  actionTask() {}

  @Post("/start")
  startMany() {
    this.taskService.startMany();
  }

  @Post("/stop")
  stopMany() {
    this.taskService.stopMany();
  }

  @Put("/start/:id")
  start() {}

  @Delete("/stop/:id")
  stop() {}
}
