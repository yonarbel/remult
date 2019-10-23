import { Entity, EntityOptions, NumberColumn, StringColumn, ClosedListColumn } from "../../core/utils";
import { DataProviderFactory } from "../../core/dataInterfaces1";
import { LocalStorageDataProvider } from "../../core/localStorageDataProvider";
import { EntityClass } from "../../context/Context";

export const environment = {
  production: false,
  dataSource: new LocalStorageDataProvider() as DataProviderFactory
};
@EntityClass
export class Categories extends Entity<number> {
  id = new NumberColumn({ dbName: 'CategoryID' });
  categoryName = new StringColumn();
  description = new StringColumn();
  categoryNameLength = new NumberColumn({
    virtualData: () => this.categoryName.value.length
  });
  categoryNameLengthAsync = new NumberColumn({
    virtualData: () => Promise.resolve(this.categoryName.value.length)
  });
  status = new StatusColumn();
  constructor(settings?: EntityOptions | string) {
    super(settings, () => new Categories(settings));
    this.__initColumns();
  }
}

export class Status {
  static open = new Status(0, "open");
  static closed = new Status(1, "closed");
  static hold = new Status(2, "hold");

  constructor(public id: number, public name: string) {

  }
  toString() {
    return this.name;
  }
}
export class StatusColumn extends ClosedListColumn<Status> {
  constructor() {
    super(Status);
  }

}