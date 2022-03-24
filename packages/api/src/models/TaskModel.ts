import { Property, Required } from "@tsed/schema";

export class TaskModel {
  @Property()
  @Required()
  name: string;

  @Property()
  dateStart?: Date;

  @Property()
  cronExpression?: string;

  @Property()
  @Required()
  recurrent: boolean;

  @Property()
  @Required()
  action: string;

  @Property()
  @Required()
  actionId: number;
}
