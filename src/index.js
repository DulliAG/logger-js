const mariadb = require('mariadb');

const TYPES = Object.freeze({
  LOG: 'LOG',
  WARN: 'WARN',
  ERROR: 'ERROR',
});

class DatabaseCredentials {
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
   * @returns {string}
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
   * @returns {string}
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
   * @returns {string}
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
   * @returns {string}
   */
  get database() {
    return this.#database;
  }
}

class Logger {
  #application;
  #pool;

  /**
   *
   * @param {DatabaseCredentials} credentials
   * @param {string} application
   */
  constructor(credentials, application = 'NONE') {
    this.#pool = mariadb.createPool(credentials);
    this.#application = application;
  }

  /**
   * @param {string} application
   */
  set application(application) {
    this.#application = application;
  }

  /**
   * @returns {string}
   */
  get application() {
    return this.#application;
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  log(code, message) {
    return this.#pool
      .getConnection()
      .then((conn) => {
        return conn
          .query(
            'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
            [this.#application, TYPES.LOG, code, message]
          )
          .then((res) => {
            conn.release(); // release to pool
            return res; // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
          })
          .catch((err) => {
            conn.release(); // release to pool
            throw err;
          });
      })
      .catch((err) => console.log(err));
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  warn() {
    return this.#pool
      .getConnection()
      .then((conn) => {
        return conn
          .query(
            'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
            [this.#application, TYPES.WARN, code, message]
          )
          .then((res) => {
            conn.release(); // release to pool
            return res; // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
          })
          .catch((err) => {
            conn.release(); // release to pool
            throw err;
          });
      })
      .catch((err) => console.log(err));
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  error(code, message) {
    return this.#pool
      .getConnection()
      .then((conn) => {
        return conn
          .query(
            'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
            [this.#application, TYPES.ERROR, code, message]
          )
          .then((res) => {
            conn.release(); // release to pool
            return res; // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
          })
          .catch((err) => {
            conn.release(); // release to pool
            throw err;
          });
      })
      .catch((err) => console.log(err));
  }
}

module.exports = { TYPES, DatabaseCredentials, Logger };
