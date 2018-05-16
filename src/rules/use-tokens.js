const _ = require('lodash');
const tinycolor = require('tinycolor2');
const { props: TOKENS } = require('bpk-tokens/tokens/base.raw.json');

const COLOR_PROPS = [
  'color',
  'backgroundColor',
];

const COLORS = _.filter(TOKENS, { category: 'colors' })
  .map(({ name, value }) => ({ name: _.camelCase(name), value }));

module.exports = context => ({
  ObjectExpression: (node) => {
    node.properties.forEach(({ key, value }) => {
      if (COLOR_PROPS.includes(key.name) && value.type === 'Literal') {
        const color = tinycolor(value.value);

        const expectedToken = _.find(COLORS, { value: color.toRgbString() });

        if (expectedToken) {
          context.report(node, `Use the following Backpack token instead: ${expectedToken.name}`);
        }
      }
    });
  },
});
