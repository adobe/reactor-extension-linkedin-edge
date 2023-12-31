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

import { Link } from '@adobe/react-spectrum';
import React from 'react';

export default {
  country: {
    description: (
      <span>
        Country as a string in{' '}
        <Link>
          <a
            href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2"
            rel="noreferrer"
            target="_blank"
          >
            ISO-3166-1 alpha-2
          </a>
        </Link>{' '}
        format.
      </span>
    )
  }
};
