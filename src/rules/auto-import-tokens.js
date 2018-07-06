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
const merge = require('lodash/merge');
const snakeCase = require('lodash/snakeCase');
const { props: TOKENS } = require('bpk-tokens/tokens/base.raw.json');

const BASE_CONFIG = {
  typeof: false,
  platform: 'web',
  tokensPackage: {
    web: 'bpk-tokens/tokens/base.es6',
    native: 'bpk-tokens/tokens/base.react.native',
  },
};

const hasTypeOfOperator = ({ parent }) =>
  parent && parent.type === 'UnaryExpression' && parent.operator === 'typeof';

const isToken = value => !!TOKENS[snakeCase(value).toUpperCase()];

const addToExistingImport = (fixer, identifier, importNode) => {
  const location = importNode.loc;
  const isMultiline = location.end.line - location.start.line > 0;
  return fixer.insertTextBefore(
    // put first to avoid any problems with trailing commas
    importNode.specifiers[0],
    `${identifier.name},${isMultiline ? '\n' : ' '}`,
  );
};

const addNewImport = (fixer, identifier, scope, tokensPkg, startRange) => {
  const importStatement = `import { ${identifier.name} } from '${tokensPkg}';`;
  const hasImports = scope.block.body[0].type === 'ImportDeclaration';

  // Insert a new import in the 'best' position.
  // This is after all imports or before the first relative import
  for (let i = 0; ; i += 1) {
    const currNode = scope.block.body[i];
    if (currNode.type !== 'ImportDeclaration') {
      return fixer.insertTextAfterRange(
        i === 0 ? startRange : scope.block.body[i - 1].range,
        `\n${importStatement}${hasImports ? '' : '\n'}`,
      );
    }

    if (currNode.source.value.indexOf('.') === 0) {
      return fixer.insertTextAfterRange(
        i === 0 ? startRange : scope.block.body[i - 1].range,
        `\n${importStatement}`,
      );
    }
  }
};

module.exports = ({ getScope, report, options: userOptions }) => {
  const options = merge(BASE_CONFIG, userOptions[0] || {});
  const tokensPkg = options.tokensPackage[options.platform];

  return {
    meta: {
      fixable: 'code',
      schema: [
        {
          type: 'object',
          properties: {
            typeof: {
              type: 'boolean',
            },
            platform: {
              type: 'string',
            },
            tokensPackage: {
              type: 'object',
              properties: {
                web: {
                  type: 'string',
                },
                native: {
                  type: 'string',
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      ],
    },

    'Program:exit': node => {
      const globalScope = getScope();
      const fixed = {};

      const startRange =
        node.comments && node.comments.length
          ? node.comments[node.comments.length - 1].range
          : [0, 0];

      globalScope.through.forEach(({ identifier }) => {
        const isTypeOf = !options.typeof && hasTypeOfOperator(identifier);
        if (!isToken(identifier.name) || isTypeOf) {
          return;
        }

        report({
          node: identifier,
          message: "'{{name}}' token is not defined.",
          data: identifier,
          fix: fixer => {
            if (fixed[identifier.name]) {
              return undefined;
            }

            fixed[identifier.name] = true;

            for (let i = 0; ; i += 1) {
              const currNode = globalScope.block.body[i];

              if (currNode.type !== 'ImportDeclaration') {
                break;
              }

              if (currNode.source.value === tokensPkg) {
                return addToExistingImport(fixer, identifier, currNode);
              }
            }

            return addNewImport(
              fixer,
              identifier,
              globalScope,
              tokensPkg,
              startRange,
            );
          },
        });
      });
    },
  };
};
