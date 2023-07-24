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
const merge = require('lodash/merge');

const useWebComponents = require('./use-web-components');
const useNativeComponents = require('./use-native-components');

const BASE_CONFIG = {
  autoImport: true,
  platform: 'web',
};

const createConfigForPlatform = (report, options) => {
  const config = merge({}, BASE_CONFIG, options[0]);
  if (config.platform === 'web') {
    return useWebComponents(report, options);
  }
  return useNativeComponents(report, options);
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
        },
      },
    ],
  },
  create(context) {
    const { report, options } = context;

    return {
      ...createConfigForPlatform(report, options),
    };
  },
};
