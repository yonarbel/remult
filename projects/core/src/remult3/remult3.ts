
import { ClassType } from "../../classType";
import { FieldMetadata } from "../column-interfaces";
import { IterateToArrayOptions, Unobserve } from "../context";
import { EntityOptions as EntityOptions } from "../entity";
import { Filter } from "../filter/filter-interfaces";
import { BackendMethod } from "../server-action";
import { Sort, SortSegment } from "../sort";
import { entityEventListener } from "../__EntityValueProvider";




/*

## Presentation notes:
[] Review Setup
    [] common.ts - explain remult
    [] server/index

[] Create Entity
    [] create a class with title.
    [] decorate it
    [] show swagger
        [] talk about paging
    [] add IdEntity
    [] show swagger
    [] Add Crud
    [] show swagger
    [] add a few tasks

[] App.tsx
    [] add task repo - it wraps axios - type of agent or service..

[] skip line-through

[] Order by and where -  PAGING 

[] Backend
    [] Iterate - explain that we run on all tasks on the server.
    [] create taskService - for set all
    [] backend method - talk about transaction and unit of work

    [] Propose to skip authorize implementation. - un intrusive, un opinionated


## TODO
[] try add rest api doc to the swagger doc.
[] initExpress to accept dataPRovider:DAtaProvider||Promise||lamda of proimse - take down isnode
[] createPostgresConnection ({connectionString:"asdfas", poolconfig:, sslInDev,configuration Heroku or postgres Poolconfig})
[] consider simplifying the postgres setup docs.
[] adjust swagger to show that you can filter.
[] consider merging the postgres and deployment docs
[] add swagger to starter kit
[] add https to starter kit
![] reorder auth service. for angular and starter project
[] reorder the code of AuthService.

[] new remult that gets data provider
[] getValidContext to change to getRemult - and if request is null, also work.
[] check why update object value with null didn't update the database in hugmom
[V] make doc update well and not recreated
[] validate to field, and validate to entity - return true if valid and false if not - and updates all error fields.
[] add to iterate pagesize
[] change entity backend methods to be entity/backend method name
[] remove swagger from tutorial, and add it to separate article


[] check why helmet doesnt force https

[] fix that updating a server expression, is not visible to the server - self.changeSeenByDeliveryManager - can be used to do additional operations on save. On the other hand, server expression sounds like something that you can trust on the server to reflect something
[] find a solution for expect(task).toEqual({id:1,blabla:'asda}) - currently it doesn't work well with entity.
[] create a todo app using "normal" node js - and create a refactoring video
[] replace uuid with a newer version based on the warnings:npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
[] write an article about the different usages of backend method:
    [] static
    [] entity
    [] controller
    [] and usage FieldType - to send complex parameters
[] continue swagger to reflect Backend Methods
[] overload for find, and iterate that only accepts where (we have that for find first)
[] check why realworld - allowApiInsert - the first param was any.
[] consider removing the customFilterTranslator type - it hides the parameters that a create filter might get
[] Love Angular? Give our repo a star.Star

```
 Love Angular?&nbsp;
      <a href="https://github.com/angular/angular" target="_blank" rel="noopener"> Give our repo a star.
        <div class="github-star-badge">
            <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          Star
        </div>
      </a>
```
[] google sheets gateway
[] consider "class-validator", integration
[] typeorm gateway
[] sqlite
[] check sending field types to custom filter


## TODO Docs
[] doc field types (date etc... value converter and more)
[] doc value list column - and it's usage as strategy
[] fix tutorial images


## Todo Angular Material
[V] test why date is equal to null - didn't work
[] readonly doesn't work on checkbox in area
[] add id lookup in remult angular
[] insert the column selection into the grid button.


## Project to fix
[]code samples

[V]todo angular
[V]todo react
[V] bezkoder react
[V] bekoder vue
[] upgrade all satelite projects to latest remult
[V] upgrade northwind to latest remult
[V] update northwind to use AuthService
[V] update northwind to use skip tests
[V] update northwind to use strict

[V] change structure of remult projects - to include projects/core projects/test-angular and under it, everything.



## Yoni TODO
[] fix helmet non http - http://itimet.herokuapp.com/
[] fix FilterFactories in the case of optional fields, to handle gracefully the fields metadata and filter etc.... - tried -? (based on the Required Implementation, but it breaks Fields<any> = Fields<Product>)
[] add to iterator - nextPage or something that brings back the page as a set array. something to use not just in the for await scenario
   iterator(): {
        next: () => Promise<IteratorResult<entityType, entityType>>;
        nextArray:(num:number) => Promise<IteratorResult<entityType[], entityType[]>>;
    };

[] other name for load in find, that indicates that load only loads the detailed fields - not just the lazy ones.
[] Rename Allowed and InstanceAllowed, and Allow
[] field container type vs entity type vs target

[] Docs
    [] rewrite readme.md > Entities + CRUD, BackendMethods, Authorization
        [V] make sure readme is updated in npmjs.com
    [] getting started > npm i, connect to db, initExpress, init frontend
    [] Tutorials > Angular,React,Vue
    [] API reference in Docs
        [] determine a few main types which should appear (Remult, Entity, Field, Controller, BackendMethod, etc...)
            [] EntityOptions members should be listed in the "Entity" reference page etc (if possible)
        [] review existing texts

[] Housekeeping
    [] Remote unnecessary files from repo


## review with Yoni
[] apiRequireId = reconsider, maybe give more flexibility(filter orderid on orderdetails) etc...


[] ## Realworld
    [] real world angular - moving target, there is a full  new version of it - might worth forking from that
    [] use subscription like the original one does.
    [] real world - consider adding custom remult, that will have current user details?
    [] React - there is a new react typescript project - https://github.com/angelguzmaning/ts-redux-react-realworld-example-app




## context related:

## things that came up during react:











## V2
### questions about find with create
[] backend method - to expose some result that indicates progress.
[] should the new row created when not found enter the cache?
[] should cache empty results?
[] find with create and cache, and then find without create and with cache - should return the cache?
[] talk some more about value change, since in the current implementation, an update through click doesn't fire it
[] consider a column that is saved to more than one column in the db
[] consider adding the count value in the response of the array and do it in the response of iterate, to not break api
[] talk about forgetting the :type on fields - it's dangerous and can lead to debug issues - on the other hand we want some default - not sure if we should scream
[] consider the case where the name in restapi (json name) of a column is different from it's member - see commented test "json name is important"
[] switched back to es5 - since react scripts default is es5 and it breaks things
[] consider adding documentation properties to options, 'description', 'example value'

## remult angular future
[] change the getValue - to  displayValue
[] change the input type to support code+value, displayValueOnly
[] without knowing the types  - it doesn't use the display value or get value - see date without experimental meta data



*/


export interface EntityRef<entityType> {
    hasErrors(): boolean;
    undoChanges();
    save(): Promise<entityType>;
    reload(): Promise<entityType>;
    delete(): Promise<void>;
    isNew(): boolean;
    wasChanged(): boolean;
    wasDeleted(): boolean;
    fields: Fields<entityType>;
    error: string;
    getId(): any;
    repository: Repository<entityType>;
    metadata: EntityMetadata<entityType>
    toApiJson(): any;
}
export type Fields<entityType> = {
    [Properties in keyof entityType]: FieldRef<entityType, entityType[Properties]>
} & {
    find(fieldMetadataOrKey: FieldMetadata | string): FieldRef<entityType, any>,
    [Symbol.iterator]: () => IterableIterator<FieldRef<entityType, any>>



}
export type FieldsMetadata<entityType> = {
    [Properties in keyof entityType]: FieldMetadata
} & {
    find(fieldMetadataOrKey: FieldMetadata | string): FieldMetadata,
    [Symbol.iterator]: () => IterableIterator<FieldMetadata>


}


export type SortSegments<entityType> = {
    [Properties in keyof entityType]: SortSegment & { descending(): SortSegment }
}

export interface FieldRef<entityType = any, valueType = any> {
    error: string;
    displayValue: string;
    value: valueType;
    originalValue: valueType;
    inputValue: string;
    valueChanged(): boolean;
    entityRef: EntityRef<entityType>;
    container: entityType;
    metadata: FieldMetadata<entityType>;
    load(): Promise<valueType>;
    valueIsNull(): boolean;
    originalValueIsNull(): boolean;
}
export interface IdMetadata<entityType = any> {

    field: FieldMetadata<any>;
    getIdFilter(id: any): Filter;
    isIdField(col: FieldMetadata): boolean;
    createIdInFilter(items: entityType[]): Filter;

}

export interface EntityMetadata<entityType = any> {
    readonly idMetadata: IdMetadata<entityType>;
    readonly key: string,
    readonly fields: FieldsMetadata<entityType>,
    readonly caption: string;
    readonly options: EntityOptions;
    readonly entityType: ClassType<entityType>;
    getDbName(): Promise<string>;
}
export interface Repository<entityType> {
    /**creates a json representation of the object */
    fromJson(x: any, isNew?: boolean): Promise<entityType>;
    metadata: EntityMetadata<entityType>;
    /** returns a result array based on the provided options */
    find(options?: FindOptions<entityType>): Promise<entityType[]>;
    iterate(whereOrOptions?: EntityFilter<entityType> | IterateOptions<entityType>): IterableResult<entityType>;
    findFirst(whereOrOptions?: EntityFilter<entityType> | FindFirstOptions<entityType>): Promise<entityType>;
    findId(id: entityType extends { id: number } ? number : entityType extends { id: string } ? string : any, options?: FindFirstOptionsBase<entityType>): Promise<entityType>;
    count(where?: EntityFilter<entityType>): Promise<number>;
    create(item?: Partial<entityType>): entityType;
    getEntityRef(item: entityType): EntityRef<entityType>;
    save(item: entityType): Promise<entityType>;
    delete(item: entityType): Promise<void>;
    addEventListener(listener: entityEventListener<entityType>): Unobserve;
}
export interface FindOptions<entityType> extends FindOptionsBase<entityType> {

    /** Determines the number of rows returned by the request, on the browser the default is 100 rows 
     * @example
     * this.products = await this.remult.repo(Products).find({
     *  limit:10,
     *  page:2
     * })
    */
    limit?: number;
    /** Determines the page number that will be used to extract the data 
     * @example
     * this.products = await this.remult.repo(Products).find({
     *  limit:10,
     *  page:2
     * })
    */
    page?: number;
}
/** Determines the order of rows returned by the query.
 * @example
 * await this.remult.repo(Products).find({ orderBy: p => p.name })
 * @example
 * await this.remult.repo(Products).find({ orderBy: p => [p.price, p.name])
 * @example
 * await this.remult.repo(Products).find({ orderBy: p => [{ field: p.price, descending: true }, p.name])
 */
export declare type EntityOrderBy<entityType> = (entity: SortSegments<entityType>) => SortSegment[] | SortSegment;

/**Used to filter the desired result set
 * @example
 * where: p=> p.availableFrom.isLessOrEqualTo(new Date()).and(p.availableTo.isGreaterOrEqualTo(new Date()))
 */
export declare type EntityFilter<entityType> = ((entityType: FilterFactories<entityType>) => (Filter | Promise<Filter> | (Filter | Promise<Filter>)[] | Promise<Filter[]>));





export interface FilterFactory<valueType> {
    isEqualTo(val: valueType): Filter;
    isDifferentFrom(val: valueType);
    isIn(val: valueType[]): Filter;
    isNotIn(val: valueType[]): Filter;
    metadata: FieldMetadata;
}

export interface ComparisonFilterFactory<valueType> extends FilterFactory<valueType> {


    isLessOrEqualTo(val: valueType): Filter;
    isLessThan(val: valueType): Filter;
    isGreaterThan(val: valueType): Filter;
    isGreaterOrEqualTo(val: valueType): Filter;
}
export interface ContainsFilterFactory<valueType> extends FilterFactory<valueType> {
    contains(val: string): Filter;
}

export type FilterFactories<entityType> = {
    [Properties in keyof entityType]: entityType[Properties] extends number | Date ? ComparisonFilterFactory<entityType[Properties]> :
    entityType[Properties] extends string ? (ContainsFilterFactory<entityType[Properties]> & ComparisonFilterFactory<entityType[Properties]>) :
    ContainsFilterFactory<entityType[Properties]>
}
export interface LoadOptions<entityType> {
    load?: (entity: FieldsMetadata<entityType>) => FieldMetadata[]
}
export interface FindOptionsBase<entityType> extends LoadOptions<entityType> {
    /** filters the data
    * @example
    * where p => p.price.isGreaterOrEqualTo(5)
    * @see For more usage examples see [EntityWhere](https://remult-ts.github.io/guide/ref_entitywhere)
    */
    where?: EntityFilter<entityType>;
    /** Determines the order in which the result will be sorted in
     * @see See [EntityOrderBy](https://remult-ts.github.io/guide/ref__entityorderby) for more examples on how to sort
     */
    orderBy?: EntityOrderBy<entityType>;
}
export interface FindFirstOptions<entityType> extends FindOptionsBase<entityType>, FindFirstOptionsBase<entityType> {



}
export interface FindFirstOptionsBase<entityType> extends LoadOptions<entityType> {
    /** default true
      */
    useCache?: boolean;

    createIfNotFound?: boolean;
}
export interface IterateOptions<entityType> extends FindOptionsBase<entityType> {
    progress?: { progress: (progress: number) => void };
}
export interface IterableResult<entityType> {
    toArray(options?: IterateToArrayOptions): Promise<entityType[]>;
    first(): Promise<entityType>;
    count(): Promise<number>;
    forEach(what: (item: entityType) => Promise<any>): Promise<number>;
    [Symbol.asyncIterator](): {
        next: () => Promise<IteratorResult<entityType, entityType>>;
    };
    
    

}


