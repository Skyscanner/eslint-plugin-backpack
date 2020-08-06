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

const useComponents = require('./use-native-components');

const BPK_PATH = 'backpack-react-native/';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
});

[
  ['ActivityIndicator', 'BpkSpinner', 'bpk-component-spinner'],
  ['Alert', 'BpkAlert', 'bpk-component-alert'],
  ['Button', 'BpkButton', 'bpk-component-button'],
  ['FlatList', 'BpkFlatList', 'bpk-component-flat-list'],
  ['Image', 'BpkImage', 'bpk-component-image'],
  ['Picker', 'BpkPicker', 'bpk-component-picker'],
  ['SectionList', 'BpkSectionList', 'bpk-component-section-list'],
  ['Switch', 'BpkSwitch', 'bpk-component-switch'],
  ['Text', 'BpkText', 'bpk-component-text'],
  ['TextInput', 'BpkTextInput', 'bpk-component-text-input'],
  [
    'TouchableHighlight',
    'BpkTouchableOverlay',
    'bpk-component-touchable-overlay',
  ],
  [
    'TouchableNativeFeedback',
    'BpkTouchableNativeFeedback',
    'bpk-component-touchable-native-feedback',
  ],
].forEach(([Component, Substitute, pkg]) => {
  const pkgPath = BPK_PATH + pkg;

  ruleTester.run(`use-components - ${Component}`, useComponents, {
    valid: [
      `<${Substitute}>I'm allowed</${Substitute}>`,
      `<div>I'm allowed</div>`,
      `React.createElement(SomeElement, null)`,
      `React.createElement("div", null)`,
    ],
    invalid: [
      {
        code: `React.createElement(${Component}, null, "I'm not allowed")`,
        output: `
import ${Substitute} from '${pkgPath}';
React.createElement(${Substitute}, null, "I'm not allowed")`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `create(${Component}, null, "I'm not allowed")`,
        output: `
import ${Substitute} from '${pkgPath}';
create(${Substitute}, null, "I'm not allowed")`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `<${Component}>I'm not allowed</${Component}>`,
        output: `
import ${Substitute} from '${pkgPath}';
<${Substitute}>I'm not allowed</${Substitute}>`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `<${Component} children="I'm not allowed" />`,
        output: `
import ${Substitute} from '${pkgPath}';
<${Substitute} children="I'm not allowed" />`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        options: [{ autoImport: false }],
        code: `<${Component} children="I'm not allowed" />`,
        output: `<${Substitute} children="I'm not allowed" />`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
      {
        code: `
import ${Substitute} from '${pkgPath}';
<${Component} children="I'm not allowed" />`,
        output: `
import ${Substitute} from '${pkgPath}';
<${Substitute} children="I'm not allowed" />`,
        errors: [
          {
            message: `Use the following Backpack component instead: ${Substitute}`,
          },
        ],
      },
    ],
  });
});
