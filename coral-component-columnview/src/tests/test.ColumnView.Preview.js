/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {helpers} from '../../../coral-utils/src/tests/helpers';
import {ColumnView} from '../../../coral-component-columnview';

describe('ColumnView.Preview', function() {
  describe('Namespace', function() {
    it('should be defined', function() {
      expect(ColumnView).to.have.property('Preview');
      expect(ColumnView.Preview).to.have.property('Content');
      expect(ColumnView.Preview).to.have.property('Asset');
      expect(ColumnView.Preview).to.have.property('Label');
      expect(ColumnView.Preview).to.have.property('Value');
      expect(ColumnView.Preview).to.have.property('Separator');
    });
  });

  describe('API', function() {});

  describe('Markup', function() {
    describe('#content', function() {
      it('should not move items into the content zone if tag is explicitly given', function() {
        const el = helpers.build(window.__html__['ColumnView.Preview.content.html']);
        var button = el.querySelector('button');
        expect(button.parentElement).not.to.equal(el.content);
      });

      it('should move items into the content zone if tag is not given', function() {
        const el = helpers.build(window.__html__['ColumnView.Preview.content.implicit.html']);
        var button = el.querySelector('button');
        expect(button.parentElement).to.equal(el.content);
      });
    });
  });

  describe('Events', function() {});
  describe('User Interaction', function() {});
  describe('Implementation Details', function() {});
});
