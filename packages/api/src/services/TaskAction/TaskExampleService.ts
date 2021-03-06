import { $log, BeforeInit } from "@tsed/common";
import { Inject, Injectable } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { TaskAction } from "src/entities/default/TaskAction";
import { TaskActionsService } from "./TaskActionsService";

const examplesTask = new Map([
  [1, { steps: 10, tm: 1000 }],
  [2, { steps: 2, tm: 6000 }],
  [3, { steps: 15, tm: 2000 }],
  [4, { steps: 15, tm: 2000, stepError: 3 }],
]);

const timeout = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
@Injectable()
export class TaskExampleService implements BeforeInit {
  @Inject()
  taskActionService: TaskActionsService;

  $beforeInit(): void | Promise<any> {
    this.taskActionService.setMethod("example", {
      method: this.use,
      target: this,
    });
  }

  async use(taskAction: TaskAction) {
    const task = taskAction.task;
    if (!examplesTask.has(task.actionId)) {
      throw new NotFound("task not found");
    }
    const taskSettings = examplesTask.get(task.actionId);
    const steps = taskSettings?.steps || 0;
    $log.info(
      `taskId = ${task.id}, taskActionId = ${taskAction.id}, steps = ${steps}, step = ${taskAction.step}, percent = ${taskAction.percent} `
    );
    if (taskAction.step >= steps) {
      await this.taskActionService.delete(taskAction.id);
      return false;
    }

    if (taskAction.stop) {
      return false;
    }

    if (taskSettings?.stepError === taskAction.step) {
      throw new Error("example error");
    }

    await timeout(taskSettings?.tm || 0);
    taskAction.step++;
    taskAction.percent = (100 / steps) * taskAction.step;
    await this.taskActionService.checkAndSave(taskAction);
    return true;
  }
}
