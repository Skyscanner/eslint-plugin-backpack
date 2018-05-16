const { RuleTester } = require('eslint');

const useTokens = require('./use-tokens');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

ruleTester.run('use-tokens', useTokens, {
  valid: [
    `const styles = StyleSheet.create({
      foo: {
        color: colorWhite,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        color: colorBlue500,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        backgroundColor: colorWhite,
      },
    });`,
  ],
  invalid: [
    {
      code: `const styles = StyleSheet.create({
        foo: {
          color: '#ffffff',
        },
      });`,
      errors: [{
        message: 'Use the following Backpack token instead: colorWhite',
      }],
    },
    {
      code: `const styles = StyleSheet.create({
        foo: {
          backgroundColor: '#ffffff',
        },
      });`,
      errors: [{
        message: 'Use the following Backpack token instead: colorWhite',
      }],
    },
    {
      code: `const styles = StyleSheet.create({
        foo: {
          color: 'rgb(0, 178, 214)',
        },
      });`,
      errors: [{
        message: 'Use the following Backpack token instead: colorBlue500',
      }],
    },
  ],
});
