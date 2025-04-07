const prettier = require('eslint-plugin-prettier');
const babelParser = require('@babel/eslint-parser');

module.exports = {
  plugins: {
    prettier: prettier,
  },
  languageOptions: {
    parser: babelParser,
    sourceType: 'script',
    ecmaVersion: 5,
    parserOptions: {
      requireConfigFile: false,
    },
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
