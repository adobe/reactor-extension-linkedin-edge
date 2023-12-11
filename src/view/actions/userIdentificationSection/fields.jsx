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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Badge,
  Content,
  Heading,
  Text,
  View,
  Link,
  ContextualHelp
} from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';
import WrappedTextField from '../../components/wrappedTextField';
import UserDataEditor from '../../components/rawJsonEditor';
import UserDataRow from './userDataRow';
import userDataComboboxFields from './userDataComboboxFields';
import getEmptyDataJson from './getEmptyValue';
import {
  addToVariablesFromEntity,
  addToEntityFromVariables
} from '../../utils/entityVariablesConverter';

const { getUserDataName, getUserDataId } = userDataComboboxFields;

export default function ServerEventParametersFields() {
  const { setValue, watch } = useFormContext();
  const [userDataRaw, userDataJsonPairs] = watch([
    'userDataRaw',
    'userDataJsonPairs'
  ]);

  return (
    <View>
      <Heading level="3">User Data</Heading>

      <Content marginBottom="size-150">
        <Text>
          For tying the event to an user you need to fill in at least one of the
          &rsquo;Email&rsquo;, <br />
          or the &rsquo;LinkedIn First Party Ads Tracking UUID&rsquo; fields.
        </Text>
      </Content>

      <WrappedTextField
        name="user_identification.sha256_email"
        width="size-4600"
        label="Email"
        supportDataElement
      />

      <WrappedTextField
        name="user_identification.linkedin_first_party_ads_tracking_uuid"
        width="size-4600"
        label="LinkedIn First Party Ads Tracking UUID"
        description="First party cookie ID."
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                Advertisers need to enable enhanced conversion tracking from{' '}
                <Link>
                  <a
                    href="https://www.linkedin.com/help/lms/answer/a423304/enable-first-party-cookies-on-a-linkedin-insight-tag"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Campaign Manager
                  </a>
                </Link>{' '}
                in order to activate first party cookies that append a click ID{' '}
                <strong>li_fat_id</strong> to the clicked URLs.
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <UserDataEditor
        label="Customer information data"
        radioLabel="Select the way you want to provide the user atrributes"
        description="A valid JSON object or a data element."
        typeVariable="userDataType"
        rawVariable="userDataRaw"
        jsonVariable="userDataJsonPairs"
        getEmptyJsonValueFn={getEmptyDataJson}
        row={UserDataRow}
        onTypeSwitch={(v) => {
          // Auto Update Data Content
          if (v === 'json') {
            let variables = [];
            try {
              variables = addToVariablesFromEntity(
                [],
                JSON.parse(userDataRaw)
              ).map(({ key, value }) => ({
                key: getUserDataName(key),
                value
              }));
            } catch (e) {
              // Don't do anything
            }

            if (variables.length === 0) {
              variables.push(getEmptyDataJson());
            }

            setValue('userDataJsonPairs', variables, {
              shouldValidate: true,
              shouldDirty: true
            });
          } else if (userDataJsonPairs.length > 1 || userDataJsonPairs[0].key) {
            let entity = JSON.stringify(
              addToEntityFromVariables(
                {},
                userDataJsonPairs.map(({ key, value }) => ({
                  key: getUserDataId(key),
                  value
                }))
              ),
              null,
              2
            );

            if (entity === '{}') {
              entity = '';
            }

            setValue('userDataRaw', entity, {
              shouldValidate: true,
              shouldDirty: true
            });
          }
          // END: Auto Update Data Content
        }}
      />

      <Badge variant="info" marginTop="size-100">
        <Info aria-label="Information about field hashing" />
        <Text>
          Before sending the data to the LinkedIn API endpoint, the extension
          will hash and normalize the value of the Email field.
          <br />
          The extension will not hash the value of this field if a SHA256 string
          is already present.
        </Text>
      </Badge>
    </View>
  );
}
