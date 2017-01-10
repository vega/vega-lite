/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel, parseModel} from '../../util';
import {X, Y, COLUMN, ROW} from '../../../src/channel';
import * as rules from '../../../src/compile/axis/rules';

describe('compile/axis', ()=> {
  describe('grid()', function () {
    it('should return specified orient', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis:{grid: false}}
          }
        }), X);
      assert.deepEqual(grid, false);
    });

    it('should return true by default', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(grid, true);
    });

    it('should return undefined for COLUMN', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), COLUMN);
      assert.deepEqual(grid, undefined);
    });

    it('should return undefined for ROW', function () {
      const grid = rules.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), ROW);
      assert.deepEqual(grid, undefined);
    });
  });

  describe('zindex()', function () {
    it('should return undefined by default without grid defined', function () {
      const zindex = rules.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, Y);
      assert.deepEqual(zindex, 1);
    });

    it('should return back by default with grid defined', function () {
      const zindex = rules.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, {grid: true});
      assert.deepEqual(zindex, 0);
    });

    it('should return specified zindex', function () {
      const zindex = rules.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis: {zindex: 2}}
          }
        }), X, {grid: true});
      assert.deepEqual(zindex, 2);
    });
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      const orient = rules.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis:{orient: 'bottom'}}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return bottom for x by default', function () {
      const orient = rules.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return top for column by default', function () {
      const orient = rules.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            column: {field: 'a', type: 'nominal'}
          }
        }), COLUMN);
      assert.deepEqual(orient, 'top');
    });

    it('should return left for row by default', function () {
      const orient = rules.orient(parseModel({
          mark: "point",
          encoding: {
            row: {field: 'a', type: 'nominal'}
          }
        }), 'row');
      assert.deepEqual(orient, 'left');
    });

    it('should return left for y by default', function () {
      const orient = rules.orient(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', type: 'quantitative'}
          }
        }), 'y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function() {
    it('should return undefined by default', function () {
      const tickCount = rules.tickCount(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', type: 'quantitative'}
          }
        }), Y);
      assert.deepEqual(tickCount, undefined);
    });

    it('should return 5 by default', function () {
      const tickCount = rules.tickCount(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(tickCount, 5);
    });

    it('should return specified tickCount', function () {
      const tickCount = rules.tickCount(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis: {tickCount: 10}}
          }
        }), X);
      assert.deepEqual(tickCount, 10);
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = rules.title(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: 'quantitative', axis: {title: 'Custom'}}
        }
      }), X);
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = rules.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), X);
      assert.deepEqual(title, 'SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = rules.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'SU…');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = rules.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'abcdefghijkl', type: 'quantitative'}
          },
          config: {
            cell: {width: 60}
          }
        }), X);
      assert.deepEqual(title, 'abcdefghi…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      const title = rules.title(parseUnitModel({
        height: 60,
        mark: "point",
        encoding: {
          y: {field: 'abcdefghijkl', type: 'quantitative'}
        }
      }), Y);
      assert.deepEqual(title, 'abcdefghi…');
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = rules.values(parseModel({
        mark: "point",
        encoding: {
          y: {field: 'a', type: 'temporal', axis: {values: [{year: 1970}, {year: 1980}]}}
        }
      }), Y);

      assert.deepEqual(values, [
        new Date(1970, 0, 1).getTime(),
        new Date(1980, 0, 1).getTime()
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = rules.values(parseModel({
        mark: "point",
        encoding: {
          y: {field: 'a', type: 'quantitative', axis: {values: [1,2,3,4]}}
        }
      }), Y);

      assert.deepEqual(values, [1,2,3,4]);
    });
  });
});
