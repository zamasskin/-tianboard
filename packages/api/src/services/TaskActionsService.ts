import { Injectable } from "@tsed/di";
import * as uuid from "uuid";
import { Task } from "src/entities/default/Task";
import { NotFound } from "@tsed/exceptions";
import { TaskActionDto } from "src/dto/TaskActionDto";

const examplesTask = new Map([
  [1, { steps: 10, tm: 1000 }],
  [2, { steps: 2, tm: 6000 }],
  [3, { steps: 15, tm: 2000 }],
  [4, { steps: 15, tm: 2000, stepError: 3 }],
]);

const timeout = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

@Injectable()
export class TaskActionsService {
  private taskActions: Map<string, TaskActionDto> = new Map<
    string,
    TaskActionDto
  >();

  example(task: Task) {
    if (!examplesTask.has(task.actionId)) {
      throw new NotFound("task not found");
    }

    const id = uuid.v4();
    const taskSettings = examplesTask.get(task.actionId);

    const taskAction = new TaskActionDto(task);
    taskAction.steps = taskSettings?.steps || 0;

    taskAction.callAction = async () => {
      if (
        taskAction.step >= taskAction.steps ||
        taskAction.error ||
        taskAction?.off
      ) {
        return;
      }

      if (taskSettings?.stepError === taskAction.step) {
        throw new Error("example error");
      }

      console.log(id, taskAction.percent);
      await timeout(taskSettings?.tm || 0);
      taskAction.step++;
      await taskAction.callAction();
    };
    taskAction.start(() => this.taskActions.delete(id));

    this.taskActions.set(id, taskAction);

    return id;
  }

  stop(id: string) {
    if (this.taskActions.has(id)) {
      throw new NotFound("task not found");
    }

    const taskAction = this.taskActions.get(id) as TaskActionDto;
    taskAction.off = true;
    this.taskActions.delete(id);
  }

  clear() {
    for (const task of this.taskActions.values()) {
      task.off = true;
    }
    this.taskActions.clear();
  }

  next(id: string) {
    if (this.taskActions.has(id)) {
      throw new NotFound("task not found");
    }

    const taskAction = this.taskActions.get(id) as TaskActionDto;
    taskAction.off = true;

    this.taskActions.set(id, taskAction.clone());
  }

  list() {
    const taskActionsDescription = [];
    for (const id of this.taskActions.keys()) {
      const taskAction = this.taskActions.get(id) as TaskActionDto;
      const task = taskAction.task;
      taskActionsDescription.push({
        id,
        percent: taskAction.percent,
        name: task.name,
        action: task.action,
        step: taskAction.step,
        steps: taskAction.steps,
        error: !!taskAction.error,
        message: taskAction.error?.message || "",
      });
    }
    return taskActionsDescription;
  }
}
