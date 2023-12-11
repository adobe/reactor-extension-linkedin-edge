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

import { isDataElementToken } from '../../utils/validators';

export default ({ ...values }) => {
  const settings = {};

  ['conversion', 'conversionHappenedAt', 'eventId'].forEach((k) => {
    if (values[k]) {
      if (!settings.event) {
        settings.event = {};
      }

      settings.event[k] = values[k];

      if (['conversionHappenedAt'].includes(k)) {
        let v = settings.event[k];
        v = isDataElementToken(v) ? v : Number(v);
        settings.event[k] = v;
      }
    }
  });

  if (values.conversionValue.currencyCode || values.conversionValue.amount) {
    if (!settings.event) {
      settings.event = {};
    }

    if (values.conversionValue.currencyCode) {
      if (!settings.event.conversionValue) {
        settings.event.conversionValue = {};
      }

      settings.event.conversionValue.currencyCode =
        values.conversionValue.currencyCode;
    }

    if (values.conversionValue.amount) {
      if (!settings.event.conversionValue) {
        settings.event.conversionValue = {};
      }

      settings.event.conversionValue.amount = values.conversionValue.amount;
    }
  }

  return settings;
};
