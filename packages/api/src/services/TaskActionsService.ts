import { Injectable } from "@tsed/di";
import * as uuid from "uuid";
import { Task } from "src/entities/default/Task";
import { NotFound } from "@tsed/exceptions";
import { TaskActionDto } from "src/dto/TaskActionDto";

const examplesTask = new Map([
  [1, { steps: 10, tm: 1000 }],
  [2, { steps: 2, tm: 6000 }],
  [3, { steps: 15, tm: 2000 }],
  [4, { steps: 15, tm: 2000, stepError: 10 }],
]);

const timeout = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

@Injectable()
export class TaskActionsService {
  private tasks: Map<string, TaskActionDto> = new Map<string, TaskActionDto>();

  example(task: Task) {
    if (!examplesTask.has(task.actionId)) {
      throw new NotFound("task not found");
    }

    const id = uuid.v4();
    const taskSettings = examplesTask.get(task.actionId);

    const taskAction = new TaskActionDto(task);
    taskAction.steps = taskSettings?.steps || 0;

    this.tasks.set(id, taskAction);

    const callAction = async () => {
      try {
        if (
          taskAction.step >= taskAction.steps ||
          taskAction.error ||
          taskAction?.off
        ) {
          return;
        }

        console.log(id, taskAction.percent);
        await timeout(taskSettings?.tm || 0);
        taskAction.step++;
        await callAction();
      } catch (e) {
        taskAction.error = e;
      }
    };

    callAction()
      .then(() => {
        taskAction.off = true;
        this.tasks.delete(id);
      })
      .catch((e) => {
        taskAction.error = e;
      });

    return id;
  }

  stop(id: string) {
    if (this.tasks.has(id)) {
      throw new NotFound("task not found");
    }

    const task = this.tasks.get(id) as TaskActionDto;
    task.off = true;
    this.tasks.delete(id);
  }

  clear() {
    for (const task of this.tasks.values()) {
      task.off = true;
    }
    this.tasks.clear();
  }
}
