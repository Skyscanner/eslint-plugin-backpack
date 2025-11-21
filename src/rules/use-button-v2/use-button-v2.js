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

const TARGET_PACKAGE = '@skyscanner/backpack-web/bpk-component-button';
const DEPRECATED_COMPONENT = 'BpkButton';
const RECOMMENDED_COMPONENT = 'BpkButtonV2';

module.exports = {
  meta: {
    schema: [],
    messages: {
      useButtonV2: `Use ${RECOMMENDED_COMPONENT} instead of ${DEPRECATED_COMPONENT}. ${DEPRECATED_COMPONENT} is deprecated and will be removed soon.`,
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // Check if the import is from the target package
        if (node.source.value !== TARGET_PACKAGE) {
          return;
        }

        // Check all specifiers in the import
        node.specifiers.forEach((specifier) => {
          const isDefaultImport = specifier.type === 'ImportDefaultSpecifier';
          const importedName = isDefaultImport
            ? specifier.local.name
            : specifier.imported?.name || specifier.local.name;

          // Check if BpkButton is being imported (either as default or named)
          if (importedName === DEPRECATED_COMPONENT) {
            context.report({
              node: specifier,
              messageId: 'useButtonV2',
            });
          }
        });
      },
    };
  },
};
