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
import {
  Heading,
  Flex,
  ContextualHelp,
  Content,
  Badge,
  Text
} from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';
import WrappedTextField from '../../components/wrappedTextField';

export default function CredentialsSectionFields({ mode }) {
  return (
    <Flex gap="size-150" direction="column">
      {mode === 'override' && (
        <>
          <Heading level="3" margin="0">
            Configuration Overrides
          </Heading>

          <Badge variant="info">
            <Info aria-label="Information about configuration overrides section" />
            <Text>
              Use this section to override any settings defined inside the
              extension configuration.
            </Text>
          </Badge>
        </>
      )}
      <Heading level={mode === 'override' ? 4 : 3} margin="0">
        Authentication
      </Heading>
      <WrappedTextField
        width="size-4600"
        name="authentication.accessToken"
        label="Access Token"
        isRequired={mode !== 'override'}
        necessityIndicator={mode === 'override' ? '' : 'label'}
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                For the access token you can use a data element associated with
                a LinkedIn secret.
              </p>
            </Content>
          </ContextualHelp>
        }
      />
    </Flex>
  );
}
