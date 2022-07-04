# @dulliag/logger.js

[![Node.js Package](https://github.com/DulliAG/logger.js/actions/workflows/publish_package.yml/badge.svg)](https://github.com/DulliAG/logger.js/actions/workflows/publish_package.yml)

## Topics

- [Installation](#installation)
- [This package contains](#this-package-contains)

## Installation

1. Create an `.npmrc` to download the package

```
@dulliag:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

2. Install the package
   ```shell
   npm install @dulliag/logger.js
   ```
   Now you can use logger.js...

## This package contains...

- [Credentials](#credentials)
- [Client](#client)

### Credentials

```ts
import { Credentials } from '@dulliag/logger.js';

const credentials: Credentials = {
  host: 'HOST',
  user: 'USER',
  password: 'PASSWORD',
  database: 'DATABASE',
};
```

### Client

```ts
import { Credentials, ClientOptions, Client } from '@dulliag/logger.js';

const credentials: Credentials = {
  host: 'HOST',
  user: 'USER',
  password: 'PASSWORD',
  database: 'DATABASE',
};

const options = {
  application: "APPLICATION
} as ClientOptions;

const client = new Client("PostgreSQL" /* type of Database */, credentials, options);
client.log("LOG", "TAG", "MESSAGE");
```
