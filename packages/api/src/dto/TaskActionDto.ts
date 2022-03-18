import { Task } from "src/entities/default/Task";

export class TaskActionDto {
  steps: number = 0;
  step: number = 0;
  error?: Error;
  off = false;
  callAction: () => Promise<void>;
  constructor(public task: Task) {}

  get percent() {
    return Math.ceil((100 / this.steps) * this.step);
  }

  start(onCompleted: () => void) {
    this.callAction()
      .then(() => {
        this.off = true;
        onCompleted();
      })
      .catch((e) => {
        this.error = e;
      });
  }

  clone() {
    const taskAction = new TaskActionDto(this.task);
    taskAction.steps = this.steps;
    taskAction.callAction = this.callAction;
    return taskAction;
  }
}
