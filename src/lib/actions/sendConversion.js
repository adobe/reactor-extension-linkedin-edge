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

const { emailNormalizer } = require('./helpers/normalizers');

/* eslint-disable camelcase */

const buildFetchObject = async ({
  settings: { event, user_identification, user_data },
  authentication: { accessToken },
  version,
  method
}) => {
  const normalizers = [['sha256_email', emailNormalizer]];

  for await (const [field, normalizer] of normalizers) {
    if (user_identification[field]) {
      user_identification[field] = await normalizer(user_identification[field]);
    }
  }

  event.user = {};
  event.user.userIds = Object.keys(user_identification).map((k) => ({
    idType: k.toUpperCase(),
    idValue: user_identification[k]
  }));
  if (user_data) {
    event.user.userInfo = user_data;
  }

  if (Number(event.conversion) > 0) {
    event.conversion = `urn:lla:llaPartnerConversion:${event.conversion}`;
  }

  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      'LinkedIn-Version': version,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(event)
  };
};

module.exports = async ({ utils }) => {
  const { getExtensionSettings, getSettings, fetch } = utils;
  let { authentication } = getExtensionSettings();
  const settings = getSettings();
  if (settings.authentication) {
    authentication = settings.authentication;
    delete settings.authentication;
  }

  const url = 'https://api.linkedin.com/rest/conversionEvents';
  const method = 'POST';
  const version = '202502';

  return fetch(
    url,
    await buildFetchObject({
      method,
      settings,
      authentication,
      version
    })
  );
};
