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

const _ = require('lodash');
const tinycolor = require('tinycolor2');
const { props: TOKENS } = require('bpk-tokens/tokens/base.raw.json');

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

const tokensByCategory = category =>
  _.filter(TOKENS, { category }).map(({ name, value }) => ({
    name: _.camelCase(name),
    value,
  }));

const COLORS = tokensByCategory('colors');

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

const checkSpacing = (node, context) => {
  const { key, value } = node;
  const isSpacing =
    (SPACING_PROPS.includes(key.name) || RADII_PROPS.includes(key.name)) &&
    value.type === 'Literal';

  if (!isSpacing) {
    return;
  }

  const isRawNumber = typeof value.value === 'number';
  const isNonZeroNumber = isRawNumber && value.value !== 0;

  if (isNonZeroNumber) {
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
