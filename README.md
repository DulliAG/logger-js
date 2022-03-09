# @dulliag/logger.js

![npm](https://img.shields.io/npm/v/@dulliag/logger.js?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/@dulliag/logger.js?label=Downloads&style=for-the-badge)
![NPM](https://img.shields.io/npm/l/@dulliag/logger.js?style=for-the-badge)

> :warning: **Disclaimer** :warning:
> This documentation is not up to date for @dulliag/logger.js(v1.0.0+)
> An updated documentation will follow soon

## Topics

- [Installation](#installation)
- [This package contains](#this-package-contains)

## Installation

1. Install the package
   ```shell
   npm install @dulliag/logger.js
   ```
   Now you can use logger.js...

## This package contains...

- [TYPES](#types)
- [DatabaseCredentials](#databasecredentials)
- [Logger](#logger)

### TYPES

_Possible log-types_

```js
const { TYPES } = require('@dulliag/logger.js');
// Could be (LOG|WARN|ERROR)
```

### DatabaseCredentials

```js
const { DatabaseCredentials } = require('@dulliag/logger.js');

const credentials = new DatabaseCredentials(
  'HOST',
  'USER',
  'PASSWORD',
  'DATABASE'
);
```

### Logger

#### log

```js
const { DatabaseCredentials, Logger } = require('@dulliag/logger.js');

const credentials = new DatabaseCredentials(
  'HOST',
  'USER',
  'PASSWORD',
  'DATABASE'
);

const LOGGER = new Logger(credentials, 'DulliBot');
LOGGER.log('Bot started', 'DulliBot started successfully!')
  .then((result) => {
    console.log(result);
    // { affectedRows: 1, insertId: 2, warningStatus: 0 }
  })
  .catch((err) => console.error(err));
```

#### warn

```js
const { DatabaseCredentials, Logger } = require('@dulliag/logger.js');

const credentials = new DatabaseCredentials(
  'HOST',
  'USER',
  'PASSWORD',
  'DATABASE'
);

const LOGGER = new Logger(credentials, 'DulliBot');
LOGGER.warn('Outdated version', 'DulliBot runs on an outdated version!')
  .then((result) => {
    console.log(result);
    // { affectedRows: 1, insertId: 2, warningStatus: 0 }
  })
  .catch((err) => console.error(err));
```

#### error

```js
const { DatabaseCredentials, Logger } = require('@dulliag/logger.js');

const credentials = new DatabaseCredentials(
  'HOST',
  'USER',
  'PASSWORD',
  'DATABASE'
);

const LOGGER = new Logger(credentials, 'DulliBot');
LOGGER.error('Start failed', 'DulliBot didnt start successfully!')
  .then((result) => {
    console.log(result);
    // { affectedRows: 1, insertId: 2, warningStatus: 0 }
  })
  .catch((err) => console.error(err));
```
