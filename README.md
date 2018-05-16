# eslint-plugin-backpack

backpack all the thingz

## Installation

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
    "plugins": [
        "backpack"
    ]
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

* Fill in provided rules here





