declare module 'better-sqlite3' {
  interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  interface Statement<T = any> {
    run(...params: any[]): RunResult;
    get(...params: any[]): T | undefined;
    all(...params: any[]): T[];
    iterate(...params: any[]): IterableIterator<T>;
    bind(...params: any[]): this;
  }

  interface Database {
    exec(sql: string): void;
    prepare<T = any>(sql: string): Statement<T>;
    close(): void;
  }

  class Database {
    constructor(filename: string, options?: DatabaseOptions);
    exec(sql: string): void;
    prepare<T = any>(sql: string): Statement<T>;
    close(): void;
  }

  export default Database;
}
