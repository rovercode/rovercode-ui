[![Chat](https://img.shields.io/badge/chat-developer-brightgreen.svg?style=flat)](https://rovercode.zulipchat.com)
[![Zenhub Board](https://img.shields.io/badge/board-zenhub-purple.svg?style=flat)](https://app.zenhub.com/workspaces/rovercode-development-5c7e819df524621425116d03/boards)

Rovercode User Interface
========================

This repository contains the [react](https://reactjs.org/) application frontend for the Rovercode web application.

Requirements
============

[nodejs](https://nodejs.org) LTS version v8.x is required. Newer versions may have issues.

[yarn](https://yarnpkg.com/) is required for installing dependencies. Instructions for installing `yarn` can be found [here](https://yarnpkg.com/lang/en/docs/install/).

Dependencies
============

To install the production dependencies (for just running the application), run:
```sh
yarn install --production
```

To install development dependencies (for running tests, lint, etc), run:
```sh
yarn install
```

Running
=======

**NOTE**: The application running the development webserver requires the [rovercode api](https://github.com/rovercode/rovercode-web) to be running at http://localhost:8000

To run the development web server, run:
```sh
yarn start
```

Unit Testing
============

To run unit tests, run:
```sh
yarn test
```

Linting
=======

To run the linter, run:
```sh
yarn lint
```
