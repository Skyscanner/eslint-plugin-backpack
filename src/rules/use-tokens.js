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

const _ = require('lodash');
const tinycolor = require('tinycolor2');
const { props: WEB_TOKENS } = require('bpk-tokens/tokens/base.raw.json');
const { props: IOS_TOKENS } = require('bpk-tokens/tokens/base.raw.ios.json');
const {
  props: ANDROID_TOKENS,
} = require('bpk-tokens/tokens/base.raw.android.json');

const { addImport, getImportDefinition } = require('../auto-import');

const BASE_CONFIG = {
  autoImport: true,
  platform: 'web',
  tokensPackage: {
    web: 'bpk-tokens/tokens/base.es6',
    native: 'bpk-tokens/tokens/base.react.native',
  },
};

const COLOR_WHITELIST = ['transparent', null, undefined];
const COLOR_PROPS = ['color', 'backgroundColor'];

const RADII_PROPS = [
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderBottomWidth',
  'borderRadius',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
];

const BORDER_PROPS = [
  'borderEndWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderStartWidth',
  'borderTopWidth',
  'borderWidth',
];

const SPACING_PROPS = [
  'bottom',
  'end',
  'height',
  'left',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'right',
  'start',
  'top',
  'width',
];

const TOKENS = _.merge(
  _.mapKeys(WEB_TOKENS, (value, key) => `WEB_${key}`),
  _.mapKeys(IOS_TOKENS, (value, key) => `IOS_${key}`),
  _.mapKeys(ANDROID_TOKENS, (value, key) => `ANDROID_${key}`),
);

const tokensByCategory = category =>
  _.chain(TOKENS)
    .filter({ category })
    .map(({ name, value }) => ({
      name: _.camelCase(name),
      value,
    }))
    .value();

const COLORS = tokensByCategory('colors');
const SPACING_NAMES = new Set(tokensByCategory('spacings').map(x => x.name));
const RADII_NAMES = new Set(tokensByCategory('radii').map(x => x.name));
const BORDER_NAMES = new Set(tokensByCategory('borders').map(x => x.name));

const checkColor = (node, context) => {
  const { key, value } = node;
  const isColor = COLOR_PROPS.includes(key.name) && value.type === 'Literal';

  if (!isColor) {
    return;
  }

  const color = tinycolor(value.value);

  const expectedToken = _.find(COLORS, { value: color.toRgbString() });

  if (expectedToken) {
    context.report({
      node,
      message: `Use the following Backpack token instead: ${
        expectedToken.name
      }`,
      fix: fixer => {
        const { options: userOptions } = context;
        const options = _.merge({}, BASE_CONFIG, userOptions[0] || {});
        const tokensPkg = options.tokensPackage[options.platform];

        if (!options.autoImport) {
          return fixer.replaceText(value, expectedToken.name);
        }

        const importDefinition = getImportDefinition(node, expectedToken.name, {
          packageName: tokensPkg,
          style: 'named',
        });

        if (importDefinition.isImported) {
          return fixer.replaceText(value, expectedToken.name);
        }

        return [
          addImport(fixer, importDefinition),
          fixer.replaceText(value, expectedToken.name),
        ];
      },
    });
  } else {
    if (COLOR_WHITELIST.filter(c => value.value === c).length) return;
    context.report({
      node,
      message: `Unknown color, use a Backpack token instead`,
    });
  }
};

const isLiteralNumber = node =>
  node.type === 'Literal' && typeof node.value === 'number';

/*
 * Check if the node is an identifier and a known Backpack lengt
 * token.
 */
const isLengthIdentifier = node =>
  node.type === 'Identifier' &&
  (SPACING_NAMES.has(node.name) ||
    RADII_NAMES.has(node.name) ||
    BORDER_NAMES.has(node.name));

/*
 * Ensures that a complex expression i.e. not a literal is a
 * valid expression and use of Backpack tokens. For example `spacingSm * 4`
 * is valid because it's a multiple of a base token whereas `spacingSm * 4 + 4`
 * it not because the added 4 is a raw number.
 *
 * Returns a tri-state bool i.e. true | false | null.
 */
const isValidComplexLengthExpression = node => {
  if (node.type !== 'BinaryExpression') {
    return null;
  }

  const leftIsLiteralNumber = isLiteralNumber(node.left);
  const rightIsLiteralNumber = isLiteralNumber(node.right);

  const leftIsLengthIdentifier = isLengthIdentifier(node.left);
  const rightIsLengthIdentifier = isLengthIdentifier(node.right);

  // {NUMBER} {OPERATOR} {NUMBER} is invalid regardless of operator
  if (leftIsLiteralNumber && rightIsLiteralNumber) {
    return false;
  }

  // {TOKEN} {OPERATOR} {NUMBER} or {NUMBER} {OPERATOR} {TOKEN}
  // Multiples of tokens are valid while any other {OPERATOR} is not
  if (
    (leftIsLiteralNumber && rightIsLengthIdentifier) ||
    (rightIsLiteralNumber && leftIsLengthIdentifier)
  ) {
    return node.operator === '*';
  }

  const leftIsSupportedType =
    leftIsLiteralNumber ||
    leftIsLengthIdentifier ||
    node.left.type === 'BinaryExpression';
  const rightIsSupportedType =
    rightIsLiteralNumber ||
    rightIsLengthIdentifier ||
    node.right.type === 'BinaryExpression';

  if (!(leftIsSupportedType && rightIsSupportedType)) {
    return null;
  }

  const leftIsValid = isValidComplexLengthExpression(node.left);
  const rightIsValid = isValidComplexLengthExpression(node.right);

  if (leftIsValid === null && rightIsValid === null) {
    return null;
  }

  // {VALID_EXPRESSION} {OPERATOR} {ANYTHING}
  // This is valid if the operator is multiplication
  if (
    (leftIsValid === null && rightIsValid === true) ||
    (rightIsValid === null && leftIsValid === true)
  ) {
    return node.operator === '*';
  }

  return leftIsValid && rightIsValid;
};

const checkLengths = (node, context) => {
  const { key, value } = node;
  const isLength =
    SPACING_PROPS.includes(key.name) ||
    RADII_PROPS.includes(key.name) ||
    BORDER_PROPS.includes(key.name);

  if (!isLength) {
    return;
  }

  const isRawNumber =
    value.type === 'Literal' && typeof value.value === 'number';
  const isNonZeroNumber = isRawNumber && value.value !== 0;

  if (isNonZeroNumber) {
    context.report({
      node,
      message: `Don't use raw numbers for \`${
        key.name
      }\` instead use a Backpack token or multiples of a token`,
    });
  }

  const isValid = isValidComplexLengthExpression(value);

  // Explicitly check for false because `null` indicates that we don't know if it's valid
  if (isValid === false) {
    context.report({
      node,
      message: `Don't use raw numbers for \`${
        key.name
      }\` instead use a Backpack token or multiples of a token`,
    });
  }
};

module.exports = context => ({
  meta: {
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          autoImport: {
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
  Property: node => {
    checkColor(node, context);
    checkLengths(node, context);
  },
});
