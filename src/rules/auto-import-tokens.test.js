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

const { RuleTester } = require('eslint');

const autoImportTokens = require('./auto-import-tokens');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});

ruleTester.run('auto-import-tokens', autoImportTokens, {
  valid: [
    `
    import { colorWhite } from 'bpk-tokens/tokens/base.es6';

    const styles = StyleSheet.create({
      foo: {
        color: colorWhite,
      },
    });`,
    {
      code: `const foo = typeof colorWhite`,
    },
  ],
  invalid: [
    {
      code: `
const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      output: `
import { colorWhite } from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      code: `
/*
 * Some comments
 */
const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      output: `
/*
 * Some comments
 */
import { colorWhite } from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      code: `
import { colorWhite } from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
    padding: spacingSm
  },
});`,
      output: `
import { spacingSm, colorWhite } from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
    padding: spacingSm
  },
});`,
      errors: [
        {
          message: "'spacingSm' token is not defined.",
        },
      ],
    },
    {
      code: `
import { 
  colorWhite
} from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
    padding: spacingSm
  },
});`,
      output: `
import { 
  spacingSm,
colorWhite
} from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
    padding: spacingSm
  },
});`,
      errors: [
        {
          message: "'spacingSm' token is not defined.",
        },
      ],
    },
    {
      code: `
import React from 'react';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite
  },
});`,
      output: `
import React from 'react';
import { colorWhite } from 'bpk-tokens/tokens/base.es6';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      code: `
import React from 'react';
import PropTypes from 'prop-types';
import utils from './utils';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite
  },
});`,
      output: `
import React from 'react';
import PropTypes from 'prop-types';
import { colorWhite } from 'bpk-tokens/tokens/base.es6';
import utils from './utils';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      options: [{ platform: 'native' }],
      code: `
const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      output: `
import { colorWhite } from 'bpk-tokens/tokens/base.react.native';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      options: [{ platform: 'native', tokensPackage: { native: './tokens' } }],
      code: `
const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      output: `
import { colorWhite } from './tokens';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      options: [{ platform: 'web', tokensPackage: { web: './web-tokens' } }],
      code: `
const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      output: `
import { colorWhite } from './web-tokens';

const styles = StyleSheet.create({
  foo: {
    color: colorWhite,
  },
});`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
    {
      options: [{ typeof: true }],
      code: `const foo = typeof colorWhite`,
      output: `
import { colorWhite } from 'bpk-tokens/tokens/base.es6';
const foo = typeof colorWhite`,
      errors: [
        {
          message: "'colorWhite' token is not defined.",
        },
      ],
    },
  ],
});
