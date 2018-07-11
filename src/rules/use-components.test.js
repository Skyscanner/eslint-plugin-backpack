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

const useComponents = require('./use-components');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, ecmaFeatures: { jsx: true } },
});

[
  ['ActivityIndicator', 'BpkSpinner'],
  ['Alert', 'BpkAlert'],
  ['Button', 'BpkButton'],
  ['Image', 'BpkImage'],
  ['Text', 'BpkText'],
  ['TouchableHighlight', 'BpkTouchableOverlay'],
  ['TouchableNativeFeedback', 'BpkTouchableNativeFeedback'],
].forEach(([Component, Substitute]) => {
  ruleTester.run(`use-components - ${Component}`, useComponents, {
    valid: [
      `<${Substitute}>I'm allowed here</${Substitute}>`,
      `<div>I'm allowed here</div>`,
      `React.createElement(SomeElement, null)`,
      `React.createElement("div", null)`,
    ],
    invalid: [
      {
        code: `React.createElement(${Component}, null, "I'm allowed here")`,
        output: `React.createElement(${Substitute}, null, "I'm allowed here")`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `create(${Component}, null, "I'm allowed here")`,
        output: `create(${Substitute}, null, "I'm allowed here")`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `<${Component}>I'm allowed here</${Component}>`,
        output: `<${Substitute}>I'm allowed here</${Substitute}>`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `<${Component} children="I'm allowed here" />`,
        output: `<${Substitute} children="I'm allowed here" />`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
    ],
  });
});
