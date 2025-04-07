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

const ruleTester = new RuleTester({
  languageOptions: { sourceType: 'module', ecmaVersion: 2015 },
});

ruleTester.run('use-tokens', useTokens, {
  valid: [
    `const styles = StyleSheet.create({
          foo: {
            color: canvasDay,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            color: colorSkyBlue,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            backgroundColor: canvasDay,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            backgroundColor: 'transparent',
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            backgroundColor: null,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            backgroundColor: undefined,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            borderBottomStartRadius: 0,
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
            borderRadius: borderRadiusSm,
          },
        });`,
    `const styles = StyleSheet.create({
          foo: {
            padding: 5,
          },
        });`,
  ],
  invalid: [
    {
      code: `
    const styles = StyleSheet.create({
      foo: {
        color: 'rgb(161, 238, 255)',
      },
    });`,
      errors: [
        {
          message:
            'Use the following Backpack token instead: marcommsBlueBright',
        },
      ],
    },
    {
      code: `
    const styles = StyleSheet.create({
      foo: {
        color: '#ffffff',
      },
    });`,
      errors: [
        {
          message:
            'Multiple colors matched for colour, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token',
        },
      ],
    },
    {
      code: `
    const styles = StyleSheet.create({
      foo: {
        backgroundColor: '#ff00ff',
        color: '#ff00ff',
      },
    });`,
      errors: [
        {
          message:
            'Unknown color detected not in our brand, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token',
        },
        {
          message:
            'Unknown color detected not in our brand, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token',
        },
      ],
    },
    {
      code: `
    const styles = StyleSheet.create({
      foo: {
        backgroundColor: '#ffffff',
      },
    });`,
      errors: [
        {
          message:
            'Multiple colors matched for colour, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token',
        },
      ],
    },
    {
      code: `
    const styles = StyleSheet.create({
      foo: {
        color: 'rgb(7, 112, 227)',
      },
    });`,
      errors: [
        {
          message:
            'Unknown color detected not in our brand, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token',
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
