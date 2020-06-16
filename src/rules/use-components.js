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

const { addImport, getImportDefinition } = require('../auto-import');

const BPK_PATH = 'backpack-react-native/';

const BPK_SUBSTITUTES = {
  ActivityIndicator: 'BpkSpinner',
  Alert: 'BpkAlert',
  Button: 'BpkButton',
  FlatList: 'BpkFlatList',
  Image: 'BpkImage',
  Picker: 'BpkPicker',
  SectionList: 'BpkSectionList',
  Switch: 'BpkSwitch',
  Text: 'BpkText',
  TextInput: 'BpkTextInput',
  TouchableHighlight: 'BpkTouchableOverlay',
  TouchableNativeFeedback: 'BpkTouchableNativeFeedback',
};

const PACKAGES = {
  BpkSpinner: 'bpk-component-spinner',
  BpkAlert: 'bpk-component-alert',
  BpkButton: 'bpk-component-button',
  BpkFlatList: 'bpk-component-flat-list',
  BpkImage: 'bpk-component-image',
  BpkPicker: 'bpk-component-picker',
  BpkSectionList: 'bpk-component-section-list',
  BpkSwitch: 'bpk-component-switch',
  BpkText: 'bpk-component-text',
  BpkTextInput: 'bpk-component-text-input',
  BpkTouchableOverlay: 'bpk-component-touchable-overlay',
  BpkTouchableNativeFeedback: 'bpk-component-touchable-native-feedback',
};

const BASE_CONFIG = {
  autoImport: true,
};

const ruleMessage = bkpComponent =>
  `Use the following Backpack component instead: ${bkpComponent}`;

const fixAndMaybeImport = (fixer, options, node, identifier, fixes) => {
  const config = merge({}, BASE_CONFIG, options);
  const packageName = BPK_PATH + PACKAGES[identifier];

  if (!config.autoImport) {
    return fixes;
  }

  const importDef = getImportDefinition(node, identifier, {
    packageName,
    style: 'default',
  });

  if (importDef.isImported) {
    return fixes;
  }

  return [addImport(fixer, importDef)].concat(fixes);
};

module.exports = ({ report, options }) => ({
  meta: {
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          autoImport: {
            type: 'boolean',
          },
        },
      },
    ],
  },

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
            fixer.replaceTextRange([args[0].start, args[0].end], bpkSubstitute),
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
