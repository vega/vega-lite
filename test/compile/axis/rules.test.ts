import {UnitModel} from '../../../src/compile/unit';
/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLUMN, ROW, X} from '../../../src/channel';
import * as rules from '../../../src/compile/axis/rules';
import {parseUnitModelWithScale} from '../../util';

describe('compile/axis', ()=> {
  describe('grid()', function () {
    it('should return true by default for continuous scale that is not binned', function () {
      const grid = rules.grid('linear', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, true);
    });

    it('should return false by default for binned field', function () {
      const grid = rules.grid('linear', {bin: true, field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });

    it('should return false by default for a discrete scale', function () {
      const grid = rules.grid('point', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });
  });

  describe('minMaxExtent', () => {
    it('returns specified extent for a non-grid axis', () => {
      assert.equal(rules.minMaxExtent(25, false), 25);
    });

    it('returns 0 for a grid axis', () => {
      assert.equal(rules.minMaxExtent(0, true), 0);
    });
  });

  describe('orient()', function () {
    it('should return bottom for x by default', function () {
      const orient = rules.orient('x');
      assert.deepEqual(orient, 'bottom');
    });

    it('should return left for y by default', function () {
      const orient = rules.orient('y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function() {
    it('should return undefined by default for non-x', function () {
      const tickCount = rules.tickCount('y', {field: 'a', type: 'quantitative'});
      assert.deepEqual(tickCount, undefined);
    });

    it('should return 5 by default for x', function () {
      const tickCount = rules.tickCount('x', {field: 'a', type: 'quantitative'});
      assert.deepEqual(tickCount, 5);
    });
  });

  describe('title()', function () {
    it('should add return fieldTitle by default', function () {
      const title = rules.title(3, {field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title(10, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = rules.title(3, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'SU…');
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = rules.values({values: [{year: 1970}, {year: 1980}]}, null, null);

      assert.deepEqual(values, [
        {"signal": "datetime(1970, 0, 1, 0, 0, 0, 0)"},
        {"signal": "datetime(1980, 0, 1, 0, 0, 0, 0)"}
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = rules.values({values: [1,2,3,4]}, null, null);

      assert.deepEqual(values, [1,2,3,4]);
    });

    it('should return bin values if binned', () => {
      const model = {getName: x => x} as UnitModel;
      const values = rules.values({}, model, {field: 'foo', type: 'quantitative', bin: {maxbins: 5}});

      assert.deepEqual(values, {
        signal: 'sequence(bin_maxbins_5_foo_bins.start, bin_maxbins_5_foo_bins.stop + bin_maxbins_5_foo_bins.step, bin_maxbins_5_foo_bins.step)'
      });
    });
  });

  describe('zindex()', function () {
    it('should return undefined by default without grid defined', function () {
      const zindex = rules.zindex(false);
      assert.deepEqual(zindex, 1);
    });

    it('should return back by default with grid defined', function () {
      const zindex = rules.zindex(true);
      assert.deepEqual(zindex, 0);
    });
  });
});
