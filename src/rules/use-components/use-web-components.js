/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018-present Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const merge = require('lodash/merge');

const { addImport, getImportDefinition } = require('../../auto-import');

const BPK_SUBSTITUTES = {
  blockquote: 'BpkBlockQuote',
  code: 'BpkCode',
  dd: 'BpkDescriptionDetails',
  dl: 'BpkDescriptionList',
  dt: 'BpkDescriptionTerm',
  fieldset: 'BpkFieldset',
  img: 'BpkImage',
  pre: 'BpkCodeBlock',
  progress: 'BpkProgress',
  select: 'BpkSelect',
  table: 'BpkTable',
  tbody: 'BpkTableBody',
  td: 'BpkTableCell',
  textarea: 'BpkTextarea',
  th: 'BpkTableHeadCell',
  thead: 'BpkTableHead',
  tr: 'BpkTableRow',
};

const PACKAGES = {
  BpkBlockQuote: 'bpk-component-blockquote',
  BpkCode: 'bpk-component-code',
  BpkCodeBlock: 'bpk-component-code',
  BpkDescriptionDetails: 'bpk-component-description-list',
  BpkDescriptionList: 'bpk-component-description-list',
  BpkDescriptionTerm: 'bpk-component-description-list',
  BpkFieldset: 'bpk-component-fieldset',
  BpkImage: 'bpk-component-image',
  BpkProgress: 'bpk-component-progress',
  BpkSelect: 'bpk-component-select',
  BpkTable: 'bpk-component-table',
  BpkTableBody: 'bpk-component-table',
  BpkTableCell: 'bpk-component-table',
  BpkTableHead: 'bpk-component-table',
  BpkTableHeadCell: 'bpk-component-table',
  BpkTableRow: 'bpk-component-table',
  BpkTextarea: 'bpk-component-textarea',
};

/*
How the component should be imported:
default: `import BpkShavocado from 'bpk-component-shavocado'`
nested: `import { BpkShavocado } from 'bpk-component-shavocado'`
*/
const IMPORT_STYLES = {
  BpkBlockQuote: 'default',
  BpkCode: 'nested',
  BpkCodeBlock: 'nested',
  BpkDescriptionDetails: 'nested',
  BpkDescriptionList: 'nested',
  BpkDescriptionTerm: 'nested',
  BpkFieldset: 'default',
  BpkImage: 'default',
  BpkProgress: 'default',
  BpkSelect: 'default',
  BpkTable: 'nested',
  BpkTableBody: 'nested',
  BpkTableCell: 'nested',
  BpkTableHead: 'nested',
  BpkTableHeadCell: 'nested',
  BpkTableRow: 'nested',
  BpkTextarea: 'default',
};

const BASE_CONFIG = {
  autoImport: true,
};

const ruleMessage = bpkComponent =>
  `Use the following Backpack component instead: ${bpkComponent}`;

const fixAndMaybeImport = (fixer, options, node, identifier, fixes) => {
  const config = merge({}, BASE_CONFIG, options);
  const packageName = PACKAGES[identifier];
  const autoImportStyle = IMPORT_STYLES[identifier];

  if (!config.autoImport) {
    return fixes;
  }

  const importDef = getImportDefinition(node, identifier, {
    packageName,
    style: autoImportStyle,
  });

  if (importDef.isImported) {
    return fixes;
  }

  return [addImport(fixer, importDef)].concat(fixes);
};

module.exports = (report, options) => ({
  CallExpression: node => {
    const { arguments: args } = node;

    if (args.length >= 1 && args[0].type === 'Identifier') {
      const bpkSubstitute = BPK_SUBSTITUTES[args[0].name];
      if (!bpkSubstitute) {
        return;
      }

      report({
        node: args[0],
        message: ruleMessage(bpkSubstitute),
        fix: fixer =>
          fixAndMaybeImport(
            fixer,
            options[0],
            node,
            bpkSubstitute,
            fixer.replaceTextRange(
              [args[0].range[0], args[0].range[1]],
              bpkSubstitute,
            ),
          ),
      });
    }
  },

  JSXElement: node => {
    const { openingElement, closingElement } = node;
    const bpkSubstitute = BPK_SUBSTITUTES[openingElement.name.name];
    if (!bpkSubstitute) {
      return;
    }

    report({
      node: openingElement,
      message: ruleMessage(bpkSubstitute),
      fix(fixer) {
        const fixIt = toFix => fixer.replaceText(toFix.name, bpkSubstitute);
        const fixes = openingElement.selfClosing
          ? fixIt(openingElement)
          : [fixIt(openingElement), fixIt(closingElement)];

        return fixAndMaybeImport(fixer, options[0], node, bpkSubstitute, fixes);
      },
    });
  },
});
