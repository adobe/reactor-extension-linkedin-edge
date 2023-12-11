/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import userDataComboboxFields from './userDataComboboxFields';

const { getUserDataId } = userDataComboboxFields;

export default ({ settings }) => {
  let userDataRaw = settings?.user_data || '';

  if (typeof userDataRaw === 'object') {
    userDataRaw = JSON.stringify(
      Object.entries(userDataRaw).reduce((acc, [key, value]) => {
        acc[getUserDataId(key)] = value;
        return acc;
      }, {}),
      null,
      2
    );
  }

  return {
    user_identification: settings?.user_identification || {},
    userDataType: 'raw',
    userDataRaw,
    userDataJsonPairs: []
  };
};
