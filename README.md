[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Chat](https://img.shields.io/badge/chat-developer-brightgreen.svg?style=flat)](https://rovercode.zulipchat.com)
[![Build Status](https://travis-ci.com/rovercode/rovercode-ui.svg?branch=alpha)](https://travis-ci.com/rovercode/rovercode-ui)
[![Coverage Status](https://coveralls.io/repos/github/rovercode/rovercode-ui/badge.svg?branch=alpha)](https://coveralls.io/github/rovercode/rovercode-ui?branch=alpha)

Rovercode User Interface
========================

This repository contains the [react](https://reactjs.org/) application frontend for the Rovercode web application.

Requirements
============

[nodejs](https://nodejs.org) LTS version v10.x or v12.x is required

[yarn](https://yarnpkg.com/) is required for installing dependencies. Instructions for installing `yarn` can be found [here](https://yarnpkg.com/lang/en/docs/install/).

Dependencies
============

To install the production dependencies (for just running the application), run:
```sh
yarn install --pure-lockfile --production
```

To install development dependencies (for running tests, lint, etc), run:
```sh
yarn install --pure-lockfile
```

Running
=======

**NOTE**: The application running the development webserver requires the [rovercode api](https://github.com/rovercode/rovercode-web) to be running at http://localhost:8000

To run the development web server using a locally running API instance, run:
```sh
yarn start:local
```

To run the development web server using the API instance on alpha.rovercode.com, run:
```sh
yarn start:alpha
```

Unit Testing
============

To run unit tests, run:
```sh
yarn test
```

To debug the tests in [VS Code](https://code.visualstudio.com), use these run configurations in your [launch.json](https://code.visualstudio.com/docs/editor/debugging):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest All",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "${fileBasenameNoExtension}"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      }
    }
  ]
}
```

Linting
=======

To run the linter, run:
```sh
yarn lint
```
