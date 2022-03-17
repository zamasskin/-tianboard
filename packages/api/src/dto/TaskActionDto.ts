import { Task } from "src/entities/default/Task";

export class TaskActionDto {
  steps: number = 0;
  step: number = 0;
  error?: Error;
  off = false;
  constructor(private task: Task) {}

  get percent() {
    return Math.ceil((100 / this.steps) * this.step);
  }
}
