import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { Task } from "./Task";

@Entity()
export class TaskAction {
  @PrimaryKey()
  id: number;

  @Property()
  step: number;

  @Property()
  error: boolean;

  @Property({ nullable: true })
  errorMessage: string;

  @Property()
  stop: boolean;

  @ManyToOne({ entity: () => Task })
  task: Task;

  constructor(task: Task) {
    this.task = task;
    this.step = 1;
    this.error = false;
    this.stop = false;
  }
}
