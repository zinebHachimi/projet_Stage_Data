declare module 'mongodb' {
  export class ObjectId {
    constructor(id?: string | number);
    toHexString(): string;
    toString(): string;
  }
  export class MongoClient {
    constructor(uri: string, options?: any);
    connect(): Promise<MongoClient>;
    db(dbName?: string): Db;
  }
  export interface Db {
    collection<T = any>(name: string): Collection<T>;
  }
  export interface Collection<T> {
    findOne(query: any): Promise<T | null>;
    insertOne(doc: any): Promise<any>;
    updateOne(query: any, update: any): Promise<any>;
  }
}
