const { defineConfig } = require('eslint/config');
const prettier = require('eslint-plugin-prettier');
const babelParser = require('@babel/eslint-parser');

module.exports = defineConfig([
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      parser: babelParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        requireConfigFile: false,
      },
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
