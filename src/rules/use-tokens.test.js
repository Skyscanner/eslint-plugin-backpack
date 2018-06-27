/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018-present Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: spacingSm,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        borderBottomStartRadius: spacingSm,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        borderBottomStartRadius: 0,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: spacingSm * 4,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: spacingSm * 5 * 3,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: (spacingSm * 5) * spacingBase,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: bar * 5,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: myMargin() * 5,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        marginLeft: spacingSm + spacingSm,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        paddingHorizontal: spacingMd - borderSizeSm,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        minHeight: spacingBase * 3,
      },
    });`,
    `const styles = StyleSheet.create({
      foo: {
        borderRadius: borderRadiusSm,
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
      output: `const styles = StyleSheet.create({
        foo: {
          color: colorWhite,
        },
      });`,
      errors: [
        {
          message: 'Use the following Backpack token instead: colorWhite',
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          backgroundColor: '#ffffff',
        },
      });`,
      output: `const styles = StyleSheet.create({
        foo: {
          backgroundColor: colorWhite,
        },
      });`,
      errors: [
        {
          message: 'Use the following Backpack token instead: colorWhite',
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          color: 'rgb(0, 178, 214)',
        },
      });`,
      output: `const styles = StyleSheet.create({
        foo: {
          color: colorBlue500,
        },
      });`,
      errors: [
        {
          message: 'Use the following Backpack token instead: colorBlue500',
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          marginLeft: 4,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `marginLeft` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          borderBottomStartRadius: 4,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `borderBottomStartRadius` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          marginLeft: spacingSm * 4 + 4,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `marginLeft` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          marginLeft: spacingSm * 4 + spacingBase + 2,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `marginLeft` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          marginLeft: 5 * 4,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `marginLeft` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          borderRadius: borderRadiusSm + 2,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `borderRadius` instead use a Backpack token or multiples of a token",
        },
      ],
    },

    {
      code: `const styles = StyleSheet.create({
        foo: {
          borderWidth: borderSizeSm + 2,
        },
      });`,
      errors: [
        {
          message:
            "Don't use raw numbers for `borderWidth` instead use a Backpack token or multiples of a token",
        },
      ],
    },
  ],
});
