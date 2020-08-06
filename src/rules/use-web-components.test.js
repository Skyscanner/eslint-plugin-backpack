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

const useComponents = require('./use-web-components');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
});

const createImportStatement = (Substitute, useDefaultImport, pkgPath) =>
  `import ${
    useDefaultImport ? Substitute : `{ ${Substitute} }`
  } from '${pkgPath}';`;

[
  ['blockquote', 'BpkBlockQuote', 'bpk-component-blockquote', true],
  ['code', 'BpkCode', 'bpk-component-code', false],
  ['dd', 'BpkDescriptionDetails', 'bpk-component-description-list', false],
  ['dl', 'BpkDescriptionList', 'bpk-component-description-list', false],
  ['dt', 'BpkDescriptionTerm', 'bpk-component-description-list', false],
  ['fieldset', 'BpkFieldset', 'bpk-component-fieldset', true],
  ['img', 'BpkImage', 'bpk-component-image', true],
  ['pre', 'BpkCodeBlock', 'bpk-component-code', false],
  ['progress', 'BpkProgress', 'bpk-component-progress', true],
  ['select', 'BpkSelect', 'bpk-component-select', true],
  ['table', 'BpkTable', 'bpk-component-table', false],
  ['tbody', 'BpkTableBody', 'bpk-component-table', false],
  ['td', 'BpkTableCell', 'bpk-component-table', false],
  ['textarea', 'BpkTextarea', 'bpk-component-textarea', true],
  ['th', 'BpkTableHeadCell', 'bpk-component-table', false],
  ['thead', 'BpkTableHead', 'bpk-component-table', false],
  ['tr', 'BpkTableRow', 'bpk-component-table', false],
].forEach(([Component, Substitute, pkg, useDefaultImport]) => {
  const pkgPath = pkg;

  ruleTester.run(`use-components-web - ${Component}`, useComponents, {
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
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
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
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
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
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
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
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
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
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
<${Component} children="I'm not allowed" />`,
        output: `
${createImportStatement(Substitute, useDefaultImport, pkgPath)}
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
