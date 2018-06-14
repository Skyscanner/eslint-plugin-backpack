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

const {RuleTester} = require('eslint');

const useTokens = require('./use-tokens');

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: 2015}});

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
      errors: [
        {
          message: 'Use the following Backpack token instead: colorBlue500',
        },
      ],
    },
  ],
});
