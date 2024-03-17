## Description

Here is a NestJs application running on PORT 3000 by default. You can specify PORT you need in .env file which is pushed to the repo for simplicity (usually it is not pushed to the repo because of the sensitive info it might contain).
App can be run locally or in Docker. There are also some basic e2e tests (orders.e2e-spec.ts).

All commands are listed bellow.

## System requirement

You need to have Node installed on your system https://nodejs.org/en/download

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
$ npm run start

```

## Running the app using docker compose

```bash
$ docker-compose up

```

## Running Tests

```bash
# e2e tests
$ npm run test:e2e
```
