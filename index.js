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

const useTokens = require('./src/rules/use-tokens/use-tokens');
const useComponents = require('./src/rules/use-components/use-components');
const useButtonV2 = require('./src/rules/use-button-v2/use-button-v2');

module.exports = {
  rules: {
    'use-tokens': useTokens,
    'use-components': useComponents,
    'use-button-v2': useButtonV2,
  },
};
