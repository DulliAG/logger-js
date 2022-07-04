import mariadb from 'mariadb';
import pg from 'pg';

export type LogType = 'LOG' | 'INFORMATION' | 'WARNING' | 'ERROR';

export type Database = 'MariaDB' | 'PostgreSQL';

export interface Credentials {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface ClientOptions {
  application: string;
  saveLogs?: boolean;
  consoleOutput?: boolean;
}

export class Client {
  private database: Database;
  private credentials: Credentials;
  private options: ClientOptions = {
    saveLogs: true,
    consoleOutput: true,
  } as ClientOptions;

  private pool: mariadb.Pool;

  constructor(
    database: Database,
    credentials: Credentials,
    options: ClientOptions
  ) {
    this.database = database;
    this.credentials = credentials;
    for (const [key, value] of Object.entries(options)) {
      this.options[key] = value;
    }

    switch (database) {
      case 'MariaDB':
        this.pool = mariadb.createPool(credentials);
        break;
    }
  }

  log(type: LogType, category: string, message: string) {
    if (this.options.consoleOutput) {
      console.log(
        `[${type}:${new Date().toISOString()}] (${category}) ${message}`
      );
    }

    if (!this.options.saveLogs) return null;
    switch (this.database) {
      case 'MariaDB':
        return new Promise((res, rej) => {
          this.pool
            .getConnection()
            .then((conn) => {
              return conn
                .query(
                  'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
                  [this.options.application, type, category, message]
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

      case 'PostgreSQL':
        return new Promise((res, rej) => {
          const client = new pg.Client(this.credentials);
          client.connect().then(() => {
            client
              .query(
                'INSERT INTO logs(application, type, code, message) VALUES ($1, $2, $3, $4)',
                [this.options.application, type, category, message]
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
  }
}
