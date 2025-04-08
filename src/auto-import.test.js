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

const { addImport, getImportDefinition } = require('./auto-import');

// Dummy rule that executes the autoImport logic
// for `dummy` and `extraDummy` variables.
const dummyRule = {
  meta: {
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            type: 'string',
          },
        },
      },
    ],
  },

  create(context) {
    const { report, options } = context;

    return {
      Property: (node) => {
        if (node.value.name !== 'dummy' && node.value.name !== 'extraDummy') {
          return;
        }

        const style = (options[0] && options[0].style) || 'named';
        const def = getImportDefinition(node, node.value.name, {
          packageName: 'dummy',
          style,
        });
        if (def.isImported) {
          return;
        }

        report({
          node,
          message: `Don't do this`,
          fix: (fixer) => addImport(fixer, def),
        });
      },
    };
  },
};

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('addImport', dummyRule, {
  valid: [
    `
    import { dummy } from 'dummy';

    const styles = StyleSheet.create({
      foo: {
        color: dummy,
      },
    });`,
    `
    import { dummy as extraDummy } from 'dummy';

    const styles = StyleSheet.create({
      foo: {
        color: extraDummy,
      },
    });`,
    {
      options: [{ style: 'default' }],
      code: `
        import dummy from 'dummy';

        const styles = StyleSheet.create({
          foo: {
            color: dummy,
          },
        });`,
    },
  ],
  invalid: [
    {
      code: `
const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      output: `
import { dummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      errors: [
        {
          message: `Don't do this`,
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
    color: dummy,
  },
});`,
      output: `
/*
 * Some comments
 */
import { dummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
    {
      code: `
import { extraDummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
    padding: extraDummy
  },
});`,
      output: `
import { dummy, extraDummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
    padding: extraDummy
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
    {
      code: `
import {
  extraDummy
} from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
    padding: extraDummy
  },
});`,
      output: `
import {
  dummy,
extraDummy
} from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
    padding: extraDummy
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
    {
      code: `
import React from 'react';

const styles = StyleSheet.create({
  foo: {
    color: dummy
  },
});`,
      output: `
import React from 'react';
import { dummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy
  },
});`,
      errors: [
        {
          message: `Don't do this`,
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
    color: dummy
  },
});`,
      output: `
import React from 'react';
import PropTypes from 'prop-types';
import { dummy } from 'dummy';
import utils from './utils';

const styles = StyleSheet.create({
  foo: {
    color: dummy
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
    {
      options: [{ style: 'default' }],
      code: `
const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      output: `
import dummy from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
    {
      options: [{ style: 'default' }],
      code: `
import { notSoDummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      output: `
import dummy, { notSoDummy } from 'dummy';

const styles = StyleSheet.create({
  foo: {
    color: dummy,
  },
});`,
      errors: [
        {
          message: `Don't do this`,
        },
      ],
    },
  ],
});
