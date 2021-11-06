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
   * @returns {string}
   */
  get host() {
    return this.#host;
  }

  /**
   * @returns {string}
   */
  get user() {
    return this.#user;
  }

  /**
   * @returns {string}
   */
  get password() {
    return this.#password;
  }

  /**
   * @returns {string}
   */
  get database() {
    return this.#database;
  }
}

class Logger {
  #application = 'NONE';
  #pool;

  /**
   *
   * @param {DatabaseCredentials} credentials
   * @param {string} application
   */
  constructor(credentials, application) {
    const pool = mariadb.createPool(credentials);
    this.#pool = pool.getConnection();
    this.#application = application;
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  log(code, message) {
    return this.#pool
      .then((conn) => {
        return conn.query(
          'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
          [this.#application, TYPES.LOG, code, message]
        );
      })
      .then((res) => {
        return res;
      })
      .catch((err) => this.error('LOG-EXECUTION', err));
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  warn() {
    return this.#pool
      .then((conn) => {
        return conn.query(
          'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
          [this.#application, TYPES.WARN, code, message]
        );
      })
      .then((res) => {
        return res;
      })
      .catch((err) => this.error('LOG-EXECUTION', err));
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @returns {Promise<object>}
   */
  error(code, message) {
    return this.#pool
      .then((conn) => {
        return conn.query(
          'INSERT INTO `logs`(`application`, `type`, `code`, `message`) VALUES (?, ?, ?, ?)',
          [this.#application, TYPES.ERROR, code, message]
        );
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.error(err));
  }
}

module.exports = { TYPES, DatabaseCredentials, Logger };
