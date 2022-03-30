import mariadb from 'mariadb';
import pg from 'pg';

export enum LogVariant {
  LOG = 'LOG',
  INFORMATION = 'INFO',
  WARNING = 'WARN',
  ERROR = 'ERROR',
}

export enum Database {
  MariaDB = 'MariaDB',
  PG = 'PostgreSQL',
}

export interface Credentials {
  host: string;
  user: string;
  password: string;
  database: string;
}

export class Client {
  private database: Database;
  private credentials: Credentials;
  private application: string;

  private pool: mariadb.Pool;

  constructor(
    database: Database,
    credentials: Credentials,
    application: string = 'None'
  ) {
    this.database = database;
    this.credentials = credentials;
    this.application = application;

    switch (database) {
      case Database.MariaDB:
        this.pool = mariadb.createPool(credentials);
        break;
    }
  }

  log(type: LogVariant, category: string, message: string) {
    console.log(
      `[${type}:${new Date().toISOString()}] (${category}) ${message}`
    );

    let result: Promise<unknown>;

    switch (this.database) {
      case Database.MariaDB:
        result = new Promise((res, rej) => {
          this.pool
            .getConnection()
            .then((conn) => {
              return conn
                .query(
                  'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
                  [this.application, type, category, message]
                )
                .then((result) => {
                  conn.release();
                  res(result);
                })
                .catch((err) => {
                  conn.release();
                  throw err;
                });
            })
            .catch((err) => rej(err));
        });
        break;

      case Database.PG:
        result = new Promise((res, rej) => {
          const client = new pg.Client(this.credentials);
          client.connect().then(() => {
            client
              .query(
                'INSERT INTO logs(application, type, code, message) VALUES ($1, $2, $3, $4)',
                [this.application, type, category, message]
              )
              .then((result) => {
                client.end();
                res(result);
              })
              .catch((err) => {
                client.end();
                rej(err);
              });
          });
        });
        break;
    }

    return result;
  }
}
