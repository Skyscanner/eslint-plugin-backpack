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

const SPACING_PROPS = [
  'borderEndWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderStartWidth',
  'borderTopWidth',
  'borderWidth',
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
      fix: fixer => fixer.replaceText(value, expectedToken.name),
    });
  }
};

const isLiteralNumber = node =>
  node.type === 'Literal' && typeof node.value === 'number';

const isSpacingIdentifier = node =>
  node.type === 'Identifier' && SPACING_NAMES.has(node.name);

/*
 * Ensures that a complex expression i.e. not a literal is a
 * valid expression and use of Backpack tokens. For example `spacingSm * 4`
 * is valid because it's a multiple of a base token whereas `spacingSm * 4 + 4`
 * it not because the added 4 is a raw number.
 *
 * Returns a tri-state bool i.e. true | false | null.
 */
const isValidComplexSpacingExpression = node => {
  if (node.type !== 'BinaryExpression') {
    return null;
  }

  const leftIsLiteralNumber = isLiteralNumber(node.left);
  const rightIsLiteralNumber = isLiteralNumber(node.right);

  const leftIsSpacingIdentifier = isSpacingIdentifier(node.left);
  const rightIsSpacingIdentifier = isSpacingIdentifier(node.right);

  // {NUMBER} {OPERATOR} {NUMBER} is invalid regardless of operator
  if (leftIsLiteralNumber && rightIsLiteralNumber) {
    return false;
  }

  // {TOKEN} {OPERATOR} {NUMBER} or {NUMBER} {OPERATOR} {TOKEN}
  // Multiples of tokens are valid while any other {OPERATOR} is not
  if (
    (leftIsLiteralNumber && rightIsSpacingIdentifier) ||
    (rightIsLiteralNumber && leftIsSpacingIdentifier)
  ) {
    return node.operator === '*';
  }

  const leftIsSupportedType =
    leftIsLiteralNumber ||
    leftIsSpacingIdentifier ||
    node.left.type === 'BinaryExpression';
  const rightIsSupportedType =
    rightIsLiteralNumber ||
    rightIsSpacingIdentifier ||
    node.right.type === 'BinaryExpression';

  if (!(leftIsSupportedType && rightIsSupportedType)) {
    return null;
  }

  const leftIsValid = isValidComplexSpacingExpression(node.left);
  const rightIsValid = isValidComplexSpacingExpression(node.right);

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

const checkSpacing = (node, context) => {
  const { key, value } = node;
  const isSpacing =
    SPACING_PROPS.includes(key.name) || RADII_PROPS.includes(key.name);

  if (!isSpacing) {
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

  const isValid = isValidComplexSpacingExpression(value);

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
  },
  Property: node => {
    checkColor(node, context);
    checkSpacing(node, context);
  },
});
