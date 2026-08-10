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
const importedComponents = [];

module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@skyscanner/backpack-web') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              importedComponents.push(specifier.local.name);
            }
          }
        }
      },
      AssignmentExpression(node) {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.property.name === 'className' &&
          importedComponents.includes(node.left.object.name)
        ) {
          context.report({
            node,
            message: 'Avoid assigning to className of backpack-web components',
          });
        }
      },
    };
  },
};
