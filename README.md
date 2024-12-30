# Challenges API

This project is the implementation of a [Rocketseat backend challenge](https://github.com/Rocketseat/backend-challenge) a service that manages the challenges answers sent by the Rocketseat students.

## Technologies used

- [NestJS](https://nestjs.com/): The framework used to develop the API.
- [Apache Kafka](https://kafka.apache.org/): The event streaming platform used here to provide the communication between this API and the Corrections service.
- [GraphQL](https://graphql.org/): A query language that can be used as alternative to REST pattern.
- [PrismaJS](https://www.prisma.io/): The ORM used to communicate with the PostgreSQL database. This ORM was used because it provides a type-safe query interaction with DB in an efficient and developer-friendly way.
- [Class Validator](https://www.npmjs.com/package/class-validator): To validate the requests data received by the API. It was used because has a good integration both with NestJS and GraphQL, so that the implementation becomes cleaner and maintainable.
- [Husky](https://github.com/typicode/husky): A tool that allows creating git hooks. It is used together with [commitlint](https://github.com/conventional-changelog/commitlint) to ensure the conventional commit pattern on every new commit made.

# Getting started 

This project uses `yarn` as its package manager, so the commands provided below are based on `yarn`. If you prefer to use a different package manager, please replace the commands with their equivalent for your chosen tool.

## Installation

### Challenges API dependencies

To install the dependencies of this API, just type:

```bash
$ yarn
```

### Corrections service dependencies

In another terminal access the `packages/corrections` folder.

```bash
$ cd packages/corrections
```

Then install the dependencies:

```bash
$ yarn
```

## Configuring the PostgreSQL and Kafka

Before executing any of the services, you must configure and run the PostgreSQL, Zookeeper and Kafka. For that there is a [Docker](https://docs.docker.com/desktop/setup/install/windows-install/) image, so to run all of them you can use docker compose. In the project root, run:

```bash
docker compose up -d
```

Make sure that all three services are up and running before jumping to the next section.

## Running the API

### Running Corrections Service

Before running the Challenges API you must run the Corrections Service. Inside the corrections service folder execute any of these commands based on the environment:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Running Challenges API

Here are the three ways you can run the API based on the environment.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

To run the automatic tests of the Challenges API run:

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```