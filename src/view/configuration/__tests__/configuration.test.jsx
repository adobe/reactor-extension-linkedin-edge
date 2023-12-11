/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND,  either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable no-template-curly-in-string */

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';
import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

import Configuration from '../configuration';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  accessTokenField: screen.getByLabelText(/Access Token/i, {
    selector: '[name="authentication.accessToken"]'
  })
});

describe('Configuration view', () => {
  test('sets form values from setting', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        authentication: {
          accessToken: 'a'
        }
      }
    });

    const { accessTokenField } = getFromFields();

    expect(accessTokenField.value).toBe('a');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        authentication: {
          accessToken: 'a'
        }
      }
    });

    const { accessTokenField } = getFromFields();

    await changeInputValue(accessTokenField, 'new a');

    expect(extensionBridge.getSettings()).toEqual({
      authentication: {
        accessToken: 'new a'
      }
    });
  });

  test('handles default form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        authentication: {
          accessToken: 'a'
        }
      }
    });

    const { accessTokenField } = getFromFields();

    expect(accessTokenField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(accessTokenField, '');

    await extensionBridge.validate();

    expect(accessTokenField).toHaveAttribute('aria-invalid', 'true');
  });
});
