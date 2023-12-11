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

const sendWebConversion = require('../sendConversion');
const arc = {};

describe('Send Conversion library module', () => {
  test('makes a fetch call to the provided url', () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      authentication: {
        accessToken: 'tsecret'
      }
    };

    const settings = {
      user_identification: {
        sha256_email: 'email@email.com'
      },
      user_data: {
        firstName: 'name'
      },
      event: {
        conversion: 'urn:lla:llaParterConversion:12345',
        conversionHappenedAt: 123,
        conversionValue: {
          currencyCode: 'USD',
          amount: '10'
        }
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return sendWebConversion({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/rest/conversionEvents',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer tsecret'
          }),
          body:
            '{' +
            '"conversion":"urn:lla:llaParterConversion:12345",' +
            '"conversionHappenedAt":123,' +
            '"conversionValue":{' +
            '"currencyCode":"USD",' +
            '"amount":"10"' +
            '},' +
            '"user":{' +
            '"userIds":[{' +
            '"idType":"SHA256_EMAIL",' +
            '"idValue":"f3273dd18d95bc19d51d3e6356e4a679e6f13824497272a270e7bb540b0abb9d"' +
            '}],' +
            '"userInfo":{' +
            '"firstName":"name"' +
            '}' +
            '}' +
            '}'
        })
      );
    });
  });

  test('transforms a conversion ID to a URN', () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      authentication: {
        accessToken: 'tsecret'
      }
    };

    const settings = {
      user_identification: {
        sha256_email: 'email@email.com'
      },
      event: {
        conversion: '12345',
        conversionHappenedAt: 123
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return sendWebConversion({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/rest/conversionEvents',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body:
            '{' +
            '"conversion":"urn:lla:llaPartnerConversion:12345",' +
            '"conversionHappenedAt":123,' +
            '"user":{' +
            '"userIds":[{' +
            '"idType":"SHA256_EMAIL",' +
            '"idValue":"f3273dd18d95bc19d51d3e6356e4a679e6f13824497272a270e7bb540b0abb9d"' +
            '}]' +
            '}' +
            '}'
        })
      );
    });
  });

  test('throws an error when a hashable value is not string or a number', async () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      authentication: {
        accessToken: 'tsecret'
      }
    };

    const settings = {
      user_identification: {
        sha256_email: { a: 'email@email.com' }
      },
      user_data: {
        firstName: 'name'
      },
      event: {
        conversion: 'urn.lla.llaParterConversion:12345',
        conversionHappenedAt: 123,
        conversionValue: {
          currencyCode: 'USD',
          amount: '10'
        }
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };
    try {
      await sendWebConversion({ arc, utils });
    } catch (e) {
      expect(e.message).toBe(
        'The value of the "Email" field is not a string or a number. ' +
          'Cannot generate a SHA-256 string.'
      );
    }
  });

  test('makes a fetch call with the configuration settings overridden', () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      authentication: {
        accessToken: 'tsecret'
      }
    };

    const settings = {
      user_identification: {
        sha256_email: 'email@email.com'
      },
      user_data: {
        firstName: 'name'
      },
      event: {
        conversion: 'urn:lla:llaParterConversion:12345',
        conversionHappenedAt: 123,
        conversionValue: {
          currencyCode: 'USD',
          amount: '10'
        }
      },
      authentication: {
        accessToken: 'anotheraccesstoken'
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return sendWebConversion({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/rest/conversionEvents',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer anotheraccesstoken'
          }),
          body:
            '{' +
            '"conversion":"urn:lla:llaParterConversion:12345",' +
            '"conversionHappenedAt":123,' +
            '"conversionValue":{' +
            '"currencyCode":"USD",' +
            '"amount":"10"' +
            '},' +
            '"user":{' +
            '"userIds":[{' +
            '"idType":"SHA256_EMAIL",' +
            '"idValue":"f3273dd18d95bc19d51d3e6356e4a679e6f13824497272a270e7bb540b0abb9d"' +
            '}],' +
            '"userInfo":{' +
            '"firstName":"name"' +
            '}' +
            '}' +
            '}'
        })
      );
    });
  });
});
