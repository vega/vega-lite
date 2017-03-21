/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, SIZE} from '../../../src/channel';
import * as rules from '../../../src/compile/legend/rules';
import {defaultConfig} from '../../../src/config';

describe('compile/legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = rules.title({title: 'Custom'}, {field: 'a'}, defaultConfig);
      assert.equal(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title({}, {field: 'a'}, defaultConfig);
      assert.equal(title, 'a');
    });
  });

  describe('values()', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = rules.values({values: [{year: 1970}, {year: 1980}]});

      assert.deepEqual(values, [
        new Date(1970, 0, 1).getTime(),
        new Date(1980, 0, 1).getTime()
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = rules.values({values: [1,2,3,4]});

      assert.deepEqual(values, [1,2,3,4]);
    });

  });

  describe('type()', () => {
    it('should return gradient type for color scale', () => {
      const t = rules.type({}, 'quantitative', COLOR, 'sequential');
      assert.equal(t, 'gradient');
    });

    it('should not return gradient type for size scale', () => {
      const t = rules.type({}, 'quantitative', SIZE, 'linear');
      assert.equal(t, undefined);
    });

    it('should be able to override default', () => {
      const t = rules.type({type: 'symbol'}, 'quantitative', COLOR, 'sequential');
      assert.equal(t, 'symbol');
    });

    it('should return no type for color scale with bin', () => {
      const t = rules.type({}, 'quantitative', COLOR, 'bin-ordinal');
      assert.equal(t, undefined);
    });

    it('should return gradient type for color scale with time scale', () => {
      const t = rules.type({}, 'temporal', COLOR, 'time');
      assert.equal(t, 'gradient');
    });

    it('should return no type for color scale with ordinal scale and temporal type', () => {
      const t = rules.type({}, 'temporal', COLOR, 'ordinal');
      assert.equal(t, undefined);
    });

    it('should return no type for color scale with ordinal scale and ordinal type', () => {
      const t = rules.type({}, 'ordinal', COLOR, 'ordinal');
      assert.equal(t, undefined);
    });
  });
});
