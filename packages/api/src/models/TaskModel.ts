import { Property, Required } from "@tsed/schema";

export class TaskModel {
  @Property()
  @Required()
  name: string;

  @Property()
  @Required()
  dateStart: Date;

  @Property({ nullable: true })
  interval?: number;

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
