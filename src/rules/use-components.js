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

const BPK_SUBSTITUTES = {
  ActivityIndicator: 'BpkSpinner',
  Alert: 'BpkAlert',
  Button: 'BpkButton',
  Image: 'BpkImage',
  Text: 'BpkText',
  TouchableHighlight: 'BpkTouchableOverlay',
  TouchableNativeFeedback: 'BpkTouchableNativeFeedback',
};

const ruleMessage = bkpComponent =>
  `Use the following Backpack component instead: ${bkpComponent}`;

module.exports = ({ report }) => ({
  meta: {
    fixable: 'code',
  },

  CallExpression: ({ arguments: args }) => {
    if (args.length >= 1 && args[0].type === 'Identifier') {
      const bpkSubstitute = BPK_SUBSTITUTES[args[0].name];
      if (!bpkSubstitute) {
        return;
      }

      report({
        node: args[0],
        message: ruleMessage(bpkSubstitute),
        fix: fixer =>
          fixer.replaceTextRange([args[0].start, args[0].end], bpkSubstitute),
      });
    }
  },

  JSXElement: ({ openingElement, closingElement }) => {
    const bpkSubstitute = BPK_SUBSTITUTES[openingElement.name.name];
    if (!bpkSubstitute) {
      return;
    }

    report({
      node: openingElement,
      message: ruleMessage(bpkSubstitute),
      fix(fixer) {
        const fixIt = node => fixer.replaceText(node.name, bpkSubstitute);
        if (openingElement.selfClosing) {
          return fixIt(openingElement);
        }

        return [fixIt(openingElement), fixIt(closingElement)];
      },
    });
  },
});
