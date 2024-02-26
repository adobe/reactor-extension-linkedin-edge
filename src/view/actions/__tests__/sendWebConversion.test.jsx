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

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';

import SendConversion from '../sendConversion';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import {
  changeInputValue,
  changeComboboxValue
} from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFormFields = () => ({
  emailInput: screen.getByLabelText(/email/i),
  linkedinUuidInput: screen.getByLabelText(
    /linkedin first party ads tracking uuid/i,
    {
      selector:
        '[name="user_identification.linkedin_first_party_ads_tracking_uuid"]'
    }
  ),
  userDataRawTextarea: screen.getByLabelText(/user data raw/i),
  conversionInput: screen.getByLabelText(/conversion/i, {
    selector: '[name="conversion"]'
  }),
  conversionTimeInput: screen.getByLabelText(/conversion time/i),
  currencyInput: screen.getByLabelText(/currency/i, {
    selector: '[name="conversionValue.currencyCode"]'
  }),
  amountInput: screen.getByLabelText(/amount/i),
  eventIdInput: screen.getByLabelText(/event id/i),
  accessTokenIdInput: screen.getByLabelText(/access token/i, {
    selector: '[name="authentication.accessToken"]'
  })
});

describe('Send Conversion view', () => {
  test('sets form values from settings', async () => {
    renderView(SendConversion);

    extensionBridge.init({
      settings: {
        user_identification: {
          sha256_email: 'email@email.com',
          linkedin_first_party_ads_tracking_uuid: 'abc'
        },
        user_data: {
          title: 'title',
          companyName: 'company',
          lastName: 'last name'
        },
        event: {
          conversion: '123',
          conversionHappenedAt: 123,
          eventId: '123',
          conversionValue: {
            currencyCode: 'USD',
            amount: '10'
          }
        },
        authentication: { accessToken: 'token' }
      }
    });

    const {
      emailInput,
      linkedinUuidInput,
      userDataRawTextarea,
      conversionInput,
      conversionTimeInput,
      currencyInput,
      amountInput,
      eventIdInput,
      accessTokenIdInput
    } = getFormFields();

    expect(emailInput.value).toBe('email@email.com');
    expect(linkedinUuidInput.value).toBe('abc');
    expect(conversionInput.value).toBe('123');
    expect(conversionTimeInput.value).toBe('123');
    expect(currencyInput.value).toBe('USD');
    expect(amountInput.value).toBe('10');
    expect(eventIdInput.value).toBe('123');
    expect(userDataRawTextarea.value).toBe(
      '{\n' +
        '  "title": "title",\n' +
        '  "companyName": "company",\n' +
        '  "lastName": "last name"\n' +
        '}'
    );
    expect(accessTokenIdInput.value).toBe('token');
  });

  test('sets settings from form values', async () => {
    renderView(SendConversion);

    extensionBridge.init();

    const {
      emailInput,
      linkedinUuidInput,
      conversionInput,
      conversionTimeInput,
      currencyInput,
      amountInput,
      eventIdInput,
      userDataRawTextarea,
      accessTokenIdInput
    } = getFormFields();

    await changeComboboxValue(emailInput, 'email');
    await changeComboboxValue(linkedinUuidInput, 'uuid');
    await changeInputValue(conversionInput, 'ABC');
    await changeInputValue(conversionTimeInput, '5');
    await changeInputValue(currencyInput, 'EUR');
    await changeInputValue(amountInput, '100');
    await changeInputValue(eventIdInput, 'conversionid');
    await changeInputValue(userDataRawTextarea, '{{{{a}}');
    await changeInputValue(accessTokenIdInput, 'token');

    expect(extensionBridge.getSettings()).toEqual({
      user_identification: {
        sha256_email: 'email',
        linkedin_first_party_ads_tracking_uuid: 'uuid'
      },
      event: {
        conversionHappenedAt: 5,
        eventId: 'conversionid',
        conversionValue: {
          currencyCode: 'EUR',
          amount: '100.00'
        },
        conversion: 'ABC'
      },
      user_data: '{{a}}',
      authentication: { accessToken: 'token' }
    });
  });

  test('handles form validation correctly', async () => {
    renderView(SendConversion);

    extensionBridge.init();

    const { emailInput, conversionInput, conversionTimeInput } =
      getFormFields();

    await extensionBridge.validate();

    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(conversionTimeInput).toHaveAttribute('aria-invalid', 'true');
    expect(conversionInput).toHaveAttribute('aria-invalid', 'true');
  });
});
