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
const { RuleTester } = require('eslint');
const rule = require('./no-classname-assign');

const parserOptions = {
  parser: '@babel/eslint-parser',
  ecmaVersion: 2015,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-classname-assign', rule, {
  valid: [
    {
      code: `
                import BpkButton from '@skyscanner/backpack-web';
                function MyComponent() {
                    return <BpkButton className="my-class" />;
                }
            `,
    },
    {
      code: `
                import { BpkButton } from '@skyscanner/backpack-web';
                function MyComponent() {
                    return <BpkButton />;
                }
            `,
    },
    {
      code: `
                import NotBackpack from 'some-other-package';
                function MyComponent() {
                    NotBackpack.className = 'another-class';
                }
            `,
    },
  ],
  invalid: [
    {
      code: `
                import BpkButton from '@skyscanner/backpack-web';
                function MyComponent() {
                    BpkButton.className = 'another-class';
                }
            `,
      errors: [
        {
          message: 'Avoid assigning to className of backpack-web components',
          type: 'AssignmentExpression',
        },
      ],
    },
    {
      code: `
                import { BpkButton, BpkLink } from '@skyscanner/backpack-web';
                function MyComponent() {
                    BpkButton.className = 'another-class';
                    BpkLink.className = 'another-class';
                }
            `,
      errors: [
        {
          message: 'Avoid assigning to className of backpack-web components',
          type: 'AssignmentExpression',
        },
        {
          message: 'Avoid assigning to className of backpack-web components',
          type: 'AssignmentExpression',
        },
      ],
    },
  ],
});
