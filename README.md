
# Nodejs API Server

Empress / Nodejs / SQLite|PostgreSql / Swagger/ JWT authentication

<br />

## Requisitos

- [Node.js](https://nodejs.org/) >= 12.x
- [SQLite](https://www.sqlite.org/index.html)

<br />

## Como usar o código

**#1** - Clone o projeto

```bash
$ git clone https://github.com/claubraine/api-server-nodejs-sqlite-postgresql-swagger.git
$ cd api-server-nodejs-sqlite-postgresql-swagger
```

**#2** - Instale dependências via NPM or Yarn

```bash
$ npm i
$ composer require "darkaonline/l5-swagger"
// OR
$ yarn
```

**#3** - Executar SQLite|PostgreSql migration via TypeORM

Para usar PostgreSql<br />
editar .env<br />
    DB="postgresql"<br />
editar ormconfig.jon<br />
    linha 3 -> "skip": false,<br />
    linha 4 -> "name": "sqlite"<br />
    linha 17 -> "skip": true<br />
    linha 18 -> "name": "default",<br />
editar src/index.ts<br />
    //import server from "./server/database_sqlite";<br />
    import server from "./server/database_postgresql";<br />   

editar src/controllers.ts<br />   

//import { connection } from '../server/database_sqlite_conf';<br />
import { connection } from '../server/database_postgresql_conf';<br />

//import ActiveSession from '../models/sqlite/activeSession';<br />
import ActiveSession from '../models/postgresql/activeSession';<br />

//import User from '../models/sqlite/user';<br />
import User from '../models/postgresql/user';<br />

```
$ yarn typeorm migration:run
```

**#4** - Start a API (development mode)

```bash
$ npm run producao

```

**#5** - Gerando Build (arquivos gerados no diretprio `build`)

```bash
$ npm build
// OR
$ yarn build
```

O servidor API começará a usar a `PORT` especificada no aqruivo `.env` (default 5000).

<br />

## SQLite Path

The SQLite Path is set in `.env`, as `SQLITE_PATH`

## Database migration

> Generate migration:

```bash
$ yarn typeorm migration:generate -n your_migration_name
```

> run migration: 

```bash
$ yarn typeorm migration:run
```

<br />

## API

Swagger
API DOCUMENTAÇÃO: http://localhost:PORT/api/doc


> **Register** - `api/users/register`

```
POST api/users/register
Content-Type: application/json

{
    "username":"test",
    "password":"pass", 
    "email":"test@appseed.us"
}
```

<br />

> **Login** - `api/users/login`

```
POST /api/users/login
Content-Type: application/json

{
    "password":"pass", 
    "email":"test@appseed.us"
}
```

<br />

> **Logout** - `api/users/logout`

```
POST api/users/logout
Content-Type: application/json
authorization: JWT_TOKEN (returned by Login request)

{
    "token":"JWT_TOKEN"
}
```

<br />


# criar migração a partir de mudanças nos modelos
yarn migration:generate

# criar nova migração manual
yarn migration:create

# rodar migrações na base
yarn migration:run

# mostrar estado do banco
yarn migration:show

# voltar para a migração anterior
yarn migration:rollback

# resetar o schema (cuidado este comando limpa a base e cria novamente)
yarn migration:drop-create

# rodar os seeds
yarn seed:run

# criar novo arquivo de seeds
yarn seed:create
