/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { Heading, View, Link } from '@adobe/react-spectrum';
import WrappedTextField from '../../components/wrappedTextField';
import WrappedComboboxField from '../../components/wrappedComboBox';
import currencies from './currencies';

export default function ConversionDataSectionFields() {
  return (
    <View>
      <Heading level="3">Conversion Data</Heading>

      <WrappedTextField
        name="conversion"
        width="size-4600"
        label="Conversion"
        necessityIndicator="label"
        isRequired
        description="The ID of the conversion rule created in LinkedIn Campaign Manager."
        supportDataElement
      />

      <WrappedTextField
        name="conversionHappenedAt"
        width="size-4600"
        label="Conversion Time"
        necessityIndicator="label"
        isRequired
        description="Epoch timestamp in milliseconds at which the conversion event happened."
        supportDataElement
      />

      <WrappedComboboxField
        name="conversionValue.currencyCode"
        aria-label="currencyCode"
        minWidth="size-4600"
        width="size-4600"
        description={
          <span>
            Currency as a string in{' '}
            <Link>
              <a
                href="https://en.wikipedia.org/wiki/ISO_4217"
                rel="noreferrer"
                target="_blank"
              >
                ISO-4217
              </a>
            </Link>{' '}
            format.
          </span>
        }
        supportDataElement
        label="Currency"
        allowsCustomValue
        defaultItems={currencies}
      />

      <WrappedTextField
        name="conversionValue.amount"
        width="size-4600"
        label="Amount"
        supportDataElement
        description='Value of the conversion in decimal string (e.g. "100.05").'
      />

      <WrappedTextField
        name="eventId"
        width="size-4600"
        label="Event ID"
        description={
          'This ID can be any unique string chosen by the advertiser and will be used ' +
          'for deduplication.'
        }
        supportDataElement
      />
    </View>
  );
}
