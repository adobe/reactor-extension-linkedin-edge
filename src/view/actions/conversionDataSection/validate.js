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

import { isDataElementToken } from '../../utils/validators';
import checkRequired from '../../utils/checkRequired';
import currencies from './currencies';

export default ({
  conversion,
  conversionHappenedAt,
  conversionValue: { currencyCode, amount }
}) => {
  const errors = {};

  [
    ['conversionHappenedAt', conversionHappenedAt, 'a conversion time'],
    ['conversion', conversion, 'a conversion ID or a conversion URN']
  ].forEach(([k, v, errorVariableDescription]) => {
    checkRequired(k, v, errorVariableDescription || `a ${k}`, errors);
  });

  if (conversionHappenedAt && !isDataElementToken(conversionHappenedAt)) {
    const v = Number(conversionHappenedAt);
    if (Number.isNaN(v)) {
      errors.conversionHappenedAt =
        'The value of this fields must be a timestamp or a data element.';
    }
  }

  if (currencyCode && !amount) {
    errors['conversionValue.amount'] = 'Please provide an amount.';
  }

  if (!currencyCode && amount) {
    errors['conversionValue.currencyCode'] = 'Please provide a currency code.';
  }

  [['conversionValue.amount', amount]].forEach(([k, v]) => {
    if (v && !isDataElementToken(v)) {
      const numberValue = Number(v);
      if (Number.isNaN(numberValue)) {
        errors[k] =
          'The value of this field must be a number or a data element.';
      }
    }
  });

  if (
    currencyCode &&
    !isDataElementToken(currencyCode) &&
    currencies.filter(({ id }) => id === currencyCode).length === 0
  ) {
    errors['conversionValue.currencyCode'] =
      'The currency must be a ISO-4217 currency code or a data element.';
  }

  return errors;
};
