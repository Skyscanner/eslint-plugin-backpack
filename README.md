# eslint-plugin-backpack

[![Build Status](https://travis-ci.org/Skyscanner/eslint-plugin-backpack.svg?branch=master)](https://travis-ci.org/Skyscanner/eslint-plugin-backpack/) [![Greenkeeper badge](https://badges.greenkeeper.io/Skyscanner/eslint-plugin-backpack.svg)](https://greenkeeper.io/)

Eslint plugin to prevent magic arbitrary values and promote the use of Backpack tokens

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-backpack`:

```
$ npm install eslint-plugin-backpack --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-backpack` globally.

## Usage

Add `backpack` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["backpack"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "backpack/rule-name": 2
  }
}
```

## Supported Rules

### use-tokens

Available for colours and length values. Will prevent the use of a hardcoded colour if a Backpack token is available for the given value.

#### Configuration

| Name          | Type                                   | Required    |
| ------------- | -------------------------------------- | ----------- |
| autoImport    | boolean                                | false       |
| platform      | string                                 | false       |
| tokensPackage | shape({ web: string, native: string }) | false       |
| typeof        | boolean                                | false       |

```json
{
  "rules": {
    "backpack/use-tokens": [2, {
      "autoImport": true,
      "platform": "web",
      "tokensPackage": {
        "web": "bpk-tokens/tokens/base.es6",
        "native": "bpk-tokens/tokens/base.react.native",
      },
    }]
  }
}
```

### use-components

Available for native components initially. Will prevent the usage of native components when a backpack option is available.

#### Configuration

| Name          | Type                                   | Required    |
| ------------- | -------------------------------------- | ----------- |
| autoImport    | boolean                                | false       |

```json
{
  "rules": {
    "backpack/use-components": [2, {
      "autoImport": true,
    }]
  }
}
```