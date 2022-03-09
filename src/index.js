const mariadb = require('mariadb');
const pg = require('pg');

/**
 * Types of avaiable logs
 */
const LogVariant = Object.freeze({
  LOG: 'LOG',
  INFORMATION: 'INFO',
  WARNING: 'WARN',
  ERROR: 'ERROR',
});

/**
 * Database Types
 */
const Database = Object.freeze({
  MariaDB: 'MariaDB',
  PG: 'PostgreSQL',
});

/**
 * Database Credentials
 */
class Credentials {
  #host;
  #user;
  #password;
  #database;

  /**
   *
   * @param {string} host
   * @param {string} user
   * @param {string} password
   * @param {string} database
   */
  constructor(host, user, password, database) {
    this.#host = host;
    this.#user = user;
    this.#password = password;
    this.#database = database;
  }

  /**
   * @param {string} host
   */
  set host(host) {
    this.#host = host;
  }

  /**
   * @returns {string} host
   */
  get host() {
    return this.#host;
  }

  /**
   * @param {string} user
   */
  set user(user) {
    this.#user = user;
  }

  /**
   * @returns {string} user
   */
  get user() {
    return this.#user;
  }

  /**
   * @param {string} password
   */
  set password(password) {
    this.#password = password;
  }

  /**
   * @returns {string} password
   */
  get password() {
    return this.#password;
  }

  /**
   * @param {string} database
   */
  set database(database) {
    this.#database = database;
  }

  /**
   * @returns {string} database
   */
  get database() {
    return this.#database;
  }
}

/**
 * LoggerJS-Client to create logs
 */
class Client {
  #dbType;
  #application;
  #client;
  #pool;

  /**
   *
   * @param {Database} dbType
   * @param {Credentials} credentials
   * @param {application} application
   */
  constructor(dbType, credentials, application = 'NONE') {
    this.#dbType = dbType;
    this.#application = application;

    switch (dbType) {
      case 'MariaDB':
        this.#pool = mariadb.createPool(credentials);
        break;

      case 'PostgreSQL':
        this.#client = new pg.Client(credentials);
        break;
    }
  }

  /**
   *
   * @param {LogVariant} variant
   * @param {string} code
   * @param {string} message
   */
  log(variant, code, message) {
    console.log(
      `[${variant}:${new Date().toISOString()}] (${code}) ${message}`
    );

    let result;
    switch (this.#dbType) {
      case 'MariaDB':
        result = new Promise((res, rej) => {
          this.#pool
            .getConnection()
            .then((conn) => {
              return conn
                .query(
                  'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
                  [this.#application, variant, code, message]
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
        result = new Promise((res, rej) => {
          this.#client.connect().then(() => {
            this.#client
              .query(
                'INSERT INTO logs(application, type, code, message) VALUES ($1, $2, $3, $4)',
                [this.#application, variant, code, message]
              )
              .then((result) => {
                this.#client.end();
                res(result);
              })
              .catch((err) => {
                this.#client.end();
                rej(err);
              });
          });
        });
        break;
    }

    return result;
  }
}

module.exports = {
  LogVariant: LogVariant,
  Database: Database,
  Credentials: Credentials,
  Client: Client,
};
