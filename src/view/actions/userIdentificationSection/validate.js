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

/* eslint-disable camelcase */

import parseJson from '../../utils/parseJson';
import { isObject, isDataElementToken } from '../../utils/validators';

export default ({
  user_identification = {},
  userDataRaw,
  userDataType,
  userDataJsonPairs
}) => {
  const errors = {};
  const { sha256_email, linkedin_first_party_ads_tracking_uuid } =
    user_identification;

  if (!sha256_email && !linkedin_first_party_ads_tracking_uuid) {
    errors['user_identification.sha256_email'] =
      'Please provide either an "Email" or a "LinkeIn First Party Ads Tracking UUID".';
  }

  if (userDataType === 'raw') {
    if (userDataRaw) {
      if (isDataElementToken(userDataRaw)) {
        return errors;
      }

      const { message = '', parsedJson } = parseJson(userDataRaw);
      if (message || !isObject(parsedJson)) {
        return {
          userDataRaw: `Please provide a valid JSON object or a data element.${
            message ? ` ${message}.` : ''
          }`
        };
      }
    }
  } else {
    userDataJsonPairs.forEach((q, index) => {
      if (!q.key && q.value) {
        errors[`userDataJsonPairs.${index}.key`] = 'Please provide a key name.';
      }

      if (q.key && !q.value) {
        errors[`userDataJsonPairs.${index}.value`] = 'Please provide a value.';
      }
    });
  }

  return errors;
};
