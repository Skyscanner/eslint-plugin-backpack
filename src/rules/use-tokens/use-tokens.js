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
const {
  props: WEB_TOKENS,
} = require('@skyscanner/bpk-foundations-web/tokens/base.raw.json');

const { addImport, getImportDefinition } = require('../../auto-import');

const COLOR_ALLOWLIST = ['transparent', null, undefined];
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

const TOKENS = _.merge(_.mapKeys(WEB_TOKENS, (value, key) => `WEB_${key}`));

const tokensByCategory = category =>
  _.chain(TOKENS)
    .filter({ category })
    .map(({ name, value }) => ({
      name: _.camelCase(name),
      value,
    }))
    .value();

const tokensByType = type =>
  _.chain(TOKENS)
    .filter({ type: type })
    .map(({ name, value, deprecated }) => ({
      name: _.camelCase(name),
      value,
      deprecated,
    }))
    .value();

const COLORS = tokensByType('color').filter(function(el) {
  return el.deprecated !== true;
});

const RADII_NAMES = new Set(tokensByCategory('radii').map(x => x.name));
const BORDER_NAMES = new Set(tokensByCategory('borders').map(x => x.name));

const checkColor = (node, context) => {
  const { key, value } = node;
  const isColor = COLOR_PROPS.includes(key.name) && value.type === 'Literal';
  const allowedColor = COLOR_ALLOWLIST.filter(c => value.value === c).length;
  // We check if the colour is in the allowlist, or if it's a valid Backpack token
  if (!isColor || allowedColor) {
    return;
  }

  const color = tinycolor(value.value);

  const matchedTokens = _.filter(COLORS, { value: color.toRgbString() });
  if (matchedTokens.length > 1) {
    context.report({
      node,
      message: `Multiple colors matched for colour, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token`,
    });
  } else if (matchedTokens.length === 0) {
    context.report({
      node,
      message: `Unknown color detected not in our brand, refer to to https://www.skyscanner.design/latest/foundations/colours/usage-LJ0uHGQL for the right semantic token`,
    });
  } else {
    context.report({
      node,
      message: `Use the following Backpack token instead: ${matchedTokens[0].name}`,
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
  (RADII_NAMES.has(node.name) || BORDER_NAMES.has(node.name));

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
    RADII_PROPS.includes(key.name) || BORDER_PROPS.includes(key.name);

  if (!isLength) {
    return;
  }

  const isRawNumber =
    value.type === 'Literal' && typeof value.value === 'number';
  const isNonZeroNumber = isRawNumber && value.value !== 0;

  if (isNonZeroNumber) {
    context.report({
      node,
      message: `Don't use raw numbers for \`${key.name}\` instead use a Backpack token or multiples of a token`,
    });
  }

  const isValid = isValidComplexLengthExpression(value);

  // Explicitly check for false because `null` indicates that we don't know if it's valid
  if (isValid === false) {
    context.report({
      node,
      message: `Don't use raw numbers for \`${key.name}\` instead use a Backpack token or multiples of a token`,
    });
  }
};

module.exports = {
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
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      Property: node => {
        checkColor(node, context);
        checkLengths(node, context);
      },
    };
  },
};
