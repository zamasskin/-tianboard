import { Property, Required, Generics, CollectionOf } from "@tsed/schema";

@Generics("T")
export class FindPaginationModel<T> {
  @Property()
  @Required()
  perPage: number;

  @Property()
  @Required()
  currentPage: number;

  @CollectionOf("T")
  @Required()
  where: T;

  get options() {
    return {
      limit: this.perPage,
      offset: this.currentPage - 1,
    };
  }
}
