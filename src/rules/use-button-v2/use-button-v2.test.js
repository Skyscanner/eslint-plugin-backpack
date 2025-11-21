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

const useButtonV2 = require('./use-button-v2');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('use-button-v2', useButtonV2, {
  valid: [
    // Allowed: BpkButtonV2 import
    "import { BpkButtonV2 } from '@skyscanner/backpack-web/bpk-component-button';",
    // Allowed: BpkButtonV2 with other imports
    "import { BpkButtonV2, SomethingElse } from '@skyscanner/backpack-web/bpk-component-button';",
    // Allowed: imports from other packages
    "import BpkButton from '@skyscanner/backpack-web/some-other-package';",
    "import { BpkButton } from '@skyscanner/backpack-web/some-other-package';",
    // Allowed: other imports
    "import React from 'react';",
    "import { useState } from 'react';",
  ],
  invalid: [
    {
      // Default import of BpkButton
      code: "import BpkButton from '@skyscanner/backpack-web/bpk-component-button';",
      errors: [
        {
          messageId: 'useButtonV2',
        },
      ],
    },
    {
      // Named import of BpkButton
      code: "import { BpkButton } from '@skyscanner/backpack-web/bpk-component-button';",
      errors: [
        {
          messageId: 'useButtonV2',
        },
      ],
    },
    {
      // Named import with alias
      code: "import { BpkButton as Button } from '@skyscanner/backpack-web/bpk-component-button';",
      errors: [
        {
          messageId: 'useButtonV2',
        },
      ],
    },
    {
      // Multiple named imports including BpkButton
      code: "import { BpkButton, OtherComponent } from '@skyscanner/backpack-web/bpk-component-button';",
      errors: [
        {
          messageId: 'useButtonV2',
        },
      ],
    },
  ],
});
