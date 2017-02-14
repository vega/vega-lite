/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../../util';
import {X, COLUMN, ROW} from '../../../src/channel';
import * as rules from '../../../src/compile/axis/rules';

describe('compile/axis', ()=> {
  describe('grid()', function () {
    it('should return specified orient', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis:{grid: false}}
          }
        }), X, true);
      assert.deepEqual(grid, false);
    });

    it('should return true by default', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, true);
      assert.deepEqual(grid, true);
    });

    it('should return undefined for COLUMN', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), COLUMN, true);
      assert.deepEqual(grid, false);
    });

    it('should return undefined for ROW', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), ROW, true);
      assert.deepEqual(grid, false);
    });
    it('should return undefined for non-gridAxis', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, false);
      assert.deepEqual(grid, undefined);
    });
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      const orient = rules.orient({orient: 'bottom'}, 'x');
      assert.deepEqual(orient, 'bottom');
    });

    it('should return bottom for x by default', function () {
      const orient = rules.orient({}, 'x');
      assert.deepEqual(orient, 'bottom');
    });

    it('should return top for column by default', function () {
      const orient = rules.orient({}, 'column');
      assert.deepEqual(orient, 'top');
    });

    it('should return left for row by default', function () {
      const orient = rules.orient({}, 'row');
      assert.deepEqual(orient, 'left');
    });

    it('should return left for y by default', function () {
      const orient = rules.orient({}, 'y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function() {
    it('should return undefined by default for non-x', function () {
      const tickCount = rules.tickCount({}, 'y', {field: 'a', type: 'quantitative'});
      assert.deepEqual(tickCount, undefined);
    });

    it('should return 5 by default for x', function () {
      const tickCount = rules.tickCount({}, 'x', {field: 'a', type: 'quantitative'});
      assert.deepEqual(tickCount, 5);
    });

    it('should return specified tickCount', function () {
      const tickCount = rules.tickCount({tickCount: 10}, 'x', {field: 'a', type: 'quantitative'});
      assert.deepEqual(tickCount, 10);
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = rules.title({title: 'Custom'}, {field: 'a', type: "quantitative"}, {}, false);
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title({titleMaxLength: 3}, {field: 'a', type: "quantitative"}, {}, false);
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title({titleMaxLength: 10}, {aggregate: 'sum', field: 'a', type: "quantitative"}, {}, false);
      assert.deepEqual(title, 'SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = rules.title({titleMaxLength: 3}, {aggregate: 'sum', field: 'a', type: "quantitative"}, {}, false);
      assert.deepEqual(title, 'SU…');
    });


    it('should add return undefined for gridAxis', function () {
      const title = rules.title({titleMaxLength: 3}, {field: 'a', type: "quantitative"}, {}, true);
      assert.deepEqual(title, undefined);
    });
  });

  describe('values', () => {
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

  describe('zindex()', function () {
    it('should return undefined by default without grid defined', function () {
      const zindex = rules.zindex({}, false);
      assert.deepEqual(zindex, 1);
    });

    it('should return back by default with grid defined', function () {
      const zindex = rules.zindex({}, true);
      assert.deepEqual(zindex, 0);
    });

    it('should return specified zindex', function () {
      const zindex = rules.zindex({zindex: 2}, false);
      assert.deepEqual(zindex, 2);
    });
  });
});
