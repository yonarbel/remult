


import { FindOptions, EntityProvider } from './data-interfaces';
import { Column } from './column';
import { Entity } from './entity';
import { Sort } from './sort';

import { AndFilter } from './filter/and-filter';
import { StringColumn } from './columns/string-column';
import { UserInfo, SpecificEntityHelper } from './context';
import { FilterBase } from './filter/filter-interfaces';

export class DataApi<T extends Entity<any>> {
  getRoute() {
    if (!this.options.name)
      return this.entityProvider.create().defs.name;
    return this.options.name;
  }
  options: DataApiSettings<T>;
  constructor(private entityProvider: SpecificEntityHelper<any, T>) {
    this.options = entityProvider._getApiSettings();
  }

  async get(response: DataApiResponse, id: any) {
    if (this.options.allowRead == false) {
      response.methodNotAllowed();
      return;
    }
    await this.doOnId(response, id, async row => response.success(this.entityProvider.toApiPojo(row)));
  }
  async count(response: DataApiResponse, request: DataApiRequest) {
    try {

      response.success({ count: +await this.entityProvider.count(t => this.buildWhere(t, request)) });
    } catch (err) {
      response.error(err);
    }
  }

  async getArray(response: DataApiResponse, request: DataApiRequest) {
    if (this.options.allowRead == false) {
      response.methodNotAllowed();
      return;
    }
    try {
      let findOptions: FindOptions<T> = {};
      if (this.options && this.options.get) {
        Object.assign(findOptions, this.options.get);
      }
      findOptions.where = t => this.buildWhere(t, request);
      if (request) {

        let sort = <string>request.get("_sort");
        if (sort != undefined) {
          let dir = request.get('_order');
          let dirItems: string[] = [];
          if (dir)
            dirItems = dir.split(',');
          findOptions.orderBy = x => {
            let r = new Sort();
            sort.split(',').forEach((name, i) => {
              let col = x.columns.find(name.trim());
              if (col) {
                r.Segments.push({
                  column: col,
                  descending: i < dirItems.length && dirItems[i].toLowerCase().trim().startsWith("d")
                });
              }
            });
            return r;
          }

        }
        let limit = +request.get("_limit");
        if (!limit)
          limit = 25;
        findOptions.limit = limit;
        findOptions.page = +request.get("_page");

      }
      await this.entityProvider.find(findOptions)
        .then(async r => {
          response.success(await Promise.all(r.map(async y => this.entityProvider.toApiPojo(y))));
        });
    }
    catch (err) {
      response.error(err);
    }
  }
  private buildWhere(rowType: T, request: DataApiRequest) {
    var where: FilterBase;
    if (this.options && this.options.get && this.options.get.where)
      where = this.options.get.where(rowType);
    if (request) {
      rowType.columns.toArray().forEach(col => {
        function addFilter(key: string, theFilter: (val: any) => FilterBase) {
          let val = request.get(col.jsonName + key);
          if (val != undefined) {
            let addFilter = (val: any) => {
              let f = theFilter(col.fromRawValue(val));
              if (f) {
                if (where)
                  where = new AndFilter(where, f);
                else
                  where = f;
              }
            }

            if (val instanceof Array) {

              val.forEach(v => {
                addFilter(v);
              });
            }
            else
              addFilter(val);


          }
        }
        addFilter('', val => col.isEqualTo(val));
        addFilter('_gt', val => col.isGreaterThan(val));
        addFilter('_gte', val => col.isGreaterOrEqualTo(val));
        addFilter('_lt', val => col.isLessThan(val));
        addFilter('_lte', val => col.isLessOrEqualTo(val));
        addFilter('_ne', val => col.isDifferentFrom(val));
        addFilter('_contains', val => {
          let c = col as StringColumn;
          if (c != null && c.isContains) {
            return c.isContains(val);
          }
        });
        addFilter('_st', val => {
          let c = col as StringColumn;
          if (c != null && c.isContains) {
            return c.isStartsWith(val);
          }
        });
      });
    }
    return where;
  }

  private async doOnId(response: DataApiResponse, id: any, what: (row: T) => Promise<void>) {
    try {



      await this.entityProvider.find({
        where: x => {
          let where: FilterBase = x.__idColumn.isEqualTo(id);
          if (this.options && this.options.get && this.options.get.where)
            where = new AndFilter(where, this.options.get.where(x));
          return where;
        }
      })
        .then(async r => {
          if (r.length == 0)
            response.notFound();
          else if (r.length > 1)
            response.error({ message: "id is not unique" });
          else
            await what(r[0]);
        });
    } catch (err) {
      response.error(err);
    }
  }
  async put(response: DataApiResponse, id: any, body: any) {
    if (!this.options.allowUpdate) {
      response.methodNotAllowed();
      return;
    }
    await this.doOnId(response, id, async row => {
      this.entityProvider._updateEntityBasedOnApi(row, body);
      await row.save(this.options.validate, this.options.onSavingRow);
      response.success(this.entityProvider.toApiPojo(row));
    });
  }
  async delete(response: DataApiResponse, id: any) {
    if (!this.options.allowDelete) {
      response.methodNotAllowed();
      return;
    }
    await this.doOnId(response, id, async row => {
      await row.delete();
      response.deleted();
    });
  }


  async post(response: DataApiResponse, body: any) {
    if (!this.options.allowInsert) {
      response.methodNotAllowed();
      return;
    }
    try {

      let r = this.entityProvider._updateEntityBasedOnApi(this.entityProvider.create(), body);

      await r.save(this.options.validate, this.options.onSavingRow);
      response.created(this.entityProvider.toApiPojo(r));
    } catch (err) {
      response.error(err);
    }
  }

}
export interface DataApiSettings<rowType extends Entity<any>> {
  allowUpdate?: boolean,
  allowInsert?: boolean,
  allowDelete?: boolean,
  allowRead?: boolean,
  name?: string,
  get?: FindOptions<rowType>,
  validate?: (r: rowType) => void;
  onSavingRow?: (r: rowType) => Promise<any> | any;
}

export interface DataApiResponse {
  success(data: any): void;
  deleted(): void;
  created(data: any): void;
  notFound(): void;
  error(data: DataApiError): void;
  methodNotAllowed(): void;
  forbidden(): void;

}



export interface DataApiError {
  message: string;
}
export interface DataApiRequest {
  getBaseUrl(): string;
  get(key: string): any;
  getHeader(key: string): string;
  user: UserInfo;
  clientIp: string;
}
export interface DataApiServer {
  addAllowedHeader(name: string): void;
  addRequestProcessor(processAndReturnTrueToAouthorise: (req: DataApiRequest) => Promise<boolean>): void;

}
