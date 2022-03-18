import { Inject, Injectable } from "@tsed/di";
import { Task } from "src/entities/default/Task";
import { TaskActionsService } from "./TaskActionsService";

@Injectable()
export class TasksService {
  @Inject()
  private taskActionService: TaskActionsService;

  call() {}

  startMany() {
    const task1 = new Task();
    task1.action = "example";
    task1.name = "test1";
    task1.actionId = 1;
    const task2 = new Task();
    task2.action = "example";
    task1.name = "test2";
    task2.actionId = 2;
    const task3 = new Task();
    task3.action = "example";
    task1.name = "test3";
    task3.actionId = 3;
    const task4 = new Task();
    task4.action = "example";
    task1.name = "test4";
    task4.actionId = 4;

    this.taskActionService.example(task1);
    this.taskActionService.example(task2);
    this.taskActionService.example(task3);
    this.taskActionService.example(task4);
  }

  stopMany() {
    this.taskActionService.clear();
  }
}
